import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/Auth/RegisterForm';
import { OAuthButtons } from '@/components/Auth/OAuthButtons';
import { AuthHeader } from '@/components/Auth/AuthLayout';

export const metadata: Metadata = {
  title: 'Crear Cuenta | MyScriptum',
  description: 'Regístrate en MyScriptum para comenzar tu formación bíblica profunda',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Contenedor blanco con sombra */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Header */}
          <AuthHeader />

          {/* Formulario */}
          <RegisterForm />

          {/* OAuth */}
          <OAuthButtons isLoading={false} />

          {/* Footer */}
          <div className="text-center text-sm text-slate-600 space-y-2">
            <p>
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Texto informativo adicional */}
        <div className="mt-6 text-center text-sm text-slate-600">
          <p>
            Únete a miles de estudiantes que profundizan en la Biblia con
            <span className="font-medium text-slate-900"> contexto histórico y análisis riguroso</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
