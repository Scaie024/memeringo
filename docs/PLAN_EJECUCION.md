# 📋 PLAN EJECUTIVO - REINICIO Y PUESTA EN MARCHA

**Fecha**: 26 de Octubre de 2025  
**Proyecto**: VoiceWoot - Open Source VoIP Platform  
**Objetivo**: Reiniciar completamente el proyecto y hacerlo funcionar

---

## 🎯 OBJETIVO FINAL

Tener tanto **frontend** como **backend** ejecutándose correctamente:
- ✅ Frontend en `http://localhost:3000`
- ✅ Backend en `http://localhost:3001`
- ✅ Base de datos con datos de prueba
- ✅ Comunicación API funcionando
- ✅ UI completamente funcional

---

## 📊 DIAGRAMA DE FLUJO

```
START
  ↓
[PREPARACIÓN] - Verificar requisitos, limpiar proyecto
  ↓
[INSTALACIÓN] - npm install (frontend + backend)
  ↓
[COMPILACIÓN] - Generar Prisma, compilar TypeScript
  ↓
[BASE DE DATOS] - Migraciones, seed, verificación
  ↓
[SERVIDOR BACKEND] - Iniciar en puerto 3001
  ↓
[SERVIDOR FRONTEND] - Iniciar en puerto 3000
  ↓
[VERIFICACIÓN] - Probar endpoints y conectividad
  ↓
SUCCESS ✅
```

---

## ⏱️ TIEMPO ESTIMADO

| Fase | Duración | Total |
|------|----------|-------|
| Preparación | 5 min | 5 min |
| Instalación | 20 min | 25 min |
| Compilación | 10 min | 35 min |
| Base de datos | 5 min | 40 min |
| Servidores | 2 min | 42 min |
| Verificación | 3 min | 45 min |

**Total Estimado**: ~45-60 minutos (dependiendo de tu conexión)

---

## 🚀 PLAN DETALLADO

### FASE 1: PREPARACIÓN (5 minutos)

#### 1.1 - Verificar Node.js y npm

```bash
node --version    # Debe ser v22 o superior
npm --version     # Debe ser v10 o superior
```

**Esperado**:
```
v22.x.x
10.x.x
```

Si no tienes estas versiones, descarga desde: https://nodejs.org/

#### 1.2 - Navegar al directorio del proyecto

```bash
cd /Users/arturopinzon/Desktop/voicewoot/memeringo
```

#### 1.3 - Verificar archivos clave

```bash
ls -la | grep -E "package.json|tsconfig|vite.config|.env"
ls backend/ | grep package.json
ls prisma/ | grep schema.prisma
```

**Debe ver**:
- `package.json` (frontend)
- `backend/package.json`
- `prisma/schema.prisma`
- `tsconfig.json`
- `vite.config.ts`
- `.env.local`

---

### FASE 2: LIMPIEZA (10 minutos)

#### 2.1 - Eliminar node_modules

```bash
rm -rf node_modules
rm -rf backend/node_modules
```

#### 2.2 - Eliminar archivos compilados

```bash
rm -rf dist
rm -rf backend/dist
rm -rf .next
rm -f dev.db
```

#### 2.3 - Verificar limpieza

```bash
ls -la | grep -v "^d"  # No debe haber node_modules ni dist
```

---

### FASE 3: INSTALACIÓN (20 minutos)

#### 3.1 - Instalar dependencias frontend

```bash
cd /Users/arturopinzon/Desktop/voicewoot/memeringo
npm install --legacy-peer-deps
```

**Esperado**:
```
added XXX packages in XXs
```

Ignora warnings menores.

#### 3.2 - Instalar dependencias backend

```bash
cd backend
npm install --legacy-peer-deps
cd ..
```

**Esperado**:
```
added XXX packages in XXs
```

#### 3.3 - Verificar instalación

```bash
npm list --depth=0
cd backend && npm list --depth=0 && cd ..
```

