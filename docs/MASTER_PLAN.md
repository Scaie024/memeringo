# 🚀 PLAN MAESTRO: DE REPO ROTO A PRODUCCIÓN

**Proyecto:** VoiceWoot - Open Source VoIP Platform  
**Estado Actual:** ❌ No funcional (28 problemas)  
**Objetivo:** ✅ Versión lista para producción en 4-5 días de trabajo intenso

---

## 📊 ROADMAP VISUAL

```
AHORA (Repo Roto)
       ⬇️
PHASE 1: FIX CRÍTICO (2-3 horas)
├─ Reparar archivos corruptos
├─ Crear configuración (.env, tailwind, etc)
├─ Limpiar dependencias
└─ Resultado: Proyecto que inicia ✅
       ⬇️
PHASE 2: MVP FUNCIONAL (8-10 horas)
├─ Frontend: Componentes working
├─ Backend: CRUD de DIDs
├─ Database: Schema y migraciones
├─ API Communication: Working
└─ Resultado: App básica pero funcional ✅
       ⬇️
PHASE 3: PRODUCCIÓN (10-12 horas)
├─ Autenticación JWT
├─ Validación completa
├─ Manejo de errores robusto
├─ Tests (Unit + E2E)
├─ CI/CD Pipeline
├─ Documentación API (Swagger)
├─ Docker compose production-ready
└─ Resultado: Listo para deploy ✅
       ⬇️
PHASE 4: VLAN/VOIP (Optional, 8-10 horas)
├─ Configurar FreeSWITCH
├─ ESL Connection
├─ Llamadas reales
├─ WebRTC Browser
└─ Resultado: Funcionalidad VoIP completa ⭐

TOTAL: 28-35 horas para PRODUCCIÓN COMPLETA
```

---

## 🎯 PHASE 1: FIX CRÍTICO (2-3 HORAS)

### 1.1 Archivos a Reconstruir

#### ✅ `.env.local` (CREATE)
```bash
# Database
DATABASE_URL="postgresql://voicewoot:voicewootpassword@localhost:5432/voicewootdb"

# FreeSWITCH ESL
FS_ESL_HOST=localhost
FS_ESL_PORT=8021
FS_ESL_PASSWORD=ClueCon

# API
API_PORT=3001
API_URL=http://localhost:3001

# Frontend
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

# App
NODE_ENV=development
```

#### ✅ `.env.example` (CREATE)
(Igual al anterior, para documentación)

#### ✅ `prisma/schema.prisma` (REBUILD - ver archivo anexo)
Schema Prisma completo y válido

#### ✅ `backend/Dockerfile` (REBUILD)
Dockerfile correcto para backend

#### ✅ `tailwind.config.ts` (CREATE)
Configuración de Tailwind

#### ✅ `postcss.config.cjs` (CREATE)
Configuración de PostCSS

#### ✅ `vite.env.d.ts` (CREATE)
Types para variables de entorno

#### ✅ `index.html` (UPDATE)
Remover importmap corrupto

#### ✅ `package.json` (UPDATE - FRONTEND)
Limpiar dependencias (sacar fastify, express, modesl, @prisma/client)

#### ✅ `backend/package.json` (UPDATE)
Ajustar versiones de dependencias

### 1.2 Dependencias a Instalar

```bash
# Frontend - agregar Tailwind & PostCSS
npm install -D tailwindcss postcss autoprefixer

# Backend - asegurar versiones iguales de Prisma
cd backend && npm install
```

### 1.3 Resultado Esperado

- ✅ `npm run dev` inicia sin errores
- ✅ Frontend accesible en http://localhost:3000
- ✅ Backend accesible en http://localhost:3001
- ✅ TypeScript sin type errors

---

## 📱 PHASE 2: MVP FUNCIONAL (8-10 HORAS)

### 2.1 Frontend - Reparar Componentes

#### [2.1.1] Fix Select Component
**Archivo:** `components/ui/Select.tsx`
- ✅ Hacer que onChange funcione correctamente
- ✅ Asegurar SelectItem renderiza bien

#### [2.1.2] Fix Dialog Component
**Archivo:** `components/ui/Dialog.tsx`
- ✅ Close button debe funcionar
- ✅ Overlay debe cerrar al hacer click
- ✅ Transiciones suaves

