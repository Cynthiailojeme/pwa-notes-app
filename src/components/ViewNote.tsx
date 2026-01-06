"use client";

import { Note } from "@/lib/types";
import { X, Calendar, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface ViewNoteProps {
  note?: Note;
  onCancel: () => void;
}

export default function ViewNote({ note, onCancel }: ViewNoteProps) {
  if (!note) return null;

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

  const wasModified = note.created_at !== note.modified_at;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{note.title}</h2>
            <button
              onClick={onCancel}
              className="w-fit p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {note._syncStatus && (
            <span
              className={`mt-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getSyncStatusColor()}`}
            >
              {note._syncStatus}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(75vh-220px)]">
          {/* Note Content */}
          <div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {note.content}
            </p>
          </div>

          {/* Timestamps */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            {/* Created */}
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Created
                </p>
                <p className="text-sm text-gray-800">
                  {format(new Date(note.created_at), "PPP 'at' p")}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDistanceToNow(new Date(note.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            {/* Modified */}
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Last Modified
                </p>
                {wasModified ? (
                  <>
                    <p className="text-sm text-gray-800">
                      {format(new Date(note.modified_at), "PPP 'at' p")}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDistanceToNow(new Date(note.modified_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Not modified yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sync Status */}
          {note._syncStatus && note._syncStatus !== "synced" && (
            <div className="pt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                Status: {note._syncStatus}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
