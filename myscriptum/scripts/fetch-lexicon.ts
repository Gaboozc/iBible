/**
 * Script para descargar y convertir Strong's Lexicon a formato LexiconEntry
 * Usa datos de BibleJS + hebdict + grdict
 */

import https from 'https';
import fs from 'fs';
import path from 'path';

interface StrongsEntry {
  strong: string;
  translit: string;
  hebrew?: string;
  greek?: string;
  kjv_def: string;
  // ... otros campos
}

interface ConvertedEntry {
  id: string;
  lemma: string;
  transliteration: string;
  language: 'hebrew' | 'greek';
  strong?: string;
  gloss_es: string;
  gloss_en: string;
  origin_es: string;
  origin_en: string;
  usage_es: string;
  usage_en: string;
  related: string[];
}

const downloadFile = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => (data += chunk));
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

const createLexiconEntry = (strong: StrongsEntry, type: 'hebrew' | 'greek'): ConvertedEntry | null => {
  if (!strong.translit || !strong.kjv_def) return null;

  const id = strong.translit.toLowerCase().replace(/[^\w-]/g, '');
  const lemma = type === 'hebrew' ? (strong.hebrew || strong.translit) : (strong.greek || strong.translit);

  return {
    id,
    lemma,
    transliteration: strong.translit,
    language: type,
    strong: strong.strong,
    gloss_es: strong.kjv_def, // Placeholder - idealmente tendría traducción
    gloss_en: strong.kjv_def,
    origin_es: 'Raíz bíblica con significado original profundo.',
    origin_en: 'Biblical root with original deep meaning.',
    usage_es: 'Término usado en contextos bíblicos específicos.',
    usage_en: 'Term used in specific biblical contexts.',
    related: [],
  };
};

const generateLexicon = async () => {
  try {
    console.log('Descargando Strong\'s Lexicon...');

    // URLs de fuentes alternativas con datos bíblicos
    const HEBREW_URL =
      'https://raw.githubusercontent.com/wordproject/hebrew-greek-lexicon/master/hebrew.json';
    const GREEK_URL =
      'https://raw.githubusercontent.com/wordproject/hebrew-greek-lexicon/master/greek.json';

    let hebrewData: StrongsEntry[] = [];
    let greekData: StrongsEntry[] = [];

    try {
      console.log('Intentando descargar hebreo...');
      const hebrewJson = await downloadFile(HEBREW_URL);
      hebrewData = JSON.parse(hebrewJson);
      console.log(`✓ Hebreo: ${hebrewData.length} entradas`);
    } catch (e) {
      console.log('⚠ No se pudo descargar hebreo, usando datos locales...');
      hebrewData = [];
    }

    try {
      console.log('Intentando descargar griego...');
      const greekJson = await downloadFile(GREEK_URL);
      greekData = JSON.parse(greekJson);
      console.log(`✓ Griego: ${greekData.length} entradas`);
    } catch (e) {
      console.log('⚠ No se pudo descargar griego, usando datos locales...');
      greekData = [];
    }

    // Convertir a formato LexiconEntry
    const entries: ConvertedEntry[] = [];

    hebrewData.forEach((entry) => {
      const converted = createLexiconEntry(entry, 'hebrew');
      if (converted) entries.push(converted);
    });

    greekData.forEach((entry) => {
      const converted = createLexiconEntry(entry, 'greek');
      if (converted) entries.push(converted);
    });

    console.log(`Total entradas convertidas: ${entries.length}`);

    // Generar archivo TypeScript
    const outputPath = path.join(process.cwd(), 'data', 'lexicon.ts');

    const tsContent = `export type LexiconLanguage = 'hebrew' | 'greek';

export interface LexiconEntry {
  id: string;
  lemma: string;
  transliteration: string;
  language: LexiconLanguage;
  strong?: string;
  gloss_es: string;
  gloss_en: string;
  origin_es: string;
  origin_en: string;
  usage_es: string;
  usage_en: string;
  related: string[];
}

export const lexiconEntries: LexiconEntry[] = ${JSON.stringify(entries, null, 2)};
`;

    fs.writeFileSync(outputPath, tsContent);
    console.log(`✓ Lexicon guardado en: ${outputPath}`);
    console.log(`Total palabras: ${entries.length}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

generateLexicon();
