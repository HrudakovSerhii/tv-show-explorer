import React from 'react';
import Link from 'next/link';

import { NAV_URLS } from '@/constants';

export type ShowLayoutProps = {
  children: React.ReactNode;
};

export default function ShowLayout({ children }: ShowLayoutProps) {
  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-[1024px] flex-col">
      <main className="flex flex-wrap items-center gap-100">{children}</main>
    </div>
  );
}
