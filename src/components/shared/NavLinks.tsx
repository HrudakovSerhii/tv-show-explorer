'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAV_URLS } from '@/constants';

type NavLinksProps = {
  className?: string;
  itemClassName?: string;
};

const NavLinks: React.FC<NavLinksProps> = ({ className, itemClassName }) => {
  const pathname = usePathname();

  return (
    <nav className={className}>
      <Link
        href={NAV_URLS.watchlist}
        className={`${pathname === NAV_URLS.watchlist ? 'text-text-brand' : 'text-text'} ${itemClassName} hover:text-text-brand dark:hover:text-icon-accent-blue text-sm font-medium transition-colors`}
      >
        My Watchlist
      </Link>
      <Link
        href={NAV_URLS.favorites}
        className={`${pathname === NAV_URLS.favorites ? 'text-text-brand' : 'text-text'} ${itemClassName} hover:text-text-brand dark:hover:text-icon-accent-blue text-sm font-medium transition-colors`}
      >
        My Favourites
      </Link>
    </nav>
  );
};

export default NavLinks;
