import type { Show, Episode } from '@/types/api-types';

const BASE_URL = 'https://api.tvmaze.com';

export const searchShows = async (query: string): Promise<Show[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.map((item: { show: Show }) => item.show);
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
};

export const getShowDetails = async (id: string | number): Promise<Show | null> => {
  try {
    const response = await fetch(`${BASE_URL}/shows/${id}?embed[]=episodes&embed[]=cast`);
    return await response.json();
  } catch (error) {
    console.error('Fetching show details failed:', error);
    return null;
  }
};

export const getEpisodeDetails = async (id: string | number): Promise<Episode | null> => {
  try {
    const response = await fetch(`${BASE_URL}/episodes/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Fetching episode details failed:', error);
    return null;
  }
};
