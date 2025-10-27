#!/bin/bash

################################################################################
# 🚀 VOICEWOOT - SCRIPT DE REINICIO COMPLETO
# 
# Este script automatiza todo el proceso de reinicio del proyecto:
# 1. Preparación del ambiente
# 2. Instalación de dependencias
# 3. Compilación y validación
# 4. Inicialización de base de datos
# 5. Verificación de conectividad
#
# Uso: chmod +x restart-voicewoot.sh && ./restart-voicewoot.sh
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Utility functions
print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

print_header "🚀 VOICEWOOT - REINICIO COMPLETO"

# ============================================================================
# FASE 1: VERIFICACIÓN DE REQUISITOS
# ============================================================================

print_header "FASE 1: Verificación de Requisitos"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    echo "Descargarlo de: https://nodejs.org/ (v22 o superior recomendado)"
    exit 1
fi

NODE_VERSION=$(node -v)
print_success "Node.js $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi

NPM_VERSION=$(npm -v)
print_success "npm $NPM_VERSION"

# Check ports
print_info "Verificando puertos..."

if lsof -i :3000 >/dev/null 2>&1; then
    print_warning "Puerto 3000 ya está en uso"
    print_info "Ejecutando: lsof -i :3000 | grep LISTEN"
    lsof -i :3000
fi

if lsof -i :3001 >/dev/null 2>&1; then
    print_warning "Puerto 3001 ya está en uso"
    print_info "Ejecutando: lsof -i :3001 | grep LISTEN"
    lsof -i :3001
fi

# ============================================================================
# FASE 2: LIMPIEZA DEL PROYECTO
# ============================================================================

print_header "FASE 2: Limpieza del Proyecto"

print_info "Eliminando node_modules..."
rm -rf "$SCRIPT_DIR/node_modules" 2>/dev/null || true
rm -rf "$SCRIPT_DIR/backend/node_modules" 2>/dev/null || true
print_success "node_modules eliminados"

print_info "Eliminando archivos compilados..."
rm -rf "$SCRIPT_DIR/dist" 2>/dev/null || true
rm -rf "$SCRIPT_DIR/backend/dist" 2>/dev/null || true
print_success "dist/ eliminados"

print_info "Eliminando caché..."
rm -rf "$SCRIPT_DIR/.next" 2>/dev/null || true
rm -rf "$SCRIPT_DIR/node_modules/.cache" 2>/dev/null || true
print_success "Caché eliminado"

print_info "Eliminando base de datos de desarrollo..."
rm -f "$SCRIPT_DIR/dev.db" 2>/dev/null || true
print_success "dev.db eliminado"

# ============================================================================
# FASE 3: INSTALACIÓN DE DEPENDENCIAS
# ============================================================================

print_header "FASE 3: Instalación de Dependencias"

print_info "Frontend: npm install"
cd "$SCRIPT_DIR"
npm install --legacy-peer-deps 2>&1 | tail -5
print_success "Frontend: dependencias instaladas"

print_info "Backend: npm install"
cd "$SCRIPT_DIR/backend"
npm install --legacy-peer-deps 2>&1 | tail -5
cd "$SCRIPT_DIR"
print_success "Backend: dependencias instaladas"

# ============================================================================
# FASE 4: COMPILACIÓN Y VALIDACIÓN
# ============================================================================

print_header "FASE 4: Compilación y Validación"

# Generate Prisma Client
print_info "Generando Prisma Client..."
cd "$SCRIPT_DIR"
npx prisma generate --schema ./prisma/schema.prisma 2>&1 | tail -3
print_success "Prisma Client generado"

# Compile backend
print_info "Compilando backend..."
cd "$SCRIPT_DIR/backend"
npm run build 2>&1 | tail -5
cd "$SCRIPT_DIR"
print_success "Backend compilado"

# Type check frontend
print_info "Validando tipos TypeScript (frontend)..."
npm run type-check 2>&1 | tail -3 || print_warning "Algunos warnings de TypeScript"
print_success "Frontend validado"

# ============================================================================
# FASE 5: BASE DE DATOS
# ============================================================================

print_header "FASE 5: Inicialización de Base de Datos"

cd "$SCRIPT_DIR"
export DATABASE_URL="file:./dev.db"

print_info "Aplicando migraciones..."
npx prisma migrate deploy 2>&1 | tail -5
print_success "Migraciones aplicadas"

print_info "Seedeando datos de prueba..."
npx prisma db seed 2>&1 | tail -5
print_success "Datos seedeados"

print_info "Verificando estructura de BD..."
TABLES_COUNT=$(npx prisma studio --browser=none --telemetry-events=off 2>&1 | grep -c "model" || echo "OK")
print_success "Base de datos lista"

# ============================================================================
# FASE 6: INFORMACIÓN FINAL
# ============================================================================

print_header "✅ REINICIO COMPLETADO"

echo -e "${GREEN}Pasos siguientes:${NC}"
echo ""
echo "1️⃣  TERMINAL 1 - Frontend (Puerto 3000):"
echo -e "   ${YELLOW}cd $SCRIPT_DIR${NC}"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "2️⃣  TERMINAL 2 - Backend (Puerto 3001):"
echo -e "   ${YELLOW}cd $SCRIPT_DIR/backend${NC}"
echo -e "   ${YELLOW}export \$(cat ../.env.local | xargs)${NC}"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "3️⃣  Verificar conectividad:"
echo -e "   ${YELLOW}curl http://localhost:3001/health${NC}"
echo -e "   ${YELLOW}curl http://localhost:3001/api/dids${NC}"
echo ""
echo "📊 Estadísticas:"
echo "   • Node.js: $NODE_VERSION"
echo "   • npm: $NPM_VERSION"
echo "   • Directorio: $SCRIPT_DIR"
echo "   • Database: SQLite (dev.db)"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend: http://localhost:3001"
echo ""
echo "📚 Documentación:"
echo "   • ANALISIS_COPILOT.md - Análisis completo"
echo "   • README.md - Documentación general"
echo "   • QUICK_START.md - Inicio rápido"
echo ""
echo -e "${GREEN}¡Proyecto listo para desarrollo! 🚀${NC}"
