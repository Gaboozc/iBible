import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export function AuthHeader() {
  return (
    <div className="text-center space-y-2 mb-8">
      <div className="flex items-center justify-center gap-2">
        <BookOpen className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-900">MyScriptum</h1>
      </div>
      <p className="text-slate-600">Formación bíblica profunda y accesible</p>
    </div>
  );
}

export function AuthFooter() {
  return (
    <div className="text-center text-sm text-slate-600 space-y-2">
      <p>
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Regístrate aquí
        </Link>
      </p>
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-200">
        <a href="#" className="hover:text-slate-900 transition">
          Política de Privacidad
        </a>
        <span className="text-slate-300">•</span>
        <a href="#" className="hover:text-slate-900 transition">
          Términos de Uso
        </a>
        <span className="text-slate-300">•</span>
        <a href="#" className="hover:text-slate-900 transition">
          Soporte
        </a>
      </div>
    </div>
  );
}
