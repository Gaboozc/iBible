# Roadmap de Implementación — MyScriptum

## 🎯 Visión General

Este documento define los pasos concretos para llevar MyScriptum de la planificación a producción.

---

## 📅 Fases del Proyecto

```
Fase 0: Planificación ✅ (Completado)
   ↓
Fase 1: Fundación Técnica 🔧 (Próximo)
   ↓
Fase 2: MVP — Ezequiel Piloto
   ↓
Fase 3: Contenido Completo MVP
   ↓
Fase 4: Lanzamiento Beta
   ↓
Fase 5: Expansión
```

---

## ✅ Fase 0: Planificación y Diseño (COMPLETADO)

**Duración:** 1-2 semanas  
**Estado:** ✅ Completado

### Entregables:
- ✅ [PROJECT_VISION.md](PROJECT_VISION.md) — Visión y características
- ✅ [ARCHITECTURE.md](ARCHITECTURE.md) — Arquitectura completa
- ✅ [TECH_STACK.md](TECH_STACK.md) — Decisiones técnicas
- ✅ [SCHEMA_PRISMA.md](SCHEMA_PRISMA.md) — Modelo de datos
- ✅ [CONTENT_PLAN.md](CONTENT_PLAN.md) — Estrategia de contenido
- ✅ [README.md](README.md) — Documentación principal

---

## 🔧 Fase 1: Fundación Técnica

**Duración estimada:** 2-3 semanas  
**Estado:** 🔜 Pendiente

### Objetivo:
Crear la infraestructura técnica base del proyecto: código inicial, base de datos, y componentes fundamentales.

---

### Sprint 1.1: Inicialización del Proyecto (3-5 días)

#### Tareas:

**1. Crear proyecto Next.js**
```bash
npx create-next-app@latest myscriptum \
  --typescript \
  --tailwind \
  --app \
  --eslint
cd myscriptum
```

**2. Instalar dependencias principales**
```bash
# Prisma + DB
npm install @prisma/client
npm install -D prisma

# Autenticación
npm install next-auth bcryptjs
npm install -D @types/bcryptjs

# State management
npm install swr zustand

# Validación
npm install zod

# Componentes UI
npm install @radix-ui/react-dropdown-menu \
           @radix-ui/react-dialog \
           @radix-ui/react-select

# Iconos
npm install lucide-react

# Visualización (timeline)
npm install d3 recharts
npm install -D @types/d3
```

**3. Configurar estructura de carpetas**
```
myscriptum/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (study)/
│   │   │   ├── [testament]/
│   │   │   │   └── [book]/
│   │   │   │       └── [chapter]/
│   │   │   └── timeline/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── books/
│   │   │   ├── chapters/
│   │   │   ├── verses/
│   │   │   ├── timeline/
│   │   │   └── user/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Bible/
│   │   │   ├── ChapterView.tsx
│   │   │   ├── VerseCard.tsx
│   │   │   └── BibleNavigation.tsx
│   │   ├── Study/
│   │   │   ├── HistoricalContext.tsx
│   │   │   ├── StructuralAnalysis.tsx
│   │   │   ├── Etymology.tsx
│   │   │   ├── Connections.tsx
│   │   │   └── ReflectionQuestions.tsx
│   │   ├── Timeline/
│   │   │   ├── TimelineView.tsx
│   │   │   ├── EventMarker.tsx
│   │   │   └── TimelineFilters.tsx
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── Shared/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Loading.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── hooks/
│   │   │   ├── useChapter.ts
│   │   │   ├── useTimeline.ts
│   │   │   └── useProgress.ts
│   │   └── utils/
│   │       ├── date.ts
│   │       ├── format.ts
│   │       └── validation.ts
│   ├── types/
│   │   ├── bible.ts
│   │   ├── timeline.ts
│   │   └── user.ts
│   └── styles/
│       └── globals.css
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   ├── images/
│   └── locales/
│       ├── es/
│       └── en/
├── .env.local
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

**4. Configurar Git y GitHub**
```bash
git init
git add .
git commit -m "Initial commit: Next.js + TypeScript + Tailwind"
git branch -M main
git remote add origin https://github.com/Gaboozc/iBible.git
git push -u origin main
```

---

### Sprint 1.2: Configuración de Base de Datos (3-5 días)

#### Tareas:

**1. Crear archivo Prisma Schema**
```bash
npx prisma init
```

Copiar contenido de [SCHEMA_PRISMA.md](SCHEMA_PRISMA.md) a `prisma/schema.prisma`

**2. Configurar PostgreSQL**

**Opción A: Supabase (recomendado)**
```bash
# Crear proyecto en https://supabase.com
# Copiar DATABASE_URL
```

**Opción B: PostgreSQL local**
```bash
# Instalar PostgreSQL
sudo apt install postgresql

