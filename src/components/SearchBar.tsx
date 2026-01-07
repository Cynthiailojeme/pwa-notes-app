"use client";

import { Search, X, SlidersHorizontal, Calendar, Clock } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: "created" | "modified" | "title";
  onSortChange: (sort: "created" | "modified" | "title") => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
}: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search notes by title or content..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-20 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        
        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md transition-colors ${
            showFilters ? "bg-green-100 text-primary" : "hover:bg-gray-100 text-gray-500"
          }`}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-slideDown">
          <div className="flex flex-wrap items-center gap-4">
            {/* Sort By Label */}
            <span className="text-sm font-medium text-gray-700">Sort by:</span>

            {/* Sort Options */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onSortChange("created")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  sortBy === "created"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Calendar className="w-4 h-4" />
                Created
              </button>

              <button
                onClick={() => onSortChange("modified")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  sortBy === "modified"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Clock className="w-4 h-4" />
                Modified
              </button>

              <button
                onClick={() => onSortChange("title")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  sortBy === "title"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                A→Z
              </button>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300" />

            {/* Sort Order */}
            <div className="flex gap-2">
              <button
                onClick={() => onSortOrderChange("desc")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  sortOrder === "desc"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Newest first
              </button>

              <button
                onClick={() => onSortOrderChange("asc")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  sortOrder === "asc"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Oldest first
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Search Indicator */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            Searching for: <strong>{searchQuery}</strong>
          </span>
          <button
            onClick={() => onSearchChange("")}
            className="text-primary hover:text-primary-hover font-medium"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
