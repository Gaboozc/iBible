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
    
    console.log('📡 Loader: Fetching from', jsonUrl);
    
    const response = await fetch(jsonUrl, { 
      cache: 'force-cache' // Cache Bible data since it never changes
    });
    console.log('📡 Loader: Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error(`❌ Loader: Failed to load chapter - ${response.status} ${response.statusText}`);
      return null;
    }

    const data = (await response.json()) as ChapterText;
    console.log('📡 Loader: Successfully parsed JSON', { 
      version: data.version, 
      book: data.book, 
      chapter: data.chapter, 
      versesCount: data.verses?.length 
    });

    if (!data || !Array.isArray(data.verses)) {
      console.error('❌ Loader: Invalid chapter data structure:', data);
      return null;
    }

    console.log('✅ Loader: Chapter loaded successfully with', data.verses.length, 'verses');
    return data;
  } catch (error) {
    console.error('❌ Loader: Exception while loading chapter:', error);
    return null;
  }
}
