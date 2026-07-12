// This file contains loaders for Bible analysis data
// All loaders use the /api/analysis/[book]/[chapter]/[type] endpoint

// Map catalog/route slugs (mostly Spanish) → analysis dir slugs (English).
// Keep in sync with app/api/analysis/[book]/[chapter]/[type]/route.ts.
const ANALYSIS_BOOK_SLUGS: Record<string, string> = {
  genesis: 'genesis',
  exodo: 'exodus',
  levitico: 'leviticus',
  numeros: 'numbers',
  deuteronomio: 'deuteronomy',
  josue: 'joshua',
  jueces: 'judges',
  rut: 'ruth',
  salmos: 'psalms',
  proverbios: 'proverbs',
  eclesiastes: 'ecclesiastes',
  cantares: 'song-of-songs',
  isaias: 'isaiah',
  jeremias: 'jeremiah',
  lamentaciones: 'lamentations',
  ezequiel: 'ezekiel',
  daniel: 'daniel',
  jonas: 'jonah',
  mateo: 'matthew',
  marcos: 'mark',
  lucas: 'luke',
  juan: 'john',
  hechos: 'acts',
  romanos: 'romans',
};

export function resolveAnalysisSlug(catalogSlug: string): string {
  return ANALYSIS_BOOK_SLUGS[catalogSlug] ?? catalogSlug;
}

export type ContentTab = 'analysis' | 'context' | 'questions' | 'connections' | 'etymology';

export interface GenericManifest {
  generatedAt: string;
  chapters: Record<string, ContentTab[]>;
}

let manifestPromise: Promise<GenericManifest | null> | null = null;

export async function loadGenericManifest(): Promise<GenericManifest | null> {
  if (!manifestPromise) {
    manifestPromise = fetch('/data/bible/generic-manifest.json', { cache: 'force-cache' })
      .then((res) => (res.ok ? (res.json() as Promise<GenericManifest>) : null))
      .catch(() => null);
  }
  return manifestPromise;
}

export function isTabGeneric(
  manifest: GenericManifest | null,
  catalogSlug: string,
  chapter: number,
  tab: ContentTab
): boolean {
  if (!manifest) return false;
  const key = `${resolveAnalysisSlug(catalogSlug)}:${chapter}`;
  return manifest.chapters[key]?.includes(tab) ?? false;
}

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
