// Grid of notes
"use client";

import { Note } from "@/lib/types";
import NoteCard from "./NoteCard";
import { FileText, Search } from "lucide-react";

interface NoteListProps {
  notes: Note[];
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  searchQuery?: string;
}

export default function NoteList({
  notes,
  onView,
  onEdit,
  onDelete,
  searchQuery = "",
}: NoteListProps) {
  // Empty state when no notes at all
  if (notes.length === 0 && !searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <FileText className="w-20 h-20 mb-4 text-gray-300" />
        <p className="text-lg font-medium mb-2">No notes yet</p>
        <p className="text-sm text-gray-400">
          Click the &quot;New Note&quot; button above to create your first note
        </p>
      </div>
    );
  }

  // Empty state when search returns no results
  if (notes.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Search className="w-20 h-20 mb-4 text-gray-300" />
        <p className="text-lg font-medium mb-2">No notes found</p>
        <p className="text-sm text-gray-400">
          Try searching with different keywords
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
      {notes.map((note, index) => (
        <div
          key={note.id}
          className="animate-slideUp"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <NoteCard
            note={note}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
