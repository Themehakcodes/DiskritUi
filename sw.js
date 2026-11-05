/**
 * DISKRIT PWA SERVICE WORKER
 * Provides offline caching, background sync preparation, and instant load capability
 */

const CACHE_NAME = 'diskrit-pwa-v4';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  
  // Core Styles
  './css/tokens.css',
  './css/reset.css',
  './css/global.css',
  './css/layout.css',
  './css/components.css',
  './css/themes.css',
  './css/responsive.css',
  
  // Page Styles
  './css/pages/feed.css',
  './css/pages/shorts.css',
  './css/pages/profile.css',
  './css/pages/chat.css',
  './css/pages/settings.css',
  './css/pages/admin.css',
  './css/pages/auth.css',
  
  // Core Scripts
  './js/storage.js',
  './js/theme.js',
  './js/icons.js',
  './js/mock-data.js',
  './js/router.js',
  './js/pwa.js',
  './js/app.js',
  
  // Component Scripts
  './js/components/navbar.js',
  './js/components/sidebar.js',
  './js/components/composer.js',
  './js/components/post-card.js',
  './js/components/masonry.js',
  './js/components/share-modal.js',
  './js/components/modals.js',
  
  // Page Scripts
  './js/pages/home.js',
  './js/pages/shorts.js',
  './js/pages/profile.js',
  './js/pages/chat.js',
  './js/pages/settings.js',
  './js/pages/friends.js',
  './js/pages/search.js',
  './js/pages/saved.js',
  './js/pages/notifications.js',
  './js/pages/creator.js',
  './js/pages/admin.js',
  './js/pages/auth.js',
  './js/pages/errors.js',
  './js/pages/legal.js',
  './js/pages/post-detail.js',
  
  // Brand Assets & Favicons
  './assets/images/logo.png',
  './assets/icons/favicon.ico',
  './assets/icons/favicon-32.png',
  './assets/icons/favicon-64.png',
  './assets/icons/favicon-192.png',
  './assets/icons/favicon-512.png',
  './assets/icons/maskable-icon-512.png'
];

// Install: pre-cache static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate: cleanup all older caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Diskrit SW] Deleting legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First for local assets so updates are immediate, Cache-First for external media
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests and browser extensions
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Handle video streams / range requests directly
  if (request.headers.has('range')) {
    return;
  }

  // Navigation requests (HTML document loads)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('./index.html') || caches.match('/');
      })
    );
    return;
  }

  // Same-origin local static assets (JS, CSS, HTML): Network-First
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback
        return caches.match(request);
      })
    );
    return;
  }

  // External media & images: Cache with network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback for missing offline image
        return new Response('', { status: 408, headers: { 'Content-Type': 'text/plain' } });
      });
    })
  );
});
