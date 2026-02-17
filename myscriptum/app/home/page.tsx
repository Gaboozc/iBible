'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, RefreshCw, ArrowRight, BookMarked } from 'lucide-react';
import { Fraunces, Manrope } from 'next/font/google';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getLastViewedChapter, setLastViewedChapter, getReflectionAnswers } from '@/lib/storage/localStore';
import { fetchBibleCatalog } from '@/app/actions/catalog';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['600', '700'] });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600'] });

type VerseOfDay = {
  bookSlug: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  version: 'rv1909' | 'kjv';
};

type RecentChapter = {
  bookId: string;
  bookName: string;
  chapter: number;
  answeredQuestions: number;
  totalQuestions: number;
} | null;

export default function HomePage() {
  const { bibleVersion, setBibleVersion, t, language } = useLanguage();
  const [verse, setVerse] = useState<VerseOfDay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [recent, setRecent] = useState<RecentChapter>(null);

  // Load recent chapter info
  useEffect(() => {
    const loadRecent = async () => {
      const lastChapterKey = getLastViewedChapter();
      if (lastChapterKey) {
        const [bookId, chapterStr] = lastChapterKey.split(':');
        const chapter = Number(chapterStr);
        
        if (!Number.isNaN(chapter)) {
          try {
            const catalog = await fetchBibleCatalog();
            // Search through all testaments and books
            for (const testament of catalog) {
              const book = testament.books.find((b) => b.id === bookId);
              if (book) {
                const answers = getReflectionAnswers(lastChapterKey);
                const totalQuestions = 6; // Assuming standard 6 questions
                const answeredQuestions = Object.keys(answers).length;
                
                setRecent({
                  bookId,
                  bookName: book.name,
                  chapter,
                  answeredQuestions,
                  totalQuestions,
                });
                break;
              }
            }
          } catch (error) {
            console.error('Failed to load recent chapter:', error);
          }
        }
      }
    };
    loadRecent();
  }, [language]);

  const loadVerse = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await fetch(`/api/verse-of-day?version=${bibleVersion}`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to load verse');
      }
      const data = (await response.json()) as VerseOfDay;
      setVerse(data);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [bibleVersion]);

  useEffect(() => {
    loadVerse();
  }, [loadVerse]);

  const verseReference = useMemo(() => {
    if (!verse) return '';
    return `${verse.bookName} ${verse.chapter}:${verse.verse}`;
  }, [verse]);

  return (
    <div className={`${manrope.className} min-h-screen bg-[#F4EFE6] text-[#201A16] relative overflow-hidden`}>
      <div className="absolute inset-0">
        <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-[#E0C39A]/50 blur-3xl" />
        <div className="absolute top-1/2 -left-24 h-64 w-64 rounded-full bg-[#6C9FA1]/35 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-[#8B5E3C]/20 blur-3xl" />
      </div>

      <header className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#201A16] text-[#F4EFE6] flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="leading-tight">
              <p className={`${fraunces.className} text-xl`}>MyScriptum</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#7A5B3A]">Biblia Viva</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 rounded-full border border-[#7A5B3A]/40 p-1">
              <button
                type="button"
                onClick={() => setBibleVersion('rv1909')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  bibleVersion === 'rv1909'
                    ? 'bg-[#201A16] text-[#F4EFE6]'
                    : 'text-[#7A5B3A] hover:text-[#201A16]'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setBibleVersion('kjv')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  bibleVersion === 'kjv'
                    ? 'bg-[#201A16] text-[#F4EFE6]'
                    : 'text-[#7A5B3A] hover:text-[#201A16]'
                }`}
              >
                EN
              </button>
            </div>
            <Link
              href="/progress"
              className="rounded-full border border-[#7A5B3A]/40 px-4 py-2 text-[#3E2E1F] hover:bg-[#EADFCB] transition"
            >
              Progreso
            </Link>
            <Link
              href="/library"
              className="rounded-full border border-[#7A5B3A]/40 px-4 py-2 text-[#3E2E1F] hover:bg-[#EADFCB] transition"
            >
              {t('home.explore')}
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7A5B3A]/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#7A5B3A]">
              {t('home.welcomeLabel')}
            </div>
            <h1 className={`${fraunces.className} text-4xl sm:text-5xl lg:text-6xl text-[#2A1C12] leading-tight`}>
              {t('home.title')}
            </h1>
            <p className="text-lg text-[#4B3A2A] max-w-xl">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/library"
                className="inline-flex items-center gap-2 rounded-full bg-[#201A16] text-[#F4EFE6] px-6 py-3 text-sm font-semibold transition hover:translate-y-[-2px]"
              >
                {t('home.start')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-[#7A5B3A]/30 bg-white/80 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(32,26,22,0.15)]">
            <div className="flex items-center justify-between text-sm text-[#7A5B3A]">
              <span className="uppercase tracking-[0.2em]">{t('home.verseLabel')}</span>
              <button
                onClick={loadVerse}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] hover:text-[#201A16] transition"
                type="button"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                {t('home.refresh')}
              </button>
            </div>

            <div className="mt-6 min-h-[220px] flex flex-col">
              {isLoading ? (
                <p className="text-[#6C5A46]">{t('home.loading')}</p>
              ) : hasError ? (
                <p className="text-[#9B4D2C]">{t('home.error')}</p>
              ) : verse ? (
                <>
                  <p className={`${fraunces.className} text-2xl text-[#2A1C12] leading-snug`}>
                    “{verse.text}”
                  </p>
                  <p className="mt-4 text-sm text-[#6C5A46]">{verseReference}</p>
                </>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={verse ? `/study/${verse.bookSlug}/${verse.chapter}` : '/library'}
                className="inline-flex items-center gap-2 rounded-full bg-[#7A5B3A] text-white px-5 py-2 text-sm font-semibold hover:bg-[#63452C] transition"
              >
                {t('home.viewMore')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="inline-flex items-center rounded-full border border-[#7A5B3A]/30 px-4 py-2 text-xs text-[#6C5A46]">
                {verse ? verse.version.toUpperCase() : bibleVersion.toUpperCase()}
              </span>
            </div>
          </div>
        </section>

        {/* Recent Section */}
        {recent && (
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <div className="space-y-4">
              <h2 className={`${fraunces.className} text-2xl text-[#2A1C12]`}>
                {t('home.recent.title')}
              </h2>
              <div className="rounded-3xl border border-[#7A5B3A]/30 bg-white/80 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(32,26,22,0.15)]">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-2">
                    <BookMarked className="h-5 w-5 text-[#7A5B3A]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#2A1C12] font-semibold">
                      {recent.bookName} {recent.chapter}
                    </h3>
                    <p className="text-sm text-[#6C5A46] mt-1">
                      {t('home.recent.lastChapter')}
                    </p>
                    {recent.answeredQuestions > 0 && (
                      <p className="text-xs text-[#7A5B3A] mt-2">
                        {recent.answeredQuestions} de {recent.totalQuestions} respuestas completadas
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/study/${recent.bookId}/${recent.chapter}`}
                      onClick={() => setLastViewedChapter(`${recent.bookId}:${recent.chapter}`)}
                      className="whitespace-nowrap inline-flex items-center gap-2 rounded-full bg-[#7A5B3A] text-white px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-[#63452C] transition"
                    >
                      {t('home.recent.continue')}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    {recent.answeredQuestions < recent.totalQuestions && (
                      <Link
                        href={`/study/${recent.bookId}/${recent.chapter}?tab=reflection`}
                        onClick={() => setLastViewedChapter(`${recent.bookId}:${recent.chapter}`)}
                        className="whitespace-nowrap inline-flex items-center gap-2 rounded-full border border-[#7A5B3A]/30 px-4 py-2 text-xs sm:text-sm font-semibold text-[#7A5B3A] hover:bg-[#EADFCB] transition"
                      >
                        {t('home.recent.continueReflection')}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}      </main>
    </div>
  );
}