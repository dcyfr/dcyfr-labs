# Environment Variables Guide

**Last Updated:** October 20, 2025

## Overview

This guide documents all environment variables used in the project, their purposes, and setup instructions. The project is designed to run gracefully even when environment variables are missing, with appropriate fallbacks and warnings.

## Quick Reference

| Variable | Required | Purpose | Default Behavior |
|----------|----------|---------|------------------|
| `RESEND_API_KEY` | Production only | Email delivery for contact form | Logs submissions, shows warning |
| `GITHUB_TOKEN` | Recommended | GitHub API rate limits | Uses unauthenticated API (60 req/hr) |
| `REDIS_URL` | Optional | Blog post view counts | Disables view tracking |
| `NEXT_PUBLIC_SITE_URL` | Optional | Site URL override | Uses environment-based defaults |
| `NEXT_PUBLIC_SITE_DOMAIN` | Optional | Domain override | Uses environment-based defaults |

## Setup

### Local Development

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Start development (works immediately):**
   ```bash
   npm run dev
   ```

3. **Add credentials as needed** (all optional for local dev):
   - See individual sections below for each service

### Production Deployment (Vercel)

1. Go to your project settings: `Project Settings → Environment Variables`
2. Add required variables (see Production Requirements section)
3. Deploy or redeploy to apply changes

## Environment Variables

### Site Configuration

#### `NEXT_PUBLIC_SITE_URL`
- **Type:** String (URL)
- **Required:** No
- **Example:** `https://cyberdrew.dev`
- **Purpose:** Override the full site URL for absolute links, sitemap, OpenGraph, etc.
- **Default:** Determined by `src/lib/site-config.ts` based on environment:
  - Development: `https://dcyfr.net`
  - Preview (Vercel): `https://cyberdrew.vercel.app`
  - Production: `https://cyberdrew.dev`
- **When to use:** Custom domain testing, non-standard deployments

#### `NEXT_PUBLIC_SITE_DOMAIN`
- **Type:** String (domain)
- **Required:** No
- **Example:** `cyberdrew.dev`
- **Purpose:** Override just the domain (automatically prefixed with `https://`)
- **Default:** Same defaults as `NEXT_PUBLIC_SITE_URL`
- **When to use:** Domain-only overrides, easier than full URL
- **Priority:** Lower than `NEXT_PUBLIC_SITE_URL` if both are set

#### `NEXT_PUBLIC_VERCEL_ENV`
- **Type:** String (`production` | `preview` | `development`)
- **Required:** No
- **Managed by:** Vercel (automatically set)
- **Purpose:** Detect Vercel preview deployments
- **Default:** Not set in local development
- **When to use:** Never set manually - Vercel manages this

### Email Configuration

