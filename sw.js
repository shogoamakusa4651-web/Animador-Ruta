// Service worker mínimo: NO cachea, y además fuerza a saltarse la caché HTTP del navegador
// para que styles.css / js / index.html siempre sean la última versión desde GitHub Pages.

// PNG transparente 1x1 (para imágenes del mapa que no se pudieron cargar sin señal)
var PNG_VACIO = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='), function(c){ return c.charCodeAt(0); });

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
  // Mapa del CHOFER (?c=1): primero lo guardado en el celular (sirve sin señal); si no está, internet;
  // si tampoco hay internet, imagen transparente (nunca un cuadro negro). El resto del mapa no pasa por aquí.
  try {
    var u2 = new URL(req.url);
    if (req.method === 'GET' && /(^|\.)arcgisonline\.com$/.test(u2.hostname) && u2.searchParams.get('c') === '1') {
      e.respondWith(caches.match(req.url).then(function(hit){
        return hit || fetch(req).catch(function(){ return new Response(PNG_VACIO, { status: 200, headers: { 'Content-Type': 'image/png' } }); });
      }));
      return;
    }
  } catch (err2) {}
  // Todo lo demás (imágenes del mapa, Firebase, fuentes): NO se intercepta. El navegador lo baja directo
  // con su propio caché y conexiones en paralelo. (Antes pasaba por aquí: más lento, y un fallo devolvía
  // 'Sin conexión' → cuadros negros en el mapa.)
});
