'use client';

import { Search, BookOpen, ExternalLink } from 'lucide-react';
import { useState, useEffect, useTransition } from 'react';
import { searchLexiconAction } from '@/lib/actions/lexicon';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import type { RealLexiconEntry } from '@/data/real-lexicon';

interface LexiconTabProps {
  isActive?: boolean;
}

export function LexiconTab({}: LexiconTabProps) {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<RealLexiconEntry | null>(null);
  const [results, setResults] = useState<RealLexiconEntry[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed || trimmed.length < 2) {
      return;
    }

    startTransition(async () => {
      try {
        const data = await searchLexiconAction(trimmed);
        setResults(data);
      } catch (err) {
        console.error('Lexicon search error:', err);
      }
    });
  }, [query]);

  // Clear results when query is too short
  const displayResults = query.trim().length >= 2 ? results : [];

  const isSpanish = language === 'es';
  
  const getText = (es: string, en: string) => isSpanish ? es : en;

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-purple-900">
              {getText('Lexicón Bíblico Real', 'Real Biblical Lexicon')}
            </h3>
            <p className="text-xs sm:text-sm text-purple-700 mt-1">
              {getText(
                '22,720 palabras del hebreo y griego bíblico. Busca en español o inglés.',
                '22,720 words from biblical Hebrew and Greek. Search in Spanish or English.'
              )}
            </p>
            <p className="text-[10px] sm:text-xs text-purple-600 mt-2">
              {getText(
                'Fuente: STEPBible.org (CC BY 4.0)',
                'Source: STEPBible.org (CC BY 4.0)'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getText(
              'Buscar: amor, paz, fe, light, grace...',
              'Search: love, peace, faith, luz, gracia...'
            )}
            className="w-full pl-9 pr-3 py-2 sm:py-2.5 border border-slate-300 rounded-lg text-sm sm:text-base text-slate-900 placeholder-slate-500 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Search Tips */}
        {query.trim().length === 0 && (
          <div className="text-xs sm:text-sm text-slate-500 space-y-1">
            <p className="font-medium">
              {getText('💡 Ejemplos de búsqueda:', '💡 Search examples:')}
            </p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>{getText('amor, love → אַהֲבָה (ahavah), ἀγάπη (agape)', 'love, amor → אַהֲבָה (ahavah), ἀγάπη (agape)')}</li>
              <li>{getText('paz, peace → שָׁלוֹם (shalom), εἰρήνη (eirene)', 'peace, paz → שָׁלוֹם (shalom), εἰρήνη (eirene)')}</li>
              <li>{getText('palabra, word → דָּבָר (dabar), λόγος (logos)', 'word, palabra → דָּבָר (dabar), λόγος (logos)')}</li>
            </ul>
          </div>
        )}

        {/* Results */}
        {query.trim().length > 0 && (
          <div className="space-y-2">
            {displayResults.length === 0 ? (
              <div className="text-xs sm:text-sm text-slate-500 py-4 text-center">
                {isPending ? getText('Buscando...', 'Searching...') : getText(
                  'No se encontraron resultados. Intenta con otra palabra.',
                  'No results found. Try another word.'
                )}
              </div>
            ) : (
              <>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {getText(
                    `${displayResults.length} ${displayResults.length === 1 ? 'resultado' : 'resultados'} encontrados:`,
                    `${displayResults.length} ${displayResults.length === 1 ? 'result' : 'results'} found:`
                  )}
                </p>
                <div className="space-y-2 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1">
                  {displayResults.map((entry) => (
                    <button
                      key={entry.strong}
                      onClick={() => setSelectedEntry(selectedEntry?.strong === entry.strong ? null : entry)}
                      className={`w-full text-left border rounded-lg p-3 sm:p-4 transition-all ${
                        selectedEntry?.strong === entry.strong
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-slate-200 hover:border-purple-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                          <span className="text-lg sm:text-2xl">{entry.language === 'hebrew' ? '🕎' : '✝️'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base sm:text-lg font-bold text-slate-900 break-words">
                              {entry.lemma}
                            </span>
                            <span className="text-xs sm:text-sm text-purple-600 font-medium">
                              {entry.transliteration}
                            </span>
                            <span className="text-[10px] sm:text-xs font-mono bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded">
                              {entry.strong}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2">
                            <span className="font-medium">{isSpanish ? 'ES' : 'EN'}:</span> {isSpanish ? entry.gloss_es : entry.gloss_en}
                          </p>
                          {selectedEntry?.strong === entry.strong && (
                            <div className="mt-3 pt-3 border-t border-purple-200 space-y-2">
                              {entry.gloss_es && (
                                <p className="text-xs sm:text-sm text-slate-700">
                                  <span className="font-semibold">Español:</span> {entry.gloss_es}
                                </p>
                              )}
                              {entry.gloss_en && (
                                <p className="text-xs sm:text-sm text-slate-700">
                                  <span className="font-semibold">English:</span> {entry.gloss_en}
                                </p>
                              )}
                              {entry.type && (
                                <p className="text-xs sm:text-sm text-slate-500">
                                  <span className="font-semibold">{getText('Tipo:', 'Type:')}</span> {entry.type}
                                </p>
                              )}
                              <div className="flex items-center gap-2 text-xs text-purple-600 mt-2">
                                <ExternalLink className="h-3 w-3" />
                                <a
                                  href={`https://www.blueletterbible.org/lexicon/${entry.strong}/`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {getText('Ver más en Blue Letter Bible', 'View more on Blue Letter Bible')}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-[10px] sm:text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-2 sm:p-3">
        <p>
          {getText(
            '📚 Datos de STEPBible.org bajo licencia CC BY 4.0. Este lexicón contiene el vocabulario completo del Antiguo y Nuevo Testamento.',
            '📚 Data from STEPBible.org under CC BY 4.0 license. This lexicon contains the complete vocabulary of the Old and New Testament.'
          )}
        </p>
      </div>
    </div>
  );
}
