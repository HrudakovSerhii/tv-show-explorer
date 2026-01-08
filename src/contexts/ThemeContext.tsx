'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { setGlobalTheme } from '@atlaskit/tokens';

import { getTheme, setTheme as saveTheme, type ThemeMode } from '@/lib/utils/localStorage';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedTheme = getTheme();

    setThemeState(savedTheme);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    setGlobalTheme({
      light: 'light',
      dark: 'dark',
      colorMode: theme,
    }).then(() => {
      console.log(`Theme updated to: ${theme}`);
    });

    const htmlEl = document.documentElement;

    if (theme === 'dark') {
      htmlEl.classList.add('dark');
      htmlEl.classList.remove('light');
    } else {
      htmlEl.classList.add('light');
      htmlEl.classList.remove('dark');
    }

    saveTheme(theme);
  }, [theme, mounted]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
