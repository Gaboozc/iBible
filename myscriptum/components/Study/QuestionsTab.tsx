'use client';

import { Eye, Lightbulb, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ReflectionQuestion {
  stage: string;
  question: string;
  guidance: string;
}

interface QuestionsTabProps {
  questions?: ReflectionQuestion[];
  isActive?: boolean;
}

const stageConfig = {
  observation: {
    icon: Eye,
    color: 'border-blue-500 bg-blue-50',
    badgeColor: 'bg-blue-100 text-blue-700',
    title: '1. Observación',
    subtitle: '¿Qué dice el texto?',
    description: 'Identifica personajes, lugares, palabras repetidas y verbos de acción. No supongas nada todavía.',
  },
  interpretation: {
    icon: Lightbulb,
    color: 'border-amber-500 bg-amber-50',
    badgeColor: 'bg-amber-100 text-amber-700',
    title: '2. Interpretación',
    subtitle: '¿Qué significa?',
    description: 'Investiga el contexto histórico y cultural. ¿A quién se le escribió? ¿Por qué?',
  },
  application: {
    icon: Target,
    color: 'border-green-500 bg-green-50',
    badgeColor: 'bg-green-100 text-green-700',
    title: '3. Aplicación',
    subtitle: '¿Qué significa para mí?',
    description: '¿Cómo cambia esto mi forma de pensar o actuar hoy?',
  },
};

type StageKey = keyof typeof stageConfig;

export function QuestionsTab({ questions = [], isActive = true }: QuestionsTabProps) {
  if (!questions || questions.length === 0) {
    return (
      <div className="py-12 text-center text-slate-600">
        <p className="text-lg">Preguntas de reflexión no disponibles</p>
        <p className="text-sm mt-2">Esta funcionalidad será añadida próximamente</p>
      </div>
    );
  }

  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  const questionsByStage = questions.reduce((acc, q, idx) => {
    if (!acc[q.stage]) acc[q.stage] = [];
    acc[q.stage].push({ ...q, originalIndex: idx });
    return acc;
  }, {} as Record<string, Array<ReflectionQuestion & { originalIndex: number }>>);

  const toggleQuestion = (idx: number) => {
    setExpandedQuestion(expandedQuestion === idx ? null : idx);
  };

  const updateAnswer = (idx: number, value: string) => {
    setUserAnswers({ ...userAnswers, [idx]: value });
  };

  return (
    <div className="space-y-8">
      {/* Metodología Inductiva Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 space-y-2">
        <h2 className="text-2xl font-bold">Método Inductivo de Estudio Bíblico</h2>
        <p className="text-blue-50">
          La técnica &quot;reina&quot; que permite que el texto hable por sí mismo antes de sacar conclusiones personales.
        </p>
      </div>

      {/* Stages */}
      {(['observation', 'interpretation', 'application'] as StageKey[]).map((stageKey) => {
        const stage = stageConfig[stageKey];
        const Icon = stage.icon;
        const stageQuestions = questionsByStage[stageKey] || [];

        return (
          <div key={stageKey} className="space-y-4">
            {/* Stage Header */}
            <div className={`border-l-4 ${stage.color} rounded-r-lg p-4`}>
              <div className="flex items-center gap-3 mb-2">
                <Icon className="h-6 w-6" />
                <h3 className="text-xl font-bold text-slate-900">{stage.title}</h3>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${stage.badgeColor}`}>
                  {stageQuestions.length} preguntas
                </span>
              </div>
              <p className="text-lg font-semibold text-slate-800 mb-1">{stage.subtitle}</p>
              <p className="text-sm text-slate-600">{stage.description}</p>
            </div>

            {/* Questions List */}
            <div className="space-y-3 ml-4">
              {stageQuestions.map((q, localIdx) => {
                const idx = q.originalIndex;
                const isExpanded = expandedQuestion === idx;

                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Question Header */}
                    <button
                      onClick={() => toggleQuestion(idx)}
                      className="w-full text-left p-4 bg-white hover:bg-slate-50 transition-colors flex items-start justify-between gap-3"
                    >
                      <div className="flex-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${stage.badgeColor} mr-2`}>
                          Pregunta {localIdx + 1}
                        </span>
                        <p className="font-medium text-slate-900 mt-1">{q.question}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                      )}
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-slate-50 p-4 space-y-4">
                        {/* Guidance */}
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <p className="text-xs font-semibold text-blue-900 mb-1">💡 Guía para responder:</p>
                          <p className="text-sm text-blue-800">{q.guidance}</p>
                        </div>

                        {/* Answer Textarea */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Tu respuesta:
                          </label>
                          <textarea
                            value={userAnswers[idx] || ''}
                            onChange={(e) => updateAnswer(idx, e.target.value)}
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[120px] p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            {userAnswers[idx]?.length || 0} caracteres
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Guardar respuesta
                          </button>
                          <button
                            onClick={() => updateAnswer(idx, '')}
                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                          >
                            Limpiar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Study Methodology Info */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-300 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">📚 Otras Metodologías de Estudio</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Método Sintético</h4>
            <p className="text-sm text-slate-600">
              Estudia el libro completo de una vez para entender el argumento general del autor.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Método Biográfico</h4>
            <p className="text-sm text-slate-600">
              Ideal para aprender de las virtudes y errores de personajes específicos.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Lectio Divina</h4>
            <p className="text-sm text-slate-600">
              Técnica contemplativa antigua enfocada en la meditación espiritual.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Herramientas Esenciales</h4>
            <p className="text-sm text-slate-600">
              Versiones múltiples, comentarios bíblicos y concordancias para profundizar.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">Progreso de respuestas</span>
          <span className="text-sm text-slate-500">
            {Object.keys(userAnswers).filter((k) => userAnswers[parseInt(k)].trim().length > 0).length} de {questions.length}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full transition-all"
            style={{
              width: `${(Object.keys(userAnswers).filter((k) => userAnswers[parseInt(k)].trim().length > 0).length / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
