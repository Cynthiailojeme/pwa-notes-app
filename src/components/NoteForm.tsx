// Create/edit note form
"use client";

import { useState, useEffect } from "react";
import { Note } from "@/lib/types";
import { X, Save } from "lucide-react";

interface NoteFormProps {
  note?: Note;
  onSave: (title: string, content: string) => Promise<void>;
  onCancel: () => void;
}

export default function NoteForm({ note, onSave, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {}
  );

  const validate = (): boolean => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.length > 5000) {
      newErrors.content = "Content must be 5000 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);
    try {
      await onSave(title.trim(), content.trim());
      onCancel();
    } catch (error) {
      console.error("Failed to save note:", error);
      alert("Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {note ? "Edit Note" : "Create Note"}
          </h2>
          <button
            onClick={onCancel}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              maxLength={100}
              className={`w-full px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 border rounded-md outline-none transition
                ${
                  errors.title
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                }
              `}
              placeholder="Enter note title..."
            />

            <div className="flex justify-between relative">
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
              <p className="text-gray-500 text-xs mt-1 absolute right-0">
                {title.length}/100 characters
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) {
                  setErrors((prev) => ({ ...prev, content: undefined }));
                }
              }}
              maxLength={5000}
              rows={10}
              className={`w-full px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 border rounded-md outline-none resize-none transition
                ${
                  errors.content
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                }
              `}
              placeholder="Write your note here..."
            />

            <div className="flex justify-between relative">
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content}</p>
              )}
              <p className="text-gray-500 text-xs mt-1 absolute right-0">
                {content.length}/5000 characters
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Note"}</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="cursor-pointer px-6 py-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
