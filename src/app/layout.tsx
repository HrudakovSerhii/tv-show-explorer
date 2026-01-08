import React from 'react';

import { AtlaskitThemeProvider } from '@/components/providers/AtlaskitThemeProvider';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <title>TV Show Explorer</title>
      </head>
      <body className="antialiased">
        <AtlaskitThemeProvider />
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex w-full flex-1 flex-col items-center">
            <div className="mx-auto w-full max-w-[1200px] px-200 py-300 md:px-500">{children}</div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
