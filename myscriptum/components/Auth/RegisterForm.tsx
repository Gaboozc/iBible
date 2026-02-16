'use client';

import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validaciones
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    if (formData.name.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Ingresa un correo válido');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (!agreedTerms) {
      setError('Debes aceptar los términos y condiciones');
      setIsLoading(false);
      return;
    }

    try {
      // Simular registro (Mock)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Registro:', formData);
      alert(`Bienvenido ${formData.name}! Tu cuenta ha sido creada.`);
    } catch {
      setError('Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
          Nombre Completo
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
          Correo Electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@correo.com"
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Confirmar Contraseña */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
          Confirmar Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Términos y Condiciones */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreedTerms}
          onChange={(e) => setAgreedTerms(e.target.checked)}
          className="h-4 w-4 text-blue-600 rounded mt-1 flex-shrink-0"
          disabled={isLoading}
        />
        <span className="text-sm text-slate-600">
          Acepto los{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            términos de servicio
          </a>{' '}
          y la{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            política de privacidad
          </a>
        </span>
      </label>

      {/* Mensaje de error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Botón Registrarse */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>
    </form>
  );
}
