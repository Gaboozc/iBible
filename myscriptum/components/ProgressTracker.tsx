'use client';

import { useState } from 'react';
import { BookOpen, Target, TrendingUp, Flame } from 'lucide-react';

interface ReadingProgress {
  chaptersRead: number;
  booksStarted: number;
  versiclesRead: number;
  totalProgress: number;
  oldTestamentProgress: number;
  newTestamentProgress: number;
}

const totalChapters = {
  oldTestament: 929,
  newTestament: 260,
  total: 1189,
};

export function ProgressTracker() {
  const [progress] = useState<ReadingProgress>({
    chaptersRead: 23,
    booksStarted: 5,
    versiclesRead: 312,
    totalProgress: Math.round((23 / totalChapters.total) * 100),
    oldTestamentProgress: Math.round((18 / totalChapters.oldTestament) * 100),
    newTestamentProgress: Math.round((5 / totalChapters.newTestament) * 100),
  });

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          Mi Progreso de Lectura
        </h2>
        <p className="text-slate-600">Biblia Reina Valera 1909 (KJV)</p>
      </div>

      {/* Barra de progreso general */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Progreso Total</span>
          <span className="text-lg font-bold text-blue-600">{progress.totalProgress}%</span>
        </div>
        <div className="w-full bg-slate-300 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-700 h-full transition-all duration-500 shadow-lg"
            style={{ width: `${progress.totalProgress}%` }}
          ></div>
        </div>
        <div className="text-sm text-slate-600">
          <strong>{progress.chaptersRead}</strong> de {totalChapters.total} capítulos leídos
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-3xl font-bold text-blue-600">{progress.chaptersRead}</span>
          </div>
          <div className="text-xs font-medium text-slate-600">Capítulos Leídos</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-5 w-5 text-amber-600" />
            <span className="text-3xl font-bold text-amber-600">{progress.booksStarted}</span>
          </div>
          <div className="text-xs font-medium text-slate-600">Libros Iniciados</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-3xl font-bold text-green-600">{progress.versiclesRead}</span>
          </div>
          <div className="text-xs font-medium text-slate-600">Versículos Leídos</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-5 w-5 text-red-600" />
            <span className="text-3xl font-bold text-red-600">12</span>
          </div>
          <div className="text-xs font-medium text-slate-600">Días Activo</div>
        </div>
      </div>

      {/* Progreso por Testamento */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Progreso por Testamento</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Antiguo Testamento</span>
            <span className="text-sm font-bold text-purple-600">{progress.oldTestamentProgress}%</span>
          </div>
          <div className="w-full bg-slate-300 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all duration-500"
              style={{ width: `${progress.oldTestamentProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-600">18 de {totalChapters.oldTestament} capítulos</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Nuevo Testamento</span>
            <span className="text-sm font-bold text-emerald-600">{progress.newTestamentProgress}%</span>
          </div>
          <div className="w-full bg-slate-300 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full transition-all duration-500"
              style={{ width: `${progress.newTestamentProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-600">5 de {totalChapters.newTestament} capítulos</div>
        </div>
      </div>

      {/* Meta y motivación */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-900 font-medium">
          🎯 <strong>¡Felicidades!</strong> Has iniciado tu viaje a través de la Biblia. Supera {totalChapters.total - progress.chaptersRead} capítulos más para completar la lectura completa.
        </p>
      </div>
    </div>
  );
}
