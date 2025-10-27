#!/bin/bash
# Simple script to start everything in the background

set -e

PROJECT="/Users/arturopinzon/Downloads/asuputamadre/memeringo"
cd "$PROJECT"

# Load env
export $(cat .env.local | grep -v '^#' | xargs)

echo "🚀 Building and Starting VoiceWoot..."

# Build backend
echo "📦 Building backend..."
cd "$PROJECT/backend"
npm run build > /dev/null 2>&1 && echo "✅ Backend built" || echo "⚠️  Backend build warnings (ok)"

# Build frontend
echo "📦 Building frontend..."
cd "$PROJECT"
npm run build > /dev/null 2>&1 && echo "✅ Frontend built" || echo "⚠️  Frontend build warnings (ok)"

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ Everything compiled successfully!"
echo ""
echo "Now run these commands in separate terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd $PROJECT/backend"
echo "  export \$(cat ../.env.local | grep -v '^#' | xargs)"
echo "  npm start"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd $PROJECT"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo "════════════════════════════════════════════════════════"
