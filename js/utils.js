/* ============================================================================
   ANIMADOR DE RUTA · utils.js
   Funciones utilitarias puras (sin estado compartido, sin DOM).
   Se cargan ANTES del script principal; quedan disponibles globalmente.
   ============================================================================ */
(function(g){
  'use strict';

  // --- Texto / seguridad ---
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function normUser(u){ return String(u||'').trim().toLowerCase().replace(/\s+/g,''); }
  function fbKey(c){ return c.replace(/[.#$\[\]\/]/g,'_'); }
  function randSalt(){ const a=new Uint8Array(8); crypto.getRandomValues(a); return Array.from(a).map(b=>b.toString(16).padStart(2,'0')).join(''); }

  // --- Formato ---
  function fmtKm(n){ n=Number(n)||0; return n.toLocaleString('en-US',{maximumFractionDigits:2})+' km'; }
  function fmtFecha(f){ if(!f)return '—'; const p=String(f).split('-'); if(p.length!==3)return f; const ms=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']; return parseInt(p[2],10)+' '+ms[parseInt(p[1],10)-1]+' '+p[0]; }

  // --- Geometría (coordenadas [lat,lng]) ---
  function haversine(a,b){const R=6371000,t=Math.PI/180;const dLat=(b[0]-a[0])*t,dLng=(b[1]-a[1])*t,la1=a[0]*t,la2=b[0]*t;
    const h=Math.sin(dLat/2)**2+Math.cos(la1)*Math.cos(la2)*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(h));}
  function bearing(a,b){const t=Math.PI/180,la1=a[0]*t,la2=b[0]*t,dLng=(b[1]-a[1])*t;
    const y=Math.sin(dLng)*Math.cos(la2),x=Math.cos(la1)*Math.sin(la2)-Math.sin(la1)*Math.cos(la2)*Math.cos(dLng);
    return (Math.atan2(y,x)*180/Math.PI+360)%360;}
  function lerp(a,b,f){return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];}

  // Exponer en el ámbito global para que el script principal las use
  g.esc=esc; g.normUser=normUser; g.fbKey=fbKey; g.randSalt=randSalt;
  g.fmtKm=fmtKm; g.fmtFecha=fmtFecha;
  g.haversine=haversine; g.bearing=bearing; g.lerp=lerp;
})(window);
