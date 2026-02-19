const fs = require('fs');
const path = require('path');

// Read the lexicon file
const lexiconPath = path.join(__dirname, '../data/real-lexicon.ts');
const content = fs.readFileSync(lexiconPath, 'utf8');

// Extract entries count from comment
const entriesMatch = content.match(/\/\/ (\d+) total lexicon entries/);
const totalEntries = entriesMatch ? parseInt(entriesMatch[1]) : 0;

// Count occurrences of Strong's numbers in searchIndex
const searchIndexStart = content.indexOf('export const searchIndex');
const searchIndexEnd = content.lastIndexOf('};');
const indexStr = content.substring(searchIndexStart, searchIndexEnd);

// Count keyword entries (lines with "word": [...])
const keyMatches = indexStr.match(/"[^"]+": \[/g) || [];
const keywordCount = keyMatches.length;

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('📚 LEXICÓN BÍBLICO REAL - ESTADÍSTICAS');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log(`📕 Entradas totales en lexicón:     ${totalEntries.toLocaleString('es-ES')} palabras`);
console.log(`   - Hebreo (AT):                   ~11,682 palabras`);
console.log(`   - Griego (NT):                   ~11,038 palabras`);
console.log('');
console.log(`🔍 Palabras clave indexadas:        ${keywordCount.toLocaleString('es-ES')} keywords`);
console.log(`   (En español e inglés combinados)`);
console.log('');
console.log('─────────────────────────────────────────────────────────────────');
console.log('📋 EJEMPLOS VERIFICABLES:');
console.log('─────────────────────────────────────────────────────────────────');
console.log('');

const spanishExamples = [
  'amor', 'fe', 'paz', 'gracia', 'verdad', 'vida', 
  'muerte', 'pecado', 'santo', 'profeta', 'rey', 'templo'
];

const englishExamples = [
  'love', 'faith', 'peace', 'grace', 'truth', 'life',
  'death', 'sin', 'holy', 'prophet', 'king', 'temple'
];

console.log('✨ Palabras en ESPAÑOL ejemplos:');
spanishExamples.forEach(word => {
  const found = indexStr.includes(`"${word}"`);
  console.log(`   ${found ? '✓' : '✗'} ${word}`);
});

console.log('');
console.log('✨ Palabras en ENGLISH ejemplos:');
englishExamples.forEach(word => {
  const found = indexStr.includes(`"${word}"`);
  console.log(`   ${found ? '✓' : '✗'} ${word}`);
});

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('🎯 RESUMEN:');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log(`✅ Puedes buscar con aproximadamente ${keywordCount.toLocaleString('es-ES')} palabras`);
console.log(`✅ Cobertura: ${totalEntries.toLocaleString('es-ES')} palabras bíblicas reales`);
console.log(`✅ Disponible en ESPAÑOL e INGLÉS`);
console.log(`✅ Cada palabra te conecta con hebreo/griego + Strong's`);
console.log('');
console.log('🌐 Fuente: STEPBible.org (CC BY 4.0)');
console.log('');
