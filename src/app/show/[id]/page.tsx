import React, { Suspense } from 'react';
import Link from 'next/link';

import { getShowDetails, getShowSeasons } from '@/lib/api/tvmaze';
import { stripHtml } from '@/lib/utils/format';

import WatchlistButton from '@/components/shows/WatchlistButton';

import { NAV_URLS } from '@/constants';

export type ShowPageProps = {
  params: Promise<{ id: string }>;
};

async function ShowDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const show = await getShowDetails(id);
  const seasons = await getShowSeasons(id);

  if (!show) {
    return (
      <div className="flex flex-col items-center gap-200 py-1000 text-center">
        <span className="material-symbols-outlined text-icon-subtlest text-6xl">tv_off</span>
        <h1 className="text-text dark:text-text-inverse font-weight-bold text-2xl">
          Show not found
        </h1>
        <Link
          href={NAV_URLS.home}
          className="text-brand font-weight-medium flex items-center gap-50 text-sm hover:underline"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-200">
        <div className="bg-background-neutral dark:bg-background-neutral-bold shadow-raised rounded-radius-xlarge aspect-[2/3] w-full overflow-hidden">
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
          <WatchlistButton showId={show.id} />
          <button className="bg-background-neutral dark:bg-background-neutral-bold hover:bg-background-neutral-hovered dark:hover:bg-background-neutral-subtle-hovered text-text dark:text-text-inverse rounded-radius-large flex items-center justify-center p-150 transition-colors">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col pt-100 text-left">
        <div className="mb-200 flex items-start justify-between">
          <h1 className="text-text dark:text-text-inverse font-weight-bold text-4xl tracking-tight md:text-5xl">
            {show.name}
          </h1>
        </div>

        <div className="mb-300 flex flex-wrap items-center gap-x-300 gap-y-150 text-sm md:text-base">
          <div className="text-text dark:text-text-inverse font-weight-bold flex items-center gap-50">
            <span className="material-symbols-outlined text-icon-accent-yellow !fill-1">star</span>
            <span>{show.rating.average}/10</span>
          </div>
          <span className="text-border-bold">|</span>
          <span className="text-text-subtle">{show.premiered}</span>
          <span className="text-border-bold">|</span>
          <span className="text-text-subtle">{seasons?.length || 'N/A'} Seasons</span>
        </div>

        <div className="mb-300">
          {/*<RatingControl*/}
          {/*  initialRating={userRating}*/}
          {/*  onRate={(rating) => onRate(show.id, rating)}*/}
          {/*  label="My Show Rating"*/}
          {/*/>*/}
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
        <div className="border-border dark:border-border-inverse mt-auto border-t pt-300">
          <div className="flex gap-600">
            <div>
              <p className="font-weight-semibold text-text-subtlest mb-50 text-xs tracking-wider uppercase">
                Stars
              </p>
              <p className="text-text dark:text-text-inverse font-weight-medium">
                {show._embedded?.cast?.map((c) => c.person.name).join(', ') || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ShowPageSkeleton() {
  return (
    <>
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
    </>
  );
}

export default function ShowPage({ params }: ShowPageProps) {
  return (
    <Suspense fallback={<ShowPageSkeleton />}>
      <ShowDetails params={params} />
    </Suspense>
  );
}
