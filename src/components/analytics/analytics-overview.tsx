/**
 * Analytics Overview Component
 * 
 * Displays summary statistics and top posts for the analytics dashboard.
 * Extracted from AnalyticsClient.tsx for reusability.
 */

/* eslint-disable no-restricted-syntax */

import { Card, CardTitle } from "@/components/ui/card";
import { Eye, FileText, Flame, TrendingUp, ArrowUpRight, ArrowDownRight, Minus, MessageSquare, Share2 } from "lucide-react";
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
          label="Total Shares"
          value={summary.totalShares.toLocaleString()}
          secondaryValue={`${summary.totalShares24h.toLocaleString()} in 24h`}
          icon={Share2}
        />
        
        <DashboardStat
          label="Total Comments"
          value={summary.totalComments.toLocaleString()}
          secondaryValue={`${summary.totalComments24h.toLocaleString()} in 24h`}
          icon={MessageSquare}
        />
      </DashboardStats>

      {/* Average Stats */}
      <DashboardStats columns={4} className="mb-6">
        <DashboardStat
          label="Average Views"
          value={summary.averageViews.toLocaleString()}
          secondaryValue={`${summary.averageViews24h.toLocaleString()} in 24h`}
          icon={Eye}
        />
        
        <DashboardStat
          label="Average Shares"
          value={summary.averageShares.toLocaleString()}
          secondaryValue={`${summary.averageShares24h.toLocaleString()} in 24h`}
          icon={Share2}
        />
        
        <DashboardStat
          label="Average Comments"
          value={summary.averageComments.toLocaleString()}
          secondaryValue={`${summary.averageComments24h.toLocaleString()} in 24h`}
          icon={MessageSquare}
        />
        
        <Card className="overflow-hidden hover:shadow-md transition-shadow p-3">
          <div className="space-y-1">
            { }
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

      {/* Most Shared Posts */}
      <DashboardFeaturedStats className="mb-6">
        <DashboardFeaturedStat
          title="Most Shared (All-time)"
          description="Most shared post overall"
        >
          {summary.mostSharedPost ? (
            <div>
              <Link 
                href={`/blog/${summary.mostSharedPost.slug}`}
                className="font-medium text-sm sm:text-base line-clamp-2 mb-3 hover:underline"
              >
                {summary.mostSharedPost.title}
              </Link>
              <p className="text-2xl font-bold mb-2">
                {summary.mostSharedPost.shares.toLocaleString()} shares
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.mostSharedPost.shares24h.toLocaleString()} shares in 24h
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data</p>
          )}
        </DashboardFeaturedStat>

        <DashboardFeaturedStat
          title="Most Shared (24h)"
          description="Most shared post in last 24 hours"
        >
          {summary.mostSharedPost24h ? (
            <div>
              <Link 
                href={`/blog/${summary.mostSharedPost24h.slug}`}
                className="font-medium text-sm sm:text-base line-clamp-2 mb-3 hover:underline"
              >
                {summary.mostSharedPost24h.title}
              </Link>
              <p className="text-2xl font-bold mb-2">
                {summary.mostSharedPost24h.shares24h.toLocaleString()} shares
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.mostSharedPost24h.shares.toLocaleString()} total shares
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data</p>
          )}
        </DashboardFeaturedStat>
      </DashboardFeaturedStats>

      {/* Most Commented Posts */}
      <DashboardFeaturedStats className="mb-6">
        <DashboardFeaturedStat
          title="Most Commented (All-time)"
          description="Most commented post overall"
        >
          {summary.mostCommentedPost ? (
            <div>
              <Link 
                href={`/blog/${summary.mostCommentedPost.slug}`}
                className="font-medium text-sm sm:text-base line-clamp-2 mb-3 hover:underline"
              >
                {summary.mostCommentedPost.title}
              </Link>
              <p className="text-2xl font-bold mb-2">
                {summary.mostCommentedPost.comments.toLocaleString()} comments
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.mostCommentedPost.comments24h.toLocaleString()} comments in 24h
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data</p>
          )}
        </DashboardFeaturedStat>

        <DashboardFeaturedStat
          title="Most Commented (24h)"
          description="Most commented post in last 24 hours"
        >
          {summary.mostCommentedPost24h ? (
            <div>
              <Link 
                href={`/blog/${summary.mostCommentedPost24h.slug}`}
                className="font-medium text-sm sm:text-base line-clamp-2 mb-3 hover:underline"
              >
                {summary.mostCommentedPost24h.title}
              </Link>
              <p className="text-2xl font-bold mb-2">
                {summary.mostCommentedPost24h.comments24h.toLocaleString()} comments
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.mostCommentedPost24h.comments.toLocaleString()} total comments
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
