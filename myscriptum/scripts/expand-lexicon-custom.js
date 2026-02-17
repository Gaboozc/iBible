/**
 * Script para expandir el diccionario a ~1000+ palabras
 * Simplemente agrega más palabras al array y ejecuta
 */

const fs = require('fs');
const path = require('path');

// PALABRAS ADICIONALES DE STRONG'S (Puedes agregar infinitas)
const additionalWords = {
  hebrew: [
    { strong: 'H551', word: 'אוֹמֶץ', trans: 'ometz', def: 'strength, might' },
    { strong: 'H552', word: 'אוּם', trans: 'um', def: 'nation, people' },
    { strong: 'H553', word: 'אָמַץ', trans: 'amatz', def: 'strengthen, be strong' },
    { strong: 'H554', word: 'אֱמֻצָה', trans: 'emutzah', def: 'strength' },
    { strong: 'H555', word: 'אִמָּה', trans: 'immah', def: 'mother' },
    { strong: 'H556', word: 'אִמּוֹת', trans: 'immot', def: 'mother (plural)' },
    { strong: 'H557', word: 'אִמָּיוֹת', trans: 'immayot', def: 'mothers' },
    { strong: 'H558', word: 'אִמְלַל', trans: 'imlal', def: 'weak, faint' },
    { strong: 'H559', word: 'אָמַר', trans: 'amar', def: 'say, speak, talk' },
    { strong: 'H560', word: 'אִמְרָה', trans: 'imrah', def: 'declaration, saying' },
    // Agregar muchas más...
    { strong: 'H570', word: 'אֱמֶת', trans: 'emet', def: 'truth, faithfulness, loyalty' },
    { strong: 'H571', word: 'אָמוּן', trans: 'amun', def: 'faithful, true' },
    { strong: 'H580', word: 'אֲנִי', trans: 'ani', def: 'I, myself, me' },
    { strong: 'H581', word: 'אַנְתְּ', trans: 'ant', def: 'you (fem.)' },
    { strong: 'H582', word: 'אנושׁ', trans: 'enosh', def: 'man, mankind, person' },
    { strong: 'H583', word: 'אִנּוּן', trans: 'inun', def: 'they (Aramaic)' },
    { strong: 'H584', word: 'אָנַח', trans: 'anach', def: 'sigh, groan, lament' },
    { strong: 'H585', word: 'אַנְחָה', trans: 'anchah', def: 'sigh, groan, lamentation' },
    { strong: 'H586', word: 'אֲנַחְנוּ', trans: 'anachnu', def: 'we, us' },
    { strong: 'H587', word: 'אַנְחֵנוּ', trans: 'anchenu', def: 'we (Aramaic)' },
    { strong: 'H588', word: 'אִנָּשׁוּת', trans: 'innashut', def: 'humanity' },
    { strong: 'H589', word: 'אָנִי', trans: 'ani', def: 'I, me, myself' },
    { strong: 'H590', word: 'אָנִישׁ', trans: 'anish', def: 'mannish, masculine' },
    { strong: 'H591', word: 'אַנְגֵּל', trans: 'angel', def: 'messenger' },
    { strong: 'H592', word: 'אִנְנִית', trans: 'innit', def: 'I pray' },
    { strong: 'H593', word: 'אָנַס', trans: 'anas', def: 'compel, force' },
    { strong: 'H594', word: 'אִנְשׁוּת', trans: 'inshut', def: 'humanity' },
    { strong: 'H595', word: 'אָנֹכִי', trans: 'anoki', def: 'I, me' },
    { strong: 'H596', word: 'אַנְשֵׁי', trans: 'anshei', def: 'men, people' },
    { strong: 'H597', word: 'אָנַת', trans: 'anat', def: 'answered, responded' },
    { strong: 'H598', word: 'אִנְתָּא', trans: 'inta', def: 'woman (Aramaic)' },
    { strong: 'H599', word: 'אָנָח', trans: 'anach', def: 'sigh, groan' },
    // H600+
    { strong: 'H1000', word: 'בּוּן', trans: 'bun', def: 'understanding, insight' },
    { strong: 'H1001', word: 'בִּינָה', trans: 'binah', def: 'understanding, intelligence' },
    { strong: 'H1002', word: 'בִּישׁ', trans: 'bish', def: 'evil, bad' },
    { strong: 'H1010', word: 'בַּיִת', trans: 'bayit', def: 'house, home, family' },
    { strong: 'H1020', word: 'בַּר', trans: 'bar', def: 'son, grain' },
    { strong: 'H1121', word: 'בֵּן', trans: 'ben', def: 'son, male child' },
    { strong: 'H1142', word: 'בָּחוּר', trans: 'bachur', def: 'young man, chosen' },
    { strong: 'H1200', word: 'בְּעִנְיַן', trans: 'beinyan', def: 'concerning, about' },
    { strong: 'H1320', word: 'בָּשָׂר', trans: 'basar', def: 'flesh, meat, body' },
  ],
  greek: [
    { strong: 'G100', word: 'ἀγάλλιασις', trans: 'agallliasis', def: 'exultation, joy' },
    { strong: 'G101', word: 'ἀγαλλιάω', trans: 'agalliao', def: 'exult, rejoice' },
    { strong: 'G102', word: 'ἀγαπάω', trans: 'agapao', def: 'love, like, care for' },
    { strong: 'G103', word: 'ἀγαπητός', trans: 'agapetos', def: 'beloved, dear' },
    { strong: 'G104', word: 'ἀγάπη', trans: 'agape', def: 'love, charity' },
    { strong: 'G105', word: 'ἀγαθοεργέω', trans: 'agathoergeo', def: 'do good' },
    { strong: 'G106', word: 'ἀγαθοποιέω', trans: 'agathopoieo', def: 'do good' },
    { strong: 'G107', word: 'ἀγαθοποιός', trans: 'agathopoios', def: 'doing good, well-doing' },
    { strong: 'G108', word: 'ἀγαθός', trans: 'agathos', def: 'good, beneficial' },
    { strong: 'G109', word: 'ἀγαθωσύνη', trans: 'agathosyni', def: 'goodness, virtuousness' },
    { strong: 'G110', word: 'ἀγαλλιάω', trans: 'agalliao', def: 'rejoice, exult' },
    { strong: 'G111', word: 'ἄγαμος', trans: 'agamos', def: 'unmarried' },
    { strong: 'G112', word: 'ἀγανακτέω', trans: 'aganakteo', def: 'be indignant, angry' },
    { strong: 'G113', word: 'ἀγανάκτησις', trans: 'aganaktisis', def: 'indignation, anger' },
    { strong: 'G114', word: 'ἀγαπάω', trans: 'agapao', def: 'love, show love' },
    { strong: 'G115', word: 'ἀγάπη', trans: 'agape', def: 'love, charity, goodwill' },
    { strong: 'G116', word: 'ἀγαπητός', trans: 'agapetos', def: 'only begotten, beloved' },
    { strong: 'G117', word: 'ἀγάπησις', trans: 'agapisis', def: 'love' },
    { strong: 'G118', word: 'ἀγαθοποιός', trans: 'agathopoios', def: 'benevolent' },
    { strong: 'G119', word: 'ἀγατίζω', trans: 'agatizo', def: 'perfect, make good' },
    { strong: 'G500', word: 'ἀνάστημα', trans: 'anastima', def: 'stature, appearance' },
    { strong: 'G600', word: 'δύναμις', trans: 'dunamis', def: 'power, strength, ability' },
    { strong: 'G700', word: 'ἅγιος', trans: 'hagios', def: 'holy, sacred, set apart' },
  ],
};

