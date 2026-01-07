"use client";

export default function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-11 w-32 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Sync Status Skeleton */}
        <div className="mb-6">
          <div className="h-12 w-80 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Notes Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-5 border border-gray-200"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
              </div>

              {/* Card Content */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex justify-end gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
