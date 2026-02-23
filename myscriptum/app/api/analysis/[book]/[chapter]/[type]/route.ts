import { NextResponse } from 'next/server';

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

export async function GET(request: Request, { params }: { params: Promise<RouteParams> }) {
  const resolvedParams = await params;
  const { book, chapter, type } = resolvedParams;

  try {
    const chapterNum = parseInt(chapter, 10);
    
    if (!book || !type || isNaN(chapterNum) || chapterNum < 1) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const resolvedBook = ANALYSIS_BOOK_SLUGS[book] ?? book;
    
    // Fetch from public directory instead of using readFileSync
    const origin = new URL(request.url).origin;
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : origin;
    const jsonUrl = `${baseUrl}/data/bible/${type}/${resolvedBook}/${chapterNum}.json`;

    console.log(`📁 API: Fetching ${type} from ${jsonUrl}`);

    const response = await fetch(jsonUrl, { cache: 'force-cache' });
    
    if (!response.ok) {
      console.log(`❌ API: Not found: ${jsonUrl}`);
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const data = await response.json();

    console.log(`✅ API: ${type} loaded successfully`);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`❌ API Error loading ${type}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
