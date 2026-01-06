import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Note, SyncOperation } from './types';

interface NotesDB extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: { 'by-modified': string };
  };
  syncQueue: {
    key: string;
    value: SyncOperation;
    indexes: { 'by-timestamp': number };
  };
}

let dbInstance: IDBPDatabase<NotesDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<NotesDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<NotesDB>('NotesAppDB', 1, {
    upgrade(db) {
      // Notes store
      if (!db.objectStoreNames.contains('notes')) {
        const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
        notesStore.createIndex('by-modified', 'modified_at');
      }

      // Sync queue store
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
        syncStore.createIndex('by-timestamp', 'timestamp');
      }
    },
  });

  return dbInstance;
}

// Notes Operations
export async function getAllNotes(): Promise<Note[]> {
  const db = await initDB();
  const notes = await db.getAll('notes');
  return notes
    .filter(note => !note._isDeleted)
    .sort((a, b) => 
      new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime()
    );
}

export async function getNote(id: string): Promise<Note | undefined> {
  const db = await initDB();
  return db.get('notes', id);
}

export async function saveNote(note: Note): Promise<void> {
  const db = await initDB();
  await db.put('notes', note);
}

export async function deleteNote(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('notes', id);
}

// Sync Queue Operations
export async function addToSyncQueue(operation: SyncOperation): Promise<void> {
  const db = await initDB();
  await db.put('syncQueue', operation);
}

export async function getSyncQueue(): Promise<SyncOperation[]> {
  const db = await initDB();
  return db.getAll('syncQueue');
}

export async function removeFromSyncQueue(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('syncQueue', id);
}

export async function clearSyncQueue(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('syncQueue', 'readwrite');
  await tx.store.clear();
  await tx.done;
}
