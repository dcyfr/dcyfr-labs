"use client";

import { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { GitHubHeatmapSkeleton } from "@/components/github-heatmap-skeleton";
import "react-calendar-heatmap/dist/styles.css";

/**
 * Represents a single day's contribution data from GitHub API
 * @typedef {Object} ContributionDay
 * @property {string} date - ISO date string (YYYY-MM-DD)
 * @property {number} count - Number of contributions on this date
 */
interface ContributionDay {
  date: string;
  count: number;
}

/**
 * API response structure for GitHub contributions data
 * @typedef {Object} ContributionResponse
 * @property {ContributionDay[]} contributions - Array of contribution data for the past year
 * @property {number} [totalContributions] - Total contributions in the time period
 * @property {string} [warning] - Optional warning message (e.g., "Using cached data")
 * @property {string} [source] - Data source indicator ("server-cache", "api", "fallback")
 */
interface ContributionResponse {
  contributions: ContributionDay[];
  totalContributions?: number;
  warning?: string;
  source?: string;
}

/**
 * Props for the GitHubHeatmap component
 * @typedef {Object} GitHubHeatmapProps
 * @property {string} [username="dcyfr"] - GitHub username to fetch contributions for
 */
interface GitHubHeatmapProps {
  username?: string;
}

const DEFAULT_GITHUB_USERNAME = "dcyfr";

/**
 * GitHubHeatmap Component
 *
 * Displays a GitHub contribution activity heatmap for the past year.
 * Fetches data from the `/api/github-contributions` endpoint which handles:
 * - Server-side caching (5-minute cache with 1-minute fallback)
 * - Rate limiting (10 requests/minute per IP)
 * - Graceful fallback with sample data if GitHub API is unavailable
 *
 * @component
 * @param {GitHubHeatmapProps} props - Component props
 * @param {string} [props.username="dcyfr"] - GitHub username to fetch contributions for
 *
 * @returns {React.ReactElement} Calendar heatmap visualization with statistics
 *
 * @example
 * // Display default user's contributions
 * <GitHubHeatmap />
 *
 * @example
 * // Display specific user's contributions
 * <GitHubHeatmap username="torvalds" />
 *
 * @note This component is wrapped with `GitHubHeatmapErrorBoundary` in production.
 * If the component throws an error, the error boundary displays a fallback UI.
 *
 * @note Loading state displays a skeleton loader to prevent layout shift (CLS).
 *
 * @performance Uses react-calendar-heatmap for efficient rendering of 365+ cells.
 */
export function GitHubHeatmap({ username = DEFAULT_GITHUB_USERNAME }: GitHubHeatmapProps) {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [warning, setWarning] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`/api/github-contributions?username=${username}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch contributions: ${response.status}`);
        }

        const data: ContributionResponse = await response.json();
        
        setContributions(data.contributions || []);
        setTotalContributions(data.totalContributions || data.contributions?.length || 0);
        setWarning(data.warning || null);
        setSource(data.source || null);
      } catch (err) {
        // Throw error to be caught by error boundary
        throw new Error(
          err instanceof Error ? err.message : "Failed to load GitHub contributions"
        );
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    loadData();
  }, [username]);

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setFullYear(startDate.getFullYear() - 1);

  if (loading) {
    return <GitHubHeatmapSkeleton />;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-semibold">GitHub Activity</h3>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            <span>@{username}</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>

        {warning && (
          <div className="rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/10 p-3">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Notice</p>
                <p className="text-xs text-amber-800 dark:text-amber-200">{warning}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="overflow-x-auto">
            <CalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={contributions}
              classForValue={(value) => {
                if (!value || value.count === 0) {
                  return "color-empty";
                }
                if (value.count < 3) {
                  return "color-scale-1";
                }
                if (value.count < 6) {
                  return "color-scale-2";
                }
                if (value.count < 9) {
                  return "color-scale-3";
                }
                return "color-scale-4";
              }}
              showWeekdayLabels={false}
              showMonthLabels={false}
              showOutOfRangeDays={true}
              gutterSize={4}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 bg-muted rounded-sm border border-border" />
                <div className="w-2.5 h-2.5 bg-green-200 dark:bg-green-900 rounded-sm" />
                <div className="w-2.5 h-2.5 bg-green-400 dark:bg-green-700 rounded-sm" />
                <div className="w-2.5 h-2.5 bg-green-600 dark:bg-green-500 rounded-sm" />
                <div className="w-2.5 h-2.5 bg-green-800 dark:bg-green-300 rounded-sm" />
              </div>
              <span>More</span>
            </div>

            <div className="flex items-center gap-2">
              {totalContributions > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {totalContributions.toLocaleString()} contributions
                </Badge>
              )}
              
              {process.env.NODE_ENV === "development" && source === "server-cache" && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  cached
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}