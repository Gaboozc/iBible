import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { resolveBookDir } from '../lib/bible/book-dir-map';

interface StructuralSection {
  verses: string;
  title: string;
  description: string;
  significance: string;
}

interface RepeatedWord {
  word: string;
  count: number;
  significance: string;
}

interface StructuralAnalysis {
  title: string;
  sections: StructuralSection[];
  repeatedWords: RepeatedWord[];
}

interface HistoricalContext {
  period: string;
  dominantEmpire: string;
  kingName: string;
  kingRegion: string;
  activeProphets: string[];
  templeStatus: string;
  location: string;
  summary: string;
  spiritualContext: string;
}

interface ChapterText {
  verses?: Array<{ number: number; text: string }>;
}

interface BookProfile {
  period: string;
  dominantEmpire: string;
  kingName: string;
  kingRegion: string;
  activeProphets: string[];
  templeStatus: string;
  location: string;
  summary: string;
  spiritualContext: string;
}

const CANONICAL_BOOK_ORDER = [
  'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth',
  '1-samuel', '2-samuel', '1-kings', '2-kings', '1-chronicles', '2-chronicles', 'ezra', 'nehemiah', 'esther',
  'job', 'psalms', 'proverbs', 'ecclesiastes', 'song-of-songs',
  'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi',
  'matthew', 'mark', 'luke', 'john', 'acts',
  'romans', '1-corinthians', '2-corinthians', 'galatians', 'ephesians', 'philippians', 'colossians',
  '1-thessalonians', '2-thessalonians', '1-timothy', '2-timothy', 'titus', 'philemon',
  'hebrews', 'james', '1-peter', '2-peter', '1-john', '2-john', '3-john', 'jude', 'revelation',
] as const;

const PRETTY_BOOK_NAMES: Record<string, string> = {
  genesis: 'Génesis', exodus: 'Éxodo', leviticus: 'Levítico', numbers: 'Números', deuteronomy: 'Deuteronomio',
  joshua: 'Josué', judges: 'Jueces', ruth: 'Rut',
  '1-samuel': '1 Samuel', '2-samuel': '2 Samuel', '1-kings': '1 Reyes', '2-kings': '2 Reyes',
  '1-chronicles': '1 Crónicas', '2-chronicles': '2 Crónicas', ezra: 'Esdras', nehemiah: 'Nehemías', esther: 'Ester',
  job: 'Job', psalms: 'Salmos', proverbs: 'Proverbios', ecclesiastes: 'Eclesiastés', 'song-of-songs': 'Cantares',
  isaiah: 'Isaías', jeremiah: 'Jeremías', lamentations: 'Lamentaciones', ezekiel: 'Ezequiel', daniel: 'Daniel',
  hosea: 'Oseas', joel: 'Joel', amos: 'Amós', obadiah: 'Abdías', jonah: 'Jonás', micah: 'Miqueas', nahum: 'Nahúm',
  habakkuk: 'Habacuc', zephaniah: 'Sofonías', haggai: 'Hageo', zechariah: 'Zacarías', malachi: 'Malaquías',
  matthew: 'Mateo', mark: 'Marcos', luke: 'Lucas', john: 'Juan', acts: 'Hechos',
  romans: 'Romanos', '1-corinthians': '1 Corintios', '2-corinthians': '2 Corintios', galatians: 'Gálatas',
  ephesians: 'Efesios', philippians: 'Filipenses', colossians: 'Colosenses',
  '1-thessalonians': '1 Tesalonicenses', '2-thessalonians': '2 Tesalonicenses',
  '1-timothy': '1 Timoteo', '2-timothy': '2 Timoteo', titus: 'Tito', philemon: 'Filemón',
  hebrews: 'Hebreos', james: 'Santiago', '1-peter': '1 Pedro', '2-peter': '2 Pedro',
  '1-john': '1 Juan', '2-john': '2 Juan', '3-john': '3 Juan', jude: 'Judas', revelation: 'Apocalipsis',
};

