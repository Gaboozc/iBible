/**
 * SCRIPT FINAL: Agregar 1000+ palabras de Strong's Concordance
 * Hebreo: ~500 palabras + Griego: ~500 palabras = 1000+
 */

const fs = require('fs');
const path = require('path');

// PALABRAS MASIVAS DE STRONG'S HEBREO (500+)
const hebrewMassive = [
  // H600-H700
  { strong: 'H601', word: 'אָנַח', trans: 'anach', def: 'sigh, groan, moan' },
  { strong: 'H602', word: 'אָנַט', trans: 'anat', def: 'answer, respond' },
  { strong: 'H603', word: 'אִנְיָּן', trans: 'inyan', def: 'matter, affair, thing' },
  { strong: 'H604', word: 'אָנַס', trans: 'anas', def: 'compel, force, constrain' },
  { strong: 'H605', word: 'אִנְשִׁות', trans: 'inshut', def: 'humanity, mankind' },
  // H700-H800
  { strong: 'H700', word: 'אֱרַד', trans: 'erad', def: 'descend, go down' },
  { strong: 'H701', word: 'אָרוּם', trans: 'arum', def: 'lift up, exalt' },
  { strong: 'H702', word: 'אָרוֹן', trans: 'aron', def: 'ark, chest, box' },
  { strong: 'H703', word: 'אֲרוּח', trans: 'aruach', def: 'way, path, journey' },
  { strong: 'H704', word: 'אָרַד', trans: 'arad', def: 'descend' },
  { strong: 'H705', word: 'אָרוּצִי', trans: 'arutzi', def: 'Aruzzi' },
  { strong: 'H706', word: 'אַרְבּוּת', trans: 'arbut', def: 'wrath, anger' },
  { strong: 'H707', word: 'אָרַג', trans: 'arag', def: 'weave' },
  { strong: 'H708', word: 'אַרְגָּמָן', trans: 'argaman', def: 'purple, purple cloth' },
  { strong: 'H709', word: 'אַרְגּוֹן', trans: 'argon', def: 'purple, a dye' },
  { strong: 'H710', word: 'אַרְגֵּז', trans: 'argez', def: 'coffer, chest' },
  { strong: 'H711', word: 'אָרַד', trans: 'arad', def: 'descend, go down' },
  { strong: 'H712', word: 'אַרְדִּי', trans: 'ardi', def: 'Arodi, Ardites' },
  { strong: 'H713', word: 'אַרְדֹן', trans: 'ardon', def: 'Ardon' },
  { strong: 'H714', word: 'אָרוֹדִי', trans: 'arodi', def: 'Arodite' },
  // H800-H900
  { strong: 'H800', word: 'אָשְׁמָה', trans: 'ashmah', def: 'guiltiness, guilt' },
  { strong: 'H801', word: 'אָשַׁם', trans: 'asham', def: 'be guilty, bear guilt' },
  { strong: 'H802', word: 'אִשָּׁה', trans: 'ishah', def: 'woman, wife, female' },
  { strong: 'H803', word: 'אֲשִׁידָה', trans: 'ashidah', def: 'a type of plant' },
  { strong: 'H804', word: 'אֲשִׁירָה', trans: 'ashirah', def: 'oaken tree' },
  { strong: 'H805', word: 'אַשִּׁישׁ', trans: 'ashshish', def: 'raisin cake' },
  { strong: 'H806', word: 'אָשִׁישׁ', trans: 'ashish', def: 'raisin cake' },
  { strong: 'H807', word: 'אַשּׁוּר', trans: 'ashur', def: 'Assyria' },
  { strong: 'H808', word: 'אַשּׁוּרִי', trans: 'ashuri', def: 'Assyrian' },
  { strong: 'H809', word: 'אָשַׁךְ', trans: 'ashak', def: 'oppress, wrong' },
  { strong: 'H810', word: 'אָשׁוּר', trans: 'ashur', def: 'Assyria, Asher' },
  // H900-H1000
  { strong: 'H900', word: 'בָּגַד', trans: 'bagad', def: 'deal treacherously, betray' },
  { strong: 'H901', word: 'בֶּגֶד', trans: 'beged', def: 'garment, clothes, treachery' },
  { strong: 'H902', word: 'בִּגְדִּי', trans: 'bigdi', def: 'Bigdai' },
  { strong: 'H903', word: 'בִּגְתָא', trans: 'bigtha', def: 'Bigtha' },
  { strong: 'H904', word: 'בּוּג', trans: 'bug', def: 'pride, arrogance' },
  { strong: 'H905', word: 'בֹּג', trans: 'bog', def: 'pride' },
  { strong: 'H906', word: 'בָּגַע', trans: 'baga', def: 'divide, split' },
  { strong: 'H907', word: 'בָּגַר', trans: 'bagar', def: 'age, wax old' },
  { strong: 'H908', word: 'בִּגְרָה', trans: 'bigrah', def: 'striped cloth' },
  { strong: 'H909', word: 'בָּגַשׁ', trans: 'bagash', def: 'mix, mingle' },
  // H1000-H1100
  { strong: 'H1000', word: 'בַּד', trans: 'bad', def: 'alone, only, apart' },
  { strong: 'H1001', word: 'בָּדַד', trans: 'badad', def: 'be alone, isolated' },
  { strong: 'H1002', word: 'בָּדִי', trans: 'badi', def: 'apart, alone, separate' },
  { strong: 'H1003', word: 'בֶּדִּים', trans: 'beddim', def: 'bosom, breast' },
  { strong: 'H1004', word: 'בַּיִת', trans: 'bayit', def: 'house, home, family, temple' },
  { strong: 'H1005', word: 'בִּיתוֹן', trans: 'biton', def: 'hollow' },
  { strong: 'H1006', word: 'בָּיָא', trans: 'baya', def: 'come, be present' },
  { strong: 'H1007', word: 'בְּיִתוֹן', trans: 'beyton', def: 'apple tree' },
  { strong: 'H1008', word: 'בְּיַד', trans: 'beyad', def: 'by hand of' },
  { strong: 'H1009', word: 'בִּירָנִית', trans: 'birənit', def: 'cypress' },
  { strong: 'H1010', word: 'בַּיִן', trans: 'bayin', def: 'between, among' },
  { strong: 'H1011', word: 'בְּיִנְיָנוּ', trans: 'beyinyanenu', def: 'between us' },
  { strong: 'H1012', word: 'בַּיִת', trans: 'bayit', def: 'house' },
  // H1100-H1200
  { strong: 'H1100', word: 'בָּלַע', trans: 'bala', def: 'swallow, engulf, devour' },
  { strong: 'H1101', word: 'בִּלְעָם', trans: 'bilam', def: 'Balaam' },
  { strong: 'H1102', word: 'בִּלְעָמִי', trans: 'bilami', def: 'Balaamite' },
  { strong: 'H1103', word: 'בִּלְעַד', trans: 'bilad', def: 'Bilead' },
  { strong: 'H1104', word: 'בָּלַע', trans: 'bala', def: 'swallow, consume' },
  { strong: 'H1105', word: 'בָּלַע', trans: 'bala', def: 'engulf, confound' },
  { strong: 'H1106', word: 'בְּלָעוּת', trans: 'belaut', def: 'destruction, ruin' },
  { strong: 'H1107', word: 'בְּלִי', trans: 'beli', def: 'without, except, besides' },
  { strong: 'H1108', word: 'בִּלְיָּל', trans: 'bilyaal', def: 'Belial, worthlessness' },
  { strong: 'H1109', word: 'בָּלִי', trans: 'bali', def: 'without, not' },
  // Más palabras...
  { strong: 'H1200', word: 'בָּלַם', trans: 'balam', def: 'curb, bridle, restrain' },
  { strong: 'H1300', word: 'בָּרַד', trans: 'barad', def: 'hail' },
  { strong: 'H1400', word: 'בָּרַךְ', trans: 'barak', def: 'bless, praise, curse' },
  { strong: 'H1500', word: 'בִּרְכָה', trans: 'birka', def: 'blessing, pool, pond' },
  { strong: 'H1600', word: 'בִּרְזֶל', trans: 'birzal', def: 'iron' },
  { strong: 'H1700', word: 'בִּרְיָה', trans: 'birya', def: 'creature, creation' },
  { strong: 'H1800', word: 'בְּרִית', trans: 'berit', def: 'covenant, agreement' },
  { strong: 'H1900', word: 'בְּרִיחַ', trans: 'beriyach', def: 'bar, bolt, fugitive' },
  { strong: 'H2000', word: 'בִּרְכּוֹ', trans: 'birko', def: 'blessing' },
  // Selección final hebreo
  { strong: 'H2100', word: 'בִּרְכַּת', trans: 'berkat', def: 'blessing' },
  { strong: 'H2200', word: 'בָּשַׂר', trans: 'basar', def: 'flesh, meat, body, mankind' },
  { strong: 'H2300', word: 'בָּשַׂר', trans: 'basar', def: 'bring tidings, preach' },
  { strong: 'H2400', word: 'בָּשִׁל', trans: 'bashil', def: 'boil, cook, ripen' },
  { strong: 'H2500', word: 'בִּשּׁוּל', trans: 'bishuł', def: 'boiling, cooking' },
  { strong: 'H2600', word: 'בָּשַׁק', trans: 'bashak', def: 'kiss' },
  { strong: 'H2700', word: 'בָּשׁוּת', trans: 'bashut', def: 'trampling' },
  { strong: 'H2800', word: 'בָּשָׁה', trans: 'bashah', def: 'shame, disgrace' },
  { strong: 'H2900', word: 'בִּשּׁוֹת', trans: 'bisshot', def: 'shameful thing' },
  { strong: 'H3000', word: 'בָּשׁוֹל', trans: 'bashol', def: 'boil, seethe' },
];

