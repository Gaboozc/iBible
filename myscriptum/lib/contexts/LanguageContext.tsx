'use client';

import React, { createContext, useContext, useState } from 'react';
import { getPreferences, hasStoredData, setPreferences } from '@/lib/storage/localStore';

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
    'tab.lexicon': 'Lexicón',
    'tab.connections': 'Conexiones',
    'tab.reflection': 'Reflexión',

    // Study Page - Controls
    'study.back': 'Volver',
    'study.markRead': 'Marcar leído',
    'study.loading': 'Cargando capítulo...',
    'study.version.rv1909': 'RV1909',
    'study.version.kjv': 'KJV',
    'study.notes.title': 'Notas personales',
    'study.notes.placeholder': 'Escribe tus notas para este capítulo...',
    'home.welcomeLabel': 'Bienvenida',
    'home.title': 'Abre la Biblia y encuentra un refugio diario',
    'home.subtitle': 'Un espacio sereno para leer, estudiar y guardar lo que Dios te habla hoy.',
    'home.start': 'Comenzar lectura',
    'home.demo': 'Ver demo',
    'home.verseLabel': 'Versiculo del dia',
    'home.viewMore': 'Ver mas',
    'home.refresh': 'Otro versiculo',
    'home.loading': 'Buscando un versiculo para ti...',
    'home.error': 'No pude cargar el versiculo. Intenta de nuevo.',
    'home.explore': 'Biblioteca',

    // Recent Section
    'home.recent.title': 'Continúa donde lo dejaste',
    'home.recent.lastChapter': 'Último capítulo leído',
    'home.recent.continue': 'Continuar leyendo',
    'home.recent.continueReflection': 'Responder reflexiones',
    'home.recent.noRecent': 'Comienza con un nuevo libro en la biblioteca',

    // Theme
    'theme.darkMode': 'Modo Oscuro',
    'theme.lightMode': 'Modo Claro',

    // Navigation
    'nav.home': 'Inicio',
    'nav.library': 'Biblioteca',
    'nav.progress': 'Progreso',
  },
  en: {
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
    'tab.lexicon': 'Lexicon',
    'tab.connections': 'Connections',
    'tab.reflection': 'Reflection',

    // Study Page - Controls
    'study.back': 'Back',
    'study.markRead': 'Mark as Read',
    'study.loading': 'Loading chapter...',
    'study.version.rv1909': 'RV1909',
    'study.version.kjv': 'KJV',
    'study.notes.title': 'Personal notes',
    'study.notes.placeholder': 'Write your notes for this chapter...',
    'home.welcomeLabel': 'Welcome',
    'home.title': 'Open the Bible and find a daily refuge',
    'home.subtitle': 'A calm space to read, study, and keep what God speaks to you today.',
    'home.start': 'Start reading',
    'home.demo': 'View demo',
    'home.verseLabel': 'Verse of the day',
    'home.viewMore': 'View more',
    'home.refresh': 'Another verse',
    'home.loading': 'Finding a verse for you...',
    'home.error': 'Could not load the verse. Try again.',
    'home.explore': 'Library',

    // Recent Section
    'home.recent.title': 'Continue where you left off',
    'home.recent.lastChapter': 'Last chapter read',
    'home.recent.continue': 'Continue reading',
    'home.recent.continueReflection': 'Answer reflections',
    'home.recent.noRecent': 'Start with a new book in the library',

    // Theme
    'theme.darkMode': 'Dark Mode',
    'theme.lightMode': 'Light Mode',

    // Navigation
    'nav.home': 'Home',
    'nav.library': 'Library',
    'nav.progress': 'Progress',
  },
} as const;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ language: Language; bibleVersion: BibleVersion; mounted: boolean }>(() => {
    if (typeof window === 'undefined') {
      return {
        language: 'es',
        bibleVersion: 'rv1909',
        mounted: true,
      };
    }
    const preferences = getPreferences();
    return {
      language: preferences.language,
      bibleVersion: preferences.bibleVersion,
      mounted: true,
    };
  });

  const setBibleVersion = (version: BibleVersion) => {
    const newLanguage = version === 'rv1909' ? 'es' : 'en';
    setState((prev) => ({ ...prev, bibleVersion: version, language: newLanguage }));
    if (!hasStoredData()) {
      setPreferences({ bibleVersion: version, language: newLanguage });
      return;
    }
    setPreferences({ bibleVersion: version, language: newLanguage });
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
