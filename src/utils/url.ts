import type { URLParams } from '@/types';

/**
 * Utility functions for URL parsing and manipulation
 */
export class URLUtils {
  /**
   * Parse URL parameters from a query string
   * @param search The search part of the URL (e.g., '?param1=value1&param2=value2')
   * @returns Object with parsed parameters
   */
  public static parseURLParams(search: string): URLParams {
    const params: URLParams = {};
    
    if (!search || search.length <= 1) {
      return params;
    }

    // Remove the leading '?' if present
    const queryString = search.startsWith('?') ? search.slice(1) : search;
    
    // Split by '&' and process each parameter
    queryString.split('&').forEach(param => {
      const [key, ...valueParts] = param.split('=');
      if (key) {
        // Join value parts back together in case the value contained '='
        const value = valueParts.join('=');
        params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
      }
    });

    return params;
  }

  /**
   * Extract the path from a URL (without query parameters)
   * @param url The full URL or pathname
   * @returns The path part without leading slash
   */
  public static extractPath(url: string): string {
    try {
      // Handle both full URLs and pathnames
      let pathname: string;
      
      if (url.startsWith('http://') || url.startsWith('https://')) {
        const urlObj = new URL(url);
        pathname = urlObj.pathname;
      } else {
        pathname = url.split('?')[0] || '';
      }

      // Remove leading slash and return
      return pathname.startsWith('/') ? pathname.slice(1) : pathname;
    } catch {
      // Fallback for invalid URLs
      const path = url.split('?')[0] || '';
      return path.startsWith('/') ? path.slice(1) : path;
    }
  }

  /**
   * Validate if a URL is properly formatted
   * @param url The URL to validate
   * @returns True if valid, false otherwise
   */
  public static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Ensure a URL has a protocol
   * @param url The URL to check
   * @returns URL with protocol, defaults to https://
   */
  public static ensureProtocol(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  }
}
