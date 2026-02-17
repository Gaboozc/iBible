import { readdirSync } from 'node:fs';
import path from 'node:path';

// Mapping of book directory names (including prefixed versions) to metadata
interface BookMetadata {
  testament: 'ot' | 'nt';
  name: string;
  abbreviation: string;
  descriptionEs: string;
  descriptionEn: string;
  order: number;
}

const BOOKS_METADATA: Record<string, BookMetadata> = {
  // OT - 39 books
  genesis: { testament: 'ot', name: 'Génesis', abbreviation: 'Gn', descriptionEs: 'Creación, patriarcas y pactos', descriptionEn: 'Book of creation, patriarchs and covenants', order: 1 },
  exodo: { testament: 'ot', name: 'Éxodo', abbreviation: 'Ex', descriptionEs: 'Salida de Egipto y la Ley', descriptionEn: 'Exodus from Egypt and the Law', order: 2 },
  levitico: { testament: 'ot', name: 'Levítico', abbreviation: 'Lv', descriptionEs: 'Leyes levíticas y sacerdocio', descriptionEn: 'Levitical laws and priesthood', order: 3 },
  numeros: { testament: 'ot', name: 'Números', abbreviation: 'Nm', descriptionEs: 'Peregrinación y censos', descriptionEn: 'Wilderness wanderings and numbering', order: 4 },
  deuteronomio: { testament: 'ot', name: 'Deuteronomio', abbreviation: 'Dt', descriptionEs: 'Ley mosaica y exhortaciones finales', descriptionEn: 'Mosaic law and final exhortations', order: 5 },
  josue: { testament: 'ot', name: 'Josué', abbreviation: 'Jos', descriptionEs: 'Conquista y reparto de Canaán', descriptionEn: 'Conquest and settlement of Canaan', order: 6 },
  jueces: { testament: 'ot', name: 'Jueces', abbreviation: 'Jue', descriptionEs: 'Periodo de los jueces y liderazgo tribal', descriptionEn: 'Period of judges and tribal leadership', order: 7 },
  rut: { testament: 'ot', name: 'Rut', abbreviation: 'Rt', descriptionEs: 'Historia de lealtad y redención', descriptionEn: 'Story of loyalty and redemption', order: 8 },
  '1-samuel': { testament: 'ot', name: '1 Samuel', abbreviation: '1Sa', descriptionEs: 'Primer libro de Samuel', descriptionEn: 'First book of Samuel', order: 9 },
  '2-samuel': { testament: 'ot', name: '2 Samuel', abbreviation: '2Sa', descriptionEs: 'Segundo libro de Samuel', descriptionEn: 'Second book of Samuel', order: 10 },
  '1-kings': { testament: 'ot', name: '1 Reyes', abbreviation: '1R', descriptionEs: 'Primer libro de Reyes', descriptionEn: 'First book of Kings', order: 11 },
  '2-kings': { testament: 'ot', name: '2 Reyes', abbreviation: '2R', descriptionEs: 'Segundo libro de Reyes', descriptionEn: 'Second book of Kings', order: 12 },
  '1-chronicles': { testament: 'ot', name: '1 Crónicas', abbreviation: '1Cr', descriptionEs: 'Primer libro de Crónicas', descriptionEn: 'First book of Chronicles', order: 13 },
  '2-chronicles': { testament: 'ot', name: '2 Crónicas', abbreviation: '2Cr', descriptionEs: 'Segundo libro de Crónicas', descriptionEn: 'Second book of Chronicles', order: 14 },
  ezra: { testament: 'ot', name: 'Esdras', abbreviation: 'Esd', descriptionEs: 'Retorno del exilio y reconstrucción del templo', descriptionEn: 'Return from exile and temple reconstruction', order: 15 },
  nehemiah: { testament: 'ot', name: 'Nehemías', abbreviation: 'Ne', descriptionEs: 'Reconstrucción de los muros de Jerusalén', descriptionEn: 'Rebuilding Jerusalem walls', order: 16 },
  esther: { testament: 'ot', name: 'Ester', abbreviation: 'Est', descriptionEs: 'Liberación de los judíos de la persecución', descriptionEn: 'Deliverance of Jews from persecution', order: 17 },
  job: { testament: 'ot', name: 'Job', abbreviation: 'Job', descriptionEs: 'Sufrimiento y sabiduría divina', descriptionEn: 'Suffering and divine wisdom', order: 18 },
  salmos: { testament: 'ot', name: 'Salmos', abbreviation: 'Sal', descriptionEs: 'Colección de salmos y oraciones', descriptionEn: 'Collection of psalms and prayers', order: 19 },
  proverbios: { testament: 'ot', name: 'Proverbios', abbreviation: 'Pr', descriptionEs: 'Sabiduría y dichos prácticos', descriptionEn: 'Wisdom and practical sayings', order: 20 },
  eclesiastes: { testament: 'ot', name: 'Eclesiastés', abbreviation: 'Ec', descriptionEs: 'Reflexiones sobre la vida y la vanidad', descriptionEn: 'Reflections on life and vanity', order: 21 },
  cantares: { testament: 'ot', name: 'Cantares', abbreviation: 'Cnt', descriptionEs: 'Poema de amor', descriptionEn: 'Poetic love song', order: 22 },
  isaias: { testament: 'ot', name: 'Isaías', abbreviation: 'Is', descriptionEs: 'Profecías y visiones mesiánicas', descriptionEn: 'Prophecies and messianic visions', order: 23 },
  jeremias: { testament: 'ot', name: 'Jeremías', abbreviation: 'Jer', descriptionEs: 'Profecías de juicio y restauración', descriptionEn: 'Prophecies of judgment and restoration', order: 24 },
  lamentaciones: { testament: 'ot', name: 'Lamentaciones', abbreviation: 'Lm', descriptionEs: 'Lamentos por Jerusalén', descriptionEn: 'Laments over Jerusalem', order: 25 },
  ezequiel: { testament: 'ot', name: 'Ezequiel', abbreviation: 'Ez', descriptionEs: 'Visiones y profecías del exilio', descriptionEn: 'Visions and prophecies from exilic period', order: 26 },
  daniel: { testament: 'ot', name: 'Daniel', abbreviation: 'Dn', descriptionEs: 'Profecías y visiones apocalípticas', descriptionEn: 'Prophecies and apocalyptic visions', order: 27 },
  hosea: { testament: 'ot', name: 'Oseas', abbreviation: 'Os', descriptionEs: 'Profecías y amor del pacto', descriptionEn: 'Prophecies and God\'s covenant love', order: 28 },
  joel: { testament: 'ot', name: 'Joel', abbreviation: 'Jl', descriptionEs: 'Día del Señor y renovación espiritual', descriptionEn: 'Day of the Lord and spiritual renewal', order: 29 },
  amos: { testament: 'ot', name: 'Amós', abbreviation: 'Am', descriptionEs: 'Juicio sobre las naciones', descriptionEn: 'Prophecies of judgment on nations', order: 30 },
  obadiah: { testament: 'ot', name: 'Abdías', abbreviation: 'Abd', descriptionEs: 'Juicio contra Edom', descriptionEn: 'Judgment against Edom', order: 31 },
  jonas: { testament: 'ot', name: 'Jonás', abbreviation: 'Jon', descriptionEs: 'Historia del profeta y la misericordia de Dios', descriptionEn: 'Story of the prophet and mercy of God', order: 32 },
  micah: { testament: 'ot', name: 'Miqueas', abbreviation: 'Mq', descriptionEs: 'Juicio y restauración', descriptionEn: 'Prophecies of judgment and restoration', order: 33 },
  nahum: { testament: 'ot', name: 'Nahúm', abbreviation: 'Na', descriptionEs: 'Profecía contra Nínive', descriptionEn: 'Prophecy against Nineveh', order: 34 },
  habakkuk: { testament: 'ot', name: 'Habacuc', abbreviation: 'Hab', descriptionEs: 'Preguntas y fe', descriptionEn: 'Questions and faith', order: 35 },
  zephaniah: { testament: 'ot', name: 'Sofonías', abbreviation: 'Sof', descriptionEs: 'Profecía del Día del Señor', descriptionEn: 'Day of the Lord prophecy', order: 36 },
  haggai: { testament: 'ot', name: 'Hageo', abbreviation: 'Hag', descriptionEs: 'Reconstrucción del templo post-exilio', descriptionEn: 'Post-exilic temple reconstruction', order: 37 },
  zechariah: { testament: 'ot', name: 'Zacarías', abbreviation: 'Zac', descriptionEs: 'Visiones apocalípticas', descriptionEn: 'Apocalyptic visions', order: 38 },
  malachi: { testament: 'ot', name: 'Malaquías', abbreviation: 'Mal', descriptionEs: 'Mensajero del Señor', descriptionEn: 'Messenger of the Lord', order: 39 },

  // NT - 27 books
  mateo: { testament: 'nt', name: 'Mateo', abbreviation: 'Mt', descriptionEs: 'Evangelio de Jesús', descriptionEn: 'Gospel narrative of Jesus', order: 40 },
  marcos: { testament: 'nt', name: 'Marcos', abbreviation: 'Mc', descriptionEs: 'Evangelio con énfasis en la acción', descriptionEn: 'Gospel with emphasis on action', order: 41 },
  lucas: { testament: 'nt', name: 'Lucas', abbreviation: 'Lc', descriptionEs: 'Evangelio con relato detallado', descriptionEn: 'Gospel with detailed narrative', order: 42 },
  juan: { testament: 'nt', name: 'Juan', abbreviation: 'Jn', descriptionEs: 'Evangelio centrado en la divinidad de Jesús', descriptionEn: 'Gospel focusing on divinity of Jesus', order: 43 },
  hechos: { testament: 'nt', name: 'Hechos', abbreviation: 'Hch', descriptionEs: 'Historia de la iglesia apostólica', descriptionEn: 'History of early apostolic church', order: 44 },
  romanos: { testament: 'nt', name: 'Romanos', abbreviation: 'Ro', descriptionEs: 'Teología y doctrina paulina', descriptionEn: 'Pauline theology and doctrine', order: 45 },
  '1-corinthians': { testament: 'nt', name: '1 Corintios', abbreviation: '1Co', descriptionEs: 'Carta de Pablo a Corinto', descriptionEn: 'Paul\'s letter to Corinth', order: 46 },
  '2-corinthians': { testament: 'nt', name: '2 Corintios', abbreviation: '2Co', descriptionEs: 'Segunda carta a Corinto', descriptionEn: 'Paul\'s second letter to Corinth', order: 47 },
  galatians: { testament: 'nt', name: 'Gálatas', abbreviation: 'Gá', descriptionEs: 'Libertad en Cristo', descriptionEn: 'Freedom in Christ', order: 48 },
  ephesians: { testament: 'nt', name: 'Efesios', abbreviation: 'Ef', descriptionEs: 'La iglesia como cuerpo de Cristo', descriptionEn: 'Church as body of Christ', order: 49 },
  philippians: { testament: 'nt', name: 'Filipenses', abbreviation: 'Flp', descriptionEs: 'Gozo en Cristo', descriptionEn: 'Joy and rejoicing in Christ', order: 50 },
  colossians: { testament: 'nt', name: 'Colosenses', abbreviation: 'Col', descriptionEs: 'Supremacía de Cristo', descriptionEn: 'Supremacy of Christ', order: 51 },
  '1-thessalonians': { testament: 'nt', name: '1 Tesalonicenses', abbreviation: '1Ts', descriptionEs: 'Esperanza y ánimo', descriptionEn: 'Hope and encouragement', order: 52 },
  '2-thessalonians': { testament: 'nt', name: '2 Tesalonicenses', abbreviation: '2Ts', descriptionEs: 'Segunda carta a Tesalónica', descriptionEn: 'Second message to Thessalonians', order: 53 },
  '1-timothy': { testament: 'nt', name: '1 Timoteo', abbreviation: '1Ti', descriptionEs: 'Instrucciones para liderazgo', descriptionEn: 'Instructions for church leadership', order: 54 },
  '2-timothy': { testament: 'nt', name: '2 Timoteo', abbreviation: '2Ti', descriptionEs: 'Exhortaciones finales a Timoteo', descriptionEn: 'Final exhortations to Timothy', order: 55 },
  titus: { testament: 'nt', name: 'Tito', abbreviation: 'Tit', descriptionEs: 'Guía para el liderazgo en la iglesia', descriptionEn: 'Guide for church superintendence', order: 56 },
  philemon: { testament: 'nt', name: 'Filemón', abbreviation: 'Flm', descriptionEs: 'Carta sobre perdón y aceptación', descriptionEn: 'Letter about forgiveness and acceptance', order: 57 },
  hebrews: { testament: 'nt', name: 'Hebreos', abbreviation: 'He', descriptionEs: 'Cristo como mediador perfecto', descriptionEn: 'Christ as the perfect mediator', order: 58 },
  james: { testament: 'nt', name: 'Santiago', abbreviation: 'Stg', descriptionEs: 'La fe sin obras es muerta', descriptionEn: 'Faith without works is dead', order: 59 },
  '1-peter': { testament: 'nt', name: '1 Pedro', abbreviation: '1P', descriptionEs: 'Sufrimiento y gloria', descriptionEn: 'Suffering and glory', order: 60 },
  '2-peter': { testament: 'nt', name: '2 Pedro', abbreviation: '2P', descriptionEs: 'Contra falsos maestros', descriptionEn: 'Against false teachers', order: 61 },
  '1-john': { testament: 'nt', name: '1 Juan', abbreviation: '1Jn', descriptionEs: 'Dios es amor', descriptionEn: 'God is love', order: 62 },
  '2-john': { testament: 'nt', name: '2 Juan', abbreviation: '2Jn', descriptionEs: 'Epístola breve sobre verdad y amor', descriptionEn: 'Short epistle on truth and love', order: 63 },
  '3-john': { testament: 'nt', name: '3 Juan', abbreviation: '3Jn', descriptionEs: 'Carta personal sobre hospitalidad', descriptionEn: 'Personal letter about hospitality', order: 64 },
  jude: { testament: 'nt', name: 'Judas', abbreviation: 'Jds', descriptionEs: 'Contender por la fe', descriptionEn: 'Contend for the faith', order: 65 },
  revelation: { testament: 'nt', name: 'Apocalipsis', abbreviation: 'Ap', descriptionEs: 'Profecía y revelación del fin', descriptionEn: 'Prophecy and revelation of end times', order: 66 },
};

