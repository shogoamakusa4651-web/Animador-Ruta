/* ============================================================================
   ANIMADOR DE RUTA · auth.js
   Motor de cifrado de contraseñas (puro, sin estado ni DOM).
   - v2: PBKDF2 con 150.000 iteraciones (seguro).
   - v1: SHA-256 simple (legado) — solo para validar contraseñas antiguas.
   verifyPass detecta la versión automáticamente.
   Se carga ANTES del script principal; queda disponible globalmente.
   ============================================================================ */
(function(g){
  'use strict';
  const HASH_ITER=150000;

  // Genera SIEMPRE el formato nuevo (v2$...). La validación de los viejos la hace verifyPass.
  async function hashPass(pass, salt){
    salt=salt||'';
    const keyMaterial=await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), {name:'PBKDF2'}, false, ['deriveBits']);
    const bits=await crypto.subtle.deriveBits(
      {name:'PBKDF2', salt:new TextEncoder().encode(salt+'::animadorRutaV2'), iterations:HASH_ITER, hash:'SHA-256'},
      keyMaterial, 256);
    return 'v2$'+Array.from(new Uint8Array(bits)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  // Hash viejo (v1) — solo para validar contraseñas creadas antes de PBKDF2.
  async function hashPassV1(pass, salt){
    salt=salt||'';
    const data=new TextEncoder().encode(salt+'::'+pass+'::animadorRutaV1');
    const buf=await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  // Verifica una contraseña contra un hash almacenado, detectando su versión.
  async function verifyPass(pass, salt, stored){
    if(stored==null)return false;
    if(String(stored).indexOf('v2$')===0){ return (await hashPass(pass,salt))===stored; }
    return (await hashPassV1(pass,salt))===String(stored); // hash antiguo sin prefijo
  }

  g.hashPass=hashPass; g.hashPassV1=hashPassV1; g.verifyPass=verifyPass;
})(window);
