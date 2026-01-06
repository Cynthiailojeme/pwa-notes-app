export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  modified_at: string;
  // Local-only fields
  _localId?: string;
  _syncStatus?: 'synced' | 'pending' | 'syncing' | 'failed';
  _pendingAction?: 'create' | 'update' | 'delete';
  _isDeleted?: boolean;
}

export interface SyncOperation {
  id: string;
  noteId: string;
  action: 'create' | 'update' | 'delete';
  data: Partial<Note>;
  timestamp: number;
  retryCount: number;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';