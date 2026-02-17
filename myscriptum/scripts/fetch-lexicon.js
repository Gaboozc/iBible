/**
 * Script para descargar Strong's Lexicon
 * Usa Node.js puro, sin dependencias externas
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const downloadFile = (url) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    https
      .get(url, (response) => {
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks).toString()));
      })
      .on('error', reject);
  });
};

const generateLexicon = async () => {
  try {
    console.log('Descargando Strong\'s Lexicon...\n');

    const urls = {
      hebrew: 'https://raw.githubusercontent.com/wordproject/hebrew-greek-lexicon/master/hebrew.json',
      greek: 'https://raw.githubusercontent.com/wordproject/hebrew-greek-lexicon/master/greek.json',
    };

    let entries = [];

    // Intentar descargar hebreo
    try {
      console.log('📥 Descargando léxico hebreo...');
      const hebrewJson = await downloadFile(urls.hebrew);
      const hebrewData = JSON.parse(hebrewJson);
      console.log(`✓ ${hebrewData.length} palabras hebreas descargadas\n`);

      hebrewData.forEach((strong) => {
        if (strong.translit) {
          entries.push({
            id: strong.translit.toLowerCase().replace(/[^\w-]/g, ''),
            lemma: strong.hebrew || strong.translit,
            transliteration: strong.translit,
            language: 'hebrew',
            strong: strong.strong,
            gloss_es: strong.kjv_def || 'Significado bíblico',
            gloss_en: strong.kjv_def || 'Biblical meaning',
            origin_es: 'Raíz semítica antigua con significado profundo.',
            origin_en: 'Ancient Semitic root with deep meaning.',
            usage_es: 'Apariciones en textos del Antiguo Testamento.',
            usage_en: 'Occurrences in Old Testament texts.',
            related: [],
          });
        }
      });
    } catch (e) {
      console.log('⚠ Error descargando hebreo:', e.message, '\n');
    }

    // Intentar descargar griego
    try {
      console.log('📥 Descargando léxico griego...');
      const greekJson = await downloadFile(urls.greek);
      const greekData = JSON.parse(greekJson);
      console.log(`✓ ${greekData.length} palabras griegas descargadas\n`);

      greekData.forEach((strong) => {
        if (strong.translit) {
          entries.push({
            id: strong.translit.toLowerCase().replace(/[^\w-]/g, ''),
            lemma: strong.greek || strong.translit,
            transliteration: strong.translit,
            language: 'greek',
            strong: strong.strong,
            gloss_es: strong.kjv_def || 'Significado bíblico',
            gloss_en: strong.kjv_def || 'Biblical meaning',
            origin_es: 'Raíz griega clásica con raíces profundas.',
            origin_en: 'Classical Greek root with deep history.',
            usage_es: 'Apariciones en textos del Nuevo Testamento.',
            usage_en: 'Occurrences in New Testament texts.',
            related: [],
          });
        }
      });
    } catch (e) {
      console.log('⚠ Error descargando griego:', e.message, '\n');
    }

    if (entries.length === 0) {
      console.log('❌ No se descargó ningún dato.\n');
      process.exit(1);
    }

    // Generar archivo TypeScript
    const outputDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'lexicon.ts');

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

    console.log('✅ Lexicon generado exitosamente!\n');
    console.log(`📊 Estadísticas:`);
    console.log(`   Total palabras: ${entries.length}`);
    console.log(`   Hebreo: ${entries.filter((e) => e.language === 'hebrew').length}`);
    console.log(`   Griego: ${entries.filter((e) => e.language === 'greek').length}`);
    console.log(`\n📁 Guardado en: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  }
};

generateLexicon();
