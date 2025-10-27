# 🎓 RECOMENDACIONES Y ARQUITECTURA - PHASE 2

**Documento de Planificación**: Mejoras y funcionalidades pendientes  
**Fecha**: 26 de Octubre de 2025  
**Status**: Listos para Phase 2 después de reinicio exitoso

---

## 🏗️ ARQUITECTURA ACTUAL

```
┌─────────────────────────────────────────────────────────────┐
│                        USUARIO/NAVEGADOR                     │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────▼────────────┐
         │   FRONTEND (Vite)      │
         │  React 19 + TypeScript │
         │    Port 3000           │
         │  ├─ Components         │
         │  ├─ Pages              │
         │  ├─ Hooks              │
         │  └─ API Service        │
         └────────────┬───────────┘
                      │ HTTP/REST
         ┌───────────▼──────────────┐
         │  BACKEND (Fastify)       │
         │  TypeScript + ESL        │
         │    Port 3001             │
         │  ├─ API Routes           │
         │  ├─ Services             │
         │  ├─ Prisma ORM           │
         │  └─ FreeSWITCH Adapter   │
         └────────────┬─────────────┘
                      │
    ┌─────────────────┴──────────────┐
    │                                │
┌───▼─────────────┐      ┌──────────▼─────┐
│  DATABASE       │      │  FreeSWITCH    │
│  SQLite/PG      │      │  ESL Gateway   │
│  (Prisma)       │      │  (modesl)      │
└─────────────────┘      └────────────────┘
```

---

## 📋 COMPONENTES POR COMPLETAR

### 1. Componentes UI Core

| Componente | Estado | Prioridad | Tareas |
|-----------|--------|-----------|--------|
| `Select.tsx` | ⚠️ Broken | CRITICAL | Fijar onChange handler, testing |
| `Dialog.tsx` | ⚠️ Partial | HIGH | Fijar close button, modal behavior |
| `Input.tsx` | ✅ OK | - | - |
| `Button.tsx` | ✅ OK | - | - |
| `Table.tsx` | ✅ OK | - | - |
| `Badge.tsx` | ✅ OK | - | - |
| `Label.tsx` | ✅ OK | - | - |
| `Toast` | ❌ Missing | HIGH | Crear sistema de notificaciones |
| `ErrorBoundary` | ❌ Missing | HIGH | Manejo de errores global |

### 2. Componentes Feature

| Componente | Estado | Prioridad | Tareas |
|-----------|--------|-----------|--------|
| `AddDidDialog.tsx` | ⚠️ Partial | HIGH | Validación, error handling |
| `Dialer.tsx` | ❌ WIP | MEDIUM | Componente de marcación |
| `ConversationView.tsx` | ❌ WIP | MEDIUM | Vista de conversaciones |
| `CallLog.tsx` | ⚠️ Partial | MEDIUM | Filtrado, búsqueda |
| `DidsDataTable.tsx` | ✅ OK | - | - |
| `DidsToolbar.tsx` | ✅ OK | - | - |

### 3. Features Faltantes

| Feature | Estado | Est. Horas | Dependencies |
|---------|--------|-----------|--------------|
| Validación de entrada | ❌ | 2-3 | zod o joi |
| Error handling global | ❌ | 2-3 | Error boundary, Toast |
| Autenticación JWT | ❌ | 4-5 | jsonwebtoken, bcrypt |
| Rate limiting | ❌ | 1-2 | express-rate-limit |
| Logging centralizado | ❌ | 2-3 | winston o pino |
| Tests unitarios | ❌ | 5-6 | Jest, React Testing Library |
| Tests E2E | ❌ | 4-5 | Cypress o Playwright |
| CI/CD pipeline | ❌ | 3-4 | GitHub Actions |
| Docker ready | ⚠️ Partial | 1-2 | Dockerfile optimizado |
| API Documentation | ❌ | 2-3 | Swagger/OpenAPI |

---

## 🛠️ STACK RECOMENDADO PARA PHASE 2

### Backend Improvements

```bash
# Validación
npm install zod    # Schema validation

# Logging
npm install pino   # Fast JSON logger

# Security
npm install jsonwebtoken
npm install bcrypt

# Rate limiting
npm install @fastify/rate-limit

# Documentation
npm install @fastify/swagger
```

### Frontend Improvements

```bash
# Forms
npm install react-hook-form    # Form state management

# UI Notifications
npm install sonner            # Toast notifications

# State Management (opcional)
npm install zustand           # State management

# Testing
npm install --save-dev vitest
npm install --save-dev @testing-library/react
```

---

