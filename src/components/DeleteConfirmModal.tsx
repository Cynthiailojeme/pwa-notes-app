// Delete Confirmation Modal
"use client";

import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  noteTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  noteTitle,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Delete Note
            </h3>
            <p className="text-base text-gray-500 mb-4">
              Are you sure you want to delete &quot;{noteTitle}&quot;? This
              action cannot be undone.
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={onConfirm}
                className="cursor-pointer flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={onCancel}
                className="cursor-pointer flex-1 px-4 py-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
