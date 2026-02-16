'use client';

import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface TaskItem {
  id: number;
  title: string;
  status: 'completed' | 'in-progress' | 'not-started';
}

const tasks: TaskItem[] = [
  { id: 1, title: 'Crear pantalla de login/registro', status: 'completed' },
  { id: 2, title: 'Crear layout de estudio con tabs', status: 'in-progress' },
  { id: 3, title: 'Implementar dato mock Ezequiel 1', status: 'not-started' },
  { id: 4, title: 'Tab Contexto Histórico', status: 'not-started' },
  { id: 5, title: 'Tab Texto Bíblico versículos', status: 'not-started' },
  { id: 6, title: 'Tab Análisis Estructural', status: 'not-started' },
  { id: 7, title: 'Tab Etimología palabras clave', status: 'not-started' },
  { id: 8, title: 'Tab Conexiones Bíblicas', status: 'not-started' },
  { id: 9, title: 'Tab Preguntas Reflexivas', status: 'not-started' },
  { id: 10, title: 'Biblioteca navegación Testamentos', status: 'not-started' },
];

export function ProgressTracker() {
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const percentage = Math.round((completed / tasks.length) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">📊 Progreso del Desarrollo</h2>
        <p className="text-slate-600">MyScriptum - Tracker de tareas</p>
      </div>

      {/* Barra de progreso */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Completado</span>
          <span className="text-sm font-bold text-blue-600">{percentage}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-slate-600">
          {completed} de {tasks.length} tareas completadas
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{completed}</div>
          <div className="text-xs text-green-700 font-medium">Completadas</div>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="text-2xl font-bold text-amber-600">{inProgress}</div>
          <div className="text-xs text-amber-700 font-medium">En Progreso</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="text-2xl font-bold text-slate-600">{tasks.length - completed - inProgress}</div>
          <div className="text-xs text-slate-700 font-medium">Por Hacer</div>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <h3 className="font-semibold text-slate-900">Tareas en el Sprint:</h3>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 p-3 rounded-lg border ${
              task.status === 'completed'
                ? 'bg-green-50 border-green-200'
                : task.status === 'in-progress'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-slate-50 border-slate-200'
            }`}
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : task.status === 'in-progress' ? (
              <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5 animate-spin" />
            ) : (
              <Circle className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  task.status === 'completed'
                    ? 'text-green-900 line-through'
                    : 'text-slate-900'
                }`}
              >
                {task.id}. {task.title}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {task.status === 'completed'
                  ? '✅ Completada'
                  : task.status === 'in-progress'
                    ? '⏳ En ejecución'
                    : '⭕ Pendiente'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-600">
          <strong>Nota:</strong> Todo el desarrollo es frontend por ahora. Backend y Supabase vienen después.
        </p>
      </div>
    </div>
  );
}
