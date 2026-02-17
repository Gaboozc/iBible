import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { NextResponse } from 'next/server';
import { generateBibleCatalog } from '@/lib/bible/catalog-generator';
import { resolveBookDir } from '@/lib/bible/book-dir-map';

export const dynamic = 'force-dynamic';

const MAX_ATTEMPTS = 8;

type VerseResponse = {
  bookSlug: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  version: 'rv1909' | 'kjv';
};

const randomItem = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

const sanitizeVerseText = (text: string) => {
  const withoutWordMarkup = text.replace(
    /\\\+?w\s+([^\\|]+?)(?:\|[^\\]*)?\\\+?w\*/g,
    (_, word) => String(word).trim().split(' ')[0]
  );
  const withoutAddMarkup = withoutWordMarkup.replace(
    /\\\+?add\s+([^\\]+?)\\\+?add\*/g,
    (_, value) => String(value).trim()
  );
  return withoutAddMarkup
    .replace(/\\[a-zA-Z0-9+*]+/g, '')
    .replace(/[*¶]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const versionParam = url.searchParams.get('version');
  const version = versionParam === 'kjv' ? 'kjv' : 'rv1909';

  const bibleRoot = path.join(process.cwd(), 'data', 'bible');
  const catalog = generateBibleCatalog(bibleRoot) as Array<{
    books: Array<{
      id: string;
      name: string;
      chapters: Array<{ number: number }>;
    }>;
  }>;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const book = randomItem(catalog.flatMap((entry) => entry.books));
    const chapter = randomItem(book.chapters).number;
    const directory = resolveBookDir(version, book.id);
    const filePath = path.join(bibleRoot, version, directory, `${chapter}.json`);

    if (!existsSync(filePath)) {
      continue;
    }

    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent) as { verses?: Array<{ number: number; text: string }> };
    if (!data.verses || data.verses.length === 0) {
      continue;
    }

    const verse = randomItem(data.verses);
    const payload: VerseResponse = {
      bookSlug: book.id,
      bookName: book.name,
      chapter,
      verse: verse.number,
      text: sanitizeVerseText(verse.text),
      version,
    };

    return NextResponse.json(payload);
  }

  return NextResponse.json({ error: 'Verse not available' }, { status: 503 });
}
