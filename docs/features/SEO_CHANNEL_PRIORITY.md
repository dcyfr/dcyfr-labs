<!-- TLP:CLEAR -->

# SEO Channel Priority Guide

**Information Classification:** TLP:CLEAR (Public)  
**Last Updated:** 2026-02-21  
**Scope:** `dcyfr-labs` — <https://www.dcyfr.ai>

---

## Purpose

This document defines the priority order and owner for each SEO/distribution
channel, explains what is automated vs. manual, and provides guidance for
bringing new channels online.

---

## Channel Priority Matrix

| Priority | Channel             | Status          | Submission Method               | Automated?     |
| -------- | ------------------- | --------------- | ------------------------------- | -------------- |
| 1        | **Google**          | ✅ Active       | Google Indexing API             | Yes (Inngest)  |
| 2        | **Bing / IndexNow** | ✅ Active       | IndexNow protocol               | Yes (Inngest)  |
| 3        | **Yandex**          | 🟡 Passive      | IndexNow (co-submits with Bing) | Yes (passive)  |
| 4        | **YouTube**         | 🔵 Planned      | Manual + future automation      | No             |
| 5        | **Reddit**          | ⚠️ Policy-gated | Human approval only             | No (by policy) |

---

## Channel Details

### 1. Google — Primary Search Engine

**Documentation:** [`docs/features/google-indexing-api.md`](./google-indexing-api.md)

- Real-time submissions via the [Google Indexing API](https://developers.google.com/search/apis/indexing-api/v3/quickstart).
- Quota: 200 URL submissions per day (sufficient for current posting cadence).
- Triggered: Inngest event `google/url.submitted` after content publish.
- Verified ownership: Google Search Console, DNS TXT record.

**Automation status:** Fully automated. No manual action required on publish.

---

### 2. Bing — IndexNow Protocol

**Documentation:** [`docs/runbooks/BING_WEBMASTER_SETUP.md`](../runbooks/BING_WEBMASTER_SETUP.md)  
**Troubleshooting:** [`docs/runbooks/INDEXNOW_TROUBLESHOOTING.md`](../runbooks/INDEXNOW_TROUBLESHOOTING.md)

- Real-time submissions via the [IndexNow protocol](https://www.indexnow.org/).
- Bing, Yandex, and other participating engines pick up submissions from the shared IndexNow endpoint.
- Key file at `/<INDEXNOW_API_KEY>.txt` verifies domain ownership.
- Triggered: Inngest event `indexnow/url.submitted` after content publish.

**Automation status:** Fully automated. No manual action required on publish.

#### Bulk reindex (historical content)

```bash
ADMIN_API_KEY=<token> node scripts/reindex-all.mjs
```

Or via direct API call:

```bash
curl -s -X POST https://www.dcyfr.ai/api/admin/indexnow/bulk \
  -H "Authorization: Bearer $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"types":["posts","projects","static"]}'
```

---

### 3. Yandex — Passive via IndexNow

Yandex actively fetches submissions from the IndexNow shared endpoint.
**No additional configuration is required** — once Bing/IndexNow is active,
Yandex receives submissions automatically.

---

### 4. YouTube — Planned (Content Marketing)

**Status:** Planned for future content strategy.

- Audience: developers, AI practitioners, technical decision-makers.
- Content type: tutorials, live coding, architecture walkthroughs.
- Automation: Future integration to cross-post blog summaries to YouTube descriptions (no automation for video creation).
- No submission API exists for YouTube search indexing; SEO is controlled via video metadata (title, description, tags).

**Action required before launch:**

1. Create a YouTube channel under the DCYFR brand.
2. Define content format and cadence.
3. Link channel in Google Search Console for cross-platform attribution.
4. Update this document when active.

---

### 5. Reddit — Human-Approval-Required

**⚠️ Special policy: Reddit distribution requires explicit human approval.
Automated posting to Reddit is prohibited.**

See [Reddit Anti-Automation Policy](#reddit-anti-automation-policy) below.

**Current status:** Community sharing is welcome when content is genuinely
useful, but only by a human team member, never by a bot.

**Subreddits relevant to DCYFR content (for reference — human post only):**

| Subreddit         | Audience               | Content fit                          |
| ----------------- | ---------------------- | ------------------------------------ |
| r/MachineLearning | ML researchers         | Research-grade AI posts              |
| r/LocalLLaMA      | Local AI practitioners | LLM tooling, inference, local models |
| r/programming     | General developers     | Architecture, patterns, tutorials    |
| r/webdev          | Web developers         | Next.js, performance, SEO            |
| r/typescript      | TypeScript community   | TypeScript patterns, tooling         |
| r/node            | Node.js community      | Node.js patterns, tooling            |

---

## Reddit Anti-Automation Policy

### Why Reddit prohibits bots

Reddit's [User Agreement](https://www.redditinc.com/policies/user-agreement),
[API Terms of Service](https://www.reddit.com/wiki/api-terms), and
[Content Policy](https://www.redditinc.com/policies/content-policy) collectively
prohibit the following:

- **Automated account creation** — creating accounts for the purpose of
  automated actions.
- **Automated submissions** — submitting posts or comments via bots without
  community consent.
- **Karma farming / vote manipulation** — any automated or coordinated interaction
  designed to manipulate post visibility.
- **Scraping without permission** — high-volume programmatic access outside the
  approved API scope.

Violations can result in permanent account suspension and IP banning.

### DCYFR policy

All DCYFR agents and automation systems **SHALL NOT**:

- ❌ Submit posts, comments, or votes to Reddit programmatically.
- ❌ Create Reddit accounts for automated use.
- ❌ Simulate user behavior on Reddit via headless browsers or scripts.
- ❌ Include Reddit as a target in any content-distribution pipeline.

**Human approval gates** are required for every Reddit post:

1. A team member reviews the blog post and confirms it adds genuine value to the target subreddit.
2. The post is written with community-first framing (no promotional tone).
3. The team member personally submits the post from their own Reddit account.
4. No cross-posting the same link to multiple subreddits simultaneously.
5. The team member engages with comments in the thread.

### Automation-safe alternatives

If you need programmatic tracking of Reddit mentions:

- Use the [Reddit Data API](https://www.reddit.com/dev/api/) with proper
  OAuth credentials to read (not write) data.
- Monitor mentions via `u/username` feeds or pushshift archives (read-only).
- Set up Google Alerts for `site:reddit.com dcyfr.ai` as a passive monitor.

---

## Adding a New Channel

When adding a new SEO/distribution channel:

1. **Add a row to the Channel Priority Matrix** above with status "🔵 Planned".
2. **Document the API or submission method** in `docs/features/<channel>-integration.md`.
3. **Assess automation policy** — if the platform prohibits bots, add a policy section here.
4. **Create a runbook** in `docs/runbooks/<CHANNEL>_SETUP.md`.
5. **Update this table** to reflect Active status once live.

---

## Changelog

| Date       | Change                                                                               |
| ---------- | ------------------------------------------------------------------------------------ |
| 2026-02-21 | Initial document — Google ✅, IndexNow/Bing ✅, YouTube planned, Reddit policy added |