#### `RESEND_API_KEY`
- **Type:** String (API key)
- **Required:** Yes (for production)
- **Purpose:** Send emails via Resend API from contact form
- **Get key at:** [resend.com/api-keys](https://resend.com/api-keys)
- **Setup:**
  1. Sign up at Resend
  2. Create API key
  3. Verify sending domain (optional for testing, required for production)
  4. Add key to environment variables

**Behavior without key:**
- ✅ Contact form still displays
- ✅ Form validation works
- ✅ Rate limiting applies
- ⚠️  Submissions are logged to console only
- ⚠️  User sees warning: "Email notifications are not configured"
- ❌ No actual emails sent

**Implementation:**
- File: `src/app/api/contact/route.ts`
- Check: `const isEmailConfigured = !!process.env.RESEND_API_KEY`
- Returns: 200 status with warning instead of 500 error

### GitHub Integration

#### `GITHUB_TOKEN`
- **Type:** String (Personal Access Token)
- **Required:** No (recommended for production)
- **Purpose:** Increase GitHub API rate limits for contributions heatmap
- **Get token at:** [github.com/settings/tokens](https://github.com/settings/tokens)
- **Scopes needed:** 
  - `public_repo` (for public repositories)
  - OR `read:user` (for public profile only)
  - No write access needed
- **Setup:**
  1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Click "Generate new token (classic)"
  3. Name it (e.g., "Portfolio Site")
  4. Select scopes: `public_repo` OR `read:user`
  5. Generate and copy token
  6. Add to `.env.local` or Vercel environment variables

**Rate Limits:**

| Scenario | Rate Limit | Notes |
|----------|------------|-------|
| Without token | 60 requests/hour | Per IP address |
| With token | 5,000 requests/hour | Per token |
| Server cache | 5 minutes | Reduces API calls |

**Behavior without token:**
- ✅ Heatmap still works
- ✅ Uses unauthenticated GitHub GraphQL API
- ⚠️  Lower rate limits (60/hour)
- ⚠️  May fail during heavy development
- ✅ Server-side cache helps (5-minute cache)

**Behavior with token:**
- ✅ Higher rate limits (5,000/hour)
- ✅ More reliable
- ✅ Better for production
- ✅ Required for high-traffic sites

**Security:**
- ⚠️  API route validates username (`dcyfr`) to prevent abuse
- ⚠️  Only allows fetching data for portfolio owner
- ⚠️  Rate limiting applied (10 requests/minute per IP)

**Implementation:**
- File: `src/app/api/github-contributions/route.ts`
- Conditional header: Only adds `Authorization` when token exists
- No empty header sent when missing

### Redis (View Counts)

#### `REDIS_URL`
- **Type:** String (Redis connection URL)
- **Required:** No
- **Purpose:** Track and display view counts for blog posts
- **Format:** `redis://default:password@host:port`
- **Get Redis at:**
  - [Vercel KV](https://vercel.com/docs/storage/vercel-kv) (recommended for Vercel)
  - [Upstash](https://upstash.com/) (serverless-friendly)
  - Any Redis provider

**Setup (Vercel KV):**
1. Go to Vercel dashboard
2. Storage tab → Create Database → KV
3. Name it (e.g., "portfolio-views")
4. Link to project
5. Environment variables automatically added

**Setup (Upstash):**
1. Sign up at [console.upstash.com](https://console.upstash.com)
2. Create database
3. Copy Redis URL (REST API URL for serverless)
4. Add to environment variables

**Behavior without Redis:**
- ✅ Blog posts still load
- ❌ No view counts displayed
- ❌ No view tracking
- ✅ No errors or warnings
- ✅ Silent graceful degradation

**Behavior with Redis:**
- ✅ View counts tracked per post
- ✅ Displayed on blog list and post pages
- ✅ Atomic increments (concurrent-safe)
- ✅ Persisted across deploys

**Implementation:**
- File: `src/lib/views.ts`
- Check: `if (!redisUrl) return null`
- Graceful: Returns null if Redis unavailable
- Key format: `views:post:{slug}`

### Analytics (Auto-configured)

These are automatically configured by Vercel when you enable the respective features. No manual setup needed.

#### `NEXT_PUBLIC_VERCEL_ANALYTICS_ID`
- **Managed by:** Vercel
- **Purpose:** Vercel Analytics tracking
- **Setup:** Enable in Vercel project settings → Analytics
- **Docs:** [vercel.com/analytics](https://vercel.com/analytics)

#### `NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID`
- **Managed by:** Vercel
- **Purpose:** Vercel Speed Insights
- **Setup:** Enable in Vercel project settings → Speed Insights
- **Docs:** [vercel.com/docs/speed-insights](https://vercel.com/docs/speed-insights)

### Development Variables

#### `NODE_ENV`
- **Type:** String (`development` | `production` | `test`)
- **Required:** No (automatically set)
- **Managed by:** Next.js
- **Values:**
  - `npm run dev` → `development`
  - `npm run build` → `production`
  - `npm start` → `production`
  - `npm test` → `test`
- **Purpose:** Controls development vs production behavior
- **Usage:**
  - Error boundary debug info
  - Redis error logging
  - Development-only features
- **Never set manually** in `.env.local`

## Production Requirements

### Minimum Required Configuration

For a production deployment, at minimum set:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxx
```

This enables actual email delivery from the contact form.

### Recommended Configuration

For full functionality:

```bash
# Required
RESEND_API_KEY=re_xxxxxxxxxxxx

# Recommended
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
REDIS_URL=redis://default:password@host:port

# Optional (only if custom domain)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Full Production Setup Checklist

- [ ] **RESEND_API_KEY** - Required for contact form emails
- [ ] **GITHUB_TOKEN** - Recommended for reliable heatmap
- [ ] **REDIS_URL** - Recommended for view counts
- [ ] **Verify sending domain** in Resend (if using custom email)
- [ ] **Test contact form** after deployment
- [ ] **Test GitHub heatmap** loads correctly
- [ ] **Verify view counts** increment on blog posts

## Environment-Specific Setup

### Development (.env.local)

Minimal setup for local development:

```bash
# Optional - only add if testing these features
# RESEND_API_KEY=re_xxxxxxxxxxxx
# GITHUB_TOKEN=ghp_xxxxxxxxxxxx
# REDIS_URL=redis://localhost:6379
```

**Most features work without any configuration!**

### Staging/Preview (Vercel)

Vercel automatically creates preview deployments for PRs. Use the same production configuration or create separate keys for testing:

```bash
# Use separate keys for preview environment
RESEND_API_KEY=re_preview_xxxxxxxxxxxx
GITHUB_TOKEN=ghp_preview_xxxxxxxxxxxx
REDIS_URL=redis://preview-instance
```

### Production (Vercel)

Full configuration with all features enabled:

```bash
RESEND_API_KEY=re_live_xxxxxxxxxxxx
GITHUB_TOKEN=ghp_live_xxxxxxxxxxxx
REDIS_URL=redis://production-instance
NEXT_PUBLIC_SITE_URL=https://cyberdrew.dev
```

## Testing Environment Variables

### Verify Configuration

Check which environment variables are set:

```bash
# Check if variables are loaded (development)
npm run dev
# Visit http://localhost:3000/api/health (if you create one)

# Check Vercel deployment
# Visit project → Settings → Environment Variables
```

### Test Individual Features

**Contact Form:**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
```

**GitHub Heatmap:**
```bash
curl http://localhost:3000/api/github-contributions?username=dcyfr
```

**Redis (if configured):**
```bash
# Visit any blog post and check console for view count increment
```

## Troubleshooting

### Contact Form Returns 500 Error
- **Problem:** Missing `RESEND_API_KEY`
- **Solution:** Should return 200 with warning (check implementation)
- **Fix:** Update to latest code with graceful fallback

### GitHub Heatmap Rate Limited
- **Problem:** Too many requests without token
- **Solution:** Add `GITHUB_TOKEN` for higher limits
- **Workaround:** Server-side cache helps (5-minute cache)

### View Counts Not Showing
- **Problem:** Missing `REDIS_URL`
- **Solution:** Add Redis configuration
- **Expected:** Should gracefully degrade (no errors)

### Wrong Domain in Links
- **Problem:** Incorrect site URL
- **Solution:** Set `NEXT_PUBLIC_SITE_URL` or `NEXT_PUBLIC_SITE_DOMAIN`
- **Check:** `src/lib/site-config.ts` for default logic

## Security Best Practices

### Never Commit Secrets
```bash
# ✅ Good - ignored by git
.env.local
.env.development.local
.env.production.local

# ❌ Bad - tracked by git
.env
.env.development
.env.production
```

### Use Environment-Specific Keys
- Development: Separate API keys for testing
- Staging: Separate keys from production
- Production: Production-only keys with restrictions

### Rotate Keys Regularly
- GitHub tokens: Rotate every 90 days
- API keys: Rotate on schedule
- Redis: Use strong passwords

### Principle of Least Privilege
- GitHub token: Read-only access only
- API keys: Minimum required permissions
- Redis: Connection-level auth only

## Related Documentation

- [API Reference](./api/reference.md) - API route documentation
- [Deployment Checklist](./operations/deployment-checklist.md) - Pre-deployment checks
- [Site Configuration](./platform/site-config.md) - Domain and URL configuration

## Change Log

- **2025-10-20:** Comprehensive `.env.example` created with all variables documented
- **2025-10-20:** Added graceful fallbacks for missing `RESEND_API_KEY` and `GITHUB_TOKEN`
