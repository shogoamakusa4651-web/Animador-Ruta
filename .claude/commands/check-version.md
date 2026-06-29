# /check-version

Verifica que APP_VERSION en index.html coincida con el último tag de commit.

## Pasos

1. Lee la versión actual del archivo:
   ```powershell
   Select-String -Path index.html -Pattern "APP_VERSION='(v[\d\.]+)" | Select-Object -First 1
   ```

2. Lee el último commit:
   ```powershell
   git log --oneline -1
   ```

3. Compara: extrae el número de versión del mensaje del commit (ej: "v4.45") y compara con el valor de APP_VERSION.

4. Reporta el resultado:
   - ✅ **OK** — si coinciden exactamente (ej: ambos dicen v4.45)
   - ❌ **DESINCRONIZADO** — si difieren. Muestra cuál es cada uno y corrígelo de inmediato:
     - Actualiza APP_VERSION en index.html al número del último commit
     - Valida JS con node --check
     - Haz git add index.html + commit + push con mensaje "vX.XX: sincroniza APP_VERSION"

## Regla crítica

**Cada vez que hagas un commit de código, DEBES haber actualizado APP_VERSION al mismo número de versión del commit en ese mismo commit, no en uno separado.**
