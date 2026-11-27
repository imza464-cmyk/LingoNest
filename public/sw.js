// LingoNest Offline-First PWA Service Worker v5
// Fixes P0-4: Precaches audio/manifest.json, never returns HTML for JSON/vpak, catches offline errors cleanly.
const SHELL_CACHE = 'lingonest-shell-v5';
const AUDIO_CACHE = 'lingonest-audio-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      Promise.allSettled(
        ['./', './index.html', './manifest.webmanifest', './icon.svg', './audio/manifest.json'].map(
          (url) => cache.add(url),
        ),
      ),
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
          return fetch(req)
            .then((resp) => {
              if (resp.ok) cache.put(req, resp.clone());
              return resp;
            })
            .catch(() => new Response('', { status: 503, statusText: 'Offline' }));
        }),
      ),
    );
    return;
  }

  // Network-first for JSON (audio/manifest.json, manifest.webmanifest) — NEVER return HTML on failure!
  if (url.pathname.endsWith('.json') || url.pathname.endsWith('.webmanifest')) {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          if (resp.ok) {
            const clone = resp.clone();
            caches.open(SHELL_CACHE).then((c) => c.put(req, clone));
          }
          return resp;
        })
        .catch(() =>
          caches.match(req).then((r) => r || new Response('{}', { status: 503, headers: { 'Content-Type': 'application/json' } })),
        ),
    );
    return;
  }

  // Navigation & HTML shell: network-first with cached index.html fallback
  event.respondWith(
    fetch(req)
      .then((resp) => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(req, clone));
        }
        return resp;
      })
      .catch(() =>
        caches.match(req).then((r) => {
          if (r) return r;
          if (req.mode === 'navigate') return caches.match('./index.html');
          return new Response('', { status: 503 });
        }),
      ),
  );
});
