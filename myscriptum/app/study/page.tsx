'use client';

import { useEffect, useState } from 'react';
import { BookOpen, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { StudyTabs } from '@/components/Study/StudyTabs';
import { HistoricalContextTab } from '@/components/Study/HistoricalContextTab';
import { TextTab } from '@/components/Study/TextTab';
import { AnalysisTab } from '@/components/Study/AnalysisTab';
import { EtymologyTab } from '@/components/Study/EtymologyTab';
import { LexiconTab } from '@/components/Study/LexiconTab';
import { ConnectionsTab } from '@/components/Study/ConnectionsTab';
import { QuestionsTab } from '@/components/Study/QuestionsTab';
import { ezequiel1Data } from '@/data/ezequiel1';
import { loadChapterText, BibleVersion, ChapterText } from '@/lib/bible/loader';

type TabId = 'context' | 'text' | 'analysis' | 'etymology' | 'lexicon' | 'connections' | 'questions';

export default function StudyPage() {
  const [activeTab, setActiveTab] = useState<TabId>('context');
  const [version, setVersion] = useState<BibleVersion>('rv1909');
  const [chapterText, setChapterText] = useState<ChapterText | null>(null);
  const [isLoadingText, setIsLoadingText] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadText = async () => {
      setIsLoadingText(true);
      const data = await loadChapterText(version, 'ezequiel', 1);
      if (isActive) {
        setChapterText(data);
        setIsLoadingText(false);
      }
    };

    loadText();

    return () => {
      isActive = false;
    };
  }, [version]);

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

  const translationLabel = version === 'rv1909' ? 'Reina-Valera 1909' : 'KJV (English)';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'context':
        return <HistoricalContextTab context={ezequiel1Data.historicalContext} />;
      case 'text':
        return <TextTab verses={textVerses} translationLabel={translationLabel} />;
      case 'analysis':
        return <AnalysisTab structuralAnalysis={ezequiel1Data.structuralAnalysis} />;
      case 'etymology':
        return <EtymologyTab keyWords={ezequiel1Data.keyWords} />;
      case 'lexicon':
        return <LexiconTab />;
      case 'connections':
        return <ConnectionsTab connections={ezequiel1Data.connections} />;
      case 'questions':
        return <QuestionsTab questions={ezequiel1Data.reflectionQuestions} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button & Breadcrumb */}
            <div className="flex items-center gap-4">
              <Link
                href="/library"
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Volver a la biblioteca"
              >
                <ChevronLeft className="h-5 w-5 text-slate-600" />
              </Link>
              <nav className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="text-slate-400">/</span>
                <span className="text-slate-600">{ezequiel1Data.book.testament}</span>
                <span className="text-slate-400">/</span>
                <span className="font-semibold text-slate-900">{ezequiel1Data.book.name}</span>
                <span className="text-slate-400">/</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-semibold">
                  Capítulo {ezequiel1Data.chapter.number}
                </span>
                <span className="text-slate-400">|</span>
                <Link href="/library" className="text-blue-600 hover:text-blue-700 font-medium">
                  Cambiar
                </Link>
              </nav>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 hidden sm:inline">MyScriptum</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chapter Title */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {ezequiel1Data.book.name} {ezequiel1Data.chapter.number}
              </h1>
              <p className="text-lg text-slate-600">
                La visión de la gloria de Dios junto al río Quebar
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">Version:</span>
              <div className="flex rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                <button
                  onClick={() => setVersion('rv1909')}
                  className={`px-3 py-2 text-sm font-semibold transition-colors ${
                    version === 'rv1909'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  RV1909
                </button>
                <button
                  onClick={() => setVersion('kjv')}
                  className={`px-3 py-2 text-sm font-semibold transition-colors ${
                    version === 'kjv'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  KJV
                </button>
              </div>
              {isLoadingText && (
                <span className="text-xs text-slate-500">Cargando...</span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-t-lg shadow-lg border border-slate-200">
          <StudyTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-lg border-x border-b border-slate-200 p-6">
          {renderTabContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-slate-900">MyScriptum</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-600">
              <a href="#" className="hover:text-blue-600 transition-colors">Acerca de</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Ayuda</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Términos</a>
            </div>
            <p className="text-sm text-slate-500">
              © 2026 MyScriptum. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
