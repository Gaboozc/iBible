import { ProgressTracker } from '@/components/ProgressTracker';

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
            ← Volver al inicio
          </a>
        </div>
        <ProgressTracker />
      </div>
    </div>
  );
}