const BOOK_PROFILES: Record<string, BookProfile> = {
  genesis: {
    period: 'Edad Patriarcal (ca. 2100–1800 a.C.)',
    dominantEmpire: 'Contexto mesopotámico y cananeo preimperial',
    kingName: 'No aplica (estructura patriarcal)',
    kingRegion: 'Canaán y regiones de Mesopotamia/Egipto',
    activeProphets: ['Abraham', 'Isaac', 'Jacob', 'José (líder providencial)'],
    templeStatus: 'No existe aún templo; culto en altares patriarcales',
    location: 'Mesopotamia, Canaán y Egipto',
    summary: 'Génesis presenta los orígenes: creación, caída, diluvio, naciones y llamado de Abraham. Establece el pacto abrahámico y la línea de promesa que desembocará en Israel.',
    spiritualContext: 'El libro confronta pecado humano y gracia divina, mostrando elección, pacto, providencia y fidelidad de Dios en medio de familias imperfectas.',
  },
  exodus: {
    period: 'Éxodo y formación nacional (ca. siglo XV–XIII a.C.)',
    dominantEmpire: 'Egipto faraónico',
    kingName: 'Faraón (sin nombre explícito en el texto bíblico)',
    kingRegion: 'Egipto / desierto del Sinaí',
    activeProphets: ['Moisés', 'Aarón', 'Miriam'],
    templeStatus: 'Se instituye el tabernáculo como santuario móvil',
    location: 'Egipto, Sinaí y ruta al desierto',
    summary: 'Éxodo narra liberación de Egipto, pacto del Sinaí y constitución de Israel como pueblo sacerdotal bajo la Ley de Dios.',
    spiritualContext: 'Enfatiza redención, santidad y obediencia al pacto; el Dios que salva también habita en medio de su pueblo y demanda fidelidad.',
  },
  leviticus: {
    period: 'Peregrinación del desierto (periodo mosaico)',
    dominantEmpire: 'Sin dominio imperial directo en el campamento del desierto',
    kingName: 'No hay monarquía; liderazgo mosaico-sacerdotal',
    kingRegion: 'Campamento de Israel en el Sinaí',
    activeProphets: ['Moisés', 'Aarón'],
    templeStatus: 'Tabernáculo operativo con orden sacerdotal',
    location: 'Sinaí',
    summary: 'Levítico desarrolla la teología de santidad: sacrificios, pureza, sacerdocio y vida consagrada.',
    spiritualContext: 'Resalta que comunión con Dios requiere expiación, pureza y ética santa en adoración y vida diaria.',
  },
  numbers: {
    period: 'Peregrinación por el desierto (40 años)',
    dominantEmpire: 'Contexto tribal y regional del antiguo Cercano Oriente',
    kingName: 'No hay rey; liderazgo mosaico',
    kingRegion: 'Desierto entre Sinaí y Moab',
    activeProphets: ['Moisés', 'Aarón', 'Balaam (oráculos externos)'],
    templeStatus: 'Tabernáculo central en la vida comunitaria',
    location: 'Desierto y llanuras de Moab',
    summary: 'Números combina censos, rebeliones y provisión divina en la transición hacia la nueva generación que entrará a Canaán.',
    spiritualContext: 'Muestra tensión entre incredulidad humana y fidelidad de Dios, con énfasis en disciplina y esperanza.',
  },
  deuteronomy: {
    period: 'Final de la era mosaica (antes de entrar a Canaán)',
    dominantEmpire: 'Sin imperio dominante inmediato sobre Israel en campamento',
    kingName: 'No hay rey; Moisés como líder del pacto',
    kingRegion: 'Llanuras de Moab',
    activeProphets: ['Moisés'],
    templeStatus: 'Tabernáculo vigente; anticipa centralización del culto',
    location: 'Moab, frente al Jordán',
    summary: 'Deuteronomio recapitula la Ley y renueva el pacto para la nueva generación.',
    spiritualContext: 'Insiste en amar a Dios con todo el corazón y vivir la obediencia como respuesta al pacto.',
  },
  joshua: {
    period: 'Conquista y asentamiento inicial en Canaán',
    dominantEmpire: 'Ciudades-estado cananeas',
    kingName: 'No hay rey israelita; Josué como sucesor',
    kingRegion: 'Canaán',
    activeProphets: ['Josué'],
    templeStatus: 'Tabernáculo en transición hacia centros de culto en la tierra',
    location: 'Canaán',
    summary: 'Josué relata entrada, conquista y repartición de la tierra prometida.',
    spiritualContext: 'Subraya fidelidad del pacto, obediencia a la palabra y memoria de las obras de Dios.',
  },
  judges: {
    period: 'Periodo de los jueces (ca. 1200–1050 a.C.)',
    dominantEmpire: 'Presión de pueblos vecinos (filisteos, madianitas, etc.)',
    kingName: 'Sin monarquía estable',
    kingRegion: 'Tribus de Israel en Canaán',
    activeProphets: ['Débora y otros libertadores carismáticos'],
    templeStatus: 'Culto fragmentado y frecuentemente sincretista',
    location: 'Canaán tribal',
    summary: 'Jueces presenta ciclos de pecado, opresión, clamor y liberación.',
    spiritualContext: 'Muestra decadencia espiritual cuando “cada uno hacía lo recto en sus propios ojos”.',
  },
  ruth: {
    period: 'Época de los jueces',
    dominantEmpire: 'Contexto local israelita/moabita',
    kingName: 'Sin monarquía estable',
    kingRegion: 'Belén y Moab',
    activeProphets: ['No enfocado en actividad profética'],
    templeStatus: 'Vida piadosa en marco de la ley y costumbres del pueblo',
    location: 'Moab y Judá',
    summary: 'Rut narra redención familiar, lealtad de pacto y providencia que conduce al linaje davídico.',
    spiritualContext: 'Destaca fidelidad, misericordia y la inclusión de la extranjera en el plan redentor.',
  },
  psalms: {
    period: 'Composición multiépoca (monarquía, exilio y postexilio)',
    dominantEmpire: 'Varía según salmo y época',
    kingName: 'Principalmente periodo davídico y posterior',
    kingRegion: 'Israel/Judá y comunidades en dispersión',
    activeProphets: ['David y autores litúrgicos de Israel'],
    templeStatus: 'Adoración centrada en templo/tabernáculo según época',
    location: 'Sion y contexto de peregrinación/exilio',
    summary: 'Salmos es el himnario teológico de Israel: lamento, alabanza, sabiduría y confianza mesiánica.',
    spiritualContext: 'Modela oración honesta delante de Dios en sufrimiento, arrepentimiento, guerra y esperanza.',
  },
  proverbs: {
    period: 'Tradición sapiencial (principalmente periodo salomónico y compilaciones posteriores)',
    dominantEmpire: 'Contexto de corte y vida cotidiana israelita',
    kingName: 'Asociado a Salomón y sabios de Israel',
    kingRegion: 'Israel/Judá',
    activeProphets: ['Sabios y maestros de instrucción'],
    templeStatus: 'No es foco central del libro',
    location: 'Entorno familiar, social y cortesano',
    summary: 'Proverbios concentra sabiduría práctica para vivir bajo el temor de Yahvé.',
    spiritualContext: 'Contrasta camino del sabio y del necio, con ética relacional y reverencia a Dios.',
  },
  ecclesiastes: {
    period: 'Literatura sapiencial',
    dominantEmpire: 'No especificado directamente',
    kingName: 'Voz del “Qohelet” en marco real/sapiencial',
    kingRegion: 'Jerusalén (marco literario)',
    activeProphets: ['No es un libro profético en sentido clásico'],
    templeStatus: 'Referencia indirecta a adoración y juicio de Dios',
    location: 'Jerusalén y observación universal de la vida',
    summary: 'Eclesiastés reflexiona sobre la vanidad de la vida “bajo el sol” sin Dios como centro.',
    spiritualContext: 'Conduce al temor de Dios y la obediencia como conclusión de la existencia humana.',
  },
  'song-of-songs': {
    period: 'Tradición poética israelita (asociada a Salomón)',
    dominantEmpire: 'No aplica al foco literario del libro',
    kingName: 'Marco salomónico-poético',
    kingRegion: 'Israel',
    activeProphets: ['No aplica como libro profético'],
    templeStatus: 'No central',
    location: 'Paisaje rural y palaciego simbólico',
    summary: 'Cantares celebra el amor de pacto, belleza y deleite en lenguaje poético.',
    spiritualContext: 'Ha sido leído tanto en clave matrimonial como simbólica de amor del pacto entre Dios y su pueblo.',
  },
  isaiah: {
    period: 'Siglos VIII–VII a.C. (y horizonte profético más amplio)',
    dominantEmpire: 'Asiria y transición hacia Babilonia',
    kingName: 'Uzías, Jotam, Acaz, Ezequías (Judá)',
    kingRegion: 'Reino de Judá',
    activeProphets: ['Isaías', 'Miqueas (contemporáneo)'],
    templeStatus: 'Templo de Jerusalén activo en el periodo inicial',
    location: 'Jerusalén y Judá',
    summary: 'Isaías anuncia juicio por infidelidad y esperanza mesiánica de restauración universal.',
    spiritualContext: 'Une santidad de Dios, justicia social, remanente fiel y promesa del Siervo.',
  },
  jeremiah: {
    period: 'Final del reino de Judá y caída de Jerusalén (siglo VII–VI a.C.)',
    dominantEmpire: 'Babilonia (tras declive asirio)',
    kingName: 'Josías, Joacaz, Joacim, Joaquín, Sedequías',
    kingRegion: 'Judá',
    activeProphets: ['Jeremías', 'Habacuc (cercano en época)'],
    templeStatus: 'Templo activo hasta su destrucción en 586 a.C.',
    location: 'Jerusalén y exilio',
    summary: 'Jeremías proclama juicio inminente y nuevo pacto en medio de resistencia nacional.',
    spiritualContext: 'Confronta idolatría, falsa seguridad religiosa y endurecimiento del corazón.',
  },
  lamentations: {
    period: 'Post-caída de Jerusalén (586 a.C.)',
    dominantEmpire: 'Babilonia',
    kingName: 'Monarquía derrumbada',
    kingRegion: 'Jerusalén devastada',
    activeProphets: ['Tradicionalmente asociado a Jeremías'],
    templeStatus: 'Templo destruido',
    location: 'Ruinas de Jerusalén',
    summary: 'Lamentaciones poetiza el duelo nacional tras la destrucción de Jerusalén.',
    spiritualContext: 'Dolor, confesión y esperanza en la misericordia renovada de Dios.',
  },
  ezekiel: {
    period: 'Exilio babilónico (593–571 a.C.)',
    dominantEmpire: 'Imperio neobabilónico',
    kingName: 'Joaquín (exiliado) / Sedequías',
    kingRegion: 'Exilio en Babilonia y horizonte de Judá',
    activeProphets: ['Ezequiel', 'Jeremías', 'Daniel'],
    templeStatus: 'Templo destruido (desde 586 a.C. en gran parte del libro)',
    location: 'Río Quebar y visión de Jerusalén futura',
    summary: 'Ezequiel combina juicios severos y visiones de restauración con fuerte simbolismo profético.',
    spiritualContext: 'Resalta responsabilidad personal, gloria de Dios y esperanza de corazón nuevo.',
  },
  daniel: {
    period: 'Exilio y dominio gentil (siglo VI a.C.)',
    dominantEmpire: 'Babilonia y Medo-Persia',
    kingName: 'Nabucodonosor, Belsasar, Darío, Ciro',
    kingRegion: 'Corte imperial en Babilonia',
    activeProphets: ['Daniel'],
    templeStatus: 'Ausencia del templo en el exilio; expectativa de restauración',
    location: 'Babilonia',
    summary: 'Daniel muestra fidelidad en exilio y panoramas apocalípticos del reino de Dios.',
    spiritualContext: 'Afirma soberanía divina sobre imperios humanos y perseverancia del remanente fiel.',
  },
  matthew: {
    period: 'Ministerio de Jesús (ca. 27–30 d.C.)',
    dominantEmpire: 'Imperio romano',
    kingName: 'Herodes/autoridades romanas en Judea',
    kingRegion: 'Judea y Galilea',
    activeProphets: ['Juan el Bautista', 'Jesús como Mesías'],
    templeStatus: 'Segundo Templo aún en pie',
    location: 'Israel del siglo I',
    summary: 'Mateo presenta a Jesús como Mesías davídico y cumplimiento de la Escritura.',
    spiritualContext: 'Reino de los cielos, discipulado y justicia superior en continuidad con la Ley y los Profetas.',
  },
  mark: {
    period: 'Ministerio de Jesús (ca. 27–30 d.C.)',
    dominantEmpire: 'Imperio romano',
    kingName: 'Autoridades herodianas y romanas',
    kingRegion: 'Galilea y Judea',
    activeProphets: ['Juan el Bautista', 'Jesús'],
    templeStatus: 'Segundo Templo aún en pie durante los eventos',
    location: 'Principalmente Galilea, camino a Jerusalén',
    summary: 'Marcos enfatiza acción, autoridad y sufrimiento del Siervo-Mesías.',
    spiritualContext: 'Llama a seguir a Cristo en fe, humildad y entrega de la cruz.',
  },
  luke: {
    period: 'Ministerio de Jesús (ca. 27–30 d.C.)',
    dominantEmpire: 'Imperio romano',
    kingName: 'Tiberio / autoridades locales en Judea',
    kingRegion: 'Mundo judeo-romano',
    activeProphets: ['Juan el Bautista', 'Jesús'],
    templeStatus: 'Segundo Templo activo',
    location: 'Galilea, Samaria, Judea y Jerusalén',
    summary: 'Lucas destaca a Jesús como Salvador universal, con atención a marginados y oración.',
    spiritualContext: 'Misericordia, gozo, Espíritu Santo y misión para todas las naciones.',
  },
  john: {
    period: 'Ministerio de Jesús (ca. 27–30 d.C.)',
    dominantEmpire: 'Imperio romano',
    kingName: 'Autoridades romanas y religiosas judías',
    kingRegion: 'Judea y Galilea',
    activeProphets: ['Juan el Bautista', 'Jesús'],
    templeStatus: 'Segundo Templo activo durante la narrativa',
    location: 'Jerusalén y Galilea',
    summary: 'Juan presenta señales y discursos para afirmar que Jesús es el Hijo de Dios.',
    spiritualContext: 'Vida eterna, nuevo nacimiento, amor y unidad con Cristo.',
  },
  acts: {
    period: 'Iglesia primitiva (ca. 30–62 d.C.)',
    dominantEmpire: 'Imperio romano',
    kingName: 'Autoridades romanas (Herodes, procuradores, César)',
    kingRegion: 'Jerusalén, Judea, Samaria y mundo mediterráneo',
    activeProphets: ['Pedro', 'Pablo', 'Santiago y líderes apostólicos'],
    templeStatus: 'Segundo Templo aún en pie al inicio de Hechos',
    location: 'Desde Jerusalén hasta Roma',
    summary: 'Hechos narra expansión del evangelio por el poder del Espíritu Santo.',
    spiritualContext: 'Misión, persecución, comunión y apertura del pueblo de Dios a los gentiles.',
  },
  romans: {
    period: 'Era apostólica (ca. 57 d.C.)',
    dominantEmpire: 'Imperio romano',
    kingName: 'Nerón (contexto imperial)',
    kingRegion: 'Comunidad cristiana en Roma',
    activeProphets: ['Pablo (apóstol)'],
    templeStatus: 'Segundo Templo aún existente en Jerusalén al momento de la carta',
    location: 'Roma (audiencia) / Corinto (probable redacción)',
    summary: 'Romanos articula el evangelio de la justicia de Dios por la fe.',
    spiritualContext: 'Doctrina de gracia, unión con Cristo, vida en el Espíritu y ética comunitaria.',
  },
  revelation: {
    period: 'Final del siglo I d.C. (época de persecución)',
    dominantEmpire: 'Imperio romano',
    kingName: 'Domicio (contexto tradicional)',
    kingRegion: 'Provincia de Asia Menor',
    activeProphets: ['Juan (vidente/apóstol)'],
    templeStatus: 'Templo de Jerusalén ya destruido; foco en templo celestial',
    location: 'Isla de Patmos y cartas a siete iglesias',
    summary: 'Apocalipsis revela la victoria final de Dios y del Cordero sobre todo poder rebelde.',
    spiritualContext: 'Llama a perseverancia fiel, adoración verdadera y esperanza escatológica.',
  },
};

