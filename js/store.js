/* ============================================================================
   ANIMADOR DE RUTA · store.js
   Estado central de la aplicación.
   Reemplaza progresivamente las variables globales sueltas por un único lugar
   ordenado, con suscripción a cambios. Se carga ANTES del script principal.

   Uso:
     Store.set('mgmtRutas', datos)       guarda y notifica
     Store.get('mgmtRutas')              lee
     Store.on('mgmtRutas', fn)           reacciona a cambios (devuelve función para cancelar)

   Compatibilidad: durante la migración, el script principal puede seguir usando
   sus variables; el store se adopta módulo por módulo, sin romper lo existente.
   ============================================================================ */
(function(g){
  'use strict';

  const _data={};
  const _subs={};   // clave -> [callbacks]

  function get(key){ return _data[key]; }

  function set(key, value){
    _data[key]=value;
    const list=_subs[key];
    if(list){ for(let i=0;i<list.length;i++){ try{ list[i](value); }catch(e){ console.warn('store sub error:',key,e); } } }
    return value;
  }

  // Actualiza parcialmente un objeto (merge superficial) y notifica.
  function patch(key, partial){
    const cur=(_data[key] && typeof _data[key]==='object') ? _data[key] : {};
    return set(key, Object.assign({}, cur, partial));
  }

  // Suscribe a cambios de una clave. Devuelve función para cancelar.
  function on(key, fn){
    (_subs[key]||(_subs[key]=[])).push(fn);
    return function off(){ const l=_subs[key]; if(!l)return; const i=l.indexOf(fn); if(i>=0)l.splice(i,1); };
  }

  // Para depuración: ver todo el estado actual.
  function _dump(){ return JSON.parse(JSON.stringify(_data)); }

  g.Store={ get, set, patch, on, _dump };
})(window);
