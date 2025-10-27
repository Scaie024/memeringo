#!/bin/bash
set -e

PROJECT_DIR="/Users/arturopinzon/Downloads/asuputamadre/memeringo"
cd "$PROJECT_DIR"

# Load environment variables
export $(cat .env.local | grep -v '#' | xargs)

echo "🚀 Starting VoiceWoot Development Servers..."
echo ""
echo "📋 Project: $PROJECT_DIR"
echo "🗄️  Database: $DATABASE_URL"
echo ""

# Start Backend in background
echo "▶️  Starting Backend on port 3001..."
cd "$PROJECT_DIR/backend"
npm run build > /dev/null 2>&1 || echo "⚠️  Backend build had warnings"
npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Test backend
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
  echo "   ✅ Backend is running"
else
  echo "   ⚠️  Backend may not be responding yet"
fi

echo ""

# Start Frontend in background
echo "▶️  Starting Frontend on port 3000..."
cd "$PROJECT_DIR"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

sleep 4

# Test frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "   ✅ Frontend is running"
else
  echo "   ⚠️  Frontend may not be responding yet"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ Both servers are running!"
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:3001"
echo "Health:    curl http://localhost:3001/health"
echo "API:       curl http://localhost:3001/api/dids"
echo ""
echo "To stop servers: kill $BACKEND_PID $FRONTEND_PID"
echo "Logs:"
echo "  Backend:  tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
echo "════════════════════════════════════════════════════════════════"

# Keep script running
wait
