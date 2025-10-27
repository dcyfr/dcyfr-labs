# Public Analytics Dashboard

Development-only analytics dashboard for monitoring blog performance and viewing real-time statistics.

## Overview

The analytics dashboard provides insights into blog post performance, including:
- Total views across all posts
- Average views per post
- Top-performing posts
- Trending posts (from Inngest calculations)
- Complete post listing with view counts
- Post metadata (tags, reading time, publication date)

**Important**: This dashboard is **only available in development mode** and will return a 403 error in preview or production environments.

## Features

### Summary Statistics
- **Total Posts** - Number of published blog posts
- **Total Views** - Cumulative views across all posts
- **Average Views** - Mean views per post
- **Top Post** - Best-performing post with view count

### Trending Posts
- Top 3 trending posts displayed as cards
- Shows post title, summary, and view count
- Links to individual blog posts
- Reading time indicator

### Complete Post Table
- All posts sorted by view count (highest first)
- Columns: Title, Views, Published Date, Tags
- Clickable post titles linking to blog posts
- Tag badges with overflow handling

### Data Sources
- **View Counts**: Real-time from Redis (via `src/lib/views.ts`)
- **Trending Data**: From Inngest calculations (if available)
- **Post Metadata**: From blog post frontmatter

## Usage

### Accessing the Dashboard

**Development Only:**
```
http://localhost:3000/analytics
```

**Preview/Production:**
Returns 403 Forbidden error

### API Endpoint

The dashboard uses the `/api/analytics` endpoint:

```bash
# Development
curl http://localhost:3000/api/analytics

# Preview/Production
curl https://preview.example.com/api/analytics
# Returns: { "error": "Analytics only available in development" }
```

### Response Format

```json
{
  "success": true,
  "timestamp": "2025-10-26T12:34:56.789Z",
  "summary": {
    "totalPosts": 3,
    "totalViews": 1250,
    "averageViews": 417,
    "topPost": {
      "slug": "hardening-tiny-portfolio",
      "title": "Hardening Developer Portfolio",
      "views": 500
    }
  },
  "posts": [
    {
      "slug": "hardening-tiny-portfolio",
      "title": "Hardening Developer Portfolio",
      "summary": "...",
      "publishedAt": "2025-10-20T00:00:00Z",
      "tags": ["security", "portfolio"],
      "views": 500,
      "readingTime": {
        "words": 2500,
        "minutes": 12,
        "text": "12 min read"
      }
    }
    // ... more posts
  ],
  "trending": [
    // Top trending posts from Inngest
  ]
}
```

## Architecture

### Files

- **`src/app/analytics/page.tsx`** - Dashboard UI (client component)
  - Fetches data from `/api/analytics`
  - Displays summary cards, trending posts, and post table
  - Loading and error states
  - Dev-only notice

- **`src/app/api/analytics/route.ts`** - Analytics API endpoint
  - Checks `NODE_ENV === "development"`
  - Returns 403 if not in development
  - Fetches view counts from Redis
  - Combines with post metadata
  - Retrieves trending data from Redis if available

### Data Flow

```
Dashboard Page (Client)
    ↓
    fetch("/api/analytics")
    ↓
API Route (/api/analytics)
    ↓
    Check: isDev?
    ↓
    Get post slugs from posts.ts
    ↓
    Fetch view counts from Redis
    ↓
    Combine with post metadata
    ↓
    Fetch trending data from Redis
    ↓
    Return JSON response
    ↓
Dashboard renders data
```

## Development-Only Implementation

### Environment Check

The API route checks `NODE_ENV === "development"`:

```typescript
const isDev = process.env.NODE_ENV === "development";

export async function GET() {
  if (!isDev) {
    return NextResponse.json(
      { error: "Analytics only available in development" },
      { status: 403 }
    );
  }
  // ... fetch and return analytics
}
```

### Build Behavior

- **Development**: `npm run dev` → Full analytics available
- **Production Build**: `npm run build` → Page builds but returns 403 at runtime
- **Preview**: Vercel preview deployments → Returns 403

## Data Sources

### Redis View Counts

View counts are stored in Redis with the key pattern:
```
views:post:{slug}
```

Example:
```
views:post:hardening-tiny-portfolio → 500
views:post:shipping-tiny-portfolio → 400
views:post:passing-comptia-security-plus → 350
```

### Inngest Trending Data

Trending posts are calculated hourly by the `calculateTrending` function in `src/inngest/blog-functions.ts`:

```
blog:trending → JSON array of trending posts
```

The trending calculation uses:
- Views in last 7 days
- Trending score = recent views × (recent/total ratio)
- Top 10 posts

### Post Metadata

Post data comes from `src/data/posts.ts`:
- Title, summary, slug
- Publication date
- Tags
- Reading time

## Performance Considerations

### Caching

- **View Counts**: Cached in Redis (persistent)
- **Trending Data**: Cached in Redis for 1 hour
- **Post Metadata**: Loaded at build time

### Optimization

- Uses `getMultiplePostViews()` for batch Redis queries
- Single Redis connection per request
- Graceful fallback if Redis unavailable
- Efficient sorting and filtering

## Troubleshooting

### Dashboard Shows 403 Error

**Cause**: Not running in development mode

**Solution**: 
```bash
npm run dev
# Then visit http://localhost:3000/analytics
```

### No View Data Showing

**Cause**: Redis not configured or no views tracked yet

**Solution**:
1. Ensure `REDIS_URL` environment variable is set
2. Visit blog posts to generate view data
3. Check Redis connection in logs

### Trending Data Not Showing

**Cause**: Inngest trending calculation hasn't run yet

**Solution**:
- Trending is calculated hourly
- Check Inngest dev UI at http://localhost:3001/api/inngest
- Manually trigger `calculateTrending` function if needed

## Future Enhancements

### Potential Features

1. **Charts & Graphs**
   - View trends over time
   - Post performance comparison
   - Tag-based analytics

2. **Time Range Filtering**
   - Last 7 days, 30 days, all time
   - Custom date ranges

3. **Export Functionality**
   - CSV export of analytics
   - PDF reports

4. **Advanced Metrics**
   - Bounce rate (if tracking)
   - Time on page
   - Referrer sources

5. **Alerts & Notifications**
   - Milestone notifications
   - Trending post alerts
   - Performance warnings

## Security Notes

- **Development Only**: No sensitive data exposed in production
- **No Authentication**: Assumes local development environment
- **Redis Access**: Uses existing Redis connection
- **No Rate Limiting**: Not needed for dev-only feature

## Related Documentation

- `/docs/features/github-integration.md` - GitHub contribution tracking
- `/docs/blog/architecture.md` - Blog system design
- `/docs/api/routes/overview.md` - API architecture
- `src/inngest/blog-functions.ts` - Inngest analytics functions
- `src/lib/views.ts` - View count utilities

## Files

- `src/app/analytics/page.tsx` - Dashboard UI
- `src/app/api/analytics/route.ts` - Analytics API
- `src/inngest/blog-functions.ts` - Inngest analytics functions
- `src/lib/views.ts` - View count utilities
- `src/data/posts.ts` - Post metadata
