'use client';

import { Lightbulb, Repeat } from 'lucide-react';

interface StructuralSection {
  verses: string;
  title: string;
  description: string;
  significance: string;
}

interface RepeatedWord {
  word: string;
  count: number;
  significance: string;
}

interface StructuralAnalysis {
  title: string;
  sections: StructuralSection[];
  repeatedWords: RepeatedWord[];
}

interface AnalysisTabProps {
  structuralAnalysis?: StructuralAnalysis;
  isActive?: boolean;
}

export function AnalysisTab({ structuralAnalysis, isActive = true }: AnalysisTabProps) {
  if (!structuralAnalysis) {
    return (
      <div className="py-12 text-center text-slate-600">
        <p className="text-lg">Análisis no disponible</p>
        <p className="text-sm mt-2">Esta funcionalidad será añadida próximamente</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{structuralAnalysis.title}</h2>
        <p className="text-sm sm:text-base text-slate-600">
          División literaria del capítulo y su significado teológico
        </p>
      </div>

      {/* Secciones */}
      <div className="space-y-3 sm:space-y-4">
        {structuralAnalysis.sections.map((section, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex-shrink-0">
                <span className="text-xs sm:text-sm font-bold text-blue-600">{idx + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  {section.title}
                  <span className="text-xs sm:text-sm font-normal text-slate-500 ml-2">
                    ({section.verses})
                  </span>
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 sm:ml-11 leading-relaxed">{section.description}</p>

            <div className="sm:ml-11 bg-amber-50 border border-amber-200 rounded p-3">
              <p className="text-xs sm:text-sm">
                <span className="font-semibold text-amber-900">Significado:</span>{' '}
                <span className="text-amber-800">{section.significance}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Palabras Repetidas */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Repeat className="h-5 w-5 text-purple-600" />
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">Palabras y Patrones Repetidos</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {structuralAnalysis.repeatedWords.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 sm:p-4 border border-purple-200 space-y-2">
              <p className="text-sm sm:text-base font-semibold text-slate-900">{item.word}</p>
              <div className="bg-purple-100/50 rounded p-2">
                <p className="text-[11px] sm:text-xs font-mono text-purple-900 font-bold">
                  Apariciones: {item.count}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{item.significance}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Consejo de estudio */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
        <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-1" />
        <div>
          <p className="text-xs sm:text-sm text-blue-900 font-medium">Consejo de estudio:</p>
          <p className="text-xs sm:text-sm text-blue-800 mt-1">
            Nota cómo la estructura va del caos (la visión) hacia el orden (el trono claramente identificado). 
            Esto refleja el viaje teológico: desde experiencia abrumadora hasta comprensión de la soberanía 
            divina.
          </p>
        </div>
      </div>
    </div>
  );
}
