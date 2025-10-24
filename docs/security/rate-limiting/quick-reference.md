# Rate Limiting Quick Reference

Quick reference for developers working with the rate limiting implementation.

**Last Updated:** October 24, 2025

## 📋 At a Glance

- **Storage:** Redis (distributed) with in-memory fallback
- **Endpoints:** `/api/contact`, `/api/github-contributions`
- **Contact Limit:** 3 requests per 60 seconds per IP
- **GitHub Limit:** 10 requests per 60 seconds per IP
- **Status Code:** 429 (Too Many Requests)
- **Dependencies:** `redis` package

## 🚀 Quick Start

### Using the Rate Limiter

```typescript
import { rateLimit, getClientIp, createRateLimitHeaders } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // 1. Get client IP
  const clientIp = getClientIp(request);
  
  // 2. Check rate limit (async with Redis)
  const result = await rateLimit(clientIp, {
    limit: 3,
    windowInSeconds: 60,
  });
  
  // 3. Handle rate limit exceeded
  if (!result.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { 
        status: 429,
        headers: createRateLimitHeaders(result),
      }
    );
  }
  
  // 4. Process request...
  // ...
  
  // 5. Return with rate limit headers
  return NextResponse.json(
    { success: true },
    { headers: createRateLimitHeaders(result) }
  );
}
```

### Environment Setup

```bash
# .env.local or .env.production
REDIS_URL=redis://default:password@host:port

# Without REDIS_URL:
# - Falls back to in-memory storage
# - Rate limits per serverless instance only
# - Not shared across deployments

# With REDIS_URL:
# - Distributed rate limiting
# - Shared across all instances
# - Better protection against abuse
```

### Testing Rate Limits

```bash
# Quick test (requires dev server running)
npm run test:rate-limit

# Manual curl test
for i in {1..4}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","message":"Test"}' \
    -i
done
```

## 📊 Configuration

### Current Settings
```typescript
// src/app/api/contact/route.ts
const RATE_LIMIT_CONFIG = {
  limit: 3,              // Max requests
  windowInSeconds: 60,   // Time window
};
```

### Recommended Settings by Use Case

| Use Case | Limit | Window | Reasoning |
|----------|-------|--------|-----------|
| Contact Form | 3 | 60s | Current - Prevents spam while allowing legitimate retries |
| Login Endpoint | 5 | 300s (5min) | Prevents brute force attacks |
| Public API | 100 | 3600s (1h) | General API protection |
| Admin Actions | 10 | 60s | Protect sensitive operations |
| File Upload | 5 | 300s | Prevent resource exhaustion |

## 🔍 API Reference

### `rateLimit(identifier, config)`

Check if request should be rate limited.

**Parameters:**
- `identifier` (string): Unique identifier (e.g., IP address)
- `config` (RateLimitConfig): Configuration object

**Returns:** `RateLimitResult`
```typescript
{
  success: boolean,    // false if rate limited
  limit: number,       // Maximum allowed requests
  remaining: number,   // Requests remaining in window
  reset: number,       // Unix timestamp when limit resets (ms)
}
```

**Example:**
```typescript
const result = rateLimit("203.0.113.42", { limit: 3, windowInSeconds: 60 });
// result.success === false → rate limited
```

### `getClientIp(request)`

Extract client IP from request headers.

**Parameters:**
- `request` (Request): Next.js Request object

**Returns:** string (IP address or "unknown")

**Example:**
```typescript
const ip = getClientIp(request);
// "203.0.113.42"
```

### `createRateLimitHeaders(result)`

Generate standard rate limit headers.

**Parameters:**
- `result` (RateLimitResult): Result from `rateLimit()`

**Returns:** `Record<string, string>`

**Example:**
```typescript
const headers = createRateLimitHeaders(result);
// {
//   "X-RateLimit-Limit": "3",
//   "X-RateLimit-Remaining": "2",
//   "X-RateLimit-Reset": "1696512060000"
// }
```

## 🎨 Response Examples

### Success Response (200)
```json
{
  "success": true,
  "message": "Message received successfully"
}
```

