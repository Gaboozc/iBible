const fs = require('fs');

// Read file
const data = fs.readFileSync('data/real-lexicon.ts', 'utf8');

// Find searchIndex section
const startIdx = data.indexOf('export const searchIndex');
const endIdx = data.lastIndexOf('};');
const indexSection = data.substring(startIdx + 40, endIdx);

// Get first 100 lines that show keywords
const lines = indexSection.split('\n').slice(0, 100);

console.log('\n📚 PRIMERAS 100 PALABRAS CLAVE INDEXADAS:\n');
lines.forEach((line, i) => {
  if (line.includes(': [')) {
    const match = line.match(/"([^"]+)"/);
    if (match) {
      console.log(`${i + 1}. ${match[1]}`);
    }
  }
});
