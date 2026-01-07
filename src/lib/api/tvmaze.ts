import { cacheLife } from 'next/cache';

import type { Show, Episode } from '@/types/api-types';

const BASE_URL = 'https://api.tvmaze.com';

export async function searchShows(query: string): Promise<Show[]> {
  'use cache';
  cacheLife('search');

  try {
    const response = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`Search failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((item: { show: Show }) => item.show);
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}

export async function getShowDetails(id: string | number): Promise<Show | null> {
  'use cache';
  cacheLife('show');

  try {
    const response = await fetch(`${BASE_URL}/shows/${id}?embed[]=episodes&embed[]=cast`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch show details: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetching show details failed:', error);
    return null;
  }
}

export async function getEpisodeDetails(id: string | number): Promise<Episode | null> {
  'use cache';
  cacheLife('episode');

  try {
    const response = await fetch(`${BASE_URL}/episodes/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch episode details: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetching episode details failed:', error);
    return null;
  }
}
