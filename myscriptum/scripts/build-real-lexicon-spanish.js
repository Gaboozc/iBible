const fs = require('fs');
const path = require('path');
const https = require('https');

// STEPBible lexicon URLs (CC BY 4.0)
const HEBREW_URL = 'https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Lexicons/TBESH%20-%20Translators%20Brief%20lexicon%20of%20Extended%20Strongs%20for%20Hebrew%20-%20STEPBible.org%20CC%20BY.txt';
const GREEK_URL = 'https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Lexicons/TBESG%20-%20Translators%20Brief%20lexicon%20of%20Extended%20Strongs%20for%20Greek%20-%20STEPBible.org%20CC%20BY.txt';

console.log('📚 Regenerating Real Lexicon with FULL Spanish/English Indexing...');
console.log('   Source: STEPBible.org (CC BY 4.0 License)');
console.log('');

// Download file helper
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    console.log(`⬇️  Downloading...`);
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ Downloaded`);
        resolve(data);
      });
    }).on('error', reject);
  });
}

// Parse TSV lexicon data
function parseLexicon(tsvData, language) {
  const lines = tsvData.split('\n');
  const entries = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    
    const parts = line.split('\t');
    if (parts.length < 3) continue;
    
    const strongNum = parts[0];
    const lemma = parts[1];
    const transliteration = parts[2];
    const brief = parts[3] || '';
    const type = parts[4] || '';
    
    const strongMatch = strongNum.match(/[HG]\d+/);
    if (!strongMatch) continue;
    
    entries.push({
      strong: strongMatch[0],
      lemma: lemma,
      transliteration: transliteration,
      gloss_en: brief,
      gloss_es: brief, // Will be filled later
      type: type,
      language: language
    });
  }
  
  return entries;
}

// Spanish translation dictionary (expanded)
const spanishGlossary = {
  'love': 'amor', 'god': 'Dios', 'lord': 'Señor', 'faith': 'fe', 'hope': 'esperanza',
  'peace': 'paz', 'grace': 'gracia', 'mercy': 'misericordia', 'spirit': 'espíritu',
  'truth': 'verdad', 'life': 'vida', 'death': 'muerte', 'sin': 'pecado',
  'righteous': 'justo', 'righteousness': 'justicia', 'holy': 'santo', 'holiness': 'santidad',
  'salvation': 'salvación', 'redeem': 'redimir', 'covenant': 'pacto', 'law': 'ley',
  'commandment': 'mandamiento', 'word': 'palabra', 'prophet': 'profeta', 'priest': 'sacerdote',
  'king': 'rey', 'temple': 'templo', 'sacrifice': 'sacrificio', 'altar': 'altar',
  'worship': 'adoración', 'prayer': 'oración', 'praise': 'alabanza', 'glory': 'gloria',
  'power': 'poder', 'wisdom': 'sabiduría', 'knowledge': 'conocimiento', 'understanding': 'entendimiento',
  'heart': 'corazón', 'soul': 'alma', 'mind': 'mente', 'strength': 'fuerza',
  'heaven': 'cielo', 'earth': 'tierra', 'judgment': 'juicio', 'wrath': 'ira', 'anger': 'enojo',
  'jealous': 'celoso', 'compassion': 'compasión', 'kindness': 'bondad', 'patience': 'paciencia',
  'joy': 'gozo', 'bless': 'bendecir', 'blessing': 'bendición', 'curse': 'maldición',
  'repent': 'arrepentirse', 'forgive': 'perdonar', 'forgiveness': 'perdón', 'deliver': 'liberar',
  'deliverance': 'liberación', 'people': 'pueblo', 'nation': 'nación', 'servant': 'siervo',
  'disciple': 'discípulo', 'apostle': 'apóstol', 'witness': 'testigo', 'revelation': 'revelación',
  'vision': 'visión', 'dream': 'sueño', 'angel': 'ángel', 'messiah': 'mesías', 'christ': 'cristo',
  'son': 'hijo', 'father': 'padre', 'mother': 'madre', 'brother': 'hermano', 'sister': 'hermana',
  'child': 'niño', 'woman': 'mujer', 'man': 'hombre', 'house': 'casa', 'city': 'ciudad',
  'mountain': 'montaña', 'water': 'agua', 'fire': 'fuego', 'light': 'luz', 'darkness': 'oscuridad',
  'day': 'día', 'night': 'noche', 'year': 'año', 'time': 'tiempo', 'way': 'camino',
  'gate': 'puerta', 'good': 'bueno', 'evil': 'malo', 'right': 'derecho', 'left': 'izquierdo',
  'great': 'grande', 'small': 'pequeño', 'first': 'primero', 'last': 'último',
  'eternal': 'eterno', 'forever': 'para siempre', 'born': 'nacido', 'birth': 'nacimiento',
  'law': 'ley', 'lawful': 'legal', 'transgress': 'transgredir', 'transgression': 'transgresión',
  'covenant': 'pacto', 'oath': 'juramento', 'promise': 'promesa', 'fulfill': 'cumplir',
  'eat': 'comer', 'drink': 'beber', 'food': 'comida', 'bread': 'pan', 'wine': 'vino',
  'oil': 'aceite', 'grain': 'grano', 'harvest': 'cosecha', 'seed': 'semilla'
};

// Add Spanish glosses
function addSpanishGlosses(entries) {
  return entries.map(entry => {
    const englishWords = entry.gloss_en.toLowerCase();
    let spanishGloss = '';
    
    for (const [en, es] of Object.entries(spanishGlossary)) {
      if (englishWords.includes(en)) {
        spanishGloss = es;
        break;
      }
    }
    
    return {
      ...entry,
      gloss_es: spanishGloss || entry.gloss_en
    };
  });
}

// Create comprehensive search index (BOTH languages)
function createSearchIndex(entries) {
  const index = {};
  
  entries.forEach(entry => {
    // 1. Index by English words
    const englishWords = entry.gloss_en.toLowerCase().split(/[\s,;]+/);
    englishWords.forEach(word => {
      if (word.length > 1) {
        if (!index[word]) index[word] = [];
        if (!index[word].includes(entry.strong)) {
          index[word].push(entry.strong);
        }
      }
    });
    
    // 2. Index by Spanish words
    if (entry.gloss_es && entry.gloss_es !== entry.gloss_en) {
      const spanishWords = entry.gloss_es.toLowerCase().split(/[\s,;]+/);
      spanishWords.forEach(word => {
        if (word.length > 1) {
          if (!index[word]) index[word] = [];
          if (!index[word].includes(entry.strong)) {
            index[word].push(entry.strong);
          }
        }
      });
    }
    
    // 3. Index by transliteration
    const transWords = entry.transliteration.toLowerCase().split(/[\s-]+/);
    transWords.forEach(word => {
      if (word.length > 1) {
        if (!index[word]) index[word] = [];
        if (!index[word].includes(entry.strong)) {
          index[word].push(entry.strong);
        }
      }
    });
    
    // 4. Index by Strong's number
    if (!index[entry.strong]) index[entry.strong] = [];
    if (!index[entry.strong].includes(entry.strong)) {
      index[entry.strong].push(entry.strong);
    }
  });
  
  return index;
}

// Main execution
async function main() {
  try {
    console.log('📖 Downloading lexicons...');
    const hebrewTSV = await downloadFile(HEBREW_URL);
    const greekTSV = await downloadFile(GREEK_URL);
    
    console.log('');
    console.log('🔄 Processing...');
    
    let hebrewEntries = parseLexicon(hebrewTSV, 'hebrew');
    let greekEntries = parseLexicon(greekTSV, 'greek');
    
    console.log(`   Hebrew: ${hebrewEntries.length} entries`);
    console.log(`   Greek: ${greekEntries.length} entries`);
    
    hebrewEntries = addSpanishGlosses(hebrewEntries);
    greekEntries = addSpanishGlosses(greekEntries);
    
    const allEntries = [...hebrewEntries, ...greekEntries];
    
    console.log('🔍 Creating comprehensive search index...');
    const searchIndex = createSearchIndex(allEntries);
    
    const searchKeywords = Object.keys(searchIndex);
    console.log(`   Keywords indexed: ${searchKeywords.length.toLocaleString('es-ES')}`);
    
    // Generate TypeScript file
    const outputPath = path.join(__dirname, '../data/real-lexicon.ts');
    
    const tsContent = `// Real Biblical Lexicon from STEPBible.org
