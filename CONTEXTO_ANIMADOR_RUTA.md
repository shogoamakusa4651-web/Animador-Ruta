# Animador de Ruta — Contexto completo del proyecto

> Documento de traspaso para trabajar el proyecto en **Claude Code**.
> Versión actual: **v4.31 · 2026-06-27**

---

## 1. Qué es el proyecto

App municipal (PWA) para el **Ayuntamiento de La Vega, RD** que monitorea las rutas de los camiones recolectores de basura. Tiene dos lados:

- **Centro de control (admin/supervisor):** ve los camiones en vivo sobre el mapa, despacha rutas, registra pesaje/combustible, genera reportes.
- **Chofer:** recibe la ruta despachada, la sigue con un asistente de voz tipo copiloto (giros, calles sin salida), y su progreso se transmite en vivo.

**URL pública:** https://shogoamakusa4651-web.github.io/Animador-Ruta/

---

## 2. Stack técnico

| Componente | Detalle |
|---|---|
| Estructura | **Un solo archivo `index.html`** (~6.600 líneas, 2 bloques `<script>`) |
| JS | Vanilla (sin framework), todo dentro de un IIFE principal |
| Mapa | Leaflet |
| Iconos | Tabler Icons (clases `ti ti-*`) |
| Backend | Firebase Realtime Database + Auth |
| Routing | OpenRouteService (ORS) para guía calle-a-calle |
| Hosting | GitHub Pages |
| PWA | `manifest.webmanifest` + `sw.js` + iconos (instalable) |

**Repo GitHub:** `shogoamakusa4651-web/Animador-Ruta` (rama `main`)

**Proyecto Firebase:** `animador-ruta-lavega`
```
databaseURL: https://animador-ruta-lavega-default-rtdb.firebaseio.com
```

---

## 3. Estructura de datos en Firebase

```
rutas/
  {id}/
    nombre, wp (waypoints codificados), freq (días LMXJVSD), choferCode
    etapas[]            → rutas multi-etapa
    envios/{YYYY-MM-DD} → despacho del día (status:'enviada', camión, chofer, km)
    viajes/{YYYY-MM-DD}/{vk} → viajes completados (con pesaje)
    reportes/{rk}       → reportes de incidencias
live/
  {txId} → posición en vivo del camión (lat,lng, _idx, cov, status, progress, etapa)
alertas_chofer/
  {key} → obstáculo/avería (tipo, chofer, rutaNombre, lat,lng, ts, atendida)
config/
  usuarios, choferes, camiones, supervisores, accesos
  progreso/{choferCode} → MEMORIA DE RUTA (retomar donde quedó)
quejas/, combustible/, mantenimiento/
```

**Codificación de progreso:** `covEnc(set,n)` / `covDec(s,n)` comprimen los waypoints cubiertos para transmitir; `covSegs(pts,bits,want)` los convierte en segmentos para dibujar el trail verde.

---

## 4. Funciones clave (ubicación en index.html v4.31)

| Función | Línea | Qué hace |
|---|---|---|
| `onGpsUpdate(pos)` | ~5436 | Núcleo. Procesa cada posición GPS del chofer: marca waypoints, detecta desvío, transmite, dispara voz |
| `announceTurnIfNeeded()` | ~5295 | Motor de voz copiloto (4 capas anti-solapamiento) |
| `detectGiros()` | ~4950 | Precalcula los giros reales (una vez), distingue giro-decisión de curva continua |
| `detectDeadEnds()` | ~4892 | Detecta calles sin salida / retornos |
| `densificarRuta(pts,maxGap)` | ~4037 | Agrega puntos internos cada ~12m (el KMZ trae puntos muy separados) |
| `buildInstructions()` | ~4990 | Construye las instrucciones de la ruta; llama a detectGiros/detectDeadEnds |
| `cargarEtapaChofer(idx,r)` | ~4088 | Carga una etapa en el motor; restaura progreso si lo hay |
| `guardarProgresoChofer()` | ~4054 | Guarda el progreso en Firebase (memoria de ruta) |
| `txChofer(extra)` | ~4515 | Transmite la posición/estado en vivo al centro de control |
| `updateLiveTrails()` | ~2305 | Dibuja el trail verde en el centro de control (sigue la calle) |
| `showRouteLayer(id)` | ~2260 | Dibuja una ruta en el mapa (azul vivo en curso / tenue si no) |
| `iniciarGuiaDestino(destino,tipo)` | ~4310 | Activa ORS para guiar (inicio/reintegro/regreso de vertedero) |
| `mostrarBannerAlerta(key,a)` | ~1978 | Banner global + sonido cuando un chofer reporta obstáculo |

---

## 5. Sistemas implementados (estado actual)

