import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface RouteParams {
  book: string;
  chapter: string;
  type: string;
}

const ANALYSIS_BOOK_SLUGS: Record<string, string> = {
  genesis: 'genesis',
  exodo: 'exodus',
  levitico: 'leviticus',
  numeros: 'numbers',
  deuteronomio: 'deuteronomy',
  josue: 'joshua',
  jueces: 'judges',
  rut: 'ruth',
  salmos: 'psalms',
  proverbios: 'proverbs',
  eclesiastes: 'ecclesiastes',
  cantares: 'song-of-songs',
  isaias: 'isaiah',
  jeremias: 'jeremiah',
  lamentaciones: 'lamentations',
  ezequiel: 'ezekiel',
  daniel: 'daniel',
  jonas: 'jonah',
  mateo: 'matthew',
  marcos: 'mark',
  lucas: 'luke',
  juan: 'john',
  hechos: 'acts',
  romanos: 'romans',
};

function resolveDataRoot(): string | null {
  const candidates = [
    path.join(process.cwd(), 'data', 'bible'),
    path.join(process.cwd(), 'myscriptum', 'data', 'bible'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

export async function GET(request: Request, { params }: { params: Promise<RouteParams> }) {
  const resolvedParams = await params;
  const { book, chapter, type } = resolvedParams;

  try {
    const chapterNum = parseInt(chapter, 10);
    
    if (!book || !type || isNaN(chapterNum) || chapterNum < 1) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const resolvedBook = ANALYSIS_BOOK_SLUGS[book] ?? book;
    
    const dataRoot = resolveDataRoot();
    if (!dataRoot) {
      console.error('❌ API: data/bible directory not found');
      return NextResponse.json({ error: 'Data directory not found' }, { status: 500 });
    }

    const filePath = path.join(dataRoot, type, resolvedBook, `${chapterNum}.json`);
    console.log(`📁 API: Reading ${type} from ${filePath}`);

    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    console.log(`✅ API: ${type} loaded successfully`);
    return NextResponse.json(data);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error(`❌ API Error loading ${type}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
