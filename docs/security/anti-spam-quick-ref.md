# Anti-Spam Quick Reference

## TL;DR

View and share tracking now has comprehensive anti-spam protection with 5 layers:
1. IP rate limiting (10 views/5min, 3 shares/60s)
2. Session deduplication (prevents double-counting)
3. User-agent validation (blocks bots)
4. Timing validation (5s for views, 2s for shares)
5. Abuse pattern detection (tracks repeat offenders)

## Usage

### Track Views (Automatic)
```tsx
// In blog post page
<ViewTracker postId={post.id} />
```

### Track Shares (Manual)
```tsx
const { trackShare, isSharing } = useShareTracking(postId);

// When user clicks share button
const result = await trackShare();
if (result.success) {
  toast.success("Thanks for sharing!");
}
```

## API Endpoints

### POST /api/views
```json
{
  "postId": "string",
  "sessionId": "string",
  "timeOnPage": 5000,
  "isVisible": true
}
```

### POST /api/shares
```json
{
  "postId": "string",
  "sessionId": "string",
  "timeOnPage": 2000
}
```

## Rate Limits

| Action | Limit | Window | Per |
|--------|-------|--------|-----|
| Views | 10 | 5 minutes | IP |
| Shares | 3 | 60 seconds | IP |
| View dedup | 1 | 30 minutes | Session + Post |
| Share dedup | 1 | 5 minutes | Session + Post |

## Response Codes

| Code | Meaning |
|------|---------|
| 200 + `recorded: true` | Counted successfully |
| 200 + `recorded: false` | Valid but duplicate/not visible |
| 400 | Invalid request data |
| 429 | Rate limit exceeded |
| 500 | Server error |

## Common Issues

### Views not counting
- ✅ Wait 5 seconds on page
- ✅ Keep tab visible
- ✅ Check rate limits (dev tools network tab)

### Rate limit hit
- Check `X-RateLimit-*` headers for reset time
- Wait for window to expire
- In dev: clear Redis or restart server

### Session issues
- Session ID stored in `sessionStorage`
- Clear with: `sessionStorage.removeItem("viewTrackingSessionId")`
- Each tab gets unique session

## Redis Keys

```
session:view:{postId}:{sessionId}   # View deduplication
session:share:{postId}:{sessionId}  # Share deduplication
abuse:view:{ip}                      # Abuse tracking
abuse:share:{ip}                     # Abuse tracking
ratelimit:view:{ip}                  # Rate limiting
ratelimit:share:{ip}                 # Rate limiting
```

## Testing

### Browser Console
```javascript
// Check session
sessionStorage.getItem("viewTrackingSessionId")

// Manual view
fetch("/api/views", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    postId: "test",
    sessionId: sessionStorage.getItem("viewTrackingSessionId"),
    timeOnPage: 6000,
    isVisible: true
  })
}).then(r => r.json()).then(console.log)
```

### Rate Limit Test
```bash
# Bash: spam views to test rate limit
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/views \
    -H "Content-Type: application/json" \
    -d '{"postId":"test","sessionId":"test","timeOnPage":6000,"isVisible":true}'
  sleep 0.5
done
```

Expected: First 10 succeed, rest 429.

## Files

- **Core:** `src/lib/anti-spam.ts`
- **APIs:** `src/app/api/views/route.ts`, `src/app/api/shares/route.ts`
- **Hooks:** `src/hooks/use-view-tracking.ts`, `src/hooks/use-share-tracking.ts`
- **Component:** `src/components/view-tracker.tsx`
- **Docs:** `docs/security/anti-spam-implementation.md`

## Key Decisions

✅ **Client-side tracking:** Server can't validate user behavior  
✅ **sessionStorage:** Per-tab, privacy-friendly, auto-clears  
✅ **5-layer defense:** Makes spam expensive, not impossible  
✅ **Graceful degradation:** Redis optional, no JS = no count (acceptable)  
❌ **No CAPTCHA:** Adds friction  
❌ **No login required:** Would destroy engagement  

## Monitoring

### Check abuse patterns
```bash
redis-cli -u $REDIS_URL
> ZRANGE abuse:view:123.45.67.89 0 -1 WITHSCORES
> ZCOUNT abuse:view:123.45.67.89 <1h-ago> <now>
```

### View rate limit status
```bash
> GET ratelimit:view:123.45.67.89
> TTL ratelimit:view:123.45.67.89
```

## Performance

- **Client overhead:** ~3KB bundle, minimal CPU
- **Server overhead:** <50ms typical, 4-6 Redis ops per request
- **Memory:** Minimal, keys auto-expire

## See Full Documentation

For architecture details, migration notes, and troubleshooting:
📖 `docs/security/anti-spam-implementation.md`
