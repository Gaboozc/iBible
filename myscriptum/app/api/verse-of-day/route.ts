import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type VerseResponse = {
  bookSlug: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  version: 'rv1909' | 'kjv';
};

const randomItem = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const versionParam = url.searchParams.get('version');
    const version = versionParam === 'kjv' ? 'kjv' : 'rv1909';

    // Fetch featured verses from static JSON (no dynamic readFileSync)
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    const jsonUrl = `${baseUrl}/data/featured-verses.json`;
    
    const response = await fetch(jsonUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to load featured verses');
    }
    
    const allVerses = (await response.json()) as VerseResponse[];
    const versesForVersion = allVerses.filter(v => v.version === version);
    
    if (versesForVersion.length === 0) {
      throw new Error('No verses found for version');
    }

    const selectedVerse = randomItem(versesForVersion);
    return NextResponse.json(selectedVerse);
  } catch (error) {
    console.error('verse-of-day error:', error);
    return NextResponse.json(
      { error: 'Failed to load verse of the day' },
      { status: 500 }
    );
  }
}