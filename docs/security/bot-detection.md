# Bot Detection with Vercel BotD

**Last Updated:** November 19, 2025  
**Status:** ✅ Active  
**Library:** `botid` v1.5.10

## Overview

This project uses Vercel BotD (Bot Detection) to identify and handle automated traffic. The implementation runs in the proxy middleware and is available to all routes via custom headers.

## Architecture

### Flow Diagram

```text
Request → Proxy Middleware
            ↓
          BotD Detection
            ↓
    Set x-botd Header
            ↓
       Route Handler
            ↓
    Read Bot Detection
            ↓
    Handle Appropriately
```

## Implementation

### 1. Proxy Middleware (`src/proxy.ts`)

Bot detection runs for every request in the proxy middleware:

```typescript
import { botid } from "botid";

export default async function proxy(request: NextRequest) {
  // Detect bots
  const botDetection = await botid(request);
  
  // Pass results via header
  requestHeaders.set("x-botd", JSON.stringify(botDetection));
  
  // Add flag to response header for monitoring
  response.headers.set("x-botd-bot", botDetection.isBot ? "true" : "false");
}
```

### 2. Utility Library (`src/lib/bot-detection.ts`)

Helper functions to access bot detection results:

```typescript
import { getBotDetection, isBot, isGoodBot, isSearchEngine } from '@/lib/bot-detection';

// Get full detection result
const detection = await getBotDetection();

// Simple boolean check
const botRequest = await isBot();

// Check for good bots (search engines, social media)
const goodBot = await isGoodBot();

// Check for search engine crawlers specifically
const searchBot = await isSearchEngine();
```

## Use Cases

### 1. Selective Analytics Tracking

Skip analytics for bots to keep data accurate:

```typescript
import { isBot } from '@/lib/bot-detection';

export default async function Page() {
  const botRequest = await isBot();
  
  return (
    <>
      <PageContent />
      {!botRequest && <AnalyticsTracker />}
    </>
  );
}
```

### 2. Rate Limiting Exemptions

Don't rate limit good bots (search engines, social media):

```typescript
import { isGoodBot } from '@/lib/bot-detection';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const goodBot = await isGoodBot();
  
  if (!goodBot) {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimitResult = await rateLimit(ip, {
      limit: 10,
      windowInSeconds: 60
    });
    
    if (!rateLimitResult.success) {
      return new Response('Too many requests', { status: 429 });
    }
  }
  
  // Process request
}
```

### 3. Simplified Content for Bots

Serve lightweight content to bots:

```typescript
import { isBot } from '@/lib/bot-detection';

export default async function Page() {
  const botRequest = await isBot();
  
  if (botRequest) {
    return <SimplifiedView />; // Static, lightweight
  }
  
  return <FullInteractiveView />; // Dynamic, heavy JS
}
```

### 4. SEO Optimization

Ensure search engines get full SSR content:

```typescript
import { isSearchEngine } from '@/lib/bot-detection';

export default async function Page() {
  const searchBot = await isSearchEngine();
  
  if (searchBot) {
    // Force full server-side rendering
    // Include all metadata and structured data
    // Disable client-side features
  }
  
  return <PageContent />;
}
```

### 5. Security - Block Bad Bots

Block known malicious bots:

```typescript
import { getBotDetection } from '@/lib/bot-detection';

export async function middleware(request: NextRequest) {
  const detection = await getBotDetection();
  
  if (detection?.isBot && detection?.type === 'bad-bot') {
    return new Response('Forbidden', { status: 403 });
  }
  
  return NextResponse.next();
}
```

## Bot Types

BotD categorizes bots into several types:

| Type | Description | Examples | Action |
|------|-------------|----------|--------|
| `good-bot` | Legitimate verified bots | Search engines, social media | Allow full access |
| `search-engine` | Search engine crawlers | Googlebot, Bingbot | Optimize for SEO |
| `social-media` | Social media crawlers | Facebook, Twitter | Allow preview scraping |
| `monitoring` | Uptime monitoring | UptimeRobot, Pingdom | Allow health checks |
| `bad-bot` | Malicious or suspicious | Scrapers, spam bots | Block or challenge |
| `unknown` | Unidentified bots | Various | Apply default policy |

## Common Bots

### Search Engines

- Googlebot
- Bingbot
- Slurp (Yahoo)
- DuckDuckBot
- Baiduspider
- YandexBot

### Social Media

- facebookexternalhit
- Twitterbot
- LinkedInBot
- Slackbot
- WhatsApp
- TelegramBot
- Discordbot

### Monitoring

- uptimerobot
- pingdom
- StatusCake
- Site24x7

## API Reference

### `getBotDetection()`

Get full bot detection result for the current request.

**Returns:** `Promise<BotDetectionResult | null>`

```typescript
interface BotDetectionResult {
  isBot: boolean;
  type?: string;
  name?: string;
  metadata?: Record<string, unknown>;
}
```

### `isBot()`

Check if request is from any bot.

**Returns:** `Promise<boolean>`

### `isGoodBot()`

Check if request is from a verified good bot.

**Returns:** `Promise<boolean>`

### `isSearchEngine()`

