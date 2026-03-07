<!-- TLP:CLEAR -->

# API Documentation

**Last Updated:** November 9, 2025  
**Security Status:** ✅ All endpoints verified with rate limiting and anti-spam protection

This document covers all API routes in the www.dcyfr.ai portfolio application.

**Test Coverage:**

- All rate limits verified working
- Redis persistence confirmed
- In-memory fallback tested
- Anti-spam protection validated

See `scripts/test-tracking.mjs` for automated testing.

---

## GitHub Contributions API

**Endpoint**: `GET /api/github-contributions`  
**File**: `src/app/api/github-contributions/route.ts`

### Overview

Fetches contribution calendar data for the portfolio owner (`dcyfr`) using GitHub's GraphQL API. Includes comprehensive security measures, caching, and fallback functionality.

### Usage

```bash
GET /api/github-contributions?username=dcyfr
```

**Parameters**:

- `username` (required): Must be `dcyfr` (portfolio owner only)

**Response Format**:

```typescript
{
  contributions: ContributionDay[];  // Array of daily contribution counts
  source: string;                     // "github-api" or "fallback"
  totalContributions: number;         // Total contributions in the past year
  warning?: string;                   // Optional warning message
}

interface ContributionDay {
  date: string;      // ISO date format (YYYY-MM-DD)
  count: number;     // Number of contributions on that day
}
```

### Security Features

#### 1. Rate Limiting ⚡

- **10 requests per minute** per IP address
- In-memory tracking with automatic cleanup
- Returns `429 Too Many Requests` when exceeded
- Includes `Retry-After` header with seconds until reset

**Headers**:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 42
X-RateLimit-Limit: 10
X-RateLimit-Reset: 1696348920000
```

**Response**:

```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "retryAfter": 42
}
```

#### 2. Username Restriction 🔒

- Only accepts username `dcyfr` (portfolio owner)
- Returns `403 Forbidden` for any other username
- Prevents querying arbitrary GitHub users

**Response**:

```json
{
  "error": "Unauthorized: This endpoint only serves data for the portfolio owner"
}
```

#### 3. Input Validation 🛡️

- Validates GitHub username format: `/^[a-zA-Z0-9-]{1,39}$/`
- Alphanumeric characters and hyphens only
- Maximum 39 characters (GitHub limit)
- Returns `400 Bad Request` for invalid formats

**Blocks**:

- SQL injection attempts
- XSS/script tags
- Command injection
- Path traversal
- Invalid characters

#### 4. Server-Side Caching 💾

- **1-hour cache** for successful responses
- **1-minute cache** for fallback data
- In-memory cache with TTL
- ~95% reduction in GitHub API calls

**Cache Headers**:

```http
Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200
X-Cache-Status: HIT|MISS|FALLBACK
```

#### 5. Request Timeout ⏱️

- 10-second timeout on GitHub API requests
- Prevents hanging connections
- Fails fast with fallback data

#### 6. Fallback Data

- Automatic fallback if GitHub API fails
- Realistic contribution patterns
- Includes warning in response
- Shorter cache duration

### Authentication (Optional)

Add a GitHub Personal Access Token for higher rate limits:

**Without token**: 60 requests/hour  
**With token**: 5,000 requests/hour

**Setup**:

1. Create token at https://github.com/settings/tokens
   - No special scopes required (public data only)
2. Add to environment variables:
   ```bash
   # .env.local
   GITHUB_TOKEN=ghp_yourTokenHere
   ```

### Examples

**JavaScript/TypeScript**:

```typescript
const response = await fetch("/api/github-contributions?username=dcyfr");
const data = await response.json();

console.log(`Total: ${data.totalContributions}`);
console.log(`Source: ${data.source}`);
```

**cURL**:

```bash
curl http://localhost:3000/api/github-contributions?username=dcyfr
```

### Status Codes

- `200 OK` - Success (with data or fallback)
- `400 Bad Request` - Missing or invalid username
- `403 Forbidden` - Unauthorized username
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Unexpected error

### Related Files

- `src/components/github-heatmap.tsx` - Client component
- Client-side caching: 24-hour localStorage cache

---

## Contact Form API

**Endpoint**: `POST /api/contact`  
**File**: `src/app/api/contact/route.ts`

### Overview

Processes contact form submissions and sends emails using Resend.

### Usage

```bash
POST /api/contact
Content-Type: application/json
```

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to discuss..."
}
```

**Response**:

