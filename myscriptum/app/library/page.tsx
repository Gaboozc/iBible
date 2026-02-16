'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BookOpen, ChevronRight, Search, Library, Check } from 'lucide-react';
import { useEffect } from 'react';
import type { BookEntry, TestamentEntry } from '@/data/bibleCatalog';
import { fetchBibleCatalog } from '@/app/actions/catalog';

const getChapterHref = (book: BookEntry, chapterNumber: number) => {
  return `/study/${book.slug}/${chapterNumber}`;
};

export default function LibraryPage() {
  const [bibleCatalog, setBibleCatalog] = useState<TestamentEntry[]>([]);
  const [selectedTestamentId, setSelectedTestamentId] = useState('ot');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [query, setQuery] = useState('');
  const [readChapters, setReadChapters] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCatalog = async () => {
      const catalog = await fetchBibleCatalog();
      setBibleCatalog(catalog);
      if (catalog.length > 0) {
        setSelectedTestamentId(catalog[0].id);
        setSelectedBookId(catalog[0].books[0]?.id ?? '');
      }

      // Load read chapters from localStorage
      const saved = localStorage.getItem('readChapters');
      if (saved) {
        setReadChapters(new Set(JSON.parse(saved)));
      }
      setIsLoading(false);
    };
    loadCatalog();
  }, []);

  const selectedTestament: TestamentEntry | undefined = useMemo(() => {
    return bibleCatalog.find((t) => t.id === selectedTestamentId);
  }, [selectedTestamentId, bibleCatalog]);

  const selectedBook =
    selectedTestament?.books.find((b) => b.id === selectedBookId) ??
    selectedTestament?.books[0];

  const filteredBooks = selectedTestament?.books.filter((book) =>
    book.name.toLowerCase().includes(query.trim().toLowerCase())
  ) ?? [];

  const toggleReadChapter = (book: BookEntry, chapterNumber: number) => {
    const key = `${book.id}:${chapterNumber}`;
    const newSet = new Set(readChapters);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setReadChapters(newSet);
    localStorage.setItem('readChapters', JSON.stringify(Array.from(newSet)));
  };

  const isChapterRead = (book: BookEntry, chapterNumber: number) => {
    return readChapters.has(`${book.id}:${chapterNumber}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <p className="text-slate-600">Cargando biblioteca...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E9D4' }}>
      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: '#3D2644', borderColor: '#B08D57' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" style={{ color: '#B08D57' }} />
              <span className="text-xl font-bold" style={{ color: '#F2E9D4' }}>MyScriptum</span>
            </div>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/progress" style={{ color: '#4A908F' }} className="hover:opacity-75 transition">Progreso</Link>
              <Link href="/study" style={{ color: '#4A908F' }} className="hover:opacity-75 transition">Demo</Link>
              <Link href="/login" className="px-4 py-2 rounded-lg transition-colors" style={{ backgroundColor: '#B08D57', color: '#F2E9D4' }}>Entrar</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Library className="h-6 w-6" style={{ color: '#B08D57' }} />
            <h1 className="text-3xl font-bold" style={{ color: '#3D2644' }}>Biblioteca Bíblica</h1>
          </div>
          <p style={{ color: '#1A1A1A' }} className="max-w-2xl">
            Explora testamentos, libros y capítulos. Los capítulos disponibles están marcados para comenzar el estudio.
          </p>
        </section>

        <section className="rounded-2xl shadow-lg border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#B08D57' }}>
          <div className="grid lg:grid-cols-12 gap-0">
            {/* Column: Testaments */}
            <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r p-6" style={{ borderColor: '#B08D57' }}>
              <h2 className="text-sm uppercase tracking-wide font-semibold mb-4" style={{ color: '#3D2644' }}>Testamentos</h2>
              <div className="space-y-3">
                {bibleCatalog.map((testament) => (
                  <button
                    key={testament.id}
                    onClick={() => {
                      setSelectedTestamentId(testament.id);
                      setSelectedBookId(testament.books[0]?.id ?? '');
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl border transition-all"
                    style={{
                      backgroundColor: selectedTestamentId === testament.id ? '#4A908F' : '#F2E9D4',
                      borderColor: selectedTestamentId === testament.id ? '#B08D57' : '#B08D57',
                      color: selectedTestamentId === testament.id ? '#F2E9D4' : '#3D2644',
                    }}
                  >
                    <div className="font-semibold">{testament.name}</div>
                    <div className="text-xs opacity-75">{testament.books.length} libros</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Column: Books */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r p-6 space-y-4" style={{ borderColor: '#B08D57' }}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm uppercase tracking-wide font-semibold" style={{ color: '#3D2644' }}>Libros</h2>
                <div className="relative w-full max-w-xs">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#4A908F' }} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar libro..."
                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none"
                    style={{
                      borderColor: '#B08D57',
                      color: '#1A1A1A',
                    }}
                    onFocus={(e) => e.currentTarget.style.outline = `2px solid #4A908F`}
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                {filteredBooks.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => setSelectedBookId(book.id)}
                    className="w-full text-left p-4 rounded-xl border transition-all"
                    style={{
                      backgroundColor: selectedBook?.id === book.id ? '#4A908F' : '#F2E9D4',
                      borderColor: '#B08D57',
                      color: selectedBook?.id === book.id ? '#F2E9D4' : '#1A1A1A',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold">{book.name}</div>
                        <div className="text-xs opacity-75">{book.abbreviation}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-75" />
                    </div>
                    <p className="text-sm opacity-75 mt-2">{book.description}</p>
                  </button>
                ))}
                {filteredBooks.length === 0 && (
                  <div className="text-sm" style={{ color: '#3D2644' }}>No hay libros con ese nombre.</div>
                )}
              </div>
            </div>

            {/* Column: Chapters */}
            <div className="lg:col-span-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm uppercase tracking-wide font-semibold" style={{ color: '#3D2644' }}>Capítulos</h2>
                  <p className="text-xs opacity-75" style={{ color: '#3D2644' }}>{selectedBook?.name}</p>
                </div>
                <span className="text-xs opacity-75" style={{ color: '#3D2644' }}>{selectedBook?.chapters.length ?? 0} capítulos</span>
              </div>

              {!selectedBook ? (
                <div className="text-sm" style={{ color: '#3D2644' }}>Selecciona un libro</div>
              ) : selectedBook.chapters.length === 0 ? (
                <div className="text-sm" style={{ color: '#3D2644' }}>No hay capítulos cargados</div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {selectedBook?.chapters.map((chapter) => {
                  const isRead = isChapterRead(selectedBook, chapter.number);
                  const href = getChapterHref(selectedBook, chapter.number);

                  return (
                    <div key={chapter.number} className="relative group">
                      <Link
                        href={href}
                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg border text-sm font-semibold transition"
                        style={{
                          borderColor: '#B08D57',
                          backgroundColor: isRead ? '#4A908F' : '#F2E9D4',
                          color: isRead ? '#F2E9D4' : '#1A1A1A',
                        }}
                        title="Ver capítulo"
                      >
                        <span>{chapter.number}</span>
                        {isRead && <Check className="h-4 w-4" />}
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleReadChapter(selectedBook, chapter.number);
                        }}
                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition rounded-full p-1 hover:opacity-100"
                        style={{ backgroundColor: '#B08D57' }}
                        title={isRead ? 'Marcar no leído' : 'Marcar leído'}
                      >
                        <Check className="h-3 w-3" style={{ color: '#F2E9D4' }} />
                      </button>
                    </div>
                  );
                })}
                </div>
              )}

              <div className="mt-6 rounded-lg p-4 text-sm border" style={{ backgroundColor: '#F2E9D4', borderColor: '#B08D57', color: '#1A1A1A' }}>
                <p className="font-semibold mb-1" style={{ color: '#3D2644' }}>Estado de lectura</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1" style={{ color: '#4A908F' }}>
                    <Check className="h-4 w-4" /> Leído
                  </span>
                  <span style={{ color: '#B08D57' }}>•</span>
                  <span>No leído</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