#### [2.1.3] Fix AddDidDialog
**Archivo:** `components/AddDidDialog.tsx`
- ✅ Validación de inputs
- ✅ Manejo de errores
- ✅ Feedback al usuario

#### [2.1.4] Fix DidsPage - API Routes
**Archivo:** `pages/DidsPage.tsx`
- ✅ Usar `import.meta.env.VITE_API_URL`
- ✅ Timeout en fetch
- ✅ Error handling completo
- ✅ Loading states

#### [2.1.5] Add Error Boundary
**Archivo:** `components/ErrorBoundary.tsx` (CREATE)
- ✅ Capturar errores de componentes
- ✅ Mostrar fallback UI

#### [2.1.6] Add Toast Notifications
**Archivo:** `components/Toast.tsx` (CREATE)
- ✅ Sistema de notificaciones
- ✅ Success, Error, Warning

### 2.2 Backend - Implementar API

#### [2.2.1] Validar Variables de Entorno
**Archivo:** `backend/src/server.ts`
- ✅ Validar que todas las env vars existan
- ✅ Fail fast si falta algo

#### [2.2.2] Mejorar GET /api/dids
- ✅ Paginación
- ✅ Filtros
- ✅ Error handling

#### [2.2.3] Mejorar POST /api/dids
- ✅ Validación de input
- ✅ Verificar duplicados
- ✅ Error messages claros

#### [2.2.4] Implementar DELETE /api/dids/:id
- ✅ Soft delete (opcional)
- ✅ Validar que existe

#### [2.2.5] Implementar PUT /api/dids/:id
- ✅ Actualizar DID
- ✅ Validación completa

#### [2.2.6] Agregar Logging
**Archivo:** `backend/src/lib/logger.ts` (CREATE)
- ✅ Logs estructurados
- ✅ Niveles (debug, info, warn, error)

### 2.3 Database - Migrations & Seed

#### [2.3.1] Crear Schema Prisma
- ✅ Models completos: Account, SipTrunk, Did, CallLog
- ✅ Relaciones correctas
- ✅ Índices importantes

#### [2.3.2] Primera Migración
```bash
npx prisma migrate dev --name init
```

#### [2.3.3] Seed Data
- ✅ Cuentas de prueba
- ✅ Troncales SIP
- ✅ DIDs de ejemplo

#### [2.3.4] Prisma Studio (Dev)
```bash
npx prisma studio
```

### 2.4 Resultado Esperado

- ✅ Frontend + Backend comunican correctamente
- ✅ CRUD de DIDs funciona
- ✅ DB está migrada y con datos
- ✅ Manejo básico de errores
- ✅ UI responsive y funcional

---

## 🔒 PHASE 3: PRODUCCIÓN (10-12 HORAS)

### 3.1 Autenticación & Autorización

#### [3.1.1] Implementar JWT
**Archivos:**
- `backend/src/lib/jwt.ts` (CREATE)
- `backend/src/middleware/auth.ts` (CREATE)

Features:
- ✅ Login/Signup endpoints
- ✅ JWT tokens con refresh
- ✅ Protect rutas
- ✅ Roles-based access

#### [3.1.2] Frontend Auth Context
**Archivo:** `contexts/AuthContext.tsx` (CREATE)
- ✅ State global de usuario
- ✅ Login/Logout
- ✅ Token management

#### [3.1.3] Protected Routes
**Archivo:** `components/ProtectedRoute.tsx` (CREATE)
- ✅ Redireccionar si no autenticado
- ✅ Verificar permisos

### 3.2 Validación Completa

#### [3.2.1] Backend Validation
**Archivo:** `backend/src/lib/validators.ts` (CREATE)
- ✅ Validar input de cada ruta
- ✅ Sanitizar datos
- ✅ Error messages claros

#### [3.2.2] Frontend Validation
**Archivo:** `lib/validation.ts` (CREATE)
- ✅ Validar antes de enviar
- ✅ UX friendly

### 3.3 Error Handling Robusto

#### [3.3.1] Custom Error Classes
**Archivo:** `backend/src/lib/errors.ts` (CREATE)
```typescript
- AppError
- ValidationError
- NotFoundError
- UnauthorizedError
```

#### [3.3.2] Global Error Handler
**Archivo:** `backend/src/middleware/errorHandler.ts` (CREATE)
- ✅ Catch all errors
- ✅ Format responses
- ✅ Logging

