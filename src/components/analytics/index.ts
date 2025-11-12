/**
 * Analytics Components Index
 * 
 * Reusable components for the analytics dashboard.
 * Extracted from AnalyticsClient.tsx for modularity and reusability.
 * 
 * @module components/analytics
 */

export { AnalyticsOverview } from "./analytics-overview";
export { AnalyticsTrending } from "./analytics-trending";

// Re-export types
export type {
  PostAnalytics,
  TopPost,
  MostSharedPost,
  AnalyticsSummary,
  AnalyticsData,
  DateRange,
} from "@/types/analytics";

export { DATE_RANGE_LABELS } from "@/types/analytics";
