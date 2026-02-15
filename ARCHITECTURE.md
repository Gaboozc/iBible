# Arquitectura Integral — MyScriptum

## 1. Arquitectura Conceptual en Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERFAZ DE USUARIO                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │   Biblioteca    │  │   Motor de       │  │  Timeline  │ │
│  │   Bíblica       │  │   Estudio        │  │ Histórica  │ │
│  └─────────────────┘  └──────────────────┘  └────────────┘ │
│                                                              │
│  ┌──────────────────────┐  ┌────────────────────────────┐  │
│  │   Herramientas de    │  │  Experiencia Reflexiva &   │  │
│  │   Análisis           │  │  Sistema de Progreso       │  │
│  └──────────────────────┘  └────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│              MOTOR DE CONTEXTO HISTÓRICO-CULTURAL            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────────────────────┐ │
│  │  Timeline        │  │  Contexto Cultural & Costumbres  │ │
│  │  Geopolítica     │  │  Legales, Religiosas, Sociales   │ │
│  │  Eventos         │  │  Economía, Idolatrías            │ │
│  └──────────────────┘  └──────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE DATOS                             │
├─────────────────────────────────────────────────────────────┤
│  Base de Datos                     Sistema de Búsqueda      │
│  ├── Textos bíblicos               ├── Índice full-text    │
│  ├── Metadatos                     ├── Búsqueda contextual  │
│  ├── Contexto histórico            └── Filtros multidim.   │
│  ├── Conexiones                                             │
│  ├── Usuarios & progreso                                    │
│  └── Comentarios & análisis                                 │
└─────────────────────────────────────────────────────────────┘
```

Cada capa es **independiente pero conectada** — cambios en datos no afectan UI.

---

## 2. Biblioteca Bíblica (Base del Sistema)

### Organización Jerárquica

```
Testamento
└── Libro
    ├── Metadatos del libro
    └── Capítulo
        ├── Metadatos del capítulo
        └── Versículo
            ├── Texto
            └── Anotaciones
