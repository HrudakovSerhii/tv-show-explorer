import type { FavoriteType, FavoriteMetadata, FavoriteItem } from '@/types/favorites';

export function createPrefixedId(id: string | number, type: FavoriteType): string {
  return `${type}-${id}`;
}

export type ToggleResult = {
  favorites: FavoriteItem[];
  wasAdded: boolean;
};

export function toggleFavoriteInList(
  favorites: FavoriteItem[],
  prefixedId: string,
  type: FavoriteType,
  metadata?: FavoriteMetadata,
  rating?: number
): ToggleResult {
  const existingIndex = favorites.findIndex((fav) => fav.id === prefixedId);

  if (existingIndex !== -1) {
    return {
      favorites: favorites.filter((_, index) => index !== existingIndex),
      wasAdded: false,
    };
  }

  const newFavorite: FavoriteItem = {
    id: prefixedId,
    type,
    addedAt: new Date().toISOString(),
    metadata,
    rating,
  };

  return {
    favorites: [...favorites, newFavorite],
    wasAdded: true,
  };
}

export function findFavoriteInList(
  favorites: FavoriteItem[],
  prefixedId: string
): FavoriteItem | undefined {
  return favorites.find((fav) => fav.id === prefixedId);
}

export function updateRatingInList(
  favorites: FavoriteItem[],
  prefixedId: string,
  type: FavoriteType,
  rating: number,
  metadata?: FavoriteMetadata
): FavoriteItem[] {
  const existingIndex = favorites.findIndex((fav) => fav.id === prefixedId);

  if (existingIndex !== -1) {
    return favorites.map((fav, index) =>
      index === existingIndex ? { ...fav, rating } : fav
    );
  }

  const newFavorite: FavoriteItem = {
    id: prefixedId,
    type,
    addedAt: new Date().toISOString(),
    rating,
    metadata,
  };

  return [...favorites, newFavorite];
}
