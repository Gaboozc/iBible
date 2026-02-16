import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "MyScriptum — Estudia la Biblia con Contexto Histórico",
  description: "Plataforma de formación bíblica seria con contexto histórico profundo, etimología hebrea/griega y conexiones intertextuales. 100% gratis.",
  keywords: "biblia, estudio bíblico, contexto histórico, etimología hebrea, formación bíblica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <LanguageProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
