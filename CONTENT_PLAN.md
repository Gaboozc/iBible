# Plan de Contenido — MyScriptum

## Estrategia de Priorización de Contenido

Para el **MVP (Minimum Viable Product)**, necesitamos seleccionar cuidadosamente qué libros bíblicos implementar primero. La selección debe:

1. **Demostrar el valor único** del sistema (contexto histórico profundo)
2. **Abarcar diferentes géneros** literarios
3. **Ser manejable** en tiempo de desarrollo
4. **Tener alto impacto** pedagógico

---

## 📚 Libros Priorizados para MVP

### Fase 1: MVP (2-3 libros)

#### 1️⃣ **Ezequiel** (Profético-Apocalíptico)

**Por qué Ezequiel primero:**
- ✅ Es tu especialidad y pasión
- ✅ Requiere contexto histórico intensivo (exilio babilónico)
- ✅ Demuestra todos los features:
  - Timeline complejo (593-571 a.C.)
  - Múltiples imperios (Babilonia)
  - Conexiones con Jeremías, 2 Reyes
  - Simbolismo profundo (merkavah, gloria de YHWH)
  - Palabras clave hebreas ricas (kavod, ruaj, nefesh)
- ✅ Audiencia: Estudiantes serios de profecía

**Contenido a desarrollar:**
- 48 capítulos con contexto histórico
- Timeline del exilio (605-539 a.C.)
- Imperio babilónico (mapa conceptual)
- Profetas contemporáneos (Jeremías, Daniel)
- 50+ palabras clave hebreas
- 200+ conexiones con otros textos
- Preguntas reflexivas por capítulo

---

#### 2️⃣ **Salmos** (Poético-Litúrgico) — Selección

**Por qué Salmos (parcial):**
- ✅ Género completamente diferente a Ezequiel
- ✅ Contextos históricos variados (David, exilio, postexilio)
- ✅ Conexión emocional inmediata
- ✅ Demuestra versatilidad del sistema

**Contenido a desarrollar (selección estratégica):**
- **Salmos de David en crisis** (3, 7, 18, 23, 51, 63)
- **Salmos del exilio** (42-43, 137)
- **Salmos mesiánicos** (2, 22, 110)
- **Total**: ~15-20 salmos

**Por qué no todos los 150:**
- Demasiado tiempo de desarrollo
- Muchos tienen contexto similar
- Mejor profundizar en pocos que cubrir superficialmente

---

#### 3️⃣ **Jonás** (Narrativo-Profético)

**Por qué Jonás:**
- ✅ Libro completo pequeño (4 capítulos)
- ✅ Narrativo → fácil de seguir
- ✅ Tipología clara (Jonás ↔ Jesús)
- ✅ Contexto histórico interesante (Asiria en auge)
- ✅ Temas universales (misericordia, obediencia)

**Contenido a desarrollar:**
- 4 capítulos completos
- Timeline: Reino del Norte, Jeroboam II
- Imperio asirio (Nínive)
- Tipología con Mateo 12:39-40
- Palabras clave: hesed (misericordia), shub (arrepentirse)

---

### Fase 2: Expansión Estratégica (después del MVP)

#### Prioridad Media:
- **Génesis 1-11** — Orígenes, fundacional
- **Éxodo** — Pacto, ley, liberación
- **Daniel** — Apocalíptico, complemento de Ezequiel
- **Isaías 40-66** — Profecía mesiánica, exilio
- **Evangelio de Juan** — Puente AT-NT
- **Romanos** — Teología sistemática

#### Prioridad Baja (largo plazo):
- Resto de Profetas Mayores
- Profetas Menores
- Libros históricos (Reyes, Crónicas)
- Epístolas paulinas
- Apocalipsis

---

## 🗂️ Estructura del Contenido por Libro

### Metadatos del Libro (una vez)

```json
{
  "name": "Ezequiel",
  "nameEn": "Ezekiel",
  "slug": "ezequiel",
  "abbreviation": "Ez",
  "testament": "Antiguo Testamento",
  "authorTraditional": "Ezequiel hijo de Buzí",
  "dateApproximate": "593-571 a.C.",
  "literaryGenre": "Profético, Apocalíptico",
  "originalAudience": "Judíos en exilio babilónico",
  "centralTheme": "La gloria de YHWH abandona y luego restaura a su pueblo",
  "historicalLocation": "Exilio en Babilonia (Tel-Aviv, río Quebar)",
  "parallelBooks": ["Jeremías", "2 Reyes 24-25", "Daniel"]
}
```

---

### Contenido por Capítulo (repetir 48 veces para Ezequiel)

#### 1. **Introducción Histórica**

