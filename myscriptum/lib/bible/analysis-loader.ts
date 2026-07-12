// This file contains loaders for Bible analysis data
// All loaders use the /api/analysis/[book]/[chapter]/[type] endpoint

export interface StructuralSection {
  verses: string;
  title: string;
  description: string;
  significance: string;
}

export interface RepeatedWord {
  word: string;
  count: number;
  significance: string;
}

export interface StructuralAnalysis {
  title: string;
  sections: StructuralSection[];
  repeatedWords: RepeatedWord[];
}

async function fetchAnalysisJson<T>(bookSlug: string, chapterNum: number, type: string): Promise<T | null> {
  try {
    const response = await fetch(`/api/analysis/${bookSlug}/${chapterNum}/${type}`);
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function loadAnalysis(bookSlug: string, chapterNum: number): Promise<StructuralAnalysis | null> {
  return fetchAnalysisJson<StructuralAnalysis>(bookSlug, chapterNum, 'analysis');
}

export interface HistoricalContext {
  period: string;
  dominantEmpire: string;
  kingName: string;
  kingRegion: string;
  activeProphets: string[];
  templeStatus: string;
  location: string;
  summary: string;
  spiritualContext: string;
}

export async function loadContext(bookSlug: string, chapterNum: number): Promise<HistoricalContext | null> {
  return fetchAnalysisJson<HistoricalContext>(bookSlug, chapterNum, 'context');
}

export interface KeyWord {
  hebrew: string;
  english: string;
  literalMeaning: string;
  primaryMeaning: string;
  theologicalMeaning: string;
  root: string;
  cognates: string[];
  semanticEvolution: string;
  relatedWords: string[];
  keyAppearances: string[];
  biblicalFrequency: number;
}

export async function loadEtymology(bookSlug: string, chapterNum: number): Promise<KeyWord[] | null> {
  return fetchAnalysisJson<KeyWord[]>(bookSlug, chapterNum, 'etymology');
}

export interface Connection {
  type: 'historical' | 'thematic' | 'prophetic' | 'typological' | 'lexical' | string;
  reference: string;
  title: string;
  description: string;
}

export async function loadConnections(bookSlug: string, chapterNum: number): Promise<Connection[] | null> {
  return fetchAnalysisJson<Connection[]>(bookSlug, chapterNum, 'connections');
}

export interface ReflectionQuestion {
  stage: string;
  question: string;
  guidance: string;
}

export async function loadQuestions(bookSlug: string, chapterNum: number): Promise<ReflectionQuestion[] | null> {
  return fetchAnalysisJson<ReflectionQuestion[]>(bookSlug, chapterNum, 'questions');
}
