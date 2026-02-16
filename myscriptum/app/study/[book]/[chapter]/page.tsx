'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BookOpen, ChevronLeft, Check, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { StudyTabs } from '@/components/Study/StudyTabs';
import { HistoricalContextTab } from '@/components/Study/HistoricalContextTab';
import { TextTab } from '@/components/Study/TextTab';
import { AnalysisTab } from '@/components/Study/AnalysisTab';
import { EtymologyTab } from '@/components/Study/EtymologyTab';
import { ConnectionsTab } from '@/components/Study/ConnectionsTab';
import { QuestionsTab } from '@/components/Study/QuestionsTab';
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

type TabId = 'context' | 'text' | 'analysis' | 'etymology' | 'connections' | 'questions';

export default function StudyPageDynamic() {
  const { mode, toggleTheme } = useTheme();
  const { bibleVersion, setBibleVersion, t } = useLanguage();
  const palette = getColors(mode);
  const params = useParams();
  const [activeTab, setActiveTab] = useState<TabId>('context');
  const [version, setVersion] = useState<BibleVersion>('rv1909');
  const [chapterText, setChapterText] = useState<ChapterText | null>(null);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [readChapters, setReadChapters] = useState<Set<string>>(new Set());
  const [book, setBook] = useState<BookEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  // Analysis data
  const [structuralAnalysis, setStructuralAnalysis] = useState<StructuralAnalysis | null>(null);
  const [contextData, setContextData] = useState<HistoricalContext | null>(null);
  const [etymologyWords, setEtymologyWords] = useState<KeyWord[] | null>(null);
  const [connectionsList, setConnectionsList] = useState<Connection[] | null>(null);
  const [questionsList, setQuestionsList] = useState<ReflectionQuestion[] | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const chapterNum = params?.chapter ? parseInt(params.chapter as string, 10) : 0;
  const bookSlug = params?.book ? (params.book as string) : '';

  // Sync local version state with bibleVersion from context
  useEffect(() => {
    setVersion(bibleVersion);
  }, [bibleVersion]);

  // Load book metadata and read status from localStorage
  useEffect(() => {
    const loadBookInfo = async () => {
      try {
        if (!bookSlug || !chapterNum) {
          setDebugInfo(`Invalid params: bookSlug="${bookSlug}", chapter=${chapterNum}`);
          setIsLoading(false);
          return;
        }

        const catalog = await fetchBibleCatalog();
        console.log('Catalog loaded, looking for book:', bookSlug);
        const allBooks = catalog.flatMap(t => t.books.map(b => ({ name: b.name, slug: b.slug, testament: t.name })));
        console.log('Available books:', allBooks);
        
        let foundBook: BookEntry | null = null;

        for (const testament of catalog) {
          const b = testament.books.find((b) => b.slug === bookSlug);
          if (b) {
            foundBook = b;
            break;
          }
        }

        console.log('Found book:', foundBook?.name || 'NOT FOUND');
        setBook(foundBook);
        setDebugInfo(`Looking for: ${bookSlug} ch ${chapterNum}. Found: ${foundBook?.name || 'NOT FOUND'}`);

        // Load read chapters from localStorage
        const saved = localStorage.getItem('readChapters');
        if (saved) {
          setReadChapters(new Set(JSON.parse(saved)));
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading book info:', error);
        setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    loadBookInfo();
  }, [bookSlug, chapterNum]);

  // Load chapter text when version changes
  useEffect(() => {
    let isActive = true;

    const loadText = async () => {
      setIsLoadingText(true);
      console.log('🔄 Loading text for:', { version: bibleVersion, bookSlug, chapterNum });
      const data = await loadChapterText(bibleVersion, bookSlug, chapterNum);
      console.log('✅ Text loaded:', { data });
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
      setIsLoadingAnalysis(true);
      console.log('📚 Loading analysis data for:', { bookSlug, chapterNum });
      
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
      setIsLoadingAnalysis(false);
      
      console.log('✅ All analysis data loaded:', {
        analysisLoaded: !!analysis,
        contextLoaded: !!context,
        etymologyCount: etymology?.length ?? 0,
        connectionsCount: connections?.length ?? 0,
        questionsCount: questions?.length ?? 0,
      });
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
    localStorage.setItem('readChapters', JSON.stringify(Array.from(newSet)));
  };

  const isChapterRead = book ? readChapters.has(`${book.id}:${chapterNum}`) : false;

  const textVerses = (chapterText?.verses ?? ezequiel1Data.verses).map((verse) => {
    const maybeTextOriginal = (verse as { textOriginal?: unknown }).textOriginal;
    const maybeAnalysis = (verse as { analysis?: unknown }).analysis;

    return {
      number: verse.number,
      text: verse.text,
      textOriginal: typeof maybeTextOriginal === 'string' ? maybeTextOriginal : undefined,
      analysis: maybeAnalysis,
    };
  });

  console.log('📖 Computed textVerses:', {
    chapterTextExists: !!chapterText,
    chapterTextVerses: chapterText?.verses.length ?? 0,
    usingFallback: !chapterText,
    finalVersesCount: textVerses.length,
  });

  console.log('🔍 Render check:', {
    activeTab,
    isLoadingText,
    textVersesLength: textVerses.length,
    willShowLoadingUI: isLoadingText,
    willShowNoContentUI: !isLoadingText && textVerses.length === 0,
    willShowTextTab: !isLoadingText && textVerses.length > 0,
  });

  const versionLabel =
    version === 'rv1909' ? 'Reina-Valera 1909' : version === 'kjv' ? 'KJV (English)' : 'Unknown';

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
          {debugInfo && <p className="text-xs text-slate-600 mt-2">{debugInfo}</p>}
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
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/library"
              className="flex items-center gap-2 transition"
              style={{ color: palette.text.light }}
            >
              <ChevronLeft className="h-5 w-5" />
              <span>{t('study.back')}</span>
            </Link>

            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold" style={{ color: palette.text.light }}>
                {book.name} {chapterNum}
              </h1>
              <p className="text-sm opacity-75" style={{ color: palette.text.light }}>{versionLabel}</p>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={toggleReadChapter}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition"
                style={{
                  borderColor: palette.accent.primary,
                  backgroundColor: isChapterRead ? palette.accent.secondary : 'transparent',
                  color: palette.text.light,
                }}
              >
                {isChapterRead && <Check className="h-4 w-4" />}
                <span className="text-sm font-medium">{isChapterRead ? t('library.read') : t('study.markRead')}</span>
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition"
                style={{ backgroundColor: palette.accent.secondary, color: palette.text.light }}
                title={mode === 'light' ? t('theme.darkMode') : t('theme.lightMode')}
              >
                {mode === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Version Selector */}
          <div className="flex gap-2 mt-4 justify-center">
            <button
              onClick={() => setBibleVersion('rv1909')}
              className="px-4 py-2 rounded-lg border transition"
              style={{
                borderColor: palette.accent.primary,
                backgroundColor: bibleVersion === 'rv1909' ? palette.accent.secondary : 'transparent',
                color: bibleVersion === 'rv1909' ? palette.text.light : palette.accent.primary,
              }}
            >
              {t('study.version.rv1909')}
            </button>
            <button
              onClick={() => setBibleVersion('kjv')}
              className="px-4 py-2 rounded-lg border transition"
              style={{
                borderColor: palette.accent.primary,
                backgroundColor: bibleVersion === 'kjv' ? palette.accent.secondary : 'transparent',
                color: bibleVersion === 'kjv' ? palette.text.light : palette.accent.primary,
              }}
            >
              {t('study.version.kjv')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: palette.bg.secondary, borderTop: `4px solid ${palette.accent.primary}` }}>
          <StudyTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {/* Tab Content - FUERA del StudyTabs */}
          <div className={activeTab === 'context' ? 'p-6' : 'hidden'}>
            <HistoricalContextTab isActive={activeTab === 'context'} context={contextData || undefined} />
          </div>

          <div className={activeTab === 'text' ? 'p-6' : 'hidden'}>
            {isLoadingText ? (
              <div className="py-12 text-center" style={{ color: palette.text.secondary }}>
                <p className="text-lg font-semibold">{t('study.loading')}</p>
                <p className="text-sm mt-2">Versión: {version} | Libro: {bookSlug} | Capítulo: {chapterNum}</p>
              </div>
            ) : textVerses.length === 0 ? (
              <div className="py-12 text-center" style={{ color: palette.text.secondary }}>
                <p className="text-lg font-semibold">Sin contenido</p>
                <p className="text-sm mt-2">No hay versículos disponibles para este capítulo</p>
              </div>
            ) : (
              <TextTab
                isActive={activeTab === 'text'}
                verses={textVerses}
                translationLabel={versionLabel}
                isLoading={false}
              />
            )}
          </div>

          <div className={activeTab === 'analysis' ? 'p-6' : 'hidden'}>
            <AnalysisTab isActive={activeTab === 'analysis'} structuralAnalysis={structuralAnalysis || undefined} />
          </div>

          <div className={activeTab === 'etymology' ? 'p-6' : 'hidden'}>
            <EtymologyTab isActive={activeTab === 'etymology'} keyWords={etymologyWords || undefined} />
          </div>

          <div className={activeTab === 'connections' ? 'p-6' : 'hidden'}>
            <ConnectionsTab isActive={activeTab === 'connections'} connections={connectionsList || undefined} />
          </div>

          <div className={activeTab === 'questions' ? 'p-6' : 'hidden'}>
            <QuestionsTab isActive={activeTab === 'questions'} questions={questionsList || undefined} />
          </div>
        </div>
      </main>
    </div>
  );
}
