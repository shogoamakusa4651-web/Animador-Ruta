# Animador de Ruta — Contexto para Claude Code

PWA municipal para el Ayuntamiento de La Vega, RD. Monitorea rutas de camiones recolectores de basura en tiempo real.

**URL pública:** https://shogoamakusa4651-web.github.io/Animador-Ruta/
**Repo:** `shogoamakusa4651-web/Animador-Ruta` rama `main`
**Versión actual:** v4.82

## Stack

- Un solo archivo `index.html` (~8,250 líneas, 1 bloque `<script>` principal) + `css/styles.css` + `js/` (utils, store, auth)
- Vanilla JS (IIFE principal), Leaflet, Firebase Realtime Database + Auth, OpenRouteService (ORS)
- GitHub Pages (hosting), PWA instalable

## Reglas de trabajo (CRÍTICAS)

1. **Editar con `str_replace`, NUNCA recrear el index** (salvo cambio >80%)
2. **Validar JS antes de entregar** (en esta PC no hay Python, usar node): `node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');fs.writeFileSync('app.js',[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n'))" && node --check app.js && echo "JS VALIDO"`
3. **Pruebas funcionales con node** que validen la lógica antes de entregar
4. Respuestas cortas, directas, español dominicano, sin adulación
5. **Antes de cambios grandes: decir QUÉ se va a hacer y esperar autorización**
6. **Pensamiento de cortafuegos:** prever TODOS los escenarios, no parchar el caso puntual
7. Subir versión: `APP_VERSION` en index.html (pinta los badges) + `styles.css?v=` para romper caché
8. NO subir mientras hay un camión real haciendo pruebas en vivo

## Flujo de trabajo

1. Cambio solicitado → editar `index.html` con `str_replace`
2. Validar JS con el comando de arriba
3. `git add index.html && git commit -m "vX.XX: descripción" && git push`
4. GitHub Pages se actualiza solo → Ctrl+Shift+R en el navegador

## Contexto completo

Ver `CONTEXTO_ANIMADOR_RUTA.md` para estructura de Firebase, funciones clave, y sistemas implementados.
