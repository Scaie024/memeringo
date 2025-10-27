#!/bin/bash

# VoiceWoot + FreeSWITCH Setup Script
# Usage: chmod +x start-all.sh && ./start-all.sh

set -e

PROJECT_DIR="/Users/arturopinzon/Desktop/voicewoot/memeringo"
cd "$PROJECT_DIR"

echo "🚀 VoiceWoot + FreeSWITCH Startup Script"
echo "========================================"
echo ""

# 1. Increase file limits
echo "📁 Aumentando límite de archivos abiertos..."
ulimit -n 8192 || echo "⚠️  Podría necesitar permisos elevados"

# 2. Start FreeSWITCH Docker
echo ""
echo "🐳 Iniciando FreeSWITCH en Docker..."
if ! docker info >/dev/null 2>&1; then
  echo "❌ Docker Desktop no está corriendo. Ábrelo y vuelve a ejecutar este script."
  exit 1
fi
docker compose -f docker-compose-freeswitch-only.yml up -d
sleep 5

# 3. Check FreeSWITCH status
echo ""
echo "📋 Estado de FreeSWITCH:"
docker compose -f docker-compose-freeswitch-only.yml ps | grep freeswitch

# 4. Start Backend
echo ""
echo "⚙️  Iniciando Backend (Fastify)..."
cd backend && npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
sleep 5

# 5. Test Backend
echo ""
echo "🧪 Verificando Backend..."
if curl -s http://localhost:3001/health > /dev/null; then
  echo "✅ Backend respondiendo en http://localhost:3001"
else
  echo "❌ Backend no responde"
fi

# 6. Start Frontend
echo ""
echo "🎨 Iniciando Frontend (Vite React)..."
cd "$PROJECT_DIR" && npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
sleep 5

# 7. Test Frontend
echo ""
echo "🧪 Verificando Frontend..."
if curl -s http://localhost:5173 > /dev/null; then
  echo "✅ Frontend respondiendo en http://localhost:5173"
else
  echo "❌ Frontend no responde"
fi

echo ""
echo "========================================"
echo "✅ SISTEMA OPERACIONAL"
echo "========================================"
echo ""
echo "🌐 Accesos:"
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:3001"
echo "  Health:    http://localhost:3001/health"
echo "  DIDs API:  http://localhost:3001/api/dids"
echo ""
echo "📊 Procesos:"
echo "  Backend PID: $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo ""
echo "📜 Logs:"
echo "  Backend:  tail -f $PROJECT_DIR/backend.log"
echo "  Frontend: tail -f $PROJECT_DIR/frontend.log"
echo "  FreeSWITCH: docker logs freeswitch_pbx -f"
echo ""
echo "🛑 Para detener:"
echo "  kill $BACKEND_PID      # Backend"
echo "  kill $FRONTEND_PID     # Frontend"
echo "  docker-compose -f docker-compose-freeswitch-only.yml down  # FreeSWITCH"
echo ""
echo "💾 Archivo de estado:"
echo "  cat $PROJECT_DIR/STATUS_OPERACIONAL.txt"
echo ""
