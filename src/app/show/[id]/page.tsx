import React, { Suspense } from 'react';
import Link from 'next/link';

import { getShowDetails } from '@/lib/api/tvmaze';
import { stripHtml } from '@/lib/utils/format';

import EpisodeListCard from '@/components/shows/EpisodeListCard';
import EpisodesList from '@/components/shows/EpisodesList';
import WatchlistButton from '@/components/shows/WatchlistButton';

import { NAV_URLS } from '@/constants';

export type ShowPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string }>;
};

export type ShowDetailsProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string }>;
};

export async function ShowDetails({ params, searchParams }: ShowDetailsProps) {
  const { id } = await params;
  const { season: seasonParam } = await searchParams;
  const show = await getShowDetails(id);

  if (!show) {
    return (
      <div className="flex flex-col items-center gap-200 py-1000 text-center">
        <span className="material-symbols-outlined text-icon-subtlest text-6xl">tv_off</span>
        <h1 className="text-text font-weight-bold text-2xl">Show not found</h1>
        <Link
          href={NAV_URLS.home}
          className="text-brand font-weight-medium flex items-center gap-50 text-sm hover:underline"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Home
        </Link>
      </div>
    );
  }

  const episodes = show?._embedded?.episodes || [];
  const availableSeasons = episodes.length
    ? [...new Set(episodes.map((ep) => ep.season))].sort((a, b) => a - b)
    : [];

  const initialSeason = (() => {
    if (seasonParam) {
      const seasonNumber = Number(seasonParam);

      if (availableSeasons.includes(seasonNumber)) {
        return seasonNumber;
      }
    }

    return availableSeasons[availableSeasons.length - 1] || 1;
  })();

  // TODO: implement share functionality
  return (
    <>
      <nav className="flex flex-wrap items-center gap-100 px-200 pb-300">
        <Link
          href={NAV_URLS.home}
          className="text-brand font-weight-medium flex items-center gap-50 hover:underline"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="truncate text-sm">Back to Home</span>
        </Link>
      </nav>

      <div className="mb-400 grid grid-cols-1 gap-400 px-200 md:grid-cols-[280px_1fr]">
        <div className="flex flex-col gap-200">
          <div className="bg-background-neutral shadow-raised rounded-radius-xlarge aspect-[2/3] w-full overflow-hidden">
            {show.image?.original ? (
              <picture className="block h-full w-full">
                <source media="(min-width: 768px)" srcSet={show.image.original} />
                {show.image?.medium && (
                  <source media="(max-width: 767px)" srcSet={show.image.medium} />
                )}
                <img
                  src={show.image.original}
                  alt={show.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </picture>
            ) : (
              <div className="bg-background-neutral-subtle flex h-full w-full items-center justify-center">
                <span className="text-icon-subtle material-symbols-outlined text-6xl">image</span>
              </div>
            )}
          </div>
          <div className="flex gap-100">
            <WatchlistButton id={show.id} type="show" />
            <button className="bg-background-neutral hover:bg-background-neutral-hovered text-text rounded-radius-large flex items-center justify-center p-150 transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col pt-100 text-left">
          <div className="mb-200 flex items-start justify-between">
            <h1 className="text-text font-weight-bold text-4xl tracking-tight md:text-5xl">
              {show.name}
            </h1>
          </div>

          <div className="mb-300 flex flex-wrap items-center gap-x-300 gap-y-150 text-sm md:text-base">
            <div className="ml-auto flex items-center gap-50">
              <span className="material-symbols-outlined !fill-1 text-[20px] text-amber-400">
                star
              </span>
              <span className="text-text-subtlest font-weight-bold text-sm">
                {show.rating?.average ? `${show.rating?.average}/10` : 'N/A'}
              </span>
            </div>
            <span className="text-border-bold">|</span>
            <span className="text-text-subtle">{show.premiered}</span>
            <span className="text-border-bold">|</span>
            <span className="text-text-subtle">{availableSeasons?.length || 'N/A'} Seasons</span>
          </div>

          <div className="mb-300 flex flex-wrap gap-100">
            {show.genres.map((genre) => (
              <span
                key={genre}
                className="text-brand rounded-radius-full font-weight-medium px-50 py-25 text-xs md:px-100"
              >
                {genre}
              </span>
            ))}
          </div>
          <div className="text-text-subtle prose prose-lg mb-400 leading-relaxed">
            <p>{stripHtml(show.summary)}</p>
          </div>
          <div className="border-border mt-auto border-t pt-300">
            <div className="flex gap-600">
              <div>
                <p className="font-weight-semibold text-text-subtlest mb-50 text-xs tracking-wider uppercase">
                  Stars
                </p>
                <p className="text-text font-weight-medium">
                  {show._embedded?.cast?.map((c) => c.person.name).join(', ') || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EpisodesList
        showId={id}
        availableSeasons={availableSeasons}
        episodes={episodes}
        initialSeason={initialSeason}
      />
    </>
  );
}

export function ShowPageSkeleton() {
  return (
    <>
      <div className="mb-600 grid grid-cols-1 gap-400 px-200 md:grid-cols-[280px_1fr]">
        <div className="flex flex-col gap-200">
          <div className="bg-background-neutral-subtle rounded-radius-xlarge aspect-[2/3] w-full animate-pulse" />
          <div className="flex gap-100">
            <div className="bg-background-neutral-subtle rounded-radius-large h-12 flex-1 animate-pulse" />
            <div className="bg-background-neutral-subtle rounded-radius-large h-12 w-12 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col gap-200">
          <div className="bg-background-neutral-subtle rounded-radius-medium h-12 w-3/4 animate-pulse" />
          <div className="bg-background-neutral-subtle rounded-radius-small h-6 w-1/2 animate-pulse" />
          <div className="bg-background-neutral-subtle rounded-radius-medium h-24 w-full animate-pulse" />
        </div>
      </div>

      <section className="px-200">
        <div className="mb-300 flex items-center justify-between">
          <div className="bg-background-neutral-subtle rounded-radius-medium h-8 w-32 animate-pulse" />
          <div className="bg-background-neutral-subtle rounded-radius-medium h-10 w-28 animate-pulse" />
        </div>

        <div className="flex flex-col gap-200">
          {[1, 2, 3].map((i) => (
            <EpisodeListCard key={i} showId="" isLoading />
          ))}
        </div>
      </section>
    </>
  );
}

export default function ShowPage({ params, searchParams }: ShowPageProps) {
  return (
    <Suspense fallback={<ShowPageSkeleton />}>
      <ShowDetails params={params} searchParams={searchParams} />
    </Suspense>
  );
}
