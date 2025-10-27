# 🚀 PHASE 2 - INSTRUCCIONES PARA HACER FUNCIONAR TODO

## Estado Actual ✅

Completado:
- ✅ Backend: Endpoints GET, POST, PUT, DELETE listos en `backend/src/server.ts`
- ✅ Frontend: DidsPage conectada a API usando `VITE_API_URL`
- ✅ Database: SQLite con datos de prueba
- ✅ Configuración: .env.local con todos los valores

## PASO 1: Compilar y Verificar

```bash
cd /Users/arturopinzon/Downloads/asuputamadre/memeringo

# Compilar frontend
npm run build

# Compilar backend
cd backend && npm run build && cd ..
```

Ambos deben compilar **sin errores**.

---

## PASO 2: Iniciar Servidores (2 Terminales)

### Terminal 1 - Backend

```bash
cd /Users/arturopinzon/Downloads/asuputamadre/memeringo/backend
export $(cat ../.env.local | grep -v '#' | xargs)
npm start
```

Debe ver:
```
✅ Connected to database
✅ Backend server listening on http://0.0.0.0:3001
```

### Terminal 2 - Frontend

```bash
cd /Users/arturopinzon/Downloads/asuputamadre/memeringo
npm run dev
```

Debe ver:
```
VITE v6.4.1  ready in XXX ms
➜  Local:   http://localhost:3000/
```

---

## PASO 3: Verificar Conectividad (Terminal 3)

```bash
# Test 1: Health check
curl http://localhost:3001/health

# Esperado:
# {"status":"ok","timestamp":"2025-10-24T..."}

# Test 2: Fetch DIDs
curl http://localhost:3001/api/dids

# Esperado: Array con 5 DIDs

# Test 3: Create DID
curl -X POST http://localhost:3001/api/dids \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+555123456789","country":"BR"}'

# Esperado: Status 201 + objeto del nuevo DID

# Test 4: Get a DID (reemplaza did_1 con un ID real)
curl http://localhost:3001/api/dids/did_1

# Esperado: El DID especificado

# Test 5: Update DID
curl -X PUT http://localhost:3001/api/dids/did_1 \
  -H "Content-Type: application/json" \
  -d '{"routeTarget":"new_target"}'

# Esperado: Status 200 + DID actualizado

# Test 6: Delete DID
curl -X DELETE http://localhost:3001/api/dids/did_1

# Esperado: Status 200 + mensaje de éxito
```

---

## PASO 4: Prueba en Navegador

1. Abre: **http://localhost:3000**
2. Deberías ver el dashboard de VoiceWoot
3. Ve a la página de DIDs
4. Deberías ver los 5 DIDs cargados desde la base de datos
5. Prueba:
   - ✅ Click "Add DID" y crea uno nuevo
   - ✅ Verifica que aparece en la lista
   - ✅ Prueba editar números si es posible
   - ✅ Prueba eliminar DIDs

---

## PASO 5: Revisar Logs

Si algo falla:

```bash
# Backend logs (desde la terminal del backend, Ctrl+C para salir)
# Debe ver todas las requests

# Frontend logs (ver en consola del navegador)
# F12 → Console → Busca errores

# Logs guardados
tail -f /tmp/backend.log
tail -f /tmp/frontend.log
```

---

## Si Algo No Funciona

### Error: "Database locked"
```bash
rm /Users/arturopinzon/Downloads/asuputamadre/memeringo/dev.db
cd /Users/arturopinzon/Downloads/asuputamadre/memeringo
export $(cat .env.local | grep -v '#' | xargs)
npx prisma migrate dev
npx prisma db seed
```

### Error: "Prisma Client not initialized"
```bash
cd backend
npm run prisma:generate
cd ..
```

### Error: "Port already in use"
```bash
# Encontrar proceso
lsof -i :3001  # backend
lsof -i :3000  # frontend

# Matar proceso
kill -9 <PID>
```

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install

cd backend && rm -rf node_modules && npm install && cd ..
```

---

## Logs Esperados

### Backend (npm start output)
```
✅ Connected to database
✅ Backend server listening on http://0.0.0.0:3001
[info] GET /api/dids 200
[info] POST /api/dids 201
[info] PUT /api/dids/:id 200
[info] DELETE /api/dids/:id 200
```

### Frontend (http://localhost:3000)
```
Frontend loads → Shows DIDs from database → Can add/edit/delete
```

---

## Próximos Pasos si Todo Funciona

1. Agregar manejo de errores mejorado
2. Agregar notificaciones/toasts
3. Agregar validación de formularios
4. Agregar loading states
5. Implementar autenticación (Phase 3)

---

## Estructura de Endpoints Completa

```
GET    /health              → {"status":"ok","timestamp":"..."}
GET    /api/dids            → [{ id, phoneNumber, country, routeType, ... }]
POST   /api/dids            → { id, phoneNumber, country, ... }
PUT    /api/dids/:id        → { id, phoneNumber, country, ... }
DELETE /api/dids/:id        → { message: "DID deleted successfully", id }
```

---

**¿Necesitas ayuda?** Revisa los logs y comparte el error exacto.

**¿Lista para continuar?** Ejecuta los pasos 1-4 arriba.
