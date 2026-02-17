'use client';

import { Languages, Search, ChevronDown, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { lexiconEntries } from '@/data/lexicon';

interface EtymologyTabProps {
  keyWords?: Record<string, unknown>[];
  isActive?: boolean;
}

export function EtymologyTab({ keyWords = [] }: EtymologyTabProps) {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [expandedWord, setExpandedWord] = useState<number | null>(null);
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
    <div className="space-y-4 md:space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
        <p className="text-xs md:text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Etimologia:</span> Explora el origen y el uso historico de palabras clave.
          Usa el diccionario para buscar una palabra y ver su significado original.
        </p>
      </div>

      {/* Dictionary search */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 md:p-4 space-y-3 md:space-y-4">
        <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-700">
          <Search className="h-4 w-4 text-slate-500 flex-shrink-0" />
          <span>Diccionario etimologico (ES/EN)</span>
        </div>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca una palabra: bara, logos, ruach..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs md:text-sm text-slate-900 placeholder-slate-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {query.trim() === '' ? (
          <div className="text-xs md:text-sm text-slate-500">Escribe para buscar en el diccionario.</div>
        ) : filteredLexicon.length === 0 ? (
          <div className="text-xs md:text-sm text-slate-500">Sin resultados para esa busqueda.</div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {filteredLexicon.map((entry) => (
              <div key={entry.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                  className={`w-full p-3 md:p-4 flex items-start gap-3 hover:bg-slate-50 transition ${
                    expandedEntry === entry.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <Languages className="h-4 md:h-5 w-4 md:w-5 text-blue-600 flex-shrink-0 mt-0.5 md:mt-1" />
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-base md:text-lg break-words">{entry.lemma}</span>
                      <span className="text-xs md:text-sm font-medium text-slate-600 italic">({entry.transliteration})</span>
                      {entry.strong && (
                        <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">{entry.strong}</span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 mt-1 line-clamp-2">ES: {entry.gloss_es}</p>
                    <p className="text-xs md:text-sm text-slate-500 line-clamp-1">EN: {entry.gloss_en}</p>
                  </div>
                  <div className={`text-slate-400 flex-shrink-0 mt-0.5 md:mt-1 transition-transform ${expandedEntry === entry.id ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </button>

                {expandedEntry === entry.id && (
                  <div className="border-t border-slate-200 p-3 md:p-4 space-y-3 md:space-y-4 bg-slate-50">
                    {/* Primary & Theological Meanings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="bg-white rounded-lg p-3 md:p-4 border border-slate-200">
                        <p className="text-xs font-semibold text-slate-700 uppercase">Significado Primario</p>
                        <p className="text-slate-900 mt-2 text-sm md:text-base">{entry.primary_meaning || entry.origin_es}</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3 md:p-4 border border-amber-200">
                        <p className="text-xs font-semibold text-amber-900 uppercase">Significado Teologico</p>
                        <p className="text-amber-900 mt-2 text-sm md:text-base">{entry.theological_meaning || entry.usage_es}</p>
                      </div>
                    </div>

                    {/* Semantic Root & Biblical Frequency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="bg-purple-50 rounded-lg p-3 md:p-4 border border-purple-200">
                        <p className="text-xs font-semibold text-purple-900 uppercase">Raiz Sematica</p>
                        <p className="text-purple-900 mt-2 text-sm md:text-base font-mono">{entry.semantic_root || entry.lemma}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 md:p-4 border border-green-200">
                        <p className="text-xs font-semibold text-green-900 uppercase">Frecuencia Biblica</p>
                        <p className="text-green-900 mt-2 text-sm md:text-base">{entry.biblical_frequency || 'Múltiples apariciones'}</p>
                      </div>
                    </div>

                    {/* Semantic Evolution */}
                    {entry.semantic_evolution && (
                      <div className="bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-200">
                        <p className="text-xs font-semibold text-blue-900 uppercase mb-2">Evolucion Semantica</p>
                        <p className="text-blue-900 text-sm md:text-base">{entry.semantic_evolution}</p>
                      </div>
                    )}

                  {/* Related Words */}
                    {(entry.related_words?.length > 0 || entry.related?.length > 0) && (
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-2 uppercase">Familia de Palabras Relacionadas</p>
                        <div className="flex flex-wrap gap-2">
                          {(entry.related_words || entry.related || []).map((rel: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-100 text-purple-700 text-xs md:text-sm rounded-full"
                            >
                              {rel}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Appearances */}
                    {entry.key_appearances?.length > 0 && (
                      <div className="bg-white rounded-lg p-3 md:p-4 border border-slate-200">
                        <p className="text-xs font-semibold text-slate-700 mb-2 uppercase">Apariciones Clave en la Biblia</p>
                        <div className="space-y-1">
                          {entry.key_appearances.slice(0, 5).map((ref: string, idx: number) => (
                            <p key={idx} className="text-xs md:text-sm text-slate-600 font-mono">
                              • {ref}
                            </p>
                          ))}
                          {entry.key_appearances.length > 5 && (
                            <p className="text-xs md:text-sm text-slate-500 italic">
                              +{entry.key_appearances.length - 5} más apariciones
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Origin & Usage (if available) */}
                    {(entry.origin_es || entry.usage_es) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                        {entry.origin_es && (
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <p className="font-semibold text-slate-700 uppercase">Origen</p>
                            <p className="text-slate-900 mt-1">{entry.origin_es}</p>
                          </div>
                        )}
                        {entry.usage_es && (
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <p className="font-semibold text-slate-700 uppercase">Uso</p>
                            <p className="text-slate-900 mt-1">{entry.usage_es}</p>
                          </div>
                        )}
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
      <div className="space-y-2 md:space-y-3">
        <div className="text-xs md:text-sm font-semibold text-slate-700">Palabras del capitulo</div>
        {!hasChapterWords ? (
          <div className="text-xs md:text-sm text-slate-500">No hay palabras cargadas para este capitulo.</div>
        ) : (
          keyWords.map((word, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden"
            >
              {/* Header clickeable */}
              <button
                onClick={() => setExpandedWord(expandedWord === idx ? null : idx)}
                className={`w-full p-3 md:p-4 flex items-start gap-3 hover:bg-slate-50 transition ${
                  expandedWord === idx ? 'bg-blue-50' : ''
                }`}
              >
                <Languages className="h-4 md:h-5 w-4 md:w-5 text-blue-600 flex-shrink-0 mt-0.5 md:mt-1" />
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-base md:text-lg break-words">{word.hebrew as string}</span>
                    <span className="text-xs md:text-sm font-medium text-slate-700 italic">= &quot;{word.english as string}&quot;</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 mt-1 line-clamp-2">{word.literalMeaning as string}</p>
                </div>
                <div className={`text-slate-400 flex-shrink-0 mt-0.5 md:mt-1 transition-transform ${expandedWord === idx ? 'rotate-180' : ''}`}>
                  <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />
                </div>
              </button>

              {/* Contenido expandible */}
              {expandedWord === idx && (
                <div className="border-t border-slate-200 p-3 md:p-4 space-y-3 md:space-y-4 bg-slate-50">
                  {/* Significados */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="bg-white rounded-lg p-3 md:p-4 border border-slate-200">
                      <p className="text-xs font-semibold text-slate-700 uppercase">Significado Primario</p>
                      <p className="text-slate-900 mt-2 text-sm md:text-base">{word.primaryMeaning as string}</p>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-3 md:p-4 border border-amber-200">
                      <p className="text-xs font-semibold text-amber-900 uppercase">Significado Teologico</p>
                      <p className="text-amber-900 mt-2 text-sm md:text-base">{word.theologicalMeaning as string}</p>
                    </div>
                  </div>

                  {/* Raiz y cognados */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {(word.root as string | undefined) && (
                      <div className="bg-purple-50 rounded-lg p-3 md:p-4 border border-purple-200">
                        <p className="text-xs font-semibold text-purple-900 uppercase">Raiz Semitica</p>
                        <p className="text-purple-900 font-mono mt-2 font-bold text-sm md:text-base">{word.root as string}</p>
                      </div>
                    )}

                    {(word.biblicalFrequency as string | number | undefined) && (
                      <div className="bg-green-50 rounded-lg p-3 md:p-4 border border-green-200">
                        <p className="text-xs font-semibold text-green-900 uppercase">Frecuencia Biblica</p>
                        <p className="text-green-900 mt-2 text-sm md:text-base">{word.biblicalFrequency as string | number} apariciones</p>
                      </div>
                    )}
                  </div>

                  {/* Evolucion semantica */}
                  {(word.semanticEvolution as string | undefined) && (
                    <div className="bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-200">
                      <p className="text-xs font-semibold text-blue-900 mb-2 uppercase">Evolucion Semantica</p>
                      <p className="text-sm md:text-base text-blue-900">{word.semanticEvolution as string}</p>
                    </div>
                  )}

                  {/* Relaciones de campo (word family) */}
                  {(word.relatedWords as string[] | undefined)?.length && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-2 uppercase">Familia de Palabras Relacionadas</p>
                      <div className="flex flex-wrap gap-2">
                        {(word.relatedWords as string[]).map((rel: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs md:text-sm"
                          >
                            {rel}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Apariciones notables */}
                  {(word.keyAppearances as string[] | undefined)?.length && (
                    <div className="bg-white rounded-lg p-3 md:p-4 border border-slate-200">
                      <p className="text-xs font-semibold text-slate-700 mb-2 uppercase">Apariciones Clave en la Biblia</p>
                      <div className="space-y-1">
                        {(word.keyAppearances as string[]).slice(0, 5).map((ref: string, i: number) => (
                          <p key={i} className="text-xs md:text-sm text-slate-600 font-mono">
                            • {ref}
                          </p>
                        ))}
                        {(word.keyAppearances as string[]).length > 5 && (
                          <p className="text-xs md:text-sm text-slate-500 italic">
                            +{(word.keyAppearances as string[]).length - 5} más apariciones
                          </p>
                        )}
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
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4 flex items-start gap-3">
        <Zap className="h-4 md:h-5 w-4 md:w-5 text-yellow-600 flex-shrink-0 mt-0.5 md:mt-1" />
        <div>
          <p className="text-xs md:text-sm font-semibold text-yellow-900">Profundiza tu comprensión:</p>
          <p className="text-xs md:text-sm text-yellow-800 mt-1">
            La etimología no solo es académica. Entender las palabras originales abre capas enteras de 
            significado que se pierden en traducción. La raíz no es solo un concepto lingüístico — es la 
            puerta al significado teológico profundo que transforma tu lectura bíblica.
          </p>
        </div>
      </div>
    </div>
  );
}
