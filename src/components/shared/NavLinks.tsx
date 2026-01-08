'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAV_URLS } from '@/constants';

const NavLinks: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="flex h-9 items-center gap-300">
      <Link
        href={NAV_URLS.watchlist}
        className={`${pathname === NAV_URLS.watchlist ? 'text-text-brand dark:text-text-brand' : 'text-text dark:text-text-inverse'} hover:text-text-brand dark:hover:text-icon-accent-blue text-sm font-medium transition-colors`}
      >
        My Watchlist
      </Link>
      <Link
        href={NAV_URLS.favorites}
        className={`${pathname === NAV_URLS.favorites ? 'text-text-brand dark:text-text-brand' : 'text-text dark:text-text-inverse'} hover:text-text-brand dark:hover:text-icon-accent-blue text-sm font-medium transition-colors`}
      >
        My Favourites
      </Link>
    </nav>
  );
};

export default NavLinks;
