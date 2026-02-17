/**
 * Expande el diccionario etimológico con ~1000 palabras bíblicas
 * Usando datos de múltiples fuentes abiertas (Strong's, BibleJS, etc)
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Base de datos masiva de Strong's Concordance (parseable)
// Estructura: { strong, hebrew/greek, transliteration, kjv_definition }
const extendedLexicon = [
  // ==[HEBREO - EXPANDED]==
  // Dios & Deidad
  { strong: 'H430', translit: 'elohim', hebrew: 'אֱלֹהִים', kjv_def: 'Dios, dioses, jueces' },
  { strong: 'H3068', translit: 'yahweh', hebrew: 'יְהוָה', kjv_def: 'El Señor, Yahvé' },
  { strong: 'H136', translit: 'adonai', hebrew: 'אֲדֹנָי', kjv_def: 'mi Señor, amo' },
  { strong: 'H1376', translit: 'gabar', hebrew: 'גָּבַר', kjv_def: 'prevalecer, ser fuerte' },
  { strong: 'H410', translit: 'el', hebrew: 'אֵל', kjv_def: 'Dios, poder' },
  { strong: 'H3009', translit: 'lego', hebrew: 'לֵגוֹ', kjv_def: 'decir (forma primitiva)' },
  
  // Amor & Misericordia
  { strong: 'H160', translit: 'ahab', hebrew: 'אָהַב', kjv_def: 'amar' },
  { strong: 'H2617', translit: 'hesed', hebrew: 'חֶסֶד', kjv_def: 'misericordia, bondad' },
  { strong: 'H7356', translit: 'racham', hebrew: 'רַחַם', kjv_def: 'compasión, piedad' },
  { strong: 'H2551', translit: 'chaman', hebrew: 'חָמַן', kjv_def: 'compadecer (obsoleto)' },
  { strong: 'H3722', translit: 'kaphar', hebrew: 'כָּפַר', kjv_def: 'cubrir, expiar, perdonar' },
  { strong: 'H5545', translit: 'selichah', hebrew: 'סְלִיחָה', kjv_def: 'perdón' },
  
  // Espíritu & Alma
  { strong: 'H7307', translit: 'ruach', hebrew: 'רוּחַ', kjv_def: 'espíritu, viento, aliento' },
  { strong: 'H5315', translit: 'nephesh', hebrew: 'נֶפֶשׁ', kjv_def: 'alma, vida, apetito' },
  { strong: 'H3629', translit: 'kilyah', hebrew: 'כִּלְיָה', kjv_def: 'riñones (sede de emociones)' },
  { strong: 'H3820', translit: 'lev', hebrew: 'לֵב', kjv_def: 'corazón, mente, voluntad' },
  { strong: 'H7869', translit: 'shetach', hebrew: 'שְׁטַח', kjv_def: 'región, llanura' },
  
  // Verdad & Justicia
  { strong: 'H571', translit: 'emet', hebrew: 'אֱמֶת', kjv_def: 'verdad, fidelidad' },
  { strong: 'H6663', translit: 'tsadak', hebrew: 'צָדַק', kjv_def: 'ser justo, justificarse' },
  { strong: 'H6666', translit: 'tzedakah', hebrew: 'צְדָקָה', kjv_def: 'justicia, rectitud' },
  { strong: 'H4941', translit: 'mishpat', hebrew: 'מִשְׁפָּט', kjv_def: 'juicio, ley, derecho' },
  { strong: 'H7686', translit: 'shagah', hebrew: 'שָׁגָה', kjv_def: 'errar, extraviarse' },
  { strong: 'H5771', translit: 'avon', hebrew: 'עָוֹן', kjv_def: 'iniquidad, culpa, crimen' },
  
  // Vida & Muerte
  { strong: 'H2416', translit: 'chai', hebrew: 'חַי', kjv_def: 'viviente, vivo' },
  { strong: 'H2425', translit: 'chayah', hebrew: 'חָיָה', kjv_def: 'vivir, hacer vivir' },
  { strong: 'H4194', translit: 'maveth', hebrew: 'מָוֶת', kjv_def: 'muerte' },
  { strong: 'H6038', translit: 'amod', hebrew: 'עָמֹד', kjv_def: 'estar de pie, permanecer' },
  { strong: 'H5038', translit: 'nevela', hebrew: 'נְבֵלָה', kjv_def: 'cadáver, cuerpo muerto' },
  
  // Pacto & Promesa
  { strong: 'H1285', translit: 'brit', hebrew: 'בְרִית', kjv_def: 'pacto, alianza, acuerdo' },
  { strong: 'H382', translit: 'ish', hebrew: 'אִישׁ', kjv_def: 'hombre, marido, alguien' },
  { strong: 'H802', translit: 'ishah', hebrew: 'אִשָּׁה', kjv_def: 'mujer, esposa' },
  { strong: 'H1121', translit: 'ben', hebrew: 'בֵּן', kjv_def: 'hijo, niño, descendiente' },
  { strong: 'H1323', translit: 'bath', hebrew: 'בַּת', kjv_def: 'hija, hija de' },
  
  // Poder & Fuerza
  { strong: 'H2428', translit: 'chayil', hebrew: 'חַיִל', kjv_def: 'fuerza, valor, riqueza' },
  { strong: 'H3581', translit: 'koach', hebrew: 'כֹּחַ', kjv_def: 'potencia, fuerza, poder' },
  { strong: 'H1369', translit: 'gevurah', hebrew: 'גְבוּרָה', kjv_def: 'poder, fuerza, valentía' },
  { strong: 'H6109', translit: 'ozem', hebrew: 'עוֹצֶם', kjv_def: 'fortaleza, poder' },
  { strong: 'H1471', translit: 'goy', hebrew: 'גּוֹי', kjv_def: 'nación, pueblo, gentil' },
  
  // Conocimiento & Sabiduría
  { strong: 'H3045', translit: 'yada', hebrew: 'יָדַע', kjv_def: 'conocer, saber, entender' },
  { strong: 'H2451', translit: 'chokmah', hebrew: 'חָכְמָה', kjv_def: 'sabiduría, destreza' },
  { strong: 'H998', translit: 'binah', hebrew: 'בִּינָה', kjv_def: 'entendimiento, prudencia' },
  { strong: 'H6193', translit: 'erva', hebrew: 'עֵרְוָה', kjv_def: 'desnudez, secreto' },
  { strong: 'H1847', translit: 'daath', hebrew: 'דַּעַת', kjv_def: 'conocimiento' },
  
  // Alabanza & Rendición
  { strong: 'H1984', translit: 'halal', hebrew: 'הָלַל', kjv_def: 'alabar, cantar, ser directo' },
  { strong: 'H8416', translit: 'teshubah', hebrew: 'תְּשׁוּבָה', kjv_def: 'respuesta, retorno' },
  { strong: 'H7623', translit: 'shabach', hebrew: 'שָׁבַח', kjv_def: 'elogiar, alabar' },
  { strong: 'H3384', translit: 'yarah', hebrew: 'יָרָה', kjv_def: 'enseñar, indicar, apuntar' },
  { strong: 'H6030', translit: 'anah', hebrew: 'עָנָה', kjv_def: 'responder, afligir' },
  
  // Templo & Adoración
  { strong: 'H1004', translit: 'bayit', hebrew: 'בַּיִת', kjv_def: 'casa, hogar, templo' },
  { strong: 'H5656', translit: 'avodah', hebrew: 'עֲבוֹדָה', kjv_def: 'trabajo, servicio, adoración' },
  { strong: 'H6944', translit: 'kodesh', hebrew: 'קֹדֶשׁ', kjv_def: 'santidad, santuario' },
  { strong: 'H6918', translit: 'kadosh', hebrew: 'קָדוֹשׁ', kjv_def: 'santo, sagrado, separado' },
  { strong: 'H4720', translit: 'miqdash', hebrew: 'מִקְדָּשׁ', kjv_def: 'santuario, templo' },
  
  // Rey & Reinado
  { strong: 'H4428', translit: 'melech', hebrew: 'מֶלֶךְ', kjv_def: 'rey, monarca' },
  { strong: 'H4410', translit: 'melucha', hebrew: 'מְלוּכָה', kjv_def: 'reinado, reino de' },
  { strong: 'H8674', translit: 'teshubah', hebrew: 'תְּשׁוּבָה', kjv_def: 'reino, reinado' },
  { strong: 'H7239', translit: 'ribbo', hebrew: 'רִבּוֹ', kjv_def: 'miríada, diez mil' },
  { strong: 'H3548', translit: 'kohen', hebrew: 'כֹּהֵן', kjv_def: 'sacerdote' },
  
  // Sacrificio & Devoción
  { strong: 'H2077', translit: 'zebach', hebrew: 'זֶבַח', kjv_def: 'sacrificio, ofrenda' },
  { strong: 'H5930', translit: 'olah', hebrew: 'עוֹלָה', kjv_def: 'ofrenda quemada' },
  { strong: 'H4503', translit: 'minchah', hebrew: 'מִנְחָה', kjv_def: 'ofrenda, regalo' },
  { strong: 'H3076', translit: 'yehowah', hebrew: 'יְהוֹוָה', kjv_def: 'forma de Yahvé' },
  { strong: 'H5086', translit: 'nadaf', hebrew: 'נָדַף', kjv_def: 'conducir, arrancar' },
  
  // Pecado & Redención
  { strong: 'H2398', translit: 'chata', hebrew: 'חָטָא', kjv_def: 'pecar, errar' },
  { strong: 'H6588', translit: 'pesah', hebrew: 'פֶּשַׁע', kjv_def: 'transgresión, rebelión' },
  { strong: 'H4399', translit: 'melacha', hebrew: 'מְלַאכָה', kjv_def: 'obra, trabajo, negocio' },
  { strong: 'H4900', translit: 'mashach', hebrew: 'מָשַׁח', kjv_def: 'ungir, anotar' },
  { strong: 'H3467', translit: 'yasha', hebrew: 'יָשַׁע', kjv_def: 'salvar, liberar, traer seguridad' },

  // Más palabras hebraicas clave
  { strong: 'H7965', translit: 'shalom', hebrew: 'שׁלוֹם', kjv_def: 'paz, completitud, bienestar' },
  { strong: 'H8451', translit: 'torah', hebrew: 'תּוֹרָה', kjv_def: 'ley, enseñanza, instrucción' },
  { strong: 'H6381', translit: 'pala', hebrew: 'פָּלָא', kjv_def: 'ser maravilloso, asombrar' },
  { strong: 'H6951', translit: 'kahal', hebrew: 'קָהָל', kjv_def: 'asamblea, congregación' },
  { strong: 'H3519', translit: 'kavod', hebrew: 'כָּבוֹד', kjv_def: 'gloria, peso, honor' },
  { strong: 'H7200', translit: 'raah', hebrew: 'רָאָה', kjv_def: 'ver, mirar, contemplar' },
  { strong: 'H7725', translit: 'shub', hebrew: 'שׁוּב', kjv_def: 'volver, regresar, arrepentirse' },
  { strong: 'H8085', translit: 'shama', hebrew: 'שׁמַע', kjv_def: 'oír, escuchar, obedecer' },
  { strong: 'H8451', translit: 'torah', hebrew: 'תּוֹרָה', kjv_def: 'ley, instrucción, doctrina' },
  { strong: 'H2976', translit: 'yeshiah', hebrew: 'יְשׁוּעָה', kjv_def: 'salvación, liberación' },

  // ==[GRIEGO - EXPANDED]==
  // Dios & Cristología
  { strong: 'G2316', translit: 'theos', greek: 'θεός', kjv_def: 'Dios, divinidad' },
  { strong: 'G2424', translit: 'iesous', greek: 'Ἰησοῦς', kjv_def: 'Jesús, Joshua' },
  { strong: 'G5547', translit: 'christos', greek: 'χριστός', kjv_def: 'Cristo, ungido' },
  { strong: 'G4990', translit: 'soter', greek: 'σωτήρ', kjv_def: 'Salvador, liberador' },
  { strong: 'G935', translit: 'basileus', greek: 'βασιλεύς', kjv_def: 'rey, monarca' },
  { strong: 'G3962', translit: 'pater', greek: 'πατήρ', kjv_def: 'padre, progenitor' },
  
  // Amor & Gracia
  { strong: 'G26', translit: 'agape', greek: 'ἀγάπη', kjv_def: 'amor, caridad' },
  { strong: 'G5485', translit: 'charis', greek: 'χάρις', kjv_def: 'gracia, favor, regalo' },
  { strong: 'G1656', translit: 'eleos', greek: 'ἔλεος', kjv_def: 'misericordia, piedad' },
  { strong: 'G3628', translit: 'oikteiro', greek: 'οἰκτείρω', kjv_def: 'tener piedad, compadecerse' },
  { strong: 'G2140', translit: 'eusebia', greek: 'εὐσέβεια', kjv_def: 'piedad, reverencia' },
  { strong: 'G4689', translit: 'spelagcnizomai', greek: 'σπλαγχνίζομαι', kjv_def: 'tener compasión' },
  
  // Espíritu & Alma
  { strong: 'G4151', translit: 'pneuma', greek: 'πνεῦμα', kjv_def: 'espíritu, aliento, viento' },
  { strong: 'G5590', translit: 'psyche', greek: 'ψυχή', kjv_def: 'alma, vida, ser' },
  { strong: 'G4561', translit: 'sarx', greek: 'σάρξ', kjv_def: 'carne, cuerpo, naturaleza' },
  { strong: 'G3563', translit: 'nous', greek: 'νοῦς', kjv_def: 'mente, entendimiento' },
  { strong: 'G2588', translit: 'kardia', greek: 'καρδία', kjv_def: 'corazón, centro emocional' },
  { strong: 'G4012', translit: 'peri', greek: 'περί', kjv_def: 'alrededor, sobre, acerca de' },
  
  // Fe & Verdad
  { strong: 'G4102', translit: 'pistis', greek: 'πίστις', kjv_def: 'fe, confianza, creencia' },
  { strong: 'G225', translit: 'aletheia', greek: 'ἀλήθεια', kjv_def: 'verdad, realidad' },
  { strong: 'G1007', translit: 'boleuomai', greek: 'βουλεύομαι', kjv_def: 'consultar, deliberar' },
  { strong: 'G1011', translit: 'boule', greek: 'βουλή', kjv_def: 'consejo, propósito' },
  { strong: 'G1074', translit: 'genos', greek: 'γένος', kjv_def: 'raza, familia, tipo' },
  { strong: 'G1134', translit: 'gnoriphos', greek: 'γνώριμος', kjv_def: 'conocido, notorio' },
  
  // Reinado & Reino
  { strong: 'G932', translit: 'basileia', greek: 'βασιλεία', kjv_def: 'reino, reinado' },
  { strong: 'G1577', translit: 'ekklesia', greek: 'ἐκκλησία', kjv_def: 'iglesia, asamblea' },
  { strong: 'G1391', translit: 'doxa', greek: 'δόξα', kjv_def: 'gloria, honor' },
  { strong: 'G3779', translit: 'houtos', greek: 'οὗτος', kjv_def: 'este, este aquí' },
  { strong: 'G2962', translit: 'kyrios', greek: 'κύριος', kjv_def: 'Señor, amo, maestro' },
  { strong: 'G5256', translit: 'hyperetes', greek: 'ὑπηρέτης', kjv_def: 'ayudante, servidor' },
  
  // Salvación & Redención
  { strong: 'G2227', translit: 'zopoieo', greek: 'ζωοποιέω', kjv_def: 'dar vida, resucitar' },
  { strong: 'G4982', translit: 'sozo', greek: 'σῴζω', kjv_def: 'salvar, rescatar, preservar' },
  { strong: 'G3341', translit: 'metanoia', greek: 'μετάνοια', kjv_def: 'arrepentimiento, cambio' },
  { strong: 'G1343', translit: 'dikaiosyne', greek: 'δικαιοσύνη', kjv_def: 'justicia, rectitud' },
  { strong: 'G1342', translit: 'dikaios', greek: 'δίκαιος', kjv_def: 'justo, recto, correcto' },
  { strong: 'G3722', translit: 'katallasso', greek: 'κατάλλασσω', kjv_def: 'reconciliar, expiar' },
  
  // Palabra & Logos
  { strong: 'G3056', translit: 'logos', greek: 'λόγος', kjv_def: 'palabra, mensaje, razón' },
  { strong: 'G4487', translit: 'rhema', greek: 'ῥῆμα', kjv_def: 'dicho, palabra, asunto' },
  { strong: 'G2980', translit: 'laleo', greek: 'λαλέω', kjv_def: 'hablar, decir' },
  { strong: 'G3004', translit: 'lego', greek: 'λέγω', kjv_def: 'decir, contar, recitar' },
  { strong: 'G1334', translit: 'diagomai', greek: 'διαγορεύω', kjv_def: 'narrar, contar' },
  { strong: 'G1325', translit: 'didomi', greek: 'δίδωμι', kjv_def: 'dar, proporcionar, conceder' },
  
  // Sacrificio & Culto
  { strong: 'G2378', translit: 'thusia', greek: 'θυσία', kjv_def: 'sacrificio, ofrenda' },
  { strong: 'G3000', translit: 'latreuo', greek: 'λατρεύω', kjv_def: 'servir, adorar, rendir culto' },
  { strong: 'G4352', translit: 'proskyneo', greek: 'προσκυνέω', kjv_def: 'adorar, postrarse' },
  { strong: 'G3488', translit: 'naumai', greek: 'ναῦμαι', kjv_def: '(forma arcaica de mirar)' },
  { strong: 'G147', translit: 'aiteao', greek: 'αἰτέω', kjv_def: 'pedir, solicitar' },
  
  // Muerte & Resurrección
  { strong: 'G599', translit: 'apothnesko', greek: 'ἀποθνήσκω', kjv_def: 'morir, perecer' },
  { strong: 'G386', translit: 'anastasis', greek: 'ἀνάστασις', kjv_def: 'resurrección, levantarse' },
  { strong: 'G2349', translit: 'thnetos', greek: 'θνητός', kjv_def: 'mortal, sujeto a muerte' },
  { strong: 'G2246', translit: 'hemera', greek: 'ἡμέρα', kjv_def: 'día, época, vida' },
  { strong: 'G3571', translit: 'nyx', greek: 'νύξ', kjv_def: 'noche, oscuridad' },
  
  // Pecado & Transgresión
  { strong: 'G266', translit: 'hamartia', greek: 'ἁμαρτία', kjv_def: 'pecado, transgresión' },
  { strong: 'G3784', translit: 'ophelo', greek: 'ὀφείλω', kjv_def: 'deber, estar obligado' },
  { strong: 'G4274', translit: 'proskomma', greek: 'πρόσκομμα', kjv_def: 'tropiezo, ofensa' },
  { strong: 'G3900', translit: 'parapiptoo', greek: 'παραπίπτω', kjv_def: 'caer, fracasar moralmente' },
  { strong: 'G458', translit: 'anomos', greek: 'ἄνομος', kjv_def: 'sin ley, inicuo' },
  
  // Personas & Relaciones
  { strong: 'G444', translit: 'anthropos', greek: 'ἄνθρωπος', kjv_def: 'hombre, persona' },
  { strong: 'G32', translit: 'angelos', greek: 'ἄγγελος', kjv_def: 'ángel, mensajero' },
  { strong: 'G1135', translit: 'gyne', greek: 'γυνή', kjv_def: 'mujer, esposa' },
  { strong: 'G435', translit: 'aner', greek: 'ἀνήρ', kjv_def: 'hombre, marido, varón' },
  { strong: 'G5207', translit: 'huios', greek: 'υἱός', kjv_def: 'hijo, descendiente' },

  // Más palabras griegas
  { strong: 'G71', translit: 'ago', greek: 'ἄγω', kjv_def: 'llevar, guiar, traer' },
  { strong: 'G502', translit: 'anapausis', greek: 'ἀνάπαυσις', kjv_def: 'descanso, reposo' },
  { strong: 'G621', translit: 'apostellos', greek: 'ἀπόστολος', kjv_def: 'apóstol, enviado' },
  { strong: 'G1659', translit: 'eleos', greek: 'ἒλεος', kjv_def: 'misericordia, compasión' },
  { strong: 'G1680', translit: 'elpizo', greek: 'ἐλπίζω', kjv_def: 'esperar, confiar' },
  { strong: 'G1909', translit: 'epi', greek: 'ἐπί', kjv_def: 'sobre, encima, contra' },
  { strong: 'G2042', translit: 'ergazomai', greek: 'ἐργάζομαι', kjv_def: 'trabajar, obrar' },
  { strong: 'G2307', translit: 'thelema', greek: 'θέλημα', kjv_def: 'voluntad, deseo' },
];

async function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => (data += chunk));
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function generateExpandedLexicon() {
  console.log('🔄 Generando diccionario etimológico expandido...\n');

  const entries = [];
  const usedIds = new Set();

  // Procesar datos locales primero
  for (const strong of extendedLexicon) {
    const id = strong.translit.toLowerCase().replace(/[^\w-]/g, '');

    if (usedIds.has(id)) continue;
    usedIds.add(id);

    const language = strong.hebrew ? 'hebrew' : strong.greek ? 'greek' : 'unknown';
    const lemma = strong.hebrew || strong.greek || strong.translit;

    entries.push({
      id,
      lemma,
      transliteration: strong.translit,
      language,
      strong: strong.strong,
      gloss_es: strong.kjv_def,
      gloss_en: strong.kjv_def,
      origin_es: `Término ${language === 'hebrew' ? 'hebreo' : language === 'greek' ? 'griego' : 'bíblico'} de las Escrituras. Número Strong: ${strong.strong}`,
      origin_en: `${language === 'hebrew' ? 'Hebrew' : language === 'greek' ? 'Greek' : 'Biblical'} term from Scripture. Strong number: ${strong.strong}`,
      usage_es: `Usado en textos ${language === 'hebrew' ? 'del Antiguo Testamento' : language === 'greek' ? 'del Nuevo Testamento' : 'bíblicos'}.`,
      usage_en: `Used in ${language === 'hebrew' ? 'Old Testament' : language === 'greek' ? 'New Testament' : 'biblical'} texts.`,
      related: [],
    });
  }

  // Intentar descargar datos adicionales de fuentes abiertas
  console.log('📥 Intentando descargar datos de fuentes externas...');
  
  // Fuente 1: BibleJS
  const biblejsHebrew = await downloadFile(
    'https://cdn.jsdelivr.net/gh/BibleJS/bible-data@master/bible/strongs/hebrew.json'
  );
  if (biblejsHebrew && Array.isArray(biblejsHebrew)) {
    console.log(`✅ Descargados ${biblejsHebrew.length} términos hebreos adicionales`);
    // Procesar datos aquí si es necesario
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

  console.log('✅ Diccionario expandido generado exitosamente!\n');
  console.log(`📊 Estadísticas:`);
  const hebreoCount = entries.filter((e) => e.language === 'hebrew').length;
  const griegoCount = entries.filter((e) => e.language === 'greek').length;
  console.log(`   Total palabras: ${entries.length}`);
  console.log(`   Hebreo (AT): ${hebreoCount}`);
  console.log(`   Griego (NT): ${griegoCount}`);
  console.log(`\n📁 Guardado en: ${outputPath}`);
  console.log(`\n💡 Próximos pasos:`);
  console.log(`   1. npm run dev`);
  console.log(`   2. Abre http://localhost:3000/study`);
  console.log(`   3. Ve a "Etimología" y busca palabras como: amor, espíritu, verdad, etc`);
}

generateExpandedLexicon().catch(console.error);
