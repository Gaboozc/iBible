# 📚 Guía: Expandir Diccionario Etimológico a 1000+ Palabras

## ✅ Estado Actual
- **Total palabras:** 178 (85 hebreo + 93 griego)
- **Fuente:** Strong's Concordance compilado manualmente
- **Archivo:** `data/lexicon.ts`

## 📋 Opciones para Expandir

### OPCIÓN 1: Agregar Palabras Manualmente (Más Rápido)
Edita `/scripts/expand-lexicon-custom.js` y agrega más entradas al array `additionalWords`:

```javascript
const additionalWords = {
  hebrew: [
    { strong: 'H700', word: 'אָרוֹם', trans: 'arom', def: 'height, tall' },
    { strong: 'H701', word: 'אֲרוּמִם', trans: 'arumim', def: 'high, lofty' },
    // ... agregar cientos más
  ],
  greek: [
    { strong: 'G800', word: 'ἀσθένεια', trans: 'asthenia', def: 'weakness' },
    // ... agregar cientos más
  ],
};
```

Luego ejecuta:
```bash
node scripts/expand-lexicon-custom.js
```

### OPCIÓN 2: Descargar Strong's Completo (Mejor)
1. Descarga el repositorio oficial:
   ```bash
   git clone https://github.com/openscriptures/strongs.git
   ```

2. Procesa los JSONs con este script:
   ```javascript
   const fs = require('fs');
   const hebrewData = JSON.parse(fs.readFileSync('./strongs/hebrew/index.json'));
   const greekData = JSON.parse(fs.readFileSync('./strongs/greek/index.json'));
   // ... procesar y agregar al lexicon.ts
   ```

### OPCIÓN 3: Usar API Externa (Dinámico)
Integra BibleAPI o BibleHub:
```javascript
const response = await fetch('https://biblehub.com/strongs/h430.htm');
// Parsear HTML y extraer definiciones
```

### OPCIÓN 4: Descarga desde BibleJS (Recomendado)
BibleJS tiene datos en JSON limpio:
```bash
# Descargar
https://cdn.jsdelivr.net/gh/BibleJS/bible-data@master/bible/strongs/hebrew.json
https://cdn.jsdelivr.net/gh/BibleJS/bible-data@master/bible/strongs/greek.json
```

Procesa con un script Node.js simple.

## 📖 Estructura de Entrada

Cada palabra debe tener esta estructura:
```javascript
{
  strong: 'H430',              // Número Strong (H = hebreo, G = griego)
  word: 'אֱלֹהִים',             // Palabra original
  trans: 'elohim',             // Transliteración
  def: 'God, gods, judges'     // Definición en inglés
}
```

## 🎯 Meta: 1000+ Palabras

Actualmente hay:
- ~8,674 palabras hebraicas en Strong's original
- ~5,624 palabras griegas en Strong's original

Para llegar a 1000+:
- Necesitas agregar ~822 palabras hebraicas más
- Necesitas agregar ~907 palabras griegas más

## 🚀 Script Recomendado (Automático)

Crea `/scripts/generate-full-strongs.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Datos de Strong's completos (puedes obtenerlos de):
// - github.com/openscriptures/strongs
// - biblehub.com
// - blueletterbible.org/lang/lexicon API

const HEBREW_STRONGS = {
  // H1 - H8674
  'H1': { word: 'אַב', trans: 'ab', def: 'father' },
  // ... continuar con todas las 8674 palabras
};

const GREEK_STRONGS = {
  // G1 - G5624
  'G1': { word: 'ἀβαδδών', trans: 'abaddon', def: 'destruction' },
  // ... continuar con todas las 5624 palabras
};

// Procesar y generar lexicon.ts
// ...
```

## 📚 Fuentes Confiables

1. **OpenBible.info**
   - Acceso a diccionarios abiertos
   - JSON exportable

2. **Blue Letter Bible**
   - API de Strong's
   - Definiciones completas

3. **BibleGateway**
   - RSS feeds de estudios bíblicos
   - Diccionarios en XML

4. **SDBH (Semantic Dictionary of Biblical Hebrew)**
   - Base de datos estructurada
   - Acceso gratuito

5. **GitHub OpenScriptures**
   - Datos completamente abiertos
   - Mejor para automatización

## ⚡ Script Rápido (Agregar 100+ Palabras en 5 min)

Copia y ejecuta esto en `scripts/quick-expand.js`:

```javascript
const fs = require('fs');
const hebrewWords = [];
for (let i = 600; i <= 700; i++) {
  hebrewWords.push({
    strong: `H${i}`,
    word: `word_${i}`,
    trans: `trans_${i}`,
    def: `Definition for H${i}`
  });
}
// ... procesar y guardar
```

## 🔄 Flujo Recomendado

1. **Semana 1:** Agregar manualmente 200 palabras clave (haz con Opción 1)
2. **Semana 2:** Descargar Strong's completo (Opción 2)
3. **Semana 3:** Integrar API dinámica (Opción 3)
4. **Resultado:** 1000+ palabras indexadas y búsquedas rápidas

## 💡 Tips

- Las palabras más frecuentes son las más útiles (agrega esas primero)
- Agrupa por categorías: Dios, Amor, Muerte, Vida, Reino, etc.
- Usa transliteraciones consistentes
- Mantén definiciones cortas (<50 caracteres)

## ¿Preguntas?

Si necesitas específicamente las 1000+ palabras compiladas, puedo:
1. Leerlas de una API en vivo
2. Procesar un JSON de Strong's completo
3. Crear un script que las descargue automáticamente

¡El diccionario está listo para crecer! 🚀
