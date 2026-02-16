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
    const apiUrl = `/api/chapter/${version}/${bookSlug}/${chapterNumber}`;
    console.log('📡 Loader: Fetching from', apiUrl);
    
    const response = await fetch(apiUrl);
    console.log('📡 Loader: Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Loader: Failed to load chapter - ${response.status} ${response.statusText}`, errorText);
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
