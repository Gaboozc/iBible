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

export async function loadAnalysis(bookSlug: string, chapterNum: number): Promise<StructuralAnalysis | null> {
  try {
    const response = await fetch(`/api/analysis/${bookSlug}/${chapterNum}/analysis`);
    if (!response.ok) {
      console.log(`📊 Analysis not found: ${bookSlug} ${chapterNum}`);
      return null;
    }
    const data = await response.json() as StructuralAnalysis;
    console.log(`✅ Analysis loaded: ${bookSlug} ${chapterNum}`);
    return data;
  } catch (error) {
    console.error('❌ Error loading analysis:', error);
    return null;
  }
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
  try {
    const response = await fetch(`/api/analysis/${bookSlug}/${chapterNum}/context`);
    if (!response.ok) {
      console.log(`📜 Context not found: ${bookSlug} ${chapterNum}`);
      return null;
    }
    const data = await response.json() as HistoricalContext;
    console.log(`✅ Context loaded: ${bookSlug} ${chapterNum}`);
    return data;
  } catch (error) {
    console.error('❌ Error loading context:', error);
    return null;
  }
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
  try {
    const response = await fetch(`/api/analysis/${bookSlug}/${chapterNum}/etymology`);
    if (!response.ok) {
      console.log(`🔤 Etymology not found: ${bookSlug} ${chapterNum}`);
      return null;
    }
    const data = await response.json() as KeyWord[];
    console.log(`✅ Etymology loaded: ${bookSlug} ${chapterNum} with ${data.length} words`);
    return data;
  } catch (error) {
    console.error('❌ Error loading etymology:', error);
    return null;
  }
}

export interface Connection {
  type: 'historical' | 'thematic' | 'prophetic' | 'typological' | 'lexical' | string;
  reference: string;
  title: string;
  description: string;
}

export async function loadConnections(bookSlug: string, chapterNum: number): Promise<Connection[] | null> {
  try {
    const response = await fetch(`/api/analysis/${bookSlug}/${chapterNum}/connections`);
    if (!response.ok) {
      console.log(`🔗 Connections not found: ${bookSlug} ${chapterNum}`);
      return null;
    }
    const data = await response.json() as Connection[];
    console.log(`✅ Connections loaded: ${bookSlug} ${chapterNum} with ${data.length} connections`);
    return data;
  } catch (error) {
    console.error('❌ Error loading connections:', error);
    return null;
  }
}

export interface ReflectionQuestion {
  stage: string;
  question: string;
  guidance: string;
}

export async function loadQuestions(bookSlug: string, chapterNum: number): Promise<ReflectionQuestion[] | null> {
  try {
    const response = await fetch(`/api/analysis/${bookSlug}/${chapterNum}/questions`);
    if (!response.ok) {
      console.log(`❓ Questions not found: ${bookSlug} ${chapterNum}`);
      return null;
    }
    const data = await response.json() as ReflectionQuestion[];
    console.log(`✅ Questions loaded: ${bookSlug} ${chapterNum} with ${data.length} questions`);
    return data;
  } catch (error) {
    console.error('❌ Error loading questions:', error);
    return null;
  }
}
