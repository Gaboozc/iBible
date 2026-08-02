'use client';

import { useMemo } from 'react';
import { Link2, History, BookOpen, Zap, BookMarked } from 'lucide-react';
import { ReactFlow, Background, Controls, MarkerType, useReactFlow, ReactFlowProvider, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Connection } from '@/lib/bible/analysis-loader';
import { GenericContentBadge } from './GenericContentBadge';

interface ConnectionsTabProps {
  connections?: Connection[];
  currentBook?: string;
  currentChapter?: number;
  isGeneric?: boolean;
}

type ConnectionType = 'historical' | 'thematic' | 'prophetic' | 'typological' | 'lexical';

const connectionTypeConfig: Record<ConnectionType, {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  label: string;
  nodeBg: string;
  nodeBorder: string;
  edge: string;
}> = {
  historical:  { icon: History,    color: 'bg-blue-100 text-blue-700 border-blue-300',       label: 'Histórica',   nodeBg: '#dbeafe', nodeBorder: '#60a5fa', edge: '#3b82f6' },
  thematic:    { icon: BookOpen,   color: 'bg-purple-100 text-purple-700 border-purple-300', label: 'Temática',    nodeBg: '#ede9fe', nodeBorder: '#a78bfa', edge: '#8b5cf6' },
  prophetic:   { icon: BookMarked, color: 'bg-red-100 text-red-700 border-red-300',           label: 'Profética',   nodeBg: '#fee2e2', nodeBorder: '#f87171', edge: '#ef4444' },
  typological: { icon: Zap,        color: 'bg-amber-100 text-amber-700 border-amber-300',     label: 'Tipológica',  nodeBg: '#fef3c7', nodeBorder: '#fbbf24', edge: '#f59e0b' },
  lexical:     { icon: Link2,      color: 'bg-green-100 text-green-700 border-green-300',     label: 'Léxica',      nodeBg: '#dcfce7', nodeBorder: '#4ade80', edge: '#22c55e' },
};

function buildGraph(
  connections: Connection[],
  currentBook: string,
  currentChapter: number
): { nodes: Node[]; edges: Edge[] } {
  const centerId = 'chapter:current';
  const centerLabel = currentBook && currentChapter
    ? `${currentBook.charAt(0).toUpperCase() + currentBook.slice(1)} ${currentChapter}`
    : 'Este capítulo';

  const nodes: Node[] = [
    {
      id: centerId,
      position: { x: 0, y: 0 },
      data: { label: centerLabel },
      style: {
        background: '#0f172a',
        color: '#ffffff',
        border: '2px solid #1e293b',
        borderRadius: 12,
        padding: '10px 14px',
        fontWeight: 600,
        fontSize: 13,
      },
    },
  ];

  const edges: Edge[] = [];
  const count = connections.length;
  const radius = Math.max(180, 40 + count * 12);

  connections.forEach((conn, i) => {
    const cfg = connectionTypeConfig[conn.type as ConnectionType];
    const angle = (i / Math.max(count, 1)) * 2 * Math.PI - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const id = `conn:${i}`;

    nodes.push({
      id,
      position: { x, y },
      data: { label: `${conn.reference}\n${conn.title}` },
      style: {
        background: cfg?.nodeBg ?? '#e2e8f0',
        border: `2px solid ${cfg?.nodeBorder ?? '#94a3b8'}`,
        color: '#0f172a',
        borderRadius: 10,
        padding: '8px 10px',
        fontSize: 11,
        whiteSpace: 'pre-line',
        maxWidth: 180,
        textAlign: 'center' as const,
      },
    });

    edges.push({
      id: `e:${i}`,
      source: centerId,
      target: id,
      style: { stroke: cfg?.edge ?? '#94a3b8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: cfg?.edge ?? '#94a3b8' },
    });
  });

  return { nodes, edges };
}

function ConnectionGraph({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const { fitView } = useReactFlow();
  const containerRef = useMemo(() => ({ current: null as HTMLDivElement | null }), []);

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        if (!el) return;
        // Re-fit whenever the container size changes (e.g. tab shown, viewport resized).
        const ro = new ResizeObserver(() => {
          const { width, height } = el.getBoundingClientRect();
          if (width > 0 && height > 0) {
            requestAnimationFrame(() => fitView({ padding: 0.2, duration: 200 }));
          }
        });
        ro.observe(el);
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} size={1} color="#cbd5e1" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export function ConnectionsTab({ connections = [], currentBook = '', currentChapter = 0, isGeneric = false }: ConnectionsTabProps) {
  const { nodes, edges } = useMemo(
    () => buildGraph(connections, currentBook, currentChapter),
    [connections, currentBook, currentChapter]
  );

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
      {isGeneric && <GenericContentBadge tabLabel="conexiones bíblicas" />}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Conexiones Bíblicas:</span> La Biblia es un libro
          interconectado. Aquí encontramos textos relacionados que enriquecen la comprensión de este capítulo.
        </p>
      </div>

      {/* Red de Conexiones — grafo interactivo */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-3 sm:px-4 py-2 border-b border-slate-200 flex flex-wrap items-center gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">Red de Conexiones</h3>
          <div className="flex flex-wrap gap-2 ml-auto">
            {Object.entries(connectionTypeConfig).map(([type, cfg]) => (
              <span
                key={type}
                className="inline-flex items-center gap-1 text-[10px] sm:text-xs px-2 py-0.5 rounded-full border"
                style={{ background: cfg.nodeBg, borderColor: cfg.nodeBorder, color: '#0f172a' }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.edge }} />
                {cfg.label}
              </span>
            ))}
          </div>
        </div>
        <div className="h-[360px] sm:h-[440px] bg-slate-50">
          <ReactFlowProvider>
            <ConnectionGraph nodes={nodes} edges={edges} />
          </ReactFlowProvider>
        </div>
      </div>

      {/* Listado agrupado por tipo (fallback semántico y accesible) */}
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
                  <div key={idx} className={`border-2 rounded-lg p-3 sm:p-4 space-y-2 ${config.color}`}>
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-semibold text-xs sm:text-sm">{conn.title}</h4>
                      <code className="text-[10px] sm:text-xs px-2 py-1 bg-white/50 rounded font-mono whitespace-nowrap">
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
    </div>
  );
}
