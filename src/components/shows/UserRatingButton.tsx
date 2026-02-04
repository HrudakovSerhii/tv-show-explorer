'use client';

import { useState, useEffect } from 'react';

import RatingControl, { RatingControlSkeleton } from '@/components/shared/RatingControl';
import { log } from '@/lib/utils/logger';

import { getFavoriteRating, updateFavoriteRating } from '@/app/actions/favorites';

import type { FavoriteType, FavoriteMetadata } from '@/types/favorites';

type FavoriteRatingProps = {
  id: string | number;
  type?: FavoriteType;
  label?: string;
  metadata?: FavoriteMetadata;
};

export default function UserRatingButton({
  id,
  type = 'show',
  label = 'Rate this',
  metadata,
}: FavoriteRatingProps) {
  const [rating, setRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRating() {
      const savedRating = await getFavoriteRating(id, type);

      if (savedRating !== null) {
        setRating(savedRating);
      }

      setIsLoading(false);
    }

    void loadRating();
  }, [id, type]);

  const handleRatingChange = async (newRating: number) => {
    const previousRating = rating;

    // Optimistic update
    setRating(newRating);

    const result = await updateFavoriteRating(id, type, newRating, metadata);

    if (!result.success) {
      log.error('Failed to save rating:', result.error);
      // Rollback on error
      setRating(previousRating);
    }
  };

  if (isLoading) {
    return <RatingControlSkeleton label={label} />;
  }

  return <RatingControl initialRating={rating} label={label} onChange={handleRatingChange} />;
}
