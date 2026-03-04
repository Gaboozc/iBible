'use client';

import { BookOpen, Highlighter, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { VerseNotesDisplay } from './VerseNotesButton';

interface Verse {
  number: number;
  text: string;
  textOriginal?: string;
  analysis: string;
}

interface TextTabProps {
  verses: Verse[];
  translationLabel?: string;
  isActive?: boolean;
  isLoading?: boolean;
  note?: string;
  onNoteChange?: (value: string) => void;
}

export function TextTab({
  verses,
  translationLabel = 'Reina-Valera 1909',
  isLoading = false,
  note = '',
  onNoteChange,
}: TextTabProps) {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const { t } = useLanguage();
  const params = useParams();
  const bookSlug = params?.book ? (params.book as string) : '';
  const chapterNum = params?.chapter ? parseInt(params.chapter as string, 10) : 0;

  if (isLoading) {
    return (
      <div className="py-8 text-center text-slate-700">
        <p>Cargando capítulo...</p>
      </div>
    );
  }

  if (!verses || verses.length === 0) {
    return (
      <div className="py-8 text-center text-slate-700">
        <p>No hay versículos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Introducción */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
        <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-1" />
        <div className="text-xs sm:text-sm flex-1">
          <p className="font-semibold text-blue-900 mb-1">📖 {translationLabel}</p>
          <p className="text-blue-800">{verses.length} versículos en este capítulo</p>
        </div>
      </div>

      {/* Versículos */}
      <div className="space-y-2 sm:space-y-3">
        {verses.map((verse) => (
          <div
            key={verse.number}
            onClick={() => setSelectedVerse(selectedVerse === verse.number ? null : verse.number)}
            className={`rounded-lg border-2 p-3 sm:p-4 cursor-pointer transition-all ${
              selectedVerse === verse.number
                ? 'bg-blue-50 border-blue-400 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Header con número, texto y botones */}
            <div className="space-y-2">
              <div className="flex items-start gap-3 justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-xs sm:text-sm font-bold text-blue-600 flex-shrink-0 pt-1 min-w-fit bg-blue-100 px-2 py-1 rounded">
                    {verse.number}
                  </span>
                  <p className="text-slate-900 leading-relaxed text-sm sm:text-base flex-1">
                    {verse.text}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  {/* Indicador de expandible */}
                  <div className="text-slate-400 transition-transform">
                    {selectedVerse === verse.number ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Detalles expandibles */}
              {selectedVerse === verse.number && (
                <div className="mt-4 pt-4 border-t border-blue-200 space-y-3 animate-in fade-in duration-200">
                  {/* Análisis */}
                  {verse.analysis && (
                    <div className="bg-blue-100/50 rounded p-3">
                      <p className="text-xs font-semibold text-blue-900 mb-1">📊 Análisis</p>
                      <p className="text-xs sm:text-sm text-blue-800">{verse.analysis}</p>
                    </div>
                  )}

                  {/* Texto Original */}
                  {verse.textOriginal && (
                    <div className="bg-slate-100/50 rounded p-3">
                      <p className="text-xs font-semibold text-slate-900 mb-1">🔤 Hebreo Original</p>
                      <p className="text-xs sm:text-sm text-slate-700 font-mono">{verse.textOriginal}</p>
                    </div>
                  )}

                  {/* Notas del versículo */}
                  <VerseNotesDisplay
                    bookSlug={bookSlug}
                    chapter={chapterNum}
                    verse={verse.number}
                  />

                  {/* Navegación mejorada */}
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <div className="flex gap-2">
                      {verse.number > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVerse(verse.number - 1);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition font-medium"
                        >
                          <ChevronUp className="h-4 w-4" />
                          Anterior
                        </button>
                      )}
                    </div>
                    
                    {/* Indicador de posición */}
                    <span className="text-xs text-slate-500 font-medium">
                      {verse.number} de {verses.length}
                    </span>

                    <div className="flex gap-2">
                      {verse.number < verses.length && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVerse(verse.number + 1);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition font-medium"
                        >
                          Siguiente
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Notas personales del capítulo */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 space-y-2">
        <div className="text-sm font-semibold text-slate-900">📝 Notas del Capítulo</div>
        <textarea
          value={note}
          onChange={(event) => onNoteChange?.(event.target.value)}
          placeholder={t('study.notes.placeholder')}
          className="w-full min-h-[100px] sm:min-h-[120px] p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-xs sm:text-sm"
        />
      </div>

      {/* Sugerencia */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 text-[11px] sm:text-xs text-amber-800">
        <p className="flex items-center gap-2 font-medium">
          <Highlighter className="h-4 w-4 flex-shrink-0" />
          💡 Haz clic en cualquier versículo para ver análisis y hacer notas individuales.
        </p>
      </div>
    </div>
  );
}
