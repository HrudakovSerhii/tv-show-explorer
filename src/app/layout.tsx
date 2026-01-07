import React from 'react';

import { AtlaskitThemeProvider } from '@/components/providers/AtlaskitThemeProvider';

import '@atlaskit/css-reset';
import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TV Show Explorer',
  description:
    'Search for your favorite TV Show, read episode details and rank them to your taste!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AtlaskitThemeProvider />
        {children}
      </body>
    </html>
  );
}
