import { cacheLife } from 'next/cache';

import { formatErrorMessage, createApiStatusError } from './error-utils';

import type { Show, Episode, ScheduleEpisode, Season } from '@/types/api-types';

const BASE_URL = 'https://api.tvmaze.com';

export async function searchShows(query: string): Promise<Show[]> {
  'use cache';
  cacheLife('search');

  try {
    const response = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw createApiStatusError('Search failed with status', response.status);
    }

    const data = await response.json();
    return data.map((item: { show: Show }) => item.show);
  } catch (error) {
    console.error(formatErrorMessage('Search failed:', error));
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
      throw createApiStatusError('Failed to fetch show details', response.status);
    }

    return await response.json();
  } catch (error) {
    console.error(formatErrorMessage('Fetching show details failed:', error));
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
      throw createApiStatusError('Failed to fetch episode details', response.status);
    }

    return await response.json();
  } catch (error) {
    console.error(formatErrorMessage('Fetching episode details failed:', error));
    return null;
  }
}

export async function getWebSchedule(options?: {
  country?: string;
  date?: string;
}): Promise<ScheduleEpisode[]> {
  'use cache';
  cacheLife('search');

  try {
    const params = new URLSearchParams();
    if (options?.country !== undefined) {
      params.set('country', options.country);
    }
    if (options?.date) {
      params.set('date', options.date);
    }

    const url = `${BASE_URL}/schedule/web${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw createApiStatusError('Failed to fetch web schedule', response.status);
    }

    return await response.json();
  } catch (error) {
    console.error(formatErrorMessage('Fetching web schedule failed:', error));
    return [];
  }
}

export async function getShowSeasons(id: string | number): Promise<Array<Season> | null> {
  'use cache';
  cacheLife('season');

  try {
    const response = await fetch(`${BASE_URL}/shows/${id}/seasons`);

    if (!response.ok) {
      throw createApiStatusError(`Failed to fetch show ${id} seasons`, response.status);
    }

    return await response.json();
  } catch (error) {
    console.error(formatErrorMessage('Fetching show seasons failed:', error));
    return null;
  }
}
