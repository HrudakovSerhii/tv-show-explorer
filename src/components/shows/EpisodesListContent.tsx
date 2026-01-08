import React from 'react';
import Link from 'next/link';

import { NAV_URLS } from '@/constants';

import type { Episode } from '@/types/api-types';

type EpisodesListContentProps = {
  showId: string;
  episodes: Array<Episode>;
};

export default function EpisodesListContent({ showId, episodes }: EpisodesListContentProps) {
  if (episodes.length === 0) {
    return (
      <div className="text-text-subtle flex flex-col items-center gap-200 py-600 text-center">
        <span className="material-symbols-outlined text-icon-subtlest text-6xl">tv_off</span>
        <p className="text-base">No episodes found for this season</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-200">
      {episodes.map((ep) => (
        <Link
          key={ep.id}
          href={`${NAV_URLS.show}/${showId}/${ep.id}`}
          className="bg-background-neutral dark:bg-background-neutral-bold hover:bg-background-neutral-hovered dark:hover:bg-background-neutral-subtle-hovered shadow-raised hover:shadow-overlay border-border dark:border-border-inverse group flex cursor-pointer flex-col gap-200 rounded-radius-large border p-200 transition-all sm:flex-row"
        >
          <div className="bg-background-neutral-subtle relative aspect-video w-full flex-shrink-0 overflow-hidden rounded-radius-medium sm:w-48">
            {ep.image?.medium || ep.image?.original ? (
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url("${ep.image.medium || ep.image.original}")`,
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-icon-subtle material-symbols-outlined text-4xl">image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-black/0" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center text-left">
            <div className="mb-100 flex items-center justify-between">
              <span className="text-brand bg-background-brand-bold/10 rounded-radius-small px-100 py-50 text-xs font-weight-bold">
                S{ep.season} E{ep.number}
              </span>
              {ep.airdate && (
                <span className="text-text-subtlest text-xs font-weight-medium">{ep.airdate}</span>
              )}
            </div>
            <h4 className="text-text dark:text-text-inverse group-hover:text-brand mb-50 truncate text-lg font-weight-bold transition-colors">
              {ep.name}
            </h4>
            {ep.summary && (
              <p className="text-text-subtle line-clamp-2 text-sm">
                {ep.summary.replace(/<[^>]*>/g, '').trim()}
              </p>
            )}
          </div>

          <div className="text-border-bold group-hover:text-brand hidden items-center justify-center px-100 transition-colors sm:flex">
            <span className="material-symbols-outlined text-3xl">chevron_right</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