const OLD_TESTAMENT_BOOKS = new Set([
  'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth', '1-samuel', '2-samuel',
  '1-kings', '2-kings', '1-chronicles', '2-chronicles', 'ezra', 'nehemiah', 'esther', 'job', 'psalms', 'proverbs',
  'ecclesiastes', 'song-of-songs', 'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel', 'amos',
  'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi',
]);

const STOPWORDS = new Set([
  'el', 'la', 'los', 'las', 'de', 'del', 'y', 'que', 'en', 'un', 'una', 'por', 'para', 'con', 'sin', 'se', 'su', 'sus',
  'al', 'como', 'más', 'mas', 'á', 'a', 'o', 'u', 'es', 'son', 'era', 'fue', 'fué', 'ser', 'ha', 'han', 'pero', 'no',
  'mi', 'tu', 'su', 'nuestro', 'vuestra', 'vosotros', 'ellos', 'ellas', 'yo', 'tú', 'me', 'te', 'le', 'les', 'lo', 'le',
  'dijo', 'dios', 'jehová', 'jehova', 'señor', 'sr', 'ya', 'hoy', 'ayer', 'mañana', 'también', 'tambien', 'sobre',
  'hasta', 'desde', 'entre', 'cuando', 'donde', 'quien', 'quienes', 'cual', 'cuales', 'este', 'esta', 'estos', 'estas',
  'aquel', 'aquella', 'aquellos', 'aquellas', 'si', 'porque', 'fueron', 'estaba', 'estaban', 'será', 'sera',
]);

