<!-- TLP:CLEAR -->

# IndexNow — Content Team Runbook

**Information Classification:** TLP:CLEAR (Public)  
**Last Updated:** 2026-02-21  
**Audience:** Content authors and editors (non-technical)  
**Scope:** When and how to trigger IndexNow for `dcyfr.ai` content

---

## What Does IndexNow Do?

When you publish or update content on `dcyfr.ai`, IndexNow pings Bing, Yandex,
and other participating search engines **immediately** — so your new page can
appear in search results within minutes instead of days.

You don't need to log into any dashboard or click anything. The system handles
it automatically when you follow the publish workflow below.

---

## When to Trigger IndexNow

| Action                               | Trigger required? | How                                         |
| ------------------------------------ | ----------------- | ------------------------------------------- |
| New blog post published              | ✅ Yes            | Automatic (via code hook)                   |
| New project added                    | ✅ Yes            | Automatic (via code hook)                   |
| Blog post title updated              | ✅ Yes            | Resubmit manually (see below)               |
| Blog post body updated               | ✅ Yes            | Resubmit manually (see below)               |
| Blog post deleted / redirected       | ❌ No             | Not needed                                  |
| Static page updated (About, Contact) | 🟡 Optional       | Use bulk endpoint if content is significant |
| Draft saved but not published        | ❌ No             | Never submit drafts                         |

---

## Automatic Triggers (No Action Needed)

When a developer merges a **new blog post** or **new project** to the
`main` branch and the site deploys, IndexNow is notified automatically.
No action is needed from content authors for new content.

---

## Manual Re-Submission (After Updates)

If you update an existing post (title, metadata, significant content changes),
ask a developer to resubmit the URL after the change is live:

```text
Hey, can you trigger an IndexNow resubmit for:
https://www.dcyfr.ai/blog/<slug>
```

A developer can submit it in 30 seconds using the dev dashboard:

1. Open `/dev/seo` in development, or ask a developer to run:

   ```bash
   curl -X POST https://www.dcyfr.ai/api/indexnow/submit \
     -H "Content-Type: application/json" \
     -d '{"urls":["https://www.dcyfr.ai/blog/<slug>"]}'
   ```

---

## Bulk Reindex (After Large Migrations)

After a site migration or bulk content update, ask a developer to run the
bulk reindex script:

```text
Please run a full IndexNow bulk reindex — all posts, projects, and static pages.
```

They will run:

```bash
ADMIN_API_KEY=<token> node scripts/reindex-all.mjs
```

This queues every URL for submission. Search engines will process within 24-48 hours.

---

## What Happens After Submission

1. IndexNow sends your URL(s) to `api.indexnow.org`.
2. Bing, Yandex, and other engines pick up the submission from the shared endpoint.
3. Crawlers fetch the page within minutes to hours.
4. The page appears in search results after crawling + evaluation (can be minutes to days,
   depending on domain authority and content freshness).

You can check Bing's progress in [Bing Webmaster Tools](https://www.bing.com/webmasters)
→ URL Inspection — search for your URL and look for **"Submitted via IndexNow"** status.

---

## Limits

- **100 URLs per minute** via the submission API (rate-limited by Inngest).
- **Single domain only** — only URLs on `dcyfr.ai` can be submitted.
- **No external URLs** — you cannot submit URLs from other domains.

---

## Getting Help

If something seems off (e.g., a post isn't appearing in Bing after 72 hours):

1. Check that the post is live: visit the URL directly in an incognito window.
2. Ask a developer to check [INDEXNOW_TROUBLESHOOTING.md](./INDEXNOW_TROUBLESHOOTING.md).
3. If still stuck, open an issue with the URL and the date it was published.
