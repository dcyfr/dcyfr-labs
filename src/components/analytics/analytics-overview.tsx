/**
 * Analytics Overview Component
 * 
 * Displays summary statistics and top posts for the analytics dashboard.
 * Extracted from AnalyticsClient.tsx for reusability.
 */

import { Card, CardTitle } from "@/components/ui/card";
import { Eye, FileText, Flame, TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardStats, DashboardStat, DashboardFeaturedStats, DashboardFeaturedStat } from "@/components/dashboard";
import { AnalyticsSummary } from "@/types/analytics";
import Link from "next/link";

interface AnalyticsOverviewProps {
  /** Filtered summary statistics */
  summary: AnalyticsSummary;
  /** 24h trend views total */
  totalViewsTrend24h: number;
  /** 24h trend percentage */
  totalTrendPercent: number;
}

/**
 * Analytics overview section with stats cards and top posts
 * 
 * @example
 * ```tsx
 * <AnalyticsOverview
 *   summary={filteredSummary}
 *   totalViewsTrend24h={1234}
 *   totalTrendPercent={15}
 * />
 * ```
 */
export function AnalyticsOverview({
  summary,
  totalViewsTrend24h,
  totalTrendPercent,
}: AnalyticsOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Summary Stats Cards */}
      <DashboardStats columns={4} className="mb-6">
        <DashboardStat
          label="Total Posts"
          value={summary.totalPosts}
          icon={FileText}
        />
        
        <DashboardStat
          label="Total Views"
          value={summary.totalViews.toLocaleString()}
          secondaryValue={`${summary.totalViews24h.toLocaleString()} in 24h`}
          icon={Eye}
        />
        
        <DashboardStat
          label="Average Views"
          value={summary.averageViews.toLocaleString()}
          secondaryValue={`${summary.averageViews24h.toLocaleString()} in 24h`}
          icon={TrendingUp}
        />
        
        <Card className="overflow-hidden hover:shadow-md transition-shadow p-3">
          <div className="space-y-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">24h Trend</CardTitle>
            <div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <p className="text-2xl font-bold">{totalViewsTrend24h.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {totalTrendPercent > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : totalTrendPercent < 0 ? (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                ) : (
                  <Minus className="h-3 w-3 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-xs font-semibold",
                    totalTrendPercent > 0 && "text-green-600",
                    totalTrendPercent < 0 && "text-red-600",
                    totalTrendPercent === 0 && "text-muted-foreground"
                  )}
                >
                  {totalTrendPercent > 0 ? "+" : ""}{totalTrendPercent}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      </DashboardStats>

      {/* Top Posts: All-time vs 24h */}
      <DashboardFeaturedStats className="mb-6">
        <DashboardFeaturedStat
          title="Top Post (All-time)"
          description="Most viewed post overall"
        >
          {summary.topPost ? (
            <div>
              <Link 
                href={`/blog/${summary.topPost.slug}`}
                className="font-medium text-sm sm:text-base line-clamp-2 mb-3 hover:underline"
              >
                {summary.topPost.title}
              </Link>
              <p className="text-2xl font-bold mb-2">
                {summary.topPost.views.toLocaleString()} views
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.topPost.views24h.toLocaleString()} views in 24h
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data</p>
          )}
        </DashboardFeaturedStat>

        <DashboardFeaturedStat
          title="Top Post (24h)"
          description="Most viewed post in last 24 hours"
        >
          {summary.topPost24h ? (
            <div>
              <Link 
                href={`/blog/${summary.topPost24h.slug}`}
                className="font-medium text-sm sm:text-base line-clamp-2 mb-3 hover:underline"
              >
                {summary.topPost24h.title}
              </Link>
              <p className="text-2xl font-bold mb-2">
                {summary.topPost24h.views24h.toLocaleString()} views
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.topPost24h.views.toLocaleString()} total views
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data</p>
          )}
        </DashboardFeaturedStat>
      </DashboardFeaturedStats>
    </div>
  );
}