#### [3.3.3] Retry Logic
**Archivo:** `lib/api.ts` (CREATE - FRONTEND)
- ✅ Reintentos con backoff exponencial
- ✅ Manejo de timeouts

### 3.4 Testing

#### [3.4.1] Unit Tests - Backend
**Directorio:** `backend/src/__tests__/`
- ✅ Tests para validators
- ✅ Tests para services
- ✅ Jest setup

#### [3.4.2] Integration Tests - Backend
- ✅ Tests para endpoints
- ✅ DB fixtures

#### [3.4.3] E2E Tests - Frontend
**Directorio:** `e2e/`
- ✅ Playwright tests
- ✅ User flows principales

#### [3.4.4] Coverage
- ✅ Target: 80%+ coverage

### 3.5 API Documentation

#### [3.5.1] Swagger/OpenAPI
**Archivo:** `backend/swagger.ts` (CREATE)
- ✅ Auto-generated docs
- ✅ Interactivo

#### [3.5.2] README completo
- ✅ Instalación
- ✅ Desarrollo
- ✅ Deployment
- ✅ API Reference
- ✅ Architecture

### 3.6 CI/CD Pipeline

#### [3.6.1] GitHub Actions
**Directorio:** `.github/workflows/`
- ✅ Lint & Format check
- ✅ Tests
- ✅ Build
- ✅ Deploy staging (opcional)

### 3.7 Docker Production-Ready

#### [3.7.1] Optimizar Dockerfile
- ✅ Multi-stage builds
- ✅ Minimal images

#### [3.7.2] docker-compose.yml
- ✅ Producción con Postgres
- ✅ Nginx reverse proxy
- ✅ Health checks

#### [3.7.3] .dockerignore
- ✅ Excluir archivos innecesarios

### 3.8 Resultado Esperado

- ✅ Autenticación y autorización working
- ✅ Validación en todos los niveles
- ✅ Error handling completo
- ✅ Tests con good coverage
- ✅ Documentación API
- ✅ CI/CD pipeline
- ✅ Listo para deploy

---

## 🎙️ PHASE 4: VoIP & FREESWITCH (8-10 HORAS - OPCIONAL)

### 4.1 FreeSWITCH Configuración

#### [4.1.1] Configurar FreeSWITCH Completo
**Directorio:** `freeswitch/conf/`
- ✅ vars.xml
- ✅ modules.conf.xml
- ✅ dialplan/default.xml
- ✅ SIP profiles

#### [4.1.2] Gateway Configuration
- ✅ my_trunk.xml completo
- ✅ Credenciales del proveedor

### 4.2 ESL Connection Mejorada

#### [4.2.1] Reconectar automáticamente
- ✅ Retry logic
- ✅ Health checks

#### [4.2.2] Event handlers
- ✅ Escuchar eventos de llamada
- ✅ Registrar en DB

### 4.3 Backend - Call Management

#### [4.3.1] Endpoints de Llamadas
- ✅ POST /api/calls/originate
- ✅ POST /api/calls/:id/hangup
- ✅ GET /api/calls/:id
- ✅ GET /api/calls (history)

#### [4.3.2] WebSockets para Realtime
**Archivo:** `backend/src/websocket.ts` (CREATE)
- ✅ Eventos de llamada en tiempo real
- ✅ Estado de conexión SIP

### 4.4 Frontend - Call UI

#### [4.4.1] Call Screen
**Archivo:** `components/CallScreen.tsx` (CREATE)
- ✅ Mostrar llamada activa
- ✅ Botones: Hold, Transfer, Hang up
- ✅ Duración en tiempo real

#### [4.4.2] Call History
- ✅ Listar llamadas
- ✅ Filtros y búsqueda
- ✅ Registros detallados

#### [4.4.3] Dialer Mejorado
- ✅ DTMF support
- ✅ Speed dial
- ✅ Contact integration

### 4.5 WebRTC (Opcional pero poderoso)

#### [4.5.1] Llamadas desde navegador
- ✅ sip.js o similar
- ✅ Audio/Video

#### [4.5.2] Browser registering
- ✅ Registrarse en FreeSWITCH
- ✅ Recepcionar llamadas

### 4.6 Resultado Esperado