```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

### Validation

All fields are required:

- `name`: 1-100 characters
- `email`: Valid email format
- `message`: 1-1000 characters

Returns `400 Bad Request` if validation fails.

### Email Configuration

**From**: `contact@www.dcyfr.ai`  
**To**: `security@www.dcyfr.ai`  
**Reply-To**: User's submitted email

**Email Content**:

```
Subject: Contact form: [User's Name]
Body:
From: [Name] <[Email]>

[Message]
```

### Environment Variables

Required:

```bash
RESEND_API_KEY=re_xxxxx
```

### Status Codes

- `200 OK` - Email sent successfully
- `400 Bad Request` - Invalid/missing fields
- `500 Internal Server Error` - Email sending failed

### Related Files

- `src/app/contact/page.tsx` - Contact form component

---

## Views Tracking API

**Endpoint**: `POST /api/views`  
**File**: `src/app/api/views/route.ts`  
**Status**: ✅ Verified (November 9, 2025)

### Verification Results

- ✅ Rate limiting: 20 views per 5 minutes enforced
- ✅ Session deduplication: Duplicates correctly rejected
- ✅ Timing validation: Quick views (<5s) blocked
- ✅ Redis persistence: Data stored correctly
- ✅ Anti-spam: All 5 protection layers working

### Overview

Client-side view tracking with comprehensive anti-spam protection. Counts blog post views with 5 layers of security.

### Protection Layers

1. **IP Rate Limiting**: 20 views per 5 minutes per IP (~4 views/minute)
2. **Session Deduplication**: 1 view per session per post per 30 minutes
3. **User-Agent Validation**: Blocks bots, requires valid user-agent
4. **Timing Validation**: Minimum 5 seconds on page with page visible
5. **Abuse Pattern Detection**: Tracks and blocks repeat offenders

### Request

```http
POST /api/views
Content-Type: application/json

{
  "postId": "permanent-post-id",
  "sessionId": "client-generated-uuid",
  "timeOnPage": 5234,
  "isVisible": true
}
```

**Fields**:

- `postId` (required): Permanent post identifier
- `sessionId` (required): Client-generated session ID (from sessionStorage)
- `timeOnPage` (required): Milliseconds spent on page (must be >= 5000)
- `isVisible` (required): Whether page is visible (from Visibility API)

### Response

**Success**:

```json
{
  "count": 42,
  "recorded": true
}
```

**Duplicate (Not Counted)**:

```json
{
  "recorded": false,
  "count": null,
  "message": "View already recorded for this session"
}
```

**Rate Limited**:

```json
{
  "error": "Rate limit exceeded",
  "recorded": false
}
```

**Headers**:

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1696348920000
```

### Client Usage

```tsx
import { ViewTracker } from "@/components/view-tracker";

// Automatic tracking in blog posts
<ViewTracker postId={post.id} />;
```

Or with hook:

```tsx
import { useViewTracking } from "@/hooks/use-view-tracking";

const { tracked, error } = useViewTracking(postId);
```

### Status Codes

- `200 OK` - Request valid (check `recorded` field for count status)
- `400 Bad Request` - Invalid request data
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Shares Tracking API

**Endpoint**: `POST /api/shares`  
**File**: `src/app/api/shares/route.ts`  
**Status**: ✅ Verified (November 9, 2025)

### Overview

Client-side share tracking with comprehensive anti-spam protection. Counts blog post shares with 5 layers of security.

### Verification Results

- ✅ Rate limiting: 3 shares per 60 seconds enforced (triggered in tests)
- ✅ Session deduplication: Duplicates correctly rejected
- ✅ Timing validation: Quick shares (<2s) blocked
- ✅ Redis persistence: 2 shares stored correctly
- ✅ Anti-spam: All 5 protection layers working

### Protection Layers

1. **IP Rate Limiting**: 3 shares per 60 seconds per IP ✅ Verified
2. **Session Deduplication**: 1 share per session per post per 5 minutes ✅ Verified
3. **User-Agent Validation**: Blocks bots, requires valid user-agent ✅ Verified
4. **Timing Validation**: Minimum 2 seconds since page load ✅ Verified
5. **Abuse Pattern Detection**: Tracks and blocks repeat offenders ✅ Verified

### Request

```http
POST /api/shares
Content-Type: application/json

{
  "postId": "permanent-post-id",
  "sessionId": "client-generated-uuid",
  "timeOnPage": 3456
}
```

**Fields**:

- `postId` (required): Permanent post identifier
- `sessionId` (required): Client-generated session ID (from sessionStorage)
- `timeOnPage` (required): Milliseconds since page load (must be >= 2000)

### Response

**Success**:

```json
{
  "count": 15,
  "recorded": true
}
```

**Duplicate (Not Counted)**:

```json
{
  "recorded": false,
  "count": null,
  "message": "Share already recorded for this session"
}
```

**Headers**:

```http
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1696348920000
```

### Client Usage

```tsx
import { useShareTracking } from "@/hooks/use-share-tracking";

const { trackShare, isSharing } = useShareTracking(postId);

// Call when user clicks share button
const result = await trackShare();
if (result.success) {
  toast.success("Thanks for sharing!");
}
```

### Status Codes

- `200 OK` - Request valid (check `recorded` field for count status)
- `400 Bad Request` - Invalid request data
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Anti-Spam Implementation

### Session Management

Session IDs stored in `sessionStorage` (not `localStorage`):

- Per-tab persistence only
- Cleared on browser close
- Privacy-friendly (no long-term tracking)
- Validated format: alphanumeric + hyphens/underscores, 10-100 chars

### Redis Keys

```
session:view:{postId}:{sessionId}   # View deduplication (TTL: 1800s)
session:share:{postId}:{sessionId}  # Share deduplication (TTL: 300s)
abuse:view:{ip}                      # Abuse tracking (TTL: 86400s)
abuse:share:{ip}                     # Abuse tracking (TTL: 86400s)
ratelimit:view:{ip}                  # Rate limiting (TTL: 300s)
ratelimit:share:{ip}                 # Rate limiting (TTL: 60s)
```

### Abuse Reasons Logged

- `missing_user_agent` - No user-agent header
- `bot_detected` - Known bot pattern (curl, wget, scrapers)
- `suspicious_user_agent` - Too short or malformed
- `invalid_timing_data` - Missing or negative timing
- `insufficient_time_on_page` - Less than 5s for views
- `share_too_fast` - Less than 2s for shares
- `rate_limit_exceeded` - IP rate limit hit
- `abuse_pattern_detected` - >10 abuse attempts in 1 hour
- `validation_failed` - General validation failure

### Monitoring Abuse

```bash
# Redis CLI commands
redis-cli -u $REDIS_URL

# View abuse attempts for IP
> ZRANGE abuse:view:123.45.67.89 0 -1 WITHSCORES

# Count abuse in last hour
> ZCOUNT abuse:view:123.45.67.89 <timestamp-1h-ago> <now>

# Check rate limit status
> GET ratelimit:view:123.45.67.89
> TTL ratelimit:view:123.45.67.89
```

---

## Plugin Reviews API

**Endpoints**:

- `POST /api/plugins/[id]/reviews` - Submit a review
- `GET /api/plugins/[id]/reviews` - Retrieve reviews

**File**: `src/app/api/plugins/[id]/reviews/route.ts`  
**Status**: ✅ Verified (March 2026 - API Route Security Remediation)

### Plugin Reviews Overview

Plugin review submission and retrieval system with authentication, rate limiting, and comprehensive validation. Allows users to submit ratings and reviews for plugins in the marketplace.

### Plugin Reviews Security Features

#### 1. Authentication Required (POST only) 🔒

- **POST requests require authenticated session**
- Uses `withAuth` middleware with `requireAuth: true`
- User ID extracted from authenticated session
- Returns `401 Unauthorized` if not authenticated
- GET requests are public (no authentication required)

#### 2. Rate Limiting ⚡

- **POST**: 3 requests per minute per IP (reduced from 10/min for security)
- **GET**: 60 requests per minute per IP
- Returns `429 Too Many Requests` when exceeded
- Includes standard rate limit headers

**Headers**:

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1696348920000
```

#### 3. Input Validation 🛡️

- Zod schema validation on all inputs
- Display name: 1-64 characters (trimmed)
- Rating: Integer 1-5 only
- Comment: Maximum 2000 characters (optional)
- Returns `400 Bad Request` for invalid inputs

#### 4. Duplicate Prevention

- One review per user per plugin enforced
- Returns `409 Conflict` if user already reviewed plugin
- Uses userId + pluginId composite key

---

### POST /api/plugins/[id]/reviews

Submit a new rating and review for a plugin.

#### POST Authentication

**Required**: Yes - Must have authenticated session  
**Method**: Session-based authentication via `withAuth` middleware

#### POST Request

```http
POST /api/plugins/my-plugin-id/reviews
Content-Type: application/json
Cookie: session=... (authenticated session required)
```

**Request Body**:

```json
{
  "displayName": "John Doe",
  "rating": 5,
  "comment": "Excellent plugin! Solved my problem perfectly."
}
```

**Fields**:

- `displayName` (required): Display name for review (1-64 characters, trimmed)
- `rating` (required): Integer rating 1-5
- `comment` (optional): Review text (max 2000 characters)

**Note**: `userId` is extracted from authenticated session, not from request body.

#### POST Response

**Success (201 Created)**:

```json
{
  "review": {
    "id": "review-uuid",
    "pluginId": "my-plugin-id",
    "userId": "user-uuid",
    "displayName": "John Doe",
    "rating": 5,
    "comment": "Excellent plugin! Solved my problem perfectly.",
    "createdAt": "2026-03-06T10:30:00.000Z",
    "helpfulVotes": 0
  },
  "stats": {
    "averageRating": 4.7,
    "totalReviews": 23,
    "distribution": {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 5,
      "5": 15
    }
  }
}
```

**Error Responses**:

**401 Unauthorized** - Not authenticated:

```json
{
  "error": "Authentication required."
}
```

**400 Bad Request** - Invalid input:

```json
{
  "error": "Invalid request body.",
  "issues": [
    {
      "path": ["rating"],
      "message": "Expected number >= 1 and <= 5"
    }
  ]
}
```

**409 Conflict** - Duplicate review:

```json
{
  "error": "You have already submitted a review for this plugin."
}
```

**429 Too Many Requests** - Rate limit exceeded:

```json
{
  "error": "Rate limit exceeded. Try again later."
}
```

#### Example POST Usage

**JavaScript/TypeScript**:

```typescript
// User must be authenticated first
const response = await fetch("/api/plugins/my-plugin-id/reviews", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Important: include session cookie
  body: JSON.stringify({
    displayName: "John Doe",
    rating: 5,
    comment: "Great plugin!",
  }),
});

