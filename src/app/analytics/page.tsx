"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp, Eye, FileText } from "lucide-react";

interface PostAnalytics {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  tags: string[];
  archived?: boolean;
  draft?: boolean;
  views: number;
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
    averageViews: number;
    topPost: {
      slug: string;
      title: string;
      views: number;
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
    averageViews:
      filteredPosts.length > 0
        ? Math.round(filteredPosts.reduce((s, p) => s + p.views, 0) / filteredPosts.length)
        : 0,
    topPost: filteredPosts.length > 0 ? filteredPosts[0] : null,
  };

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
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm text-muted-foreground">Top Post</p>
            {filteredSummary.topPost ? (
              <div className="mt-2">
                <p className="font-semibold text-sm line-clamp-2">
                  {filteredSummary.topPost?.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredSummary.topPost?.views.toLocaleString()} views
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">No data</p>
            )}
          </div>
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
                  <Badge variant="secondary" className="flex-shrink-0">
                    {post.views}
                  </Badge>
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
                <th className="text-right py-3 px-4 font-semibold">Views</th>
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
          displays real-time view counts from Redis and trending data from
          Inngest background jobs.
        </p>
      </div>
    </div>
  );
}