# Crear base de datos
createdb myscriptum_dev
```

**3. Variables de entorno**
```env
# .env.local
DATABASE_URL="postgresql://usuario:contraseña@host:5432/myscriptum"
NEXTAUTH_SECRET="generar-con-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

**4. Crear migraciones**
```bash
npx prisma migrate dev --name init
```

**5. Generar cliente Prisma**
```bash
npx prisma generate
```

**6. Crear archivo de seed inicial**
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear Testamentos
  const at = await prisma.testament.create({
    data: {
      name: 'Antiguo Testamento',
      nameEn: 'Old Testament',
      slug: 'antiguo-testamento',
      order: 1,
    },
  });

  const nt = await prisma.testament.create({
    data: {
      name: 'Nuevo Testamento',
      nameEn: 'New Testament',
      slug: 'nuevo-testamento',
      order: 2,
    },
  });

  // Crear libro de Ezequiel
  const ezequiel = await prisma.book.create({
    data: {
      testamentId: at.id,
      name: 'Ezequiel',
      nameEn: 'Ezekiel',
      slug: 'ezequiel',
      abbreviation: 'Ez',
      order: 26,
      authorTraditional: 'Ezequiel hijo de Buzí',
      dateApproximate: '593-571 a.C.',
      literaryGenre: 'Profético, Apocalíptico',
      literaryGenreEn: 'Prophetic, Apocalyptic',
      originalAudience: 'Judíos en exilio babilónico',
      originalAudienceEn: 'Jews in Babylonian exile',
      centralTheme: 'La gloria de YHWH abandona y restaura',
      centralThemeEn: 'The glory of YHWH departs and returns',
      historicalLocation: 'Exilio en Babilonia',
      historicalLocationEn: 'Babylonian Exile',
    },
  });

  console.log({ at, nt, ezequiel });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**7. Ejecutar seed**
```bash
npx prisma db seed
```

---

### Sprint 1.3: Componentes UI Base (5-7 días)

#### Tareas:

**1. Configurar Tailwind con tema personalizado**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          700: '#1d4ed8',
        },
        // Paleta completa
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
};
```

**2. Crear componentes compartidos**
- `Button.tsx`
- `Card.tsx`
- `Loading.tsx`
- `ErrorBoundary.tsx`

**3. Crear layout principal**
- `Header.tsx` con navegación y selector de idioma
- `Sidebar.tsx` con navegación de libros
- `Footer.tsx`

**4. Crear página de inicio**
- Landing page con descripción
- Call-to-action para registro

---

### Sprint 1.4: API Routes Básicas (3-5 días)

#### Tareas:

**1. API: Testamentos y Libros**
```typescript
// app/api/books/route.ts
import { prisma } from '@/lib/prisma';

export async function GET() {
  const testaments = await prisma.testament.findMany({
    include: {
      books: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  });
  
  return Response.json(testaments);
}
```

**2. API: Capítulos**
```typescript
// app/api/chapters/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const chapter = await prisma.chapter.findUnique({
    where: { id: params.id },
    include: {
      verses: true,
      historicalContext: true,
      reflectionQuestions: true,
      connections: {
        include: { to: { include: { book: true } } },
      },
    },
  });
  
  return Response.json(chapter);
}
```

**3. API: Timeline**
```typescript
// app/api/timeline/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const empire = searchParams.get('empire');
  
  // Implementar lógica de timeline
  return Response.json([]);
}
```

**4. Configurar NextAuth.js**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // Configuración
    }),
  ],
});

export { handler as GET, handler as POST };
```

---

### Entregables Fase 1:
- ✅ Proyecto Next.js inicializado
- ✅ Base de datos PostgreSQL configurada
- ✅ Prisma schema implementado
- ✅ Estructura de carpetas creada
- ✅ Componentes UI base funcionales
- ✅ API routes básicas operativas
- ✅ Autenticación configurada
- ✅ Seed inicial con estructura de datos

---

## 📖 Fase 2: MVP — Ezequiel 1 Piloto

**Duración estimada:** 2-3 semanas  
**Estado:** ⏳ Pendiente

### Objetivo:
Implementar **1 capítulo completo** (Ezequiel 1) con todas las características del sistema.

---

### Sprint 2.1: Contenido de Ezequiel 1

#### Tareas:
1. Escribir contexto histórico completo (español + inglés)
2. Identificar 10 palabras clave con etimología
3. Crear 20 conexiones bíblicas
4. Escribir 12 preguntas reflexivas
5. Insertar datos en BD

---

### Sprint 2.2: Vista de Capítulo