```markdown
## Ezequiel 1 — Contexto Histórico

### Marco Histórico
En el año 593 a.C., quinto año del exilio del rey Joaquín, el sacerdote Ezequiel 
recibe su llamado profético junto al río Quebar en Babilonia. Jerusalén aún no 
ha sido destruida, pero el juicio es inminente.

### Fecha Exacta
- **Año**: 593 a.C.
- **Evento**: 5º año del exilio de Joaquín (597 a.C.)
- **Mes**: Cuarto mes (Tamuz), día 5

### Imperio Dominante
- **Babilonia** bajo Nabucodonosor II (605-562 a.C.)
- Conquistó Jerusalén en 597 a.C., primera deportación
- Segunda deportación inminente (586 a.C.)

### Situación Política
- **Judá**: Vasallo de Babilonia, rey títere Sedequías
- **Israel del Norte**: Ya destruido por Asiria (722 a.C.)
- **Egipto**: Intenta influenciar a Judá contra Babilonia

### Estado del Templo
- Funcionando en Jerusalén, pero profanado
- Prácticas idolátricas infiltradas
- Destrucción profetizada para 11 años después

### Profetas Activos
- **Jeremías**: En Jerusalén, profetiza destrucción
- **Ezequiel**: En Babilonia, comienza su ministerio
- **Daniel**: En corte babilónica (ya 6 años allí)
- **Profetas falsos**: En ambas ciudades, predicando paz falsa

### Estado Espiritual
- **Pueblo en exilio**: Negación, esperanza de retorno rápido
- **Pueblo en Jerusalén**: Confianza falsa en el templo
- **Crisis de fe**: "¿Nos ha abandonado YHWH?"
```

---

#### 2. **Texto Bíblico Completo**

```
[Versículos 1-28 con numeración]

Integración con texto de traducción elegida (RV60, NVI, DHH, etc.)
```

---

#### 3. **Análisis Estructural**

```markdown
## Estructura Literaria de Ezequiel 1

### División del Capítulo
1. **vv. 1-3**: Introducción y llamado (primera persona → tercera persona)
2. **vv. 4-14**: Visión de los cuatro seres vivientes
3. **vv. 15-21**: Las ruedas y su movimiento
4. **vv. 22-25**: El firmamento de cristal
5. **vv. 26-28**: El trono y la gloria de YHWH

### Quién Habla
- **vv. 1-3**: Ezequiel (autobiográfico), luego narrador
- **vv. 4-28**: Ezequiel describiendo visión

### Ritmo Literario
- **Inicio**: Narrativo (fecha, lugar)
- **Cuerpo**: Apocalíptico (visión intensa, simbólica)
- **Final**: Clímax teofánico (presencia divina)

### Repeticiones Significativas
- **"Visión"** (mareh) — 3 veces
- **"Semejanza"** (demut) — 10 veces → lenguaje de aproximación
- **"Gloria de YHWH"** (kavod YHWH) — tema central

### Inclusio
- **v. 1**: "Se abrieron los cielos"
- **v. 28**: "Caí sobre mi rostro" → respuesta humana a revelación divina
```

---

#### 4. **Palabras Clave y Etimología**

```markdown
## Palabras Clave en Ezequiel 1

### 1. כָּבוֹד (Kavod) — Gloria

- **Transliteración**: Kavod
- **Raíz**: כ-ב-ד (pesado)
- **Significado literal**: Peso, pesadez
- **Campo semántico**: Peso físico → importancia moral → reputación → gloria divina
- **Teología**: La "gloria" no es ornamento; es el peso de la presencia de Dios
- **Apariciones**: 200+ en AT, 18 veces en Ezequiel
- **Conexiones**: Éxodo 24:16-17, Salmo 19:1, Isaías 6:3

---

### 2. מֶרְכָּבָה (Merkavah) — Trono-carruaje

- **Transliteración**: Merkavah
- **Raíz**: ר-כ-ב (montar, cabalgar)
- **Significado**: Carruaje, trono móvil
- **Contexto**: Tradición mística judía posterior (Merkavah mysticism)
- **Teología**: Dios no está atado al templo; su trono es móvil
- **Implicación**: YHWH puede estar con su pueblo incluso en Babilonia

---

### 3. מַרְאֶה (Mareh) — Visión

- **Transliteración**: Mareh
- **Significado**: Visión, apariencia, revelación visual
- **Uso en Ezequiel**: Introductor de experiencias proféticas
- **Conexiones**: Daniel 8:16, Números 12:6

---

### 4. דְּמוּת (Demut) — Semejanza

- **Transliteración**: Demut
- **Significado**: Semejanza, parecido, figura
- **Función**: Lenguaje de aproximación → lo inefable solo puede ser "como"
- **Teología**: Humildad epistemológica del profeta
- **Frecuencia en Ez 1**: 10 veces → énfasis en la incompletitud de la descripción
```

---

#### 5. **Conexiones Bíblicas**

