'use client';

import { Chrome, Zap, Apple } from 'lucide-react';

interface OAuthProviderProps {
  isLoading: boolean;
}

export function OAuthButtons({ isLoading }: OAuthProviderProps) {


  const providers = [
    {
      name: 'Google',
      icon: Chrome,
      color: 'bg-white border-slate-300 hover:bg-slate-50',
      textColor: 'text-slate-700',
      action: () => console.log('Google OAuth'),
    },
    {
      name: 'Microsoft',
      icon: Zap,
      color: 'bg-white border-slate-300 hover:bg-slate-50',
      textColor: 'text-slate-700',
      action: () => console.log('Microsoft OAuth'),
    },
    {
      name: 'Apple',
      icon: Apple,
      color: 'bg-white border-slate-300 hover:bg-slate-50',
      textColor: 'text-slate-700',
      action: () => console.log('Apple OAuth'),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-500">O continúa con</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {providers.map((provider) => {
          const Icon = provider.icon;
          return (
            <button
              key={provider.name}
              type="button"
              onClick={provider.action}
              disabled={isLoading}
              className={`py-3 px-4 border-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${provider.color} ${provider.textColor} disabled:opacity-50 disabled:cursor-not-allowed`}
              title={`Iniciar con ${provider.name}`}
            >
              <Icon className="h-5 w-5" />
              <span>{provider.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
