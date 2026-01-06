"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Note } from "@/lib/types";
import { useNotes } from "@/hooks/useNotes";
import { initDB } from "@/lib/indexedDB";
import { syncManager } from "@/lib/syncManager";
import NoteList from "@/components/NoteList";
import NoteForm from "@/components/NoteForm";
import SyncStatus from "@/components/SyncStatus";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { registerServiceWorker } from "@/lib/serviceWorkerRegistration";
import ViewNote from "@/components/ViewNote";

export default function Home() {
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes();
  const [showForm, setShowForm] = useState(false);
  const [viewNote, setViewNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [deletingNote, setDeletingNote] = useState<Note | undefined>();

  useEffect(() => {
    // Initialize IndexedDB
    initDB().catch(console.error);

    // Register service worker
    registerServiceWorker();

    // Initial sync if online
    if (navigator.onLine) {
      syncManager.fetchAndMergeNotes().catch(console.error);
    }
  }, []);

  const handleSave = async (title: string, content: string) => {
    if (editingNote) {
      await updateNote(editingNote.id, { title, content });
    } else {
      await createNote(title, content);
    }
  };

  const handleView = (note: Note) => {
    setEditingNote(note);
    setViewNote(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setDeletingNote(note);
    }
  };

  const confirmDelete = async () => {
    if (deletingNote) {
      await deleteNote(deletingNote.id);
      setDeletingNote(undefined);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setViewNote(false);
    setEditingNote(undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
            <p className="text-gray-600 mt-1">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>New Note</span>
          </button>
        </div>

        {/* Sync Status */}
        <div className="mb-6">
          <SyncStatus />
        </div>

        {/* Notes List */}
        <NoteList
          notes={notes}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* View Note Modal */}
        {viewNote && (
          <ViewNote
            note={editingNote}
            onCancel={handleCloseForm}
          />
        )}

        {/* Note Form Modal */}
        {showForm && (
          <NoteForm
            note={editingNote}
            onSave={handleSave}
            onCancel={handleCloseForm}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deletingNote && (
          <DeleteConfirmModal
            noteTitle={deletingNote.title}
            onConfirm={confirmDelete}
            onCancel={() => setDeletingNote(undefined)}
          />
        )}
      </div>
    </main>
  );
}
