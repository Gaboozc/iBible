const fs = require('fs');
const path = require('path');
const https = require('https');

// STEPBible lexicon URLs (CC BY 4.0)
const HEBREW_URL = 'https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Lexicons/TBESH%20-%20Translators%20Brief%20lexicon%20of%20Extended%20Strongs%20for%20Hebrew%20-%20STEPBible.org%20CC%20BY.txt';
const GREEK_URL = 'https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Lexicons/TBESG%20-%20Translators%20Brief%20lexicon%20of%20Extended%20Strongs%20for%20Greek%20-%20STEPBible.org%20CC%20BY.txt';

console.log('📚 Building Real Biblical Lexicon from STEPBible Data...');
console.log('   Source: STEPBible.org (CC BY 4.0 License)');
console.log('');

// Download file helper
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    console.log(`⬇️  Downloading: ${url}`);
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ Downloaded successfully`);
        resolve(data);
      });
    }).on('error', reject);
  });
}

// Parse TSV lexicon data
function parseLexicon(tsvData, language) {
  const lines = tsvData.split('\n');
  const entries = [];
  
  for (let i = 1; i < lines.length; i++) { // Skip header
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    
    const parts = line.split('\t');
    if (parts.length < 3) continue;
    
    const strongNum = parts[0];
    const lemma = parts[1];
    const transliteration = parts[2];
    const brief = parts[3] || '';
    const type = parts[4] || '';
    
    // Extract clean Strong's number
    const strongMatch = strongNum.match(/[HG]\d+/);
    if (!strongMatch) continue;
    
    entries.push({
      strong: strongMatch[0],
      lemma: lemma,
      transliteration: transliteration,
      gloss_en: brief,
      type: type,
      language: language
    });
  }
  
  return entries;
}

// Spanish translations for common biblical terms
const spanishGlossary = {
  // Core theological terms
  'love': 'amor',
  'god': 'Dios',
  'lord': 'Señor',
  'faith': 'fe',
  'hope': 'esperanza',
  'peace': 'paz',
  'grace': 'gracia',
  'mercy': 'misericordia',
  'spirit': 'espíritu',
  'truth': 'verdad',
  'life': 'vida',
  'death': 'muerte',
  'sin': 'pecado',
  'righteous': 'justo',
  'righteousness': 'justicia',
  'holy': 'santo',
  'holiness': 'santidad',
  'salvation': 'salvación',
  'redeem': 'redimir',
  'covenant': 'pacto',
  'law': 'ley',
  'commandment': 'mandamiento',
  'word': 'palabra',
  'prophet': 'profeta',
  'priest': 'sacerdote',
  'king': 'rey',
  'temple': 'templo',
  'sacrifice': 'sacrificio',
  'altar': 'altar',
  'worship': 'adoración',
  'prayer': 'oración',
  'praise': 'alabanza',
  'glory': 'gloria',
  'power': 'poder',
  'wisdom': 'sabiduría',
  'knowledge': 'conocimiento',
  'understanding': 'entendimiento',
  'heart': 'corazón',
  'soul': 'alma',
  'mind': 'mente',
  'strength': 'fuerza',
  'heaven': 'cielo',
  'earth': 'tierra',
  'judgment': 'juicio',
  'wrath': 'ira',
  'anger': 'enojo',
  'jealous': 'celoso',
  'compassion': 'compasión',
  'kindness': 'bondad',
  'patience': 'paciencia',
  'joy': 'gozo',
  'bless': 'bendecir',
  'blessing': 'bendición',
  'curse': 'maldición',
  'repent': 'arrepentirse',
  'forgive': 'perdonar',
  'forgiveness': 'perdón',
  'deliver': 'liberar',
  'deliverance': 'liberación',
  'people': 'pueblo',
  'nation': 'nación',
  'servant': 'siervo',
  'disciple': 'discípulo',
  'apostle': 'apóstol',
  'witness': 'testigo',
  'revelation': 'revelación',
  'vision': 'visión',
  'dream': 'sueño',
  'angel': 'ángel',
  'messiah': 'mesías',
  'christ': 'cristo',
  'son': 'hijo',
  'father': 'padre',
  'mother': 'madre',
  'brother': 'hermano',
  'sister': 'hermana',
  'child': 'niño',
  'woman': 'mujer',
  'man': 'hombre',
  'house': 'casa',
  'city': 'ciudad',
  'mountain': 'montaña',
  'water': 'agua',
  'fire': 'fuego',
  'light': 'luz',
  'darkness': 'oscuridad',
  'day': 'día',
  'night': 'noche',
  'year': 'año',
  'time': 'tiempo',
  'way': 'camino',
  'gate': 'puerta',
  'good': 'bueno',
  'evil': 'malo',
  'right': 'derecho',
  'left': 'izquierdo',
  'great': 'grande',
  'small': 'pequeño',
  'first': 'primero',
  'last': 'último',
  'eternal': 'eterno',
  'forever': 'para siempre'
};

// Add Spanish glosses
function addSpanishGlosses(entries) {
  return entries.map(entry => {
    const englishWords = entry.gloss_en.toLowerCase();
    let spanishGloss = '';
    
    // Find matching Spanish translation
    for (const [en, es] of Object.entries(spanishGlossary)) {
      if (englishWords.includes(en)) {
        spanishGloss = es;
        break;
      }
    }
    
    return {
      ...entry,
      gloss_es: spanishGloss || entry.gloss_en // Fallback to English if no Spanish
    };
  });
}

// Create inverse search index
function createSearchIndex(entries) {
  const index = {};
  
  entries.forEach(entry => {
    // Index by English words
    const englishWords = entry.gloss_en.toLowerCase().split(/[\s,;]+/);
    englishWords.forEach(word => {
      if (word.length > 2) {
        if (!index[word]) index[word] = [];
        index[word].push(entry.strong);
      }
    });
    
    // Index by Spanish words
    if (entry.gloss_es) {
      const spanishWords = entry.gloss_es.toLowerCase().split(/[\s,;]+/);
      spanishWords.forEach(word => {
        if (word.length > 2) {
          if (!index[word]) index[word] = [];
          if (!index[word].includes(entry.strong)) {
            index[word].push(entry.strong);
          }
        }
      });
    }
    
    // Index by transliteration
    const transWords = entry.transliteration.toLowerCase().split(/[\s-]+/);
    transWords.forEach(word => {
      if (word.length > 2) {
        if (!index[word]) index[word] = [];
        if (!index[word].includes(entry.strong)) {
          index[word].push(entry.strong);
        }
      }
    });
  });
  
  return index;
}

// Main execution
async function main() {
  try {
    // Download lexicons
    console.log('📖 Downloading Hebrew Lexicon...');
    const hebrewTSV = await downloadFile(HEBREW_URL);
    
    console.log('📖 Downloading Greek Lexicon...');
    const greekTSV = await downloadFile(GREEK_URL);
    
    console.log('');
    console.log('🔄 Processing lexicons...');
    
    // Parse data
    let hebrewEntries = parseLexicon(hebrewTSV, 'hebrew');
    let greekEntries = parseLexicon(greekTSV, 'greek');
    
    console.log(`   Hebrew entries parsed: ${hebrewEntries.length}`);
    console.log(`   Greek entries parsed: ${greekEntries.length}`);
    
    // Add Spanish translations
    hebrewEntries = addSpanishGlosses(hebrewEntries);
    greekEntries = addSpanishGlosses(greekEntries);
    
    // Combine all entries
    const allEntries = [...hebrewEntries, ...greekEntries];
    
    // Create search index
    console.log('🔍 Creating search index...');
    const searchIndex = createSearchIndex(allEntries);
    
    console.log(`   Indexed keywords: ${Object.keys(searchIndex).length}`);
    
    // Generate TypeScript file
    const outputPath = path.join(__dirname, '../data/real-lexicon.ts');
    
    const tsContent = `// Real Biblical Lexicon from STEPBible.org
