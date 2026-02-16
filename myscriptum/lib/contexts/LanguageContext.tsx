'use client';

import React, { createContext, useContext, useState } from 'react';

export type Language = 'es' | 'en';
export type BibleVersion = 'rv1909' | 'kjv';

interface LanguageContextType {
  language: Language;
  bibleVersion: BibleVersion;
  setBibleVersion: (version: BibleVersion) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations dictionary
const translations = {
  es: {
    // Navigation
    'nav.progress': 'Progreso',
    'nav.demo': 'Demo',
    'nav.login': 'Entrar',

    // Library Page
    'library.title': 'Biblioteca Bíblica',
    'library.subtitle': 'Selecciona un testamento para comenzar',
    'library.testaments': 'Testamentos',
    'library.books': 'Libros',
    'library.chapters': 'Capítulos',
    'library.search': 'Buscar libro...',
    'library.selectBook': 'Selecciona un libro',
    'library.noResults': 'No hay libros con ese nombre.',
    'library.readingStatus': 'Estado de lectura',
    'library.read': 'Leído',
    'library.unread': 'No leído',

    // Study Page - Tabs
    'tab.context': 'Contexto',
    'tab.text': 'Texto',
    'tab.analysis': 'Análisis',
    'tab.etymology': 'Etimología',
    'tab.connections': 'Conexiones',
    'tab.reflection': 'Reflexión',

    // Study Page - Controls
    'study.back': 'Volver',
    'study.markRead': 'Marcar leído',
    'study.loading': 'Cargando capítulo...',
    'study.version.rv1909': 'RV1909',
    'study.version.kjv': 'KJV',

    // Theme
    'theme.darkMode': 'Modo Oscuro',
    'theme.lightMode': 'Modo Claro',
  },
  en: {
    // Navigation
    'nav.progress': 'Progress',
    'nav.demo': 'Demo',
    'nav.login': 'Sign In',

    // Library Page
    'library.title': 'Bible Library',
    'library.subtitle': 'Select a testament to begin',
    'library.testaments': 'Testaments',
    'library.books': 'Books',
    'library.chapters': 'Chapters',
    'library.search': 'Search book...',
    'library.selectBook': 'Select a book',
    'library.noResults': 'No books found with that name.',
    'library.readingStatus': 'Reading Status',
    'library.read': 'Read',
    'library.unread': 'Unread',

    // Study Page - Tabs
    'tab.context': 'Context',
    'tab.text': 'Text',
    'tab.analysis': 'Analysis',
    'tab.etymology': 'Etymology',
    'tab.connections': 'Connections',
    'tab.reflection': 'Reflection',

    // Study Page - Controls
    'study.back': 'Back',
    'study.markRead': 'Mark as Read',
    'study.loading': 'Loading chapter...',
    'study.version.rv1909': 'RV1909',
    'study.version.kjv': 'KJV',

    // Theme
    'theme.darkMode': 'Dark Mode',
    'theme.lightMode': 'Light Mode',
  },
} as const;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(() => {
    const savedLanguage = (typeof window !== 'undefined' ? localStorage.getItem('language') : null) as Language | null;
    const savedVersion = (typeof window !== 'undefined' ? localStorage.getItem('bibleVersion') : null) as BibleVersion | null;
    return {
      language: savedLanguage || 'es',
      bibleVersion: savedVersion || 'rv1909',
      mounted: true,
    };
  });

  const setBibleVersion = (version: BibleVersion) => {
    const newLanguage = version === 'rv1909' ? 'es' : 'en';
    setState((prev) => ({ ...prev, bibleVersion: version, language: newLanguage }));
    localStorage.setItem('bibleVersion', version);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    const table = translations[state.language];
    return table[key as keyof typeof table] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language: state.language, bibleVersion: state.bibleVersion, setBibleVersion, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
