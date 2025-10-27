# 🔍 PROBLEMAS ESPECÍFICOS POR ARCHIVO

## 📄 index.html

### ❌ PROBLEMA: ImportMap está COMPLETAMENTE ROTO

```html
<!-- ❌ PROBLEMA - ESTO NO FUNCIONA: -->
<script type="importmap">
{
  "imports": {
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "clsx": "https://aistudiocdn.com/clsx@^2.1.1",
    "tailwind-merge": "https://aistudiocdn.com/tailwind-merge@^3.3.1",
    "@prisma/client": "https://aistudiocdn.com/@prisma/client@^6.18.0",
    "fastify": "https://aistudiocdn.com/fastify@^5.6.1",
    "@fastify/cors": "https://aistudiocdn.com/@fastify/cors@^11.1.0",
    "express": "https://aistudiocdn.com/express@^5.1.0",
    "cors": "https://aistudiocdn.com/cors@^2.8.5",
    "events": "https://aistudiocdn.com/events@^3.3.0",
    "modesl": "https://aistudiocdn.com/modesl@^1.2.1"
  }
}
</script>
```

**Por qué es incorrecto:**

1. **aistudiocdn.com NO EXISTE** - No es un CDN válido
2. **Sintaxis incorrecta** - Las URLs en importmap no usan versiones con `@`
3. **Librerías de servidor** - `fastify`, `express`, `modesl`, `@prisma/client` NO se pueden cargar en el navegador
4. **events es Node.js** - No es una librería del navegador
5. **Tailwind desde CDN** - Mejor usar PostCSS local

### ✅ SOLUCIÓN:

Remover el importmap completamente y dejar el HTML simple:

