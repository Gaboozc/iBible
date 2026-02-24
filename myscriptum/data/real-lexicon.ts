// Real Biblical Lexicon from STEPBible.org
// License: Creative Commons Attribution 4.0 (CC BY 4.0)
// Source: https://github.com/STEPBible/STEPBible-Data

import 'server-only';
import fs from 'fs';
import path from 'path';

export interface RealLexiconEntry {
  strong: string;
  lemma: string;
  transliteration: string;
  gloss_en: string;
  gloss_es: string;
  type: string;
  language: 'hebrew' | 'greek';
}

export interface SearchIndex {
  [keyword: string]: string[];
}

// Cache for loaded data (server-side only)
let lexiconCache: RealLexiconEntry[] | null = null;
let searchIndexCache: SearchIndex | null = null;

function loadLexiconData(): RealLexiconEntry[] {
  if (lexiconCache) return lexiconCache;
  
  const dataPath = path.join(process.cwd(), 'public', 'data', 'real-lexicon.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  lexiconCache = JSON.parse(rawData);
  return lexiconCache!;
}

function loadSearchIndex(): SearchIndex {
  if (searchIndexCache) return searchIndexCache;
  
  const indexPath = path.join(process.cwd(), 'public', 'data', 'lexicon-search-index.json');
  const rawData = fs.readFileSync(indexPath, 'utf-8');
  searchIndexCache = JSON.parse(rawData);
  return searchIndexCache!;
}

export function searchLexicon(keyword: string): RealLexiconEntry[] {
  const lexicon = loadLexiconData();
  const searchIndex = loadSearchIndex();
  
  const normalized = keyword.toLowerCase().trim();
  const strongNumbers = searchIndex[normalized] || [];
  
  return strongNumbers
    .map(strong => lexicon.find(e => e.strong === strong))
    .filter((e): e is RealLexiconEntry => e != null);
}

export function getByStrongs(strongNumber: string): RealLexiconEntry | undefined {
  const lexicon = loadLexiconData();
  return lexicon.find(e => e.strong === strongNumber);
}
