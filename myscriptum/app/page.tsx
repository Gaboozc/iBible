import { BookOpen, Globe, History, Brain, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">MyScriptum</span>
          </div>
          <nav className="flex items-center gap-6">
            <button className="text-slate-600 hover:text-slate-900">ES</button>
            <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Comenzar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Estudia la Biblia con<br />
          <span className="text-blue-600">Contexto Histórico Profundo</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          No solo leas las Escrituras. Entiéndelas en su contexto histórico, cultural y lingüístico.
          Formación bíblica seria para estudiantes comprometidos.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/library" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
            Explorar Biblioteca
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/study" className="px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:border-slate-400 hover:bg-white transition-colors">
            Ver Demo
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Más que una app de lectura bíblica
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <History className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Contexto Histórico
            </h3>
            <p className="text-slate-600">
              Cada capítulo con fecha exacta, imperio dominante, reyes, profetas activos y situación política detallada.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Timeline Interactiva
            </h3>
            <p className="text-slate-600">
              Visualiza reyes, profetas y eventos superpuestos. Entiende quién profetiza cuándo y por qué.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Etimología Hebrea/Griega
            </h3>
            <p className="text-slate-600">
              Profundiza en palabras clave con raíces semíticas, campos semánticos y evolución de significados.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Conexiones Bíblicas
            </h3>
            <p className="text-slate-600">
              Descubre paralelos históricos, temáticos, proféticos y tipológicos entre textos.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Preguntas Reflexivas
            </h3>
            <p className="text-slate-600">
              Guías de estudio inductivo: observación, interpretación e implicación personal.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              100% Bilingüe
            </h3>
            <p className="text-slate-600">
              Todo el contenido disponible en español e inglés. Cambia de idioma instantáneamente.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Comienza tu formación bíblica hoy
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            100% gratis. Acceso completo a Ezequiel, Jonás y más.
          </p>
          <Link href="/login" className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-block">
            Crear cuenta gratuita
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>© 2026 MyScriptum. Formación bíblica accesible para todos.</p>
          <div className="flex gap-6 justify-center mt-4">
            <a href="#" className="hover:text-slate-900">Acerca de</a>
            <a href="#" className="hover:text-slate-900">Donaciones</a>
            <a href="#" className="hover:text-slate-900">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