if (response.status === 401) {
  // Redirect to login
  window.location.href = "/auth/signin?callbackUrl=/plugins/my-plugin-id";
  return;
}

const data = await response.json();
console.log(`Review submitted! Average rating: ${data.stats.averageRating}`);
```

**cURL**:

```bash
# Note: This will return 401 without valid session cookie
curl -X POST http://localhost:3000/api/plugins/my-plugin-id/reviews \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your-session-cookie-here" \
  -d '{
    "displayName": "John Doe",
    "rating": 5,
    "comment": "Excellent plugin!"
  }'
```

---

### GET /api/plugins/[id]/reviews

Retrieve paginated reviews for a plugin.

#### GET Authentication

**Required**: No - Public endpoint

#### GET Request

```http
GET /api/plugins/my-plugin-id/reviews?page=1&pageSize=10&sortBy=createdAt&sortOrder=desc
```

**Query Parameters** (all optional):

- `page` (default: 1): Page number (minimum 1)
- `pageSize` (default: 10): Results per page (1-100)
- `sortBy` (default: createdAt): Sort field - `createdAt`, `rating`, or `helpfulVotes`
- `sortOrder` (default: desc): Sort direction - `asc` or `desc`

#### GET Response

**Success (200 OK)**:

```json
{
  "reviews": [
    {
      "id": "review-uuid-1",
      "pluginId": "my-plugin-id",
      "userId": "user-uuid",
      "displayName": "John Doe",
      "rating": 5,
      "comment": "Excellent plugin!",
      "createdAt": "2026-03-06T10:30:00.000Z",
      "helpfulVotes": 12
    },
    {
      "id": "review-uuid-2",
      "pluginId": "my-plugin-id",
      "userId": "user-uuid-2",
      "displayName": "Jane Smith",
      "rating": 4,
      "comment": "Very useful, with minor improvements needed.",
      "createdAt": "2026-03-05T15:20:00.000Z",
      "helpfulVotes": 8
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalReviews": 23,
    "totalPages": 3
  },
  "stats": {
    "averageRating": 4.7,
    "totalReviews": 23,
    "distribution": {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 5,
      "5": 15
    }
  }
}
```

**Error Responses**:

**400 Bad Request** - Missing plugin ID:

```json
{
  "error": "Plugin ID is required."
}
```

**429 Too Many Requests** - Rate limit exceeded:

```json
{
  "error": "Rate limit exceeded."
}
```

#### Example GET Usage

**JavaScript/TypeScript**:

```typescript
// No authentication required
const response = await fetch(
  "/api/plugins/my-plugin-id/reviews?page=1&pageSize=10&sortBy=helpfulVotes&sortOrder=desc"
);
const data = await response.json();

console.log(`Average rating: ${data.stats.averageRating}`);
console.log(`Total reviews: ${data.stats.totalReviews}`);
data.reviews.forEach((review) => {
  console.log(`${review.displayName}: ${review.rating}/5 - ${review.comment}`);
});
```

**React Component Example**:

```tsx
import { useState, useEffect } from "react";

function PluginReviews({ pluginId }: { pluginId: string }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/plugins/${pluginId}/reviews`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [pluginId]);

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div>
      <h3>Reviews ({data.stats.totalReviews})</h3>
      <div>Average: {data.stats.averageRating.toFixed(1)}/5</div>
      {data.reviews.map((review) => (
        <div key={review.id}>
          <strong>{review.displayName}</strong>: {review.rating}/5
          <p>{review.comment}</p>
          <small>{review.helpfulVotes} found this helpful</small>
        </div>
      ))}
    </div>
  );
}
```

---

### Plugin Reviews Status Codes

**POST Endpoint**:

- `201 Created` - Review submitted successfully
- `400 Bad Request` - Invalid/missing fields
- `401 Unauthorized` - Not authenticated
- `409 Conflict` - User already reviewed this plugin
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Unexpected error

**GET Endpoint**:

- `200 OK` - Reviews retrieved successfully
- `400 Bad Request` - Invalid plugin ID
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Unexpected error

---

### Plugin Reviews Related Files

- `src/lib/plugins/review-store.ts` - Review storage and retrieval logic
- `src/lib/auth-middleware.ts` - Authentication middleware
- `src/lib/rate-limit.ts` - Rate limiting implementation
- `src/components/plugin-review-form.tsx` - Client-side review form

---

## Contact Form API

**Endpoint**: `POST /api/contact`  
**File**: `src/app/api/contact/route.ts`

### Overview

Sends contact form emails with rate limiting and validation.

### Request

```json
{
  "name": "string (required, 1-100 chars)",
  "email": "string (required, valid email)",
  "message": "string (required, 10-5000 chars)"
}
```

### Test Rate Limiting

```bash
# Should get 429 on 11th request
for i in {1..11}; do
  curl -w "\nStatus: %{http_code}\n" \
    http://localhost:3000/api/contact \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
done
```

### Test Username Restriction

```bash
# Should get 403
curl http://localhost:3000/api/github-contributions?username=attacker

# Should get 200
curl http://localhost:3000/api/github-contributions?username=dcyfr
```

### Test Input Validation

```bash
# Should get 400
curl "http://localhost:3000/api/github-contributions?username=<script>alert('xss')</script>"
curl "http://localhost:3000/api/github-contributions?username=dcyfr'; DROP TABLE;"
curl "http://localhost:3000/api/github-contributions?username=aaaaaaaaaa$(whoami)"
```

### Test Caching

```bash
# First request: X-Cache-Status: MISS
curl -I http://localhost:3000/api/github-contributions?username=dcyfr

# Second request (within 5 min): X-Cache-Status: HIT
curl -I http://localhost:3000/api/github-contributions?username=dcyfr
```

---

## Monitoring

### Key Metrics

1. **Rate Limit Hits** - Track 429 responses
2. **403 Forbidden** - Unauthorized username attempts
3. **400 Bad Request** - Invalid input patterns
4. **Cache Hit Rate** - Efficiency metric (target: >90%)
5. **Response Times** - Performance tracking
6. **GitHub API Errors** - Upstream issues

### Performance Benchmarks

**GitHub Contributions API**:

- Cached response: ~50ms
- Cache miss: ~500ms
- Cache hit rate: >95%

---

## Deployment (Vercel)

### Environment Variables

Add to Vercel project settings:

```bash
# Optional - for higher GitHub API rate limits
GITHUB_TOKEN=ghp_xxxxx

# Required - for contact form emails
RESEND_API_KEY=re_xxxxx
```

Apply to all environments: Production, Preview, Development.

### Monitoring

Watch these in production:

- API response times
- Error rates
- Cache performance
- Rate limit triggers

---

## References

- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [GitHub Rate Limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)
- [Resend Documentation](https://resend.com/docs)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
