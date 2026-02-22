<!-- TLP:CLEAR -->

# Bing Webmaster Tools Setup Guide

**Information Classification:** TLP:CLEAR (Public)  
**Last Updated:** 2026-02-21  
**Scope:** `dcyfr-labs` — <https://www.dcyfr.ai>

---

## Purpose

Register `dcyfr.ai` with Bing Webmaster Tools to:

- See which URLs Bing has indexed.
- Use URL Inspection to confirm IndexNow submissions were received.
- Monitor crawl errors and manual action notices.
- Access keyword analytics for Bing search traffic.

---

## Prerequisites

- A Microsoft account (personal or work).
- Admin access to DNS records for `dcyfr.ai` **or** access to deploy a
  verification HTML file (Vercel can serve it automatically).
- IndexNow integration already deployed (see [INDEXNOW_TROUBLESHOOTING.md](./INDEXNOW_TROUBLESHOOTING.md)).

---

## Step 1: Create a Bing Webmaster Tools Account

1. Go to <https://www.bing.com/webmasters>.
2. Click **Sign In** and authenticate with your Microsoft account.
3. Click **Get Started** (first-time setup).

---

## Step 2: Add Your Site

1. On the Bing Webmaster Tools dashboard, click **Add a site**.
2. Enter `https://www.dcyfr.ai` and click **Add**.
3. On the **Verify ownership** screen, choose one method:

### Option A: DNS TXT Record (recommended)

1. Copy the TXT record value shown (format: `<value>`).
2. In your DNS provider (Vercel Domains or Cloudflare), create a new TXT record:
   - **Name:** `@` (root domain)
   - **Value:** the string provided by Bing
3. Wait 15–60 minutes for DNS propagation.
4. Return to Bing Webmaster Tools and click **Verify**.

### Option B: HTML Meta Tag

1. Copy the `<meta name="msvalidate.01" content="...">` snippet.
2. Add it to `dcyfr-labs/src/app/layout.tsx` inside the Next.js `<head>` (via `metadata.verification.other`):

   ```typescript
   export const metadata: Metadata = {
     // ...existing metadata...
     verification: {
       other: {
         'msvalidate.01': '<your-bing-verification-code>',
       },
     },
   };
   ```

3. Deploy to production, then click **Verify** in Bing Webmaster Tools.

### Option C: XML File Upload

1. Download the `BingSiteAuth.xml` file from Bing Webmaster Tools.
2. Place it at `dcyfr-labs/public/BingSiteAuth.xml` (Next.js serves files from `public/` at the root).
3. Deploy to production, then click **Verify**.

---

## Step 3: Submit Your Sitemap

After verification, submit the sitemap so Bing can crawl all pages:

1. In the left sidebar, click **Sitemaps**.
2. Click **Submit sitemap**.
3. Enter: `https://www.dcyfr.ai/sitemap.xml`
4. Click **Submit**.

---

## Step 4: Confirm IndexNow is Working

After submitting a URL via IndexNow, verify it in Bing Webmaster Tools:

1. In the left sidebar, click **URL Inspection**.
2. Enter a URL you submitted (e.g., `https://www.dcyfr.ai/blog/example-post`).
3. Click **Search**.
4. The **Indexing State** should show:
   - **Submitted via IndexNow** ✅ — URL was received via IndexNow.
   - **Indexed** ✅ — Bing has crawled and indexed this URL.

> **Note:** It can take 24–72 hours for newly submitted URLs to be indexed.

---

## Step 5: Enable IndexNow in Bing Webmaster Tools (Optional)

Bing Webmaster Tools provides a dedicated IndexNow panel:

1. In the left sidebar, click **IndexNow**.
2. Check the **History** tab to see recent submissions.
3. Use the **Submit URLs** tab to manually submit URLs if the API is unavailable.

---

## Ongoing Usage

### Check Indexing Status

```bash
# Bing Search — verify a URL is indexed
# Search in Bing: site:dcyfr.ai/blog/your-post-slug
```

Or use URL Inspection in Bing Webmaster Tools.

### Monitor Crawl Errors

- In the left sidebar, click **Crawl** → **Crawl Errors**.
- Look for 404s or 5xx errors that may indicate broken links or misconfigured routes.

### View Search Analytics

- In the left sidebar, click **Search Performance** → **Pages**.
- See which pages receive Bing search traffic, impressions, and clicks.

---

## Troubleshooting

| Symptom                   | Likely Cause                                | Fix                                  |
| ------------------------- | ------------------------------------------- | ------------------------------------ |
| Verification fails        | DNS not propagated yet                      | Wait 60 min, retry                   |
| Sitemap returns error     | Next.js sitemap route not deployed          | Check `/sitemap.xml` in production   |
| IndexNow shows no history | `INDEXNOW_API_KEY` not set in Vercel        | Add to Vercel env vars and redeploy  |
| URL not indexed after 72h | URL blocked by `robots.txt` or noindex meta | Check `robots.txt` and page metadata |

See also: [INDEXNOW_TROUBLESHOOTING.md](./INDEXNOW_TROUBLESHOOTING.md)

---

## Related Resources

- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [IndexNow documentation](https://www.indexnow.org/)
- [Bing IndexNow FAQ](https://www.bing.com/indexnow)
- [dcyfr.ai sitemap](https://www.dcyfr.ai/sitemap.xml)
