# Bot Detection Quick Reference

**Last Updated:** November 19, 2025  
**Full Docs:** [bot-detection.md](./bot-detection.md)

## Quick Start

### Import

```typescript
import { getBotDetection, isBot, isGoodBot, isSearchEngine } from '@/lib/bot-detection';
```

## Common Patterns

### Skip Analytics for Bots

```typescript
const botRequest = await isBot();

return (
  <>
    <Content />
    {!botRequest && <Analytics />}
  </>
);
```

### Exempt Good Bots from Rate Limiting

```typescript
const goodBot = await isGoodBot();

if (!goodBot) {
  const rateLimitResult = await rateLimit(ip, { limit: 10, windowInSeconds: 60 });
  if (!rateLimitResult.success) {
    return new Response('Too many requests', { status: 429 });
  }
}
```

### Optimize for Search Engines

```typescript
const searchBot = await isSearchEngine();

if (searchBot) {
  return <FullSSRContent />;
}

return <InteractiveContent />;
```

### Block Bad Bots

```typescript
const detection = await getBotDetection();

if (detection?.type === 'bad-bot') {
  return new Response('Forbidden', { status: 403 });
}
```

## API

| Function | Returns | Use Case |
|----------|---------|----------|
| `isBot()` | `boolean` | Any bot check |
| `isGoodBot()` | `boolean` | Verified good bot (SEO, social) |
| `isSearchEngine()` | `boolean` | Search engine crawler |
| `getBotName()` | `string \| null` | Bot identifier |
| `getBotDetection()` | `BotDetectionResult` | Full details |

## Bot Types

| Type | Examples | Action |
|------|----------|--------|
| `good-bot` | Search engines, social media | ✅ Allow |
| `search-engine` | Googlebot, Bingbot | ✅ Optimize for SEO |
| `social-media` | Facebook, Twitter | ✅ Allow previews |
| `monitoring` | UptimeRobot, Pingdom | ✅ Allow health checks |
| `bad-bot` | Scrapers, spam | ❌ Block or challenge |

## Performance

- **Detection Time:** ~1-2ms per request
- **Location:** Proxy middleware (Edge runtime)
- **Overhead:** Minimal
- **Caching:** Results via `x-botd` header

## Testing

### Simulate Bots Locally

```bash
# Googlebot
curl -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1)" http://localhost:3000

# Facebook
curl -H "User-Agent: facebookexternalhit/1.1" http://localhost:3000
```

### Check Response

```bash
curl -I https://cyberdrew.dev | grep x-botd-bot
# x-botd-bot: true (if bot)
# x-botd-bot: false (if human)
```

## Best Practices

✅ **DO:**

- Allow good bots (search engines, social media)
- Exclude bots from analytics
- Give search engines full SSR content
- Use different rate limits for different bot types

❌ **DON'T:**

- Block all bots (breaks SEO)
- Rate limit search engines
- Serve broken content to crawlers
- Forget to test with real bot User-Agents

## Common Bots

**Search Engines:** Googlebot, Bingbot, DuckDuckBot, Baiduspider, YandexBot

**Social Media:** facebookexternalhit, Twitterbot, LinkedInBot, Slackbot

**Monitoring:** uptimerobot, pingdom, StatusCake

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Bot not detected | Check User-Agent, report to Vercel |
| False positive | Whitelist IP, use multiple signals |
| Performance slow | Check proxy middleware, monitor Edge cold starts |

## Files

- **Proxy:** `src/proxy.ts` (detection runs here)
- **Utilities:** `src/lib/bot-detection.ts` (helper functions)
- **Docs:** `docs/security/bot-detection.md` (full guide)

---

**Need Help?** See [bot-detection.md](./bot-detection.md) for detailed examples and use cases.
