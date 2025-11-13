/**
 * Export utilities for dashboard data
 * 
 * Provides functions to export dashboard data to various formats (CSV, JSON).
 * Handles formatting, escaping, and download trigger.
 * 
 * @module dashboard/export-utils
 */

 

/**
 * Export format type
 */
export type ExportFormat = "csv" | "json";

/**
 * Convert array of objects to CSV string
 * 
 * @param data - Array of objects to convert
 * @param columns - Optional array of column keys to include (in order)
 * @returns CSV string
 * 
 * @example
 * ```tsx
 * const csv = convertToCSV(posts, ['title', 'views', 'publishedAt']);
 * ```
 */
export function convertToCSV<T extends Record<string, any>>(
  data: T[],
  columns?: (keyof T)[]
): string {
  if (data.length === 0) return "";

  // Determine columns to include
  const cols = columns || (Object.keys(data[0]) as (keyof T)[]);

  // Create header row
  const header = cols.map((col) => escapeCSVValue(String(col))).join(",");

  // Create data rows
  const rows = data.map((item) => {
    return cols
      .map((col) => {
        const value = item[col];
        return escapeCSVValue(formatValueForCSV(value));
      })
      .join(",");
  });

  return [header, ...rows].join("\n");
}

/**
 * Escape a value for CSV format
 * 
 * Handles quotes, commas, and newlines according to RFC 4180.
 * 
 * @param value - Value to escape
 * @returns Escaped value
 */
function escapeCSVValue(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Format a value for CSV export
 * 
 * Converts arrays, objects, and other complex types to CSV-friendly strings.
 * 
 * @param value - Value to format
 * @returns Formatted string
 */
function formatValueForCSV(value: any): string {
  if (value == null) return "";
  if (Array.isArray(value)) return value.join("; ");
  if (typeof value === "object") return JSON.stringify(value);
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

/**
 * Convert array of objects to JSON string
 * 
 * @param data - Array of objects to convert
 * @param pretty - Whether to pretty-print (default: true)
 * @returns JSON string
 * 
 * @example
 * ```tsx
 * const json = convertToJSON(posts);
 * const compactJson = convertToJSON(posts, false);
 * ```
 */
export function convertToJSON<T>(data: T[], pretty = true): string {
  return JSON.stringify(data, null, pretty ? 2 : 0);
}

/**
 * Trigger browser download of data
 * 
 * Creates a Blob and triggers download via temporary link.
 * 
 * @param content - File content (string)
 * @param filename - Filename with extension
 * @param mimeType - MIME type (default: text/plain)
 * 
 * @example
 * ```tsx
 * const csv = convertToCSV(posts);
 * downloadFile(csv, 'analytics-export.csv', 'text/csv');
 * ```
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to CSV format and trigger download
 * 
 * @param data - Array of objects to export
 * @param filename - Filename (without extension)
 * @param columns - Optional array of column keys to include
 * 
 * @example
 * ```tsx
 * exportToCSV(posts, 'blog-analytics', ['title', 'views', 'publishedAt']);
 * ```
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: (keyof T)[]
): void {
  const csv = convertToCSV(data, columns);
  const filenameWithExt = filename.endsWith(".csv")
    ? filename
    : `${filename}.csv`;
  downloadFile(csv, filenameWithExt, "text/csv;charset=utf-8;");
}

/**
 * Export data to JSON format and trigger download
 * 
 * @param data - Array of objects to export
 * @param filename - Filename (without extension)
 * @param pretty - Whether to pretty-print (default: true)
 * 
 * @example
 * ```tsx
 * exportToJSON(posts, 'blog-analytics');
 * ```
 */
export function exportToJSON<T>(
  data: T[],
  filename: string,
  pretty = true
): void {
  const json = convertToJSON(data, pretty);
  const filenameWithExt = filename.endsWith(".json")
    ? filename
    : `${filename}.json`;
  downloadFile(json, filenameWithExt, "application/json;charset=utf-8;");
}

/**
 * Generate a filename with timestamp
 * 
 * @param base - Base filename (e.g., 'analytics-export')
 * @param extension - File extension (e.g., 'csv' or 'json')
 * @returns Filename with timestamp (e.g., 'analytics-export-2024-03-15-143022.csv')
 * 
 * @example
 * ```tsx
 * const filename = generateTimestampedFilename('analytics', 'csv');
 * // Returns: 'analytics-2024-03-15-143022.csv'
 * ```
 */
export function generateTimestampedFilename(
  base: string,
  extension: string
): string {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[:.]/g, "")
    .replace("T", "-")
    .slice(0, 15); // YYYY-MM-DD-HHMMSS
  return `${base}-${timestamp}.${extension}`;
}

/**
 * Get MIME type for export format
 * 
 * @param format - Export format
 * @returns MIME type string
 */
export function getMimeType(format: ExportFormat): string {
  switch (format) {
    case "csv":
      return "text/csv;charset=utf-8;";
    case "json":
      return "application/json;charset=utf-8;";
    default:
      return "text/plain;charset=utf-8;";
  }
}

/**
 * Export data in the specified format
 * 
 * Convenience function that handles format selection automatically.
 * 
 * @param data - Array of objects to export
 * @param format - Export format ('csv' or 'json')
 * @param baseFilename - Base filename (without extension or timestamp)
 * @param options - Optional configuration
 * 
 * @example
 * ```tsx
 * exportData(posts, 'csv', 'blog-analytics', { 
 *   timestamp: true,
 *   columns: ['title', 'views']
 * });
 * ```
 */
export function exportData<T extends Record<string, any>>(
  data: T[],
  format: ExportFormat,
  baseFilename: string,
  options: {
    timestamp?: boolean;
    columns?: (keyof T)[];
    pretty?: boolean;
  } = {}
): void {
  const { timestamp = true, columns, pretty = true } = options;

  const filename = timestamp
    ? generateTimestampedFilename(baseFilename, format)
    : `${baseFilename}.${format}`;

  switch (format) {
    case "csv":
      exportToCSV(data, filename, columns);
      break;
    case "json":
      exportToJSON(data, filename, pretty);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}
