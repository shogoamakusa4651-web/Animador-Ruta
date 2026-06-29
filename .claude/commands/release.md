# /release

Sube una nueva versión del Animador de Ruta.

**Uso:** `/release v4.40 "descripción del cambio"`

## Pasos que debes seguir

1. Toma el número de versión y la descripción del argumento del usuario.
   - Si no dio versión, lee el `APP_VERSION` actual del `index.html` e incrementa el número menor en 1.
   - La fecha siempre es la de hoy (formato `YYYY-MM-DD`).

2. En `index.html`, actualiza la línea:
   ```
   const APP_VERSION='vX.XX · YYYY-MM-DD';
   ```
   con la versión nueva y la fecha de hoy.

3. Valida el JS:
   ```powershell
   $html = Get-Content index.html -Raw -Encoding UTF8
   $matches = [regex]::Matches($html, '(?s)<script>(.*?)</script>')
   $js = ($matches | ForEach-Object { $_.Groups[1].Value }) -join "`n"
   [System.IO.File]::WriteAllText("$PWD\app.js", $js, [System.Text.Encoding]::UTF8)
   node --check app.js
   ```
   Si falla, reporta el error y NO hagas commit.

4. Si el JS es válido, haz commit y push:
   ```
   git add index.html
   git commit -m "vX.XX: descripción"
   git push
   ```

5. Confirma al usuario: versión subida, fecha, y que debe hacer Ctrl+Shift+R.

**Regla crítica:** NUNCA recrear el index.html — solo editar con str_replace.
