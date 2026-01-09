'use client';

import { useTransition } from 'react';

import { toggleFavorite, isInFavorite } from '@/app/actions/favorites';
import { useToggleState } from '@/hooks/useToggleState';

import type { FavoriteType, FavoriteMetadata, FavoriteActionResult } from '@/types/favorites';

type FavoriteButtonProps = {
  id: string | number;
  type?: FavoriteType;
  metadata?: FavoriteMetadata;
  rating?: number;
};

export default function FavoriteButton({
  id,
  type = 'show',
  metadata,
  rating,
}: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const {
    isActive: isFavorite,
    isLoading,
    handleToggle: baseHandleToggle,
  } = useToggleState<FavoriteActionResult>({
    checkStatus: () => isInFavorite(id, type),
    onToggle: () => toggleFavorite(id, type, metadata, rating),
    dependencies: [id, type],
  });

  const handleToggle = () => {
    startTransition(() => {
      baseHandleToggle();
    });
  };

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
      disabled={isPending}
      className={`rounded-radius-large font-weight-bold flex flex-1 items-center justify-center gap-100 p-150 transition-colors ${
        isFavorite
          ? 'bg-amber-400 text-gray-900 hover:bg-amber-500'
          : 'bg-background-neutral text-text hover:bg-background-neutral-hovered'
      } ${isPending ? 'opacity-50' : ''}`}
    >
      <span className={`material-symbols-outlined ${isFavorite ? '!fill-1' : ''}`}>
        {isFavorite ? 'favorite' : 'favorite_border'}
      </span>
      {isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
    </button>
  );
}
