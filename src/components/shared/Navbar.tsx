import React, { Suspense } from 'react';
import Link from 'next/link';

import NavbarMenu from '@/components/shared/NavbarMenu';

import { NAV_URLS } from '@/constants';

const Navbar: React.FC = () => {
  return (
    <header className="border-border bg-background-input sticky top-0 z-50 w-full border-b">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-200 py-150 md:px-500">
        <Link
          href={NAV_URLS.home}
          className="text-text flex cursor-pointer items-center gap-200"
        >
          <h2 className="font-font-weight-bold text-lg leading-tight tracking-[-0.015em]">
            TV-Show Explorer
          </h2>
        </Link>
        <Suspense fallback={<div className="h-9" />}>
          <NavbarMenu />
        </Suspense>
      </div>
    </header>
  );
};

export default Navbar;
