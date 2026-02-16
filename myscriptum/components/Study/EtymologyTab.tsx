'use client';

import { Zap, Languages, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { lexiconEntries } from '@/data/lexicon';

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

export function EtymologyTab({ keyWords = [] }: EtymologyTabProps) {
  const [expandedWord, setExpandedWord] = useState<number | null>(null);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const hasChapterWords = Boolean(keyWords && keyWords.length > 0);

  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const filteredLexicon = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const needle = normalize(trimmed);
    return lexiconEntries.filter((entry) => {
      const haystack = [
        entry.lemma,
        entry.transliteration,
        entry.gloss_es,
        entry.gloss_en,
        entry.origin_es,
        entry.origin_en,
        entry.usage_es,
        entry.usage_en,
        entry.strong ?? '',
        entry.language,
      ].join(' ');
      return normalize(haystack).includes(needle);
    });
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Etimologia:</span> Explora el origen y el uso historico de palabras clave.
          Usa el diccionario para buscar una palabra y ver su significado original.
        </p>
      </div>

      {/* Dictionary search */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Search className="h-4 w-4 text-slate-500" />
          <span>Diccionario etimologico (ES/EN)</span>
        </div>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca una palabra: kavod, logos, ruach..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none"
          />
        </div>

        {query.trim() === '' ? (
          <div className="text-sm text-slate-500">Escribe para buscar en el diccionario.</div>
        ) : filteredLexicon.length === 0 ? (
          <div className="text-sm text-slate-500">Sin resultados para esa busqueda.</div>
        ) : (
          <div className="space-y-3">
            {filteredLexicon.map((entry) => (
              <div key={entry.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition ${
                    expandedEntry === entry.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <Languages className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-lg">{entry.lemma}</span>
                      <span className="text-sm font-medium text-slate-600 italic">({entry.transliteration})</span>
                      {entry.strong && (
                        <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">{entry.strong}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">ES: {entry.gloss_es}</p>
                    <p className="text-sm text-slate-500">EN: {entry.gloss_en}</p>
                  </div>
                  <span className="text-slate-400 flex-shrink-0 mt-1">
                    {expandedEntry === entry.id ? '−' : '+'}
                  </span>
                </button>

                {expandedEntry === entry.id && (
                  <div className="border-t border-slate-200 p-4 space-y-4 bg-slate-50">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs font-semibold text-slate-700 uppercase">Origen (ES)</p>
                        <p className="text-slate-900 mt-1 text-sm">{entry.origin_es}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs font-semibold text-slate-700 uppercase">Origin (EN)</p>
                        <p className="text-slate-900 mt-1 text-sm">{entry.origin_en}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-semibold text-blue-900 uppercase">Uso (ES)</p>
                        <p className="text-blue-900 mt-1 text-sm">{entry.usage_es}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-semibold text-blue-900 uppercase">Usage (EN)</p>
                        <p className="text-blue-900 mt-1 text-sm">{entry.usage_en}</p>
                      </div>
                    </div>

                    {entry.related.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-2">Relacionadas</p>
                        <div className="flex flex-wrap gap-2">
                          {entry.related.map((rel) => (
                            <span
                              key={rel}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                            >
                              {rel}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Palabras del capitulo */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-slate-700">Palabras del capitulo</div>
        {!hasChapterWords ? (
          <div className="text-sm text-slate-500">No hay palabras cargadas para este capitulo.</div>
        ) : (
          keyWords.map((word, idx) => (
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
                      <p className="text-xs font-semibold text-amber-900 uppercase">Significado Teologico</p>
                      <p className="text-amber-900 mt-1 text-sm">{word.theologicalMeaning}</p>
                    </div>
                  </div>

                  {/* Raiz y cognados */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {word.root && (
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <p className="text-xs font-semibold text-purple-900">Raiz Semitica</p>
                        <p className="text-purple-900 font-mono mt-1 font-bold">{word.root}</p>
                      </div>
                    )}

                    {word.biblicalFrequency && (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="text-xs font-semibold text-green-900">Frecuencia Biblica</p>
                        <p className="text-green-900 mt-1">{word.biblicalFrequency} apariciones</p>
                      </div>
                    )}
                  </div>

                  {/* Evolucion semantica */}
                  {word.semanticEvolution && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-xs font-semibold text-blue-900 mb-2">Evolucion Semantica</p>
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
          ))
        )}
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
