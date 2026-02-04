'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { readFavoritesFile, writeFavoritesFile } from '@/lib/utils/fileStorage';
import { isRateLimited } from '@/lib/utils/rateLimiter';
import { log } from '@/lib/utils/logger';

import type {
  FavoriteType,
  FavoriteMetadata,
  FavoriteActionResult,
  FavoriteItem,
} from '@/types/favorites';

function createPrefixedId(id: string | number, type: FavoriteType): string {
  return `${type}-${id}`;
}

export async function toggleFavorite(
  id: string | number,
  type: FavoriteType,
  metadata?: FavoriteMetadata,
  rating?: number,
): Promise<FavoriteActionResult> {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous';
  if (isRateLimited(ip)) {
    return { success: false, error: 'Rate limit exceeded. Please try again later.' };
  }

  try {
    const prefixedId = createPrefixedId(id, type);
    const data = await readFavoritesFile();

    const existingIndex = data.favorites.findIndex((fav) => fav.id === prefixedId);

    if (existingIndex !== -1) {
      data.favorites.splice(existingIndex, 1);
      await writeFavoritesFile(data);
      revalidatePath('/');

      return { success: true, isFavorite: false };
    } else {
      const newFavorite: FavoriteItem = {
        id: prefixedId,
        type,
        addedAt: new Date().toISOString(),
        metadata,
        rating,
      };

      data.favorites.push(newFavorite);
      await writeFavoritesFile(data);
      revalidatePath('/');

      return { success: true, isFavorite: true };
    }
  } catch (error) {
    log.error('Error toggling favorite:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle favorite',
    };
  }
}

export async function isInFavorite(id: string | number, type: FavoriteType): Promise<boolean> {
  try {
    const prefixedId = createPrefixedId(id, type);
    const data = await readFavoritesFile();

    return data.favorites.some((fav) => fav.id === prefixedId);
  } catch (error) {
    log.error('Error checking favorite status:', error);

    return false;
  }
}

export async function updateFavoriteRating(
  id: string | number,
  type: FavoriteType,
  rating: number,
  metadata?: FavoriteMetadata,
): Promise<FavoriteActionResult> {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous';
  if (isRateLimited(ip)) {
    return { success: false, error: 'Rate limit exceeded. Please try again later.' };
  }

  try {
    const prefixedId = createPrefixedId(id, type);
    const data = await readFavoritesFile();

    const existingIndex = data.favorites.findIndex((fav) => fav.id === prefixedId);

    if (existingIndex !== -1) {
      data.favorites[existingIndex].rating = rating;
      await writeFavoritesFile(data);
      revalidatePath('/');

      return { success: true };
    }

    // If item doesn't exist in favorites, create it with the rating
    const newFavorite: FavoriteItem = {
      id: prefixedId,
      type,
      addedAt: new Date().toISOString(),
      rating,
      metadata,
    };

    data.favorites.push(newFavorite);
    await writeFavoritesFile(data);
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    log.error('Error updating favorite rating:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update rating',
    };
  }
}

export async function getFavoriteRating(
  id: string | number,
  type: FavoriteType,
): Promise<number | null> {
  try {
    const prefixedId = createPrefixedId(id, type);
    const data = await readFavoritesFile();

    const favorite = data.favorites.find((fav) => fav.id === prefixedId);

    return favorite?.rating ?? null;
  } catch (error) {
    log.error('Error getting favorite rating:', error);

    return null;
  }
}
