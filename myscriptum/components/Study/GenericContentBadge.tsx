'use client';

import { AlertTriangle } from 'lucide-react';

interface GenericContentBadgeProps {
  tabLabel: string;
}

export function GenericContentBadge({ tabLabel }: GenericContentBadgeProps) {
  return (
    <div className="mb-4 sm:mb-6 border border-amber-300 bg-amber-50 text-amber-900 rounded-lg p-3 sm:p-4 flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="text-xs sm:text-sm leading-relaxed">
        <p className="font-semibold">🚧 Contenido genérico — pendiente de curación</p>
        <p className="mt-1">
          Este {tabLabel.toLowerCase()} aún no ha sido curado a mano; se muestra como marcador de posición generado automáticamente y puede contener imprecisiones. Estamos trabajando para reemplazarlo con estudio bíblico riguroso.
        </p>
      </div>
    </div>
  );
}
