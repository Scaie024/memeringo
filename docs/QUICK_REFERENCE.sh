#!/usr/bin/env zsh
# 📋 QUICK REFERENCE - Comandos Rápidos
# Uso: Copia y pega estos comandos en las terminales

═══════════════════════════════════════════════════════════════════════════════

# TERMINAL 1 - BACKEND
cd /Users/arturopinzon/Downloads/asuputamadre/memeringo/backend
export $(cat ../.env.local | grep -v '^#' | xargs)
npm start

# RESULTADO ESPERADO:
# ✅ Connected to database
# ✅ Backend server listening on http://0.0.0.0:3001

═══════════════════════════════════════════════════════════════════════════════

# TERMINAL 2 - FRONTEND
cd /Users/arturopinzon/Downloads/asuputamadre/memeringo
npm run dev

# RESULTADO ESPERADO:
# ➜  Local:   http://localhost:3000/

═══════════════════════════════════════════════════════════════════════════════

# TERMINAL 3 - PRUEBAS AUTOMATIZADAS
cd /Users/arturopinzon/Downloads/asuputamadre/memeringo
chmod +x test-backend.sh
./test-backend.sh

# RESULTADO ESPERADO:
# 🎉 ¡TODAS LAS PRUEBAS PASARON!

═══════════════════════════════════════════════════════════════════════════════

# PRUEBAS MANUALES - PASO POR PASO
# Lee: /Users/arturopinzon/Downloads/asuputamadre/memeringo/TEST_MANUAL.md

═══════════════════════════════════════════════════════════════════════════════

# COMANDOS ÚTILES (TERMINAL 3)

# 1. Health Check
curl http://localhost:3001/health

# 2. Obtener todos los DIDs
curl http://localhost:3001/api/dids

# 3. Obtener DIDs con formatos bonito
curl -s http://localhost:3001/api/dids | jq .

# 4. Obtener primer DID
curl -s http://localhost:3001/api/dids | jq '.[0]'

# 5. Crear nuevo DID (Brasil)
curl -X POST http://localhost:3001/api/dids \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+555123456789","country":"BR"}'

# 6. Obtener ID del primer DID (para usar en PUT/DELETE)
DID_ID=$(curl -s http://localhost:3001/api/dids | jq -r '.[0].id')
echo $DID_ID

# 7. Actualizar DID (reemplaza $DID_ID con valor real)
curl -X PUT http://localhost:3001/api/dids/$DID_ID \
  -H "Content-Type: application/json" \
  -d '{"routeTarget":"nuevo_valor"}'

# 8. Eliminar DID (reemplaza $DID_ID con valor real)
curl -X DELETE http://localhost:3001/api/dids/$DID_ID

# 9. Probar duplicado (debe fallar con 409)
curl -X POST http://localhost:3001/api/dids \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+555123456789","country":"BR"}'

# 10. Probar sin campo (debe fallar con 400)
curl -X POST http://localhost:3001/api/dids \
  -H "Content-Type: application/json" \
  -d '{"country":"MX"}'

═══════════════════════════════════════════════════════════════════════════════

# LOGS Y DEBUGGING

# Ver logs en tiempo real (TERMINAL 1 o 2)
# Los logs mostrarán:
# [timestamp] GET http://localhost:3001/api/dids → 200 ✅
# [timestamp] POST http://localhost:3001/api/dids → 201 ✅

# Abrir consola del navegador
# F12 en http://localhost:3000
# Ir a Console tab
# Verás los mismos logs que en terminal

═══════════════════════════════════════════════════════════════════════════════

# TROUBLESHOOTING RÁPIDO

# Puerto 3001 ocupado
lsof -i :3001
kill -9 <PID>

# Puerto 3000 ocupado
lsof -i :3000
kill -9 <PID>

# Problemas de tipos
cd backend
npm run prisma:generate

# Borrar base de datos
rm dev.db
cd backend
npm run prisma:migrate
npm run prisma:seed

# Reinstalar dependencias
npm install
cd backend
npm install

═══════════════════════════════════════════════════════════════════════════════

# ARCHIVOS IMPORTANTES

📄 AUDIT_COMMUNICATION.md         ← Análisis técnico completo
📄 TEST_MANUAL.md                 ← 17 pruebas manuales detalladas
📄 COMMUNICATION_IMPROVEMENTS.md   ← Resumen de mejoras
🔧 test-backend.sh                ← Pruebas automatizadas
📄 TESTING_READY.txt              ← Resumen de lo hecho
📄 AUDIT_COMPLETE.txt             ← Estado actual del sistema

═══════════════════════════════════════════════════════════════════════════════

# CHECKLIST - MARCAR CUANDO COMPLETES

Pruebas Automatizadas:
  [ ] Terminal 1: Backend iniciado
  [ ] Terminal 2: Frontend iniciado
  [ ] Terminal 3: test-backend.sh ejecutado
  [ ] test-backend.sh: ✅ TODAS LAS PRUEBAS PASARON
  [ ] Navegador: http://localhost:3000 carga sin errores

Pruebas Manuales (Ver TEST_MANUAL.md):
  [ ] Prueba 1-10: Completadas sin errores
  [ ] Prueba 11-17: Completadas sin errores
  [ ] Ciclo CRUD: Crea, Lee, Actualiza, Elimina - TODO FUNCIONA
  [ ] Error handling: Errores visibles y claros
  [ ] Checklist de aceptación: 100% marcado

═════════════════════════════════════════════════════════════════════════════

🎉 CUANDO TODO ESTÉ COMPLETO:

✅ PHASE 2 - COMPLETAMENTE PROBADO Y VALIDADO
✅ COMUNICACIÓN BACKEND-FRONTEND: 100% COHERENTE
✅ READY FOR PHASE 3

═════════════════════════════════════════════════════════════════════════════

📞 SOPORTE RÁPIDO

Si algo falla:
1. Revisar consola (F12) para errores JavaScript
2. Revisar terminal 1/2 para errores del servidor
3. Revisar TEST_MANUAL.md "Troubleshooting"
4. Revisar AUDIT_COMMUNICATION.md "Problemas Identificados"
5. Si nada funciona: Ejecutar primero los comandos de TROUBLESHOOTING RÁPIDO

═════════════════════════════════════════════════════════════════════════════

🚀 PRÓXIMO PASO: Ejecuta los 3 comandos de arriba en 3 terminales
