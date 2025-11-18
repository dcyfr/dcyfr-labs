/**
 * Analytics Charts Component
 * 
 * Time-series visualizations for views, shares, and comments over time.
 * Uses Recharts for responsive, interactive charts.
 */

"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PostAnalytics, DateRange } from "@/types/analytics";

interface AnalyticsChartsProps {
  /** All posts with analytics data */
  posts: PostAnalytics[];
  /** Current date range */
  dateRange: DateRange;
}

/**
 * Time-series charts for analytics dashboard
 * 
 * Shows trends over time with multiple views:
 * - Views trend
 * - Engagement trend (shares + comments)
 * - Combined metrics
 */
export function AnalyticsCharts({ posts, dateRange }: AnalyticsChartsProps) {
  // Generate mock time-series data based on current totals
  // TODO: Replace with actual time-series data from API when available
  const chartData = useMemo(() => {
    const days = dateRange === "all" ? 30 : parseInt(dateRange);
    const data = [];
    
    // Calculate daily averages
    const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
    const totalShares = posts.reduce((sum, p) => sum + p.shares, 0);
    const totalComments = posts.reduce((sum, p) => sum + p.comments, 0);
    
    const avgViewsPerDay = totalViews / days;
    const avgSharesPerDay = totalShares / days;
    const avgCommentsPerDay = totalComments / days;
    
    // Generate simulated daily data with deterministic variance based on day index
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Use deterministic variance based on day index for stable rendering
      const variance = 0.8 + ((i * 7) % 10) / 25; // Ranges from 0.8 to 1.2
      
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        views: Math.round(avgViewsPerDay * variance),
        shares: Math.round(avgSharesPerDay * variance),
        comments: Math.round(avgCommentsPerDay * variance),
        engagement: Math.round((avgSharesPerDay + avgCommentsPerDay) * variance),
      });
    }
    
    return data;
  }, [posts, dateRange]);

  if (posts.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="p-4">
        <CardTitle className="text-base">Performance Trends</CardTitle>
        <CardDescription className="text-xs">
          Analytics over the selected time period (estimated daily distribution)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Tabs defaultValue="views" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="views" className="text-xs">Views</TabsTrigger>
            <TabsTrigger value="engagement" className="text-xs">Engagement</TabsTrigger>
            <TabsTrigger value="combined" className="text-xs">Combined</TabsTrigger>
          </TabsList>

          {/* Views Chart */}
          <TabsContent value="views" className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          {/* Engagement Chart */}
          <TabsContent value="engagement" className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="shares"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          {/* Combined Chart */}
          <TabsContent value="combined" className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
        
        <p className="text-xs text-muted-foreground mt-4">
          Note: Time-series data is currently estimated. Enable detailed analytics tracking for actual daily metrics.
        </p>
      </CardContent>
    </Card>
  );
}
