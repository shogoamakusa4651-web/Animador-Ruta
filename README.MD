# Animador de Ruta

Sistema municipal de monitoreo de recolección de residuos sólidos.
**Ayuntamiento de La Vega, República Dominicana.**

Aplicación web que gestiona rutas de recolección, flota de camiones, personal, pesaje, combustible, reportes ejecutivos y un portal ciudadano de quejas, con seguimiento GPS en tiempo real.

🔗 **App en vivo:** https://shogoamakusa4651-web.github.io/Animador-Ruta/
📣 **Portal ciudadano de quejas:** misma URL + `?quejas`

---

## Estructura del proyecto

```
index.html               Aplicación principal (HTML + JS del dominio)
css/
  styles.css             Estilos de la aplicación
js/
  utils.js               Utilidades puras (formato, escape, geometría)
  store.js               Estado central de la aplicación
  auth.js                Motor de cifrado de contraseñas (PBKDF2)
icon-192.png             Ícono PWA
icon-512.png             Ícono PWA
manifest.webmanifest     Manifiesto PWA
sw.js                    Service worker (offline / PWA)
docs/                    Manuales (técnico, instalación, dev, admin)
```

> **Importante:** los archivos deben mantener esta estructura de carpetas.
> Si se sube `index.html` sin las carpetas `css/` y `js/`, la app se ve sin estilos y falla.

---

## Tecnología

JavaScript Vanilla (sin framework, sin build) · Leaflet (mapas) · Firebase Realtime Database + Auth (datos y autenticación) · PWA. Se despliega en GitHub Pages sin compilar.

---

## Roles del sistema

| Rol | Ve | Edita |
|-----|----|----|
| Admin maestro (correo) | Todo | Todo |
| Admin secundario | Todo | Nada (solo lectura) |
| Supervisor | Inicio, Monitoreo, Reportes | Nada |
| Chofer | Monitoreo | Su operación |

---

## Seguridad (leer antes de tocar)

**Las reglas de Firebase son la única verdad.** El control de roles en el JavaScript es comodidad de interfaz, no barrera real. Toda escritura sensible DEBE estar protegida por una regla de Firebase.

- El `apiKey` de Firebase en el código es público por diseño — no es un secreto.
- Las contraseñas se cifran con PBKDF2 (ver `js/auth.js`).
- **Nota crítica:** el nodo `config/usuarios` debe ser legible por usuarios autenticados (`.read: "auth != null"`), o el login de admins secundarios se rompe con `permission_denied`.

---

## Documentación

En la carpeta `docs/`:
- `01-manual-tecnico.md` — arquitectura, modelo de datos, seguridad, deuda técnica
- `02-manual-instalacion.md` — configurar Firebase y desplegar
- `03-manual-desarrolladores.md` — cómo navegar y extender el código
- `04-manual-administradores.md` — uso del sistema (no técnico)

---

## Estado de modularización

El sistema está en proceso de pasar de un archivo único a módulos separados. Ya extraídos: estilos, utilidades, estado central y autenticación. Pendiente: migrar las variables de estado restantes al `store.js` (patrón documentado en el manual de desarrolladores) y separar los módulos de dominio.
