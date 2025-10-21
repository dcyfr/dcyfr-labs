# API Documentation

This document covers all API routes in the cyberdrew.dev portfolio application.

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
- **5-minute cache** for successful responses
- **1-minute cache** for fallback data
- In-memory cache with TTL
- ~95% reduction in GitHub API calls

**Cache Headers**:
```http
Cache-Control: public, s-maxage=300, stale-while-revalidate=600
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
const response = await fetch('/api/github-contributions?username=dcyfr');
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

**From**: `contact@cyberdrew.dev`  
**To**: `security@cyberdrew.dev`  
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

## Security Testing

### Test Rate Limiting

```bash
# Should get 429 on 11th request
for i in {1..11}; do
  curl -w "\nStatus: %{http_code}\n" \
    http://localhost:3000/api/github-contributions?username=dcyfr
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