const RV1909_BOOK_ALIASES: Record<string, string> = {
  exodus: 'exodo',
  leviticus: 'levitico',
  numbers: 'numeros',
  deuteronomy: 'deuteronomio',
  joshua: 'josue',
  judges: 'jueces',
  ruth: 'rut',
  psalms: 'salmos',
  proverbs: 'proverbios',
  ecclesiastes: 'eclesiastes',
  'song-of-songs': 'cantares',
  isaiah: 'isaias',
  jeremiah: 'jeremias',
  lamentations: 'lamentaciones',
  ezekiel: 'ezequiel',
  jonah: 'jonas',
  matthew: 'mateo',
  mark: 'marcos',
  luke: 'lucas',
  john: 'juan',
  acts: 'hechos',
  romans: 'romanos',
};

function fallbackBookProfile(book: string): BookProfile {
  if (OLD_TESTAMENT_BOOKS.has(book)) {
    return {
      period: 'Periodo veterotestamentario (según marco del libro)',
      dominantEmpire: 'Contexto ANE: Egipto / Asiria / Babilonia / Persia según la sección',
      kingName: 'Según momento narrativo del libro',
      kingRegion: 'Israel/Judá y regiones vecinas',
      activeProphets: ['Profetas y líderes del periodo'],
      templeStatus: 'Tabernáculo o templo según la etapa histórica',
      location: 'Israel, Judá o exilio, según el libro',
      summary: `${toPrettyName(book)} desarrolla el plan de Dios en el marco histórico de Israel, resaltando pacto, juicio y esperanza.`,
      spiritualContext: 'El capítulo se interpreta dentro de la fidelidad de Dios y el llamado del pueblo a obediencia y arrepentimiento.',
    };
  }

  return {
    period: 'Siglo I d.C. (era apostólica y expansión de la iglesia)',
    dominantEmpire: 'Imperio romano',
    kingName: 'Autoridades romanas y locales según el contexto',
    kingRegion: 'Mediterráneo oriental',
    activeProphets: ['Jesús, apóstoles y líderes de la iglesia primitiva'],
    templeStatus: 'Segundo Templo en transición histórica o ya destruido según fecha',
    location: 'Judea, Asia Menor y mundo grecorromano',
    summary: `${toPrettyName(book)} aporta desarrollo cristológico, eclesial y pastoral en el marco del Nuevo Testamento.`,
    spiritualContext: 'El énfasis recae en Cristo, la obra del Espíritu y la fidelidad de la iglesia bajo presión cultural y persecución.',
  };
}

