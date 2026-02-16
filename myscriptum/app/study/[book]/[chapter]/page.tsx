'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BookOpen, ChevronLeft, Check } from 'lucide-react';
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

type TabId = 'context' | 'text' | 'analysis' | 'etymology' | 'connections' | 'questions';

export default function StudyPageDynamic() {
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
      console.log('🔄 Loading text for:', { version, bookSlug, chapterNum });
      const data = await loadChapterText(version, bookSlug, chapterNum);
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
  }, [version, bookSlug, chapterNum, isLoading]);

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
        <div className="text-slate-300">Cargando capítulo...</div>
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
    <div style={{ backgroundColor: '#F2E9D4' }} className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: '#3D2644', borderColor: '#B08D57' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/library"
              className="flex items-center gap-2 transition"
              style={{ color: '#F2E9D4' }}
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Volver</span>
            </Link>

            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold" style={{ color: '#F2E9D4' }}>
                {book.name} {chapterNum}
              </h1>
              <p className="text-sm opacity-75" style={{ color: '#F2E9D4' }}>{versionLabel}</p>
            </div>

            <button
              onClick={toggleReadChapter}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition"
              style={{
                borderColor: '#B08D57',
                backgroundColor: isChapterRead ? '#4A908F' : 'transparent',
                color: isChapterRead ? '#F2E9D4' : '#F2E9D4',
              }}
            >
              {isChapterRead && <Check className="h-4 w-4" />}
              <span className="text-sm font-medium">{isChapterRead ? 'Leído' : 'Marcar leído'}</span>
            </button>
          </div>

          {/* Version Selector */}
          <div className="flex gap-2 mt-4 justify-center">
            <button
              onClick={() => setVersion('rv1909')}
              className="px-4 py-2 rounded-lg border transition"
              style={{
                borderColor: '#B08D57',
                backgroundColor: version === 'rv1909' ? '#4A908F' : 'transparent',
                color: version === 'rv1909' ? '#F2E9D4' : '#B08D57',
              }}
            >
              RV1909
            </button>
            <button
              onClick={() => setVersion('kjv')}
              className="px-4 py-2 rounded-lg border transition"
              style={{
                borderColor: '#B08D57',
                backgroundColor: version === 'kjv' ? '#4A908F' : 'transparent',
                color: version === 'kjv' ? '#F2E9D4' : '#B08D57',
              }}
            >
              KJV
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderTop: `4px solid #B08D57` }}>
          <StudyTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {/* Tab Content - FUERA del StudyTabs */}
          <div className={activeTab === 'context' ? 'p-6' : 'hidden'}>
            <HistoricalContextTab isActive={activeTab === 'context'} context={contextData || undefined} />
          </div>

          <div className={activeTab === 'text' ? 'p-6' : 'hidden'}>
            {isLoadingText ? (
              <div className="py-12 text-center" style={{ color: '#3D2644' }}>
                <p className="text-lg font-semibold">Cargando capítulo...</p>
                <p className="text-sm mt-2">Versión: {version} | Libro: {bookSlug} | Capítulo: {chapterNum}</p>
              </div>
            ) : textVerses.length === 0 ? (
              <div className="py-12 text-center" style={{ color: '#3D2644' }}>
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