// License: Creative Commons Attribution 4.0 (CC BY 4.0)
// Source: https://github.com/STEPBible/STEPBible-Data

export interface RealLexiconEntry {
  strong: string;        // Strong's number (H#### or G####)
  lemma: string;        // Original Hebrew/Greek word
  transliteration: string;
  gloss_en: string;     // English definition
  gloss_es: string;     // Spanish definition
  type: string;         // Morphological type
  language: 'hebrew' | 'greek';
}

export interface SearchIndex {
  [keyword: string]: string[]; // keyword -> Strong's numbers
}

// ${allEntries.length} total lexicon entries
export const realLexicon: RealLexiconEntry[] = ${JSON.stringify(allEntries, null, 2)};

// Search index for inverse lookup (Spanish/English -> Strong's)
export const searchIndex: SearchIndex = ${JSON.stringify(searchIndex, null, 2)};

// Helper function: search by Spanish or English keyword
export function searchLexicon(keyword: string): RealLexiconEntry[] {
  const normalized = keyword.toLowerCase().trim();
  const strongNumbers = searchIndex[normalized] || [];
  
  return strongNumbers
    .map(strong => realLexicon.find(e => e.strong === strong))
    .filter((e): e is RealLexiconEntry => e !== undefined);
}

// Helper function: get entry by Strong's number
export function getByStrongs(strongNumber: string): RealLexiconEntry | undefined {
  return realLexicon.find(e => e.strong === strongNumber);
}
`;
    
    fs.writeFileSync(outputPath, tsContent, 'utf8');
    
    console.log('');
    console.log('✨ REAL LEXICON GENERATED SUCCESSFULLY!');
    console.log('');
    console.log('📊 Statistics:');
    console.log(`   Total entries: ${allEntries.length}`);
    console.log(`   Hebrew words: ${hebrewEntries.length}`);
    console.log(`   Greek words: ${greekEntries.length}`);
    console.log(`   Searchable keywords: ${Object.keys(searchIndex).length}`);
    console.log('');
    console.log(`📁 Output: ${outputPath}`);
    console.log('');
    console.log('🔍 Usage examples:');
    console.log(`   searchLexicon('amor')     // Find Hebrew/Greek for "love"`);
    console.log(`   searchLexicon('peace')    // Find shalom, eirene`);
    console.log(`   getByStrongs('H160')      // Get specific Strong's entry`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
