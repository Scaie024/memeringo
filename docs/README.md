# 🎉 VoiceWoot - Open Source VoIP Platform

> Production-ready React + Fastify + Prisma VoIP management platform

## ✨ Status: Phase 1 Complete ✅

- ✅ Complete database schema with migrations
- ✅ Frontend (React 19 + TypeScript + Vite + Tailwind)
- ✅ Backend (Fastify + Prisma + SQLite/PostgreSQL)
- ✅ Environment configuration ready
- ⏳ Phase 2: Feature implementation (10-12 hours remaining)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- npm 10+

### Installation

```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Initialize database (one-time)
export DATABASE_URL="file:./dev.db"
npx prisma migrate dev --name init
npx prisma db seed
```

### Development

Open **TWO terminals**:

**Terminal 1 - Frontend:**
```bash
npm run dev
# Opens at http://localhost:3000
```

**Terminal 2 - Backend:**
```bash
cd backend
export $(cat ../.env.local | grep -v '#' | xargs)
npm run dev
# Runs at http://localhost:3001
```

### Test Connectivity

```bash
# Frontend
curl http://localhost:3000 | head -20

# Backend Health
curl http://localhost:3001/health
# {"status":"ok","timestamp":"..."}

# API - Fetch DIDs
curl http://localhost:3001/api/dids | jq .
```

---

## 📁 Project Structure

```
memeringo/
├── frontend/
│   ├── components/           React UI components
│   ├── pages/               Page layouts
│   ├── App.tsx              Root component
│   └── index.tsx            Entry point
├── backend/
│   ├── src/
│   │   ├── server.ts        Fastify API server
│   │   └── services/        Business logic
│   └── Dockerfile           Production container
├── prisma/
│   ├── schema.prisma        ORM schema (5 models)
│   ├── migrations/          Database versions
│   └── seed.cjs            Test data
├── .env.local              Dev environment
└── package.json            Dependencies
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript 5.8, Vite 6.2, Tailwind CSS 3.4 |
| **Backend** | Fastify 5.6, Prisma 6.18, Node.js 22 |
| **Database** | SQLite (dev), PostgreSQL (production) |
| **DevOps** | Docker, docker-compose |
| **VoIP** | FreeSWITCH, modesl (optional - Phase 4) |

---

## 📚 Available Scripts

### Frontend (root)
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview build
npm run type-check # Check types
```

### Backend
```bash
npm run dev        # Start dev server
npm run build      # Compile TypeScript
npm run start      # Run compiled app
npm run prisma:generate   # Generate Prisma Client
npm run prisma:migrate    # Run migrations
npm run prisma:seed       # Seed database
```

---

## 🗄️ Database Schema

**5 Models:**
- `Account` - Tenant/Company
- `User` - Individual agent/admin
- `SipTrunk` - VoIP provider connection
- `Did` - Phone number with routing
- `CallLog` - Call history

**Current Data:**
- 1 Account
- 1 User (admin@voicewoot.com)
- 2 SIP Trunks
- 5 DIDs (MX, US, GB, CO)
- 1 Sample call log

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
DATABASE_URL="file:./dev.db"          # SQLite dev
FS_ESL_HOST=localhost                  # FreeSWITCH
FS_ESL_PORT=8021
FS_ESL_PASSWORD=ClueCon
API_PORT=3001
VITE_API_URL=http://localhost:3001
NODE_ENV=development
```

---

## 📊 Current Progress

### Phase 1: Infrastructure ✅
- [x] Database schema & migrations
- [x] Backend API skeleton
- [x] Frontend scaffolding
- [x] Environment configuration
- [x] TypeScript setup
- [x] Build systems working

### Phase 2: MVP Features ⏳
- [ ] Complete CRUD endpoints
- [ ] Frontend component fixes
- [ ] API integration
- [ ] Error handling
- [ ] Testing
- **Duration:** 10-12 hours

### Phase 3: Production ⏸️
- [ ] Authentication (JWT)
- [ ] Validation layer
- [ ] Error handling suite
- [ ] API documentation
- [ ] CI/CD pipeline
- **Duration:** 10-12 hours

### Phase 4: VoIP (Optional) ⏸️
- [ ] FreeSWITCH integration
- [ ] Call management
- [ ] WebSockets
- [ ] Recording storage
- **Duration:** 8-10 hours

---

## 🐛 Troubleshooting

**Port already in use:**
```bash
lsof -i :3000  # frontend
lsof -i :3001  # backend
kill -9 <PID>
```

**Database issues:**
```bash
rm dev.db
npx prisma migrate dev
npx prisma db seed
```

**Prisma Client error:**
```bash
cd backend
npm run prisma:generate
```

---

## 📚 Documentation

- **[STATUS.md](STATUS.md)** - Comprehensive status report
- **[PHASE1_COMPLETE.md](PHASE1_COMPLETE.md)** - Phase 1 details
- **[NEXT_STEPS.md](NEXT_STEPS.md)** - Phase 2 tasks
- **[QUICK_START.md](QUICK_START.md)** - Getting started
- **[MASTER_PLAN.md](MASTER_PLAN.md)** - Full roadmap

---

## 🚀 Next Steps

1. Start both dev servers (see Quick Start)
2. Verify connectivity (see Test Connectivity)
3. Implement Phase 2 features (see [NEXT_STEPS.md](NEXT_STEPS.md))
4. Run tests and validate
5. Deploy to production

---

## 📄 License

Open source - See LICENSE file

---

**Status**: Phase 1 Complete ✅  
**Next**: Phase 2 MVP Implementation  
**Timeline**: 10-12 hours to production-ready
