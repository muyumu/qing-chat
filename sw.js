const CACHE_NAME = 'qing-v3';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((name) => { if (name !== CACHE_NAME) return caches.delete(name); }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // 不缓存 DeepSeek API 请求
  if (e.request.url.includes('api.deepseek.com')) return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});