function toPrettyName(book: string): string {
  return PRETTY_BOOK_NAMES[book] ?? book.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildSectionRanges(totalVerses: number): Array<[number, number]> {
  if (totalVerses <= 6) {
    return [[1, Math.max(1, totalVerses)]];
  }

  if (totalVerses <= 15) {
    const split = Math.ceil(totalVerses / 2);
    return [[1, split], [split + 1, totalVerses]];
  }

  const first = Math.ceil(totalVerses * 0.25);
  const second = Math.ceil(totalVerses * 0.5);
  const third = Math.ceil(totalVerses * 0.75);

  return [
    [1, first],
    [first + 1, second],
    [second + 1, third],
    [third + 1, totalVerses],
  ].filter(([from, to]) => from <= to);
}

function sectionTitleByIndex(index: number, total: number): string {
  if (total === 1) return 'Unidad literaria principal';
  if (total === 2) return index === 0 ? 'Apertura del capítulo' : 'Desarrollo y cierre';

  const titles = [
    'Apertura y planteamiento',
    'Desarrollo temático',
    'Profundización del mensaje',
    'Cierre y llamado final',
  ];

  return titles[index] ?? `Sección ${index + 1}`;
}

function cleanSnippet(text: string, maxLength = 140): string {
  const clean = text
    .replace(/\s+/g, ' ')
    .replace(/["“”]/g, '')
    .trim();

  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trimEnd()}…`;
}

function pickVerseSnippet(verses: Array<{ number: number; text: string }>, verseNumber: number): string {
  const found = verses.find((verse) => verse.number === verseNumber);
  if (!found) return '';
  return cleanSnippet(found.text);
}

function getThemeForWord(word: string): string {
  const normalized = normalizeText(word);

  const map: Array<{ pattern: RegExp; meaning: string }> = [
    { pattern: /(reino|tron|rey|señore|dominio)/, meaning: 'soberanía divina y autoridad' },
    { pattern: /(justi|juicio|ley|mandam|pecad|iniqui)/, meaning: 'justicia, juicio y responsabilidad moral' },
    { pattern: /(amor|miseric|graci|piedad|compas)/, meaning: 'misericordia, gracia y restauración' },
    { pattern: /(espirit|aliento|viento|vida)/, meaning: 'vida espiritual y acción del Espíritu' },
    { pattern: /(luz|gloria|santo|santidad)/, meaning: 'revelación, santidad y gloria de Dios' },
    { pattern: /(pacto|promes|juram|hered)/, meaning: 'fidelidad del pacto y promesas divinas' },
    { pattern: /(oracion|clamar|ador|alaba)/, meaning: 'adoración, oración y respuesta de fe' },
    { pattern: /(cruz|resuc|evangel|jesu|cristo)/, meaning: 'obra redentora de Cristo y esperanza escatológica' },
  ];

  const match = map.find((entry) => entry.pattern.test(normalized));
  return match?.meaning ?? 'énfasis teológico del pasaje y cohesión literaria del capítulo';
}

function getDominantThemes(words: Array<{ word: string; count: number }>): string[] {
  const themes = new Set<string>();
  for (const item of words) {
    themes.add(getThemeForWord(item.word));
    if (themes.size >= 3) break;
  }
  return [...themes];
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zñ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTopChapterWords(verses: Array<{ number: number; text: string }>): Array<{ word: string; count: number }> {
  const freq = new Map<string, number>();

  for (const verse of verses) {
    const tokens = normalizeText(verse.text).split(' ');
    for (const token of tokens) {
      if (token.length < 4 || STOPWORDS.has(token)) continue;
      freq.set(token, (freq.get(token) ?? 0) + 1);
    }
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word, count]) => ({ word, count }));
}

function generateAnalysisData(book: string, chapter: number, verses: Array<{ number: number; text: string }>): StructuralAnalysis {
  const bookName = toPrettyName(book);
  const totalVerses = verses.length || 1;
  const ranges = buildSectionRanges(totalVerses);
  const chapterTopWords = getTopChapterWords(verses);
  const sections: StructuralSection[] = ranges.map(([from, to], index) => {
    const title = sectionTitleByIndex(index, ranges.length);
    const verseLabel = from === to ? `${from}` : `${from}-${to}`;
    const center = Math.floor((from + to) / 2);
    const openingSnippet = pickVerseSnippet(verses, from);
    const centerSnippet = pickVerseSnippet(verses, center);
    const sectionWords = getTopChapterWords(
      verses.filter((verse) => verse.number >= from && verse.number <= to)
    )
      .slice(0, 2)
      .map((item) => item.word);
    const lexicalFocus = sectionWords.length ? `con foco léxico en ${sectionWords.join(' y ')}` : 'con progresión argumental interna';

    const insight = openingSnippet || centerSnippet
      ? `Inicia con “${openingSnippet || centerSnippet}” y avanza hacia la consolidación del mensaje en la unidad.`
      : 'Se identifica un desarrollo narrativo/poético coherente dentro del tramo.';

    const significanceTheme = sectionWords.length
      ? getThemeForWord(sectionWords[0])
      : 'la intención teológica del autor en este capítulo';

    return {
      verses: verseLabel,
      title,
      description: `Abarca ${from === to ? `el versículo ${from}` : `los versículos ${from} al ${to}`} ${lexicalFocus}. ${insight}`,
      significance: `En ${bookName} ${chapter}, esta sección refuerza ${significanceTheme}, articulando el movimiento del texto dentro del libro.`,
    };
  });

  const repeatedWords: RepeatedWord[] = chapterTopWords.length
    ? chapterTopWords.slice(0, 4).map((item) => ({
        word: item.word,
        count: item.count,
        significance: `La recurrencia de “${item.word}” (${item.count}) señala ${getThemeForWord(item.word)} y ayuda a rastrear el hilo argumental de ${bookName} ${chapter}.`,
      }))
    : [
        {
          word: 'Tema dominante',
          count: 1,
          significance: 'No se detectaron repeticiones léxicas fuertes tras filtrar conectores; revisar manualmente términos teológicos clave.',
        },
      ];

  return {
    title: `Análisis Estructural de ${bookName} ${chapter}`,
    sections,
    repeatedWords,
  };
}

function generateContextData(book: string, chapter: number): HistoricalContext {
  const profile = BOOK_PROFILES[book] ?? fallbackBookProfile(book);
  const bookName = toPrettyName(book);
  const dataRoot = path.join(process.cwd(), 'data', 'bible');
  const verses = loadChapterVerses(dataRoot, book, chapter);
  const totalVerses = verses.length;
  const topWords = getTopChapterWords(verses);
  const keyTerms = topWords.slice(0, 3).map((item) => item.word);
  const opening = verses.length ? cleanSnippet(verses[0].text, 120) : '';
  const middle = verses.length ? cleanSnippet(verses[Math.floor(verses.length / 2)].text, 120) : '';
  const closing = verses.length ? cleanSnippet(verses[verses.length - 1].text, 120) : '';
  const themes = getDominantThemes(topWords);
  const termsBlock = keyTerms.length ? ` Los términos dominantes del capítulo son: ${keyTerms.join(', ')}.` : '';
  const textualAnchors = [opening, middle, closing].filter(Boolean);
  const anchorBlock = textualAnchors.length
    ? ` Señales textuales: ${textualAnchors.map((snippet) => `“${snippet}”`).join(' | ')}.`
    : '';
  const themeBlock = themes.length
    ? ` El desarrollo espiritual converge en ${themes.join('; ')}.`
    : ' El pasaje mantiene continuidad con la teología central del libro.';
  const spiritualLexicalBlock = keyTerms.length
    ? ` En su lenguaje central destacan ${keyTerms.join(', ')}.`
    : '';
  const spiritualAnchor = middle ? ` El núcleo del capítulo se percibe en “${middle}”.` : '';

  return {
    period: profile.period,
    dominantEmpire: profile.dominantEmpire,
    kingName: profile.kingName,
    kingRegion: profile.kingRegion,
    activeProphets: profile.activeProphets,
    templeStatus: profile.templeStatus,
    location: profile.location,
    summary: `${profile.summary} En ${bookName} ${chapter}, el capítulo contiene ${totalVerses || 'número no determinado de'} versículos y proyecta su mensaje dentro del marco histórico del libro.${termsBlock}${anchorBlock}`,
    spiritualContext: `${profile.spiritualContext} Este capítulo aporta un matiz propio dentro del libro.${themeBlock}${spiritualLexicalBlock}${spiritualAnchor}`,
  };
}

function isGenericContext(content: string): boolean {
  return (
    content.includes('Período bíblico general') ||
    content.includes('Contexto geográfico y histórico variado') ||
    content.includes('Según contexto histórico del libro') ||
    content.includes('Este capítulo aporta un matiz propio dentro del libro y debe leerse en continuidad con su sección literaria inmediata.')
  );
}

function isGenericAnalysis(content: string): boolean {
  return (
    content.includes('Patrón temático recurrente') ||
    content.includes('Desarrollo Principal') ||
    content.includes('Esta sección cubre') ||
    content.includes('conecta con los temas principales del libro')
  );
}

function getBooksFromAnalysisDir(dataRoot: string): string[] {
  const analysisRoot = path.join(dataRoot, 'analysis');
  if (!existsSync(analysisRoot)) {
    throw new Error(`No existe carpeta analysis: ${analysisRoot}`);
  }

  const dirs = readdirSync(analysisRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const canonical = CANONICAL_BOOK_ORDER.filter((book) => dirs.includes(book));
  const extras = dirs.filter((book) => !CANONICAL_BOOK_ORDER.includes(book as (typeof CANONICAL_BOOK_ORDER)[number]));

  return [...canonical, ...extras.sort()];
}

function getChapterNumbers(dataRoot: string, book: string): number[] {
  const analysisBookDir = path.join(dataRoot, 'analysis', book);
  return readdirSync(analysisBookDir)
    .filter((name) => /^\d+\.json$/.test(name))
    .map((name) => Number.parseInt(name.replace('.json', ''), 10))
    .sort((a, b) => a - b);
}

function loadChapterVerses(dataRoot: string, book: string, chapter: number): Array<{ number: number; text: string }> {
  const candidates = [
    resolveBookDir('rv1909', book),
    RV1909_BOOK_ALIASES[book],
    book,
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    const chapterPath = path.join(dataRoot, 'rv1909', candidate, `${chapter}.json`);
    if (!existsSync(chapterPath)) {
      continue;
    }

    try {
      const parsed = JSON.parse(readFileSync(chapterPath, 'utf8')) as ChapterText;
      if (!Array.isArray(parsed.verses)) continue;

      return parsed.verses.filter((v) => typeof v.number === 'number' && typeof v.text === 'string');
    } catch {
      continue;
    }
  }

  return [];
}

function writeJson(filePath: string, data: unknown): void {
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function shouldOverwrite(filePath: string, isGeneric: (content: string) => boolean, force: boolean): boolean {
  if (!existsSync(filePath)) return true;
  if (force) return true;

  const current = readFileSync(filePath, 'utf8');
  return isGeneric(current);
}

async function generateDetailedContextAndAnalysis(): Promise<void> {
  const force = process.argv.includes('--force');
  const dataRoot = path.join(process.cwd(), 'data', 'bible');

  if (!existsSync(dataRoot)) {
    throw new Error(`No existe data root: ${dataRoot}`);
  }

  const books = getBooksFromAnalysisDir(dataRoot);

  let updatedContext = 0;
  let updatedAnalysis = 0;
  let skippedContext = 0;
  let skippedAnalysis = 0;

  console.log('📚 Generando contexto y análisis detallado (Génesis → Apocalipsis)');
  console.log(`🛡️ Modo: ${force ? 'FORZAR sobreescritura total (--force)' : 'actualizar solo archivos genéricos'}`);

  for (const book of books) {
    const chapters = getChapterNumbers(dataRoot, book);

    for (const chapter of chapters) {
      const contextPath = path.join(dataRoot, 'context', book, `${chapter}.json`);
      const analysisPath = path.join(dataRoot, 'analysis', book, `${chapter}.json`);
      const verses = loadChapterVerses(dataRoot, book, chapter);

      if (shouldOverwrite(contextPath, isGenericContext, force)) {
        writeJson(contextPath, generateContextData(book, chapter));
        updatedContext += 1;
      } else {
        skippedContext += 1;
      }

      if (shouldOverwrite(analysisPath, isGenericAnalysis, force)) {
        writeJson(analysisPath, generateAnalysisData(book, chapter, verses));
        updatedAnalysis += 1;
      } else {
        skippedAnalysis += 1;
      }
    }

    console.log(`✅ ${toPrettyName(book)}: ${chapters.length} capítulos procesados`);
  }

  console.log('\n📊 Resumen final');
  console.log(`🧭 Context actualizados: ${updatedContext}`);
  console.log(`🧠 Analysis actualizados: ${updatedAnalysis}`);
  console.log(`⏭️ Context preservados: ${skippedContext}`);
  console.log(`⏭️ Analysis preservados: ${skippedAnalysis}`);
}

generateDetailedContextAndAnalysis().catch((error) => {
  console.error('❌ Error en generación detallada:', error);
  process.exitCode = 1;
});
