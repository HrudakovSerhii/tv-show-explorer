import Link from 'next/link';

import { searchShows } from '@/lib/api/tvmaze';

import { NAV_URLS } from '@/constants';

export type SearchPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = typeof q === 'string' ? q : '';

  const results = query ? await searchShows(query) : [];

  return (
    <div className="flex flex-col gap-400">
      <div className="flex flex-col gap-100">
        <Link
          href={'/'}
          className="text-brand mb-200 flex items-center gap-50 text-sm font-weight-medium hover:underline"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Home
        </Link>
        <h2 className="text-text dark:text-text-inverse text-left text-2xl font-weight-bold">
          Search results for &quot;{query}&quot;
        </h2>
      </div>

      {results.length === 0 && (
        <div className="flex flex-col items-center gap-200 py-1000 text-center">
          <span className="material-symbols-outlined text-icon-subtlest text-6xl">search_off</span>
          <p className="text-text-subtle text-lg">
            No matches found for your query. Try something else!
          </p>
          <Link
            href={NAV_URLS.home}
            className="bg-background-brand-bold rounded-radius-medium px-300 py-100 font-weight-bold text-text-inverse hover:bg-background-brand-bold-hovered transition-colors"
          >
            Return Home
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-300 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {results.map((show) => (
          <span key={show.id}>{show.name}</span>
        ))}
      </div>
    </div>
  );
}
