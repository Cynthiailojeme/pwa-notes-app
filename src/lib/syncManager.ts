import { v4 as uuidv4 } from 'uuid';
import { Note, SyncOperation } from './types';
import { supabase, USER_ID } from './supabase';
import {
  getAllNotes,
  saveNote,
  deleteNote as deleteNoteDB,
  addToSyncQueue,
  getSyncQueue,
  removeFromSyncQueue,
} from './indexedDB';

export class SyncManager {
  private isSyncing = false;
  private syncListeners: Set<() => void> = new Set();

  onSyncStateChange(listener: () => void) {
    this.syncListeners.add(listener);
    return () => this.syncListeners.delete(listener);
  }

  private notifyListeners() {
    this.syncListeners.forEach(listener => listener());
  }

  // Fetch all notes from server and merge with local
  async fetchAndMergeNotes(): Promise<void> {
    try {
      const { data: serverNotes, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', USER_ID)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const localNotes = await getAllNotes();
      
      // Merge logic: Last Write Wins based on modified_at
      const mergedNotes = this.mergeNotes(localNotes, serverNotes || []);

      // Save all merged notes to IndexedDB
      for (const note of mergedNotes) {
        await saveNote({
          ...note,
          _syncStatus: 'synced',
          _pendingAction: undefined,
        });
      }

      this.notifyListeners();
    } catch (error) {
      console.error('Error fetching notes from server:', error);
      throw error;
    }
  }

  private mergeNotes(localNotes: Note[], serverNotes: Note[]): Note[] {
    const noteMap = new Map<string, Note>();

    // Add server notes first
    serverNotes.forEach(note => {
      noteMap.set(note.id, note);
    });

    // Merge with local notes (Last Write Wins)
    localNotes.forEach(localNote => {
      const serverNote = noteMap.get(localNote.id);
      
      if (!serverNote) {
        // Local-only note (might be pending sync)
        noteMap.set(localNote.id, localNote);
      } else {
        // Compare timestamps - keep the most recent
        const localTime = new Date(localNote.modified_at).getTime();
        const serverTime = new Date(serverNote.modified_at).getTime();
        
        if (localTime > serverTime) {
          noteMap.set(localNote.id, localNote);
        }
      }
    });

    return Array.from(noteMap.values());
  }

  // Process sync queue
  async processSyncQueue(): Promise<void> {
    if (this.isSyncing) return;
    
    this.isSyncing = true;
    this.notifyListeners();

    try {
      const queue = await getSyncQueue();
      
      for (const operation of queue) {
        try {
          await this.executeOperation(operation);
          await removeFromSyncQueue(operation.id);
        } catch (error) {
          console.error('Failed to sync operation:', operation, error);
          // Keep in queue for retry
        }
      }

      // After processing queue, fetch latest from server
      await this.fetchAndMergeNotes();
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }
  }

  private async executeOperation(operation: SyncOperation): Promise<void> {
    switch (operation.action) {
      case 'create':
        await this.createNoteOnServer(operation.data as Note);
        break;
      case 'update':
        await this.updateNoteOnServer(operation.data as Note);
        break;
      case 'delete':
        await this.deleteNoteOnServer(operation.noteId);
        break;
    }
  }

  private async createNoteOnServer(note: Note): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .insert({
        id: note.id,
        user_id: USER_ID,
        title: note.title,
        content: note.content,
        created_at: note.created_at,
        modified_at: note.modified_at,
      });

    if (error) throw error;
  }

  private async updateNoteOnServer(note: Note): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .update({
        title: note.title,
        content: note.content,
        modified_at: note.modified_at,
      })
      .eq('id', note.id)
      .eq('user_id', USER_ID);

    if (error) throw error;
  }

  private async deleteNoteOnServer(noteId: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', USER_ID);

    if (error) throw error;
  }

  // Add note (works offline)
  async addNote(title: string, content: string): Promise<Note> {
    const now = new Date().toISOString();
    const note: Note = {
      id: uuidv4(),
      user_id: USER_ID,
      title,
      content,
      created_at: now,
      modified_at: now,
      _syncStatus: 'pending',
      _pendingAction: 'create',
    };

    await saveNote(note);

    // Queue for sync
    await addToSyncQueue({
      id: uuidv4(),
      noteId: note.id,
      action: 'create',
      data: note,
      timestamp: Date.now(),
      retryCount: 0,
    });

    this.notifyListeners();

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.processSyncQueue().catch(console.error);
    }

    return note;
  }

  // Update note (works offline)
  async updateNote(id: string, updates: Partial<Note>): Promise<void> {
    const existingNote = await getAllNotes().then(notes => 
      notes.find(n => n.id === id)
    );

    if (!existingNote) throw new Error('Note not found');

    const updatedNote: Note = {
      ...existingNote,
      ...updates,
      modified_at: new Date().toISOString(),
      _syncStatus: 'pending',
      _pendingAction: 'update',
    };

    await saveNote(updatedNote);

    // Queue for sync
    await addToSyncQueue({
      id: uuidv4(),
      noteId: id,
      action: 'update',
      data: updatedNote,
      timestamp: Date.now(),
      retryCount: 0,
    });

    this.notifyListeners();

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.processSyncQueue().catch(console.error);
    }
  }

  // Delete note (works offline)
  async deleteNote(id: string): Promise<void> {
    const note = await getAllNotes().then(notes => notes.find(n => n.id === id));
    
    if (!note) return;

    // Mark as deleted locally
    await saveNote({
      ...note,
      _isDeleted: true,
      _syncStatus: 'pending',
      _pendingAction: 'delete',
    });

    // Queue for sync
    await addToSyncQueue({
      id: uuidv4(),
      noteId: id,
      action: 'delete',
      data: note,
      timestamp: Date.now(),
      retryCount: 0,
    });

    this.notifyListeners();

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.processSyncQueue().catch(console.error);
    }
  }

  async getPendingCount(): Promise<number> {
    const queue = await getSyncQueue();
    return queue.length;
  }
}

export const syncManager = new SyncManager();