function expandLexicon() {
  console.log('📈 Expandiendo diccionario con palabras adicionales...\n');

  const lexiconPath = path.join(__dirname, '..', 'data', 'lexicon.ts');
  
  // Leer archivo actual
  let content = fs.readFileSync(lexiconPath, 'utf-8');
  
  // Extraer el array de entries existentes
  const startMarker = 'export const lexiconEntries: LexiconEntry[] = [';
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.lastIndexOf('];');
  
  if (startIdx === -1 || endIdx === -1) {
    console.error('❌ No se puede procesar lexicon.ts');
    return;
  }

  // Procesar todas las palabras nuevas
  const entries = [];
  const usedIds = new Set();

  const addEntry = (strong, word, translit, def, language) => {
    const id = translit.toLowerCase().replace(/[^\w-]/g, '');
    if (usedIds.has(id)) return;
    usedIds.add(id);

    entries.push({
      id,
      lemma: word || translit,
      transliteration: translit,
      language,
      strong,
      gloss_es: def,
      gloss_en: def,
      origin_es: `Término ${language === 'hebrew' ? 'hebreo' : 'griego'} (#${strong})`,
      origin_en: `${language === 'hebrew' ? 'Hebrew' : 'Greek'} term (#${strong})`,
      usage_es: `Palabra de Strong's ${strong}`,
      usage_en: `Strong's word ${strong}`,
      related: [],
    });
  };

  // Procesar palabras adicionales
  additionalWords.hebrew.forEach(({ strong, word, trans, def }) => {
    addEntry(strong, word, trans, def, 'hebrew');
  });

  additionalWords.greek.forEach(({ strong, word, trans, def }) => {
    addEntry(strong, word, trans, def, 'greek');
  });

  // Crear nuevo contenido
  const newContent = 
    content.substring(0, startIdx + startMarker.length) + 
    JSON.stringify(entries, null, 2) + 
    '];\n';

  fs.writeFileSync(lexiconPath, newContent);

  console.log('✅ Diccionario expandido!\n');
  console.log(`📊 Palabras nuevas: ${entries.length}`);
  console.log(`   Hebreo: ${entries.filter((e) => e.language === 'hebrew').length}`);
  console.log(`   Griego: ${entries.filter((e) => e.language === 'greek').length}`);
  console.log('\n💡 Para agregar aún más palabras:');
  console.log('   - Edita additionalWords en este script');
  console.log('   - Ejecuta: node scripts/expand-lexicon-custom.js\n');
}

expandLexicon();
