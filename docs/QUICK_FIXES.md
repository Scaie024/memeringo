# 🔧 SOLUCIONES RÁPIDAS PARA PROBLEMAS CRÍTICOS

## 1. ✅ RECONSTRUIR PRISMA SCHEMA

**Archivo:** `prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Account {
  id    String  @id @default(cuid())
  name  String
  dids  Did[]
  trunks SipTrunk[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SipTrunk {
  id        String   @id @default(cuid())
  name      String
  host      String
  port      Int      @default(5060)
  username  String?
  password  String?
  status    String   @default("UNREGISTERED")
  
  account   Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
  accountId String
  
  dids      Did[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([host, accountId])
}

model Did {
  id            String   @id @default(cuid())
  phoneNumber   String   @unique
  country       String   // MX | US | GB | CO | ES
  status        String   @default("INACTIVE") // ACTIVE | INACTIVE | PROVISIONING
  
  routeType     String   // AGENT | IVR | QUEUE | N8N_WEBHOOK
  routeTarget   String   // ID o URL del destino
  
  trunk         SipTrunk? @relation(fields: [trunkId], references: [id], onDelete: SetNull)
  trunkId       String?
  
  account       Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
  accountId     String
  
  callLogs      CallLog[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@unique([phoneNumber, accountId])
}

model CallLog {
  id            String   @id @default(cuid())
  did           Did      @relation(fields: [didId], references: [id], onDelete: Cascade)
  didId         String
  
  fromNumber    String
  toNumber      String
  duration      Int      @default(0) // en segundos
  status        String   @default("INITIATED") // INITIATED | RINGING | ACTIVE | COMPLETED | FAILED
  
  transcript    Json?    // Array de {speaker, text, timestamp}
  recordings    String?  // URL o path a grabación
  
  startTime     DateTime
  endTime       DateTime?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([didId])
  @@index([startTime])
}
```

---

## 2. ✅ CREAR .env Y .env.local

**Archivo:** `.env.example`

```bash
# Database
DATABASE_URL="postgresql://voicewoot:voicewootpassword@localhost:5432/voicewootdb"

# FreeSWITCH ESL
FS_ESL_HOST=localhost
FS_ESL_PORT=8021
FS_ESL_PASSWORD=ClueCon

# Frontend
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

# Node
NODE_ENV=development
```

**Archivo:** `.env.local` (para desarrollo local)

```bash
DATABASE_URL="postgresql://voicewoot:voicewootpassword@localhost:5432/voicewootdb"
FS_ESL_HOST=localhost
FS_ESL_PORT=8021
FS_ESL_PASSWORD=ClueCon
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
NODE_ENV=development
```

---

## 3. ✅ CREAR backend/Dockerfile CORRECTO

**Archivo:** `backend/Dockerfile`

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

