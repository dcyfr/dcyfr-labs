/**
 * Analytics Data Hook
 * 
 * Custom hook for fetching and managing analytics data with:
 * - Date range filtering
 * - Auto-refresh capability
 * - Loading and error states
 * - Manual refresh support
 * 
 * @module hooks/use-analytics-data
 */

import { useEffect, useState, useCallback } from "react";
import { AnalyticsData, DateRange } from "@/types/analytics";

interface UseAnalyticsDataOptions {
  /** Date range for analytics data */
  dateRange: DateRange;
  /** Enable auto-refresh every 30 seconds */
  autoRefresh?: boolean;
}

interface UseAnalyticsDataReturn {
  /** Analytics data */
  data: AnalyticsData | null;
  /** Loading state */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Whether a manual refresh is in progress */
  isRefreshing: boolean;
  /** Timestamp of last successful update */
  lastUpdated: Date | null;
  /** Manually trigger a data refresh */
  refresh: () => Promise<void>;
}

/**
 * Fetch and manage analytics data
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refresh } = useAnalyticsData({
 *   dateRange: '7',
 *   autoRefresh: true
 * });
 * ```
 */
export function useAnalyticsData({
  dateRange,
  autoRefresh = false,
}: UseAnalyticsDataOptions): UseAnalyticsDataReturn {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch analytics data
  const fetchAnalytics = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setIsRefreshing(true);
      }

      try {
        // Get API key from environment (injected at build time via NEXT_PUBLIC_)
        const apiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY;

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        // Add Authorization header if API key is available
        if (apiKey) {
          headers["Authorization"] = `Bearer ${apiKey}`;
        }

        const response = await fetch(`/api/analytics?days=${dateRange}`, {
          headers,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const analyticsData: AnalyticsData = await response.json();
        setData(analyticsData);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (isManualRefresh) {
          setIsRefreshing(false);
        }
        setLoading(false);
      }
    },
    [dateRange]
  );

  // Manual refresh function
  const refresh = useCallback(async () => {
    await fetchAnalytics(true);
  }, [fetchAnalytics]);

  // Initial fetch
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchAnalytics();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchAnalytics]);

  return {
    data,
    loading,
    error,
    isRefreshing,
    lastUpdated,
    refresh,
  };
}