**Debe ver**:
- react@19.2.0
- fastify@5.6.1
- prisma@6.18.0
- vite@6.2.0

---

### FASE 4: COMPILACIÓN Y VALIDACIÓN (10 minutos)

#### 4.1 - Generar Prisma Client

```bash
npx prisma generate --schema ./prisma/schema.prisma
```

**Esperado**:
```
✔ Generated Prisma Client (X.X.X) to ./node_modules/@prisma/client in XXXms
```

#### 4.2 - Compilar backend

```bash
cd backend
npm run build
cd ..
```

**Esperado**:
```
✅ Compiles with tsc
✅ Output to dist/ folder
```

**Si hay errores**:
```bash
cd backend
npm run type-check
```

#### 4.3 - Validar tipos frontend

```bash
npm run type-check
```

**Esperado**: Sin salida = sin errores ✅

#### 4.4 - Build preview frontend

```bash
npm run build
```

**Esperado**:
```
✓ vite v6.x.x building for production...
✓ dist/index.html         0.71 kB │ gzip: 0.43 kB
✓ dist/assets/index.js    458.xx kB │ gzip: 131.xx kB
✓ built in XXXms
```

---

### FASE 5: INICIALIZACIÓN DE BASE DE DATOS (5 minutos)

#### 5.1 - Configurar variable de entorno

```bash
export DATABASE_URL="file:./dev.db"
```

#### 5.2 - Aplicar migraciones

```bash
npx prisma migrate deploy
```

**Esperado**:
```
Databases synchronized, all pending migrations have been applied.
```

#### 5.3 - Seedear datos de prueba

```bash
npx prisma db seed
```

**Esperado**:
```
Running seed command `node prisma/seed.cjs`...
✓ Seed completed
```

**Si falla**:
```bash
npx prisma db seed --binary-target=native
```

#### 5.4 - Verificar base de datos

```bash
file dev.db          # Debe ser SQLite 3.x
ls -lh dev.db        # Debe tener > 5 KB
```

#### 5.5 - Inspeccionar datos (opcional)

```bash
npx prisma studio
# Se abre en navegador - puedes ver todas las tablas y datos
```

---

### FASE 6: INICIAR SERVIDORES (2 minutos)

#### 6.1 - TERMINAL 1: Frontend

```bash
cd /Users/arturopinzon/Desktop/voicewoot/memeringo
npm run dev
```

**Esperado**:
```
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

✅ **Frontend corriendo en http://localhost:3000**

#### 6.2 - TERMINAL 2: Backend

```bash
cd /Users/arturopinzon/Desktop/voicewoot/memeringo/backend
export $(cat ../.env.local | xargs)
npm run dev
```

**Esperado**:
```
[TIMESTAMP] INFO (fastify): Server listening on 0.0.0.0:3001
[TIMESTAMP] INFO: ✅ Connected to database
[TIMESTAMP] INFO: ✅ Backend server listening on http://0.0.0.0:3001
```

✅ **Backend corriendo en http://localhost:3001**

---

### FASE 7: VERIFICACIÓN DE CONECTIVIDAD (3 minutos)

#### 7.1 - Verificar Frontend

En navegador o terminal:
```bash
curl http://localhost:3000 | head -20
```

**Esperado**: Código HTML de la aplicación

#### 7.2 - Verificar Backend Health

```bash
curl http://localhost:3001/health
```

**Esperado**:
```json
{"status":"ok","timestamp":"2025-10-26T..."}
```

#### 7.3 - Verificar API DIDs

```bash
curl http://localhost:3001/api/dids | jq .
```

**Esperado**: Array con 5 DIDs
```json
[
  {
    "id": "...",
    "phoneNumber": "+525511223344",
    "country": "MX",
    "routeType": "AGENT",
    ...
  },
  ...
]
```

#### 7.4 - Verificar Frontend en navegador

Abre: http://localhost:3000

**Esperado**:
- ✅ UI carga correctamente
- ✅ Sidebar visible con navegación
- ✅ Página DIDs muestra tabla
- ✅ Sin errores en console (F12)

#### 7.5 - Probar CRUD Básico

1. **Ver DIDs**: La tabla debe mostrar 5 números
2. **Agregar DID**: Hacer click en "Agregar DID"
   - Llenar teléfono: +525599887766
   - Seleccionar país: México
   - Guardar
   - Debe verse el nuevo DID en tabla
3. **Eliminar DID**: Hacer click en botón eliminar
   - Confirmar eliminación
   - DID debe desaparecer de tabla
4. **Actualizar**: Los cambios deben persistir en BD

---

## ❌ TROUBLESHOOTING

### Error: "Port 3000 already in use"

```bash
# Encontrar proceso
lsof -i :3000