#### Tareas:
1. Componente `ChapterView.tsx`
2. Panel de contexto histórico
3. Vista de versículos con numeración
4. Panel de análisis estructural
5. Sistema de tabs para secciones

---

### Sprint 2.3: Etimología y Conexiones

#### Tareas:
1. Componente `EtymologyCard.tsx`
2. Modal de palabra clave
3. Componente `ConnectionsList.tsx`
4. Enlaces bidireccionales

---

### Sprint 2.4: Preguntas Reflexivas

#### Tareas:
1. Componente `ReflectionQuestions.tsx`
2. Sistema de respuestas (texto)
3. Guardar progreso de usuario

---

### Entregables Fase 2:
- ✅ Ezequiel 1 completamente implementado
- ✅ Todas las secciones del flujo de estudio funcionales
- ✅ Sistema de navegación básico
- ✅ Primera experiencia completa de estudio

---

## 📚 Fase 3: Contenido Completo MVP

**Duración estimada:** 3-4 meses  
**Estado:** ⏳ Pendiente

### Sprint 3.1: Ezequiel Completo (48 capítulos)
- Replicar estructura de Ezequiel 1 para todos los capítulos
- Desarrollar timeline del exilio babilónico

### Sprint 3.2: Salmos Seleccionados (15-20)
- Implementar salmos priorizados
- Contextos históricos variados

### Sprint 3.3: Jonás Completo (4 capítulos)
- Libro completo con tipología NT

### Sprint 3.4: Timeline Interactiva
- Visualización D3.js
- Filtros por imperio, profeta, rey
- Integración con capítulos

---

## 🚀 Fase 4: Lanzamiento Beta

**Duración estimada:** 1-2 meses  
**Estado:** ⏳ Pendiente

### Tareas:
1. Testing exhaustivo
2. Optimización de performance
3. SEO y metadata
4. Deploy a Vercel
5. Configurar dominio
6. Beta cerrada (50-100 usuarios)
7. Recolección de feedback

---

## 🌟 Fase 5: Expansión

**Duración estimada:** Continuo  
**Estado:** ⏳ Futuro

### Tareas:
1. Más libros bíblicos
2. Mobile app (React Native / PWA)
3. Sistema de comunidad
4. IA asistente
5. Exportación de notas
6. Modo enseñanza

---

## 📊 Milestones

| Milestone | Fecha Objetivo | Estado |
|-----------|----------------|--------|
| M0: Planificación completa | ✅ Completado | ✅ |
| M1: Fundación técnica | Semana 3 | 🔜 |
| M2: Ezequiel 1 piloto | Semana 6 | ⏳ |
| M3: Ezequiel completo | Semana 18 | ⏳ |
| M4: MVP completo | Semana 26 | ⏳ |
| M5: Beta pública | Semana 34 | ⏳ |
| M6: Lanzamiento v1.0 | Semana 40 | ⏳ |

---

## 🎯 KPIs de Éxito

### Técnicos:
- [ ] Tiempo de carga < 2 segundos
- [ ] Lighthouse score > 90
- [ ] Test coverage > 80%
- [ ] Zero errores críticos

### Contenido:
- [ ] 3 libros completos (Ezequiel, Salmos, Jonás)
- [ ] 67 capítulos con contexto completo
- [ ] 500+ palabras clave con etimología
- [ ] 1000+ conexiones bíblicas

### Usuarios (Beta):
- [ ] 100+ usuarios registrados
- [ ] Tasa de retención > 40%
- [ ] NPS > 50
- [ ] Feedback positivo > 80%

---

## 🛠️ Herramientas de Desarrollo

| Herramienta | Propósito |
|-------------|-----------|
| **VS Code** | Editor principal |
| **Prisma Studio** | Gestión de BD visual |
| **GitHub** | Versionamiento |
| **GitHub Actions** | CI/CD |
| **Vercel** | Hosting y preview |
| **Supabase** | Base de datos |
| **Figma** | Diseño UI (opcional) |
| **Notion** | Gestión de tareas |

---

## 🚦 Próximo Paso Inmediato

**Iniciar Fase 1, Sprint 1.1:**

```bash
# 1. Crear proyecto Next.js
npx create-next-app@latest myscriptum --typescript --tailwind --app --eslint

# 2. Instalar dependencias
cd myscriptum
npm install @prisma/client next-auth bcryptjs swr zustand zod
npm install -D prisma @types/bcryptjs

# 3. Inicializar Prisma
npx prisma init

# 4. Configurar .env.local con DATABASE_URL

# 5. Copiar schema de SCHEMA_PRISMA.md a prisma/schema.prisma

# 6. Crear primera migración
npx prisma migrate dev --name init

# 7. Ejecutar servidor de desarrollo
npm run dev
```

---

¿Listo para ejecutar estos comandos y comenzar la implementación?