### Navegación del chofer
- **Marcado por proyección:** tolera el error del GPS real (busca el punto más cercano en una ventana adelante, no exige radio exacto). `tol = max(25, min(45, accuracy+22))`.
- **Densificación:** la ruta se rellena con puntos cada 12m para detección fina (no altera el trazado).
- **Detección de giros una vez:** `girosRuta{}` marca cada giro real como un solo punto. Clasifica `giro` (esquina ≤45m) vs `curva` (continua >45m).
- **Mapa NO rota** (rotar Leaflet deja áreas negras); solo rota el ícono del camión.

### Voz copiloto (4 capas, anti-solapamiento)
Cada capa solo suena si la anterior terminó (`_voiceBusyUntil`):
1. Temprana (>150m): "a unos X metros doblará a la derecha"
2. Preaviso con metraje (~90m): "prepárese para doblar a la derecha en X metros"
3. Preaviso corto (~50m): "prepárese, doble a la derecha"
4. **ANCLA (≤30m, SIEMPRE):** "dobla a la derecha"
- Recta larga: "va bien, continúe recto" cada ~350m (solo si se mueve de verdad).
- **Calles sin salida:** NO dice izq/der (problema de reversa) → "entre, llegue al fondo y devuélvase" + resaltado naranja en el mapa.
- **Mientras ORS guía, el motor de voz KMZ se calla** (`if(guiaActiva)return`).

### ORS (OpenRouteService)
- **Solo se activa con BOTÓN**, nunca automático. Botón "Activar asistente para llegar/reintegrarme".
- Guía al inicio, de reintegro (si se sale), o de regreso del vertedero.

### Centro de control
- **Trail verde sigue la calle** (sobre el trazado densificado), NO líneas rectas sobre las casas.
- Ruta en curso = **azul vivo**; ruta no en curso = **azul tenue**.
- **Despacho:** el chofer solo ve rutas que el centro de control envió hoy (`envios/{hoy}`).
- **Alertas de obstáculo:** banner rojo global + sonido, en cualquier sección, persiste hasta atender.

### Memoria de ruta (Firebase)
- Guarda progreso cada 4s y al ocultar la app.
- **Retoma automático** al volver a entrar (etapa, puntos, km, fase vertedero).
- No retoma rutas de días pasados.

### Vertedero
- "Voy a botar basura" → pausa ruta, guarda punto, cuenta km del desvío aparte.
- Al volver → ORS guía al punto donde paró; cuenta km **ida y vuelta completa**.
- Si cierra la app botando basura, al volver recuerda la fase.

### Simulador ("Probar ruta")
- 100% aislado: NO registra viajes reales, NO transmite a Firebase, NO detecta desvío.
- Velocidad ~51 km/h. Restaura el estado real al detener.

---

## 6. Credenciales / claves (ya en el index público)

```
Firebase apiKey: AIzaSyAWoLDCo-twjg3Hc5k0x_J1175Z3L36JX8
ORS_KEY: eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgi...(en línea ~4298)
```
> Nota: son claves de cliente (van en el front). La seguridad real está en las reglas de Firebase, no en ocultar estas claves.

**Usuario de prueba:** chofer `juan` (CH-01). Rutas: EL VEDADO (la que se prueba físicamente), SANTO DOMINGO SABIO, EL CAMPITO, PARQUE LINEAL EL RIITO, RUTA CENTRO HISTORICO.

---

## 7. REGLAS DE TRABAJO (críticas — respétalas siempre)

1. **Editar con `str_replace`, NUNCA recrear el index** (salvo cambio >80%).
2. **Validar JS antes de entregar:** extraer los `<script>` y correr `node --check`.
3. **Pruebas funcionales con node** que validen la lógica ANTES de entregar.
4. Respuestas cortas, directas, español dominicano, sin adulación.
5. **Antes de cambios grandes: decir QUÉ se va a hacer y esperar autorización.** No programar a ciegas.
6. **Pensamiento de "cortafuegos":** prever TODOS los escenarios, no parchar el caso puntual.
7. Subir versión: badge en login + abajo-izquierda (`vX.YY · fecha`).
8. NO subir mientras hay un camión real haciendo pruebas en vivo.

---

## 8. Comando para validar el JS (úsalo siempre antes de subir)

```bash
python3 -c "import re; html=open('index.html').read(); js='\n'.join(re.findall(r'<script>(.*?)</script>',html,re.S)); open('app.js','w').write(js)" && node --check app.js && echo "JS VALIDO"
```

---

## 9. Pendientes / cosas a vigilar

- **Marcado con GPS real:** la lógica de proyección está puesta pero solo se valida bien en la calle (el animador no reproduce el error del GPS). Si falla, anotar el punto exacto.
- **Detección de retorno:** depende de cómo el KMZ trazó la calle de ida/vuelta. Casos raros pueden no detectarse.
- **Curvas muy graduales:** puede que no se aniuncien (el chofer las sigue natural).
- **Botón "Confirmar y activar ruta":** quitar generación de enlaces viejos (el chofer ya entra con usuario).
