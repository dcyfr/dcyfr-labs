# GitHub Webhook Deployment Guide

**Last Updated:** January 21, 2026  
**Status:** Production Ready  
**Test Coverage:** 23 passing tests (webhook API + transformer)

---

## 🎯 Overview

This guide walks through deploying the real-time GitHub commit webhook integration for the dcyfr-labs activity feed. The webhook enables commits to appear in the activity timeline within 30 seconds of pushing to the repository.

**What it does:**
- Receives push events from GitHub via webhook
- Verifies HMAC-SHA256 signature for security
- Queues commits to Inngest for background processing
- Stores commits in Redis with 7-day TTL
- Displays commits in activity feed timeline

**Architecture:**
```
GitHub Push Event
    ↓
/api/github/webhook (Next.js API route)
    ↓
Signature Verification (HMAC-SHA256)
    ↓
Inngest Event Queue (github/commit.pushed)
    ↓
Redis Storage (github:commit:{hash})
    ↓
Activity Feed (/activity page)
```

---

## ✅ Pre-Deployment Checklist

**Code Implementation:**
- ✅ Webhook endpoint: `src/app/api/github/webhook/route.ts`
- ✅ Inngest processor: `src/inngest/functions/github-commits.ts`
- ✅ Activity transformer: `src/lib/activity/transformers/webhook-github.ts`
- ✅ Security: HMAC-SHA256 signature verification
- ✅ Tests: 14 webhook tests + 9 transformer tests

**Environment Configuration:**
- ✅ Local: `GITHUB_WEBHOOK_SECRET` in `.env.local`
- ⏳ Production: Add `GITHUB_WEBHOOK_SECRET` to Vercel
- ✅ Redis: `REDIS_URL` configured (required for storage)
- ✅ Inngest: `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY` configured

---

## 📋 Deployment Steps

### Step 1: Configure Production Environment Variables

**Required Environment Variable:**
```bash
GITHUB_WEBHOOK_SECRET="***REMOVED***"
```

**Action:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`dcyfr-labs`)
3. Navigate to: **Settings** → **Environment Variables**
4. Click **Add New**
5. Configure:
   - **Key:** `GITHUB_WEBHOOK_SECRET`
   - **Value:** `***REMOVED***`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
6. Click **Save**

**Security Note:**
- This secret is already in `.env.local` (git-ignored)
- Never commit secrets to version control
- Rotate periodically for best security

---

### Step 2: Deploy to Production

**Option A: Git Push (Recommended)**
```bash
# Ensure working tree is clean
git status

# Push to trigger deployment
git push origin preview  # or main
```

**Option B: Vercel CLI**
```bash
vercel --prod
```

**Verification:**
1. Wait for deployment to complete
2. Note your production URL (e.g., `https://www.dcyfr.ai`)
3. Test health endpoint:
   ```bash
   curl https://www.dcyfr.ai/api/github/webhook
   ```
   **Expected Response:**
   ```json
   {
     "status": "ok",
     "webhook": "github",
     "repository": "dcyfr/dcyfr-labs"
   }
   ```

---

### Step 3: Configure GitHub Webhook

**Navigate to Repository Settings:**
1. Go to: https://github.com/dcyfr/dcyfr-labs/settings/hooks
2. Click **"Add webhook"**

**Webhook Configuration:**

| Field | Value |
|-------|-------|
| **Payload URL** | `https://www.dcyfr.ai/api/github/webhook` |
| **Content type** | `application/json` |
| **Secret** | `***REMOVED***` |
| **SSL verification** | ✅ Enable SSL verification |
| **Which events would you like to trigger this webhook?** | ☑️ Just the push event |
| **Active** | ✅ Active |

**Save Webhook:**
1. Click **"Add webhook"**
2. GitHub will immediately send a test ping event
3. You should see a green checkmark (✅) if successful

---

### Step 4: Verify Webhook Delivery

**Check GitHub's Recent Deliveries:**
1. Go to: https://github.com/dcyfr/dcyfr-labs/settings/hooks
2. Click on your newly created webhook
3. Scroll to **"Recent Deliveries"**
4. Click on the ping event

**Expected Response (Ping Event):**
- **Response Code:** 200
- **Response Headers:** `content-type: application/json`
- **Response Body:**
  ```json
  {
    "message": "Event type not supported",
    "eventType": "ping"
  }
  ```
  *(This is expected - ping events are not processed, only push events)*

---

### Step 5: Test with Real Commit

**Create Test Commit:**
```bash
# Create a test file
echo "# GitHub Webhook Test" > webhook-test.md
echo "Testing real-time commit tracking via webhook." >> webhook-test.md

# Commit and push
git add webhook-test.md
git commit -m "test: verify GitHub webhook delivery"
git push origin preview
```

**Verify Webhook Delivery:**
1. Return to GitHub webhook settings
2. Click **"Recent Deliveries"**
3. Find the push event (should be at the top)
4. Click to expand

**Expected Response (Push Event):**
- **Response Code:** 200
- **Response Body:**
  ```json
  {
    "success": true,
    "commitsProcessed": 1,
    "branch": "preview"
  }
  ```

