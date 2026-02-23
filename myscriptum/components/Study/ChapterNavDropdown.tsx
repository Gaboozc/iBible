'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchBibleCatalog } from '@/app/actions/catalog';
import type { TestamentEntry } from '@/data/bibleCatalog';

interface Palette {
  bg: {
    primary: string;
    secondary: string;
    header: string;
  };
  text: {
    primary: string;
    secondary: string;
    light: string;
  };
  accent: {
    primary: string;
    secondary: string;
  };
  border: string;
}

interface Props {
  currentBook: string;
  currentChapter: number;
  palette: Palette;
}

function ChapterNavDropdownInner({ currentBook, currentChapter, palette }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [catalog, setCatalog] = useState<TestamentEntry[]>([]);
  const [selectedTestament, setSelectedTestament] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<string>('');
  const router = useRouter();

  // Load catalog only once
  useEffect(() => {
    let isMounted = true;
    const loadCatalog = async () => {
      const data = await fetchBibleCatalog();
      if (isMounted) {
        setCatalog(data);
        
        // Find current testament and book
        for (const testament of data) {
          const book = testament.books.find(b => b.slug === currentBook);
          if (book) {
            setSelectedTestament(testament.id);
            setSelectedBook(book.id);
            break;
          }
        }
      }
    };
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, [currentBook]);

  const handleChapterSelect = useCallback((bookSlug: string, chapterNum: number) => {
    router.push(`/study/${bookSlug}/${chapterNum}`);
    setIsOpen(false);
  }, [router]);

  const currentTestament = useMemo(() => 
    catalog.find(t => t.id === selectedTestament), 
    [catalog, selectedTestament]
  );
  
  const currentBookObj = useMemo(() => 
    currentTestament?.books.find(b => b.id === selectedBook), 
    [currentTestament, selectedBook]
  );
  
  const availableBooksInTestament = useMemo(() => 
    selectedTestament ? currentTestament?.books || [] : [], 
    [selectedTestament, currentTestament]
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border transition text-xs sm:text-sm whitespace-nowrap font-medium"
        style={{
          borderColor: palette.accent.primary,
          backgroundColor: isOpen ? palette.accent.secondary : 'transparent',
          color: palette.text.light,
        }}
      >
        <span>📖</span>
        <span className="hidden sm:inline">Navegar</span>
        <ChevronDown
          className="h-4 w-4 transition-transform"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-x-3 top-16 z-50 rounded-lg shadow-lg border sm:absolute sm:inset-auto sm:top-full sm:left-0 sm:mt-2 sm:min-w-max"
          style={{
            backgroundColor: palette.bg.secondary,
            borderColor: palette.accent.primary,
          }}
        >
          <div className="max-h-[70vh] overflow-y-auto p-3 space-y-3 sm:max-h-none">
            {/* Testament Dropdown */}
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: palette.text.secondary }}>
                {currentBook === 'genesis' ? '📜' : '📕'} Testamento
              </label>
              <select
                value={selectedTestament}
                onChange={(e) => {
                  setSelectedTestament(e.target.value);
                  setSelectedBook('');
                }}
                className="w-full px-2 py-1 rounded border text-xs"
                style={{
                  backgroundColor: palette.bg.primary,
                  borderColor: palette.accent.primary,
                  color: palette.text.primary,
                }}
              >
                <option value="">Selecciona testamento...</option>
                {catalog.map(testament => (
                  <option key={testament.id} value={testament.id}>
                    {testament.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Book Dropdown */}
            {selectedTestament && (
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: palette.text.secondary }}>
                  📘 Libro
                </label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full px-2 py-1 rounded border text-xs"
                  style={{
                    backgroundColor: palette.bg.primary,
                    borderColor: palette.accent.primary,
                    color: palette.text.primary,
                  }}
                >
                  <option value="">Selecciona libro...</option>
                  {availableBooksInTestament.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.name} ({book.chapters.length} cap.)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Chapter Dropdown */}
            {selectedBook && currentBookObj && (
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: palette.text.secondary }}>
                  📑 Capítulo
                </label>
                <div
                  className="max-h-48 overflow-y-auto rounded border p-2 space-y-1"
                  style={{
                    backgroundColor: palette.bg.primary,
                    borderColor: palette.accent.primary,
                  }}
                >
                  {currentBookObj.chapters.map(chapter => (
                    <button
                      key={chapter.number}
                      onClick={() => handleChapterSelect(currentBookObj.slug, chapter.number)}
                      className="w-full text-left px-2 py-1 rounded text-xs transition hover:opacity-100"
                      style={{
                        backgroundColor:
                          currentBook === currentBookObj.slug && currentChapter === chapter.number
                            ? palette.accent.primary
                            : 'transparent',
                        color: palette.text.primary,
                        opacity:
                          currentBook === currentBookObj.slug && currentChapter === chapter.number ? 1 : 0.7,
                      }}
                    >
                      Cap. {chapter.number}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const ChapterNavDropdown = memo(ChapterNavDropdownInner);
