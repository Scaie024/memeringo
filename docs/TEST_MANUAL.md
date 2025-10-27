# 🧪 GUÍA DE PRUEBAS MANUALES - Backend & Frontend

**Fecha**: 24 de octubre de 2025  
**Status**: Testing Phase  
**Objetivo**: Verificar comunicación coherente entre backend y frontend

---

## 📋 Tabla de Contenidos

1. [Setup Inicial](#setup-inicial)
2. [Pruebas del Backend](#pruebas-del-backend)
3. [Pruebas del Frontend](#pruebas-del-frontend)
4. [Pruebas E2E](#pruebas-e2e)
5. [Validación de Errores](#validación-de-errores)
6. [Checklist de Aceptación](#checklist-de-aceptación)

---

## Setup Inicial

### Terminal 1: Backend
```bash
cd /Users/arturopinzon/Downloads/asuputamadre/memeringo/backend
export $(cat ../.env.local | grep -v '^#' | xargs)
npm start
```

**Expected Output:**
```
✅ Connected to database
✅ Backend server listening on http://0.0.0.0:3001
```

### Terminal 2: Frontend
```bash
cd /Users/arturopinzon/Downloads/asuputamadre/memeringo
npm run dev
```

**Expected Output:**
```
➜  Local:   http://localhost:3000/
```

### Terminal 3: Pruebas
```bash
cd /Users/arturopinzon/Downloads/asuputamadre/memeringo
# Aquí ejecutaremos pruebas con curl
```

---

## 🔍 Pruebas del Backend

### Prueba 1: Health Check
```bash
curl http://localhost:3001/health
```

**Expected:**
```json
{"status":"ok","timestamp":"2025-10-24T..."}
```

**Validar:**
- ✅ Status HTTP 200
- ✅ Respuesta JSON válida
- ✅ Campo `status` = "ok"
- ✅ Campo `timestamp` es ISO string

---

### Prueba 2: GET /api/dids (Listar todos)
```bash
curl http://localhost:3001/api/dids
```

**Expected:**
```json
[
  {
    "id": "did_1",
    "phoneNumber": "+5215551234",
    "country": "MX",
    "status": "INACTIVE",
    "routeType": "AGENT",
    "routeTarget": "default",
    "trunkId": null,
    "createdAt": "2025-10-24T...",
    "accountId": "acc_default"
  },
  ...
]
```

**Validar:**
- ✅ Status HTTP 200
- ✅ Array de objetos DIDs
- ✅ Al menos 5 DIDs (de seed)
- ✅ Todos los campos presentes
- ✅ Tipos correctos (string, null)
- ✅ createdAt es ISO string

---

### Prueba 3: POST /api/dids (Crear válido)
```bash
curl -X POST http://localhost:3001/api/dids \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+555123456789",
    "country": "BR"
  }'
```

**Expected:**
```json
{
  "id": "cuid_...",
  "phoneNumber": "+555123456789",
  "country": "BR",
  "status": "INACTIVE",
  "routeType": "AGENT",
  "routeTarget": "default",
  "trunkId": null,
  "createdAt": "2025-10-24T...",
  "accountId": "acc_default"
}
```

**Validar:**
- ✅ Status HTTP 201 (Created)
- ✅ Nuevo DID tiene ID
- ✅ Valores coinciden con lo enviado
- ✅ Valores por defecto correctos

---

### Prueba 4: POST /api/dids (Duplicado - debe fallar)
```bash
# Repetir Prueba 3 con el mismo número
curl -X POST http://localhost:3001/api/dids \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+555123456789",
    "country": "BR"
  }'
```

**Expected:**
```json
{"error":"This phone number already exists."}
```

**Validar:**
- ✅ Status HTTP 409 (Conflict)
- ✅ Mensaje de error claro
- ✅ Base de datos no se corrupcionó

---

### Prueba 5: POST /api/dids (Falta phoneNumber)
```bash
curl -X POST http://localhost:3001/api/dids \
  -H "Content-Type: application/json" \
  -d '{
    "country": "MX"
  }'
```

**Expected:**
```json
{"error":"Phone number and country are required"}
```

**Validar:**
- ✅ Status HTTP 400 (Bad Request)
- ✅ Mensaje de validación claro

---

### Prueba 6: PUT /api/dids/:id (Actualizar)

Primero, obtén un ID real:
```bash
# Obtener primer DID
DID_ID=$(curl -s http://localhost:3001/api/dids | jq -r '.[0].id')
echo $DID_ID
```

Luego actualiza:
```bash
curl -X PUT http://localhost:3001/api/dids/$DID_ID \
  -H "Content-Type: application/json" \
  -d '{
    "routeTarget": "agente_principal"
  }'
```

**Expected:**
```json
{
  "id": "$DID_ID",
  "phoneNumber": "...",
  "country": "...",
  "status": "INACTIVE",
  "routeType": "AGENT",
  "routeTarget": "agente_principal",
  "trunkId": null,
  "createdAt": "...",
  "accountId": "acc_default"
}
```

**Validar:**
- ✅ Status HTTP 200
- ✅ routeTarget cambió a "agente_principal"
- ✅ Otros campos sin cambios

---

### Prueba 7: DELETE /api/dids/:id

Crear un DID temporal:
```bash
TEMP_ID=$(curl -s -X POST http://localhost:3001/api/dids \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+999888777","country":"CO"}' | jq -r '.id')
echo $TEMP_ID
```

Eliminar:
```bash
curl -X DELETE http://localhost:3001/api/dids/$TEMP_ID
```

**Expected:**
```json
{"message":"DID deleted successfully","id":"$TEMP_ID"}
```

**Validar:**
- ✅ Status HTTP 200
- ✅ Mensaje de confirmación
- ✅ Verificar que GET /api/dids ya no lo incluye

---

## 🎨 Pruebas del Frontend

### Prueba 8: Carga Inicial

1. Abre http://localhost:3000 en navegador
2. Espera a que cargue

**Validar:**
- ✅ Página carga sin errores
- ✅ Header "DIDs" visible
- ✅ Tabla aparece
- ✅ "Loading DIDs..." durante carga (rápido)
- ✅ 5+ DIDs de seed aparecen en tabla
- ✅ Sin errores en consola (F12 → Console)

**Console Check:**
```
[timestamp] GET http://localhost:3001/api/dids → 200 ✅
```

---

### Prueba 9: Filtrar DIDs

1. En la barra de búsqueda, escribe "+5215" (inicio de un número)
2. Verifica que la tabla se filtra

**Validar:**
- ✅ Tabla actualiza en tiempo real
- ✅ Solo DIDs que coinciden aparecen
- ✅ Sin llamadas innecesarias al backend

---

### Prueba 10: Crear DID (Frontend → Backend)

1. Click botón "+ Add DID"
2. Aparece modal
3. Completa formulario:
   - Phone: `+33612345678`
   - Country: `ES`
4. Click "Save"

**Validar:**
- ✅ Modal desaparece
- ✅ Nuevo DID aparece en tabla (arriba)
- ✅ Tabla se refresca automáticamente
- ✅ Sin errores en consola
- ✅ Backend log muestra POST exitoso

**Console Check:**
```
[timestamp] POST http://localhost:3001/api/dids → 201 ✅
[timestamp] GET http://localhost:3001/api/dids → 200 ✅
```

---

### Prueba 11: Error al Crear Duplicado

1. Click "+ Add DID"
2. Completa con número que YA existe (ej: de Prueba 10)
3. Click "Save"

**Validar:**
- ✅ Modal se mantiene abierto
- ✅ Aparece banner de error (rojo)
- ✅ Mensaje claro: "Conflicto: This phone number already exists."
- ✅ Sin valores en formulario se pierden

---

### Prueba 12: Eliminar DID

1. En tabla, localiza un DID (que no sea importante)
2. Click icono papelera (rojo)
3. Confirma en dialog

**Validar:**
- ✅ Confirma antes de borrar
- ✅ DID desaparece de tabla
- ✅ Tabla se refresca automáticamente
- ✅ Sin errores

---

## 🔗 Pruebas E2E

### Prueba 13: Ciclo Completo CRUD

1. **Create**: Agregar DID "+554433221100" / MX
2. **Read**: Verificar que aparece en tabla
3. **Update**: Cambiar routeTarget (via curl)
4. **Refresh**: Refrescar página (F5)
5. **Delete**: Eliminar desde UI

```bash
# Step 3 - Update via API
NEW_ID=$(curl -s http://localhost:3001/api/dids | \
  jq -r '.[] | select(.phoneNumber=="+554433221100") | .id')

curl -X PUT http://localhost:3001/api/dids/$NEW_ID \
  -H "Content-Type: application/json" \
  -d '{"routeTarget":"updated_via_api"}'
```

**Validar:**
- ✅ Todos los pasos funcionan
- ✅ Tabla siempre refleja estado actual
- ✅ Datos persisten en base de datos

---

### Prueba 14: Concurrencia

1. Abre http://localhost:3000 en 2 pestañas
2. En Pestaña 1: Crea DID "+12125551234" / US
3. En Pestaña 2: Verifica que aparezca (puede necesitar F5)

**Validar:**
- ✅ Ambas pestañas muestran datos consistentes
- ✅ No hay corrupción de datos

---

### Prueba 15: Estados de Carga

1. Abre DevTools (F12 → Network)
2. Simula "Slow 3G" (throttling)
3. Recarga página (F5)
4. Observa estados

**Validar:**
- ✅ "Loading DIDs..." aparece durante carga
- ✅ Tabla se puebla cuando listos
- ✅ UI no freezea

---

## ❌ Validación de Errores

### Prueba 16: Desconexión del Backend

1. Terminal 1: Ctrl+C para detener backend
2. En navegador: Intenta crear DID
3. Observa error

**Expected:**
- ✅ Banner de error: "No se pudo conectar al servidor"
- ✅ Modal se mantiene abierto
- ✅ Usuario puede reintentar

4. Reinicia backend en Terminal 1
5. Click retry (si existe) o intenta de nuevo

**Validar:**
- ✅ Ahora funciona

---

### Prueba 17: Respuestas Inesperadas

```bash
# Simular respuesta corrupta
curl -X POST http://localhost:3001/api/dids \
  -H "Content-Type: application/json" \
  -d '{invalid json'
```

**Expected:**
- ✅ Backend rechaza con 400
- ✅ Frontend muestra error

---

## ✅ Checklist de Aceptación

### Backend
- [ ] GET /health retorna 200 con timestamp
- [ ] GET /api/dids retorna array completo
- [ ] POST /api/dids crea nuevo (201)
- [ ] POST duplicado retorna 409
- [ ] POST sin campos retorna 400
- [ ] PUT actualiza DID (200)
- [ ] PUT inexistente retorna 404
- [ ] DELETE elimina DID (200)
- [ ] DELETE inexistente retorna 404
- [ ] CORS habilitado
- [ ] Logs en consola claros

### Frontend (UI)
- [ ] Página carga sin errores
- [ ] DIDs cargan desde API
- [ ] Tabla muestra datos correcto
- [ ] Filtro funciona
- [ ] Modal para crear DIDs
- [ ] Crear DID funciona
- [ ] Error banner visible
- [ ] Botón papelera para eliminar
- [ ] Confirmación antes de borrar
- [ ] Tabla se refresca automáticamente
- [ ] Sin errores en consola

### Comunicación
- [ ] Tipos coinciden entre back y front
- [ ] Errores formateados correctamente
- [ ] Loading states funcionan
- [ ] Validación en ambos lados
- [ ] Base de datos persiste datos
- [ ] Sin duplicados innecesarios

### Robustez
- [ ] Manejo de errores de conexión
- [ ] Manejo de timeouts
- [ ] Manejo de respuestas inesperadas
- [ ] Prevención de XSS
- [ ] Validación de entrada

---

## 🎯 Resultado Final

Cuando TODOS los checkboxes estén marcados, escribir:

```
✅ PHASE 2 COMPLETAMENTE PROBADO Y LISTO PARA PRODUCCIÓN
```

---

## 📞 Troubleshooting

**Problema**: Backend no inicia
```bash
# Verificar puerto disponible
lsof -i :3001
# Si está en uso:
kill -9 <PID>
```

**Problema**: Frontend no conecta a backend
```bash
# Verificar VITE_API_URL
echo $VITE_API_URL
# Debe ser: http://localhost:3001

# O verificar .env.local
cat .env.local | grep VITE_API_URL
```

**Problema**: Database errors
```bash
# Reiniciar database
cd backend
npm run prisma:migrate
```

**Problema**: Tipos de TypeScript
```bash
# Regenerar Prisma Client
cd backend
npm run prisma:generate
```

---

**Completado**: [Marca cuando terminó todas las pruebas]
