// Tipos básicos para MyScriptum

export type SubscriptionTier = 'FREE' | 'PRO' | 'TEAM'

export type Language = 'es' | 'en'

export type StudyStage = 'observation' | 'interpretation' | 'implication'

export type ConnectionType = 'historical' | 'thematic' | 'prophetic' | 'typological' | 'lexical'

export type ChapterStatus = 'not_started' | 'in_progress' | 'completed'

export type DepthLevel = 'basic' | 'intermediate' | 'advanced'

// Interfaces de datos

export interface Testament {
  id: string
  name: string
  nameEn: string
  slug: string
  order: number
  books?: Book[]
}

export interface Book {
  id: string
  testamentId: string
  name: string
  nameEn: string
  slug: string
  abbreviation: string
  order: number
  authorTraditional?: string
  dateApproximate?: string
  literaryGenre?: string
  literaryGenreEn?: string
  originalAudience?: string
  originalAudienceEn?: string
  centralTheme?: string
  centralThemeEn?: string
  historicalLocation?: string
  historicalLocationEn?: string
  chapters?: Chapter[]
}

export interface Chapter {
  id: string
  bookId: string
  number: number
  slug: string
  historicalPeriod?: string
  historicalPeriodEn?: string
  relatedEvents?: string
  relatedEventsEn?: string
  keyCharacters?: string // JSON array
  theologicalIntensity?: string
  theologicalIntensityEn?: string
  literaryStructure?: string
  literaryStructureEn?: string
  contextualNotes?: string
  contextualNotesEn?: string
  verses?: Verse[]
  historicalContext?: ChapterHistoricalContext
  reflectionQuestions?: ReflectionQuestion[]
}

export interface Verse {
  id: string
  chapterId: string
  number: number
  text: string
  textEn?: string
  textOriginal?: string
  language?: 'hebrew' | 'aramaic' | 'greek'
  keyWords?: string // JSON array
  etymologies?: Etymology[]
  crossReferences?: CrossReference[]
}

export interface ChapterHistoricalContext {
  id: string
  chapterId: string
  dominantEmpire?: string
  dominantEmpireEn?: string
  kingName?: string
  kingNameEn?: string
  kingRegion?: string
  kingRegionEn?: string
  activeProphets?: string // JSON array
  activeProphetsEn?: string
  templeStatus?: string
  templeStatusEn?: string
  politicalSituation?: string
  politicalSituationEn?: string
  spiritualState?: string
  spiritualStateEn?: string
  militaryEvents?: string // JSON array
  militaryEventsEn?: string
}

export interface Etymology {
  id: string
  verseId: string
  word: string
  wordEn?: string
  language: 'hebrew' | 'aramaic' | 'greek'
  transliteration: string
  literalMeaning: string
  literalMeaningEn?: string
  primaryMeaning: string
  primaryMeaningEn?: string
  theologicalMeaning?: string
  theologicalMeaningEn?: string
  semiticRoot?: string
  semanticField?: string // JSON
  cognates?: string // JSON
  cognatesEn?: string
  biblicalFrequency?: number
  notableOccurrences?: string // JSON array
  semanticEvolution?: string
  semanticEvolutionEn?: string
}

export interface CrossReference {
  id: string
  verseId: string
  referencedVerseId?: string
  referencedBibleRef?: string
  connectionType: ConnectionType
  description?: string
  descriptionEn?: string
}

export interface ReflectionQuestion {
  id: string
  chapterId: string
  stage: StudyStage
  stageLabel: string
  stageLabelEn?: string
  question: string
  questionEn?: string
  guidance?: string
  guidanceEn?: string
  order: number
}

export interface User {
  id: string
  email: string
  name?: string
  language: Language
  subscriptionTier: SubscriptionTier
  subscriptionStart?: Date
  subscriptionEnd?: Date
  depthLevelPreference: DepthLevel
  booksInStudy: string // JSON array
  readingPace: string
}

export interface ChapterProgress {
  id: string
  userId: string
  chapterId: string
  status: ChapterStatus
  sectionIntroductionCompleted: boolean
  sectionReadingCompleted: boolean
  sectionAnalysisCompleted: boolean
  sectionEtymologyCompleted: boolean
  sectionConnectionsCompleted: boolean
  sectionReflectionCompleted: boolean
  timeSpentMinutes: number
  startedAt?: Date
  completedAt?: Date
}
