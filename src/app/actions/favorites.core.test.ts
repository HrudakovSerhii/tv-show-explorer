import { describe, it, expect } from 'vitest';

import {
  createPrefixedId,
  toggleFavoriteInList,
  findFavoriteInList,
  updateRatingInList,
} from './favorites.core';

import type { FavoriteItem } from '@/types/favorites';

describe('favorites.core', () => {
  describe('createPrefixedId', () => {
    it('should create prefixed id with number', () => {
      expect(createPrefixedId(123, 'show')).toBe('show-123');
      expect(createPrefixedId(456, 'episode')).toBe('episode-456');
    });

    it('should create prefixed id with string', () => {
      expect(createPrefixedId('abc', 'show')).toBe('show-abc');
    });
  });

  describe('toggleFavoriteInList', () => {
    const existingFavorite: FavoriteItem = {
      id: 'show-123',
      type: 'show',
      addedAt: '2026-01-09T00:00:00.000Z',
      rating: 8,
    };

    it('should add favorite when it does not exist', () => {
      const result = toggleFavoriteInList([], 'show-123', 'show', { showName: 'Test' }, 9);

      expect(result.wasAdded).toBe(true);
      expect(result.favorites).toHaveLength(1);
      expect(result.favorites[0]).toMatchObject({
        id: 'show-123',
        type: 'show',
        metadata: { showName: 'Test' },
        rating: 9,
      });
    });

    it('should remove favorite when it exists', () => {
      const result = toggleFavoriteInList([existingFavorite], 'show-123', 'show');

      expect(result.wasAdded).toBe(false);
      expect(result.favorites).toHaveLength(0);
    });

    it('should not mutate the original array', () => {
      const original = [existingFavorite];
      toggleFavoriteInList(original, 'show-123', 'show');

      expect(original).toHaveLength(1);
    });

    it('should preserve other favorites when removing', () => {
      const otherFavorite: FavoriteItem = {
        id: 'episode-456',
        type: 'episode',
        addedAt: '2026-01-09T00:00:00.000Z',
      };
      const result = toggleFavoriteInList([existingFavorite, otherFavorite], 'show-123', 'show');

      expect(result.favorites).toHaveLength(1);
      expect(result.favorites[0].id).toBe('episode-456');
    });
  });

  describe('findFavoriteInList', () => {
    const favorites: FavoriteItem[] = [
      { id: 'show-123', type: 'show', addedAt: '2026-01-09T00:00:00.000Z', rating: 8 },
      { id: 'episode-456', type: 'episode', addedAt: '2026-01-09T00:00:00.000Z' },
    ];

    it('should find existing favorite', () => {
      const result = findFavoriteInList(favorites, 'show-123');

      expect(result).toBeDefined();
      expect(result?.id).toBe('show-123');
      expect(result?.rating).toBe(8);
    });

    it('should return undefined for non-existing favorite', () => {
      const result = findFavoriteInList(favorites, 'show-999');

      expect(result).toBeUndefined();
    });

    it('should return undefined for empty list', () => {
      const result = findFavoriteInList([], 'show-123');

      expect(result).toBeUndefined();
    });
  });

  describe('updateRatingInList', () => {
    const existingFavorite: FavoriteItem = {
      id: 'show-123',
      type: 'show',
      addedAt: '2026-01-09T00:00:00.000Z',
      rating: 8,
      metadata: { showName: 'Breaking Bad' },
    };

    it('should update rating for existing favorite', () => {
      const result = updateRatingInList([existingFavorite], 'show-123', 'show', 10);

      expect(result).toHaveLength(1);
      expect(result[0].rating).toBe(10);
      expect(result[0].metadata).toEqual({ showName: 'Breaking Bad' });
    });

    it('should create new favorite when it does not exist', () => {
      const result = updateRatingInList([], 'show-123', 'show', 10, { showName: 'New Show' });

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'show-123',
        type: 'show',
        rating: 10,
        metadata: { showName: 'New Show' },
      });
    });

    it('should not mutate the original array', () => {
      const original = [existingFavorite];
      updateRatingInList(original, 'show-123', 'show', 10);

      expect(original[0].rating).toBe(8);
    });

    it('should preserve other favorites when updating', () => {
      const otherFavorite: FavoriteItem = {
        id: 'episode-456',
        type: 'episode',
        addedAt: '2026-01-09T00:00:00.000Z',
        rating: 5,
      };
      const result = updateRatingInList([existingFavorite, otherFavorite], 'show-123', 'show', 10);

      expect(result).toHaveLength(2);
      expect(result[0].rating).toBe(10);
      expect(result[1].rating).toBe(5);
    });
  });
});
