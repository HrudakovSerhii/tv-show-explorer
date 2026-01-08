'use client';

import SubmitButton from './SubmitButton';

import { searchAction } from '@/app/actions/search';

export default function SearchForm() {
  return (
    <form action={searchAction} className="relative flex w-full items-center">
      <div className="text-icon-subtlest pointer-events-none absolute left-200 flex items-center justify-center">
        <span className="material-symbols-outlined">search</span>
      </div>
      <input
        name="query"
        className="rounded-large bg-background-input text-text placeholder:text-text-subtlest focus:ring-border-width-focused focus:ring-border-focused shadow-overlay h-14 w-full border-0 pr-32 pl-600 text-base md:h-80"
        placeholder="Search for TV shows (e.g., Breaking Bad)..."
        type="text"
        required
      />
      <div className="absolute top-100 right-100 bottom-100">
        <SubmitButton />
      </div>
    </form>
  );
}
