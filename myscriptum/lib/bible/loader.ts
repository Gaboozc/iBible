import { resolveBookDir } from './book-dir-map';

export type BibleVersion = 'rv1909' | 'kjv';

export interface VerseText {
  number: number;
  text: string;
}

export interface ChapterText {
  version: BibleVersion;
  book: string;
  chapter: number;
  verses: VerseText[];
}

export async function loadChapterText(
  version: BibleVersion,
  bookSlug: string,
  chapterNumber: number
): Promise<ChapterText | null> {
  try {
    // Build direct URL to JSON file in public directory
    const bookDirectory = resolveBookDir(version, bookSlug);
    const jsonUrl = `/data/bible/${version}/${bookDirectory}/${chapterNumber}.json`;

    const response = await fetch(jsonUrl, {
      cache: 'force-cache',
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as ChapterText;

    if (!data || !Array.isArray(data.verses)) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}
