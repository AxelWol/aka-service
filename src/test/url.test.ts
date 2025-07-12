import { describe, it, expect } from 'vitest';
import { URLUtils } from '@/utils/url';

describe('URLUtils', () => {
  describe('parseURLParams', () => {
    it('should parse simple URL parameters', () => {
      const result = URLUtils.parseURLParams('?param1=value1&param2=value2');
      expect(result).toEqual({
        param1: 'value1',
        param2: 'value2',
      });
    });

    it('should handle empty query string', () => {
      const result = URLUtils.parseURLParams('');
      expect(result).toEqual({});
    });

    it('should handle query string with only question mark', () => {
      const result = URLUtils.parseURLParams('?');
      expect(result).toEqual({});
    });

    it('should handle URL encoded parameters', () => {
      const result = URLUtils.parseURLParams('?name=John%20Doe&city=New%20York');
      expect(result).toEqual({
        name: 'John Doe',
        city: 'New York',
      });
    });

    it('should handle parameters without values', () => {
      const result = URLUtils.parseURLParams('?flag1&flag2=value&flag3');
      expect(result).toEqual({
        flag1: '',
        flag2: 'value',
        flag3: '',
      });
    });

    it('should handle parameters with equals in value', () => {
      const result = URLUtils.parseURLParams('?equation=a=b+c&other=value');
      expect(result).toEqual({
        equation: 'a=b+c',
        other: 'value',
      });
    });
  });

  describe('extractPath', () => {
    it('should extract path from pathname', () => {
      const result = URLUtils.extractPath('/Eheschliessung');
      expect(result).toBe('Eheschliessung');
    });

    it('should extract path from pathname with query', () => {
      const result = URLUtils.extractPath('/Eheschliessung?param=value');
      expect(result).toBe('Eheschliessung');
    });

    it('should extract path from full URL', () => {
      const result = URLUtils.extractPath('https://example.com/Eheschliessung?param=value');
      expect(result).toBe('Eheschliessung');
    });

    it('should handle root path', () => {
      const result = URLUtils.extractPath('/');
      expect(result).toBe('');
    });

    it('should handle empty path', () => {
      const result = URLUtils.extractPath('');
      expect(result).toBe('');
    });

    it('should handle nested paths', () => {
      const result = URLUtils.extractPath('/api/v1/redirect');
      expect(result).toBe('api/v1/redirect');
    });
  });

  describe('isValidURL', () => {
    it('should validate correct URLs', () => {
      expect(URLUtils.isValidURL('https://example.com')).toBe(true);
      expect(URLUtils.isValidURL('http://localhost:3000')).toBe(true);
      expect(URLUtils.isValidURL('https://sub.domain.com/path?query=value')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(URLUtils.isValidURL('not-a-url')).toBe(false);
      expect(URLUtils.isValidURL('ftp://example.com')).toBe(true); // FTP is valid
      expect(URLUtils.isValidURL('')).toBe(false);
      expect(URLUtils.isValidURL('just-text')).toBe(false);
    });
  });

  describe('ensureProtocol', () => {
    it('should add https protocol to URLs without protocol', () => {
      expect(URLUtils.ensureProtocol('example.com')).toBe('https://example.com');
      expect(URLUtils.ensureProtocol('sub.domain.com/path')).toBe('https://sub.domain.com/path');
    });

    it('should not modify URLs that already have protocol', () => {
      expect(URLUtils.ensureProtocol('https://example.com')).toBe('https://example.com');
      expect(URLUtils.ensureProtocol('http://example.com')).toBe('http://example.com');
    });
  });
});
