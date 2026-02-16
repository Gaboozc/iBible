'use client';

import { BookOpen, Highlighter } from 'lucide-react';
import { useState } from 'react';

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
}

export function TextTab({ verses, translationLabel = 'Reina-Valera 1909', isActive = true, isLoading = false }: TextTabProps) {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  console.log('🎨 TextTab render:', { isActive, isLoading, versesLength: verses?.length });

  // Parent handles visibility, so we always render the content
  if (isLoading) {
    return (
      <div className="py-8 text-center text-slate-700">
        <p>Cargando capítulo...</p>
      </div>
    );
  }

  if (!verses || verses.length === 0) {
    console.log('❌ TextTab: No verses', { versesExists: !!verses, length: verses?.length });
    return (
      <div className="py-8 text-center text-slate-700">
        <p>No hay versículos disponibles</p>
      </div>
    );
  }

  console.log('✅ TextTab: Rendering', verses.length, 'verses');

  return (
    <div className="space-y-6">
      {/* Introducción */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
        <div className="text-sm">
          <p className="font-semibold text-blue-900 mb-1">📖 Traducción: {translationLabel}</p>
          <p className="text-blue-800">Total de versículos: {verses.length}</p>
        </div>
      </div>

      {/* Versículos */}
      <div className="space-y-4">
        {verses && verses.length > 0 ? (
          verses.map((verse) => (
            <div
              key={verse.number}
              onClick={() => setSelectedVerse(selectedVerse === verse.number ? null : verse.number)}
              className={`rounded-lg border-2 p-4 cursor-pointer transition-all ${
                selectedVerse === verse.number
                  ? 'bg-blue-50 border-blue-400 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Número y texto */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-sm font-bold text-blue-600 flex-shrink-0 pt-1 min-w-fit">
                    {verse.number}
                  </span>
                  <p className="text-slate-900 leading-relaxed text-base">{verse.text}</p>
                </div>

                {/* Detalles expandibles */}
                {selectedVerse === verse.number && (
                  <div className="mt-4 pt-4 border-t border-blue-200 space-y-3">
                    {/* Análisis */}
                    {verse.analysis && (
                      <div className="bg-blue-100/50 rounded p-3">
                        <p className="text-xs font-semibold text-blue-900 mb-1">Análisis</p>
                        <p className="text-sm text-blue-800">{verse.analysis}</p>
                      </div>
                    )}

                    {/* Texto Original */}
                    {verse.textOriginal && (
                      <div className="bg-slate-100/50 rounded p-3">
                        <p className="text-xs font-semibold text-slate-900 mb-1">Hebreo Original</p>
                        <p className="text-sm text-slate-700 font-mono">{verse.textOriginal}</p>
                      </div>
                    )}

                    {/* Navegación */}
                    <div className="flex gap-2">
                      {verse.number > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVerse(verse.number - 1);
                          }}
                          className="text-sm px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded transition"
                        >
                          ← Anterior
                        </button>
                      )}
                      {verse.number < verses.length && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVerse(verse.number + 1);
                          }}
                          className="text-sm px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded transition ml-auto"
                        >
                          Siguiente →
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-600">
            <p className="text-lg">Sin versículos disponibles</p>
          </div>
        )}
      </div>

      {/* Nota al pie */}
      <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 text-xs text-slate-700">
        <p className="flex items-center gap-2">
          <Highlighter className="h-4 w-4" />
          Haz clic en cualquier versículo para ver análisis y notas.
        </p>
      </div>
    </div>
  );
}
