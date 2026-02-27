import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes a URL to prevent XSS attacks
 * Only allows http, https, and mailto protocols
 * Returns '#' for invalid or potentially dangerous URLs
 *
 * @param url - URL string to sanitize
 * @returns Sanitized URL or '#' if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '#';
  }

  try {
    const parsed = new URL(url);
    const allowedProtocols = ['http:', 'https:', 'mailto:'];

    if (!allowedProtocols.includes(parsed.protocol)) {
      console.warn(`Blocked potentially dangerous URL protocol: ${parsed.protocol}`);
      return '#';
    }

    return url;
  } catch {
    // If URL parsing fails, it's not a valid URL
    console.warn(`Invalid URL format: ${url}`);
    return '#';
  }
}

/**
 * Ensures an external URL remains absolute and is never treated as relative
 * This prevents URL manipulation where site domains get prepended to external URLs
 *
 * Critical for links to external services like Credly badges
 *
 * @param url - External URL (should be absolute HTTPS)
 * @returns The URL as-is if valid, or '#' if invalid
 */
export function ensureAbsoluteUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '#';
  }

  try {
    const parsed = new URL(url);

    // Only allow http and https protocols for external URLs
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      console.warn(`[ensureAbsoluteUrl] Non-HTTPS protocol blocked: ${parsed.protocol}`);
      return '#';
    }

    // Verify it's a properly formatted absolute URL
    if (!parsed.hostname) {
      console.warn(`[ensureAbsoluteUrl] URL missing hostname: ${url}`);
      return '#';
    }

    return url;
  } catch (error) {
    console.warn(`[ensureAbsoluteUrl] Invalid URL: ${url}`, error);
    return '#';
  }
}

/**
 * Format a number with thousands separators
 *
 * @param num - Number to format
 * @returns Formatted number string (e.g., "1,234" or "1.2K")
 */
export function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}
