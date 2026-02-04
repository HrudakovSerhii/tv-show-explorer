'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { readFavoritesFile, writeFavoritesFile } from '@/lib/utils/fileStorage';
import { isRateLimited } from '@/lib/utils/rateLimiter';
import { log } from '@/lib/utils/logger';

import {
  createPrefixedId,
  toggleFavoriteInList,
  findFavoriteInList,
  updateRatingInList,
} from './favorites.core';

import type { FavoriteType, FavoriteMetadata, FavoriteActionResult } from '@/types/favorites';

export async function toggleFavorite(
  id: string | number,
  type: FavoriteType,
  metadata?: FavoriteMetadata,
  rating?: number
): Promise<FavoriteActionResult> {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous';
  if (isRateLimited(ip)) {
    return { success: false, error: 'Rate limit exceeded. Please try again later.' };
  }

  try {
    const prefixedId = createPrefixedId(id, type);
    const data = await readFavoritesFile();

    const result = toggleFavoriteInList(data.favorites, prefixedId, type, metadata, rating);
    data.favorites = result.favorites;

    await writeFavoritesFile(data);
    revalidatePath('/');

    return { success: true, isFavorite: result.wasAdded };
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

    return findFavoriteInList(data.favorites, prefixedId) !== undefined;
  } catch (error) {
    log.error('Error checking favorite status:', error);

    return false;
  }
}

export async function updateFavoriteRating(
  id: string | number,
  type: FavoriteType,
  rating: number,
  metadata?: FavoriteMetadata
): Promise<FavoriteActionResult> {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous';
  if (isRateLimited(ip)) {
    return { success: false, error: 'Rate limit exceeded. Please try again later.' };
  }

  try {
    const prefixedId = createPrefixedId(id, type);
    const data = await readFavoritesFile();

    data.favorites = updateRatingInList(data.favorites, prefixedId, type, rating, metadata);

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
  type: FavoriteType
): Promise<number | null> {
  try {
    const prefixedId = createPrefixedId(id, type);
    const data = await readFavoritesFile();

    const favorite = findFavoriteInList(data.favorites, prefixedId);

    return favorite?.rating ?? null;
  } catch (error) {
    log.error('Error getting favorite rating:', error);

    return null;
  }
}