Check if request is from a search engine crawler.

**Returns:** `Promise<boolean>`

### `getBotName()`

Get the name of the detected bot.

**Returns:** `Promise<string | null>`

## Performance Impact

### Overhead

- **Detection Time:** ~1-2ms per request
- **Memory:** Minimal (no persistent storage)
- **Network:** None (library runs locally)

### Optimization

BotD detection is:

- ✅ **Fast**: Runs in Edge runtime
- ✅ **Lightweight**: No external API calls
- ✅ **Cached**: Results available via headers
- ✅ **Efficient**: Single detection per request

## Bot Traffic Monitoring

### Vercel Dashboard

Monitor bot traffic in Vercel Analytics:

1. Navigate to your project
2. Go to Analytics → Real-time
3. Filter by bot traffic using custom events

### Response Headers

Check `x-botd-bot` header in responses:

```bash
curl -I https://cyberdrew.dev
# Look for:
# x-botd-bot: true
# or
# x-botd-bot: false
```

### Logging

Add custom logging for bot detection:

```typescript
import { getBotDetection } from '@/lib/bot-detection';

const detection = await getBotDetection();
if (detection?.isBot) {
  console.log('[BotD]', {
    bot: detection.name,
    type: detection.type,
    path: request.nextUrl.pathname
  });
}
```

## Testing

### Local Testing

Test bot detection locally:

```typescript
// In your route handler or page
import { getBotDetection } from '@/lib/bot-detection';

export default async function Page() {
  const detection = await getBotDetection();
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Bot detection:', detection);
  }
  
  return <div>...</div>;
}
```

### Simulate Bots

Use User-Agent strings to simulate bots:

```bash
# Googlebot
curl -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  https://localhost:3000

# Facebook
curl -H "User-Agent: facebookexternalhit/1.1" \
  https://localhost:3000

# Generic bot
curl -H "User-Agent: Bot/1.0" \
  https://localhost:3000
```

## Best Practices

### 1. Don't Block All Bots

**Good bots are essential:**

- Search engines need to index your content
- Social media bots create preview cards
- Monitoring services check uptime

**Always allow good bots:**


```typescript
const detection = await getBotDetection();

// ❌ BAD: Blocks everything
if (detection?.isBot) {
  return new Response('Forbidden', { status: 403 });
}

// ✅ GOOD: Only blocks bad bots
if (detection?.type === 'bad-bot') {
  return new Response('Forbidden', { status: 403 });
}
```

### 2. Use for Analytics Filtering

Keep analytics data accurate:

```typescript
// Exclude bots from view counts
const botRequest = await isBot();
if (!botRequest) {
  await incrementViewCount(slug);
}
```

### 3. Optimize for SEO

Give search engines the best experience:

```typescript
const searchBot = await isSearchEngine();

if (searchBot) {
  // Full SSR content
  // Complete metadata
  // No client-side rendering
  // No lazy loading
}
```

### 4. Rate Limit Smart

Different limits for different actors:

```typescript
const detection = await getBotDetection();

if (detection?.type === 'search-engine') {
  // No limit for search engines
  return processRequest();
}

if (detection?.type === 'good-bot') {
  // Higher limit for good bots
  await rateLimit(identifier, { limit: 100, windowInSeconds: 60 });
} else {
  // Standard limit for users
  await rateLimit(identifier, { limit: 10, windowInSeconds: 60 });
}
```

### 5. Monitor Patterns

Track bot traffic over time:

```typescript
const detection = await getBotDetection();

if (detection?.isBot) {
  // Log to analytics or monitoring service
  trackEvent('bot_detected', {
    type: detection.type,
    name: detection.name,
    path: request.nextUrl.pathname
  });
}
```

## Troubleshooting

### Bot Not Detected

**Possible causes:**

- User-Agent too generic
- New bot not in BotD database
- Detection confidence too low

**Solution:**


- Check User-Agent string
- Report to Vercel if legitimate bot
- Use fallback detection logic

### False Positives

**Possible causes:**

- Browser extension modifying User-Agent
- Privacy-focused browsers
- Corporate proxies

**Solution:**


- Implement appeal mechanism
- Whitelist specific IPs
- Use multiple detection signals

### Performance Issues

**If BotD is slow:**

- Check proxy middleware performance
- Ensure async/await properly used
- Monitor Edge function cold starts

**Optimization:**

```typescript
// Cache bot detection result in request
const botDetection = await botid(request);
requestHeaders.set("x-botd", JSON.stringify(botDetection));
// All routes can read from header (no re-detection)
```

## Related Documentation

- [Rate Limiting Strategy](../security/rate-limiting.md)
- [Error Monitoring](../operations/error-monitoring-strategy.md)
- [Proxy Middleware](../../src/proxy.ts)
- [Vercel BotD Docs](https://vercel.com/docs/botid/get-started)

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-19 | 1.0 | Initial BotD implementation with proxy integration |

## Support

- **Library Issues:** [BotD GitHub](https://github.com/vercel/botid)
- **Vercel Support:** [Vercel Help](https://vercel.com/help)
- **Internal:** `#engineering` Slack channel
