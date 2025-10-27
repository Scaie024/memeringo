# 🎯 INSTRUCCIONES PASO A PASO - PHASE 2 FUNCIONANDO

Sigue **EXACTAMENTE** estos pasos en orden. Copiar-pegar es permitido.

---

## PASO 1️⃣ - Abre 3 Terminales

Necesitas 3 ventanas de terminal abiertas.

---

## PASO 2️⃣ - Terminal 1: Backend Server

En la primera terminal, copia-pega esto:

```bash
cd /Users/arturopinzon/Downloads/asuputamadre/memeringo/backend
export $(cat ../.env.local | grep -v '^#' | xargs)
npm start
```

**Espera hasta ver:**
```
✅ Connected to database
✅ Backend server listening on http://0.0.0.0:3001
```

Déjalo corriendo.

---

## PASO 3️⃣ - Terminal 2: Frontend Server

En la segunda terminal, copia-pega esto:

```bash
cd /Users/arturopinzon/Downloads/asuputamadre/memeringo
npm run dev
```

**Espera hasta ver:**
```
VITE v6.4.1  ready in XXX ms
➜  Local:   http://localhost:3000/
```

Déjalo corriendo.

---

## PASO 4️⃣ - Terminal 3: Pruebas

En la tercera terminal, prueba esto:

```bash
curl http://localhost:3001/health
```

**Deberías ver:**
```json
{"status":"ok","timestamp":"2025-10-24T..."}
```

Si lo ves, significa que el backend funciona ✅

Luego prueba:

```bash
curl http://localhost:3001/api/dids
```

**Deberías ver un array con 5 DIDs** ✅

---

## PASO 5️⃣ - Abre el Navegador

Abre tu navegador y ve a:

```
http://localhost:3000
```

**Deberías ver:**
- Logo de VoiceWoot
- Dashboard con lista de DIDs
- 5 DIDs cargados desde la base de datos ✅

---

## PASO 6️⃣ - Prueba Crear un DID

1. En la página de DIDs, busca el botón "Add DID" o similar
2. Click en "Add DID"
3. Ingresa un número de teléfono: `+555123456789`
4. Selecciona país: `Brasil (BR)`
5. Click "Save" o "Guardar"

**Resultado esperado:**
- El modal se cierra
- Vuelves a ver la lista
- El nuevo DID aparece en la lista ✅

---

## PASO 7️⃣ - Verifica con Terminal 3

En la Terminal 3, prueba:

```bash
curl http://localhost:3001/api/dids
```

**Deberías ver 6 DIDs ahora (5 originales + 1 nuevo)** ✅

---

## PASO 8️⃣ - Prueba API Directamente (Opcional)

Si quieres probar directamente en Terminal 3:

**Crear DID:**
```bash
curl -X POST http://localhost:3001/api/dids \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+555999888777","country":"AR"}'
```

**Ver todos:**
```bash
curl http://localhost:3001/api/dids | jq .
```

**Actualizar DID (reemplaza did_1 con un ID real):**
```bash
curl -X PUT http://localhost:3001/api/dids/did_1 \
  -H "Content-Type: application/json" \
  -d '{"routeTarget":"new_target"}'
```

**Eliminar DID:**
```bash
curl -X DELETE http://localhost:3001/api/dids/did_1
```

---

## ✅ Si Ves Todo Esto, ¡FUNCIONA!

- ✅ Terminal 1: Backend corriendo en puerto 3001
- ✅ Terminal 2: Frontend corriendo en puerto 3000
- ✅ Terminal 3: curl /health funciona
- ✅ Terminal 3: curl /api/dids retorna datos
- ✅ Navegador: http://localhost:3000 carga UI
- ✅ Navegador: DIDs mostrados desde database
- ✅ Navegador: Puedes crear DIDs
- ✅ Terminal 3: Nuevo DID aparece en GET /api/dids

---

## ❌ Si Algo No Funciona

### "Port 3001 already in use"
```bash
lsof -i :3001
kill -9 PID
```

### "Port 3000 already in use"
```bash
lsof -i :3000
kill -9 PID
```

### "Backend no responde"
- Verifica que Terminal 1 está corriendo
- Verifica el mensaje de error en Terminal 1
- Intenta: `ps aux | grep node`

### "Frontend no carga"
- Espera 5 segundos
- Refresh página (F5 o Cmd+R)
- Verifica Terminal 2 no tiene errores

### "curl /api/dids devuelve error"
- Verifica Terminal 1 está corriendo
- Prueba: `curl localhost:3001/health`
- Revisa logs en Terminal 1

### "Agregar DID no funciona"
- Abre consola del navegador (F12)
- Mira si hay errores rojos
- Revisa Terminal 1 logs
- Intenta crear vía curl primero

---

## 🎉 ¡LISTO!

Si todo funciona hasta acá, significa que:

✅ Tu backend está completo  
✅ Tu frontend está conectado  
✅ Tu database funciona  
✅ El CRUD completo está operativo  

**Próximos pasos:**
1. Deja los servidores corriendo
2. Prueba agregar/editar/eliminar DIDs desde la UI
3. Cuando esté todo bien: Notifica para Phase 3

---

## 📝 Notas

- Los servidores se quedarán corriendo en Terminal 1 y 2
- Para detenerlos: Ctrl+C en cada terminal
- Si necesitas reiniciar: Ctrl+C y luego vuelve al PASO 2
- Los datos se guardan en `/Users/arturopinzon/Downloads/asuputamadre/memeringo/dev.db`

---

**¿Necesitas ayuda?** Comparte el error exacto que ves.

**¿Funciona todo?** ¡Excelente! Continúa a Phase 3.
