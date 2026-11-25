// LingoNest Offline-First PWA Service Worker
// Network-first for HTML/manifest, Cache-first for immutable hashed assets & .vpak neural voice clips!
const SHELL_CACHE = 'lingonest-shell-v2';
const AUDIO_CACHE = 'lingonest-audio-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      cache.addAll(['./', './index.html', './manifest.webmanifest', './icon.svg']).catch(() => {}),
    ),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL_CACHE && k !== AUDIO_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Cache-first for immutable neural .vpak audio & hashed JS/CSS assets
  if (url.pathname.endsWith('.vpak') || url.pathname.includes('/assets/')) {
    const cacheName = url.pathname.endsWith('.vpak') ? AUDIO_CACHE : SHELL_CACHE;
    event.respondWith(
      caches.open(cacheName).then((cache) =>
        cache.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req).then((resp) => {
            if (resp.ok) cache.put(req, resp.clone());
            return resp;
          });
        }),
      ),
    );
    return;
  }

  // Network-first with offline fallback for index.html and manifest.json
  event.respondWith(
    fetch(req)
      .then((resp) => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(req, clone));
        }
        return resp;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('./index.html'))),
  );
});
