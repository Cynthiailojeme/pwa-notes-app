# PWA Notes App - Offline-First Note Taking

An offline-first Progressive Web App for note-taking built with Next.js, TypeScript, and Supabase.

## Features

- ✅ Fully functional offline
- ✅ Automatic sync when online
- ✅ Background sync support
- ✅ IndexedDB for persistent storage
- ✅ Service Worker caching
- ✅ Responsive design
- ✅ Real-time sync status
- ✅ Conflict resolution (Last Write Wins)
- ✅ Filters - search and sort options

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Backend:** Supabase
- **Storage:** IndexedDB (via idb)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## Installation

```
npm install
```

## Configuration

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_USER_ID=your-email@example.com
```

## Development

```
npm run dev
```

## Testing Offline Mode

1. Open DevTools (F12)
2. Go to Network tab
3. Select "Offline" from dropdown
4. Create/edit/delete notes
5. Go back online and watch sync

## Deployment

Deployed on Vercel: [[pwa-notes-app](https://pwa-notes-app-ci.vercel.app/)]

## Conflict Resolution Strategy

**Last Write Wins (LWW):** When conflicts occur between local and server data, the note with the most recent `modified_at` timestamp is kept. This ensures users always see their most recent changes.

## Architecture

- **Service Worker:** Caches assets and API responses
- **IndexedDB:** Stores notes locally with sync queue
- **Sync Manager:** Handles bidirectional sync
- **Background Sync API:** Retries failed operations
