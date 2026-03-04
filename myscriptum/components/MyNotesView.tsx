'use client';

import { useState, useEffect } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllVersesWithNotes, getVerseNotes, deleteVerseNote } from '@/lib/storage/verseNotes';
import type { VerseNote } from '@/lib/storage/verseNotes';

interface GroupedNotes {
  [book: string]: {
    [chapter: number]: VerseNote[];
  };
}

export function MyNotesView() {
  const [groupedNotes, setGroupedNotes] = useState<GroupedNotes>({});
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  useEffect(() => {
    // Load all notes and group them
    const loadNotes = () => {
      const versesWithNotes = getAllVersesWithNotes();
      const grouped: GroupedNotes = {};

      versesWithNotes.forEach(({ bookSlug, chapter, verse }) => {
        if (!grouped[bookSlug]) {
          grouped[bookSlug] = {};
        }
        if (!grouped[bookSlug][chapter]) {
          grouped[bookSlug][chapter] = [];
        }

        const notes = getVerseNotes(bookSlug, chapter, verse);
        grouped[bookSlug][chapter].push(...notes);
      });

      setGroupedNotes(grouped);
    };

    loadNotes();
  }, []);

  const handleDeleteNote = (noteId: string) => {
    if (deleteVerseNote(noteId)) {
      // Refresh the view
      const versesWithNotes = getAllVersesWithNotes();
      const grouped: GroupedNotes = {};

      versesWithNotes.forEach(({ bookSlug, chapter, verse }) => {
        if (!grouped[bookSlug]) {
          grouped[bookSlug] = {};
        }
        if (!grouped[bookSlug][chapter]) {
          grouped[bookSlug][chapter] = [];
        }

        const notes = getVerseNotes(bookSlug, chapter, verse);
        grouped[bookSlug][chapter].push(...notes);
      });

      setGroupedNotes(grouped);
    }
  };

  const totalNotes = Object.values(groupedNotes).reduce((sum, chapters) => {
    return sum + Object.values(chapters).reduce((chSum, notes) => chSum + notes.length, 0);
  }, 0);

  if (totalNotes === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500 text-lg">📝 No tienes notas aún.</p>
        <p className="text-slate-400 text-sm mt-2">
          Haz clic en el icono de notas en cualquier versículo para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          📊 <span className="font-semibold">{totalNotes}</span> nota{totalNotes !== 1 ? 's' : ''} en total
        </p>
      </div>

      <div className="space-y-3">
        {Object.entries(groupedNotes).map(([bookSlug, chapters]) => (
          <div
            key={bookSlug}
            className="border border-slate-200 rounded-lg overflow-hidden"
          >
            {/* Encabezado del libro */}
            <button
              onClick={() => setExpandedBook(expandedBook === bookSlug ? null : bookSlug)}
              className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 transition text-left font-semibold text-slate-900 flex items-center justify-between"
            >
              <span className="text-lg">📖 {bookSlug}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal text-slate-600">
                  {Object.values(chapters).reduce((sum, notes) => sum + notes.length, 0)} nota{Object.values(chapters).reduce((sum, notes) => sum + notes.length, 0) !== 1 ? 's' : ''}
                </span>
                {expandedBook === bookSlug ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </button>

            {/* Contenido del libro */}
            {expandedBook === bookSlug && (
              <div className="border-t border-slate-200 divide-y divide-slate-200">
                {Object.entries(chapters)
                  .sort(([chapterA], [chapterB]) => parseInt(chapterB) - parseInt(chapterA))
                  .map(([chapterStr, notes]) => {
                    const chapter = parseInt(chapterStr, 10);
                    const chapterKey = `${bookSlug}:${chapter}`;

                    return (
                      <div key={chapterKey}>
                        {/* Encabezado del capítulo */}
                        <button
                          onClick={() => setExpandedChapter(expandedChapter === chapterKey ? null : chapterKey)}
                          className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition text-left flex items-center justify-between group"
                        >
                          <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                            Capítulo {chapter}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">{notes.length} nota{notes.length !== 1 ? 's' : ''}</span>
                            {expandedChapter === chapterKey ? (
                              <ChevronUp className="h-4 w-4 text-slate-600" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-600" />
                            )}
                          </div>
                        </button>

                        {/* Notas del capítulo */}
                        {expandedChapter === chapterKey && (
                          <div className="divide-y divide-slate-100">
                            {notes
                              .sort((a, b) => a.verse - b.verse)
                              .map((note) => (
                                <div
                                  key={note.id}
                                  className="px-4 py-3 bg-white hover:bg-blue-50 transition"
                                >
                                  {/* Encabezado de la nota */}
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <span className="text-sm font-semibold text-blue-600">
                                      {bookSlug} {chapter}:{note.verse}
                                    </span>
                                    <button
                                      onClick={() => handleDeleteNote(note.id)}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                                      title="Eliminar nota"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>

                                  {/* Contenido de la nota */}
                                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                                    {note.text}
                                  </p>

                                  {/* Fecha */}
                                  <p className="text-xs text-slate-500">
                                    {new Date(note.updatedAt).toLocaleDateString('es-ES', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
