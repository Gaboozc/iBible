import { NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import { readFileSync, existsSync } from 'node:fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ version: string; book: string; chapter: string }> }
) {
  try {
    const resolvedParams = await params;
    const { version, book, chapter } = resolvedParams;

    console.log('API: Received params:', { version, book, chapter });

    // Validate inputs
    if (!version || !book || !chapter) {
      console.error('API: Missing parameters', { version, book, chapter });
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (!['rv1909', 'kjv'].includes(version)) {
      console.error('API: Invalid version:', version);
      return NextResponse.json({ error: 'Invalid version' }, { status: 400 });
    }

    const chapterNum = parseInt(chapter, 10);
    if (isNaN(chapterNum) || chapterNum < 1) {
      console.error('API: Invalid chapter number:', chapter);
      return NextResponse.json({ error: 'Invalid chapter number' }, { status: 400 });
    }

    // Read the JSON file
    const filePath = path.join(
      process.cwd(),
      'data',
      'bible',
      version,
      book,
      `${chapterNum}.json`
    );

    console.log('API: Loading chapter from:', filePath);

    if (!existsSync(filePath)) {
      console.error('API: File not found:', filePath);
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    console.log('API: Returning chapter with', data.verses.length, 'verses');
    return NextResponse.json(data);
  } catch (error) {
    console.error('API: Error -', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
