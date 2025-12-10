const VERSION_APP = 3;
const CACHE_NAME = `fastshark-cache-v${VERSION_APP}`;

const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
  '/favicon.ico'
];

// ---- INSTALL ----
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// ---- ACTIVATE ----
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// ---- FETCH ----
self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {

      const cached = await cache.match(event.request);
      if (cached) return cached;

      try {
        const response = await fetch(event.request);
        if (response && response.status === 200) {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        return cache.match('/index.html');
      }

    })
  );
});

// ---- UPDATE ----
self.addEventListener('message', async event => {
  if (event.data?.type === 'UPDATE_CACHE') {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));

    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);

    console.log('✅ Cache updated');
  }
});