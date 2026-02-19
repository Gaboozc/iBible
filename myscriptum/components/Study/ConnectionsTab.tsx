'use client';

import { Link2, History, BookOpen, Zap, BookMarked } from 'lucide-react';

interface Connection {
  type: ConnectionType | string;
  reference: string;
  title: string;
  description: string;
}

interface ConnectionsTabProps {
  connections?: Connection[];
  isActive?: boolean;
}

type ConnectionType = 'historical' | 'thematic' | 'prophetic' | 'typological' | 'lexical';

const connectionTypeConfig: Record<ConnectionType, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  historical: { icon: History, color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'Histórica' },
  thematic: { icon: BookOpen, color: 'bg-purple-100 text-purple-700 border-purple-300', label: 'Temática' },
  prophetic: { icon: BookMarked, color: 'bg-red-100 text-red-700 border-red-300', label: 'Profética' },
  typological: { icon: Zap, color: 'bg-amber-100 text-amber-700 border-amber-300', label: 'Tipológica' },
  lexical: { icon: Link2, color: 'bg-green-100 text-green-700 border-green-300', label: 'Léxica' },
};

export function ConnectionsTab({ connections = [], isActive = true }: ConnectionsTabProps) {
  if (!connections || connections.length === 0) {
    return (
      <div className="py-12 text-center text-slate-600">
        <p className="text-lg">Conexiones no disponibles</p>
        <p className="text-sm mt-2">Esta funcionalidad será añadida próximamente</p>
      </div>
    );
  }
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Conexiones Bíblicas:</span> La Biblia es un libro 
          interconectado. Aquí encontramos textos relacionados que enriquecen la comprensión de este capítulo.
        </p>
      </div>

      {/* Conexiones agrupadas por tipo */}
      <div className="space-y-4 sm:space-y-6">
        {Object.entries(connectionTypeConfig).map(([type, config]) => {
          const Icon = config.icon;
          const filteredConnections = connections.filter((c) => c.type === type);

          if (filteredConnections.length === 0) return null;

          return (
            <div key={type}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  Conexiones {config.label}
                </h3>
                <span className="ml-auto px-2 py-1 bg-slate-200 text-slate-700 rounded-full text-[10px] sm:text-xs font-medium">
                  {filteredConnections.length}
                </span>
              </div>

              <div className="grid gap-3">
                {filteredConnections.map((conn, idx) => (
                  <div
                    key={idx}
                    className={`border-2 rounded-lg p-3 sm:p-4 space-y-2 ${config.color}`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-xs sm:text-sm">{conn.title}</h4>
                      <code className="text-[10px] sm:text-xs px-2 py-1 bg-white/50 rounded font-mono">
                        {conn.reference}
                      </code>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed">{conn.description}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mapa conceptual */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-300 rounded-lg p-4 sm:p-6 space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900">Red de Conexiones</h3>
        <div className="bg-white rounded p-3 sm:p-4 border-2 border-dashed border-slate-300 text-center text-slate-500 py-6 sm:py-8">
          <p className="text-xs sm:text-sm font-medium mb-2">Visualización interactiva (próximamente)</p>
          <p className="text-[11px] sm:text-xs">
            Aquí irá un gráfico interactivo mostrando cómo se conectan todos los textos
          </p>
        </div>
      </div>
    </div>
  );
}
