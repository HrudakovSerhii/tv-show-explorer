/**
 * Local Storage utility for managing application data
 */

export const WATCHLIST_KEY = 'tv-show-watchlist';

export type WatchlistItem = {
  id: string | number;
  addedAt: string;
};

export function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error(`Failed to get item "${key}" from localStorage:`, error);
    return null;
  }
}

export function setItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to set item "${key}" in localStorage:`, error);
    return false;
  }
}

export function removeItem(key: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove item "${key}" from localStorage:`, error);
    return false;
  }
}

export function hasItem(key: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Failed to check item "${key}" in localStorage:`, error);
    return false;
  }
}

export function clearAll(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * Watchlist-Specific Functions
 */

export function getWatchlist(): WatchlistItem[] {
  return getItem<WatchlistItem[]>(WATCHLIST_KEY) || [];
}

export function isInWatchlist(showId: string | number): boolean {
  const watchlist = getWatchlist();
  return watchlist.some((item) => String(item.id) === String(showId));
}

export function addToWatchlist(showId: string | number): boolean {
  const watchlist = getWatchlist();

  if (isInWatchlist(showId)) {
    return false;
  }

  const newItem: WatchlistItem = {
    id: showId,
    addedAt: new Date().toISOString(),
  };

  const updatedWatchlist = [...watchlist, newItem];
  return setItem(WATCHLIST_KEY, updatedWatchlist);
}

export function removeFromWatchlist(showId: string | number): boolean {
  const watchlist = getWatchlist();
  const filteredWatchlist = watchlist.filter((item) => String(item.id) !== String(showId));

  return setItem(WATCHLIST_KEY, filteredWatchlist);
}

export function toggleWatchlist(showId: string | number): boolean {
  if (isInWatchlist(showId)) {
    removeFromWatchlist(showId);
    return false;
  } else {
    addToWatchlist(showId);
    return true;
  }
}

export function clearWatchlist(): void {
  removeItem(WATCHLIST_KEY);
}