**Verify Inngest Processing:**
1. Go to [Inngest Dashboard](https://app.inngest.com/)
2. Navigate to **Functions** → `processGitHubCommit`
3. Check recent runs - should see successful execution
4. Verify commit data in run details

---

### Step 6: Verify Activity Feed Integration

**Check Redis Storage:**
```bash
# If using Vercel KV or Upstash
# Connect via their web UI or CLI

# Expected keys:
github:commit:29cf4c9      # Individual commit (short SHA)
github:commits:recent      # Index of last 1000 commits
```

**Visit Activity Feed:**
1. Go to: https://www.dcyfr.ai/activity
2. Look for your test commit in the timeline
3. Should appear within 30 seconds of push

**Verify Commit Details:**
- ✅ Short commit hash (7 characters)
- ✅ Commit message (first line only)
- ✅ Author name
- ✅ Timestamp
- ✅ Link to GitHub commit (clickable)
- ✅ Branch name badge (e.g., "preview")

---

## 🔍 Troubleshooting

### Webhook Returns 401 Unauthorized

**Cause:** Signature verification failed

**Solutions:**
1. Verify `GITHUB_WEBHOOK_SECRET` matches in all locations:
   - Vercel environment variables
   - GitHub webhook configuration
   - Local `.env.local` (for testing)

2. Check for whitespace or quotes:
   ```bash
   # Incorrect (extra quotes)
   GITHUB_WEBHOOK_SECRET="\"***REMOVED***\""
   
   # Correct
   GITHUB_WEBHOOK_SECRET="***REMOVED***"
   ```

3. Regenerate secret if needed:
   ```bash
   openssl rand -base64 32
   ```

---

### Webhook Returns 500 Internal Server Error

**Cause:** Server-side error in webhook processing

**Solutions:**
1. Check Vercel logs:
   - Go to Vercel Dashboard → Deployments → [Latest] → Logs
   - Search for `/api/github/webhook`

2. Common causes:
   - Missing `REDIS_URL` environment variable
   - Inngest not configured (`INNGEST_EVENT_KEY`)
   - Invalid JSON payload from GitHub

3. Test locally:
   ```bash
   npm run dev
   # Send test webhook using GitHub's "Redeliver" button
   ```

---

### Commits Not Appearing in Activity Feed

**Cause:** Redis storage or transformer issue

**Solutions:**
1. **Check Redis Connection:**
   ```bash
   # Verify REDIS_URL is set in Vercel
   # Test connection via Redis CLI or web UI
   ```

2. **Check Inngest Processing:**
   - Go to Inngest Dashboard
   - Check `processGitHubCommit` function runs
   - Look for errors in run logs

3. **Verify Repository Filter:**
   - Webhook only processes `dcyfr/dcyfr-labs` repository
   - Check `body.repository?.full_name` in webhook payload

4. **Check Activity Transformer:**
   - Verify `transformWebhookGitHubCommits()` is called
   - Check Redis keys exist: `github:commits:recent`

---

### "Missing signature header" Error

**Cause:** GitHub webhook not configured with secret

**Solutions:**
1. Go to GitHub webhook settings
2. Verify **Secret** field is filled
3. Re-save webhook configuration
4. Test with "Redeliver" button

---

### Commits Delayed or Missing

**Cause:** Redis TTL or race condition

**Solutions:**
1. **Check Redis TTL:**
   - Commits expire after 7 days
   - Verify current time vs. commit timestamp

2. **Check Race Condition:**
   - Activity feed fetches from Redis cache
   - Inngest processes commits asynchronously
   - Allow 5-10 seconds for processing

3. **Force Refresh:**
   - Clear browser cache
   - Reload activity feed page

---

## 📊 Monitoring & Maintenance

### Health Checks

**Webhook Endpoint:**
```bash
# Should return 200 OK
curl https://www.dcyfr.ai/api/github/webhook
```

**Redis Storage:**
```bash
# Check commit count
redis-cli LLEN github:commits:recent

# Check specific commit
redis-cli GET github:commit:29cf4c9
```

**Inngest Processing:**
- Monitor function runs in [Inngest Dashboard](https://app.inngest.com/)
- Set up alerts for failed runs
- Review error logs weekly

---

### Performance Metrics

**Expected Performance:**
- **Webhook Response Time:** <100ms
- **Signature Verification:** <10ms
- **Inngest Queue Time:** <5 seconds
- **Redis Storage:** <50ms
- **Activity Feed Latency:** <30 seconds (total)

**Monitoring:**
- Track webhook delivery success rate in GitHub
- Monitor Inngest function success rate
- Set up Sentry alerts for webhook errors
- Track Redis storage size (should be <10MB)

---

### Rate Limiting Considerations

**Current Implementation:**
- ✅ No rate limit on webhook endpoint (trusted GitHub source)
- ✅ Signature verification prevents abuse
- ✅ Only processes `dcyfr/dcyfr-labs` repository

**Future Enhancements (if needed):**
- [ ] Add rate limiting per repository
- [ ] Add webhook request logging
- [ ] Add commit processing queue limits
- [ ] Add Redis storage size alerts

---

### Storage Management

**Redis Key Structure:**
```
github:commit:{hash}       # Individual commit data (7-day TTL)
github:commits:recent      # List of recent commit hashes (no TTL)
```

**Storage Limits:**
- Individual commits: 7-day TTL (automatic cleanup)
- Recent commits index: Last 1000 commits (manual rotation)
- Estimated size: ~10MB for 1000 commits

**Cleanup Script (if needed):**
```bash
# Remove old commits from index
redis-cli LTRIM github:commits:recent 0 999
```

---

## 🚀 Post-Deployment Verification

### Checklist

After successful deployment, verify:

- [ ] Webhook endpoint health check returns 200 OK
- [ ] GitHub ping event successful (see Recent Deliveries)
- [ ] Test commit triggers webhook (201 response)
- [ ] Commit stored in Redis (`github:commit:{hash}`)
- [ ] Commit appears in activity feed (<30 seconds)
- [ ] Inngest function processes successfully
- [ ] No errors in Vercel logs
- [ ] No errors in Inngest dashboard
- [ ] Activity feed shows correct commit details
- [ ] Commit link redirects to GitHub

---

### Monitoring Dashboard

**Set up monitoring for:**

1. **GitHub Webhook Deliveries:**
   - Go to: https://github.com/dcyfr/dcyfr-labs/settings/hooks
   - Check "Recent Deliveries" weekly
   - Look for failed deliveries (red X)

2. **Inngest Function Runs:**
   - Go to: https://app.inngest.com/
   - Monitor `processGitHubCommit` success rate
   - Set up alerts for failures

3. **Vercel Logs:**
   - Search for `/api/github/webhook`
   - Monitor error rate
   - Set up Sentry alerts

4. **Redis Storage:**
   - Monitor key count
   - Check storage size
   - Verify TTL expiration

---

## 🎯 Success Criteria

**Deployment is successful when:**

✅ **Webhook Configured:**
- GitHub webhook created and active
- Secret configured correctly
- Ping event successful

✅ **Real-Time Processing:**
- Push events trigger webhook (<5 seconds)
- Commits queued to Inngest (<10 seconds)
- Commits stored in Redis (<20 seconds)
- Commits visible in activity feed (<30 seconds total)

✅ **No Errors:**
- 100% webhook delivery success rate
- 100% Inngest processing success rate
- No Redis connection errors
- No signature verification failures

✅ **User Experience:**
- Activity feed shows real-time commits
- Commit details are accurate
- Links to GitHub work correctly
- Performance <30 seconds end-to-end

---

## 📝 Next Steps

### Immediate (Post-Deployment)

1. **Update TODO.md:**
   ```markdown
   - [x] Deploy webhook endpoint to production
   - [x] Configure webhook on dcyfr/dcyfr-labs repository
   - [x] Test webhook delivery with test commit
   - [x] Verify commits appear in activity feed
   ```

2. **Monitor for 24 hours:**
   - Check GitHub Recent Deliveries
   - Monitor Inngest function runs
   - Verify Redis storage growth
   - Test with multiple commits

3. **Clean up test files:**
   ```bash
   git rm webhook-test.md
   git commit -m "chore: remove webhook test file"
   git push origin preview
   ```

---

### Future Enhancements (Backlog)

**P1 - High Priority:**
- [ ] Add webhook delivery monitoring dashboard
- [ ] Set up Sentry alerts for webhook failures
- [ ] Add commit processing rate limiting (if needed)

**P2 - Medium Priority:**
- [ ] Add commit detail view with diff preview
- [ ] Filter activity feed by branch
- [ ] Add webhook health check cron job
- [ ] Add Redis storage size alerts

**P3 - Low Priority:**
- [ ] Support multiple repositories
- [ ] Add commit search functionality
- [ ] Add commit statistics dashboard
- [ ] Export commit history to CSV

---

## 📚 Related Documentation

- **Implementation:** `src/app/api/github/webhook/route.ts`
- **Processing:** `src/inngest/functions/github-commits.ts`
- **Transformer:** `src/lib/activity/transformers/webhook-github.ts`
- **Tests:** `src/__tests__/api/github-webhook.test.ts`
- **Activity Feed:** `docs/features/activity-feed.md`
- **Environment Setup:** `.env.example` (lines 267-305)

---

## 🤝 Support

**Issues or Questions?**
- Check Vercel logs for webhook errors
- Review Inngest dashboard for processing failures
- Inspect GitHub Recent Deliveries for delivery issues
- Check Redis for storage/TTL problems

**Need Help?**
- GitHub webhook docs: https://docs.github.com/webhooks
- Inngest docs: https://www.inngest.com/docs
- Redis docs: https://redis.io/docs/

---

**Status:** ✅ Ready for Production Deployment  
**Last Tested:** January 21, 2026  
**Test Coverage:** 23/23 passing tests
