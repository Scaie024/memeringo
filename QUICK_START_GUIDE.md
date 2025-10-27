# 📌 GUÍA DE INICIO RÁPIDO - VoiceWoot

## 🎯 Para empezar AHORA

### Opción 1: Sin Docker (Más rápido para desarrollo)

**Abre 2 terminales:**

**Terminal 1 - Backend:**
```bash
cd /Users/arturopinzon/Desktop/voicewoot/memeringo/backend
npm run dev
```
✅ Esperar: `Backend server listening on http://0.0.0.0:3001`

**Terminal 2 - Frontend:**
```bash
cd /Users/arturopinzon/Desktop/voicewoot/memeringo
npm run dev
```
✅ Esperar: `Local: http://localhost:5173`

**Acceder:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001/health

---

### Opción 2: Con Docker (Recomendado para producción)

**Una sola terminal:**
```bash
cd /Users/arturopinzon/Desktop/voicewoot/memeringo
docker-compose up -d
```

✅ Esperar 30 segundos (healthchecks)

**Verificar:**
```bash
docker-compose ps
docker-compose logs -f
```

**Acceder:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- FreeSWITCH: `docker-compose exec freeswitch fs_cli`

---

## 🧪 Pruebas Rápidas

### Test Backend
```bash
# Health check
curl http://localhost:3001/health

# Listar DIDs
curl http://localhost:3001/api/dids | jq
```

### Test Frontend
```bash
# Abrir navegador
open http://localhost:5173

# Verificar:
✓ DIDs en tabla
✓ Botón "Agregar DID"
✓ Botón "Llamar"
```

---

## 📂 Archivos Importantes

- **README.md** - Documentación principal
- **SETUP.md** - Guía detallada de setup
- **FINAL_REPORT.md** - Reporte completo
- **docker-compose.yml** - Configuración Docker
- **backend/src/server.ts** - Servidor API
- **freeswitch/conf/** - Configuración PBX

---

## 🔗 GitHub

```
https://github.com/Scaie024/memeringo
```

Status: ✅ Actualizado y sincronizado

---

## ✨ ¡Listo para Usar!

**Sistema 100% operacional. Elige cómo quieres iniciar y comienza.**