# Matar proceso
kill -9 <PID>

# O cambiando puerto en vite.config.ts
```

### Error: "Port 3001 already in use"

```bash
# Encontrar proceso
lsof -i :3001

# Matar proceso
kill -9 <PID>
```

### Error: "Cannot find Prisma Client"

```bash
cd backend
npm run prisma:generate
npx prisma generate --schema ../prisma/schema.prisma
```

### Error: "Database locked"

```bash
rm dev.db
npx prisma migrate deploy
npx prisma db seed
```

### Error: "Module not found"

```bash
# Limpiar y reinstalar
rm -rf node_modules backend/node_modules
npm cache clean --force
npm install
cd backend && npm install && cd ..
```

### TypeScript errors en frontend

```bash
npm run type-check
# Revisa los errores reportados
```

### Backend no responde

```bash
# Verificar que esté corriendo
curl http://localhost:3001/health

# Si no responde, revisar logs en terminal del backend
```

### API devuelve error 500

```bash
# Revisar logs en terminal backend
# Usualmente causado por:
# 1. Database no conectada
# 2. Variables de entorno faltantes
# 3. Prisma Client no generado
```

---

## ✅ CHECKLIST DE ÉXITO

- [ ] Node.js v22+ y npm v10+ verificados
- [ ] Proyecto limpiado (sin node_modules, dist, dev.db)
- [ ] Dependencias frontend instaladas
- [ ] Dependencias backend instaladas
- [ ] Prisma Client generado
- [ ] Backend compila sin errores
- [ ] Frontend pasa type-check
- [ ] Frontend compila sin errores
- [ ] Base de datos creada (dev.db)
- [ ] Migraciones aplicadas
- [ ] Datos seeded (5 DIDs, 1 user, 2 trunks)
- [ ] Frontend inicia en puerto 3000
- [ ] Backend inicia en puerto 3001
- [ ] Health check responde OK
- [ ] API /api/dids responde con datos
- [ ] UI carga sin errores en browser
- [ ] CRUD básico funciona (add, view, delete)
- [ ] Console sin errores críticos

---

## 🎯 SIGUIENTE FASE

Una vez todo funciona, puedes:

1. **Explorar la UI**: Navega por las páginas, prueba componentes
2. **Revisar logs**: Abre DevTools (F12) para ver network requests
3. **Debugging**: Si hay problemas, revisa:
   - Network tab (HTTP requests)
   - Console (JS errors)
   - Backend terminal (server logs)
4. **Implementar Phase 2**: Nuevas características según NEXT_STEPS.md

---

## 📞 SOPORTE

Si algo falla:

1. **Leer el error completo** - No ignorar warnings
2. **Google el error** - Probablemente alguien lo tuvo
3. **Revisar documentación**:
   - ANALISIS_COPILOT.md - Análisis técnico
   - README.md - Documentación general
   - QUICK_START.md - Inicio rápido
4. **Stack Overflow**: Busca por error específico
5. **GitHub Issues**: De Vite, Fastify, Prisma, React

---

**Documento generado por GitHub Copilot**  
**Última actualización**: 26-Oct-2025  
**Status**: ✅ LISTO PARA EJECUTAR