- ✅ Llamadas reales funcionando
- ✅ Historial de llamadas
- ✅ UI para gestionar llamadas
- ✅ Realtime updates
- ✅ (Opcional) WebRTC working

---

## 📋 ARQUITECTURA FINAL

```
voicewoot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           (Button, Dialog, Select, etc)
│   │   │   ├── auth/         (Login, Signup, ProtectedRoute)
│   │   │   ├── calls/        (Dialer, CallScreen, History)
│   │   │   ├── dids/         (DidsTable, AddDialog)
│   │   │   └── common/       (Header, Sidebar, ErrorBoundary, Toast)
│   │   ├── pages/            (DashboardPage, DidsPage, CallsPage, etc)
│   │   ├── contexts/         (AuthContext, ApiContext)
│   │   ├── hooks/            (useAuth, useApi, useCall)
│   │   ├── lib/              (validators, api, constants)
│   │   ├── types/            (index.ts)
│   │   ├── styles/           (global.css)
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── postcss.config.cjs
│
├── backend/
│   ├── src/
│   │   ├── routes/           (dids, calls, auth, users)
│   │   ├── services/         (DidsService, CallsService, AuthService, FreeSwitchService)
│   │   ├── middleware/       (auth, errorHandler, logger)
│   │   ├── lib/              (jwt, validators, errors, logger)
│   │   ├── websocket.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── __tests__/            (unit, integration)
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── freeswitch/
│   └── conf/                 (vars, modules, dialplan, sip_profiles)
│
├── e2e/                      (Playwright tests)
├── .github/workflows/        (CI/CD)
├── docker-compose.yml        (production)
├── .env.example
└── README.md                 (documentación completa)
```

---

## 🛠️ STACK TÉCNICO FINAL

### Frontend
- **React 19** + TypeScript
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Tanstack Query** (state management)
- **Axios** (HTTP client con interceptors)

### Backend
- **Fastify** (HTTP server)
- **Prisma** (ORM)
- **PostgreSQL** (database)
- **JWT** (auth)
- **Zod** (validation)
- **Winston** (logging)
- **Socket.io** (WebSockets)

### VoIP
- **FreeSWITCH** (VoIP engine)
- **modesl** (ESL client)
- **sip.js** (WebRTC, opcional)

### DevOps
- **Docker** (containerization)
- **Docker Compose** (orchestration)
- **GitHub Actions** (CI/CD)
- **Jest** (testing)
- **Playwright** (E2E testing)

---

## 📅 TIMELINE ESTIMADO

| Phase | Duración | Complejidad | Estado |
|-------|----------|-------------|--------|
| Phase 1: Fix Crítico | 2-3h | 🟢 Baja | Primero |
| Phase 2: MVP | 8-10h | 🟡 Media | Segundo |
| Phase 3: Producción | 10-12h | 🔴 Alta | Tercero |
| Phase 4: VoIP | 8-10h | 🔴 Alta | Opcional |
| **TOTAL** | **28-35h** | - | **4-5 días intensos** |

---

## ✅ CRITERIOS DE ÉXITO

### Phase 1
- [ ] Frontend inicia sin errores
- [ ] Backend inicia sin errores
- [ ] Conecta a Database
- [ ] Swagger/API docs disponible

### Phase 2
- [ ] CRUD DIDs funciona
- [ ] Frontend se comunica con Backend
- [ ] UI es responsive
- [ ] Error handling básico

### Phase 3
- [ ] Login/Signup funciona
- [ ] Tests con 80%+ coverage
- [ ] Documentación completa
- [ ] CI/CD funcionando
- [ ] Docker producción-ready

### Phase 4 (Opcional)
- [ ] Llamadas reales funcionan
- [ ] Historial de llamadas
- [ ] WebSockets en tiempo real
- [ ] (Opcional) WebRTC working

---

## 🚀 CÓMO EMPEZAR

1. **Lee este documento completo**
2. **Ejecuta Phase 1** (2-3 horas)
3. **Valida** que proyecto inicia
4. **Continúa con Phase 2** (8-10 horas)
5. **Implementa Phase 3** (10-12 horas) - ¡PRODUCCIÓN!
6. **Opcional: Phase 4** (8-10 horas) - VoIP

**Total: 28-35 horas para producción completa**

---

**Este es el roadmap. El trabajo está bien documentado y es implementable.  
¡Vamos a construir un VoiceWoot profesional! 🚀**
