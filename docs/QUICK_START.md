# VoiceWoot - Open Source Platform

## Quick Start

### Prerequisites
- Node.js 22+ installed
- npm installed

### Development

**1. Install dependencies**
```bash
npm install
cd backend && npm install && cd ..
```

**2. Initialize database (already done)**
```bash
export DATABASE_URL="file:./dev.db"
npx prisma migrate dev --name init
npx prisma db seed
```

**3. Start development servers**

Terminal 1 - Frontend:
```bash
npm run dev
# Opens at http://localhost:5173
```

Terminal 2 - Backend:
```bash
cd backend
export DATABASE_URL="file:../dev.db"
npm run dev
# Runs at http://localhost:3001
```

**4. Test the API**
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

## Project Structure

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Fastify + Prisma + PostgreSQL/SQLite
- **Database**: SQLite (dev) / PostgreSQL (production)
- **VoIP**: FreeSWITCH (optional, Phase 4)

---

## Available Scripts

### Frontend (root directory)
```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run preview       # Preview production build
npm run type-check    # Check TypeScript types
```

### Backend
```bash
npm run dev           # Start dev server
npm run build         # Compile TypeScript
npm run start         # Run compiled app
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with test data
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and adjust as needed:

```bash
DATABASE_URL="file:./dev.db"
FS_ESL_HOST=localhost
FS_ESL_PORT=8021
FS_ESL_PASSWORD=ClueCon
API_PORT=3001
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
NODE_ENV=development
```

---

## Database

- **Dev**: SQLite (`dev.db`) - no setup needed
- **Prod**: PostgreSQL - configure in `.env.local`

### Manage Database
```bash
# View schema
npx prisma studio

# Create migration
npx prisma migrate dev

# Reset database
npx prisma migrate reset
```

---

## Current Status

✅ **Phase 1 Complete** - Core infrastructure ready
- Database initialized and seeded
- Both frontend and backend compile
- Environment configured
- Ready for feature development

📋 **Phase 2 In Progress** - MVP features
- [ ] Frontend component fixes
- [ ] Backend API completion
- [ ] E2E integration testing

---

## Troubleshooting

**Port 3001 already in use?**
```bash
lsof -i :3001
kill -9 <PID>
```

**Port 5173 already in use?**
```bash
lsof -i :5173
kill -9 <PID>
```

**Database locked?**
```bash
rm dev.db
npx prisma migrate dev
npx prisma db seed
```

**Prisma client not found?**
```bash
cd backend && npm run prisma:generate
```

---

## Documentation

- See `PHASE1_COMPLETE.md` for Phase 1 completion details
- See `MASTER_PLAN.md` for full development roadmap
- See `AUDIT_REPORT.md` for initial repository analysis

---

## Support

For issues, check:
1. That ports 3001 and 5173 are free
2. That `.env.local` exists with DATABASE_URL
3. That `dev.db` exists in the root directory
4. Run `npm install` again if dependencies are missing

---

**Last Updated**: 2025-10-24
**Status**: Phase 1 Complete, Phase 2 In Progress
