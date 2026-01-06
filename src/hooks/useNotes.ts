// Notes management hook
import { useState } from 'react';
import { Note } from '@/lib/types';
import { getAllNotes } from '@/lib/indexedDB';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshNotes = async () => {
    try {
      const allNotes = await getAllNotes();
      setNotes(allNotes);
      setError(null);
    } catch (err) {
      setError('Failed to load notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (title: string, content: string) => {
    try {
      await refreshNotes();
    } catch (err) {
      console.error('Failed to create note:', err);
      throw err;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      await refreshNotes();
    } catch (err) {
      console.error('Failed to update note:', err);
      throw err;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await refreshNotes();
    } catch (err) {
      console.error('Failed to delete note:', err);
      throw err;
    }
  };

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refreshNotes,
  };
}