## 📝 TAREAS INMEDIATAS (Antes de Phase 2)

### 1. Fijar Componentes Rotos

#### Tarea 1.1: Corregir `Select.tsx`

**Problema**:
```tsx
// ❌ ACTUAL (no funciona)
<select onChange={handleChange} />

// ✅ CORRECCIÓN
const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setCountry(e.target.value);
};
```

**Pasos**:
1. Revisar `components/ui/Select.tsx`
2. Fijar evento onChange
3. Testear en `AddDidDialog.tsx`

#### Tarea 1.2: Corregir `Dialog.tsx`

**Problema**: DialogClose no cierra modal correctamente

**Pasos**:
1. Revisar `components/ui/Dialog.tsx`
2. Asegurar que prop `onOpenChange` se ejecute
3. Testear cierre con botón y ESC key

#### Tarea 1.3: Crear `Toast.tsx` component

```tsx
// components/ui/Toast.tsx
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  return {
    toasts,
    addToast: (message, type) => { /* ... */ }
  };
}
```

#### Tarea 1.4: Crear `ErrorBoundary.tsx`

```tsx
// components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error) {
    // Log error, show UI
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

## 🔐 IMPLEMENTAR AUTENTICACIÓN (Phase 2.5)

### Backend Changes

```typescript
// backend/src/middleware/auth.ts
import jwt from 'jsonwebtoken';

export async function authenticateUser(request, reply) {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
  } catch (error) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}

// En server.ts
fastify.addHook('preHandler', authenticateUser);
```

### Frontend Changes

```typescript
// lib/api.ts - Agregar token a requests
static async request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  return fetch(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    }
  });
}
```

---

## 📊 VALIDACIÓN DE ENTRADA

### Backend - Usar Zod

```typescript
// backend/src/validators/did.ts
import { z } from 'zod';

export const CreateDidSchema = z.object({
  phoneNumber: z.string().min(10).max(15),
  country: z.enum(['MX', 'US', 'GB', 'CO', 'ES']),
  routeType: z.enum(['AGENT', 'IVR', 'QUEUE', 'N8N_WEBHOOK']),
});

// En server.ts
fastify.post('/api/dids', async (request, reply) => {
  const validated = CreateDidSchema.parse(request.body);
  // ... resto del código
});
```

### Frontend - Usar React Hook Form

```typescript
// components/AddDidDialog.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, errors } = useForm({
  resolver: zodResolver(CreateDidSchema),
});
```

---

## 🧪 TESTING STRATEGY

### Unit Tests (Backend)

```typescript
// backend/src/__tests__/dids.test.ts
describe('DIDs API', () => {
  it('should create a DID with valid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/dids',
      payload: { phoneNumber: '+525511223344', country: 'MX' }
    });
    expect(response.statusCode).toBe(201);
  });

  it('should reject invalid phone number', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/dids',
      payload: { phoneNumber: 'invalid' }
    });
    expect(response.statusCode).toBe(400);
  });
});
```

### Component Tests (Frontend)

```typescript
// components/__tests__/AddDidDialog.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { AddDidDialog } from '../AddDidDialog';

describe('AddDidDialog', () => {
  it('should render dialog when open', () => {
    render(<AddDidDialog isOpen={true} onClose={() => {}} onAddDid={() => {}} />);
    expect(screen.getByText(/agregar did/i)).toBeInTheDocument();
  });

  it('should call onAddDid when form submitted', async () => {
    const onAddDid = jest.fn();
    render(<AddDidDialog isOpen={true} onClose={() => {}} onAddDid={onAddDid} />);
    
    const input = screen.getByPlaceholderText(/phone/i);
    fireEvent.change(input, { target: { value: '+525511223344' } });
    fireEvent.click(screen.getByText(/guardar/i));
    
    expect(onAddDid).toHaveBeenCalled();
  });
});
```

---

## 🚀 DEPLOYMENT STRATEGY

### Development
```bash
npm run dev           # Frontend
npm run dev          # Backend (separate terminal)
```

### Production

#### Docker Production

```dockerfile
# Dockerfile.production
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json .
RUN npm install --production
CMD ["node", "dist/server.js"]
```

#### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:3001

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgres://user:pass@postgres:5432/voicewoot
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: voicewoot
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 📈 ROADMAP PHASE 2 & 3

### Phase 2: MVP Features (10-12 horas)
- [x] CRUD DIDs
- [ ] Validación de entrada
- [ ] Error handling global
- [ ] Toast notifications
- [ ] Componentes UI fixes
- [ ] API integration testing
- [ ] Performance optimization

### Phase 2.5: Authentication (4-5 horas)
- [ ] JWT implementation
- [ ] Password hashing (bcrypt)
- [ ] Login/logout endpoints
- [ ] Protected routes
- [ ] User session management

### Phase 3: Production Ready (10-12 horas)
- [ ] Rate limiting
- [ ] Comprehensive logging
- [ ] API documentation (Swagger)
- [ ] Unit tests (80% coverage)
- [ ] E2E tests
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Performance monitoring

### Phase 4: FreeSWITCH Integration (8-10 horas) - Optional
- [ ] ESL connection optimization
- [ ] Call management
- [ ] WebSocket support
- [ ] Recording handling
- [ ] Voicemail system

---

## 💡 BEST PRACTICES RECOMENDADAS

### Backend

```typescript
// 1. Type Safety - Usar tipos explícitos
interface CreateDidRequest {
  phoneNumber: string;
  country: CountryCode;
}

