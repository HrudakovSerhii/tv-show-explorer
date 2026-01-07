import { describe, it, expect, beforeEach, vi } from 'vitest';
import { searchShows, getShowDetails, getEpisodeDetails } from './tvmaze';
import {
  mockSearchResponse,
  mockShowDetails,
  mockEpisodeDetails,
  mockShows,
} from './__mocks__/tvmaze.mock';

// Mock fetch globally
global.fetch = vi.fn();

describe('TVMaze API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as ReturnType<typeof vi.fn>).mockReset();
  });

  describe('searchShows', () => {

    it('should return array of shows on successful search', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResponse,
      });

      const result = await searchShows('batman');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/search/shows?q=batman'
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockShows[0]);
      expect(result[1]).toEqual(mockShows[1]);
    });

    it('should encode special characters in search query', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await searchShows('game of thrones & dragons');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/search/shows?q=game%20of%20thrones%20%26%20dragons'
      );
    });

    it('should return empty array when no results found', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await searchShows('nonexistentshow123456');

      expect(result).toEqual([]);
    });

    it('should return empty array on HTTP error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await searchShows('batman');

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Search failed: Search failed with status: 500'
      );

      consoleErrorSpy.mockRestore();
    });

    it('should return empty array on network error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await searchShows('batman');

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Search failed: Network error'
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle malformed JSON response', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token');
        },
      });

      const result = await searchShows('batman');

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getShowDetails', () => {
    it('should return show details on successful fetch', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockShowDetails,
      });

      const result = await getShowDetails(169);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/shows/169?embed[]=episodes&embed[]=cast'
      );
      expect(result).toEqual(mockShowDetails);
      expect(result?.name).toBe('Breaking Bad');
      expect(result?._embedded?.episodes).toHaveLength(2);
      expect(result?._embedded?.cast).toHaveLength(2);
    });

    it('should work with string ID', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockShowDetails,
      });

      const result = await getShowDetails('169');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/shows/169?embed[]=episodes&embed[]=cast'
      );
      expect(result).toEqual(mockShowDetails);
    });

    it('should return null on 404 response', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await getShowDetails(999999);

      expect(result).toBeNull();
    });

    it('should return null on other HTTP errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await getShowDetails(169);

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Fetching show details failed: Failed to fetch show details: 500'
      );

      consoleErrorSpy.mockRestore();
    });

    it('should return null on network error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await getShowDetails(169);

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Fetching show details failed: Network error'
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle malformed JSON response', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token');
        },
      });

      const result = await getShowDetails(169);

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getEpisodeDetails', () => {
    it('should return episode details on successful fetch', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEpisodeDetails,
      });

      const result = await getEpisodeDetails(mockEpisodeDetails.id);

      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.tvmaze.com/episodes/${mockEpisodeDetails.id}`
      );
      expect(result).toEqual(mockEpisodeDetails);
    });

    it('should work with string ID', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEpisodeDetails,
      });

      const result = await getEpisodeDetails(String(mockEpisodeDetails.id));

      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.tvmaze.com/episodes/${mockEpisodeDetails.id}`
      );
      expect(result).toEqual(mockEpisodeDetails);
    });

    it('should return null on 404 response', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await getEpisodeDetails(999999);

      expect(result).toBeNull();
    });

    it('should return null on other HTTP errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await getEpisodeDetails(mockEpisodeDetails.id);

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Fetching episode details failed: Failed to fetch episode details: 500'
      );

      consoleErrorSpy.mockRestore();
    });

    it('should return null on network error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await getEpisodeDetails(mockEpisodeDetails.id);

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Fetching episode details failed: Network error'
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle malformed JSON response', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token');
        },
      });

      const result = await getEpisodeDetails(mockEpisodeDetails.id);

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
