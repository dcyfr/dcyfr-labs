# Quick Reference: 24-Hour Trends Analytics

## What Changed

Your analytics dashboard now tracks **24-hour trends** for all posts and metrics. This means you can see which posts are gaining traction right now, not just historically.

## New Metrics Explained

### Per-Post Metrics
- **`views`** - Total all-time views
- **`views24h`** - New! Views from the last 24 hours
- **Trend %** - Percentage change from previous 24h period

### Dashboard Summary
- **Total Views** → Shows breakdown: `1,234` total with `45` in 24h
- **Average Views** → Shows breakdown: `25` avg all-time, `3` avg in 24h
- **24h Trend Card** → Shows total 24h views with % change and flame icon

### Top Posts Cards
- **Top Post (All-time)** - Your most viewed post ever with 24h data
- **Trending (24h)** - The hottest post right now with all-time comparison

## Visual Indicators

- 🔥 **Flame Icon** - Post is trending (has 24h views)
- **Flame Badge** - Number of views in last 24 hours
- **Green/Red %** - Positive/negative trend compared to previous day

## How It Works

1. **View Recording**
   - Each post view is recorded with a timestamp
   - Data stored in Redis sorted set for 24-hour querying
   - Automatically cleaned up after 24 hours

2. **Calculation**
   - 24h views = all views with timestamp within last 24 hours
   - Trend % = ((24h views - previous 24h views) / previous 24h views) * 100

3. **Updates**
   - Real-time! Analytics dashboard shows current data
   - No caching delays for 24h metrics

## Using the Analytics Dashboard

**Access:** `/analytics` (development mode only)

**New Columns:**
- All Posts table now has "Views (24h)" column
- Compare total views to 24h views to spot momentum

**New Filters:**
- Existing filters (Hide drafts, Hide archived) apply to 24h metrics too
- Summary cards update based on filtered results

## API Response Example

```json
{
  "summary": {
    "totalPosts": 15,
    "totalViews": 1000,
    "totalViews24h": 45,      // NEW
    "averageViews": 67,
    "averageViews24h": 3,     // NEW
    "topPost": {
      "views": 200,
      "views24h": 8            // NEW
    },
    "topPost24h": {            // NEW
      "title": "Trending Article",
      "views": 50,
      "views24h": 15
    }
  },
  "posts": [
    {
      "title": "Some Post",
      "views": 100,
      "views24h": 5            // NEW
    }
  ]
}
```

## Technical Details

### Redis Keys
- `views:post:{postId}` - Total view counter
- `views:history:post:{postId}` - Sorted set of timestamps

### Functions (src/lib/views.ts)
- `getPostViews24h(postId)` - Get 24h views for one post
- `getMultiplePostViews24h(postIds)` - Batch query (optimized)
- `incrementPostViews()` - Enhanced to track timestamps

### API Route
- `/api/analytics` - Returns combined all-time and 24h metrics

## Troubleshooting

### No 24h data showing?
- Redis may not be connected (check `REDIS_URL` env)
- Fallback gracefully returns 0 views
- Views will accumulate over time

### Why is trending different from top post?
- **Top Post** - Highest total views ever
- **Trending** - Most views in last 24 hours
- New posts trend faster even with fewer total views

### Data older than 24 hours?
- Automatically cleaned up from `views:history:post:*` keys
- Total view count in `views:post:*` persists indefinitely

## Future Ideas

- 📊 Hourly view breakdowns
- 📈 7-day and 30-day trends
- 🔔 Spike detection alerts
- 📉 Trend predictions
- 📥 CSV/JSON export
