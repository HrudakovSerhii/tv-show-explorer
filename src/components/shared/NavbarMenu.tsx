'use client';

import React from 'react';

import NavLinks from '@/components/shared/NavLinks';

const NavbarMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div>
      <div className="hidden flex-1 items-center justify-end gap-400 md:flex">
        <NavLinks className="flex items-center gap-8" />
      </div>
      <button
        className="rounded-lg p-2 text-[#111318] transition-colors hover:bg-gray-100 md:hidden dark:text-white dark:hover:bg-gray-800"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
      </button>
      <div
        className={`absolute top-full left-0 w-full overflow-hidden border-b border-[#f0f2f4] bg-white shadow-xl transition-all duration-300 ease-in-out md:hidden dark:border-[#2a3447] dark:bg-[#1a2233] ${
          isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <NavLinks
          className="flex flex-col gap-2 px-100 pb-50"
          itemClassName="w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        />
      </div>

      {/* Backdrop for Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-[60px] -z-10 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default NavbarMenu;
