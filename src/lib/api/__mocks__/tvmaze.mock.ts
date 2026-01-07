import type { Show, Episode, CastMember } from '@/types/api-types';

export const mockShows: Show[] = [
  {
    id: 1,
    name: 'Batman: The Animated Series',
    genres: ['Action', 'Adventure', 'Animation'],
    premiered: '1992-09-05',
    rating: { average: 9.0 },
    image: {
      medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/1/3763.jpg',
      original: 'https://static.tvmaze.com/uploads/images/original_untouched/1/3763.jpg',
    },
    summary: '\\u003Cp\\u003EBatman fights crime in Gotham City\\u003C/p\\u003E',
    status: 'Ended',
    runtime: 30,
  },
  {
    id: 2,
    name: 'Batman',
    genres: ['Action', 'Adventure', 'Comedy'],
    premiered: '1966-01-12',
    rating: { average: 7.5 },
    image: {
      medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/2/5421.jpg',
      original: 'https://static.tvmaze.com/uploads/images/original_untouched/2/5421.jpg',
    },
    summary: '\\u003Cp\\u003EClassic Batman TV series\\u003C/p\\u003E',
    status: 'Ended',
    runtime: 25,
  },
];

export const mockSearchResponse = mockShows.map((show) => ({ show }));

export const mockEpisodes: Episode[] = [
  {
    id: 1,
    number: 1,
    season: 1,
    name: 'Pilot',
    summary: '\\u003Cp\\u003EThe pilot episode\\u003C/p\\u003E',
    airdate: '2008-01-20',
    runtime: 58,
    rating: { average: 8.5 },
  },
  {
    id: 2,
    number: 2,
    season: 1,
    name: 'Second Episode',
    summary: '\\u003Cp\\u003EThe second episode\\u003C/p\\u003E',
    airdate: '2008-01-27',
    runtime: 45,
    rating: { average: 8.3 },
  },
];

export const mockCast: CastMember[] = [
  {
    person: {
      name: 'Bryan Cranston',
      image: {
        medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/0/22.jpg',
      },
    },
    character: {
      name: 'Walter White',
    },
  },
  {
    person: {
      name: 'Aaron Paul',
      image: {
        medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/0/23.jpg',
      },
    },
    character: {
      name: 'Jesse Pinkman',
    },
  },
];

export const mockShowDetails: Show = {
  id: 169,
  name: 'Breaking Bad',
  genres: ['Drama', 'Crime', 'Thriller'],
  premiered: '2008-01-20',
  rating: { average: 9.5 },
  image: {
    medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg',
    original: 'https://static.tvmaze.com/uploads/images/original_untouched/0/2400.jpg',
  },
  summary: '\\u003Cp\\u003EA high school chemistry teacher turned meth manufacturer\\u003C/p\\u003E',
  status: 'Ended',
  runtime: 45,
  officialSite: 'http://www.amc.com/shows/breaking-bad',
  _embedded: {
    episodes: mockEpisodes,
    cast: mockCast,
  },
};

export const mockEpisodeDetails: Episode = mockEpisodes[0];
