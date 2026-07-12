import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { resolveBookDir } from '../lib/bible/book-dir-map';

interface ContextData {
  summary?: string;
  spiritualContext?: string;
  dominantEmpire?: string;
  period?: string;
  kingName?: string;
  templeStatus?: string;
  location?: string;
}

interface AnalysisData {
  title?: string;
  sections?: Array<{ description?: string; significance?: string }>;
  repeatedWords?: Array<{ word?: string; count?: number; significance?: string }>;
}

interface QuestionData {
  stage?: string;
  question?: string;
}

interface ConnectionData {
  type?: string;
  description?: string;
  reference?: string;
}

interface EtymologyEntry {
  hebrew?: string;
  english?: string;
}

interface ChapterText {
  verses?: Array<{ number: number; text: string }>;
}

interface ChapterIssue {
  book: string;
  chapter: number;
  issues: string[];
}

interface QualityReport {
  scannedChapters: number;
  chaptersWithIssues: number;
  issueCounts: Record<string, number>;
  exactDuplicates: {
    contextSummary: number;
    spiritualContext: number;
    analysisTitle: number;
  };
  chapters: ChapterIssue[];
}

type ContentTab = 'analysis' | 'context' | 'questions' | 'connections' | 'etymology';

interface GenericManifest {
  generatedAt: string;
  chapters: Record<string, ContentTab[]>;
}

const GENERIC_PATTERNS = [
  /per[ií]odo b[ií]blico general/i,
  /contexto geogr[aá]fico y hist[oó]rico variado/i,
  /seg[uú]n contexto hist[oó]rico del libro/i,
  /esta funcionalidad ser[aá] a[nñ]adida pr[oó]ximamente/i,
  /esta secci[oó]n cubre .* y desarrolla el flujo narrativo/i,
  /conecta con los temas principales del libro/i,
  /patr[oó]n tem[aá]tico recurrente/i,
  /motivo literario/i,
  /[eé]nfasis teol[oó]gico del pasaje y cohesi[oó]n literaria del cap[ií]tulo/i,
  /aporta un matiz propio dentro del libro/i,
  /articulando el movimiento del texto dentro del libro/i,
  /consolidaci[oó]n del mensaje en la unidad/i,
  /proyecta su mensaje dentro del marco hist[oó]rico del libro/i,
];

// Huellas del fallbackBookProfile (scripts/generate-analysis.ts)
const FALLBACK_CONTEXT_FINGERPRINTS = [
  /Contexto ANE:\s*Egipto\s*\/\s*Asiria\s*\/\s*Babilonia\s*\/\s*Persia/i,
  /Peri[oó]do veterotestamentario \(seg[uú]n marco del libro\)/i,
  /Seg[uú]n momento narrativo del libro/i,
  /Israel, Jud[aá] o exilio, seg[uú]n el libro/i,
  /Autoridades romanas y locales seg[uú]n el contexto/i,
  /Segundo Templo en transici[oó]n hist[oó]rica o ya destruido seg[uú]n fecha/i,
];

// Huellas del generador de questions/connections/etymology
const QUESTION_FINGERPRINTS = [
  /personajes,\s*lugares y eventos principales en/i,
  /palabras o frases se repiten en este cap[ií]tulo/i,
  /mensaje central o prop[oó]sito de/i,
  /naturaleza de Dios/i,
];

const CONNECTION_FINGERPRINTS = [
  /Este cap[ií]tulo conecta con el tema general del libro de/i,
  /Este pasaje se sit[uú]a en un momento clave de la historia b[ií]blica/i,
  /Referencias tem[aá]ticas en la Biblia/i,
];

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

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function pushIssue(acc: Record<string, number>, issue: string): void {
  acc[issue] = (acc[issue] ?? 0) + 1;
}

