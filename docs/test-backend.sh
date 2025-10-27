#!/usr/bin/env zsh

# 🧪 Script de Pruebas Completas - VoiceWoot Backend & Frontend
# Fecha: 24 de octubre de 2025

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║        🧪 PRUEBAS COMPLETAS: BACKEND + FRONTEND              ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
BACKEND_URL="http://localhost:3001"
PASS=0
FAIL=0

# Función para pruebas HTTP
test_endpoint() {
    local METHOD=$1
    local ENDPOINT=$2
    local BODY=$3
    local EXPECTED_STATUS=$4
    local DESCRIPTION=$5

    echo ""
    echo "${BLUE}📝 Test: $DESCRIPTION${NC}"
    echo "   $METHOD $BACKEND_URL$ENDPOINT"

    if [ -z "$BODY" ]; then
        RESPONSE=$(curl -s -w "\n%{http_code}" -X "$METHOD" "$BACKEND_URL$ENDPOINT")
    else
        RESPONSE=$(curl -s -w "\n%{http_code}" -X "$METHOD" "$BACKEND_URL$ENDPOINT" \
            -H "Content-Type: application/json" \
            -d "$BODY")
    fi

    STATUS_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY_RESPONSE=$(echo "$RESPONSE" | head -n-1)

    echo "   Response Status: $STATUS_CODE"
    
    if [ "$STATUS_CODE" = "$EXPECTED_STATUS" ]; then
        echo "${GREEN}✅ PASS${NC} (Expected $EXPECTED_STATUS)"
        PASS=$((PASS + 1))
        # Mostrar primeras 200 caracteres del body
        echo "   Body: $(echo "$BODY_RESPONSE" | head -c 200)..."
    else
        echo "${RED}❌ FAIL${NC} (Expected $EXPECTED_STATUS, got $STATUS_CODE)"
        FAIL=$((FAIL + 1))
        echo "   Body: $BODY_RESPONSE"
    fi
}

# Esperar a que el backend esté listo
echo "${YELLOW}⏳ Esperando a que el backend esté disponible...${NC}"
for i in {1..10}; do
    if curl -s "$BACKEND_URL/health" > /dev/null 2>&1; then
        echo "${GREEN}✅ Backend disponible${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "${RED}❌ Backend no disponible después de 10 intentos${NC}"
        exit 1
    fi
    echo "   Intento $i/10..."
    sleep 1
done

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PRUEBAS DE CONECTIVIDAD"
echo "═══════════════════════════════════════════════════════════════"

test_endpoint "GET" "/health" "" "200" "Health check del backend"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PRUEBAS GET /api/dids"
echo "═══════════════════════════════════════════════════════════════"

test_endpoint "GET" "/api/dids" "" "200" "Obtener todos los DIDs"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PRUEBAS POST /api/dids"
echo "═══════════════════════════════════════════════════════════════"

test_endpoint "POST" "/api/dids" \
    '{"phoneNumber":"+555111222333","country":"BR"}' \
    "201" \
    "Crear DID válido (Brasil)"

test_endpoint "POST" "/api/dids" \
    '{"phoneNumber":"+555111222333","country":"BR"}' \
    "409" \
    "Intentar crear DID duplicado (debe fallar)"

test_endpoint "POST" "/api/dids" \
    '{"country":"MX"}' \
    "400" \
    "Crear DID sin phoneNumber (debe fallar)"

test_endpoint "POST" "/api/dids" \
    '{"phoneNumber":"+555222333444"}' \
    "400" \
    "Crear DID sin country (debe fallar)"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PRUEBAS PUT /api/dids/:id"
echo "═══════════════════════════════════════════════════════════════"

# Obtener el primer DID para hacer update
DID_ID=$(curl -s "$BACKEND_URL/api/dids" | jq -r '.[0].id' 2>/dev/null)

if [ ! -z "$DID_ID" ] && [ "$DID_ID" != "null" ]; then
    test_endpoint "PUT" "/api/dids/$DID_ID" \
        '{"routeTarget":"updated_target"}' \
        "200" \
        "Actualizar DID existente (routeTarget)"

    test_endpoint "PUT" "/api/dids/nonexistent_id" \
        '{"routeTarget":"test"}' \
        "404" \
        "Actualizar DID inexistente (debe fallar)"
else
    echo "${YELLOW}⚠️  No hay DIDs para hacer update${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PRUEBAS DELETE /api/dids/:id"
echo "═══════════════════════════════════════════════════════════════"

if [ ! -z "$DID_ID" ] && [ "$DID_ID" != "null" ]; then
    # Crear un DID temporal para borrar
    TEMP_DID=$(curl -s -X POST "$BACKEND_URL/api/dids" \
        -H "Content-Type: application/json" \
        -d '{"phoneNumber":"+555999888777","country":"CO"}' | jq -r '.id' 2>/dev/null)

    if [ ! -z "$TEMP_DID" ] && [ "$TEMP_DID" != "null" ]; then
        test_endpoint "DELETE" "/api/dids/$TEMP_DID" "" "200" "Eliminar DID existente"
    fi
    
    test_endpoint "DELETE" "/api/dids/nonexistent_id" "" "404" "Eliminar DID inexistente (debe fallar)"
else
    echo "${YELLOW}⚠️  No hay DIDs para hacer delete${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PRUEBAS DE TIPOS DE DATOS"
echo "═══════════════════════════════════════════════════════════════"

echo ""
echo "${BLUE}📝 Test: Validar estructura de respuesta GET /api/dids${NC}"

DIDS=$(curl -s "$BACKEND_URL/api/dids")
FIRST_DID=$(echo "$DIDS" | jq '.[0]' 2>/dev/null)

if [ ! -z "$FIRST_DID" ] && [ "$FIRST_DID" != "null" ]; then
    REQUIRED_FIELDS=("id" "phoneNumber" "country" "status" "routeType" "routeTarget" "createdAt" "accountId")
    
    for field in "${REQUIRED_FIELDS[@]}"; do
        VALUE=$(echo "$FIRST_DID" | jq -r ".$field" 2>/dev/null)
        if [ ! -z "$VALUE" ] && [ "$VALUE" != "null" ]; then
            echo "${GREEN}✅${NC} Campo presente: $field = $VALUE"
            PASS=$((PASS + 1))
        else
            echo "${RED}❌${NC} Campo faltante o null: $field"
            FAIL=$((FAIL + 1))
        fi
    done
else
    echo "${YELLOW}⚠️  No hay DIDs para validar estructura${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "RESUMEN DE PRUEBAS"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "${GREEN}✅ Pasadas: $PASS${NC}"
echo "${RED}❌ Fallidas: $FAIL${NC}"
echo ""

TOTAL=$((PASS + FAIL))
if [ $FAIL -eq 0 ]; then
    echo "${GREEN}🎉 ¡TODAS LAS PRUEBAS PASARON!${NC}"
    exit 0
else
    PERCENTAGE=$((PASS * 100 / TOTAL))
    echo "${YELLOW}⚠️  Tasa de éxito: $PERCENTAGE% ($PASS/$TOTAL)${NC}"
    exit 1
fi