Headers:
```
HTTP/1.1 200 OK
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1696512060000
```

### Rate Limited Response (429)
```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 45
}
```

Headers:
```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1696512060000
Retry-After: 45
```

## 🔧 Common Tasks

### Change Rate Limit

Edit `src/app/api/contact/route.ts`:
```typescript
const RATE_LIMIT_CONFIG = {
  limit: 5,              // Change from 3 to 5
  windowInSeconds: 120,  // Change from 60 to 120
};
```

### Add Rate Limiting to New Endpoint

1. Import utilities:
```typescript
import { rateLimit, getClientIp, createRateLimitHeaders } from "@/lib/rate-limit";
```

2. Add check in your route handler:
```typescript
export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const result = rateLimit(clientIp, { limit: 10, windowInSeconds: 60 });
  
  if (!result.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: createRateLimitHeaders(result) }
    );
  }
  
  // ... rest of your handler
}
```

### Handle 429 on Client

```typescript
const response = await fetch("/api/contact", {
  method: "POST",
  body: JSON.stringify(data),
});

if (response.status === 429) {
  const result = await response.json();
  const retryAfter = result.retryAfter || 60;
  toast.error(`Too many requests. Try again in ${retryAfter}s`);
  return;
}
```

## 🐛 Debugging

### Check Rate Limit Status

Add logging:
```typescript
const result = rateLimit(clientIp, RATE_LIMIT_CONFIG);
console.log("Rate limit check:", {
  ip: clientIp,
  success: result.success,
  remaining: result.remaining,
  resetIn: Math.ceil((result.reset - Date.now()) / 1000) + "s",
});
```

### View Current Rate Limits (Dev Only)

Add debug endpoint:
```typescript
// src/app/api/debug/rate-limits/route.ts
export async function GET() {
  // Only in development!
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  
  // Note: You'll need to export the Map from rate-limit.ts
  return NextResponse.json({
    activeRateLimits: Array.from(rateLimitStore.entries()),
  });
}
```

### Clear Rate Limits (Dev Only)

Restart the dev server:
```bash
# Ctrl+C to stop
npm run dev
```

## ⚠️ Common Pitfalls

### 1. Testing from Same IP
```typescript
// ❌ Won't work - same IP, shared limit
fetch("/api/contact", ...);  // Request 1
fetch("/api/contact", ...);  // Request 2  
fetch("/api/contact", ...);  // Request 3
fetch("/api/contact", ...);  // Request 4 - BLOCKED

// ✓ Test with delays or different IPs
```

### 2. Forgetting Headers
```typescript
// ❌ Missing rate limit headers
return NextResponse.json({ success: true });

// ✓ Include headers
return NextResponse.json(
  { success: true },
  { headers: createRateLimitHeaders(result) }
);
```

### 3. Not Checking result.success
```typescript
// ❌ Always processes request
const result = rateLimit(ip, config);
// ... process request anyway

// ✓ Check success flag
const result = rateLimit(ip, config);
if (!result.success) {
  return NextResponse.json(..., { status: 429 });
}
```

## 📚 Further Reading

- **Full Documentation:** `docs/security/rate-limiting/guide.md`
- **Implementation Summary:** `docs/security/rate-limiting/implementation-summary.md`
- **Flow Diagrams:** `docs/security/rate-limiting/flow.md`
- **Source Code:** `src/lib/rate-limit.ts`

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Rate limit not working | Check if `getClientIp()` returns valid IP |
| Too strict | Increase `limit` or `windowInSeconds` |
| Not strict enough | Decrease `limit` or increase `windowInSeconds` |
| Memory concerns | Consider upgrading to a managed Redis store (Upstash, Redis Cloud, Vercel KV) |
| Testing issues | Use `npm run test:rate-limit` script |
| Headers not showing | Ensure using `createRateLimitHeaders()` |

## 📞 Support

For questions or issues:
1. Check documentation in `docs/security/rate-limiting/*.md`
2. Review source code in `src/lib/rate-limit.ts`
3. Run test script: `npm run test:rate-limit`
4. Check GitHub issues/discussions