# Ejecutar en desarrollo (cambiar a "start" en producción)
CMD ["npm", "run", "dev"]
```

---

## 4. ✅ CREAR tailwind.config.ts

**Archivo:** `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./layouts/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
        },
        teal: {
          500: '#14b8a6',
          400: '#2dd4bf',
          300: '#5eead4',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config
```

---

## 5. ✅ CREAR postcss.config.cjs

**Archivo:** `postcss.config.cjs`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## 6. ✅ CREAR vite.env.d.ts

**Archivo:** `vite.env.d.ts`

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## 7. ✅ ARREGLAR frontend package.json

**Cambio en:** `package.json`

```json
{
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

**Quitar:** `fastify`, `express`, `modesl`, `@prisma/client`, `cors`, etc. (NO son para frontend)

---

## 8. ✅ ARREGLAR rutas API en DidsPage.tsx

```typescript
// pages/DidsPage.tsx
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const DidsPage = () => {
  // ...
  
  const fetchDids = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/dids`);
      if (!response.ok) throw new Error('Failed to fetch DIDs');
      const data = await response.json();
      setDids(data);
    } catch (error) {
      console.error("Failed to fetch DIDs:", error);
      // Mostrar error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDid = async (phoneNumber: string, country: CountryCode) => {
    try {
      const response = await fetch(`${API_URL}/api/dids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, country }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add DID');
      }
      await fetchDids();
    } catch (error) {
      console.error("Error adding DID:", error);
      // Mostrar error al usuario
    }
  };
  
  // ... resto del código
};
```

---

## 9. ✅ ARREGLAR Select y Dialog Components

**Archivo:** `components/ui/Select.tsx` (REEMPLAZAR)

```typescript
import * as React from 'react';
import { cn } from '../../lib/utils';

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
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
  )
);
Select.displayName = 'Select';

const SelectItem = React.forwardRef<HTMLOptionElement, React.OptionHTMLAttributes<HTMLOptionElement>>(
  (props, ref) => <option ref={ref} {...props} />
);
SelectItem.displayName = 'SelectItem';

export { Select, SelectItem };
```

**Archivo:** `components/ui/Dialog.tsx` (REEMPLAZAR)

```typescript
import * as React from 'react';
import { cn } from '../../lib/utils';
import { XIcon } from '../icons/Icons';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = ({ children, open, onOpenChange }: DialogProps) => {
  if (!open) return null;
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  );
};

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
      onClick={onClose}
      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
    >
      <XIcon className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  </div>
));
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight text-white', className)} {...props} />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-gray-400', className)} {...props} />
));
DialogDescription.displayName = 'DialogDescription';

export { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
```

---

## 10. ✅ ARREGLAR AddDidDialog.tsx

```typescript
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select, SelectItem } from './ui/Select';
import { Did, CountryCode } from '../types';
import { t } from '../lib/i18n';

interface AddDidDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDid: (phoneNumber: string, country: CountryCode) => Promise<void>;
}

export const AddDidDialog: React.FC<AddDidDialogProps> = ({ isOpen, onClose, onAddDid }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState<CountryCode>('MX');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }
    
    setError(null);
    setIsSaving(true);
    
    try {
      await onAddDid(phoneNumber, country);
      setPhoneNumber('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add DID');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onClose={onClose} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.didsPage.addModal.title}</DialogTitle>
          <DialogDescription>
            {t.didsPage.addModal.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              {t.didsPage.addModal.phoneNumber}
            </Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t.didsPage.addModal.phoneNumberPlaceholder}
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">
              {t.didsPage.addModal.country}
            </Label>
            <Select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value as CountryCode)}
              className="col-span-3"
              disabled={isSaving}
            >
              <SelectItem value="MX">México (MX)</SelectItem>
              <SelectItem value="US">United States (US)</SelectItem>
              <SelectItem value="GB">United Kingdom (GB)</SelectItem>
              <SelectItem value="CO">Colombia (CO)</SelectItem>
              <SelectItem value="ES">España (ES)</SelectItem>
            </Select>
          </div>
          
          {error && (
            <div className="col-span-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-300">
              {error}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
            disabled={isSaving}
          >
            {t.didsPage.addModal.cancel}
          </Button>
          <Button 
            type="button" 
            onClick={handleSave} 
            disabled={isSaving || !phoneNumber.trim()}
          >
            {isSaving ? 'Guardando...' : t.didsPage.addModal.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

---

## 11. ✅ CREAR PRIMERA MIGRACIÓN

```bash
cd backend
npx prisma migrate dev --name init
```

Esto creará `prisma/migrations/[timestamp]_init/` con el SQL necesario.

---

## 12. ✅ ARREGLAR backend package.json

Cambiar versión de Prisma:

```json
{
  "dependencies": {
    "@fastify/cors": "^11.1.0",
    "@prisma/client": "^6.18.0",
    "dotenv": "^16.4.5",
    "fastify": "^5.6.1"
  }
}
```

---

## 13. ✅ VALIDAR VARIABLES DE ENTORNO

**Archivo:** `backend/src/server.ts`

```typescript
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

// Validar variables de entorno
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

// API Routes aquí...

const start = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('✅ Backend server listening on http://0.0.0.0:3001');
  } catch (err) {
    console.error('❌ Failed to start:', err);
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

## 14. ✅ ACTUALIZAR index.html

**Quitar el importmap completamente**, dejar solo:

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
    <style>
      body {
        font-family: 'Inter', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    </style>
  </head>
  <body class="bg-gray-900 text-gray-100">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

---

## 📋 PASOS PARA EJECUTAR

### 1. Instalar dependencias del frontend
```bash
npm install
```

### 2. Instalar dependencias del backend
```bash
cd backend
npm install
cd ..
```

### 3. Crear archivos de configuración
```bash
cp .env.example .env.local
```

### 4. Ejecutar migraciones
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
cd ..
```

### 5. Ejecutar frontend en terminal 1
```bash
npm run dev
```

### 6. Ejecutar backend en terminal 2
```bash
cd backend
npm run dev
```

### 7. Acceder a http://localhost:3000

---

## ⚠️ NOTAS IMPORTANTES

- Estos arreglos son "parches rápidos" para que funcione lo básico
- Falta **FreeSWITCH configurado y ejecutándose**
- Falta **WebRTC para llamadas reales**
- Falta **autenticación y autorización**
- Falta **manejo robusto de errores**
- Falta **logging centralizado**
- Falta **tests**

Este es un MVP muy básico. Para producción, hay mucho más trabajo por hacer.
