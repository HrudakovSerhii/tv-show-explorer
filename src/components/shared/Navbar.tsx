import React from 'react';
import Link from 'next/link';

import NavLinks from './NavLinks';

import { NAV_URLS } from '@/constants';

const Navbar: React.FC = () => {
  return (
    <header className="border-border bg-background-input dark:border-border-inverse dark:bg-background-neutral sticky top-0 z-50 w-full border-b">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-200 py-150 md:px-500">
        <Link
          href={NAV_URLS.home}
          className="text-color-text dark:text-text-inverse flex cursor-pointer items-center gap-200"
        >
          <h2 className="font-font-weight-bold text-lg leading-tight tracking-[-0.015em]">
            TV-Show Explorer
          </h2>
        </Link>
        <div className="hidden flex-1 items-center justify-end gap-400 md:flex">
          <NavLinks />
        </div>
        <button className="text-text dark:text-text-inverse md:hidden">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
