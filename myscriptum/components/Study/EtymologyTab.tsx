'use client';

import { Zap, Languages } from 'lucide-react';
import { useState } from 'react';

interface KeyWord {
  hebrew: string;
  english: string;
  literalMeaning: string;
  primaryMeaning: string;
  theologicalMeaning: string;
  root: string;
  cognates: string[];
  semanticEvolution: string;
  relatedWords: string[];
  keyAppearances: string[];
  biblicalFrequency: number;
}

interface EtymologyTabProps {
  keyWords?: KeyWord[];
  isActive?: boolean;
}

export function EtymologyTab({ keyWords = [], isActive = true }: EtymologyTabProps) {
  if (!keyWords || keyWords.length === 0) {
    return (
      <div className="py-12 text-center text-slate-600">
        <p className="text-lg">Etimología no disponible</p>
        <p className="text-sm mt-2">Esta funcionalidad será añadida próximamente</p>
      </div>
    );
  }
  const [expandedWord, setExpandedWord] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Etimología:</span> Estudio del origen y evolución 
          de las palabras. Aquí exploraremos las palabras clave hebreas/griegas que forman la base teológica del capítulo.
        </p>
      </div>

      {/* Palabras clave */}
      <div className="space-y-3">
        {keyWords.map((word, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-lg overflow-hidden"
          >
            {/* Header clickeable */}
            <button
              onClick={() => setExpandedWord(expandedWord === idx ? null : idx)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition ${
                expandedWord === idx ? 'bg-blue-50' : ''
              }`}
            >
              <Languages className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-lg">{word.hebrew}</span>
                  <span className="text-sm font-medium text-slate-700 italic">= &quot;{word.english}&quot;</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{word.literalMeaning}</p>
              </div>
              <span className="text-slate-400 flex-shrink-0 mt-1">
                {expandedWord === idx ? '−' : '+'}
              </span>
            </button>

            {/* Contenido expandible */}
            {expandedWord === idx && (
              <div className="border-t border-slate-200 p-4 space-y-4 bg-slate-50">
                {/* Significados */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <p className="text-xs font-semibold text-slate-700 uppercase">Significado Primario</p>
                    <p className="text-slate-900 mt-1">{word.primaryMeaning}</p>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                    <p className="text-xs font-semibold text-amber-900 uppercase">Significado Teológico</p>
                    <p className="text-amber-900 mt-1 text-sm">{word.theologicalMeaning}</p>
                  </div>
                </div>

                {/* Raíz y cognados */}
                <div className="grid md:grid-cols-2 gap-4">
                  {word.root && (
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <p className="text-xs font-semibold text-purple-900">Raíz Semítica</p>
                      <p className="text-purple-900 font-mono mt-1 font-bold">{word.root}</p>
                    </div>
                  )}

                  {word.biblicalFrequency && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <p className="text-xs font-semibold text-green-900">Frecuencia Bíblica</p>
                      <p className="text-green-900 mt-1">{word.biblicalFrequency} apariciones</p>
                    </div>
                  )}
                </div>

                {/* Evolución semántica */}
                {word.semanticEvolution && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 mb-2">Evolución Semántica</p>
                    <p className="text-sm text-blue-900">{word.semanticEvolution}</p>
                  </div>
                )}

                {/* Relaciones de campo (word family) */}
                {word.relatedWords && word.relatedWords.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">Familia de Palabras Relacionadas</p>
                    <div className="flex flex-wrap gap-2">
                      {word.relatedWords.map((rel, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {rel}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apariciones notables */}
                {word.keyAppearances && word.keyAppearances.length > 0 && (
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <p className="text-xs font-semibold text-slate-700 mb-2">Apariciones Clave en la Biblia</p>
                    <div className="space-y-1">
                      {word.keyAppearances.map((ref, i) => (
                        <p key={i} className="text-sm text-slate-600 font-mono">
                          • {ref}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Nota de estudio */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <Zap className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-1" />
        <div>
          <p className="text-sm font-semibold text-yellow-900">Profundiza tu comprensión:</p>
          <p className="text-sm text-yellow-800 mt-1">
            La etimología no solo es académica. Entender las palabras originales abre capas enteras de 
            significado que se pierden en traducción. Kavod no es solo &quot;gloria&quot; — es &quot;peso&quot;, &quot;importancia&quot;,
            &quot;substancia&quot;. Esto cambia cómo entendemos la teología del texto.
          </p>
        </div>
      </div>
    </div>
  );
}
