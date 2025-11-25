import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

