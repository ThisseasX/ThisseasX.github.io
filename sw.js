const CACHE_NAME = 'thisseasx-cv-page';
const CACHE_VERSION = 1;
const CACHE = `${CACHE_NAME}-v${CACHE_VERSION}`;

const ASSETS = [
  '/',
  `/index.html?${CACHE}`,
  '/manifest.webmanifest',

  '/styles/fonts.css',
  '/styles/main.css',
  '/styles/reset.css',

  '/scripts/collapse.js',
  '/scripts/skills.js',
  '/registerSW.js',

  '/icons/apple-touch-icon.png',
  '/icons/favicon.ico',
  '/icons/icon-192-maskable.png',
  '/icons/icon-192.png',
  '/icons/icon-512-maskable.png',
  '/icons/icon-512.png',
  '/icons/disc.svg',
  '/icons/plus.svg',

  '/images/avatar-thumbnail.webp',

  '/fonts/OpenSans-VariableFont_wdth,wght.ttf',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);

      try {
        await cache.addAll(ASSETS);
      } catch (err) {
        // Most likely offline
        console.error(err);
      }
    })(),
  );

  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();

      await Promise.all(
        cacheKeys
          .filter((cache) => cache !== CACHE)
          .map((cache) => caches.delete(cache)),
      );
    })(),
  );

  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    (async () => {
      try {
        const response = await caches.match(e.request);

        return response || fetch(e.request);
      } catch (err) {
        // Most likely unable to find asset in cache
        console.error(err);
      }
    })(),
  );
});
