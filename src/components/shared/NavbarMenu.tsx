'use client';

import React from 'react';

import NavLinks from '@/components/shared/NavLinks';

const NavbarMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div>
      <div className="hidden flex-1 items-center justify-end gap-400 md:flex">
        <NavLinks className="flex items-center gap-400" />
      </div>
      <button
        className="text-text dark:text-text-inverse hover:bg-background-neutral-subtle-hovered dark:hover:bg-background-neutral-hovered rounded-radius-large p-100 transition-colors md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
      </button>
      <div
        className={`bg-background-input dark:bg-background-neutral border-border dark:border-border-inverse shadow-overlay absolute top-full left-0 w-full overflow-hidden border-b transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <NavLinks
          className="flex flex-col gap-100 px-100 pb-50"
          itemClassName="hover:bg-background-neutral-subtle-hovered dark:hover:bg-background-neutral-hovered rounded-radius-large w-full p-150"
        />
      </div>

      {/* Backdrop for Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="bg-blanket fixed inset-0 top-[60px] -z-10 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default NavbarMenu;
