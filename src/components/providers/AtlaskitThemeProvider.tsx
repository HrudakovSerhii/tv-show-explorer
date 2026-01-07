'use client';

import { useEffect } from 'react';
import { setGlobalTheme } from '@atlaskit/tokens';

/**
 * Initializes Atlaskit global theme on the client side.
 */
export const AtlaskitThemeProvider = () => {
  useEffect(() => {
    setGlobalTheme({
      light: 'light',
      dark: 'dark',
      colorMode: 'auto',
    }).finally(() => {
      console.log('Theme set successfully.');
    });
  }, []);

  return null;
};
