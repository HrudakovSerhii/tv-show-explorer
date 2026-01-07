import { describe, it, expect } from 'vitest';
import { decodeUnicode, stripHtml, getImageUrl, formatEpisodeCode } from './format';

describe('Format Utilities', () => {
  describe('decodeUnicode', () => {
    it('should decode unicode escape sequences', () => {
      expect(decodeUnicode('\\u003Cp\\u003E')).toBe('<p>');
      expect(decodeUnicode('\\u003C/p\\u003E')).toBe('</p>');
      expect(decodeUnicode('\\u0026')).toBe('&');
    });

    it('should handle text without escapes', () => {
      expect(decodeUnicode('Plain text')).toBe('Plain text');
    });

    it('should handle mixed content', () => {
      expect(decodeUnicode('Hello \\u003Cb\\u003Eworld\\u003C/b\\u003E')).toBe(
        'Hello <b>world</b>',
      );
    });
  });

  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Hello world</p>')).toBe('Hello world');
      expect(stripHtml('<b>Bold</b> and <i>italic</i>')).toBe('Bold and italic');
    });

    it('should handle self-closing tags', () => {
      expect(stripHtml('Line<br/>break')).toBe('Linebreak');
    });

    it('should handle text without tags', () => {
      expect(stripHtml('Plain text')).toBe('Plain text');
    });

    it('should trim whitespace', () => {
      expect(stripHtml('  <p>Text</p>  ')).toBe('Text');
    });
  });

  describe('getImageUrl', () => {
    const mockImage = {
      medium: 'https://example.com/medium.jpg',
      original: 'https://example.com/original.jpg',
    };

    it('should return medium image by default', () => {
      expect(getImageUrl(mockImage)).toBe('https://example.com/medium.jpg');
    });

    it('should return original when specified', () => {
      expect(getImageUrl(mockImage, 'original')).toBe('https://example.com/original.jpg');
    });

    it('should return fallback for null image', () => {
      expect(getImageUrl(null)).toBe('/placeholder-show.jpg');
    });

    it('should return fallback for undefined image', () => {
      expect(getImageUrl(undefined)).toBe('/placeholder-show.jpg');
    });

    it('should use custom fallback', () => {
      expect(getImageUrl(null, 'medium', '/custom.jpg')).toBe('/custom.jpg');
    });
  });

  describe('formatEpisodeCode', () => {
    it('should format single digit season and episode', () => {
      expect(formatEpisodeCode(1, 5)).toBe('S01E05');
    });

    it('should format double digit season and episode', () => {
      expect(formatEpisodeCode(12, 24)).toBe('S12E24');
    });

    it('should handle triple digit numbers', () => {
      expect(formatEpisodeCode(100, 999)).toBe('S100E999');
    });

    it('should pad with zeros', () => {
      expect(formatEpisodeCode(1, 1)).toBe('S01E01');
    });
  });
});
