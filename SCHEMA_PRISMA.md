# Schema Prisma — MyScriptum

## Modelo de Datos Completo

Este documento define la estructura de la base de datos para MyScriptum en Prisma.

---

## 1. Testamentos

```prisma
model Testament {
  id        String   @id @default(cuid())
  name      String   // "Antiguo Testamento" | "Nuevo Testamento"
  nameEn    String   // "Old Testament" | "New Testament"
  slug      String   @unique
  order     Int      // Para ordenar (1, 2)
  
  books     Book[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("testaments")
}
```

---

## 2. Libros Bíblicos

```prisma
model Book {
  id              String   @id @default(cuid())
  testamentId     String
  testament       Testament @relation(fields: [testamentId], references: [id], onDelete: Cascade)
  
  name            String   // "Ezequiel"
  nameEn          String   // "Ezekiel"
  slug            String   @unique
  abbreviation    String   // "Ez"
  order           Int      // Orden dentro del testamento
  
  // Metadatos del libro
  authorTraditional   String?   // "Ezequiel hijo de Buzí"
  dateApproximate     String?   // "593-571 a.C."
  literaryGenre       String?   // "Profético, Apocalíptico"
  literaryGenreEn     String?
  originalAudience    String?   // "Judíos en exilio babilónico"
  originalAudienceEn  String?
  centralTheme        String?   // "Gloria de YHWH, Restauración"
  centralThemeEn      String?
  historicalLocation  String?   // "Exilio en Babilonia"
  historicalLocationEn String?
  
  // Relaciones
  chapters        Chapter[]
  parallelBooks   ParallelBook[] @relation("parallelFrom")
  parallelBooks2  ParallelBook[] @relation("parallelTo")
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([testamentId])
  @@map("books")
}

// Libros paralelos (ej: 2 Reyes ↔ 2 Crónicas)
model ParallelBook {
  id      String @id @default(cuid())
  fromId  String
  toId    String
  from    Book   @relation("parallelFrom", fields: [fromId], references: [id], onDelete: Cascade)
  to      Book   @relation("parallelTo", fields: [toId], references: [id], onDelete: Cascade)
  
  description String? // "Mismo evento, perspectivas diferentes"
  
  @@unique([fromId, toId])
  @@map("parallel_books")
}
```

---

## 3. Capítulos

```prisma
model Chapter {
  id              String   @id @default(cuid())
  bookId          String
  book            Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  
  number          Int      // 1, 2, 3...
  slug            String   // "ezequiel-1"
  
  // Metadatos del capítulo
  historicalPeriod     String?      // "593 a.C., 5º año del exilio"
  historicalPeriodEn   String?
  relatedEvents        String?      // "Caída inminente de Jerusalén"
  relatedEventsEn      String?
  keyCharacters        String?      // JSON array: ["Ezequiel", "La Gloria de YHWH"]
  theologicalIntensity String?      // "Profético, Apocalíptico"
  theologicalIntensityEn String?
  literaryStructure    String?      // "4 visiones (querubines, ruedas...)"
  literaryStructureEn  String?
  
  // Contexto inmediato
  contextualNotes      String?      // Notas introductorias
  contextualNotesEn    String?
  
  // Relaciones
  verses               Verse[]
  historicalContext    ChapterHistoricalContext?
  reflectionQuestions  ReflectionQuestion[]
  studyFlows           StudyFlow[]
  connections          ChapterConnection[] @relation("from")
  connectedTo          ChapterConnection[] @relation("to")
  
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  
  @@unique([bookId, number])
  @@index([bookId])
  @@index([slug])
  @@map("chapters")
}
```

---

## 4. Versículos

```prisma
model Verse {
  id            String   @id @default(cuid())
  chapterId     String
  chapter       Chapter  @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  
  number        Int      // 1, 2, 3...
  text          String   @db.Text
  textEn        String?  @db.Text
  
  // Texto original
  textOriginal  String?  @db.Text // Hebreo/Arameo/Griego
  language      String?  // "hebrew" | "aramaic" | "greek"
  
  // Palabras clave (JSON array de strings)
  keyWords      String?  @db.Text // JSON: ["kavod", "merkavah"]
  
  // Análisis breve
  briefNote     String?
  briefNoteEn   String?
  
  // Relaciones
  etymologies   Etymology[]
  crossReferences CrossReference[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@unique([chapterId, number])
  @@index([chapterId])
  @@map("verses")
}
```

---

## 5. Contexto Histórico por Capítulo