// Map directory names to book slugs
const DIRECTORY_TO_SLUG: Record<string, string> = {
  // Simple names
  genesis: 'genesis',
  exodo: 'exodo',
  levitico: 'levitico',
  numeros: 'numeros',
  deuteronomio: 'deuteronomio',
  josue: 'josue',
  jueces: 'jueces',
  rut: 'rut',
  salmos: 'salmos',
  proverbios: 'proverbios',
  eclesiastes: 'eclesiastes',
  cantares: 'cantares',
  isaias: 'isaias',
  jeremias: 'jeremias',
  lamentaciones: 'lamentaciones',
  ezequiel: 'ezequiel',
  daniel: 'daniel',
  jonas: 'jonas',
  mateo: 'mateo',
  marcos: 'marcos',
  lucas: 'lucas',
  juan: 'juan',
  hechos: 'hechos',
  romanos: 'romanos',
  // Prefixed names (sorted by number)
  '10-1sasparv1909': '1-samuel',
  '11-2sasparv1909': '2-samuel',
  '12-1kisparv1909': '1-kings',
  '13-2kisparv1909': '2-kings',
  '14-1chsparv1909': '1-chronicles',
  '15-2chsparv1909': '2-chronicles',
  '16-ezrsparv1909': 'ezra',
  '17-nehsparv1909': 'nehemiah',
  '18-estsparv1909': 'esther',
  '19-jobsparv1909': 'job',
  '29-hossparv1909': 'hosea',
  '30-jolsparv1909': 'joel',
  '31-amosparv1909': 'amos',
  '32-obasparv1909': 'obadiah',
  '34-micsparv1909': 'micah',
  '35-namsparv1909': 'nahum',
  '36-habsparv1909': 'habakkuk',
  '37-zepsparv1909': 'zephaniah',
  '38-hagsparv1909': 'haggai',
  '39-zecsparv1909': 'zechariah',
  '40-malsparv1909': 'malachi',
  '76-1cosparv1909': '1-corinthians',
  '77-2cosparv1909': '2-corinthians',
  '78-galsparv1909': 'galatians',
  '79-ephsparv1909': 'ephesians',
  '80-phpsparv1909': 'philippians',
  '81-colsparv1909': 'colossians',
  '82-1thsparv1909': '1-thessalonians',
  '83-2thsparv1909': '2-thessalonians',
  '84-1tisparv1909': '1-timothy',
  '85-2tisparv1909': '2-timothy',
  '86-titsparv1909': 'titus',
  '87-phmsparv1909': 'philemon',
  '88-hebsparv1909': 'hebrews',
  '89-jassparv1909': 'james',
  '90-1pesparv1909': '1-peter',
  '91-2pesparv1909': '2-peter',
  '92-1jnsparv1909': '1-john',
  '93-2jnsparv1909': '2-john',
  '94-3jnsparv1909': '3-john',
  '95-judsparv1909': 'jude',
  '96-revsparv1909': 'revelation',
};

