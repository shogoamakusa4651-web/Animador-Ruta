/* Animador de Ruta · Service Worker v1 */
const CACHE = 'ar-shell-v1';
const TILES = 'ar-tiles-v1';
const CORE = [
  './',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont/dist/tabler-icons.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js',
  'https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/12.13.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/12.13.0/firebase-database-compat.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.all(CORE.map(u => c.add(u).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE && k !== TILES).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Firebase (datos en vivo, auth): SIEMPRE directo a la red, sin tocar
  if (url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('firebase') ||
      url.hostname.includes('gstatic.com') && url.pathname.includes('recaptcha')) {
    return;
  }

  // La página: red primero (para recibir actualizaciones), caché si no hay señal
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('./', copy));
        return res;
      }).catch(() => caches.match('./'))
    );
    return;
  }

  // Tiles del mapa: caché primero, se actualizan en segundo plano
  if (url.hostname === 'tile.openstreetmap.org' || url.hostname === 'server.arcgisonline.com') {
    e.respondWith(
      caches.open(TILES).then(c =>
        c.match(req).then(hit => {
          const net = fetch(req).then(res => { if (res && res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; }).catch(() => null);
          return hit || net.then(r => r || new Response('', { status: 408 }));
        })
      )
    );
    return;
  }

  // Librerías y fuentes (CDN): caché primero
  if (url.hostname === 'cdnjs.cloudflare.com' || url.hostname === 'cdn.jsdelivr.net' || url.hostname === 'www.gstatic.com') {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }))
    );
    return;
  }

  // Resto (iconos, manifest): caché con respaldo de red
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => hit))
  );
});
