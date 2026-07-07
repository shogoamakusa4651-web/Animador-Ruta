// Service worker mínimo: NO cachea, y además fuerza a saltarse la caché HTTP del navegador
// para que styles.css / js / index.html siempre sean la última versión desde GitHub Pages.

self.addEventListener('install', function(e){
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  // Solo para peticiones GET del mismo origen (nuestros archivos): pedir SIEMPRE fresco a la red,
  // saltando la caché HTTP del navegador (cache:'no-store'). Así una nueva versión de CSS/JS entra al instante.
  try {
    var url = new URL(req.url);
    if (req.method === 'GET' && url.origin === self.location.origin) {
      e.respondWith(
        fetch(req, { cache: 'no-store' }).catch(function(){
          return fetch(req).catch(function(){
            return new Response('Sin conexión', { status: 503, statusText: 'Sin conexión' });
          });
        })
      );
      return;
    }
  } catch (err) {}
  // Todo lo demás (Firebase, tiles, fuentes): directo a la red normal.
  e.respondWith(fetch(req).catch(function(){
    return new Response('Sin conexión', { status: 503, statusText: 'Sin conexión' });
  }));
});