interface BookEntryInternal {
  id: string;
  testamentId: 'ot' | 'nt';
  name: string;
  abbreviation: string;
  slug: string;
  description: string;
  descriptionEs: string;
  descriptionEn: string;
  chapters: Array<{
    number: number;
    slug: string;
    available: boolean;
  }>;
}

export function generateBibleCatalog(biblePath: string) {
  const rv1909Path = path.join(biblePath, 'rv1909');

  const testaments: Record<
    string,
    {
      id: 'ot' | 'nt';
      name: string;
      slug: string;
      order: number;
      books: BookEntryInternal[];
    }
  > = {
    ot: { id: 'ot', name: 'Antiguo Testamento', slug: 'antiguo-testamento', order: 1, books: [] },
    nt: { id: 'nt', name: 'Nuevo Testamento', slug: 'nuevo-testamento', order: 2, books: [] },
  };

  // Read all book directories
  const bookDirs = readdirSync(rv1909Path).filter((item) => item !== '.gitkeep');

  // Process each directory
  for (const dirName of bookDirs) {
    const bookSlug = DIRECTORY_TO_SLUG[dirName];
    if (!bookSlug) continue; // Skip unknown directories

    const bookMetadata = BOOKS_METADATA[bookSlug];
    if (!bookMetadata) continue; // Skip if no metadata

    const bookPath = path.join(rv1909Path, dirName);
    const stat = readdirSync(bookPath, { withFileTypes: true });

    // Count chapters
    const chapterFiles = stat.filter((f) => f.isFile() && f.name.endsWith('.json'));
    const chapterCount = chapterFiles.length;

    if (chapterCount === 0) continue;

    const bookEntry = {
      id: bookSlug,
      testamentId: bookMetadata.testament,
      name: bookMetadata.name,
      abbreviation: bookMetadata.abbreviation,
      slug: bookSlug,
      description: bookMetadata.descriptionEn,
      descriptionEs: bookMetadata.descriptionEs,
      descriptionEn: bookMetadata.descriptionEn,
      chapters: Array.from({ length: chapterCount }, (_, i) => ({
        number: i + 1,
        slug: String(i + 1),
        available: true,
      })),
    };

    testaments[bookMetadata.testament].books.push(bookEntry);
  }

  // Sort books within each testament by order
  testaments.ot.books.sort((a, b) => BOOKS_METADATA[a.id].order - BOOKS_METADATA[b.id].order);
  testaments.nt.books.sort((a, b) => BOOKS_METADATA[a.id].order - BOOKS_METADATA[b.id].order);

  return Object.values(testaments).sort((a, b) => a.order - b.order);
}
