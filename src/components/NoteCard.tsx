// Individual note display component
"use client";

import { Note } from "@/lib/types";
import { Edit, Trash2, Clock, Calendar, Eye } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useState } from "react";

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
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const getSyncStatusColor = () => {
    switch (note._syncStatus) {
      case "synced":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "syncing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSyncStatusText = () => {
    switch (note._syncStatus) {
      case "synced":
        return "Saved";
      case "pending":
        return "Pending";
      case "syncing":
        return "Syncing";
      case "failed":
        return "Failed";
      default:
        return note._syncStatus;
    }
  };

  const wasModified = note.created_at !== note.modified_at;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-200 hover:border-green-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 line-clamp-1 group-hover:text-green-600 transition-colors">
          {note.title}
        </h3>

        {/* Sync Status Badge - with text label */}
        {note._syncStatus && note._syncStatus !== "synced" && (
          <span
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border capitalize ${getSyncStatusColor()}`}
          >
            {note._syncStatus === "syncing" && (
              <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
            )}
            {getSyncStatusText()}
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10 leading-relaxed">
        {note.content}
      </p>

      {/* Footer */}
      <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
        {/* Timestamps - Horizontal Layout */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {/* Created */}
          <div
            className="flex items-center gap-1.5 hover:text-gray-700 transition-colors"
            title={`Created: ${format(new Date(note.created_at), "PPpp")}`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {formatDistanceToNow(new Date(note.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Modified - only if different */}
          {wasModified && (
            <div
              className="flex items-center gap-1.5 text-primary hover:text-primary-hover transition-colors"
              title={`Modified: ${format(new Date(note.modified_at), "PPpp")}`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                Edited{" "}
                {formatDistanceToNow(new Date(note.modified_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          )}
        </div>

        {/* Actions with ripple effect */}
        <div className="flex items-center justify-end gap-2">
          {/* View Button */}
          <button
            onClick={() => onView(note)}
            className="relative overflow-hidden p-2.5 hover:bg-green-50 rounded-md transition-all duration-200 hover:scale-110 active:scale-95 group/btn"
            title="View note"
            aria-label="View note"
          >
            <Eye className="w-4 h-4 text-gray-600 group-hover/btn:text-green-600 transition-colors" />
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(note)}
            className="relative overflow-hidden p-2.5 hover:bg-green-50 rounded-md transition-all duration-200 hover:scale-110 active:scale-95 group/btn"
            title="Edit note"
            aria-label="Edit note"
          >
            <Edit className="w-4 h-4 text-gray-600 group-hover/btn:text-green-600 transition-colors" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(note.id)}
            className="relative overflow-hidden p-2.5 hover:bg-red-50 rounded-md transition-all duration-200 hover:scale-110 active:scale-95 group/btn"
            title="Delete note"
            aria-label="Delete note"
          >
            <Trash2 className="w-4 h-4 text-gray-600 group-hover/btn:text-red-600 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
