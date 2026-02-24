const fs = require('fs');
const path = require('path');

console.log('📖 Extracting lexicon data from TypeScript to JSON...');

const tsPath = path.join(__dirname, '../data/real-lexicon.ts');
const jsonPath = path.join(__dirname, '../public/data/real-lexicon.json');
const indexPath = path.join(__dirname, '../public/data/lexicon-search-index.json');

// Read the TypeScript file line by line
console.log('📂 Reading file...');
const lines = fs.readFileSync(tsPath, 'utf-8').split('\n');

console.log(`📄 Read ${lines.length} lines`);

// Find line numbers for key sections
let lexiconStartLine = -1;
let lexiconEndLine = -1;
let searchIndexStartLine = -1;
let searchIndexEndLine = -1;
let functionStartLine = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('export const realLexicon = [')) {
    lexiconStartLine = i + 1; // Start at next line (first entry)
  } else if ((line.trim() === '];' || line.includes('] as ReadonlyArray')) && lexiconStartLine !== -1 && lexiconEndLine === -1) {
    lexiconEndLine = i - 1; // End at line before ]
  } else if (line.includes('export const searchIndex: SearchIndex = {')) {
    searchIndexStartLine = i + 1; // Start at next line (first entry)
  } else if (line.trim() === '};' && searchIndexStartLine !== -1 && searchIndexEndLine === -1) {
    searchIndexEndLine = i - 1; // End at line before }
  } else if (line.includes('export function searchLexicon')) {
    functionStartLine = i;
    break; // Found end marker for searchIndex
  }
}

console.log(`🔍 Lexicon: lines ${lexiconStartLine} to ${lexiconEndLine}`);
console.log(`🔍 SearchIndex: lines ${searchIndexStartLine} to ${searchIndexEndLine}`);

if (lexiconStartLine === -1 || lexiconEndLine === -1) {
  console.error('❌ Could not find lexicon array boundaries');
  process.exit(1);
}

if (searchIndexStartLine === -1 || searchIndexEndLine === -1) {
  console.error('❌ Could not find search index boundaries');
  process.exit(1);
}

// Extract the lexicon array contents
console.log('📊 Extracting lexicon data...');
const lexiconLines = lines.slice(lexiconStartLine, lexiconEndLine + 1);
const lexiconArrayString = '[' + lexiconLines.join('\n') + ']';

// Extract the search index contents
console.log('🔍 Extracting search index data...');
const searchIndexLines = lines.slice(searchIndexStartLine, searchIndexEndLine + 1);
const searchIndexString = '{' + searchIndexLines.join('\n') + '}';

// Parse the data
let lexiconData;
let searchIndexData;
try {
  lexiconData = JSON.parse(lexiconArrayString);
  searchIndexData = JSON.parse(searchIndexString);
  console.log(`✅ Parsed ${lexiconData.length} lexicon entries`);
  console.log(`✅ Parsed ${Object.keys(searchIndexData).length} search index keywords`);
} catch (error) {
  console.error('❌ Failed to parse JSON:', error.message);
  process.exit(1);
}

// Ensure output directory exists
const outputDir = path.dirname(jsonPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write JSON files
fs.writeFileSync(jsonPath, JSON.stringify(lexiconData, null, 0), 'utf-8');
fs.writeFileSync(indexPath, JSON.stringify(searchIndexData, null, 0), 'utf-8');

console.log(`💾 Wrote ${lexiconData.length} entries to ${path.relative(process.cwd(), jsonPath)}`);
console.log(`💾 Wrote search index to ${path.relative(process.cwd(), indexPath)}`);
console.log('🎉 Extraction complete!');
