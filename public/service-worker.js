const CACHE_NAME = 'pwa-notes-v1';
const urlsToCache = [
  '/',
  '/offline.html',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests differently
  if (url.origin.includes('supabase.co')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached response if available
          return caches.match(request);
        })
    );
    return;
  }

  // Handle app resources
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fall back to cache
        return caches.match(request).then((cached) => {
          return cached || caches.match('/offline.html');
        });
      })
  );
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-notes') {
    event.waitUntil(
      syncNotes().then(() => {
        // Notify all clients that sync is complete
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'SYNC_COMPLETE' });
          });
        });
      })
    );
  }
});

async function syncNotes() {
  try {
    // Open IndexedDB
    const db = await openDatabase();
    const tx = db.transaction('syncQueue', 'readonly');
    const store = tx.objectStore('syncQueue');
    const queue = await store.getAll();

    // Process each operation
    for (const operation of queue) {
      await executeOperation(operation);
      // Remove from queue after successful sync
      const deleteTx = db.transaction('syncQueue', 'readwrite');
      await deleteTx.objectStore('syncQueue').delete(operation.id);
    }

    return true;
  } catch (error) {
    console.error('Background sync failed:', error);
    throw error;
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NotesAppDB', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function executeOperation(operation) {
  const baseUrl = 'https://scwaxiuduzyziuyjfwda.supabase.co/rest/v1';
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjd2F4aXVkdXp5eml1eWpmd2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTk0NTUsImV4cCI6MjA4MjY5NTQ1NX0.W7LMDb-a_bN153TyJgNU0zpT8O6jPIC8ysfOOHSe0h0';

  const headers = {
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  };

  switch (operation.action) {
    case 'create':
      await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(operation.data),
      });
      break;
    case 'update':
      await fetch(`${baseUrl}/notes?id=eq.${operation.noteId}&user_id=eq.${operation.data.user_id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(operation.data),
      });
      break;
    case 'delete':
      await fetch(`${baseUrl}/notes?id=eq.${operation.noteId}&user_id=eq.${operation.data.user_id}`, {
        method: 'DELETE',
        headers,
      });
      break;
  }
}
