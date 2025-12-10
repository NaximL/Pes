const VERSION_APP = 3;
const CACHE_NAME = `fastshark-cache-v${VERSION_APP}`;

const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
  '/favicon.ico'
];

// ---------------- INSTALL ----------------
self.addEventListener('install', event => {
  console.log('📦 SW install');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// ---------------- ACTIVATE ----------------
self.addEventListener('activate', event => {
  console.log('⚙️ SW activate');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(name => name !== CACHE_NAME)
            .map(name => {
              console.log('🗑️ delete cache:', name);
              return caches.delete(name);
            })
      )
    )
  );
  self.clients.claim();
});

// ---------------- FETCH ----------------
self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // ✅ ВСЕГДА ИЗ СЕТИ ДЛЯ ESP
  if (url.startsWith('http://192.168.4.1')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // ✅ КЭШ ТОЛЬКО СВОЕГО САЙТА
  if (!url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {

      const cached = await cache.match(event.request);
      if (cached) {
        return cached;
      }

      try {
        const response = await fetch(event.request);
        if (response && response.status === 200) {
          await cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        return cache.match('/index.html');
      }

    })
  );
});

// ---------------- UPDATE MESSAGES ----------------
self.addEventListener('message', async event => {

  if (event.data?.type === 'UPDATE_CACHE') {

    console.log('♻ updating cache...');

    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));

    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);

    console.log('✅ cache updated');
  }
});