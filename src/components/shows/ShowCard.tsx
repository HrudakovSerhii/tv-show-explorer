import React from 'react';
import Link from 'next/link';

import { NAV_URLS } from '@/constants';

import type { Show } from '@/types/api-types';

interface ShowCardProps {
  show: Show;
  onToggleWatchlist?: (show: Show) => void;
  isInWatchlist?: boolean;
  onClick?: (show: Show) => void;
}

const ShowCard: React.FC<ShowCardProps> = ({ show, onToggleWatchlist, isInWatchlist }) => {
  const hasMedium = !!show.image?.medium;
  const hasOriginal = !!show.image?.original;
  const hasImage = hasMedium || hasOriginal;

  return (
    <Link
      className="group flex cursor-pointer flex-col gap-150"
      href={`${NAV_URLS.show}/${show.id}`}
    >
      <div className="bg-background-neutral shadow-raised rounded-radius-large relative aspect-[2/3] w-full overflow-hidden">
        {hasImage ? (
          <picture className="absolute inset-0">
            {hasOriginal && <source media="(min-width: 768px)" srcSet={show.image!.original!} />}
            {hasMedium && <source media="(max-width: 767px)" srcSet={show.image!.medium!} />}
            <img
              src={show.image?.original || show.image?.medium}
              alt={show.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </picture>
        ) : (
          <div className="bg-background-neutral-subtle absolute inset-0 flex items-center justify-center">
            <span className="text-icon-subtle material-symbols-outlined text-6xl">image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"></div>

        <div className="shadow-overlay rounded-radius-small font-weight-bold text-text-inverse absolute top-100 right-100 flex items-center gap-50 bg-black/60 px-100 py-50 text-xs backdrop-blur-sm">
          <span className="material-symbols-outlined text-icon-accent-yellow fill-current !text-[14px]">
            star
          </span>
          {show.rating.average?.toString() || 'N/A'}
        </div>

        {onToggleWatchlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(show);
            }}
            className={`rounded-radius-full absolute right-100 bottom-100 p-100 backdrop-blur-md transition-all ${
              isInWatchlist
                ? 'bg-background-brand-bold text-text-inverse'
                : 'text-text-inverse bg-black/40 hover:bg-black/60'
            }`}
          >
            <span className="material-symbols-outlined !text-[20px]">
              {isInWatchlist ? 'bookmark_added' : 'bookmark_add'}
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-text group-hover:text-brand font-weight-bold truncate text-left text-base leading-tight transition-colors">
          {show.name}
        </h3>
        <div className="flex flex-wrap items-start">
          {show.genres.map((genre) => (
            <span
              key={genre}
              className="text-brand rounded-radius-full font-weight-medium px-50 py-25 text-xs md:px-100"
            >
              {genre}
            </span>
          ))}
        </div>
        <span className="text-text-subtle text-sm">{show.premiered}</span>
      </div>
    </Link>
  );
};

export default ShowCard;
