/**
 * Decodes Unicode escape sequences (e.g., \u003C -> <)
 */
export function decodeUnicode(text: string): string {
  return text.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
  });
}

/**
 * Strips HTML tags from text
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Gets image URL with fallback
 */
export function getImageUrl(
  image: { medium: string; original: string } | undefined | null,
  size: 'medium' | 'original' = 'medium',
  fallback: string = '/placeholder-show.jpg',
): string {
  if (!image) return fallback;
  return image[size] || fallback;
}

/**
 * Formats episode code (e.g., S01E05)
 */
export function formatEpisodeCode(season: number, episode: number): string {
  const s = String(season).padStart(2, '0');
  const e = String(episode).padStart(2, '0');
  return `S${s}E${e}`;
}
