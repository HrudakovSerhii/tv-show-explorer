/**
 * Local Storage utility for managing watchlist and theme
 */

const WATCHLIST_KEY = 'tv-show-watchlist';
const THEME_KEY = 'tv-show-theme';

type WatchlistItem = {
  id: string | number;
  addedAt: string;
};

/**
 * Watchlist Functions
 */

export function isInWatchlist(showId: string | number): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    const watchlist: WatchlistItem[] = stored ? JSON.parse(stored) : [];

    return watchlist.some((item) => String(item.id) === String(showId));
  } catch {
    return false;
  }
}

export function toggleWatchlist(showId: string | number): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    const watchlist: WatchlistItem[] = stored ? JSON.parse(stored) : [];
    const isInList = watchlist.some((item) => String(item.id) === String(showId));

    if (isInList) {
      const filtered = watchlist.filter((item) => String(item.id) !== String(showId));
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));

      return false;
    } else {
      const newItem: WatchlistItem = { id: showId, addedAt: new Date().toISOString() };
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify([...watchlist, newItem]));

      return true;
    }
  } catch (error) {
    console.error('Failed to toggle watchlist:', error);

    return false;
  }
}

/**
 * Theme Functions
 */

export type ThemeMode = 'light' | 'dark';

export function getTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';

  try {
    const stored = localStorage.getItem(THEME_KEY);

    return stored ? (JSON.parse(stored) as ThemeMode) : 'dark';
  } catch {
    return 'dark';
  }
}

export function setTheme(theme: ThemeMode): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
    return true;
  } catch (error) {
    console.error('Failed to set theme:', error);
    return false;
  }
}
