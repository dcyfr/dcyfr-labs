"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp, Eye, FileText, Flame, ArrowUpRight, ArrowDownRight, Minus, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostAnalytics {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  tags: string[];
  archived?: boolean;
  draft?: boolean;
  views: number;
  views24h: number;
  readingTime: {
    words: number;
    minutes: number;
    text: string;
  };
}

interface AnalyticsData {
  success: boolean;
  timestamp: string;
  summary: {
    totalPosts: number;
    totalViews: number;
    totalViews24h: number;
    averageViews: number;
    averageViews24h: number;
    topPost: {
      slug: string;
      title: string;
      views: number;
      views24h: number;
    } | null;
    topPost24h: {
      slug: string;
      title: string;
      views: number;
      views24h: number;
    } | null;
  };
  posts: PostAnalytics[];
  trending: PostAnalytics[];
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hideDrafts, setHideDrafts] = useState(false);
  const [hideArchived, setHideArchived] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-14 md:py-20">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
          <div className="mt-4 flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Summary Cards Skeleton - matches actual layout */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 sm:p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </Card>
          ))}
        </div>

        {/* Top Posts Cards Skeleton */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-8">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-4 sm:p-6">
              <Skeleton className="h-5 w-32 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-24" />
            </Card>
          ))}
        </div>

        {/* Trending Posts Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-7 w-40 mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Table Skeleton */}
        <div>
          <Skeleton className="h-7 w-32 mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-14 md:py-20">
        <Card className="border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              Error Loading Analytics
            </CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              {error || "Unknown error occurred"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { posts: allPosts, trending } = data;

  // Apply client-side filters for drafts/archived posts
  const filteredPosts = allPosts.filter((post) => {
    if (hideDrafts && post.draft) return false;
    if (hideArchived && post.archived) return false;
    return true;
  });

  const filteredTrending = (trending || []).filter((post) => {
    if (hideDrafts && post.draft) return false;
    if (hideArchived && post.archived) return false;
    return true;
  });

  // Recompute summary based on filtered posts so the dashboard reflects filtering
  const filteredSummary = {
    totalPosts: filteredPosts.length,
    totalViews: filteredPosts.reduce((s, p) => s + p.views, 0),
    totalViews24h: filteredPosts.reduce((s, p) => s + p.views24h, 0),
    averageViews:
      filteredPosts.length > 0
        ? Math.round(filteredPosts.reduce((s, p) => s + p.views, 0) / filteredPosts.length)
        : 0,
    averageViews24h:
      filteredPosts.length > 0
        ? Math.round(filteredPosts.reduce((s, p) => s + p.views24h, 0) / filteredPosts.length)
        : 0,
    topPost: filteredPosts.length > 0 ? filteredPosts[0] : null,
    topPost24h:
      filteredPosts.length > 0
        ? [...filteredPosts].sort((a, b) => b.views24h - a.views24h)[0]
        : null,
  };

  // Calculate trend indicators
  const totalViewsTrend24h = filteredSummary.totalViews24h;
  const previousTotalViews = filteredSummary.totalViews - totalViewsTrend24h || 1;
  const totalTrendPercent =
    previousTotalViews > 0
      ? Math.round(
          ((totalViewsTrend24h - previousTotalViews) / previousTotalViews) * 100
        )
      : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-14 md:py-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="mt-2 text-base sm:text-lg text-muted-foreground">
          Blog performance metrics and statistics (development only)
        </p>
        
        {/* Filter Controls */}
        <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4">
          <label className="inline-flex items-center text-sm gap-2 cursor-pointer touch-target">
            <input
              type="checkbox"
              checked={hideDrafts}
              onChange={(e) => setHideDrafts(e.target.checked)}
              className="h-4 w-4 rounded border-muted bg-background cursor-pointer"
            />
            <span className="text-sm font-medium">Hide drafts</span>
          </label>

          <label className="inline-flex items-center text-sm gap-2 cursor-pointer touch-target">
            <input
              type="checkbox"
              checked={hideArchived}
              onChange={(e) => setHideArchived(e.target.checked)}
              className="h-4 w-4 rounded border-muted bg-background cursor-pointer"
            />
            <span className="text-sm font-medium">Hide archived</span>
          </label>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4 mb-8">
        <Card className="overflow-hidden hover:shadow-md transition-shadow p-4 sm:p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground/50" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{filteredSummary.totalPosts}</p>
          </div>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow p-4 sm:p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
              <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground/50" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold">
                {filteredSummary.totalViews.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredSummary.totalViews24h.toLocaleString()} in 24h
              </p>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow p-4 sm:p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Views</CardTitle>
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground/50" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold">
                {filteredSummary.averageViews.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredSummary.averageViews24h.toLocaleString()} in 24h
              </p>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow p-4 sm:p-6">
          <div className="space-y-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">24h Trend</CardTitle>
            <div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                  <p className="text-2xl sm:text-3xl font-bold">{totalViewsTrend24h.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
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
      </div>

      {/* Top Posts: All-time vs 24h */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-8">
        <Card className="overflow-hidden">
          <CardHeader className="p-4 sm:p-6 border-b border-border">
            <CardTitle className="text-base sm:text-lg">Top Post (All-time)</CardTitle>
            <CardDescription className="text-sm">Most viewed post overall</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {filteredSummary.topPost ? (
              <div>
                <p className="font-medium text-sm sm:text-base line-clamp-2 mb-3">
                  {filteredSummary.topPost.title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {filteredSummary.topPost.views.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredSummary.topPost.views24h} views in 24h
                </p>
                <a
                  href={`/blog/${filteredSummary.topPost.slug}`}
                  className="inline-flex items-center gap-1 text-primary hover:underline text-sm mt-3 px-2 py-1.5 -mx-2 rounded touch-target"
                >
                  View post →
                </a>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data</p>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="p-4 sm:p-6 border-b border-border">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
              Trending (24h)
            </CardTitle>
            <CardDescription className="text-sm">Hottest post today</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {filteredSummary.topPost24h ? (
              <div>
                <p className="font-medium text-sm sm:text-base line-clamp-2 mb-3">
                  {filteredSummary.topPost24h.title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {filteredSummary.topPost24h.views24h.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredSummary.topPost24h.views.toLocaleString()} total views
                </p>
                <a
                  href={`/blog/${filteredSummary.topPost24h.slug}`}
                  className="inline-flex items-center gap-1 text-primary hover:underline text-sm mt-3 px-2 py-1.5 -mx-2 rounded touch-target"
                >
                  View post →
                </a>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trending Posts */}
      {filteredTrending && filteredTrending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Trending Posts</h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrending.slice(0, 3).map((post) => (
              <Card key={post.slug} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-2 flex-1">
                      {post.title}
                    </h3>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {post.views24h > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1 justify-center text-xs px-1.5">
                          <Flame className="h-3 w-3" />
                          {post.views24h}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs px-1.5 text-center">
                        {post.views}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-4">
                    {post.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.readingTime.text}</span>
                    <a
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-primary hover:underline px-2 py-1.5 -mr-2 rounded touch-target"
                    >
                      View →
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Posts Table */}
      <Card className="overflow-hidden mb-8">
        <CardHeader className="p-4 sm:p-6 border-b border-border">
          <CardTitle className="text-lg sm:text-xl">All Posts</CardTitle>
          <CardDescription className="text-sm">Complete list of blog posts with analytics</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 font-semibold min-w-[200px]">Title</th>
                  <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">Views (All)</th>
                  <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">Views (24h)</th>
                  <th className="text-left py-3 px-4 font-semibold whitespace-nowrap hidden md:table-cell">Published</th>
                  <th className="text-left py-3 px-4 font-semibold hidden lg:table-cell">Tags</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr
                    key={post.slug}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <a
                        href={`/blog/${post.slug}`}
                        className="text-primary hover:underline font-medium inline-block px-1 py-0.5 -mx-1 rounded touch-target"
                      >
                        {post.title}
                      </a>
                    </td>
                    <td className="text-right py-3 px-4 font-semibold tabular-nums">
                      {post.views.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {post.views24h > 0 && (
                          <Flame className="h-3 w-3 text-orange-500" />
                        )}
                        <span className="font-medium tabular-nums">{post.views24h.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell whitespace-nowrap">
                      {new Date(post.publishedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-1.5">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs px-1.5">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <Card className="bg-muted/50 border-muted">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              This analytics dashboard is only visible in development mode. It
              displays real-time view counts from Redis with 24-hour trend tracking
              and trending data from Inngest background jobs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
