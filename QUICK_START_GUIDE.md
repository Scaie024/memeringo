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

### Opción 2: Con Docker (Recomendado para producción y pruebas SIP/RTP)

1) Abre Docker Desktop (asegúrate de que el daemon esté corriendo).

2) Inicia solo FreeSWITCH para pruebas locales de SIP/RTP:
```bash
cd /Users/arturopinzon/Desktop/voicewoot/memeringo
docker compose -f docker-compose-freeswitch-only.yml up -d
```

3) Verifica estado y puertos:
```bash
docker compose -f docker-compose-freeswitch-only.yml ps
docker logs -f freeswitch_pbx
```

4) Backend y Frontend (host):
```bash
# Backend (prod estable)
cd /Users/arturopinzon/Desktop/voicewoot/memeringo/backend
npm run build && npm start

# Frontend (dev)
cd /Users/arturopinzon/Desktop/voicewoot/memeringo
npm run dev
```

5) Acceder:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- FreeSWITCH CLI: `docker exec -it freeswitch_pbx fs_cli`

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


## 🧪 Prueba SIP/RTP local (eco 9000)

Con FreeSWITCH corriendo en Docker y el backend conectado al ESL:

1) Desde la UI agrega un DID con número `9000` (sirve como botón de prueba).
2) Haz clic en "Llamar" sobre ese DID: el backend originará `9000` por el perfil interno y escucharás un eco (RTP OK).
3) Alternativas:
	- API directa: `curl -X POST http://localhost:3001/api/calls/originate -H 'Content-Type: application/json' -d '{"phoneNumber":"9000"}'`
	- Softphone (Linphone/Zoiper): Llama a `sip:9000@127.0.0.1` (no requiere registro, solo llamada directa IP) y escucha el eco.

Si no hay audio, revisa:
- Firewall de macOS (permitir UDP 16384-32768)
- Logs: `docker logs -f freeswitch_pbx` y backend
- ESL conectado: `curl http://localhost:3001/api/freeswitch/status`

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

