"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp, Eye, FileText, Flame } from "lucide-react";

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
      <div className="mx-auto max-w-6xl py-14 md:py-20">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-8">
          Analytics Dashboard
        </h1>
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-6xl py-14 md:py-20">
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <h2 className="font-semibold">Error Loading Analytics</h2>
            <p className="text-sm">{error || "Unknown error occurred"}</p>
          </div>
        </div>
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
    <div className="mx-auto max-w-6xl py-14 md:py-20">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Blog performance metrics and statistics (development only)
        </p>
        <div className="mt-4 flex items-center gap-4">
          <label className="inline-flex items-center text-sm gap-2">
            <input
              type="checkbox"
              checked={hideDrafts}
              onChange={(e) => setHideDrafts(e.target.checked)}
              className="h-4 w-4 rounded border-muted bg-background"
            />
            <span className="text-sm">Hide drafts</span>
          </label>

          <label className="inline-flex items-center text-sm gap-2">
            <input
              type="checkbox"
              checked={hideArchived}
              onChange={(e) => setHideArchived(e.target.checked)}
              className="h-4 w-4 rounded border-muted bg-background"
            />
            <span className="text-sm">Hide archived</span>
          </label>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <p className="text-3xl font-bold mt-2">{filteredSummary.totalPosts}</p>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-3xl font-bold mt-2">
                {filteredSummary.totalViews.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredSummary.totalViews24h.toLocaleString()} in 24h
              </p>
            </div>
            <Eye className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Views</p>
              <p className="text-3xl font-bold mt-2">
                {filteredSummary.averageViews.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredSummary.averageViews24h.toLocaleString()} in 24h
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm text-muted-foreground">24h Trend</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <p className="text-2xl font-bold">{totalViewsTrend24h.toLocaleString()}</p>
              </div>
              <span
                className={`text-xs font-semibold ${
                  totalTrendPercent > 0
                    ? "text-green-600"
                    : totalTrendPercent < 0
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                {totalTrendPercent > 0 ? "+" : ""}{totalTrendPercent}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Posts: All-time vs 24h */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Top Post (All-time)</h3>
          {filteredSummary.topPost ? (
            <div>
              <p className="font-medium text-sm line-clamp-2">
                {filteredSummary.topPost.title}
              </p>
              <p className="text-2xl font-bold mt-2">
                {filteredSummary.topPost.views.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredSummary.topPost.views24h} views in 24h
              </p>
              <a
                href={`/blog/${filteredSummary.topPost.slug}`}
                className="text-primary hover:underline text-xs mt-2 inline-block"
              >
                View →
              </a>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data</p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Trending (24h)
            </h3>
          </div>
          {filteredSummary.topPost24h ? (
            <div className="mt-3">
              <p className="font-medium text-sm line-clamp-2">
                {filteredSummary.topPost24h.title}
              </p>
              <p className="text-2xl font-bold mt-2">
                {filteredSummary.topPost24h.views24h.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredSummary.topPost24h.views.toLocaleString()} total views
              </p>
              <a
                href={`/blog/${filteredSummary.topPost24h.slug}`}
                className="text-primary hover:underline text-xs mt-2 inline-block"
              >
                View →
              </a>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-3">No data</p>
          )}
        </Card>
      </div>

      {/* Trending Posts */}
      {filteredTrending && filteredTrending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Trending Posts</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrending.slice(0, 3).map((post) => (
              <Card key={post.slug} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {post.views24h > 0 && (
                      <Badge variant="secondary" className="flex items-center gap-1 justify-center text-xs">
                        <Flame className="h-3 w-3" />
                        {post.views24h}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {post.views}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {post.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.readingTime.text}</span>
                  <a
                    href={`/blog/${post.slug}`}
                    className="text-primary hover:underline"
                  >
                    View →
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Posts Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Posts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Title</th>
                <th className="text-right py-3 px-4 font-semibold">Views (All-time)</th>
                <th className="text-right py-3 px-4 font-semibold">Views (24h)</th>
                <th className="text-left py-3 px-4 font-semibold">Published</th>
                <th className="text-left py-3 px-4 font-semibold">Tags</th>
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
                      className="text-primary hover:underline font-medium"
                    >
                      {post.title}
                    </a>
                  </td>
                  <td className="text-right py-3 px-4 font-semibold">
                    {post.views.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      {post.views24h > 0 && (
                        <Flame className="h-3 w-3 text-orange-500" />
                      )}
                      <span className="font-medium">{post.views24h.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
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
      </div>

      {/* Footer Note */}
      <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-muted">
        <p className="text-xs text-muted-foreground">
          ℹ️ This analytics dashboard is only visible in development mode. It
          displays real-time view counts from Redis with 24-hour trend tracking
          and trending data from Inngest background jobs.
        </p>
      </div>
    </div>
  );
}
