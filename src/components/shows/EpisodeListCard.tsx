import React from 'react';
import Link from 'next/link';

import { NAV_URLS } from '@/constants';

import type { Episode } from '@/types/api-types';

type EpisodeListCardProps = {
  showId: string;
  episode?: Episode;
  isLoading?: boolean;
};

export default function EpisodeListCard({
  showId,
  episode,
  isLoading = false,
}: EpisodeListCardProps) {
  if (isLoading) {
    return (
      <div className="bg-background-neutral-subtle rounded-radius-large flex flex-col gap-200 p-200 sm:flex-row">
        {/* Episode Image Skeleton */}
        <div className="bg-background-neutral rounded-radius-medium aspect-video w-full flex-shrink-0 animate-pulse sm:w-48" />

        {/* Episode Info Skeleton */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-100">
          <div className="flex items-center justify-between">
            <div className="bg-background-neutral rounded-radius-small h-5 w-16 animate-pulse" />
            <div className="bg-background-neutral rounded-radius-small h-4 w-20 animate-pulse" />
          </div>
          <div className="bg-background-neutral rounded-radius-small h-6 w-3/4 animate-pulse" />
          <div className="bg-background-neutral rounded-radius-small h-4 w-full animate-pulse" />
          <div className="bg-background-neutral rounded-radius-small h-4 w-5/6 animate-pulse" />
        </div>

        {/* Arrow Icon Placeholder */}
        <div className="hidden sm:flex sm:w-12" />
      </div>
    );
  }

  if (!episode) {
    return null;
  }

  return (
    <Link
      href={`${NAV_URLS.show}/${showId}/${episode.id}`}
      className="bg-background-neutral hover:bg-background-neutral-hovered shadow-raised hover:shadow-overlay border-border group rounded-radius-large flex cursor-pointer flex-col gap-200 border p-200 transition-all sm:flex-row"
    >
      <div className="bg-background-neutral-subtle rounded-radius-medium relative aspect-video w-full flex-shrink-0 overflow-hidden sm:w-48">
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
            <span className="text-icon-subtle material-symbols-outlined text-4xl">image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-black/0" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center text-left">
        <div className="mb-100 flex items-center justify-between">
          <span className="text-brand bg-background-brand-bold/10 rounded-radius-small font-weight-bold px-100 py-50 text-xs">
            S{episode.season} E{episode.number}
          </span>
          {episode.airdate && (
            <span className="text-text-subtlest font-weight-medium text-xs">{episode.airdate}</span>
          )}
        </div>
        <h4 className="text-text group-hover:text-brand font-weight-bold mb-50 truncate text-lg transition-colors">
          {episode.name}
        </h4>
        {episode.summary && (
          <p className="text-text-subtle line-clamp-2 text-sm">
            {episode.summary.replace(/<[^>]*>/g, '').trim()}
          </p>
        )}
      </div>

      <div className="text-border-bold group-hover:text-brand hidden items-center justify-center px-100 transition-colors sm:flex">
        <span className="material-symbols-outlined text-3xl">chevron_right</span>
      </div>
    </Link>
  );
}
