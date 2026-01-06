// Sync indicator
'use client';

import { useSync } from '@/hooks/useSync';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

export default function SyncStatus() {
  const { isOnline, isSyncing, pendingCount, triggerSync } = useSync();

  return (
    <div className="w-fit flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-sm border">
      {/* Online Status */}
      <div className="flex items-center gap-2">
        {isOnline ? (
          <Cloud className="w-5 h-5 text-green-500" />
        ) : (
          <CloudOff className="w-5 h-5 text-gray-400" />
        )}
        <span className="text-sm font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Pending Count */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-md">
          <span className="text-sm text-amber-700">
            {pendingCount} pending
          </span>
        </div>
      )}

      {/* Sync Button */}
      {isOnline && pendingCount > 0 && (
        <button
          onClick={triggerSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-3 py-1 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="text-sm">Sync</span>
        </button>
      )}

      {/* Syncing Indicator */}
      {isSyncing && (
        <span className="text-sm text-gray-500">Syncing...</span>
      )}
    </div>
  );
}
