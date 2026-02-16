import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

interface RouteParams {
  book: string;
  chapter: string;
  type: string;
}

export async function GET(request: Request, { params }: { params: Promise<RouteParams> }) {
  const resolvedParams = await params;
  const { book, chapter, type } = resolvedParams;

  try {
    const chapterNum = parseInt(chapter, 10);
    
    if (!book || !type || isNaN(chapterNum) || chapterNum < 1) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'data', 'bible', type, book, `${chapterNum}.json`);

    console.log(`📁 API: Loading ${type} for ${book} ${chapterNum}`);

    if (!existsSync(filePath)) {
      console.log(`❌ API: File not found: ${filePath}`);
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    console.log(`✅ API: ${type} loaded successfully`);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`❌ API Error loading ${type}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
