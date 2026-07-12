# MyScriptum — App Next.js

Plataforma de estudio bíblico. Ver [`../README.md`](../README.md) para propósito, visión y roadmap.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El redirect `/` → `/home` está en `next.config.ts`.

## Scripts principales

| Script | Función |
|---|---|
| `npm run dev` | Servidor de desarrollo con Turbopack |
| `npm run build` | Auditar + preparar estáticos + build de producción |
| `npm run start` | Servir la build |
| `npm run generate:analysis` | Regenerar los JSON de estudio (`data/bible/{context,analysis}/`) por libro. Pasa `--force` para sobreescribir; los capítulos en `CURATED_CHAPTERS` (en el script) se protegen siempre. |
| `npm run audit:analysis` | Escanear los 1189 capítulos, generar `data/bible/quality-report.json` y `data/bible/generic-manifest.json` |

## Estado del contenido de estudio

**Importante:** el contenido de las pestañas Contexto / Análisis / Etimología / Conexiones / Preguntas se generó originalmente con un script Mad-Lib (`scripts/generate-analysis.ts`) y el 99% son plantillas — datos correctos a nivel de libro (periodo, imperio, rey, profetas) pero relleno genérico a nivel de capítulo.

- El auditor (`npm run audit:analysis`) emite un **manifiesto** con qué pestañas están genéricas por capítulo.
- La UI carga ese manifiesto y muestra un **badge 🚧 "Contenido genérico"** en cada pestaña marcada para no engañar al usuario.
- Los capítulos **curados a mano** salen del manifiesto y no muestran el badge. Ejemplo actual: `jonah:1`.

Para curar un capítulo a mano:
1. Escribir los 5 JSON en `data/bible/{context,analysis,etymology,connections,questions}/<book>/<n>.json` siguiendo el molde de Jonás 1.
2. Añadir `<book>:<n>` al `CURATED_CHAPTERS` en `scripts/generate-analysis.ts` para que no se sobreescriba en la próxima regeneración.
3. `npm run audit:analysis` — el capítulo debe salir del `generic-manifest.json`.

## Stack real

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · zustand · swr · zod · Radix UI · lucide-react · **@xyflow/react** (grafo de conexiones bíblicas).

Persistencia 100% localStorage (prefijo `myscriptum:`). No hay Prisma/PostgreSQL/NextAuth — versiones antiguas del README raíz los mencionan pero no están instalados.
