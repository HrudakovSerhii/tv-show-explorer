'use client';

import { isInWatchlist, toggleWatchlist } from '@/lib/utils/localStorage';
import { useToggleState } from '@/hooks/useToggleState';

type WatchlistButtonProps = {
  id: string | number;
  type?: 'show' | 'episode';
};

export default function WatchlistButton({ id, type = 'show' }: WatchlistButtonProps) {
  const prefixedId = `${type}-${id}`;

  const {
    isActive: inWatchlist,
    isLoading,
    handleToggle,
  } = useToggleState<boolean>({
    checkStatus: () => isInWatchlist(prefixedId),
    onToggle: () => toggleWatchlist(prefixedId),
    dependencies: [prefixedId],
  });

  if (isLoading) {
    return (
      <button
        disabled
        className="bg-background-neutral text-text rounded-radius-large font-weight-bold flex flex-1 items-center justify-center gap-100 p-150 opacity-50"
      >
        <span className="material-symbols-outlined">hourglass_empty</span>
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`rounded-radius-large font-weight-bold flex flex-1 items-center justify-center gap-100 p-150 text-center transition-colors ${
        inWatchlist
          ? 'bg-background-brand-bold text-text hover:bg-background-brand-bold-hovered'
          : 'bg-background-neutral text-text hover:bg-background-neutral-hovered'
      }`}
    >
      <span className="material-symbols-outlined">{inWatchlist ? 'check' : 'add'}</span>
      {inWatchlist ? 'In Your Watchlist!' : 'Add to Watchlist'}
    </button>
  );
}
