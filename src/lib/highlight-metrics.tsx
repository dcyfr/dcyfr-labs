/**
 * Utility to highlight quantifiable achievements in text
 * 
 * Parses text for metrics (percentages, numbers with context) and wraps them
 * in styled spans for visual emphasis. Percentages are made particularly prominent.
 * 
 * Examples:
 * - "reduced by 23%" → "reduced by <strong>23%</strong>"
 * - "over 1k systems" → "over <strong>1k</strong> systems"
 * - "5-minute cache" → "<strong>5-minute</strong> cache"
 */
export function highlightMetrics(text: string): React.ReactNode {
  // Pattern matches: percentages, numbers with units (k, min, etc), standalone numbers
  const metricPattern = /(\d+(?:\.\d+)?%|\d+(?:\.\d+)?\s*(?:k|min|minute|hour|req|request|system|site|module)s?|\d+(?:\.\d+)?-(?:minute|hour|day|week|month|year))/gi;
  
  const parts = text.split(metricPattern);
  
  return parts.map((part, index) => {
    if (metricPattern.test(part)) {
      // Use strong tag for percentages and metrics
      return (
        <strong key={index} className="font-bold text-foreground">
          {part}
        </strong>
      );
    }
    return part;
  });
}
