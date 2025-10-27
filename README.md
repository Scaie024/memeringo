# 🎯 VoiceWoot - Enterprise PBX with FreeSWITCH

**Open Source Voice Communication Platform**  
**For connecting agents with customers via VoIP**

---

## 📋 Overview

VoiceWoot is a complete enterprise PBX system that combines:

- **Frontend:** React + Vite (Modern UI for agent management)
- **Backend:** Node.js Fastify (REST API for DIDs, calls, routing)
- **PBX Engine:** FreeSWITCH (SIP/RTP telephony engine)
- **Database:** SQLite + Prisma ORM (DIDs, trunks, call logs)

**Perfect for:** Call centers, contact centers, VoIP services, and voice-enabled applications.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js:** v22.17.0+
- **npm:** 10.9.2+
- **Docker:** (optional, for FreeSWITCH containerization)

### Installation

```bash
# 1. Navigate to project
cd /Users/arturopinzon/Desktop/voicewoot/memeringo

# 2. Install dependencies
npm install
npm --prefix backend install

# 3. Initialize database
cd backend && npx prisma migrate dev --name init && npm run seed && cd ..

# 4. Start all services
npm run dev              # Terminal 1: Frontend (port 5173)
npm --prefix backend run dev  # Terminal 2: Backend (port 3001)
```

### With Docker (FreeSWITCH)

```bash
docker-compose up -d

# Wait for health checks (~30s)
docker-compose ps
```

---

## 📁 Project Structure

```
voicewoot/memeringo/
├── backend/                    # Node.js Fastify API
│   ├── src/
│   │   ├── server.ts          # Main server
│   │   └── services/
│   │       └── freeswitch.service.ts  # ESL integration
│   ├── prisma/                # Database schema & migrations
│   └── package.json
│
├── frontend/                   # React + Vite UI
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   ├── layouts/               # Layout wrappers
│   ├── lib/                   # API client & utilities
│   └── types.ts               # TypeScript types
│
├── freeswitch/                # FreeSWITCH configuration
│   ├── conf/
│   │   ├── autoload_configs/  # Sofia SIP, event_socket, RTP
│   │   ├── dialplan/          # Call routing rules
│   │   ├── sip_profiles/      # SIP profiles
│   │   └── switch.conf.xml    # Core config
│
├── prisma/                    # Database ORM
│   ├── schema.prisma          # Data models
│   ├── migrations/            # DB migrations
│   └── seed.ts                # Sample data
│
├── docker-compose.yml         # Docker orchestration
├── package.json               # Frontend deps
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
│
└── docs/                      # Documentation & guides
```

---

## 🔌 API Endpoints

### DIDs Management
```bash
GET    /api/dids                    # List all DIDs
POST   /api/dids                    # Create new DID
PUT    /api/dids/:id                # Update DID
DELETE /api/dids/:id                # Delete DID
```

### Calls
```bash
POST   /api/calls/originate         # Start outbound call
GET    /api/freeswitch/status       # Check FreeSWITCH status
```

### Health
```bash
GET    /health                      # API health check
```

---

## 🎤 Features

✅ **DIDs Management** - Create, update, delete phone numbers  
✅ **Call Routing** - Route calls to agents, IVR, webhooks  
✅ **SIP Integration** - Sofia SIP profile for internal/external calls  
✅ **RTP Orchestration** - Audio streaming on ports 16384-32768  
✅ **ESL Control** - Event Socket Layer for call control  
✅ **Call Logging** - Track calls with timestamps & recordings  
✅ **Multi-trunk Support** - Connect multiple VoIP providers  
✅ **Web UI** - Modern interface for agent management  

---

## 🔧 Configuration

### Environment Variables

Create `.env` in `backend/`:

```env
DATABASE_URL=file:./dev.db
FS_ESL_HOST=freeswitch
FS_ESL_PORT=8021
FS_ESL_PASSWORD=ClueCon
FS_DIAL_GATEWAY=my_trunk
LOG_LEVEL=debug
```

### FreeSWITCH

Key configurations in `freeswitch/conf/`:

- **sofia.conf.xml** - SIP profiles (internal/external)
- **dialplan/default.xml** - Call routing rules
- **vars.xml** - Codecs, ports, network settings
- **event_socket.conf.xml** - ESL connection & ACL

---

## 📊 Database Schema

```sql
-- Accounts (tenants)
CREATE TABLE accounts (id, name, email);

-- Users (agents)
CREATE TABLE users (id, email, password, accountId);

-- SIP Trunks (VoIP providers)
CREATE TABLE sip_trunks (id, name, host, port, username, status, accountId);

-- DIDs (phone numbers)
CREATE TABLE dids (id, phoneNumber, country, routeType, routeTarget, trunkId, accountId);

-- Call Logs (history)
CREATE TABLE call_logs (id, didId, fromNumber, toNumber, duration, status, startTime, recordingUrl);
```

---

## 🚢 Deployment

### Docker Production

```yaml
# docker-compose.yml includes:
- FreeSWITCH PBX (healthcheck)
- Backend API (healthcheck)
- Frontend UI (no dependencies)
- SQLite volume persistence
- RTP port range exposure
```

### Manual Deployment

1. **Build backend:**
   ```bash
   npm --prefix backend run build
   ```

2. **Build frontend:**
   ```bash
   npm run build
   ```

3. **Start services:**
   ```bash
   NODE_ENV=production npm --prefix backend start
   ```

---

## 🐛 Troubleshooting

### Backend not connecting to FreeSWITCH
```bash
# Check ESL is listening
docker-compose exec freeswitch netstat -tulpn | grep 8021

# Verify connection
curl http://localhost:3001/api/freeswitch/status
```

### RTP Audio Issues
```bash
# Check port range
ss -u -n | grep 163

# Verify codec negotiation
docker-compose exec freeswitch fs_cli -x "list_codecs"
```

### DIDs not routing
```bash
# Check dialplan
docker-compose exec freeswitch fs_cli -x "dialplan list"

# Test echo
docker-compose exec freeswitch fs_cli -x "originate sofia/internal/9000@freeswitch &echo()"
```

---

## 📖 Documentation

See `docs/` folder for detailed guides:

- **PLAN_CRITICO_SIP_RTP_ORQUESTACION.md** - SIP/RTP architecture
- **VALIDACION_FINAL_SIP_RTP.md** - System validation checklist
- **QUICK_START_PRUEBAS.sh** - Quick test script
- **SETUP_SIP_RTP_COMPLETO.sh** - Complete setup script

---

## 🤝 Contributing

1. Clone repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📝 License

Open Source - Use as needed for your projects

---

## 📧 Support

For issues, questions, or contributions:
- Check `docs/` for guides
- Review `backend/src/` for API implementation
- Check `freeswitch/conf/` for PBX configuration

---

## 🎯 Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | Node.js | v22.17.0 |
| Runtime | Fastify | Latest |
| Database | SQLite | Latest |
| ORM | Prisma | v6.18.0 |
| Frontend | React | Latest |
| Build | Vite | v6.4.1 |
| Styles | Tailwind CSS | Latest |
| PBX | FreeSWITCH | Latest |
| Container | Docker | Latest |

---

**Last Updated:** October 27, 2025  
**Status:** 🟢 Fully Operational
