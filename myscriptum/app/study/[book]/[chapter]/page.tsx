'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChevronLeft, Check, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { StudyTabs } from '@/components/Study/StudyTabs';
import { HistoricalContextTab } from '@/components/Study/HistoricalContextTab';
import { TextTab } from '@/components/Study/TextTab';
import { AnalysisTab } from '@/components/Study/AnalysisTab';
import { EtymologyTab } from '@/components/Study/EtymologyTab';
import { ConnectionsTab } from '@/components/Study/ConnectionsTab';
import { QuestionsTab } from '@/components/Study/QuestionsTab';
import { ChapterNavDropdown } from '@/components/Study/ChapterNavDropdown';
import { ezequiel1Data } from '@/data/ezequiel1';
import { loadChapterText, BibleVersion, ChapterText } from '@/lib/bible/loader';
import { 
  loadAnalysis, 
  loadContext, 
  loadEtymology, 
  loadConnections, 
  loadQuestions,
  type StructuralAnalysis,
  type HistoricalContext,
  type KeyWord,
  type Connection,
  type ReflectionQuestion 
} from '@/lib/bible/analysis-loader';
import { fetchBibleCatalog } from '@/app/actions/catalog';
import type { BookEntry } from '@/data/bibleCatalog';
import { useTheme, getColors } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import {
  getChapterNote,
  getReadChapters,
  getReflectionAnswers,
  setChapterNote,
  setReadChapters as persistReadChapters,
  setReflectionAnswer,
  setLastViewedChapter,
} from '@/lib/storage/localStore';

type TabId = 'context' | 'text' | 'analysis' | 'etymology' | 'connections' | 'questions';

