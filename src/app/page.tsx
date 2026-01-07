"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { Note } from "@/lib/types";
import { useNotes } from "@/hooks/useNotes";
import { initDB } from "@/lib/indexedDB";
import { syncManager } from "@/lib/syncManager";
import NoteList from "@/components/NoteList";
import NoteForm from "@/components/NoteForm";
import SyncStatus from "@/components/SyncStatus";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import SearchBar from "@/components/SearchBar";
import SkeletonLoader from "@/components/SkeletonLoader";
import { registerServiceWorker } from "@/lib/serviceWorkerRegistration";
import ViewNote from "@/components/ViewNote";

export default function Home() {
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes();
  const [showForm, setShowForm] = useState(false);
  const [viewNote, setViewNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [deletingNote, setDeletingNote] = useState<Note | undefined>();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "modified" | "title">(
    "modified"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "created":
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "modified":
          comparison =
            new Date(a.modified_at).getTime() -
            new Date(b.modified_at).getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [notes, searchQuery, sortBy, sortOrder]);

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

  const handleNewNote = () => {
    setEditingNote(undefined);
    setShowForm(true);
  };

  // Show skeleton loader during initial load
  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
            <p className="text-gray-600 mt-1">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
              {searchQuery &&
                filteredAndSortedNotes.length !== notes.length && (
                  <span className="text-green-600">
                    {" "}
                    ({filteredAndSortedNotes.length} matching)
                  </span>
                )}
            </p>
          </div>

          {/* New Note Button */}
          <button
            onClick={handleNewNote}
            className="relative overflow-hidden flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover active:scale-95 transition-all duration-150 shadow-md hover:shadow-lg group"
            aria-label="Create new note"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden lg:flex font-medium">New Note</span>
            <div className="absolute inset-0 bg-white/20 transform scale-0 group-hover:scale-100 rounded-lg transition-transform duration-300" />
          </button>
        </div>

        {/* Sync Status */}
        <div className="mb-6">
          <SyncStatus />
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        </div>

        {/* Notes List */}
        <NoteList
          notes={filteredAndSortedNotes}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchQuery={searchQuery}
        />

        {/* View Note Modal */}
        {viewNote && <ViewNote note={editingNote} onCancel={handleCloseForm} />}

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
