'use server';

import { searchLexicon, type RealLexiconEntry } from '@/data/real-lexicon';

export async function searchLexiconAction(keyword: string): Promise<RealLexiconEntry[]> {
  if (!keyword || keyword.trim().length < 2) {
    return [];
  }
  
  const results = searchLexicon(keyword);
  return results.slice(0, 50); // Limit to 50 results
}
