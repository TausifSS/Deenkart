/* DeenKart Service Worker v1.0.8 */

const CACHE_NAME = 'deenkart-v1.0.8';
const ASSETS = [
  './',
  './index.html',
  './admin.html',
  './manifest.json',
  './assets/css/app.bundle.css',
  './assets/css/variables.css',
  './assets/css/style.css',
  './assets/css/components.css',
  './assets/css/admin.css',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png',
  './assets/js/config.js',
  './assets/js/products-data.js',
  './assets/js/storage.js',
  './assets/js/whatsapp.js',
  './assets/js/cart.js',
  './assets/js/router.js',
  './assets/js/ui.js',
  './assets/js/app.js',
  './assets/js/admin.js',
  './assets/images/logo.png',
  './assets/images/logo-footer.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(err => console.warn("PWA cache prefetch notice:", err));
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Network first with cache fallback
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
