/* TVMaze Data API types */

export interface CastMember {
  person: {
    name: string;
    image?: { medium: string };
  };
  character: {
    name: string;
  };
}

export interface Episode {
  id: number | string;
  number: number;
  season: number;
  name: string;
  summary: string;
  airdate: string;
  image?: { medium: string; original: string };
  runtime?: number;
  rating?: { average: number };
  url: string;
  _links: {
    self: { href: 'https://api.tvmaze.com/episodes/1648840' };
    show: { href: 'https://api.tvmaze.com/shows/19'; name: 'Supernatural' };
  };
}

export interface Show {
  id: number | string;
  name: string;
  genres: string[];
  premiered: string;
  rating: { average: number | null };
  image?: { medium: string; original: string };
  summary: string;
  status?: string;
  runtime?: number;
  officialSite?: string;
  _embedded?: {
    episodes?: Episode[];
    cast?: CastMember[];
  };
}

export interface ScheduleEpisode {
  id: number | string;
  name: string;
  season: number;
  number: number;
  airdate: string;
  airtime: string;
  runtime?: number;
  rating?: { average: number | null };
  image?: { medium: string; original: string };
  summary?: string;
  _embedded?: {
    show: Show;
  };
}

export type Season = {
  id: number | string;
  url: string;
  number: number;
  name: string;
  episodeOrder: number;
  premiereDate: string;
  endDate: string;
  network: {
    id: number | string;
    name: string;
    country: {
      name: string;
      code: string;
      timezone: string;
    };
    officialSite?: string;
  };
  webChannel: string | null;
  image?: { medium: string; original: string };
  summary: string;
  _links: {
    self: {
      href: string;
    };
  };
};
