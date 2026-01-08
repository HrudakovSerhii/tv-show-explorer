import React, { Suspense } from 'react';
import Link from 'next/link';

import WatchlistButton from '@/components/shows/WatchlistButton';

import { getEpisodeDetails } from '@/lib/api/tvmaze';
import { stripHtml } from '@/lib/utils/format';

import { NAV_URLS } from '@/constants';

export type EpisodePageProps = {
  params: Promise<{ id: string; episodeId: string }>;
};

export async function EpisodeDetails({ params }: EpisodePageProps) {
  const { id, episodeId } = await params;

  const episode = await getEpisodeDetails(episodeId);

  if (!episode) {
    return (
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center p-400">
        <div className="bg-background-neutral-subtle rounded-radius-xlarge flex flex-col items-center gap-200 p-600 text-center">
          <span className="text-icon-subtlest material-symbols-outlined text-6xl">tv_off</span>
          <h1 className="text-text font-weight-bold text-2xl">Episode not found</h1>
          <p className="text-text-subtle text-sm">
            The episode you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href={`${NAV_URLS.show}/${id}`}
            className="bg-background-brand-bold hover:bg-background-brand-bold-hovered text-text-inverse font-weight-medium rounded-radius-medium mt-100 px-200 py-100 text-sm transition-colors"
          >
            Browse TV Shows
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-[1200px] flex-col">
      <div className="mb-100 flex flex-col-reverse justify-between gap-200 py-200 md:flex-row md:items-center">
        <Link
          href={`${NAV_URLS.show}/${id}`}
          className="bg-background-neutral-subtle hover:bg-background-neutral-subtle-hovered rounded-radius-medium font-weight-bold text-text flex h-10 w-fit cursor-pointer items-center justify-center gap-100 overflow-hidden px-200 text-sm leading-normal tracking-[0.015em] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="truncate">Back to Season {episode.season}</span>
        </Link>

        <div className="flex flex-wrap items-center gap-100 px-200 text-sm md:px-0">
          <span className="text-text-subtlest font-weight-medium leading-normal">TV Shows</span>
          <span className="text-text-subtlest font-weight-medium text-sm">/</span>
          <span className="text-text-subtlest font-weight-medium leading-normal">{episode._links.show.name}</span>
          <span className="text-text-subtlest font-weight-medium text-sm">/</span>
          <span className="text-text font-weight-medium">
            S{episode.season}: E{episode.number}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-400 p-200 lg:grid-cols-12">
        <div className="flex flex-col gap-200 lg:col-span-5">
          <div className="bg-background-neutral-subtle rounded-radius-xlarge shadow-raised group relative aspect-video w-full overflow-hidden">
            {episode.image?.medium || episode.image?.original ? (
              <picture className="absolute inset-0">
                {episode.image.original && (
                  <source media="(min-width: 640px)" srcSet={episode.image.original} />
                )}
                {episode.image.medium && (
                  <source media="(max-width: 639px)" srcSet={episode.image.medium} />
                )}
                <img
                  src={episode.image.medium || episode.image.original}
                  alt={episode.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </picture>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-icon-subtle material-symbols-outlined text-6xl">tv</span>
              </div>
            )}
          </div>

          <div className="text-text-subtlest flex justify-between gap-200 px-50 text-sm">
            <div className="flex items-center gap-100">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>{episode.airdate}</span>
            </div>
            {episode.runtime && (
              <div className="flex items-center gap-100">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>{episode.runtime}m</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-300 text-left lg:col-span-7">
          <div className="flex flex-col gap-100">
            <div className="flex items-center gap-150">
              <div className="font-weight-bold flex items-center gap-50 text-[14px]">
                <span className="material-symbols-outlined text-icon-accent-yellow !fill-1">
                  star
                </span>
                <span>{episode.rating ? `${episode.rating?.average}/10` : 'N/A'}</span>
              </div>
              <span className="bg-background-brand-bold/10 text-brand rounded-radius-small font-weight-bold inline-flex items-center px-100 py-50 text-xs">
                Season {episode.season}
              </span>
              <span className="bg-background-neutral text-text-subtle rounded-radius-small inline-flex items-center px-100 py-50 text-xs font-medium">
                Episode {episode.number}
              </span>
              <div className="ml-auto flex items-center gap-50">
                <span className="material-symbols-outlined !fill-1 text-[20px] text-amber-400">
                  star
                </span>
                <span className="text-text font-weight-bold">
                  <span>{episode.rating ? `${episode.rating?.average}/10` : 'N/A'}</span>
                </span>
                <span className="text-text-subtlest text-sm">/ 10</span>
              </div>
            </div>
            <h1 className="text-text font-weight-bold text-3xl leading-tight tracking-[-0.02em] md:text-4xl">
              {episode.name}
            </h1>
          </div>

          <div className="flex flex-col gap-200">
            <div className="flex flex-wrap gap-150">
              <WatchlistButton showId={id} />
              <button className="border-border hover:bg-background-neutral-subtle-hovered text-text font-weight-medium rounded-radius-medium flex items-center justify-center gap-100 border px-150 py-100 text-sm transition-colors">
                <span className="material-symbols-outlined text-[20px]">share</span>
              </button>
            </div>
          </div>

          <hr className="border-border w-full" />

          <div className="flex flex-col gap-150">
            <h3 className="text-text font-weight-bold text-lg">Overview</h3>
            <p className="text-text-subtle font-weight-regular text-base leading-relaxed">
              {stripHtml(episode.summary)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EpisodePageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] animate-pulse flex-col">
      <div className="mb-100 flex flex-col-reverse justify-between gap-200 py-200 md:flex-row md:items-center">
        <div className="bg-background-neutral rounded-radius-medium h-10 w-48" />
        <div className="flex flex-wrap items-center gap-100 px-200 md:px-0">
          <div className="bg-background-neutral rounded-radius-small h-4 w-20" />
          <div className="bg-background-neutral rounded-radius-small h-4 w-1" />
          <div className="bg-background-neutral rounded-radius-small h-4 w-32" />
          <div className="bg-background-neutral rounded-radius-small h-4 w-1" />
          <div className="bg-background-neutral rounded-radius-small h-4 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-400 p-200 lg:grid-cols-12">
        <div className="flex flex-col gap-200 lg:col-span-5">
          <div className="bg-background-neutral rounded-radius-xlarge aspect-video w-full" />
          <div className="flex justify-between gap-200 px-50">
            <div className="bg-background-neutral rounded-radius-small h-4 w-24" />
            <div className="bg-background-neutral rounded-radius-small h-4 w-16" />
          </div>
        </div>

        <div className="flex flex-col gap-300 lg:col-span-7">
          <div className="flex flex-col gap-100">
            <div className="flex items-center gap-150">
              <div className="bg-background-neutral rounded-radius-small h-5 w-16" />
              <div className="bg-background-neutral rounded-radius-small h-6 w-20" />
              <div className="bg-background-neutral rounded-radius-small h-6 w-24" />
              <div className="bg-background-neutral rounded-radius-small ml-auto h-6 w-20" />
            </div>
            <div className="bg-background-neutral rounded-radius-medium h-10 w-3/4" />
          </div>

          <div className="flex flex-wrap gap-150">
            <div className="bg-background-neutral rounded-radius-medium h-10 w-40" />
            <div className="bg-background-neutral rounded-radius-medium h-10 w-10" />
          </div>

          <hr className="border-border w-full" />

          <div className="flex flex-col gap-150">
            <div className="bg-background-neutral rounded-radius-small h-6 w-24" />
            <div className="bg-background-neutral rounded-radius-small h-4 w-full" />
            <div className="bg-background-neutral rounded-radius-small h-4 w-full" />
            <div className="bg-background-neutral rounded-radius-small h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EpisodePage({ params }: EpisodePageProps) {
  return (
    <Suspense fallback={<EpisodePageSkeleton />}>
      <EpisodeDetails params={params} />
    </Suspense>
  );
}
