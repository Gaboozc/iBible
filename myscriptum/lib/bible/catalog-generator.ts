import { readdirSync } from 'node:fs';
import path from 'node:path';

// Mapping of book directory names (including prefixed versions) to metadata
interface BookMetadata {
  testament: 'ot' | 'nt';
  name: string;
  abbreviation: string;
  description: string;
  order: number;
}

const BOOKS_METADATA: Record<string, BookMetadata> = {
  // OT - 39 books
  genesis: { testament: 'ot', name: 'Génesis', abbreviation: 'Gn', description: 'Book of creation, patriarchs and covenants', order: 1 },
  exodo: { testament: 'ot', name: 'Éxodo', abbreviation: 'Ex', description: 'Exodus from Egypt and the Law', order: 2 },
  levitico: { testament: 'ot', name: 'Levítico', abbreviation: 'Lv', description: 'Levitical laws and priesthood', order: 3 },
  numeros: { testament: 'ot', name: 'Números', abbreviation: 'Nm', description: 'Wilderness wanderings and numbering', order: 4 },
  deuteronomio: { testament: 'ot', name: 'Deuteronomio', abbreviation: 'Dt', description: 'Mosaic law and final exhortations', order: 5 },
  josue: { testament: 'ot', name: 'Josué', abbreviation: 'Jos', description: 'Conquest and settlement of Canaan', order: 6 },
  jueces: { testament: 'ot', name: 'Jueces', abbreviation: 'Jue', description: 'Period of judges and tribal leadership', order: 7 },
  rut: { testament: 'ot', name: 'Rut', abbreviation: 'Rt', description: 'Story of loyalty and redemption', order: 8 },
  '1-samuel': { testament: 'ot', name: '1 Samuel', abbreviation: '1Sa', description: 'First book of Samuel', order: 9 },
  '2-samuel': { testament: 'ot', name: '2 Samuel', abbreviation: '2Sa', description: 'Second book of Samuel', order: 10 },
  '1-kings': { testament: 'ot', name: '1 Reyes', abbreviation: '1R', description: 'First book of Kings', order: 11 },
  '2-kings': { testament: 'ot', name: '2 Reyes', abbreviation: '2R', description: 'Second book of Kings', order: 12 },
  '1-chronicles': { testament: 'ot', name: '1 Crónicas', abbreviation: '1Cr', description: 'First book of Chronicles', order: 13 },
  '2-chronicles': { testament: 'ot', name: '2 Crónicas', abbreviation: '2Cr', description: 'Second book of Chronicles', order: 14 },
  ezra: { testament: 'ot', name: 'Esdras', abbreviation: 'Esd', description: 'Return from exile and temple reconstruction', order: 15 },
  nehemiah: { testament: 'ot', name: 'Nehemías', abbreviation: 'Ne', description: 'Rebuilding Jerusalem walls', order: 16 },
  esther: { testament: 'ot', name: 'Ester', abbreviation: 'Est', description: 'Deliverance of Jews from persecution', order: 17 },
  job: { testament: 'ot', name: 'Job', abbreviation: 'Job', description: 'Suffering and divine wisdom', order: 18 },
  salmos: { testament: 'ot', name: 'Salmos', abbreviation: 'Sal', description: 'Collection of psalms and prayers', order: 19 },
  proverbios: { testament: 'ot', name: 'Proverbios', abbreviation: 'Pr', description: 'Wisdom and practical sayings', order: 20 },
  eclesiastes: { testament: 'ot', name: 'Eclesiastés', abbreviation: 'Ec', description: 'Reflections on life and vanity', order: 21 },
  cantares: { testament: 'ot', name: 'Cantares', abbreviation: 'Cnt', description: 'Poetic love song', order: 22 },
  isaias: { testament: 'ot', name: 'Isaías', abbreviation: 'Is', description: 'Prophecies and messianic visions', order: 23 },
  jeremias: { testament: 'ot', name: 'Jeremías', abbreviation: 'Jer', description: 'Prophecies of judgment and restoration', order: 24 },
  lamentaciones: { testament: 'ot', name: 'Lamentaciones', abbreviation: 'Lm', description: 'Laments over Jerusalem', order: 25 },
  ezequiel: { testament: 'ot', name: 'Ezequiel', abbreviation: 'Ez', description: 'Visions and prophecies from exilic period', order: 26 },
  daniel: { testament: 'ot', name: 'Daniel', abbreviation: 'Dn', description: 'Prophecies and apocalyptic visions', order: 27 },
  hosea: { testament: 'ot', name: 'Oseas', abbreviation: 'Os', description: 'Prophecies and God\'s covenant love', order: 28 },
  joel: { testament: 'ot', name: 'Joel', abbreviation: 'Jl', description: 'Day of the Lord and spiritual renewal', order: 29 },
  amos: { testament: 'ot', name: 'Amós', abbreviation: 'Am', description: 'Prophecies of judgment on nations', order: 30 },
  obadiah: { testament: 'ot', name: 'Abdías', abbreviation: 'Abd', description: 'Judgment against Edom', order: 31 },
  jonas: { testament: 'ot', name: 'Jonás', abbreviation: 'Jon', description: 'Story of the prophet and mercy of God', order: 32 },
  micah: { testament: 'ot', name: 'Miqueas', abbreviation: 'Mq', description: 'Prophecies of judgment and restoration', order: 33 },
  nahum: { testament: 'ot', name: 'Nahúm', abbreviation: 'Na', description: 'Prophecy against Nineveh', order: 34 },
  habakkuk: { testament: 'ot', name: 'Habacuc', abbreviation: 'Hab', description: 'Questions and faith', order: 35 },
  zephaniah: { testament: 'ot', name: 'Sofonías', abbreviation: 'Sof', description: 'Day of the Lord prophecy', order: 36 },
  haggai: { testament: 'ot', name: 'Hageo', abbreviation: 'Hag', description: 'Post-exilic temple reconstruction', order: 37 },
  zechariah: { testament: 'ot', name: 'Zacarías', abbreviation: 'Zac', description: 'Apocalyptic visions', order: 38 },
  malachi: { testament: 'ot', name: 'Malaquías', abbreviation: 'Mal', description: 'Messenger of the Lord', order: 39 },

  // NT - 27 books
  mateo: { testament: 'nt', name: 'Mateo', abbreviation: 'Mt', description: 'Gospel narrative of Jesus', order: 40 },
  marcos: { testament: 'nt', name: 'Marcos', abbreviation: 'Mc', description: 'Gospel with emphasis on action', order: 41 },
  lucas: { testament: 'nt', name: 'Lucas', abbreviation: 'Lc', description: 'Gospel with detailed narrative', order: 42 },
  juan: { testament: 'nt', name: 'Juan', abbreviation: 'Jn', description: 'Gospel focusing on divinity of Jesus', order: 43 },
  hechos: { testament: 'nt', name: 'Hechos', abbreviation: 'Hch', description: 'History of early apostolic church', order: 44 },
  romanos: { testament: 'nt', name: 'Romanos', abbreviation: 'Ro', description: 'Pauline theology and doctrine', order: 45 },
  '1-corinthians': { testament: 'nt', name: '1 Corintios', abbreviation: '1Co', description: 'Paul\'s letter to Corinth', order: 46 },
  '2-corinthians': { testament: 'nt', name: '2 Corintios', abbreviation: '2Co', description: 'Paul\'s second letter to Corinth', order: 47 },
  galatians: { testament: 'nt', name: 'Gálatas', abbreviation: 'Gá', description: 'Freedom in Christ', order: 48 },
  ephesians: { testament: 'nt', name: 'Efesios', abbreviation: 'Ef', description: 'Church as body of Christ', order: 49 },
  philippians: { testament: 'nt', name: 'Filipenses', abbreviation: 'Flp', description: 'Joy and rejoicing in Christ', order: 50 },
  colossians: { testament: 'nt', name: 'Colosenses', abbreviation: 'Col', description: 'Supremacy of Christ', order: 51 },
  '1-thessalonians': { testament: 'nt', name: '1 Tesalonicenses', abbreviation: '1Ts', description: 'Hope and encouragement', order: 52 },
  '2-thessalonians': { testament: 'nt', name: '2 Tesalonicenses', abbreviation: '2Ts', description: 'Second message to Thessalonians', order: 53 },
  '1-timothy': { testament: 'nt', name: '1 Timoteo', abbreviation: '1Ti', description: 'Instructions for church leadership', order: 54 },
  '2-timothy': { testament: 'nt', name: '2 Timoteo', abbreviation: '2Ti', description: 'Final exhortations to Timothy', order: 55 },
  titus: { testament: 'nt', name: 'Tito', abbreviation: 'Tit', description: 'Guide for church superintendence', order: 56 },
  philemon: { testament: 'nt', name: 'Filemón', abbreviation: 'Flm', description: 'Letter about forgiveness and acceptance', order: 57 },
  hebrews: { testament: 'nt', name: 'Hebreos', abbreviation: 'He', description: 'Christ as the perfect mediator', order: 58 },
  james: { testament: 'nt', name: 'Santiago', abbreviation: 'Stg', description: 'Faith without works is dead', order: 59 },
  '1-peter': { testament: 'nt', name: '1 Pedro', abbreviation: '1P', description: 'Suffering and glory', order: 60 },
  '2-peter': { testament: 'nt', name: '2 Pedro', abbreviation: '2P', description: 'Against false teachers', order: 61 },
  '1-john': { testament: 'nt', name: '1 Juan', abbreviation: '1Jn', description: 'God is love', order: 62 },
  '2-john': { testament: 'nt', name: '2 Juan', abbreviation: '2Jn', description: 'Short epistle on truth and love', order: 63 },
  '3-john': { testament: 'nt', name: '3 Juan', abbreviation: '3Jn', description: 'Personal letter about hospitality', order: 64 },
  jude: { testament: 'nt', name: 'Judas', abbreviation: 'Jds', description: 'Contend for the faith', order: 65 },
  revelation: { testament: 'nt', name: 'Apocalipsis', abbreviation: 'Ap', description: 'Prophecy and revelation of end times', order: 66 },
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
  chapters: Array<{
    number: number;
    slug: string;
    available: boolean;
  }>;
}

export function generateBibleCatalog(biblePath: string) {
  const rv1909Path = path.join(biblePath, 'rv1909');

  const testaments: Record<string, { name: string; order: number; books: BookEntryInternal[] }> = {
    ot: { name: 'Antiguo Testamento', order: 1, books: [] },
    nt: { name: 'Nuevo Testamento', order: 2, books: [] },
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
      description: bookMetadata.description,
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
