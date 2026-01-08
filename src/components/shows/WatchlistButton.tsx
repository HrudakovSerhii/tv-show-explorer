'use client';

import { useState, useEffect } from 'react';

import { isInWatchlist, toggleWatchlist } from '@/lib/utils/localStorage';

type WatchlistButtonProps = {
  showId: string | number;
};

export default function WatchlistButton({ showId }: WatchlistButtonProps) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load watchlist status on mount
  useEffect(() => {
    setInWatchlist(isInWatchlist(showId));
    setIsLoading(false);
  }, [showId]);

  const handleToggle = () => {
    const newStatus = toggleWatchlist(showId);

    setInWatchlist(newStatus);
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="bg-background-neutral dark:bg-background-neutral-bold text-text dark:text-text-inverse rounded-radius-large font-weight-bold flex flex-1 items-center justify-center gap-100 p-150 opacity-50"
      >
        <span className="material-symbols-outlined">hourglass_empty</span>
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`rounded-radius-large font-weight-bold flex flex-1 items-center justify-center gap-100 p-150 transition-colors ${
        inWatchlist
          ? 'bg-background-brand-bold text-text-inverse hover:bg-background-brand-bold-hovered'
          : 'bg-background-neutral dark:bg-background-neutral-bold text-text dark:text-text-inverse hover:bg-background-neutral-hovered dark:hover:bg-background-neutral-subtle-hovered'
      }`}
    >
      <span className="material-symbols-outlined">{inWatchlist ? 'check' : 'add'}</span>
      {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
    </button>
  );
}
