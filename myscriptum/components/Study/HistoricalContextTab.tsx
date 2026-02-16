'use client';

import { Globe, Clock, Users, Building2, MapPin, BookMarked } from 'lucide-react';

interface HistoricalContext {
  period: string;
  dominantEmpire: string;
  kingName: string;
  kingRegion: string;
  activeProphets: string[];
  templeStatus: string;
  location: string;
  summary: string;
  spiritualContext: string;
}

interface HistoricalContextTabProps {
  context?: HistoricalContext;
  isActive?: boolean;
}

export function HistoricalContextTab({ context, isActive = true }: HistoricalContextTabProps) {
  if (!context) {
    return (
      <div className="py-12 text-center text-slate-600">
        <p className="text-lg">Contexto histórico no disponible</p>
        <p className="text-sm mt-2">Esta funcionalidad será añadida próximamente</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen narrativo */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <BookMarked className="h-5 w-5 text-blue-600" />
          Marco Histórico
        </h3>
        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
          {context.summary}
        </p>
      </section>

      {/* Grid de información */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Período */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <h4 className="font-semibold text-slate-900">Período</h4>
          </div>
          <p className="text-slate-700 font-mono">{context.period}</p>
        </div>

        {/* Imperio */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold text-slate-900">Imperio Dominante</h4>
          </div>
          <p className="text-slate-700">{context.dominantEmpire}</p>
        </div>

        {/* Rey */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-red-600" />
            <h4 className="font-semibold text-slate-900">Rey en Turno</h4>
          </div>
          <p className="text-slate-700">
            {context.kingName} de {context.kingRegion}
          </p>
        </div>

        {/* Profetas activos */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-slate-900">Profetas Activos</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {context.activeProphets.map((prophet: string) => (
              <span
                key={prophet}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {prophet}
              </span>
            ))}
          </div>
        </div>

        {/* Templo */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-orange-600" />
            <h4 className="font-semibold text-slate-900">Estado del Templo</h4>
          </div>
          <p className="text-slate-700 text-sm">{context.templeStatus}</p>
        </div>

        {/* Ubicación */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-600" />
            <h4 className="font-semibold text-slate-900">Ubicación</h4>
          </div>
          <p className="text-slate-700 text-sm">{context.location}</p>
        </div>
      </div>

      {/* Estado espiritual */}
      <section className="bg-amber-50 border border-amber-200 rounded-lg p-6 space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">Estado Espiritual del Pueblo</h3>
        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
          {context.spiritualContext}
        </p>
      </section>
    </div>
  );
}