```prisma
model ChapterHistoricalContext {
  id                String   @id @default(cuid())
  chapterId         String   @unique
  chapter           Chapter  @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  
  // Imperio dominante
  dominantEmpire    String?  // "Babilonia"
  dominantEmpireEn  String?  // "Babylon"
  
  // Rey en turno
  kingName          String?  // "Joaquín"
  kingNameEn        String?
  kingregion        String?  // "Judá"
  kingregionEn      String?
  
  // Profetas activos
  activeProphets    String?  @db.Text // JSON array: ["Jeremías", "Ezequiel"]
  activeProphetsEn  String?  @db.Text
  
  // Estado del templo
  templeStatus      String?  // "Funcionando pero profanado"
  templeStatusEn    String?
  
  // Situación política general
  politicalSituation     String?  @db.Text
  politicalSituationEn   String?  @db.Text
  
  // Estado espiritual del pueblo
  spiritualState    String?  @db.Text
  spiritualStateEn  String?  @db.Text
  
  // Eventos bélicos y políticos
  militaryEvents    String?  @db.Text // JSON array
  militaryEventsEn  String?  @db.Text
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([chapterId])
  @@map("chapter_historical_contexts")
}
```

---

## 6. Etimología y Palabras Clave

```prisma
model Etymology {
  id              String   @id @default(cuid())
  verseId         String
  verse           Verse    @relation(fields: [verseId], references: [id], onDelete: Cascade)
  
  // Palabra
  word            String   // "כָּבוֹד"
  wordEn          String?  // "Kavod"
  language        String   // "hebrew" | "aramaic" | "greek"
  transliteration String   // "Kavod"
  
  // Significados
  literalMeaning  String   // "Peso"
  literalMeaningEn String?
  primaryMeaning  String   // "Honor, gloria"
  primaryMeaningEn String?
  theologicalMeaning String? @db.Text // "Gloria divina como presencia"
  theologicalMeaningEn String? @db.Text
  
  // Raíz semítica
  semiticsRoot    String?  // "כ-ב-ד"
  
  // Campo semántico
  semanticField   String?  @db.Text // JSON: ["peso", "importancia", "reputación", "gloria"]
  
  // Cognados
  cognates        String?  @db.Text // JSON
  cognatesEn      String?  @db.Text
  
  // Apariciones en la Biblia
  biblicalFrequency  Int? // 200+
  notableOccurrences String? @db.Text // JSON array
  
  // Evolución semántica
  semanticEvolution String? @db.Text
  semanticEvolutionEn String? @db.Text
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([verseId])
  @@index([word])
  @@map("etymologies")
}
```

---

## 7. Referencias Cruzadas (Conexiones Bíblicas)

```prisma
model CrossReference {
  id              String   @id @default(cuid())
  verseId         String
  verse           Verse    @relation(fields: [verseId], references: [id], onDelete: Cascade)
  
  // Versículo referenciado
  referencedVerseId String? // Si es dentro de MyScriptum
  referencedBibleRef String? // Si es externo: "2 Reyes 24:10"
  
  // Tipo de conexión
  connectionType  String   // "historical" | "thematic" | "prophetic" | "typological" | "lexical" | "structural"
  
  // Descripción
  description     String?  @db.Text
  descriptionEn   String?  @db.Text
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([verseId, referencedBibleRef])
  @@index([verseId])
  @@index([connectionType])
  @@map("cross_references")
}

// Conexiones entre capítulos completos
model ChapterConnection {
  id              String   @id @default(cuid())
  fromChapterId   String
  toChapterId     String
  from            Chapter  @relation("from", fields: [fromChapterId], references: [id], onDelete: Cascade)
  to              Chapter  @relation("to", fields: [toChapterId], references: [id], onDelete: Cascade)
  
  connectionType  String   // "historical" | "thematic" | "prophetic" | "typological"
  description     String?  @db.Text
  descriptionEn   String?  @db.Text
  
  @@unique([fromChapterId, toChapterId])
  @@index([fromChapterId])
  @@index([toChapterId])
  @@map("chapter_connections")
}
```

---

## 8. Preguntas Reflexivas

```prisma
model ReflectionQuestion {
  id              String   @id @default(cuid())
  chapterId       String
  chapter         Chapter  @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  
  // Tipo de pregunta
  stage           String   // "observation" | "interpretation" | "implication"
  stageLabel      String   // "Observación" | "Interpretación" | "Implicación"
  stageLabelEn    String?
  
  // Pregunta
  question        String   @db.Text
  questionEn      String?  @db.Text
  
  // Guía (opcional)
  guidance        String?  @db.Text
  guidanceEn      String?  @db.Text
  
  order           Int      // Orden de presentación
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([chapterId])
  @@index([stage])
  @@map("reflection_questions")
}
```

---

## 9. Flujo de Estudio (Configuración por usuario)