```

### Metadatos por TESTAMENTO
- **Nombre**: Antiguo Testamento / Nuevo Testamento
- **Abreviaturas**: AT / NT
- **Período histórico abarcado**
- **Número de libros**

### Metadatos por LIBRO

| Campo | Ejemplo | Propósito |
|-------|---------|-----------|
| **Nombre** | Ezequiel | |
| **Autor tradicional** | Ezequiel hijo de Buzí | Autoría reconocida |
| **Fecha aproximada** | 593-571 a.C. | Ubicación temporal |
| **Género literario** | Profético, Apocalíptico | Cómo leerlo |
| **Audiencia original** | Judíos en exilio babilónico | Por qué se escribió |
| **Tema teológico central** | Gloria de YHWH, Restauración | Pregunta central |
| **Ubicación histórica general** | Exilio en Babilonia | Contexto macro |
| **Libros paralelos/relacionados** | Reyes, Crónicas, Jeremías | Conexiones |
| **Número de capítulos** | 48 | Estructura |

### Metadatos por CAPÍTULO

| Campo | Ejemplo | Propósito |
|-------|---------|-----------|
| **Número** | 1 | Identificador |
| **Período histórico exacto** | 593 a.C., 5º año del exilio | Cronología precisa |
| **Evento(s) relacionado(s)** | Caída inminente de Jerusalén | Qué ocurre |
| **Personajes clave** | Ezequiel, la Gloria de YHWH | Actores principales |
| **Nivel de intensidad teológica** | Profético, Apocalíptico | Cómo abordarlo |
| **Estructura literaria** | 4 visiones (querubines, ruedas...) | División interna |
| **Palabras clave** | Kavod (gloria), Merkavah (trono) | Léxico importante |
| **Conexiones históricas** | Profecías de Jeremías (609 a.C.) | Relaciones |
| **Notas de contexto inmediato** | El año 5 del cautiverio... | Detalles que introduce |

### Metadatos por VERSÍCULO

| Campo | Ejemplo | Propósito |
|-------|---------|-----------|
| **Número** | 1 | Identificador |
| **Texto bíblico** | (texto completo) | Lectura |
| **Texto original** | (hebreo/arameo/griego) | Estudio profundo |
| **Palabras marcadas como claves** | kavod, merkavah | Énfasis de estudio |
| **Notas breves** | "Visión de apertura" | Contexto inmediato |

---

## 3. Motor de Contexto Histórico-Cultural

### A. Contexto Histórico (por capítulo)

**Submódulo: Timeline**
- Imperio dominante en ese momento
- Rey en turno (Israel / Judá)
- Profetas activos **en ese período específico**
- Estado del templo (funcionando / profanado / destruido / reconstruido)
- Exilio / retorno / independencia
- Eventos bélicos cercanos

**Submódulo: Geopolítica**
- Mapa conceptual (no geográfico): quién está donde
- Alianzas y enemistades
- Rutas comerciales (si es relevante)

**Submódulo: Eventos Bélicos y Políticos**
- Invasiones
- Cambios dinásticos
- Tratados
- Revueltas internas

### B. Contexto Cultural (temas transversales)

- **Cosmovisión hebrea**: Cómo pensaba Israel sobre Dios, naturaleza, tiempo, comunidad
- **Sistema de pacto**: Diferencia entre pacto antiguo y mentalidad moderna
- **Honor y vergüenza**: Base de la cultura antigua (no culpa/inocencia moderna)
- **Idolatría por región**: Baal en Canaán, Kemosh en Moab, etc.
- **Economía y clases sociales**: Esclavitud, propiedad de tierra, diezmos
- **Sistema legal mosaico**: Ley de talión, jubilo, goel (redentor)
- **Prácticas religiosas comparadas**: Culto en el templo vs. cultos paganos
- **Símbolos sagrados**: Templo, arca, nombre de Dios, shalom

**Resultado**: Explicar **por qué Dios habla como habla**, no anacrónicamente.

---

## 4. Motor de Estudio (Núcleo Pedagógico)

### Flujo Estándar por Capítulo

```
┌─────────────────────────────────────────┐
│  1. INTRODUCCIÓN HISTÓRICA              │
│  (Marco + imperio + personajes)         │
├─────────────────────────────────────────┤
│  2. LECTURA BÍBLICA COMPLETA            │
│  (Texto íntegro del capítulo)           │
├─────────────────────────────────────────┤
│  3. ANÁLISIS ESTRUCTURAL                │
│  (Quién habla, ritmo, divisiones)       │
├─────────────────────────────────────────┤
│  4. PALABRAS CLAVE Y ETIMOLOGÍA         │
│  (Hebreo, griego, raíces, semántica)    │
├─────────────────────────────────────────┤
│  5. CONEXIONES BÍBLICAS                 │
│  (Paralelos, profecía, tipología)       │
├─────────────────────────────────────────┤
│  6. APLICACIÓN REFLEXIVA                │
│  (Preguntas guiadas, diario)            │
└─────────────────────────────────────────┘
```

**Configurabilidad**: El usuario puede:
- Saltarse secciones
- Profundizar en unas más que otras
- Cambiar el orden (si así lo desea)

### Análisis Estructural (por capítulo)

- **División literaria**: Quién habla, cambios de escena
- **Ritmo**: Narrativo (acción) vs. Poético (sentimiento) vs. Profético (oráculo)
- **Repeticiones e inclusiones**: Palabras que se repiten, que marcan secciones
- **Inclusio bíblica**: Primera y última frase similares (estructura en anillo)
- **Paralelismo hebreo**: A || B, A || B || C (estructura de pensamiento)

---

## 5. Lenguaje, Etimología y Texto Original

### Por Palabra Clave

```
Palabra: כָּבוֹד (Kavod) [Hebreo]

