// Sync status hook
import { useState, useEffect } from 'react';
import { syncManager } from '@/lib/syncManager';
import { useOnlineStatus } from './useOnlineStatus';

export function useSync() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const isOnline = useOnlineStatus();

  const updatePendingCount = async () => {
    const count = await syncManager.getPendingCount();
    setPendingCount(count);
  };

  const triggerSync = async () => {
    if (!isOnline) return;
    
    setIsSyncing(true);
    try {
      await syncManager.processSyncQueue();
      await updatePendingCount();
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    updatePendingCount();

    const unsubscribe = syncManager.onSyncStateChange(() => {
      updatePendingCount();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      triggerSync();
    }
  }, [isOnline]);

  return {
    pendingCount,
    isSyncing,
    isOnline,
    triggerSync,
  };
}