```markdown
## Conexiones de Ezequiel 1

### Conexiones Históricas
- **2 Reyes 24:10-17**: Contexto del exilio de Joaquín
- **Jeremías 29**: Carta a los exiliados (misma audiencia)

### Conexiones Temáticas
- **Isaías 6:1-8**: Visión del trono de Dios en el templo
- **1 Reyes 22:19**: Visión de Micaías del trono celestial
- **Apocalipsis 4**: Visión del trono en el cielo

### Conexiones Proféticas
- **Ezequiel 10**: La gloria abandona el templo
- **Ezequiel 43:1-5**: La gloria regresa al templo restaurado

### Conexiones Tipológicas
- **Querubines**: Génesis 3:24 (guardianes del Edén)
- **Ruedas dentro de ruedas**: Omnipresencia, omnisciencia divina

### Conexiones Léxicas
- **Kavod**: Todas las apariciones de "gloria de YHWH"
  - Éxodo 16:7, 10 (desierto)
  - 1 Reyes 8:11 (dedicación del templo)
  - Isaías 60:1 (restauración futura)
```

---

#### 6. **Preguntas Reflexivas**

```markdown
## Preguntas de Estudio — Ezequiel 1

### Observación (¿Qué dice el texto?)
1. ¿Dónde está Ezequiel cuando recibe esta visión? ¿Por qué es significativo?
2. ¿Qué elementos componen la visión? (Seres vivientes, ruedas, trono)
3. ¿Cuántas veces aparece la palabra "semejanza" o "como"? ¿Por qué?
4. ¿Cómo responde Ezequiel al final de la visión?

### Interpretación (¿Qué significa?)
5. ¿Por qué Dios se revela a Ezequiel en Babilonia, no en el templo de Jerusalén?
6. ¿Qué representa el trono móvil (merkavah)? ¿Qué teología implica?
7. ¿Por qué Ezequiel usa constantemente "como" y "semejanza"?
8. ¿Qué significa que la "gloria de YHWH" esté en el exilio con su pueblo?

### Implicación (¿Qué significa para mí?)
9. ¿Dónde has sentido que Dios está "ausente" de tu vida? ¿Cómo esta visión desafía esa percepción?
10. ¿De qué maneras te aferras a lugares "sagrados" en vez de a la presencia móvil de Dios?
11. ¿Cuál es tu respuesta cuando encuentras algo de Dios que no puedes comprender completamente?
12. ¿Cómo cambia tu perspectiva saber que Dios no abandona a su pueblo incluso en el "exilio"?
```

---

## 📊 Roadmap de Contenido

### Milestone 1: Ezequiel Completo (3-4 meses)
- [ ] Metadatos del libro
- [ ] Timeline histórico (605-539 a.C.)
- [ ] Imperio babilónico (contexto)
- [ ] 48 capítulos con:
  - [ ] Introducción histórica
  - [ ] Análisis estructural
  - [ ] 5-10 palabras clave por capítulo
  - [ ] 10-20 conexiones por capítulo
  - [ ] 4-8 preguntas reflexivas

### Milestone 2: Salmos Seleccionados (2 meses)
- [ ] 15-20 salmos priorizados
- [ ] Contextos históricos variados
- [ ] Palabras clave en hebreo poético

### Milestone 3: Jonás Completo (1 mes)
- [ ] 4 capítulos completos
- [ ] Timeline asirio
- [ ] Tipología con NT

### Milestone 4: Infraestructura de Timeline (paralelo)
- [ ] Visualización interactiva
- [ ] Filtros por: imperio, profeta, rey, evento
- [ ] Integración con capítulos

---

## 🎯 Métricas de Calidad del Contenido

| Criterio | Estándar |
|----------|----------|
| **Contexto histórico** | Mínimo 300 palabras por capítulo |
| **Palabras clave** | 5-10 por capítulo, con etimología completa |
| **Conexiones** | Mínimo 10 por capítulo |
| **Preguntas reflexivas** | 8-12 por capítulo (3 por etapa) |
| **Precisión histórica** | Citas de fuentes académicas |
| **Bilingüismo** | 100% del contenido en ES + EN |

---

## 👥 Roles Necesarios para Crear Contenido

1. **Investigador bíblico** (tú) — Contexto histórico, teología
2. **Hebraísta** — Etimología, palabras clave
3. **Escritor/editor** — Claridad, pedagogía
4. **Traductor** — Versión inglesa
5. **Revisor teológico** — Control de calidad

Para MVP: Tú puedes cubrir roles 1, 3 y parte de 2. Contratar para 4 y 5 eventualmente.

---

## Siguiente Paso

Con este plan de contenido definido, el siguiente paso es:

1. **Inicializar Next.js + Prisma** → código base
2. **Crear estructura de carpetas** para contenido
3. **Poblar BD con estructura** (sin contenido aún)
4. **Desarrollar UI** para visualizar contenido
5. **Comenzar a escribir** Ezequiel 1 como piloto

¿Procedemos a inicializar el proyecto con Next.js?
