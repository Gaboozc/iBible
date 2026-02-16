import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BOOK_CODE_TO_SLUG: Record<string, string> = {
  GEN: 'genesis',
  EXO: 'exodo',
  LEV: 'levitico',
  NUM: 'numeros',
  DEU: 'deuteronomio',
  JOS: 'josue',
  JDG: 'jueces',
  RUT: 'rut',
  PSA: 'salmos',
  PRO: 'proverbios',
  ECC: 'eclesiastes',
  SNG: 'cantares',
  ISA: 'isaias',
  JER: 'jeremias',
  LAM: 'lamentaciones',
  EZK: 'ezequiel',
  EZE: 'ezequiel',
  DAN: 'daniel',
  JON: 'jonas',
  MAT: 'mateo',
  MRK: 'marcos',
  LUK: 'lucas',
  JHN: 'juan',
  ACT: 'hechos',
  ROM: 'romanos',
};

interface VerseText {
  number: number;
  text: string;
}

interface ChapterText {
  version: string;
  book: string;
  chapter: number;
  verses: VerseText[];
}

const USAGE = 'Usage: npx tsx scripts/import-usfm.ts <version> <inputDir> <outputDir>';

const [version, inputDir, outputDir] = process.argv.slice(2);

if (!version || !inputDir || !outputDir) {
  console.log(USAGE);
  process.exit(1);
}

const stripUsfmWordMarkup = (value: string) => {
  // Remove word-level markup like: \w palabra|strong="H123"\w*
  return value
    .replace(/\\w\s+([^|]+)\|[^\\]*?\\w\*/g, '$1')
    .replace(/\\w\s+([^\\]+?)\\w\*/g, '$1');
};

const stripRemainingMarkers = (value: string) => {
  // Remove any leftover USFM markers and pipes
  return value.replace(/\\[a-z0-9]+\s*/gi, '').replace(/\|/g, ' ');
};

const normalizeText = (value: string) => {
  const cleaned = stripRemainingMarkers(stripUsfmWordMarkup(value));
  return cleaned.replace(/\s+/g, ' ').trim();
};

const getBookSlugFromId = (content: string, fallback: string) => {
  const idMatch = content.match(/\\id\s+([A-Z0-9]{3})/);
  const code = idMatch?.[1] ?? fallback.toUpperCase();
  return BOOK_CODE_TO_SLUG[code] ?? fallback.toLowerCase();
};

const parseUsfm = (content: string, versionId: string, bookSlug: string): ChapterText[] => {
  const lines = content.split(/\r?\n/);
  const chapters: ChapterText[] = [];
  let currentChapter: ChapterText | null = null;
  let currentVerse: VerseText | null = null;

  const pushVerse = () => {
    if (currentChapter && currentVerse) {
      currentVerse.text = normalizeText(currentVerse.text);
      currentChapter.verses.push(currentVerse);
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('\\c ')) {
      pushVerse();
      const chapterNumber = Number(line.replace('\\c', '').trim());
      currentChapter = {
        version: versionId,
        book: bookSlug,
        chapter: chapterNumber,
        verses: [],
      };
      chapters.push(currentChapter);
      currentVerse = null;
      continue;
    }

    if (line.startsWith('\\v ')) {
      pushVerse();
      if (!currentChapter) continue;

      const verseLine = line.replace('\\v', '').trim();
      const spaceIndex = verseLine.indexOf(' ');
      const numberPart = spaceIndex === -1 ? verseLine : verseLine.slice(0, spaceIndex);
      const textPart = spaceIndex === -1 ? '' : verseLine.slice(spaceIndex + 1);

      currentVerse = {
        number: Number(numberPart),
        text: textPart,
      };
      continue;
    }

    if (currentVerse) {
      currentVerse.text += ` ${line}`;
    }
  }

  pushVerse();
  return chapters;
};

const run = async () => {
  const files = await readdir(inputDir);

  for (const file of files) {
    if (!file.toLowerCase().endsWith('.usfm')) continue;

    const inputPath = path.join(inputDir, file);
    const content = await readFile(inputPath, 'utf8');
    const fileBase = path.basename(file, path.extname(file));
    const bookSlug = getBookSlugFromId(content, fileBase);

    const chapters = parseUsfm(content, version, bookSlug);

    for (const chapter of chapters) {
      const outputFolder = path.join(outputDir, version, bookSlug);
      await mkdir(outputFolder, { recursive: true });

      const outputPath = path.join(outputFolder, `${chapter.chapter}.json`);
      await writeFile(outputPath, JSON.stringify(chapter, null, 2));
    }
  }

  console.log('USFM import finished.');
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