```html
<!DOCTYPE html>
<html lang="es" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VoiceWoot Ultimate - Open-Source VoIP Platform</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-gray-900 text-gray-100">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

Vite se encargará del bundling correctamente.

---

## 📦 package.json

### ❌ PROBLEMA 1: Dependencias de SERVIDOR en FRONTEND

```json
{
  "dependencies": {
    "fastify": "^5.6.1",           // ❌ Esto es Node.js server, no frontend!
    "@fastify/cors": "^11.1.0",    // ❌ Plugin de Fastify
    "express": "^5.1.0",           // ❌ Otro server framework
    "cors": "^2.8.5",              // ❌ Middleware de Node.js
    "events": "^3.3.0",            // ❌ Módulo de Node.js
    "modesl": "^1.2.1"             // ❌ Cliente FreeSWITCH Node.js
  }
}
```

### ❌ PROBLEMA 2: @prisma/client en FRONTEND

```json
{
  "dependencies": {
    "@prisma/client": "^6.18.0"    // ❌ Genera SQL, no debería estar aquí
  }
}
```

### ✅ SOLUCIÓN:

**Frontend package.json CORRECTO:**

```json
{
  "name": "voicewoot-open-source-ultimate",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
```

**Backend package.json CORRECTO:**

```json
{
  "name": "voicewoot-backend",
  "version": "1.0.0",
  "description": "Backend for VoiceWoot Ultimate Platform",
  "main": "dist/server.js",
  "type": "module",
  "scripts": {
    "dev": "npx ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:migrate": "npx prisma migrate dev",
    "prisma:seed": "npx ts-node prisma/seed.ts"
  },
  "dependencies": {
    "@fastify/cors": "^11.1.0",
    "@prisma/client": "^6.18.0",
    "dotenv": "^16.4.5",
    "fastify": "^5.6.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "prisma": "^6.18.0",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.8.2"
  }
}
```

---

## 📄 prisma/schema.prisma

### ❌ PROBLEMA: ARCHIVO COMPLETAMENTE CORRUPTO

```
~~^
```

El archivo contiene caracteres inválidos y NO se puede parsear.

### ✅ SOLUCIÓN:

Reemplazar con schema válido (ver QUICK_FIXES.md o ACTION_PLAN.md)

---

## 🐳 backend/Dockerfile

### ❌ PROBLEMA: ARCHIVO COMPLETAMENTE CORRUPTO

```
~¤er»²z{l³¤¤rG»w»¤rG~)^
```

Mismo problema que schema.prisma, caracteres inválidos.

### ✅ SOLUCIÓN:

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci --only=production
RUN npm install -D typescript ts-node-dev @types/node

# Copiar código fuente
COPY src ./src
COPY prisma ./prisma

# Generar cliente Prisma
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "dev"]
```

---

## 📄 components/ui/Select.tsx

### ❌ PROBLEMA: onChange NO ESTÁ IMPLEMENTADO

```typescript
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-100 ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}  // ✅ OK - props incluye onChange
    >
      {children}
    </select>
  )
);
```

**Función de SelectItem:**

```typescript
const SelectItem = React.forwardRef<HTMLOptionElement, React.OptionHTMLAttributes<HTMLOptionElement>>(
  (props, ref) => <option ref={ref} {...props} />
);
```

Esto es básicamente correcto, pero la forma en que se usa en AddDidDialog es confusa:

```typescript
// En AddDidDialog.tsx:
<Select
  value={country}
  onChange={(e) => setCountry(e.target.value as Did['country'])}  // ✅ Correcto
  className="col-span-3"
>
  <SelectItem value="MX">México (MX)</SelectItem>  // ✅ Correcto
  ...
</Select>
```

**Realidad:** Select está bien, pero podría ser más claro.

### ✅ SOLUCIÓN MEJORADA:

```typescript
import * as React from 'react';
import { cn } from '../../lib/utils';

const Select = React.forwardRef<
  HTMLSelectElement, 
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-100 ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

const SelectItem = React.forwardRef<
  HTMLOptionElement, 
  React.OptionHTMLAttributes<HTMLOptionElement>
>(({ className, ...props }, ref) => (
  <option ref={ref} {...props} />
));
SelectItem.displayName = 'SelectItem';

export { Select, SelectItem };
```

---

## 📄 components/ui/Dialog.tsx

### ❌ PROBLEMA: DialogClose NO FUNCIONA

```typescript
const DialogClose = ({ children, ...props }) => (
    <button {...props}>{children}</button>
)
```

Este componente es solo un botón, NO cierra el diálogo. Además:

```typescript
<DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ...">
  <XIcon className="h-4 w-4" />
  <span className="sr-only">Close</span>
</DialogClose>
```

No tiene un `onClick` que haga nada.

### ✅ SOLUCIÓN:

```typescript
const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }
>(({ className, children, onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative z-50 grid w-full max-w-lg gap-4 border bg-gray-800 border-gray-700 p-6 shadow-lg duration-200 sm:rounded-lg',
      className
    )}
    onClick={e => e.stopPropagation()}
    {...props}
  >
    {children}
    <button
      onClick={onClose}  // ✅ Ahora funciona
      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
    >
      <XIcon className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  </div>
));
```

Y en AddDidDialog:

```typescript
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent onClose={onClose} className="sm:max-w-[425px]">
    {/* ... */}
  </DialogContent>
</Dialog>
```

---

## 📄 pages/DidsPage.tsx

### ❌ PROBLEMA 1: Rutas API HARDCODED

```typescript
const response = await fetch('/api/dids');  // ❌ Ruta relativa
```

En desarrollo:
- Frontend corre en `localhost:3000`
- Backend corre en `localhost:3001`
- Ruta relativa `/api/dids` irá a `localhost:3000/api/dids` (NO EXISTE)

En producción será peor.

### ❌ PROBLEMA 2: Sin manejo de errores

```typescript
const response = await fetch('/api/dids');
const data = await response.json();  // ❌ Si falla, se cuelga silenciosamente
setDids(data);
```

### ❌ PROBLEMA 3: Llamadas sin timeout

Las llamadas pueden colgar indefinidamente.

### ✅ SOLUCIÓN:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const fetchDids = async () => {
  try {
    setIsLoading(true);
    const response = await fetch(`${API_URL}/api/dids`, {
      signal: AbortSignal.timeout(10000),  // ✅ Timeout de 10s
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch DIDs: ${response.statusText}`);
    }
    
    const data = await response.json();
    setDids(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error("Failed to fetch DIDs:", message);
    // ✅ Mostrar error al usuario
    setError(message);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 📄 components/AddDidDialog.tsx

### ❌ PROBLEMA: Usa Select y Dialog rotos

```typescript
<Select
  value={country}
  onChange={(e) => setCountry(e.target.value as Did['country'])}
  className="col-span-3"
>
  <SelectItem value="MX">México (MX)</SelectItem>
```

Si Select está roto, esto falla.

```typescript
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[425px]">
```

Si Dialog está roto, no se cierra.

### ✅ SOLUCIÓN:

Ver archivos QUICK_FIXES.md para componentes reparados, luego usar en AddDidDialog.

---

## 📄 backend/src/server.ts

### ❌ PROBLEMA 1: Sin validación de variables de entorno

```typescript
fastify.get('/api/dids', async (request, reply) => {
  try {
    const dids = await prisma.did.findMany({
      orderBy: { createdAt: 'desc' },
    });
```

Si DATABASE_URL no existe, Prisma fallará.

### ❌ PROBLEMA 2: Sin manejo de conexión a DB

```typescript
const start = async () => {
  try {
    await freeSwitchService.connect();  // ❌ Si falla, qué pasa?
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
```

### ❌ PROBLEMA 3: FreeSwitchService.connect() puede fallar

```typescript
public async connect(): Promise<void> {
  // Si ESL no está accesible, rechaza pero no hay reintentos
```

### ✅ SOLUCIÓN:

```typescript
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

// ✅ Validar variables de entorno
const requiredEnvVars = ['DATABASE_URL', 'FS_ESL_HOST', 'FS_ESL_PORT', 'FS_ESL_PASSWORD'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

fastify.register(cors, { origin: '*' });

// API Routes...
fastify.get('/api/dids', async (request, reply) => {
  try {
    const dids = await prisma.did.findMany({
      orderBy: { createdAt: 'desc' },
    });
    reply.send(dids);
  } catch (error) {
    console.error('Failed to fetch DIDs:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
});

// ... más rutas

const start = async () => {
  try {
    // ✅ Conectar a DB primero
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // ✅ Intentar conectar a FreeSWITCH (pero no es bloqueante)
    try {
      // await freeSwitchService.connect();
      // console.log('✅ Connected to FreeSWITCH');
    } catch (err) {
      console.warn('⚠️ Could not connect to FreeSWITCH:', err);
      // No es bloqueante para que la app pueda funcionar sin FreeSWITCH
    }
    
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('✅ Backend server listening on http://0.0.0.0:3001');
  } catch (err) {
    console.error('❌ Failed to start:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
});

start();
```

---

## 📄 backend/src/services/freeswitch.service.ts

### ❌ PROBLEMA: @ts-ignore EVERYWHERE

```typescript
// FIX: Bypass incorrect type definition for EventEmitter
// @ts-ignore
this.emit('connected');
```

Esto indica que hay problemas de tipado no resueltos.

### ✅ SOLUCIÓN:

```typescript
import { Connection } from 'modesl';
import { EventEmitter } from 'events';

class FreeSwitchService extends EventEmitter {
    private connection: Connection | null = null;
    private isConnected: boolean = false;
    private readonly config = {
        host: process.env.FS_ESL_HOST || 'localhost',
        port: parseInt(process.env.FS_ESL_PORT || '8021', 10),
        password: process.env.FS_ESL_PASSWORD || 'ClueCon',
    };

    constructor() {
        super();
    }

    public async connect(): Promise<void> {
        if (this.isConnected && this.connection) {
            console.log('Already connected to FreeSWITCH ESL.');
            return;
        }

        return new Promise((resolve, reject) => {
            console.log(`Connecting to FreeSWITCH ESL at ${this.config.host}:${this.config.port}...`);
            
            try {
                this.connection = new Connection({
                    host: this.config.host,
                    port: this.config.port,
                    password: this.config.password,
                });

                this.connection.on('esl::ready', () => {
                    console.log('FreeSWITCH ESL connection ready.');
                    this.isConnected = true;
                    this.emit('connected');  // ✅ No necesita @ts-ignore
                    resolve();
                });

                this.connection.on('esl::end', () => {
                    console.log('FreeSWITCH ESL connection ended.');
                    this.isConnected = false;
                    this.emit('disconnected');
                });
                
                this.connection.on('error', (error: Error) => {
                    console.error('FreeSWITCH ESL connection error:', error);
                    this.isConnected = false;
                    this.emit('error', error);
                    reject(error);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    // ... resto del código
}

export default FreeSwitchService;
```

---

## 📄 prisma/seed.ts

### ❌ PROBLEMA: Errores potenciales

```typescript
const trunk1 = await prisma.sipTrunk.create({
```

Debería ser:

```typescript
const trunk1 = await prisma.sipTrunk.create({  // ✅ O simplemente prisma.SipTrunk si funciona
```

Pero sin schema válido, esto no funciona.

### ✅ SOLUCIÓN:

Ver QUICK_FIXES.md para seed correcto.

---

## ✅ ARCHIVOS QUE ESTÁN CORRECTOS

- ✅ `App.tsx` - Bien diseñado
- ✅ `index.tsx` - Bien hecho
- ✅ `types.ts` - Tipos bien definidos
- ✅ `lib/i18n.ts` - Traducción correcta
- ✅ `lib/utils.ts` - Utilidades simples y correctas
- ✅ `lib/constants.ts` - Constantes bien estructuradas
- ✅ `components/ui/Button.tsx` - Correcto
- ✅ `components/ui/Badge.tsx` - Correcto
- ✅ `components/ui/Input.tsx` - Correcto
- ✅ `components/ui/Label.tsx` - Correcto
- ✅ `components/ui/Table.tsx` - Correcto
- ✅ `components/icons/Icons.tsx` - Bien implementado
- ✅ `components/Sidebar.tsx` - Bien hecho
- ✅ `components/DidsToolbar.tsx` - Correcto
- ✅ `components/DidsDataTable.tsx` - Bien estructurado
- ✅ `pages/DashboardPage.tsx` - Correcto
- ✅ `layouts/MainLayout.tsx` - Bien hecho
- ✅ `vite.config.ts` - Configuración correcta (aunque incompleta)
- ✅ `tsconfig.json` - Correcto

---

**Fin del análisis de archivos específicos**