export default function StudyPageDynamic() {
  const { mode, toggleTheme } = useTheme();
  const { bibleVersion, setBibleVersion, t } = useLanguage();
  const palette = getColors(mode);
  const params = useParams();
  const [activeTab, setActiveTab] = useState<TabId>('context');
  const [chapterText, setChapterText] = useState<ChapterText | null>(null);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [readChapters, setReadChapters] = useState<Set<string>>(new Set());
  const [book, setBook] = useState<BookEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Analysis data
  const [structuralAnalysis, setStructuralAnalysis] = useState<StructuralAnalysis | null>(null);
  const [contextData, setContextData] = useState<HistoricalContext | null>(null);
  const [etymologyWords, setEtymologyWords] = useState<KeyWord[] | null>(null);
  const [connectionsList, setConnectionsList] = useState<Connection[] | null>(null);
  const [questionsList, setQuestionsList] = useState<ReflectionQuestion[] | null>(null);
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<number, string>>({});
  const [chapterNote, setChapterNoteState] = useState('');

  const chapterNum = params?.chapter ? parseInt(params.chapter as string, 10) : 0;
  const bookSlug = params?.book ? (params.book as string) : '';
  const chapterKey = `${bookSlug}:${chapterNum}`;

  // Load book metadata and read status from localStorage
  useEffect(() => {
    const loadBookInfo = async () => {
      try {
        if (!bookSlug || !chapterNum) {
          setIsLoading(false);
          return;
        }

        const catalog = await fetchBibleCatalog();

        let foundBook: BookEntry | null = null;
        for (const testament of catalog) {
          const b = testament.books.find((b) => b.slug === bookSlug);
          if (b) {
            foundBook = b;
            break;
          }
        }

        setBook(foundBook);
        setReadChapters(getReadChapters());
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };

    loadBookInfo();
  }, [bookSlug, chapterNum]);

  // Track the last viewed chapter
  useEffect(() => {
    if (bookSlug && chapterNum > 0) {
      setLastViewedChapter(`${bookSlug}:${chapterNum}`);
    }
  }, [bookSlug, chapterNum]);

  useEffect(() => {
    if (!isLoading && bookSlug && chapterNum > 0) {
      setReflectionAnswers(getReflectionAnswers(chapterKey));
      setChapterNoteState(getChapterNote(chapterKey));
    }
  }, [bookSlug, chapterKey, chapterNum, isLoading]);

  // Load chapter text when version changes
  useEffect(() => {
    let isActive = true;

    const loadText = async () => {
      setIsLoadingText(true);
      const data = await loadChapterText(bibleVersion, bookSlug, chapterNum);
      if (isActive) {
        setChapterText(data);
        setIsLoadingText(false);
      }
    };

    if (!isLoading) {
      loadText();
    }

    return () => {
      isActive = false;
    };
  }, [bibleVersion, bookSlug, chapterNum, isLoading]);

  // Load analysis data (context, analysis, etymology, connections, questions)
  useEffect(() => {
    const loadAnalysisData = async () => {
      const [analysis, context, etymology, connections, questions] = await Promise.all([
        loadAnalysis(bookSlug, chapterNum),
        loadContext(bookSlug, chapterNum),
        loadEtymology(bookSlug, chapterNum),
        loadConnections(bookSlug, chapterNum),
        loadQuestions(bookSlug, chapterNum),
      ]);

      setStructuralAnalysis(analysis);
      setContextData(context);
      setEtymologyWords(etymology);
      setConnectionsList(connections);
      setQuestionsList(questions);
    };

    if (!isLoading && bookSlug && chapterNum > 0) {
      loadAnalysisData();
    }
  }, [bookSlug, chapterNum, isLoading]);

  const toggleReadChapter = () => {
    if (!book) return;
    const key = `${book.id}:${chapterNum}`;
    const newSet = new Set(readChapters);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setReadChapters(newSet);
    persistReadChapters(newSet);
  };

  const isChapterRead = book ? readChapters.has(`${book.id}:${chapterNum}`) : false;

  const textVerses = (chapterText?.verses ?? ezequiel1Data.verses).map((verse) => {
    const maybeTextOriginal = (verse as { textOriginal?: unknown }).textOriginal;
    const maybeAnalysis = (verse as { analysis?: unknown }).analysis;

    return {
      number: verse.number,
      text: verse.text,
      textOriginal: typeof maybeTextOriginal === 'string' ? maybeTextOriginal : undefined,
      analysis: typeof maybeAnalysis === 'string' ? maybeAnalysis : '',
    };
  });

  const versionLabel =
    bibleVersion === 'rv1909' ? 'Reina-Valera 1909' : bibleVersion === 'kjv' ? 'KJV (English)' : 'Unknown';

  const handleReflectionChange = (index: number, value: string) => {
    setReflectionAnswers((prev) => ({ ...prev, [index]: value }));
    setReflectionAnswer(chapterKey, index, value);
  };

  const handleNoteChange = (value: string) => {
    setChapterNoteState(value);
    setChapterNote(chapterKey, value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-slate-300">{t('study.loading')}</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="text-slate-300 text-center">
          <p className="text-lg font-semibold mb-2">Libro no encontrado</p>
          <p className="text-sm text-slate-500">Slug: {bookSlug}</p>
          <p className="text-sm text-slate-500">Capítulo: {chapterNum}</p>
        </div>
        <Link
          href="/library"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Volver a la biblioteca
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: palette.bg.primary }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: palette.bg.header, borderColor: palette.accent.primary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <Link
              href="/library"
              className="flex items-center gap-2 transition text-xs sm:text-sm"
              style={{ color: palette.text.light }}
            >
              <ChevronLeft className="h-5 w-5" />
              <span>{t('study.back')}</span>
            </Link>

            <div className="flex-1 text-center">
              <h1 className="text-xl sm:text-2xl font-bold" style={{ color: palette.text.light }}>
                {book.name} {chapterNum}
              </h1>
              <p className="text-xs sm:text-sm opacity-75" style={{ color: palette.text.light }}>{versionLabel}</p>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-end gap-2 items-center">
              {/* Chapter Navigation Dropdown */}
              <ChapterNavDropdown currentBook={bookSlug} currentChapter={chapterNum} palette={palette} />

              {/* Language buttons */}
              <div className="flex gap-1 border-r pr-2 sm:pr-3 text-xs" style={{ borderColor: palette.accent.primary }}>
                <button
                  onClick={() => setBibleVersion('rv1909')}
                  className="px-2 sm:px-3 py-1 rounded-lg border transition text-xs font-medium whitespace-nowrap"
                  style={{
                    borderColor: palette.accent.primary,
                    backgroundColor: bibleVersion === 'rv1909' ? palette.accent.secondary : 'transparent',
                    color: bibleVersion === 'rv1909' ? palette.text.light : palette.accent.primary,
                  }}
                >
                  <span className="sm:hidden">ES</span>
                  <span className="hidden sm:inline">Español</span>
                </button>
                <button
                  onClick={() => setBibleVersion('kjv')}
                  className="px-2 sm:px-3 py-1 rounded-lg border transition text-xs font-medium whitespace-nowrap"
                  style={{
                    borderColor: palette.accent.primary,
                    backgroundColor: bibleVersion === 'kjv' ? palette.accent.secondary : 'transparent',
                    color: bibleVersion === 'kjv' ? palette.text.light : palette.accent.primary,
                  }}
                >
                  <span className="sm:hidden">EN</span>
                  <span className="hidden sm:inline">English</span>
                </button>
              </div>
              
              <button
                onClick={toggleReadChapter}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition text-xs sm:text-sm"
                style={{
                  borderColor: palette.accent.primary,
                  backgroundColor: isChapterRead ? palette.accent.secondary : 'transparent',
                  color: palette.text.light,
                }}
              >
                {isChapterRead && <Check className="h-4 w-4" />}
                <span className="font-medium whitespace-nowrap">{isChapterRead ? t('library.read') : t('study.markRead')}</span>
              </button>
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-lg transition"
                style={{ backgroundColor: palette.accent.secondary, color: palette.text.light }}
                title={mode === 'light' ? t('theme.darkMode') : t('theme.lightMode')}
              >
                {mode === 'light' ? <Moon className="h-4 w-4 sm:h-5 sm:w-5" /> : <Sun className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: palette.bg.secondary, borderTop: `4px solid ${palette.accent.primary}` }}>
          <StudyTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {/* Tab Content - FUERA del StudyTabs */}
          <div className={activeTab === 'context' ? 'p-4 sm:p-6' : 'hidden'}>
            <HistoricalContextTab context={contextData || undefined} />
          </div>

          <div className={activeTab === 'text' ? 'p-4 sm:p-6' : 'hidden'}>
            {isLoadingText ? (
              <div className="py-12 text-center" style={{ color: palette.text.secondary }}>
                <p className="text-lg font-semibold">{t('study.loading')}</p>
                <p className="text-sm mt-2">Versión: {bibleVersion} | Libro: {bookSlug} | Capítulo: {chapterNum}</p>
              </div>
            ) : textVerses.length === 0 ? (
              <div className="py-12 text-center" style={{ color: palette.text.secondary }}>
                <p className="text-lg font-semibold">Sin contenido</p>
                <p className="text-sm mt-2">No hay versículos disponibles para este capítulo</p>
              </div>
            ) : (
              <TextTab
                verses={textVerses}
                translationLabel={versionLabel}
                isLoading={false}
                note={chapterNote}
                onNoteChange={handleNoteChange}
              />
            )}
          </div>

          <div className={activeTab === 'analysis' ? 'p-4 sm:p-6' : 'hidden'}>
            <AnalysisTab structuralAnalysis={structuralAnalysis || undefined} />
          </div>

          <div className={activeTab === 'etymology' ? 'p-4 sm:p-6' : 'hidden'}>
            <EtymologyTab keyWords={etymologyWords || undefined} />
          </div>

          <div className={activeTab === 'connections' ? 'p-4 sm:p-6' : 'hidden'}>
            <ConnectionsTab
              connections={connectionsList || undefined}
              currentBook={book?.name || bookSlug}
              currentChapter={chapterNum}
            />
          </div>

          <div className={activeTab === 'questions' ? 'p-4 sm:p-6' : 'hidden'}>
            <QuestionsTab
              questions={questionsList || undefined}
              answers={reflectionAnswers}
              onAnswerChange={handleReflectionChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