// License: Creative Commons Attribution 4.0 (CC BY 4.0)
// Source: https://github.com/STEPBible/STEPBible-Data

export interface RealLexiconEntry {
  strong: string;
  lemma: string;
  transliteration: string;
  gloss_en: string;
  gloss_es: string;
  type: string;
  language: 'hebrew' | 'greek';
}

export interface SearchIndex {
  [keyword: string]: string[];
}

// ${allEntries.length} total lexicon entries
export const realLexicon: RealLexiconEntry[] = ${JSON.stringify(allEntries, null, 2)};

// COMPREHENSIVE search index - Spanish AND English keywords
export const searchIndex: SearchIndex = ${JSON.stringify(searchIndex, null, 2)};

export function searchLexicon(keyword: string): RealLexiconEntry[] {
  const normalized = keyword.toLowerCase().trim();
  const strongNumbers = searchIndex[normalized] || [];
  
  return strongNumbers
    .map(strong => realLexicon.find(e => e.strong === strong))
    .filter((e): e is RealLexiconEntry => e !== undefined);
}

export function getByStrongs(strongNumber: string): RealLexiconEntry | undefined {
  return realLexicon.find(e => e.strong === strongNumber);
}
`;
    
    fs.writeFileSync(outputPath, tsContent, 'utf8');
    
    console.log('');
    console.log('✨ LEXICON REGENERATED WITH SPANISH+ENGLISH!');
    console.log('');
    console.log('📊 Final Statistics:');
    console.log(`   Total entries: ${allEntries.length.toLocaleString('es-ES')}`);
    console.log(`   Hebrew entries: ${hebrewEntries.length.toLocaleString('es-ES')}`);
    console.log(`   Greek entries: ${greekEntries.length.toLocaleString('es-ES')}`);
    console.log(`   SEARCHABLE keywords: ${searchKeywords.length.toLocaleString('es-ES')}`);
    console.log('');
    console.log('🔎 Ahora puedes buscar con:');
    console.log('   ✅ Palabras en ESPAÑOL (amor, paz, fe, salvación, etc)');
    console.log('   ✅ Palabras en ENGLISH (love, peace, faith, salvation, etc)');
    console.log('   ✅ Transliteraciones (shalom, agape, logos, etc)');
    console.log('   ✅ Strong′s numbers (H160, G26, etc)');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