├── Transliteración: Kavod
├── Traducción literal: Peso, Honor, Gloria
├── Raíz semítica: כ-ב-ד (pesado)
├── Campo semántico: 
│   ├── Peso físico
│   ├── Importancia moral
│   ├── Reputación / honor
│   └── Gloria divina (significado teológico)
├── Frecuencia: 200+ apariciones en AT
├── Apariciones clave:
│   ├── Génesis 31:1 (gloria de Jacob)
│   ├── Éxodo 24:16-17 (gloria de YHWH)
│   ├── Salmo 19:1 (gloria de Dios)
│   └── Ezequiel 1:28 (merkavah vision)
├── Evolución: Primero "peso", luego "importancia", finalmente "gloria"
└── Implicación: "Gloria" no es decoración; es el peso de la presencia de Dios
```

### Campos a Incluir

| Campo | Ejemplo | Uso |
|-------|---------|-----|
| Palabra original | כָּבוֹד | Identificación |
| Idioma | Hebreo | Texto base |
| Transliteración | Kavod | Para hablantes no-hebraístas |
| Significado base | Peso | Cómo empieza semánticamente |
| Significados derivados | Honor, gloria, importancia | Campos semánticos |
| Raíz | כ-ב-ד | Entender familia de palabras |
| Cognados | Kabbash (pesado); kbud (importante) | Comparación lingüística |
| Frecuencia | 200+ | Importancia en AT |
| Apariciones notables | Éxodo 24, Ezequiel 1, Salmo 19 | Ejemplos de uso |
| Notas teológicas | "No es ornamento, es presencia" | Significado profundo |

---

## 6. Conexiones y Referencias Cruzadas

### Tipos de Conexión

| Tipo | Ejemplo | Propósito |
|------|---------|-----------|
| **Histórica** | 2 Reyes 24 ↔ Jeremías 52 | Mismo evento, perspectivas |
| **Temática** | Salmo 137 ↔ Ezequiel 33 | Mismo tema (exilio) |
| **Profética** | Isaías 53 ↔ 1 Pedro 1:10-12 | Profecía + cumplimiento |
| **Tipológica** | Jonás ↔ Resurrección de Jesús | Tipo + antitipo |
| **Léxica** | Todas las apariciones de "kavod" | Palabra + contextos |
| **Estructural** | Salmo 42 ↔ Salmo 43 | Poemas que se responden |

### Visualización

**Árbol de conexiones**: Capítulo central con ramas hacia textos relacionados

**Red semántica**: Nodo (tema) con múltiples conexiones bidireccionales

**Cadena temática**: Secuencia lineal de cómo un tema evoluciona (ej: "Mesías" en AT)

---

## 7. Experiencia Reflexiva

### Preguntas Guiadas (por capítulo)

Estructura de **Inductive Bible Study**:

1. **Observación**: ¿Qué dice el texto?
   - Quién habla
   - A quién le habla
   - Qué sucede
   - Palabras clave repetidas

2. **Interpretación**: ¿Qué significa?
   - ¿Por qué dice esto Dios?
   - ¿Cuál es el punto central?
   - ¿Cómo se relaciona con el contexto histórico?

3. **Implicación**: ¿Qué significa para mí?
   - ¿Qué verdad revela sobre Dios?
   - ¿Cómo debo responder?
   - ¿Qué cambio se me invita a hacer?

### Opciones de Respuesta

- **Texto escrito**: Respuestas anotadas en la app
- **Audio personal**: Grabar reflexión propia
- **Diario espiritual privado**: Historial personal de reflexiones
- **Compartible**: Opción de guardar privado o compartir con grupo (futuro)

---

## 8. Sistema de Usuario y Progreso

### Perfil del Usuario

```json
{
  "nombre": "Usuario",
  "idioma_preferido": "español",
  "nivel_profundidad": ["básico", "intermedio", "avanzado"],
  "libros_en_estudio": ["Ezequiel", "Jeremías"],
  "ritmo_preferido": ["diario", "semanal", "a_ritmo_libre"],
  "intereses_teológicos": ["exilio", "profecía", "restauración"],
  "historial_reflexiones": [...]
}
```

### Progreso

| Métrica | Propósito |
|---------|-----------|
| **Capítulos completados** | Ver avance |
| **Tiempo invertido** | Motivación |
| **Temas dominantes** | Entender patrones de estudio |
| **Conexiones exploradas** | Profundidad de investigación |
| **Preguntas respondidas** | Reflexión realizada |

**⚠️ IMPORTANTE**: Sin gamificación vacía. No "puntos" artificiales. Solo métricas de formación real.

---

## 9. Capas Avanzadas (Futuro/Opcional)

### IA como Asistente de Estudio

- **Explicaciones contextualizadas**: "Explica por qué el simbolismo de la merkavah era importante"
- **Preguntas socrátivas**: "¿Qué cambiarías en tu perspectiva si Ezequiel escribiera esto hoy?"
- **Comparación de interpretaciones**: "Aquí están 3 perspectivas teológicas sobre este pasaje" (sin dogmatizar)

### Modo Enseñanza

- **Preparar clases o prédicas**
- **Exportar notas** (PDF, Markdown)
- **Crear esquemas** de un libro completo
- **Bibliografía**: Vínculos a comentarios académicos

### Comunidad (Muy Futuro)

- **Grupos de estudio**: Sincronizarse en lectura
- **Compartir reflexiones**: Diarios públicos
- **Discusiones facilitadas**: Hilo de preguntas por capítulo

---

## 10. Lo que iBible ES vs. NO ES

### ❌ NO ES

- Devocional diario ("Versículo del día")
- App de notas genéricas
- Biblia en línea con búsqueda simple
- "Gamificación motivacional" (puntos, logros vacíos)
- Para lectura casual
- Substituto de pastores o maestros

### ✅ ES

- **Plataforma de estudio bíblico profundo**
- **Herramienta para formación teológica seria**
- **Sistema que respeta**: Texto, Historia, Mente, Espíritu
- **Pedagógicamente rigurosa**
- **Bilingüe** (español + inglés)
- **Para personas que quieren entender de verdad**

---

## Próximos Pasos

1. **Especificación técnica**: Stack, BD, APIs
2. **Modelo de datos**: Esquema detallado
3. **Prototipo UI**: Navegación, visualización
4. **Plan de contenido**: Qué libros primero, cómo escribir contextos
5. **MVP**: 1-2 libros completamente implementados
