// Service worker mínimo: solo habilita la instalación como app (PWA).
// NO cachea nada a propósito, para que siempre cargue la última versión desde GitHub Pages
// y evitar problemas de versiones viejas pegadas.

self.addEventListener('install', function(e){
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(e){
  // Pasar todas las peticiones directo a la red (sin caché)
  e.respondWith(fetch(e.request).catch(function(){
    return new Response('Sin conexión', {status: 503, statusText: 'Sin conexión'});
  }));
});
