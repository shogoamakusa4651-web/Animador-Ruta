# Guía: migrar Animador de Ruta a Claude Code

Paso a paso para trabajar tu proyecto desde Claude Code, en tu PC Windows.

---

## Paso 1 — Instalar Claude Code

Claude Code necesita **Node.js** (que ya tienes, lo usas para `node --check`).

Abre la terminal (PowerShell o CMD) y ejecuta:
```bash
npm install -g @anthropic-ai/claude-code
```

Verifica:
```bash
claude --version
```

> Si da error de permisos, abre PowerShell **como administrador**.

---

## Paso 2 — Traer tu proyecto a una carpeta local

Tu código vive en GitHub. Trae una copia a tu PC con git (si no tienes git, descárgalo de git-scm.com):

```bash
cd C:\Users\David Del Orbe\Desktop
git clone https://github.com/shogoamakusa4651-web/Animador-Ruta.git
cd Animador-Ruta
```

Ahora tienes la carpeta `Animador-Ruta` con tu `index.html` y los archivos PWA.

> Copia también los dos documentos que te di (`CONTEXTO_ANIMADOR_RUTA.md` y `GUIA_CLAUDE_CODE.md`) dentro de esa carpeta.

---

## Paso 3 — Arrancar Claude Code en el proyecto

Dentro de la carpeta del proyecto:
```bash
claude
```

La primera vez te pedirá iniciar sesión con tu cuenta de Anthropic. Hazlo.

Claude Code arranca **dentro de la carpeta** y puede leer/editar todos los archivos directamente — sin copiar y pegar, sin subir manualmente.

---

## Paso 4 — Darle el contexto (clave)

Lo primero que escribes en Claude Code:

```
Lee CONTEXTO_ANIMADOR_RUTA.md completo. Es el contexto de este proyecto.
Respeta SIEMPRE las reglas de trabajo de la sección 7, sobre todo:
editar con str_replace nunca recrear, validar JS con node --check antes de
entregar, hacer pruebas funcionales, y pensamiento de cortafuegos.
```

Claude Code lo lee del disco y queda con todo el contexto cargado.

### Mejor aún: crea un archivo `CLAUDE.md`

Claude Code lee automáticamente un archivo llamado `CLAUDE.md` al arrancar. Pídele:

```
Crea un archivo CLAUDE.md que resuma las reglas de trabajo y la estructura
del proyecto desde CONTEXTO_ANIMADOR_RUTA.md, para que lo leas automáticamente
cada vez que abra el proyecto.
```

Así no tienes que repetir el contexto cada vez.

---

## Paso 5 — El nuevo flujo de trabajo (mucho mejor)

Antes (aquí en el chat):
1. Yo editaba → te daba el index → tú lo subías a GitHub a mano → Ctrl+Shift+R.

Ahora (en Claude Code):
1. Le pides un cambio.
2. Claude Code **edita el archivo directamente en tu disco**.
3. Valida el JS solo.
4. Tú revisas y subes con git:
```bash
git add index.html
git commit -m "v4.32: descripción del cambio"
git push
```
5. GitHub Pages se actualiza solo. Ctrl+Shift+R en el navegador.

> Claude Code puede **correr los comandos de validación y git por ti** si se lo pides. Le dices "valida y haz commit" y lo hace.

---

## Paso 6 — Probar localmente (opcional pero útil)

En vez de subir a GitHub cada vez para probar, puedes correr el index en tu PC:

```bash
# Python (ya lo tienes)
python -m http.server 8000
```
Abre `http://localhost:8000` en el navegador. Pruebas al instante sin subir nada.

> Ojo: Firebase y ORS funcionan igual en localhost. El GPS del navegador en PC sale por IP (impreciso) — para probar GPS real usa el celular.

---

## Ventajas de Claude Code para este proyecto

- **No más copiar/pegar el index** de 6.600 líneas.
- Claude Code **lee solo las partes que necesita** (más rápido, menos errores).
- Puede **correr `node --check` y las pruebas funcionales por sí mismo** antes de entregarte.
- Puede hacer el **commit y push a GitHub** por ti.
- Mantiene el contexto del proyecto en `CLAUDE.md` entre sesiones.
- Ves los cambios como **diff** (qué línea cambió exactamente) — esto resuelve tu duda de "por qué generaste otro index": verás que es el mismo archivo editado.

---

## Comandos útiles dentro de Claude Code

| Quieres... | Dile / escribe |
|---|---|
| Cargar el contexto | "Lee CLAUDE.md" |
| Un cambio | "En announceTurnIfNeeded, ajusta X..." |
| Validar | "Valida el JS con node --check" |
| Ver qué cambió | "Muéstrame el diff" |
| Subir a GitHub | "Haz commit y push con mensaje v4.32" |
| Revertir | "Deshaz el último cambio" |

---

## Primer mensaje recomendado en Claude Code

Copia y pega esto como tu primer mensaje:

```
Este es el proyecto Animador de Ruta (PWA municipal de rutas de basura,
La Vega RD). Lee CONTEXTO_ANIMADOR_RUTA.md completo y crea un CLAUDE.md
con las reglas de trabajo y la estructura. Trabajamos sobre index.html
(un solo archivo, ~6600 líneas). Reglas críticas: editar con str_replace
nunca recrear, validar con node --check antes de entregar, pruebas
funcionales con node, pensamiento de cortafuegos (prever todos los
escenarios), respuestas cortas en español dominicano. Versión actual v4.31.
No hagas cambios todavía, solo confirma que entendiste el proyecto.
```
