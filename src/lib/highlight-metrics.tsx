/**
 * Utility to highlight quantifiable achievements in text
 * 
 * Parses text for metrics (percentages, numbers with context) and wraps them
 * in styled spans for visual emphasis.
 * 
 * Examples:
 * - "reduced by 23%" → "reduced by <span>23%</span>"
 * - "over 1k systems" → "over <span>1k</span> systems"
 * - "5-minute cache" → "<span>5-minute</span> cache"
 */
export function highlightMetrics(text: string): React.ReactNode {
  // Pattern matches: percentages, numbers with units (k, min, etc), standalone numbers
  const metricPattern = /(\d+(?:\.\d+)?%|\d+(?:\.\d+)?\s*(?:k|min|minute|hour|req|request|system|site|module)s?|\d+(?:\.\d+)?-(?:minute|hour|day|week|month|year))/gi;
  
  const parts = text.split(metricPattern);
  
  return parts.map((part, index) => {
    if (metricPattern.test(part)) {
      return (
        <span key={index} className="font-semibold text-foreground">
          {part}
        </span>
      );
    }
    return part;
  });
}
