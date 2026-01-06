export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered successfully:', registration);
          
          // The service worker will handle background sync automatically
          // when the browser detects the device comes back online
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data && event.data.type === 'SYNC_COMPLETE') {
        console.log('Background sync completed');
        window.dispatchEvent(new Event('sync-complete'));
      }
    });
  }
}
