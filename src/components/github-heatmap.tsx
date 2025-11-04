"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import CalendarHeatmap from "react-calendar-heatmap";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, Flame, TrendingUp, Calendar } from "lucide-react";
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
 * Calculate streak statistics from contribution data
 */
function calculateStreaks(contributions: ContributionDay[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (contributions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort by date descending (most recent first)
  const sorted = [...contributions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak (from most recent date backwards)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (let i = 0; i < sorted.length; i++) {
    const contribDate = new Date(sorted[i].date);
    contribDate.setHours(0, 0, 0, 0);

    if (sorted[i].count > 0) {
      // Check if this is part of current streak
      if (i === 0 && (contribDate.getTime() === today.getTime() || contribDate.getTime() === yesterday.getTime())) {
        currentStreak++;
      } else if (currentStreak > 0) {
        const prevDate = new Date(sorted[i - 1].date);
        const dayDiff = Math.floor((prevDate.getTime() - contribDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Calculate longest streak
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return { currentStreak, longestStreak };
}

/**
 * Calculate activity statistics
 */
function calculateActivityStats(contributions: ContributionDay[]): {
  busiestDay: { date: string; count: number } | null;
  averagePerDay: number;
  totalDaysActive: number;
} {
  if (contributions.length === 0) {
    return { busiestDay: null, averagePerDay: 0, totalDaysActive: 0 };
  }

  const busiestDay = contributions.reduce((max, day) =>
    day.count > (max?.count || 0) ? day : max
  , contributions[0]);

  const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);
  const averagePerDay = totalContributions / contributions.length;
  const totalDaysActive = contributions.filter(day => day.count > 0).length;

  return {
    busiestDay: busiestDay.count > 0 ? busiestDay : null,
    averagePerDay: Math.round(averagePerDay * 10) / 10,
    totalDaysActive,
  };
}

/**
 * Format date for tooltip display
 */
function formatTooltipDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

  // Calculate statistics
  const streaks = useMemo(() => calculateStreaks(contributions), [contributions]);
  const activityStats = useMemo(() => calculateActivityStats(contributions), [contributions]);

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setFullYear(startDate.getFullYear() - 1);

  if (loading) {
    return <GitHubHeatmapSkeleton />;
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
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
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/10 p-3"
              >
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
              </motion.div>
            )}

            {/* Statistics Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-muted/50 rounded-lg p-3 border border-border hover:border-primary/50 transition-colors cursor-help">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-4 h-4 text-orange-500" aria-hidden="true" />
                      <span className="text-xs text-muted-foreground">Current Streak</span>
                    </div>
                    <div className="text-2xl font-bold">{streaks.currentStreak}</div>
                    <div className="text-xs text-muted-foreground">days</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Consecutive days with contributions</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-muted/50 rounded-lg p-3 border border-border hover:border-primary/50 transition-colors cursor-help">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-500" aria-hidden="true" />
                      <span className="text-xs text-muted-foreground">Longest Streak</span>
                    </div>
                    <div className="text-2xl font-bold">{streaks.longestStreak}</div>
                    <div className="text-xs text-muted-foreground">days</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your longest contribution streak this year</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-muted/50 rounded-lg p-3 border border-border hover:border-primary/50 transition-colors cursor-help">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-500" aria-hidden="true" />
                      <span className="text-xs text-muted-foreground">Active Days</span>
                    </div>
                    <div className="text-2xl font-bold">{activityStats.totalDaysActive}</div>
                    <div className="text-xs text-muted-foreground">days</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total days with at least one contribution</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-muted/50 rounded-lg p-3 border border-border hover:border-primary/50 transition-colors cursor-help">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-purple-500" aria-hidden="true" />
                      <span className="text-xs text-muted-foreground">Daily Average</span>
                    </div>
                    <div className="text-2xl font-bold">{activityStats.averagePerDay}</div>
                    <div className="text-xs text-muted-foreground">contributions</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Average contributions per day</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>

            {activityStats.busiestDay && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-sm text-muted-foreground"
              >
                🎯 Busiest day: <span className="font-medium text-foreground">{formatTooltipDate(activityStats.busiestDay.date)}</span> with{" "}
                <span className="font-medium text-foreground">{activityStats.busiestDay.count} contributions</span>
              </motion.div>
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
                    <motion.div
                      className="w-2.5 h-2.5 bg-muted rounded-sm border border-border"
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                    <motion.div
                      className="w-2.5 h-2.5 bg-green-200 dark:bg-green-900 rounded-sm"
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                    <motion.div
                      className="w-2.5 h-2.5 bg-green-400 dark:bg-green-700 rounded-sm"
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                    <motion.div
                      className="w-2.5 h-2.5 bg-green-600 dark:bg-green-500 rounded-sm"
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                    <motion.div
                      className="w-2.5 h-2.5 bg-green-800 dark:bg-green-300 rounded-sm"
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
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
      </motion.div>
    </TooltipProvider>
  );
}