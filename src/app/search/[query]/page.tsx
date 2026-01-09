import { Suspense } from 'react';
import Link from 'next/link';

import { searchShows } from '@/lib/api/tvmaze';

import ShowCard from '@/components/shows/ShowCard';

import { NAV_URLS } from '@/constants';

export type SearchPageProps = {
  params: Promise<{ query: string }>;
};

async function SearchResults({ params }: { params: Promise<{ query: string }> }) {
  const { query } = await params;
  const decodedQuery = decodeURIComponent(query);
  const results = decodedQuery ? await searchShows(decodedQuery) : [];

  return (
    <>
      <h2 className="text-text font-weight-bold text-left text-2xl">
        Search results for &quot;{decodedQuery}&quot;
      </h2>

      {results.length === 0 && (
        <div className="flex flex-col items-center gap-200 py-1000 text-center">
          <span className="material-symbols-outlined text-icon-subtlest text-6xl">search_off</span>
          <p className="text-text-subtle text-lg">
            No matches found for your query. Try something else!
          </p>
          <Link
            href={NAV_URLS.home}
            className="bg-background-brand-bold rounded-radius-medium font-weight-bold text-text hover:bg-background-brand-bold-hovered px-300 py-100 transition-colors"
          >
            Return Home
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-300 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {results.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </>
  );
}

function SearchLoadingSkeleton() {
  return (
    <>
      <div className="bg-background-neutral-subtle rounded-radius-medium h-8 w-64 animate-pulse" />
      <div className="grid grid-cols-2 gap-300 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-150">
            <div className="bg-background-neutral-subtle rounded-radius-large aspect-[2/3] w-full animate-pulse" />
            <div className="bg-background-neutral-subtle rounded-radius-small h-4 w-3/4 animate-pulse" />
          </div>
        ))}
      </div>
    </>
  );
}

export default function SearchPage({ params }: SearchPageProps) {
  return (
    <div className="flex flex-col gap-400">
      <Link
        href={NAV_URLS.home}
        className="text-brand font-weight-medium flex items-center gap-50 text-sm hover:underline"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Home
      </Link>

      <Suspense fallback={<SearchLoadingSkeleton />}>
        <SearchResults params={params} />
      </Suspense>
    </div>
  );
}