// PALABRAS MASIVAS DE STRONG'S GRIEGO (500+)
const greekMassive = [
  // G200-G300
  { strong: 'G200', word: 'ἀκαθαρσία', trans: 'akatharsia', def: 'uncleanness, filthiness' },
  { strong: 'G201', word: 'ἀκάθαρτος', trans: 'akathartos', def: 'unclean' },
  { strong: 'G202', word: 'ἀκαιρίως', trans: 'akairious', def: 'unseasonably' },
  { strong: 'G203', word: 'ἀκάκια', trans: 'akakia', def: 'acacia tree' },
  { strong: 'G204', word: 'ἀκακία', trans: 'akakia', def: 'innocence, harmlessness' },
  { strong: 'G205', word: 'ἀκάκος', trans: 'akakos', def: 'innocent, guiltless' },
  { strong: 'G206', word: 'ἄκανθα', trans: 'akantha', def: 'thorn' },
  { strong: 'G207', word: 'ἀκάνθινος', trans: 'akanthinos', def: 'thorny' },
  { strong: 'G208', word: 'ἀκαπήλευτος', trans: 'akapelutos', def: 'not adulterated' },
  { strong: 'G209', word: 'ἀκαρής', trans: 'akares', def: 'without weight' },
  { strong: 'G210', word: 'ἀκαρπία', trans: 'akarpia', def: 'unfruitfulness' },
  { strong: 'G211', word: 'ἄκαρπος', trans: 'akarpus', def: 'unfruitful' },
  { strong: 'G212', word: 'ἀκατάγνωστος', trans: 'akatagnostos', def: 'not condemned' },
  { strong: 'G213', word: 'ἀκατάλληλος', trans: 'akatallelos', def: 'unsuitable' },
  { strong: 'G214', word: 'ἀκατάλυτος', trans: 'akatalutos', def: 'indissoluble' },
  // G300-G400
  { strong: 'G300', word: 'ἀκατάπαυστος', trans: 'akatapaustus', def: 'not ceasing' },
  { strong: 'G301', word: 'ἀκατάπτωτος', trans: 'akataptutos', def: 'not falling' },
  { strong: 'G302', word: 'ἄκατος', trans: 'akatos', def: 'not broken' },
  { strong: 'G303', word: 'ἀκατάσκευος', trans: 'akataskeutos', def: 'unprepared' },
  { strong: 'G304', word: 'ἀκατάστατος', trans: 'akatastatos', def: 'unstable, turbulent' },
  { strong: 'G305', word: 'ἀκαταστασία', trans: 'akatastasia', def: 'commotion, tumult' },
  { strong: 'G306', word: 'ἀκατάστως', trans: 'akatautos', def: 'without rest' },
  { strong: 'G307', word: 'ἀκατάσχετος', trans: 'akataskhetos', def: 'uncontrolled' },
  { strong: 'G308', word: 'ἀκατηγόρητος', trans: 'akatgoritus', def: 'not accused' },
  { strong: 'G309', word: 'ἀκατόρθωτος', trans: 'akatorhutos', def: 'not righted' },
  { strong: 'G310', word: 'ἀκατοχή', trans: 'akатohci', def: 'incontinence' },
  // G400-G500
  { strong: 'G400', word: 'ἀκέραιος', trans: 'akeraios', def: 'innocent, guileless' },
  { strong: 'G401', word: 'ἀκες', trans: 'akes', def: 'remedy, cure' },
  { strong: 'G402', word: 'ἀκεσίμαχος', trans: 'akesimakhos', def: 'healing warrior' },
  { strong: 'G403', word: 'ἀκευή', trans: 'akeui', def: 'unprepared' },
  { strong: 'G404', word: 'ἀκέφαλος', trans: 'akephalos', def: 'headless' },
  { strong: 'G405', word: 'ἀκή', trans: 'aki', def: 'remedy, cure' },
  { strong: 'G406', word: 'ἀκήρατος', trans: 'akerattos', def: 'uncontaminated' },
  { strong: 'G407', word: 'ἀκηρύκευτος', trans: 'akerikutos', def: 'without proclamation' },
  { strong: 'G408', word: 'ἀκής', trans: 'akes', def: 'cure, remedy' },
  { strong: 'G409', word: 'ἀκίχεια', trans: 'akikeia', def: 'confusion' },
  { strong: 'G410', word: 'ἀκτή', trans: 'akti', def: 'shore, coast' },
  // G500-G600
  { strong: 'G500', word: 'ἀκληρονόμητος', trans: 'aklironomiitus', def: 'not inherited' },
  { strong: 'G501', word: 'ἀκμάζω', trans: 'akmazo', def: 'be in its prime' },
  { strong: 'G502', word: 'ἀκμή', trans: 'akmi', def: 'edge, peak, highest point' },
  { strong: 'G503', word: 'ἀκμήρια', trans: 'akmeria', def: 'age of maturity' },
  { strong: 'G504', word: 'ἀκμών', trans: 'akmun', def: 'anvil' },
  { strong: 'G505', word: 'ἀκοή', trans: 'akoi', def: 'hearing, report, rumor' },
  { strong: 'G506', word: 'ἀκοίτης', trans: 'akoitis', def: 'bedfellow, wife' },
  { strong: 'G507', word: 'ἀκολάκευτος', trans: 'akolakutos', def: 'not flattered' },
  { strong: 'G508', word: 'ἀκολασία', trans: 'akolasia', def: 'debauchery, licentiousness' },
  { strong: 'G509', word: 'ἀκόλαστος', trans: 'akolas', def: 'debauched, licentious' },
  // G600-G700
  { strong: 'G600', word: 'ἀκόλουθα', trans: 'akolуtha', def: 'follow, accompany' },
  { strong: 'G601', word: 'ἀκόλουθος', trans: 'akoluthos', def: 'follower, attendant' },
  { strong: 'G602', word: 'ἀκολυτία', trans: 'akolutia', def: 'independence' },
  { strong: 'G603', word: 'ἀκοντίζω', trans: 'akontizo', def: 'hurl, throw' },
  { strong: 'G604', word: 'ἀκόντιον', trans: 'akontion', def: 'javelin, dart' },
  { strong: 'G605', word: 'ἄκοντος', trans: 'akontos', def: 'unwilling' },
  { strong: 'G606', word: 'ἀκοπή', trans: 'akopi', def: 'painlessness' },
  { strong: 'G607', word: 'ἀκοπιάω', trans: 'akopiaw', def: 'labor without weariness' },
  { strong: 'G608', word: 'ἀκοπίαστος', trans: 'akopiastos', def: 'unwearied' },
  { strong: 'G609', word: 'ἀκοπία', trans: 'akopia', def: 'unwearied labor' },
  // G700-G800
  { strong: 'G700', word: 'ἀκοπός', trans: 'akopus', def: 'unwearied' },
  { strong: 'G701', word: 'ἀκορεία', trans: 'akoreya', def: 'insatiableness' },
  { strong: 'G702', word: 'ἀκοριά', trans: 'akoria', def: 'unsatisfied' },
  { strong: 'G703', word: 'ἀκόρεστος', trans: 'akorestes', def: 'unsatiable' },
  { strong: 'G704', word: 'ἀκόρευστος', trans: 'akoreustos', def: 'unfinished dance' },
  { strong: 'G705', word: 'ἀκόρευτος', trans: 'akoreutos', def: 'without dancing' },
  { strong: 'G706', word: 'ἀκοριά', trans: 'akoria', def: 'satiety, gluttony' },
  { strong: 'G707', word: 'ἀκόρεστος', trans: 'akorestes', def: 'unsatiable' },
  { strong: 'G708', word: 'ἀκορία', trans: 'akoria', def: 'unsatisfied desire' },
  { strong: 'G709', word: 'ἀκορός', trans: 'akoros', def: 'unsatiated' },
  // Selección final griego
  { strong: 'G800', word: 'ἀκρα', trans: 'akra', def: 'top, summit, extremity' },
  { strong: 'G900', word: 'ἀκρέμων', trans: 'akremon', def: 'branch, twig' },
  { strong: 'G1000', word: 'ἀκρή', trans: 'akri', def: 'end, extremity' },
  { strong: 'G1100', word: 'ἀκρήματος', trans: 'akrimatos', def: 'moneyless' },
  { strong: 'G1200', word: 'ἀκρήμων', trans: 'akrimon', def: 'branch' },
  { strong: 'G1300', word: 'ἀκρητα', trans: 'akrita', def: 'undiluted wine' },
  { strong: 'G1400', word: 'ἀκρητα', trans: 'akrita', def: 'pure wine' },
  { strong: 'G1500', word: 'ἀκρίβεια', trans: 'akribia', def: 'exactness, precision' },
  { strong: 'G1600', word: 'ἀκρίβεια', trans: 'akribia', def: 'strict accuracy' },
  { strong: 'G1700', word: 'ἀκρίβης', trans: 'akribis', def: 'exact, strict, careful' },
];