```prisma
model StudyFlow {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  chapterId       String
  chapter         Chapter  @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  
  // Configuración del flujo
  // JSON: ["introduction", "reading", "structural_analysis", "etymology", "connections", "reflection"]
  order           String   @db.Text
  
  // Qué secciones activar
  includeIntroduction Boolean @default(true)
  includeReading      Boolean @default(true)
  includeAnalysis     Boolean @default(true)
  includeEtymology    Boolean @default(true)
  includeConnections  Boolean @default(true)
  includeReflection   Boolean @default(true)
  
  // Profundidad preferida (por sección)
  depthLevel      String   // "basic" | "intermediate" | "advanced"
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([userId, chapterId])
  @@index([userId])
  @@index([chapterId])
  @@map("study_flows")
}
```

---

## 10. Usuarios

```prisma
model User {
  id                String   @id @default(cuid())
  email             String   @unique
  name              String?
  password          String   // Hash bcrypt
  
  // Preferencias
  language          String   @default("es") // "es" | "en"
  depthLevelPreference String @default("intermediate")
  
  // Libros en estudio
  booksInStudy      String   @db.Text @default("[]") // JSON array de bookIds
  
  // Ritmo preferido
  readingPace       String   @default("flexible") // "daily" | "weekly" | "flexible"
  
  // Relaciones
  progress          ChapterProgress[]
  responses         ReflectionResponse[]
  studyFlows        StudyFlow[]
  sessions          Session[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([email])
  @@map("users")
}
```

---

## 11. Progreso del Usuario

```prisma
model ChapterProgress {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  chapterId       String
  
  // Estado de completitud
  status          String   @default("not_started") // "not_started" | "in_progress" | "completed"
  
  // Secciones completadas
  sectionIntroductionCompleted Boolean @default(false)
  sectionReadingCompleted      Boolean @default(false)
  sectionAnalysisCompleted     Boolean @default(false)
  sectionEtymologyCompleted    Boolean @default(false)
  sectionConnectionsCompleted  Boolean @default(false)
  sectionReflectionCompleted   Boolean @default(false)
  
  // Tiempo invertido
  timeSpentMinutes Int @default(0)
  
  // Metadata
  startedAt       DateTime?
  completedAt     DateTime?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([userId, chapterId])
  @@index([userId])
  @@index([status])
  @@map("chapter_progress")
}
```

---

## 12. Respuestas a Preguntas Reflexivas

```prisma
model ReflectionResponse {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  questionId      String
  
  // Respuesta
  textResponse    String?  @db.Text
  audioUrl        String?  // URL a archivo de audio en Cloudinary
  
  // Diario privado
  isPrivate       Boolean  @default(true)
  
  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([userId, questionId])
  @@index([userId])
  @@map("reflection_responses")
}
```

---

## 13. Sesiones de Autenticación

```prisma
model Session {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  expires       DateTime
  createdAt     DateTime @default(now())
  
  @@index([userId])
  @@map("sessions")
}
```

---

## Índices y Optimizaciones

```prisma
// Búsqueda full-text será en Elasticsearch futuro
// Por ahora: índices en campos de búsqueda común

// Books
/// @@index([slug])  // Ya existe en relación

// Chapters
/// @@fulltext([slug, literaryStructure])  // MySQL 5.7+

// Verses
/// @@fulltext([text, textEn])  // Para búsqueda de contenido

// Etymology
/// @@fulltext([word, transliteration, primaryMeaning])

// El slug es URL-friendly: "ezequiel-1" → "/es/estudio/ezequiel-1"
```

---

## Convenciones de Nombres

- **Tablas**: snake_case, plural
- **Campos**: camelCase
- **Bilingüismo**: Campo en español + "En" en inglés
- **Campos de JSON**: Documentados con comentarios
- **Relaciones**: Nombradas claramente (fromChapterId, toChapterId)

---

## Notas Importantes

1. **Bilingüismo**: Cada campo de contenido tiene versión es + en
2. **JSON flexible**: Campos como `keyWords`, `semiticsRoot`, etc., permiten flexibilidad
3. **Cascada**: onDelete Cascade en relaciones anidadas (Testamento → Libro → Capítulo)
4. **Índices**: En campos usados para búsqueda, ordenamiento o filtrado
5. **Timestamps**: `createdAt` y `updatedAt` automáticos
6. **Progreso granular**: Cada sección del flujo de estudio es rastreable independientemente

---

## Próximos Pasos

1. Crear archivo `prisma/schema.prisma` con este contenido
2. Configurar `.env` con URL de BD (Supabase o local)
3. Crear migraciones: `npx prisma migrate dev --name init`
4. Usar `npx prisma studio` para gestionar datos visualmente
5. Poblar con datos de Ezequiel (primero libro piloto)
