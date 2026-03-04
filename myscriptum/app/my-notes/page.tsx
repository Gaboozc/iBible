'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { MyNotesView } from '@/components/MyNotesView';
import { useTheme, getColors } from '@/lib/contexts/ThemeContext';

export default function MyNotesPage() {
  const { mode } = useTheme();
  const palette = getColors(mode);

  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.bg.primary, color: palette.text.primary }}>
      {/* Header */}
      <div className="border-b" style={{ backgroundColor: palette.bg.header, borderColor: palette.accent.primary }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-80 transition mb-4"
            style={{ backgroundColor: palette.accent.secondary, color: palette.text.light }}
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </Link>
          <h1 className="text-3xl font-bold">📝 Mis Notas</h1>
          <p className="text-sm mt-2" style={{ color: palette.text.secondary }}>
            Todas tus notas organizadas por libro, capítulo y versículo
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <MyNotesView />
      </div>
    </div>
  );
}