// 2. Error Handling - Ser específico
try {
  const did = await prisma.did.create({ data });
} catch (error) {
  if (error.code === 'P2002') {
    return reply.status(409).send({ error: 'Phone exists' });
  }
  throw error;
}

// 3. Logging - Para debugging
logger.info('Creating DID', { phoneNumber, country });
logger.error('Failed to create DID', { error: error.message });

// 4. Validation - Antes de procesar
const validated = schema.parse(request.body);
```

### Frontend

```typescript
// 1. Component Composition - Dividir en partes
export function DidsPage() {
  return (
    <Layout>
      <Header />
      <Toolbar />
      <Table />
      <Dialog />
    </Layout>
  );
}

// 2. State Management - Minimal y clear
const [dids, setDids] = useState<Did[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// 3. Effects - Cleanup
useEffect(() => {
  const abortController = new AbortController();
  
  fetchDids(abortController.signal);
  
  return () => abortController.abort();
}, []);

// 4. Error Boundaries - Graceful degradation
<ErrorBoundary>
  <DidsPage />
</ErrorBoundary>
```

---

## 🎯 MÉTRICAS DE ÉXITO

### Phase 2 Complete Cuando:
- ✅ 0 TypeScript errors
- ✅ 100% API endpoints funcionan
- ✅ UI responsiva en mobile/tablet/desktop
- ✅ CRUD completo: Create, Read, Update, Delete
- ✅ Error handling visible al usuario
- ✅ Loading states en todas las operaciones
- ✅ No más de 3 segundos latencia en requests
- ✅ Código formateado (Prettier)
- ✅ Linting limpio (ESLint)

### Phase 3 Complete Cuando:
- ✅ Autenticación funcionando
- ✅ 80%+ test coverage
- ✅ CI/CD pipeline activo
- ✅ API documented (Swagger)
- ✅ Performance: Lighthouse 90+
- ✅ Security: OWASP Top 10 covered
- ✅ Zero console warnings
- ✅ Ready for production deploy

---

## 📚 RECURSOS Y DOCUMENTACIÓN

### Tutoriales Recomendados
- [Fastify Guide](https://www.fastify.io/docs/latest/)
- [React 19 Docs](https://react.dev)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Librerías Recomendadas
- **Validation**: Zod, Joi
- **Logging**: Pino, Winston
- **Testing**: Jest, Vitest, Cypress
- **Auth**: Auth0, Supabase, NextAuth
- **State**: Zustand, Jotai, Recoil
- **Forms**: React Hook Form, Formik
- **HTTP**: Axios, Fetch API
- **UI**: Shadcn/ui, Radix, Headless UI

### Tools Recomendadas
- **Code Quality**: Prettier, ESLint, Husky
- **API Testing**: Postman, Insomnia, REST Client
- **Debugging**: Redux DevTools, React DevTools
- **Monitoring**: Sentry, LogRocket
- **Database**: DBeaver, pgAdmin

---

## 🎓 CONCLUSIÓN

VoiceWoot es una aplicación bien estructurada lista para desarrollo acelerado. 

**Próximos pasos**:
1. ✅ Ejecutar plan de reinicio
2. ✅ Verificar todo funciona
3. ✅ Fijar componentes rotos (Select, Dialog)
4. ✅ Implementar validación y error handling
5. ✅ Agregar tests
6. ✅ Implementar autenticación
7. ✅ Deploy a producción

**Tiempo estimado**: 25-30 horas para MVP + Auth

---

**Documento generado por GitHub Copilot**  
**Última actualización**: 26-Oct-2025  
**Status**: ✅ LISTO PARA PHASE 2 DESPUÉS DEL REINICIO
