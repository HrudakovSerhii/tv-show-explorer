/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  toggleFavorite,
  isInFavorite,
  updateFavoriteRating,
  getFavoriteRating,
} from './favorites';

import type { FavoritesData } from '@/types/favorites';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/utils/fileStorage', () => ({
  readFavoritesFile: vi.fn(),
  writeFavoritesFile: vi.fn(),
}));

const { readFavoritesFile, writeFavoritesFile } = await import('@/lib/utils/fileStorage');
const { revalidatePath } = await import('next/cache');

const mockReadFavoritesFile = readFavoritesFile as ReturnType<typeof vi.fn>;
const mockWriteFavoritesFile = writeFavoritesFile as ReturnType<typeof vi.fn>;
const mockRevalidatePath = revalidatePath as ReturnType<typeof vi.fn>;

describe('Favorites Actions', () => {
  const mockEmptyData: FavoritesData = {
    favorites: [],
    lastModified: '2026-01-09T00:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockReadFavoritesFile.mockResolvedValue(mockEmptyData);
    mockWriteFavoritesFile.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('toggleFavorite', () => {
    it('should add favorite when it does not exist', async () => {
      const result = await toggleFavorite(
        123,
        'episode',
        {
          showName: 'Breaking Bad',
          episodeName: 'Pilot',
          season: 1,
          number: 1,
        },
        9
      );

      expect(result.success).toBe(true);
      expect(result.isFavorite).toBe(true);
      expect(mockWriteFavoritesFile).toHaveBeenCalledWith(
        expect.objectContaining({
          favorites: expect.arrayContaining([
            expect.objectContaining({
              id: 'episode-123',
              type: 'episode',
              rating: 9,
            }),
          ]),
        })
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    });

    it('should remove favorite when it exists', async () => {
      mockReadFavoritesFile.mockResolvedValue({
        favorites: [
          {
            id: 'show-123',
            type: 'show',
            addedAt: '2026-01-09T00:00:00.000Z',
            rating: 8,
          },
        ],
        lastModified: '2026-01-09T00:00:00.000Z',
      });

      const result = await toggleFavorite(123, 'show');

      expect(result.success).toBe(true);
      expect(result.isFavorite).toBe(false);
      expect(mockWriteFavoritesFile).toHaveBeenCalledWith(
        expect.objectContaining({
          favorites: [],
        })
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    });

    it('should handle errors gracefully', async () => {
      mockReadFavoritesFile.mockRejectedValue(new Error('File read error'));

      const result = await toggleFavorite(123, 'show');

      expect(result.success).toBe(false);
      expect(result.error).toBe('File read error');
    });
  });

  describe('isInFavorite', () => {
    it('should return true if item is in favorites', async () => {
      mockReadFavoritesFile.mockResolvedValue({
        favorites: [
          {
            id: 'show-123',
            type: 'show',
            addedAt: '2026-01-09T00:00:00.000Z',
          },
        ],
        lastModified: '2026-01-09T00:00:00.000Z',
      });

      const result = await isInFavorite(123, 'show');

      expect(result).toBe(true);
    });

    it('should return false if item is not in favorites', async () => {
      const result = await isInFavorite(123, 'show');

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      mockReadFavoritesFile.mockRejectedValue(new Error('File read error'));

      const result = await isInFavorite(123, 'show');

      expect(result).toBe(false);
    });

    it('should handle different ID types correctly', async () => {
      mockReadFavoritesFile.mockResolvedValue({
        favorites: [
          {
            id: 'episode-456',
            type: 'episode',
            addedAt: '2026-01-09T00:00:00.000Z',
          },
        ],
        lastModified: '2026-01-09T00:00:00.000Z',
      });

      const resultString = await isInFavorite('456', 'episode');
      const resultNumber = await isInFavorite(456, 'episode');

      expect(resultString).toBe(true);
      expect(resultNumber).toBe(true);
    });
  });

  describe('updateFavoriteRating', () => {
    it('should update rating for existing favorite', async () => {
      mockReadFavoritesFile.mockResolvedValue({
        favorites: [
          {
            id: 'show-123',
            type: 'show',
            addedAt: '2026-01-09T00:00:00.000Z',
            metadata: { showName: 'Breaking Bad' },
            rating: 8,
          },
        ],
        lastModified: '2026-01-09T00:00:00.000Z',
      });

      const result = await updateFavoriteRating(123, 'show', 10);

      expect(result.success).toBe(true);
      expect(mockWriteFavoritesFile).toHaveBeenCalledWith(
        expect.objectContaining({
          favorites: [
            expect.objectContaining({
              id: 'show-123',
              rating: 10,
            }),
          ],
        })
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    });

    it('should create favorite when it does not exist', async () => {
      const result = await updateFavoriteRating(123, 'show', 10, { showName: 'Test Show' });

      expect(result.success).toBe(true);
      expect(mockWriteFavoritesFile).toHaveBeenCalledWith(
        expect.objectContaining({
          favorites: expect.arrayContaining([
            expect.objectContaining({
              id: 'show-123',
              type: 'show',
              rating: 10,
              metadata: { showName: 'Test Show' },
            }),
          ]),
        })
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    });

    it('should handle errors gracefully', async () => {
      mockReadFavoritesFile.mockRejectedValue(new Error('File read error'));

      const result = await updateFavoriteRating(123, 'show', 10);

      expect(result.success).toBe(false);
      expect(result.error).toBe('File read error');
    });
  });

  describe('getFavoriteRating', () => {
    it('should return rating for existing favorite', async () => {
      mockReadFavoritesFile.mockResolvedValue({
        favorites: [
          {
            id: 'show-123',
            type: 'show',
            addedAt: '2026-01-09T00:00:00.000Z',
            rating: 9,
          },
        ],
        lastModified: '2026-01-09T00:00:00.000Z',
      });

      const result = await getFavoriteRating(123, 'show');

      expect(result).toBe(9);
    });

    it('should return null if favorite has no rating', async () => {
      mockReadFavoritesFile.mockResolvedValue({
        favorites: [
          {
            id: 'show-123',
            type: 'show',
            addedAt: '2026-01-09T00:00:00.000Z',
          },
        ],
        lastModified: '2026-01-09T00:00:00.000Z',
      });

      const result = await getFavoriteRating(123, 'show');

      expect(result).toBeNull();
    });

    it('should return null if favorite does not exist', async () => {
      mockReadFavoritesFile.mockResolvedValue(mockEmptyData);

      const result = await getFavoriteRating(999, 'show');

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      mockReadFavoritesFile.mockRejectedValue(new Error('File read error'));

      const result = await getFavoriteRating(123, 'show');

      expect(result).toBeNull();
    });
  });
});
