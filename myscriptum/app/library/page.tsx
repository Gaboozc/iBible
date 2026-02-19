'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, Library, Check, Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';
import type { BookEntry, TestamentEntry } from '@/data/bibleCatalog';
import { fetchBibleCatalog } from '@/app/actions/catalog';
import { useTheme, getColors } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getReadChapters, setReadChapters as persistReadChapters } from '@/lib/storage/localStore';

const getChapterHref = (book: BookEntry, chapterNumber: number) => {
  return `/study/${book.slug}/${chapterNumber}`;
};

export default function LibraryPage() {
  const { mode, toggleTheme } = useTheme();
  const { t, bibleVersion, setBibleVersion, language } = useLanguage();
  const palette = getColors(mode);
  const [bibleCatalog, setBibleCatalog] = useState<TestamentEntry[]>([]);
  const [expandedTestamentId, setExpandedTestamentId] = useState<string | null>(null);
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [readChapters, setReadChapters] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCatalog = async () => {
      const catalog = await fetchBibleCatalog();
      setBibleCatalog(catalog);
      setReadChapters(getReadChapters());
      setIsLoading(false);
    };
    loadCatalog();
  }, []);

  const toggleTestament = (testamentId: string) => {
    if (expandedTestamentId === testamentId) {
      setExpandedTestamentId(null);
      setExpandedBookId(null);
    } else {
      setExpandedTestamentId(testamentId);
      setExpandedBookId(null);
    }
  };

  const toggleBook = (bookId: string) => {
    if (expandedBookId === bookId) {
      setExpandedBookId(null);
    } else {
      setExpandedBookId(bookId);
    }
  };

  const toggleReadChapter = (book: BookEntry, chapterNumber: number) => {
    const key = `${book.id}:${chapterNumber}`;
    const newSet = new Set(readChapters);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setReadChapters(newSet);
    persistReadChapters(newSet);
  };

  const isChapterRead = (book: BookEntry, chapterNumber: number) => {
    return readChapters.has(`${book.id}:${chapterNumber}`);
  };

  // Filter books across all testaments if search is active
  const getFilteredBooks = (testament: TestamentEntry) => {
    if (!query.trim()) return testament.books;
    return testament.books.filter((book) =>
      book.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: palette.bg.primary }}>
        <p style={{ color: palette.text.secondary }}>{t('library.subtitle')}</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: palette.bg.primary }} className="pb-20 md:pb-0">
      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: palette.bg.header, borderColor: palette.accent.primary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image src="/assets/img/logo.png" alt="MyScriptum" width={40} height={40} className="h-10 w-10 sm:h-12 sm:w-12" />
              <span className="text-base sm:text-xl font-bold" style={{ color: palette.text.light }}>MyScriptum</span>
            </div>
            <nav className="flex items-center gap-2 sm:gap-3 text-sm">
              {/* Language/Version selector */}
              <div className="flex gap-1.5 sm:gap-2 sm:border-l sm:pl-3" style={{ borderColor: palette.accent.primary }}>
                <button
                  onClick={() => setBibleVersion('rv1909')}
                  className="px-2 sm:px-3 py-1 rounded-lg transition text-xs font-medium"
                  style={{
                    backgroundColor: bibleVersion === 'rv1909' ? palette.accent.secondary : 'transparent',
                    color: bibleVersion === 'rv1909' ? palette.text.light : palette.accent.secondary,
                    borderColor: palette.accent.primary,
                    border: '1px solid',
                  }}
                >
                  <span className="sm:hidden">ES</span>
                  <span className="hidden sm:inline">Español</span>
                </button>
                <button
                  onClick={() => setBibleVersion('kjv')}
                  className="px-2 sm:px-3 py-1 rounded-lg transition text-xs font-medium"
                  style={{
                    backgroundColor: bibleVersion === 'kjv' ? palette.accent.secondary : 'transparent',
                    color: bibleVersion === 'kjv' ? palette.text.light : palette.accent.secondary,
                    borderColor: palette.accent.primary,
                    border: '1px solid',
                  }}
                >
                  <span className="sm:hidden">EN</span>
                  <span className="hidden sm:inline">English</span>
                </button>
              </div>
              
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-lg transition"
                style={{ backgroundColor: palette.accent.secondary, color: palette.text.light }}
                title={mode === 'light' ? t('theme.darkMode') : t('theme.lightMode')}
              >
                {mode === 'light' ? <Moon className="h-4 w-4 sm:h-5 sm:w-5" /> : <Sun className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
              <Link href="/home" className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm" style={{ backgroundColor: palette.accent.primary, color: palette.bg.primary }}>Inicio</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-4 sm:space-y-8">
        <section className="space-y-2 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Library className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: palette.accent.primary }} />
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: palette.text.secondary }}>{t('library.title')}</h1>
          </div>
          <p style={{ color: palette.text.primary }} className="max-w-2xl text-sm sm:text-base">
            {t('library.subtitle')}
          </p>
        </section>

        <section className="rounded-2xl shadow-lg border overflow-hidden" style={{ backgroundColor: palette.bg.secondary, borderColor: palette.accent.primary }}>
          <div className="p-4 sm:p-6 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: palette.accent.secondary }} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('library.search')}
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none"
                style={{
                  borderColor: palette.accent.primary,
                  color: palette.text.primary,
                  backgroundColor: palette.bg.primary,
                }}
                onFocus={(e) => e.currentTarget.style.outline = `2px solid ${palette.accent.secondary}`}
              />
            </div>

            {/* Testament Accordion */}
            <div className="space-y-4">
              {bibleCatalog.map((testament) => {
                const filteredBooks = getFilteredBooks(testament);
                const isExpanded = expandedTestamentId === testament.id;

                return (
                  <div key={testament.id} className="rounded-xl border overflow-hidden" style={{ borderColor: palette.accent.primary, backgroundColor: palette.bg.primary }}>
                    {/* Testament Header */}
                    <button
                      onClick={() => toggleTestament(testament.id)}
                      className="w-full flex items-center justify-between p-4 transition-colors"
                      style={{ backgroundColor: isExpanded ? palette.accent.secondary : palette.bg.primary }}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5" style={{ color: isExpanded ? palette.text.light : palette.text.secondary }} />
                        ) : (
                          <ChevronRight className="h-5 w-5" style={{ color: palette.text.secondary }} />
                        )}
                        <div className="text-left">
                          <h3 className="text-lg font-bold" style={{ color: isExpanded ? palette.text.light : palette.text.secondary }}>
                            {testament.name}
                          </h3>
                          <p className="text-xs" style={{ color: isExpanded ? palette.text.light : palette.text.primary, opacity: 0.75 }}>
                            {filteredBooks.length} {filteredBooks.length === 1 ? 'libro' : 'libros'}
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Books List (shown when testament expanded) */}
                    {isExpanded && (
                      <div className="border-t space-y-2 p-4" style={{ borderColor: palette.accent.primary }}>
                        {filteredBooks.length === 0 ? (
                          <div className="text-sm py-4 text-center" style={{ color: palette.text.secondary }}>{t('library.noResults')}</div>
                        ) : (
                          filteredBooks.map((book) => {
                            const isBookExpanded = expandedBookId === book.id;
                            const description =
                              language === 'es'
                                ? book.descriptionEs ?? book.description
                                : book.descriptionEn ?? book.description;

                            return (
                              <div key={book.id} className="rounded-lg border overflow-hidden" style={{ borderColor: palette.accent.primary, backgroundColor: palette.bg.secondary }}>
                                {/* Book Header */}
                                <button
                                  onClick={() => toggleBook(book.id)}
                                  className="w-full flex items-center justify-between p-3 transition-colors"
                                  style={{ backgroundColor: isBookExpanded ? palette.accent.secondary : palette.bg.secondary }}
                                >
                                  <div className="flex items-center gap-2 flex-1 text-left">
                                    {isBookExpanded ? (
                                      <ChevronDown className="h-4 w-4" style={{ color: palette.text.light }} />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" style={{ color: palette.text.secondary }} />
                                    )}
                                    <div>
                                      <h4 className="font-semibold" style={{ color: isBookExpanded ? palette.text.light : palette.text.secondary }}>
                                        {book.name}
                                      </h4>
                                      <p className="text-xs" style={{ color: isBookExpanded ? palette.text.light : palette.text.primary, opacity: 0.75 }}>
                                        {book.abbreviation} • {book.chapters.length} {book.chapters.length === 1 ? 'capítulo' : 'capítulos'}
                                      </p>
                                    </div>
                                  </div>
                                </button>

                                {/* Chapters Grid (shown when book expanded) */}
                                {isBookExpanded && (
                                  <div className="border-t p-4 space-y-3" style={{ borderColor: palette.accent.primary }}>
                                    <p className="text-sm" style={{ color: palette.text.primary, opacity: 0.75 }}>
                                      {description}
                                    </p>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                      {book.chapters.map((chapter) => {
                                        const isRead = isChapterRead(book, chapter.number);
                                        const href = getChapterHref(book, chapter.number);

                                        return (
                                          <div key={chapter.number} className="relative group">
                                            <Link
                                              href={href}
                                              className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg border text-sm font-semibold transition"
                                              style={{
                                                borderColor: palette.accent.primary,
                                                backgroundColor: isRead ? palette.accent.secondary : palette.bg.primary,
                                                color: isRead ? palette.text.light : palette.text.primary,
                                              }}
                                              title={`Ver capítulo ${chapter.number}`}
                                            >
                                              <span>{chapter.number}</span>
                                              {isRead && <Check className="h-3 w-3" />}
                                            </Link>
                                            <button
                                              onClick={(e) => {
                                                e.preventDefault();
                                                toggleReadChapter(book, chapter.number);
                                              }}
                                              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition rounded-full p-1"
                                              style={{ backgroundColor: palette.accent.primary }}
                                              title={isRead ? 'Marcar no leído' : 'Marcar leído'}
                                            >
                                              <Check className="h-3 w-3" style={{ color: palette.text.light }} />
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="rounded-lg p-4 text-sm border" style={{ backgroundColor: palette.bg.primary, borderColor: palette.accent.primary, color: palette.text.primary }}>
              <p className="font-semibold mb-1" style={{ color: palette.text.secondary }}>{t('library.readingStatus')}</p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1" style={{ color: palette.accent.secondary }}>
                  <Check className="h-4 w-4" /> {t('library.read')}
                </span>
                <span style={{ color: palette.accent.primary }}>•</span>
                <span>{t('library.unread')}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
