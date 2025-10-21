# Deployment Checklist

## GitHub Contributions Fix

This checklist ensures the GitHub contributions feature works correctly in production.

### ✅ Required Steps

1. **Deploy the Code**
   ```bash
   git add .
   git commit -m "fix: restore GitHub contributions API endpoint"
   git push
   ```
   Vercel will automatically deploy the changes.

### 🔧 Optional but Recommended: Add GitHub Token

To avoid rate limiting (increases from 60 to 5,000 requests/hour):

1. **Create GitHub Personal Access Token**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Note: "Portfolio GitHub API access"
   - Expiration: Choose your preference (90 days, 1 year, or no expiration)
   - **Scopes: Leave all unchecked** (public data only, no permissions needed)
   - Click "Generate token"
   - Copy the token (it will only be shown once)

2. **Add to Vercel Environment Variables**
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Click "Add New"
   - Key: `GITHUB_TOKEN`
   - Value: Paste your token (starts with `ghp_` or `github_pat_`)
   - Environments: Check all (Production, Preview, Development)
   - Click "Save"

3. **Redeploy** (triggers automatic deployment with new env var)
   - Vercel will redeploy automatically when you save the env var
   - Or manually trigger: Deployments → ... menu → Redeploy

### ✅ Verify Deployment

1. **Check the heatmap loads**
   - Visit: https://your-domain.com/projects
   - Scroll to "Contribution Activity" section
   - Should display GitHub contribution heatmap
   - Should NOT show "Unable to load contribution data"

2. **Check for warnings** (if no token added)
   - May see: "Using unauthenticated GitHub API (subject to rate limits)"
   - This is normal without a token
   - Add token to remove warning

3. **Check data freshness**
   - Contributions should match your GitHub profile
   - Visit: https://github.com/dcyfr
   - Compare contribution counts

### 🔍 Troubleshooting

**"Unable to load contribution data"**
- Check Vercel Function Logs for errors
- Verify API route deployed: https://your-domain.com/api/github-contributions?username=dcyfr
- Should return JSON, not 404

**Stale or incorrect data**
- Clear browser cache
- Data is cached for 24 hours in localStorage
- Try in incognito/private browsing mode

**"Demo data" warning**
- The GitHub API is rate limited or unavailable
- Add `GITHUB_TOKEN` environment variable
- Wait for rate limit to reset (1 hour)

**Token not working**
- Verify token is valid at https://github.com/settings/tokens
- Regenerate if expired
- Update Vercel environment variable
- Trigger redeploy

### 📊 Expected Behavior

**With Token** (recommended):
- ✅ Real contribution data from GitHub
- ✅ 5,000 requests/hour rate limit
- ✅ No warnings
- ✅ Reliable data loading

**Without Token**:
- ✅ Real contribution data from GitHub
- ⚠️ 60 requests/hour rate limit
- ⚠️ Warning about unauthenticated API
- ⚠️ May show fallback data if rate limited

**Fallback Mode**:
- ⚠️ Sample/demo data displayed
- ⚠️ Warning banner shown
- ⚠️ "View on GitHub" link provided
- ✅ Component doesn't break

### 📝 Notes

- The API route works without a token but has strict rate limits
- Adding a token is recommended for production
- Token needs NO special permissions (read-only public access)
- Client-side caching reduces API calls (24h TTL)
- Component gracefully handles failures

### 📚 Documentation

- `docs/api/reference.md` - Complete API documentation for portfolio endpoints
- `README.md` - Quick start guide and environment variable overview
- `docs/operations/todo.md` - Backlog, priorities, and follow-up work
- _Planned_: `.env.example` for copy/paste environment defaults (tracked in the TODO)
