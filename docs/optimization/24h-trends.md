# 24-Hour Trends Analytics

## Overview

The analytics system now supports 24-hour trend tracking across all metrics. This allows you to see which posts are trending in real-time and how your blog's overall performance is changing over the last 24 hours.

## Features

### New Metrics

1. **24-Hour View Counts** (`views24h`)
   - Each post now tracks views from the last 24 hours separately
   - Displayed in analytics dashboard and trending sections
   - Automatically cleaned up after 24 hours

2. **24-Hour Summaries**
   - `totalViews24h` - Total views in last 24 hours
   - `averageViews24h` - Average views per post in last 24 hours
   - `topPost24h` - Top trending post by 24-hour views

3. **Trend Indicators**
   - Visual trend card showing 24-hour view changes
   - Percentage change calculation (comparing 24h views to previous 24h period)
   - Flame icon to indicate trending posts

### Data Storage

**Redis Storage Structure:**
- `views:post:{postId}` - Total view count (string/integer)
- `views:history:post:{postId}` - Sorted set of view timestamps (score: milliseconds, value: timestamp)
  - Automatically cleaned up to maintain only 24-hour data
  - Each view is recorded with its timestamp for precise 24-hour window calculations

### API Response

The `/api/analytics` endpoint now returns:

```typescript
{
  summary: {
    totalPosts: number;
    totalViews: number;
    totalViews24h: number;           // NEW
    averageViews: number;
    averageViews24h: number;         // NEW
    topPost: {
      slug: string;
      title: string;
      views: number;
      views24h: number;              // NEW
    };
    topPost24h: {                    // NEW
      slug: string;
      title: string;
      views: number;
      views24h: number;
    };
  };
  posts: Array<{
    // ... existing fields
    views24h: number;                // NEW
  }>;
}
```

## UI Updates

### Summary Cards
- **Total Views** card now shows 24h breakdown
- **Average Views** card now shows 24h breakdown
- New **24h Trend** card with:
  - Total views in last 24 hours
  - Percentage trend indicator (+ for growth, - for decline)
  - Flame icon to highlight trending activity

### Top Posts Section
- **Top Post (All-time)** - Existing all-time leader with 24h data
- **Trending (24h)** - New card showing the hottest post right now
  - Uses flame icon to indicate trending status
  - Shows both 24h and all-time view counts

### Trending Posts Grid
- Now displays both flame badge (24h views) and regular badge (total views)
- Posts are sorted by all-time views but visually flagged for recent activity

### All Posts Table
- New **Views (24h)** column with flame icon indicator
- Original **Views (All-time)** column retained for comparison
- Makes it easy to spot recent performance shifts

## Implementation Details

### Backend Changes

**`src/lib/views.ts`**
- `getPostViews24h(postId)` - Get 24-hour views for a single post
- `getMultiplePostViews24h(postIds)` - Batch get 24-hour views (optimized with parallel queries)
- Enhanced `incrementPostViews()` to record timestamps in sorted sets
- Automatic cleanup of views older than 24 hours

**`src/app/api/analytics/route.ts`**
- Fetches both total and 24-hour views for all posts
- Calculates 24-hour summaries and trend indicators
- Returns top post by 24h views alongside all-time leader

### Frontend Changes

**`src/app/analytics/AnalyticsClient.tsx`**
- Displays 24h metrics alongside all-time metrics
- Visual trend indicators with percentage change
- Separate cards for all-time top post and trending post
- Enhanced table with 24h column and visual indicators
- All filtering (hide drafts/archived) applies to 24h data as well

## Performance

- **Redis Sorted Set Queries**: O(log N + M) where N is total views, M is 24h views
- **Cleanup**: Automatic ZREMRANGEBYSCORE removes old data on each view
- **Batch Queries**: Multiple posts fetched in parallel for efficiency
- **Fallback**: Gracefully degrades to 0 views if Redis unavailable

## Development

To view 24-hour trends:
1. Run dev server: `npm run dev`
2. Navigate to `/analytics` (development only)
3. View trends for each post and overall metrics
4. Trends update in real-time as posts are viewed

## Future Enhancements

Potential improvements:
- Hourly view count breakdowns
- 7-day and 30-day trend views
- View spike detection and alerts
- Trend prediction based on historical data
- Export analytics as CSV/JSON
- Comparison views (post vs post, period vs period)
