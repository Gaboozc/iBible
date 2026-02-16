import type { Metadata } from 'next';
import { LoginForm } from '@/components/Auth/LoginForm';
import { OAuthButtons } from '@/components/Auth/OAuthButtons';
import { AuthHeader, AuthFooter } from '@/components/Auth/AuthLayout';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | MyScriptum',
  description: 'Inicia sesión en MyScriptum para acceder a tu formación bíblica personalizada',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Contenedor blanco con sombra */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Header */}
          <AuthHeader />

          {/* Formulario */}
          <LoginForm />

          {/* OAuth */}
          <OAuthButtons isLoading={false} />

          {/* Footer */}
          <AuthFooter />
        </div>

        {/* Texto informativo adicional */}
        <div className="mt-6 text-center text-sm text-slate-600">
          <p>
            MyScriptum es una plataforma para{' '}
            <span className="font-medium text-slate-900">estudio bíblico profundo</span> con
            contexto histórico, análisis etimológico y reflexión guiada.
          </p>
        </div>
      </div>
    </div>
  );
}
