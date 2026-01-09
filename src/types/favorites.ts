export type FavoriteType = 'show' | 'episode';

export interface FavoriteMetadata {
  showName: string;
  episodeName?: string;
  season?: number;
  number?: number;
}

export interface FavoriteItem {
  id: string;
  type: FavoriteType;
  addedAt: string;
  metadata?: FavoriteMetadata;
  rating?: number;
}

export interface FavoritesData {
  favorites: FavoriteItem[];
  lastModified: string;
}

export interface FavoriteActionResult {
  success: boolean;
  isFavorite?: boolean;
  error?: string;
}
