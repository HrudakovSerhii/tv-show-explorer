import React from 'react';
import Link from 'next/link';

import { NAV_URLS } from '@/constants';

export type ShowLayoutProps = {
  children: React.ReactNode;
};

export default function ShowLayout({ children }: ShowLayoutProps) {
  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-[1024px] flex-col">
      <nav className="flex flex-wrap items-center gap-100 px-200 pb-300 text-sm">
        <Link
          href={NAV_URLS.home}
          className="text-brand font-weight-medium flex items-center gap-50 text-sm hover:underline"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Home
        </Link>
        {/*TODO: Include Breadcrumbs navigation items after client state provider implementation*/}
      </nav>

      <main className="flex flex-wrap items-center gap-100">{children}</main>
    </div>
  );
}