function getBooks(dataRoot: string): string[] {
  const analysisRoot = path.join(dataRoot, 'analysis');
  return readdirSync(analysisRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function getChapters(dataRoot: string, book: string): number[] {
  const bookDir = path.join(dataRoot, 'analysis', book);
  return readdirSync(bookDir)
    .filter((name) => /^\d+\.json$/.test(name))
    .map((name) => Number.parseInt(name.replace('.json', ''), 10))
    .sort((a, b) => a - b);
}

function readJson<T>(filePath: string): T | null {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

function loadVerseCount(dataRoot: string, book: string, chapter: number): number {
  const candidates = [
    resolveBookDir('rv1909', book),
    RV1909_BOOK_ALIASES[book],
    book,
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    const chapterPath = path.join(dataRoot, 'rv1909', candidate, `${chapter}.json`);
    const parsed = readJson<ChapterText>(chapterPath);
    if (parsed && Array.isArray(parsed.verses)) {
      return parsed.verses.length;
    }
  }

  return 0;
}

function isChapterTabGeneric(
  tab: ContentTab,
  data: {
    context: ContextData | null;
    analysis: AnalysisData | null;
    questions: QuestionData[] | null;
    connections: ConnectionData[] | null;
    etymology: EtymologyEntry[] | null;
  },
  duplicateTitles: Set<string>
): boolean {
  switch (tab) {
    case 'context': {
      const ctx = data.context;
      if (!ctx) return true;
      if (FALLBACK_CONTEXT_FINGERPRINTS.some((p) => p.test(`${ctx.dominantEmpire ?? ''} ${ctx.period ?? ''} ${ctx.kingName ?? ''} ${ctx.templeStatus ?? ''} ${ctx.location ?? ''}`))) {
        return true;
      }
      const combo = `${ctx.summary ?? ''} ${ctx.spiritualContext ?? ''}`;
      return GENERIC_PATTERNS.some((p) => p.test(combo));
    }
    case 'analysis': {
      const a = data.analysis;
      if (!a) return true;
      const title = a.title?.trim() ?? '';
      const key = normalize(title.replace(/\d+/g, '#'));
      if (title && duplicateTitles.has(key)) return true;
      const sectionsText = (a.sections ?? []).map((s) => `${s.description ?? ''} ${s.significance ?? ''}`).join(' ');
      return GENERIC_PATTERNS.some((p) => p.test(sectionsText));
    }
    case 'questions': {
      const q = data.questions;
      if (!q || q.length === 0) return true;
      const firstQ = q[0]?.question ?? '';
      return QUESTION_FINGERPRINTS.some((p) => p.test(firstQ));
    }
    case 'connections': {
      const c = data.connections;
      if (!c || c.length === 0) return true;
      return c.every((entry) => CONNECTION_FINGERPRINTS.some((p) => p.test(`${entry.description ?? ''} ${entry.reference ?? ''}`)));
    }
    case 'etymology': {
      const e = data.etymology;
      if (!e || e.length === 0) return true;
      return e.length === 1 && /d[aá]bar/i.test(e[0]?.hebrew ?? '');
    }
  }
}

function main(): void {
  const dataRoot = path.join(process.cwd(), 'data', 'bible');
  const books = getBooks(dataRoot);

  const issueCounts: Record<string, number> = {};
  const chapters: ChapterIssue[] = [];

  const summaryMap = new Map<string, number>();
  const spiritualMap = new Map<string, number>();
  const titleMap = new Map<string, number>();

  // First pass: collect all analysis titles to know which are duplicated
  const rawTitles = new Map<string, number>();
  for (const book of books) {
    for (const chapter of getChapters(dataRoot, book)) {
      const a = readJson<AnalysisData>(path.join(dataRoot, 'analysis', book, `${chapter}.json`));
      const title = a?.title?.trim();
      if (title) {
        const key = normalize(title.replace(/\d+/g, '#'));
        rawTitles.set(key, (rawTitles.get(key) ?? 0) + 1);
      }
    }
  }
  const duplicateTitles = new Set<string>();
  rawTitles.forEach((count, key) => {
    if (count > 1) duplicateTitles.add(key);
  });

  const genericChapters: Record<string, ContentTab[]> = {};
  let scannedChapters = 0;

  for (const book of books) {
    const chapterNumbers = getChapters(dataRoot, book);

    for (const chapter of chapterNumbers) {
      scannedChapters += 1;
      const issues: string[] = [];

      const contextPath = path.join(dataRoot, 'context', book, `${chapter}.json`);
      const analysisPath = path.join(dataRoot, 'analysis', book, `${chapter}.json`);
      const questionsPath = path.join(dataRoot, 'questions', book, `${chapter}.json`);
      const connectionsPath = path.join(dataRoot, 'connections', book, `${chapter}.json`);
      const etymologyPath = path.join(dataRoot, 'etymology', book, `${chapter}.json`);

      const context = readJson<ContextData>(contextPath);
      const analysis = readJson<AnalysisData>(analysisPath);
      const questions = readJson<QuestionData[]>(questionsPath);
      const connections = readJson<ConnectionData[]>(connectionsPath);
      const etymology = readJson<EtymologyEntry[]>(etymologyPath);
      const verseCount = loadVerseCount(dataRoot, book, chapter);

      const flagged: ContentTab[] = [];
      const chapterData = { context, analysis, questions, connections, etymology };
      for (const tab of ['analysis', 'context', 'questions', 'connections', 'etymology'] as ContentTab[]) {
        if (isChapterTabGeneric(tab, chapterData, duplicateTitles)) {
          flagged.push(tab);
          pushIssue(issueCounts, `${tab}_generic`);
        }
      }
      if (flagged.length > 0) {
        genericChapters[`${book}:${chapter}`] = flagged;
      }

      if (!context) {
        issues.push('context_missing_or_invalid');
      }

      if (!analysis) {
        issues.push('analysis_missing_or_invalid');
      }

      const summary = context?.summary?.trim() ?? '';
      const spiritual = context?.spiritualContext?.trim() ?? '';

      const minSummaryLength = verseCount >= 8 ? 220 : 140;
      const minSpiritualLength = verseCount >= 8 ? 220 : 140;

      if (summary.length < minSummaryLength) {
        issues.push('summary_too_short');
      }

      if (spiritual.length < minSpiritualLength) {
        issues.push('spiritual_too_short');
      }

      if (summary && GENERIC_PATTERNS.some((pattern) => pattern.test(summary))) {
        issues.push('summary_generic_pattern');
      }

      if (spiritual && GENERIC_PATTERNS.some((pattern) => pattern.test(spiritual))) {
        issues.push('spiritual_generic_pattern');
      }

      if (summary) {
        const key = normalize(summary);
        summaryMap.set(key, (summaryMap.get(key) ?? 0) + 1);
      }

      if (spiritual) {
        const key = normalize(spiritual);
        spiritualMap.set(key, (spiritualMap.get(key) ?? 0) + 1);
      }

      const title = analysis?.title?.trim() ?? '';
      if (!title) {
        issues.push('analysis_title_missing');
      } else {
        const key = normalize(title.replace(/\d+/g, '#'));
        titleMap.set(key, (titleMap.get(key) ?? 0) + 1);
      }

      const sections = analysis?.sections ?? [];
      if (verseCount > 6 && sections.length < 2) {
        issues.push('analysis_sections_too_few');
      }

      const minSectionDescription = verseCount > 6 ? 140 : 90;
      const shortSectionDescriptions = sections.filter((section) => (section.description?.trim().length ?? 0) < minSectionDescription).length;
      if (shortSectionDescriptions > 0) {
        issues.push('section_description_too_short');
      }

      const genericSections = sections.filter((section) => {
        const text = `${section.description ?? ''} ${section.significance ?? ''}`;
        return GENERIC_PATTERNS.some((pattern) => pattern.test(text));
      }).length;
      if (genericSections > 0) {
        issues.push('section_generic_pattern');
      }

      const repeatedWords = analysis?.repeatedWords ?? [];
      if (verseCount > 4 && repeatedWords.length < 2) {
        issues.push('repeated_words_too_few');
      }

      const weakRepeatedWords = repeatedWords.filter((item) => (item.count ?? 0) <= 1).length;
      if (verseCount > 8 && weakRepeatedWords === repeatedWords.length && repeatedWords.length > 0) {
        issues.push('repeated_words_low_count');
      }

      if (issues.length > 0) {
        for (const issue of issues) pushIssue(issueCounts, issue);
        chapters.push({ book, chapter, issues });
      }
    }
  }

  const exactDuplicates = {
    contextSummary: [...summaryMap.values()].filter((count) => count > 1).reduce((a, b) => a + b, 0),
    spiritualContext: [...spiritualMap.values()].filter((count) => count > 1).reduce((a, b) => a + b, 0),
    analysisTitle: [...titleMap.values()].filter((count) => count > 1).reduce((a, b) => a + b, 0),
  };

  const report: QualityReport = {
    scannedChapters,
    chaptersWithIssues: chapters.length,
    issueCounts,
    exactDuplicates,
    chapters,
  };

  const outPath = path.join(dataRoot, 'quality-report.json');
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  const manifest: GenericManifest = {
    generatedAt: new Date().toISOString(),
    chapters: genericChapters,
  };
  const manifestPath = path.join(dataRoot, 'generic-manifest.json');
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const genericCount = Object.keys(genericChapters).length;
  console.log('🔎 Deep quality check completed');
  console.log(`📚 Chapters scanned: ${report.scannedChapters}`);
  console.log(`⚠️  Chapters with issues: ${report.chaptersWithIssues}`);
  console.log(`🚧 Chapters with any generic tab: ${genericCount}`);
  console.log(`🧪 Exact duplicate summaries: ${report.exactDuplicates.contextSummary}`);
  console.log(`🧪 Exact duplicate spiritual contexts: ${report.exactDuplicates.spiritualContext}`);
  console.log(`🧪 Near-template duplicate titles: ${report.exactDuplicates.analysisTitle}`);
  console.log(`📄 Report: ${outPath}`);
  console.log(`📄 Generic manifest: ${manifestPath}`);
}

main();
