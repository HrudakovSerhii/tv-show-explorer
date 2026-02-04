import fs from 'fs/promises';
import path from 'path';

import type { FavoritesData } from '@/types/favorites';
import { log } from '@/lib/utils/logger';

// TODO: File-based storage is single-user only. For multi-user support,
// replace with a database (e.g., SQLite via better-sqlite3, or a cloud DB).
// Concurrent writes from multiple users will cause data loss.
const DATA_DIR = path.join(process.cwd(), 'data');
const FAVORITES_FILE = path.join(DATA_DIR, 'favorites.json');
const TEMP_FILE = path.join(DATA_DIR, 'favorites.json.tmp');

function createDefaultFavoritesData(): FavoritesData {
  return {
    favorites: [],
    lastModified: new Date().toISOString(),
  };
}

async function ensureDataDirectory(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function readFavoritesFile(): Promise<FavoritesData> {
  try {
    await ensureDataDirectory();

    try {
      const fileContent = await fs.readFile(FAVORITES_FILE, 'utf-8');
      const data = JSON.parse(fileContent) as FavoritesData;

      if (!data.favorites || !Array.isArray(data.favorites)) {
        return createDefaultFavoritesData();
      }

      return data;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        const defaultData = createDefaultFavoritesData();

        await writeFavoritesFile(defaultData);

        return defaultData;
      }

      throw error;
    }
  } catch (error) {
    log.error('Error reading favorites file:', error);

    return createDefaultFavoritesData();
  }
}

export async function writeFavoritesFile(data: FavoritesData): Promise<void> {
  try {
    await ensureDataDirectory();

    const dataWithTimestamp = {
      ...data,
      lastModified: new Date().toISOString(),
    };

    const jsonContent = JSON.stringify(dataWithTimestamp, null, 2);

    await fs.writeFile(TEMP_FILE, jsonContent, 'utf-8');
    await fs.rename(TEMP_FILE, FAVORITES_FILE);
  } catch (error) {
    log.error('Error writing favorites file:', error);

    try {
      await fs.unlink(TEMP_FILE);
    } catch (cleanupError) {
      log.warn('File cleanup error:', cleanupError);
    }

    throw error;
  }
}
