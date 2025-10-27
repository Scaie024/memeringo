# 🚀 PLAN DE ACCIÓN COMPLETO - PASO A PASO

## ✅ TODO LIST EJECUTABLE

### FASE 1: REPARACIÓN CRÍTICA

#### [1] Crear .env.local
```bash
# Ejecutar en terminal
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://voicewoot:voicewootpassword@localhost:5432/voicewootdb"
FS_ESL_HOST=localhost
FS_ESL_PORT=8021
FS_ESL_PASSWORD=ClueCon
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
NODE_ENV=development
EOF
```

#### [2] Crear Prisma Schema Correcto
Reemplazar el contenido corrupto de `prisma/schema.prisma` con el schema válido (ver QUICK_FIXES.md)

#### [3] Reconstruir Dockerfile Backend
Reemplazar el contenido corrupto de `backend/Dockerfile` con la versión correcta (ver QUICK_FIXES.md)

#### [4] Crear Tailwind Config
Crear `tailwind.config.ts` (ver QUICK_FIXES.md)

#### [5] Crear PostCSS Config
Crear `postcss.config.cjs` (ver QUICK_FIXES.md)

#### [6] Crear Vite Env Types
Crear `vite.env.d.ts` (ver QUICK_FIXES.md)

#### [7] Limpiar index.html
Remover el `<script type="importmap">` completo, dejar HTML limpio

#### [8] Agregar dependencias de Tailwind
```bash
npm install -D tailwindcss postcss autoprefixer
cd backend && npm install
cd ..
```

---

### FASE 2: REPARAR CÓDIGO

#### [9] Arreglar Select Component
Reemplazar `components/ui/Select.tsx` (ver QUICK_FIXES.md)

#### [10] Arreglar Dialog Component
Reemplazar `components/ui/Dialog.tsx` (ver QUICK_FIXES.md)

#### [11] Arreglar AddDidDialog
Reemplazar `components/AddDidDialog.tsx` (ver QUICK_FIXES.md)

#### [12] Arreglar DidsPage
Actualizar rutas API para usar `VITE_API_URL` (ver QUICK_FIXES.md)

#### [13] Limpiar Frontend package.json
```json
{
  "name": "voicewoot-open-source-ultimate",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
```

#### [14] Actualizar Backend package.json
```bash
cd backend
cat > package.json << 'EOF'
{
  "name": "voicewoot-backend",
  "version": "1.0.0",
  "description": "Backend for VoiceWoot Ultimate Platform",
  "main": "dist/server.js",
  "type": "module",
  "scripts": {
    "dev": "npx ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:migrate": "npx prisma migrate dev",
    "prisma:seed": "npx ts-node prisma/seed.ts"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  "dependencies": {
    "@fastify/cors": "^11.1.0",
    "@prisma/client": "^6.18.0",
    "dotenv": "^16.4.5",
    "fastify": "^5.6.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "prisma": "^6.18.0",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.8.2"
  }
}
EOF
```

#### [15] Arreglar Backend Server
Actualizar `backend/src/server.ts` con validación de env (ver QUICK_FIXES.md)

#### [16] Arreglar FreeSwitchService
Remover `@ts-ignore` comentarios y validar tipos

---

### FASE 3: BASE DE DATOS

#### [17] Instalar Prisma
```bash
cd backend
npm install
npx prisma generate
```

#### [18] Crear primera migración
```bash
cd backend
npx prisma migrate dev --name init
```

#### [19] Seed datos iniciales
```bash
cd backend
npx prisma db seed
```

#### [20] Verificar datos
```bash
npx prisma studio
```

---

### FASE 4: COMPILAR Y TESTEAR

#### [21] Install frontend deps
```bash
cd /path/to/project
npm install
```

#### [22] Build frontend
```bash
npm run build
```

#### [23] Build backend
```bash
cd backend
npm run build
```

#### [24] Verificar errores TypeScript
```bash
npx tsc --noEmit
cd backend && npx tsc --noEmit && cd ..
```

---

### FASE 5: EJECUTAR LOCALMENTE

#### [25] Terminal 1: Frontend
```bash
npm run dev
# Acceder a http://localhost:3000
```

#### [26] Terminal 2: Backend
```bash
cd backend
npm run dev
# Debe conectar a DB y escuchar en puerto 3001
```

#### [27] Terminal 3: PostgreSQL (si no está en Docker)
```bash
# O simplemente: docker run -d --name voicewoot-db \
#   -e POSTGRES_USER=voicewoot \
#   -e POSTGRES_PASSWORD=voicewootpassword \
#   -e POSTGRES_DB=voicewootdb \
#   -p 5432:5432 \
#   postgres:15
```

#### [28] Testear endpoints principales
```bash
# GET DIDs
curl http://localhost:3001/api/dids

# POST crear DID
curl -X POST http://localhost:3001/api/dids \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+525512345678", "country": "MX"}'
```

#### [29] Verificar UI
- Ir a http://localhost:3000
- Debe cargar sin errores de importmap
- DIDs deben ser visibles (desde DB seed)
- Agregar nuevo DID debe funcionar

---

### FASE 6: LIMPIEZA

#### [30] Remover componentes no usados
```bash
rm -f components/Header.tsx
rm -f components/CallLog.tsx
rm -f components/Dialer.tsx
rm -f components/ConversationView.tsx
```

#### [31] Limpiar hooks
```bash
rm -f hooks/useVoiceWoot.ts
rm -f hooks/useVoiceWootEnterprise.ts
```

