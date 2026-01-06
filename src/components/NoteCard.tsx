// Individual note display component
"use client";

import { Note } from "@/lib/types";
import { Edit, Trash2, Clock, Calendar, Eye } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface NoteCardProps {
  note: Note;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteCard({
  note,
  onView,
  onEdit,
  onDelete,
}: NoteCardProps) {
  const getSyncStatusColor = () => {
    switch (note._syncStatus) {
      case "synced":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "syncing":
        return "bg-blue-100 text-blue-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const wasModified = note.created_at !== note.modified_at;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 line-clamp-1">
          {note.title}
        </h3>

        {/* Sync Status Badge */}
        {note._syncStatus && note._syncStatus !== "synced" && (
          <span
            className={`px-2 py-1 text-xs rounded-full capitalize ${getSyncStatusColor()}`}
          >
            {note._syncStatus}
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
        {note.content}
      </p>

      {/* Footer */}
      <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
        {/* Timestamps - Horizontal Layout */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {/* Created */}
          <div
            className="flex items-center gap-1"
            title={`Created: ${format(new Date(note.created_at), "PPpp")}`}
          >
            <Calendar className="w-3 h-3" />
            <span>
              {formatDistanceToNow(new Date(note.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Modified - only if different */}
          {wasModified && (
            <div
              className="flex items-center gap-1 text-primary"
              title={`Modified: ${format(new Date(note.modified_at), "PPpp")}`}
            >
              <Clock className="w-3 h-3" />
              <span>
                edited{" "}
                {formatDistanceToNow(new Date(note.modified_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onView(note)}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="View note"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onEdit(note)}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Edit note"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="cursor-pointer p-2 hover:bg-red-50 rounded-md transition-colors"
            title="Delete note"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
