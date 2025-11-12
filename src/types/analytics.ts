/**
 * Analytics Data Types
 * 
 * Shared types for analytics dashboard components.
 * Extracted from AnalyticsClient.tsx for reusability.
 */

export interface PostAnalytics {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  tags: string[];
  archived?: boolean;
  draft?: boolean;
  views: number;
  views24h: number;
  viewsRange: number;
  shares: number;
  shares24h: number;
  readingTime: {
    words: number;
    minutes: number;
    text: string;
  };
}

export interface TopPost {
  slug: string;
  title: string;
  views: number;
  views24h: number;
  viewsRange: number;
  shares: number;
  shares24h: number;
}

export interface MostSharedPost {
  slug: string;
  title: string;
  views: number;
  shares: number;
  shares24h: number;
}

export interface AnalyticsSummary {
  totalPosts: number;
  totalViews: number;
  totalViews24h: number;
  totalViewsRange: number;
  totalShares: number;
  totalShares24h: number;
  averageViews: number;
  averageViews24h: number;
  averageViewsRange: number;
  averageShares: number;
  averageShares24h: number;
  topPost: TopPost | null;
  topPost24h: TopPost | null;
  topPostRange: TopPost | null;
  mostSharedPost: MostSharedPost | null;
  mostSharedPost24h: MostSharedPost | null;
}

export interface AnalyticsData {
  success: boolean;
  timestamp: string;
  dateRange: string;
  summary: AnalyticsSummary;
  posts: PostAnalytics[];
  trending: PostAnalytics[];
}

export type DateRange = "1" | "7" | "30" | "90" | "all";

export const DATE_RANGE_LABELS: Record<DateRange, string> = {
  "1": "1 Day",
  "7": "7 Days",
  "30": "30 Days",
  "90": "90 Days",
  "all": "All Time",
};