#### [32] Crear .gitignore
```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules
.npm

# Environment
.env
.env.local
.env.*.local

# Build outputs
dist
build
*.tsbuildinfo

# Logs
npm-debug.log*
yarn-debug.log*

# IDE
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Prisma
prisma/.env
prisma/.env.local
EOF
```

#### [33] Crear README adecuado
```markdown
# VoiceWoot - Open Source VoIP Platform

## Quick Start

### Prerequisites
- Node.js 22+
- PostgreSQL 15+
- Docker (opcional)

### Installation

1. Install dependencies
\`\`\`bash
npm install
cd backend && npm install && cd ..
\`\`\`

2. Setup environment
\`\`\`bash
cp .env.example .env.local
\`\`\`

3. Setup database
\`\`\`bash
cd backend
npx prisma migrate dev
npx prisma db seed
cd ..
\`\`\`

4. Start development servers
\`\`\`bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm run dev
\`\`\`

5. Access the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Project Structure

```
├── frontend/           # React + Vite app
├── backend/           # Fastify server
├── prisma/            # Database schema
└── freeswitch/        # FreeSWITCH configs
```

## Architecture

- **Frontend**: React 19 + TypeScript + Tailwind
- **Backend**: Fastify + Prisma ORM
- **Database**: PostgreSQL
- **VoIP**: FreeSWITCH (optional)

## Current Limitations

- FreeSWITCH integration is incomplete
- No WebRTC implementation
- No authentication/authorization
- No real-time call handling

## Next Steps

1. Configure FreeSWITCH ESL connection
2. Implement WebRTC for browser calls
3. Add authentication (JWT)
4. Add call state management
5. Implement call recording
EOF
```

---

### FASE 7: DOCKER (Opcional pero importante)

#### [34] Testear Docker
```bash
docker-compose up -d
# Esperar a que todo inicie
docker-compose logs -f
```

#### [35] Verificar servicios
```bash
# PostgreSQL
docker exec voicewoot_db pg_isready

# Backend
curl http://localhost:3001/api/dids

# Logs
docker-compose logs backend
docker-compose logs db
```

---

## 📋 CHECKLIST DE VALIDACIÓN

### Después de FASE 1
- [ ] .env.local creado
- [ ] schema.prisma no corrupto
- [ ] Dockerfile backend válido
- [ ] Tailwind config existe
- [ ] index.html sin importmap

### Después de FASE 2
- [ ] Select component funciona
- [ ] Dialog component cierra
- [ ] AddDidDialog valida
- [ ] Frontend rutas API correctas
- [ ] Dependencias limpias

### Después de FASE 3
- [ ] Prisma generate sin errores
- [ ] Migraciones creadas
- [ ] Seed ejecutado
- [ ] Datos en DB

### Después de FASE 4
- [ ] npm run build OK
- [ ] npx tsc OK
- [ ] Sin type errors

### Después de FASE 5
- [ ] Frontend carga en localhost:3000
- [ ] Backend responde en localhost:3001
- [ ] GET /api/dids retorna DIDs
- [ ] POST /api/dids crea DID
- [ ] UI muestra DIDs de DB
- [ ] Agregar DID funciona

### Después de FASE 6
- [ ] Código limpio sin muertos
- [ ] .gitignore creado
- [ ] README actualizado

### Después de FASE 7
- [ ] Docker compose up funciona
- [ ] Todos los servicios arriba
- [ ] APIs responden

---

## ⏱️ TIEMPO ESTIMADO

| Fase | Duración | Complejidad |
|------|----------|------------|
| 1 - Reparación crítica | 30 min | 🟢 Baja |
| 2 - Reparar código | 45 min | 🟡 Media |
| 3 - Base de datos | 20 min | 🟢 Baja |
| 4 - Compilar y testear | 15 min | 🟢 Baja |
| 5 - Ejecutar localmente | 30 min | 🟡 Media |
| 6 - Limpieza | 15 min | 🟢 Baja |
| 7 - Docker | 20 min | 🟡 Media |
| **TOTAL** | **2:55 hrs** | **🟡 Media** |

---

## 🚦 PUNTOS DE FALLO

Si tienes problemas en:

### Node/npm
- Versión incorrecta: usa `nvm` para Node 22
- Dependencias viejas: borra `node_modules` y reinstala

### Prisma
- Schema inválido: valida en [schema.prisma validator](https://www.prisma.io/)
- Migraciones fallidas: `npx prisma migrate reset`

### PostgreSQL
- No conecta: verifica `DATABASE_URL`
- Puerto ocupado: cambia puerto en `.env.local`

### TypeScript
- Errores después de cambios: borra `dist/` y vuelve a compilar

### Vite
- Módulos no encontrados: reinicia `npm run dev`
- CSS no aplica: verifica `tailwind.config.ts`

---

## ✨ PRÓXIMOS PASOS (POST-MVP)

1. **Autenticación** - JWT tokens, login
2. **Llamadas reales** - WebRTC, SDP offers
3. **Gestión de estado** - React Query o Zustand
4. **Tests** - Jest, Vitest, Playwright
5. **Logging** - Winston o Pino
6. **Monitoring** - Sentry, DataDog
7. **Deployment** - Vercel, Railway, AWS
8. **CI/CD** - GitHub Actions
9. **Documentación** - Swagger/OpenAPI
10. **Escalabilidad** - Websockets, Redis

---

**¡Buena suerte! Este plan debería dejarte con un MVP funcional en ~3 horas.**
