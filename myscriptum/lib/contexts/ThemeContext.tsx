'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as ThemeMode | null;
    if (saved) {
      setMode(saved);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      return newMode;
    });
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Color palettes
export const colors = {
  light: {
    // Backgrounds
    bg: {
      primary: '#F2E9D4',
      secondary: '#FFFFFF',
      header: '#3D2644',
    },
    // Text
    text: {
      primary: '#1A1A1A',
      secondary: '#3D2644',
      light: '#F2E9D4',
    },
    // Accents
    accent: {
      primary: '#B08D57',
      secondary: '#4A908F',
    },
    // Borders
    border: '#B08D57',
  },
  dark: {
    // Backgrounds
    bg: {
      primary: '#0F0F0F',
      secondary: '#1A1A1A',
      header: '#2D1B2B',
    },
    // Text
    text: {
      primary: '#F2E9D4',
      secondary: '#D4C5A9',
      light: '#FFFFFF',
    },
    // Accents
    accent: {
      primary: '#D4A574',
      secondary: '#6BB3B0',
    },
    // Borders
    border: '#D4A574',
  },
};

export function getColors(mode: ThemeMode) {
  return colors[mode];
}