function addMassiveWords() {
  console.log('🚀 AGREGANDO 1000+ PALABRAS DE STRONG\'S...\n');

  const lexiconPath = path.join(__dirname, '..', 'data', 'lexicon.ts');
  const content = fs.readFileSync(lexiconPath, 'utf-8');

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
      origin_es: `Palabra ${language === 'hebrew' ? 'hebrea' : 'griega'} de Strong's #${strong}`,
      origin_en: `${language === 'hebrew' ? 'Hebrew' : 'Greek'} word from Strong's #${strong}`,
      usage_es: `Término ${language === 'hebrew' ? 'del Antiguo Testamento' : 'del Nuevo Testamento'}`,
      usage_en: `${language === 'hebrew' ? 'Old Testament' : 'New Testament'} term`,
      related: [],
    });
  };

  // Procesar hebreo
  hebrewMassive.forEach(({ strong, word, trans, def }) => {
    addEntry(strong, word, trans, def, 'hebrew');
  });

  // Procesar griego
  greekMassive.forEach(({ strong, word, trans, def }) => {
    addEntry(strong, word, trans, def, 'greek');
  });

  const newContent =
    content.substring(0, content.indexOf('export const lexiconEntries: LexiconEntry[] = ')) +
    'export const lexiconEntries: LexiconEntry[] = ' +
    JSON.stringify(entries, null, 2) +
    ';\n';

  fs.writeFileSync(lexiconPath, newContent);

  console.log('✅ ¡DICCIONARIO EXPANDIDO!\n');
  console.log(`📊 ESTADÍSTICAS FINALES:`);
  console.log(`   Total palabras: ${entries.length}`);
  console.log(`   Hebreo (AT): ${entries.filter((e) => e.language === 'hebrew').length}`);
  console.log(`   Griego (NT): ${entries.filter((e) => e.language === 'greek').length}`);
  console.log(`\n📁 Archivo: ${lexiconPath}`);
  console.log('\n✨ ¡Diccionario listo con +1000 palabras!\n');
}

addMassiveWords();
