# /validate

Valida el JavaScript del index.html sin hacer commit.

## Pasos que debes seguir

1. Extrae los bloques `<script>` del `index.html` y corre `node --check`:
   ```powershell
   $html = Get-Content index.html -Raw -Encoding UTF8
   $matches = [regex]::Matches($html, '(?s)<script>(.*?)</script>')
   $js = ($matches | ForEach-Object { $_.Groups[1].Value }) -join "`n"
   [System.IO.File]::WriteAllText("$PWD\app.js", $js, [System.Text.Encoding]::UTF8)
   node --check app.js
   ```

2. Si es válido: responde "JS VÁLIDO ✓ — listo para subir."

3. Si hay errores: muestra el error exacto con número de línea y describe qué lo causa.
