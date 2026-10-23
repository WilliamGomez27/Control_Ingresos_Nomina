// Service Worker para Control de Ingresos Laborales PWA
// Estrategia: red primero (siempre trae la última versión con conexión) y copia guardada sin conexión.
const CACHE_NAME = 'mis-ingresos-v3';
const ASSETS = [
  './',
  './index.html',
  './Control%20de%20Ingresos_Talma.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      // Cada archivo por separado: si uno falla, los demás igual se guardan
      Promise.all(ASSETS.map(a => cache.add(a).catch(() => {})))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  // Solo interceptar peticiones de nuestro mismo origen (evita secuestrar APIs externas como GitHub Gist o WhatsApp)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request, { cache: 'no-cache' }).then(response => {
      if (response && response.status === 200 && response.type === 'basic') {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(() =>
      caches.match(event.request).then(cached => cached || caches.match('./index.html'))
    )
  );
});
