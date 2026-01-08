'use client';

import React from 'react';

import { useTheme } from '@/contexts/ThemeContext';

export default function AppThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const icon = theme === 'dark' ? 'sunny' : 'moon_stars';
  const ariaLabel =
    theme === 'light'
      ? 'Theme: Light. Click to switch to Dark mode.'
      : 'Theme: Dark. Click to switch to Light mode.';

  return (
    <button
      className="text-text hover:bg-background-neutral-subtle-hovered rounded-radius-large pt-100 transition-colors"
      onClick={handleToggle}
      aria-label={ariaLabel}
      title={`Current: ${theme} mode`}
      suppressHydrationWarning
    >
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
}
