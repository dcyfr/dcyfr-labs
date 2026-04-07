<!-- TLP:CLEAR -->

# Reddit Policy-Safe Workflow — Implementation Guide

**Information Classification:** TLP:AMBER (Internal Distribution)
**Last Updated:** 2026-02-21
**Scope:** `dcyfr-labs` — Reddit community channel lane
**Parent Strategy:** [search-channel-priority-automation.md](./search-channel-priority-automation.md)

> **⚠️ Critical:** Reddit automation is AMBER-classified because an incorrect
> implementation carries significant reputational and policy risk. Every action
> in this workflow MUST be human-approved before external publication.

---

## Purpose

This guide defines the implementation contract for the Reddit policy-safe lane
(Channel Priority P1, restricted). It covers subreddit recommendation support,
draft assistance, the mandatory human approval gate, subreddit rule validation
checks, and rate/cadence limits.

Reddit is treated as a **trust channel** — not a volume channel. Community
trust and authentic participation are the primary assets. Any automation that
could compromise that trust is prohibited.

---

## 3.1 Subreddit Recommendation Support

The system provides **internal suggestions only**. No subreddit targeting data
is ever sent externally without explicit human review.

### Recommendation Inputs

| Signal                      | Source                | Usage                                           |
| --------------------------- | --------------------- | ----------------------------------------------- |
| Post tags / topics          | Blog post frontmatter | Match to community interest areas               |
| Historical successful posts | Internal audit log    | Bias suggestions to known receptive communities |
| Subreddit subscriber count  | Cached, not real-time | Avoid very small or very large generic subs     |
| Community tone analysis     | Manual internal notes | Inform description style recommendations        |

### Recommendation Output Format

```json
{
  "suggestions": [
    {
      "subreddit": "r/MachineLearning",
      "reasoning": "Post covers LLM architecture — high relevance to community focus.",
      "confidence": "high",
      "cautions": ["Rule 4 requires academic framing — avoid marketing language"]
    }
  ],
  "human_review_required": true
}
```

### Constraints

- Maximum **3 subreddit suggestions** per piece of content.
- All suggestions include explicit `cautions` notes from community rule scanning.
- Final subreddit selection is always made by a human.

---

## 3.2 Draft Post / Comment Assistance Workflow

The system can assist drafting Reddit posts and comments. It cannot send them.

### Workflow Steps

```text
Content published
      ↓
[Automation] Generate draft Reddit post outline
      ↓
Draft saved to CMS drafts queue (status: reddit_draft)
      ↓
[Human] Review draft in CMS
      ↓
[Human] Edit, approve, or discard
      ↓
[Human] Copy to Reddit manually OR use one-click post connector
      ↓
Publish confirmation logged to channel audit trail
```

### Draft Output Fields

| Field             | Description                    | Auto-generated?                  |
| ----------------- | ------------------------------ | -------------------------------- |
| `title`           | Reddit post title (≤300 chars) | Yes (draft)                      |
| `body`            | Post body text                 | Yes (draft)                      |
| `subreddit`       | Target subreddit               | Suggested, human confirms        |
| `link_flair_text` | Flair selection                | Suggested from community options |
| `utm_source`      | UTM tracking param             | Yes (`utm_source=reddit`)        |
| `scheduled_at`    | Proposed posting time          | Yes (human must confirm)         |
| `approval_status` | Draft workflow state           | Set by human reviewer            |

### Draft States

```text
reddit_draft → approved → published (human action)
                       ↘
                  discarded
```

---

## 3.3 Mandatory Human Approval Gate

**Every Reddit post and comment must be approved by a human before publication.**
This is a hard requirement, not a configuration option.

### Gate Implementation Requirements

- [ ] CMS drafts queue must have a dedicated **Reddit queue view**.
- [ ] Drafts with `approval_status = reddit_draft` are not actionable by any
      automated system.
- [ ] Approval action is a human-initiated mutation (button press or explicit API
      call with a user session token).
- [ ] Once approved, a `reddit_workflow.human_approved` event is logged with: - `actor_id` (user ID of approving human) - `timestamp` - `subreddit` - `post_title`
- [ ] Automated approval bypass is architecturally prevented — no service account
      may set `approval_status = approved`.

### Approval Interface Requirements

The reviewer interface MUST display:

1. Full draft post/comment text
2. Selected subreddit + link to subreddit rules page
3. Subreddit rule checklist (from §3.4) with pass/fail status
4. Date of most recent DCYFR post to the same subreddit (cadence check from §3.5)
5. Clear "Approve" and "Discard" actions (no auto-approve timer)

---

## 3.4 Subreddit-Rule Checklist Requirements

Before publication, the following checklist must be reviewed for every target
subreddit. Failing any **hard** item blocks the approval action in the interface.

### Universal Checks (apply to all subreddits)

| Check                           | Type     | Pass Condition                                |
| ------------------------------- | -------- | --------------------------------------------- |
| No self-promotion without value | Hard     | Post provides genuine value beyond link       |
| No spam framing                 | Hard     | Title is not click-bait or misleading         |
| No cross-post duplication       | Hard     | Same content not posted across 3+ subs in 24h |
| Marketing language stripped     | Hard     | Post does not read as an ad or pitch          |
| Link available in context       | Advisory | URL is provided where rules allow links       |

### Subreddit-Specific Checks

Each subreddit added to the approved-community list must have a corresponding
rule entry in `config/reddit-community-rules.json`:

```json
{
  "r/MachineLearning": {
    "requires_academic_framing": true,
    "link_policy": "text_post_only",
    "flair_required": true,
    "flair_options": ["Research", "Discussion", "News"],
    "min_post_age_days": 0,
    "notes": "Rule 10: No low-effort posts. Requires substantial technical content."
  }
}
```

The CMS approval interface renders these checks dynamically per subreddit.

---

## 3.5 Per-Community Cadence / Rate Limit Policy

### Default Rate Limits

| Period   | Max Posts (per subreddit) | Override Allowed?     |
| -------- | ------------------------- | --------------------- |
| 24 hours | 1                         | No                    |
| 7 days   | 2                         | With manager approval |
| 30 days  | 5                         | With manager approval |

These defaults apply to all subreddits unless a subreddit-specific override is
configured in `config/reddit-community-rules.json`.

### Cadence Enforcement

- [ ] CMS approval interface displays last 3 posts to the target subreddit with
      timestamps.
- [ ] If the 24h limit is reached, the "Approve" button is disabled with a
      clear message: _"Rate limit: 1 post per 24h to this subreddit. Next
      window opens at [time]."_
- [ ] 7-day override requires a second human approval from a manager-role account.
- [ ] All rate limit events (blocked, override approved) are logged to the
      channel audit trail.

### Why These Limits Exist

Reddit anti-spam algorithms shadow-ban accounts that post too frequently to the
same subreddits. Rate limits protect DCYFR's account standing and community
reputation. Exceeding limits — even with quality content — risks permanent
account action.

---

## Prohibited Automation Actions

**Hard failures — must be architecturally impossible, not just policy-prohibited.**

| Action                                        | Why Prohibited                                    |
| --------------------------------------------- | ------------------------------------------------- |
| Auto-post to Reddit without human approval    | Violates Reddit API ToS + community trust         |
| Auto-comment or auto-reply send               | Violates Reddit API ToS; destroys community trust |
| Vote manipulation (upvote/downvote bots)      | Reddit ToS violation; account ban risk            |
| Coordinated brigading or bulk account actions | ToS violation; possible legal exposure            |
| Mass DM / inbox automation                    | ToS violation; spam flagging risk                 |
| Synthetic account creation or management      | ToS violation; legal risk                         |
| Cross-post to 3+ subreddits in 24h            | Reddit spam classification risk                   |

**These are not configurable. No service, script, or agent may perform these
actions on behalf of DCYFR.**

---

## Roll-Out Order

Reddit lane implementation is **Phase 3** of the overall channel priority roadmap:

1. ✅ Phase 1: Google + Bing baseline (complete)
2. 🔄 Phase 2: YouTube automation lane (parallel)
3. ⏳ Phase 3: Reddit policy-safe lane (this doc)

Implement YouTube first. Reddit implementation should not begin until the YouTube
lane is live and stable.

---

## Related Documentation

- [SEO Channel Priority Matrix](../features/SEO_CHANNEL_PRIORITY.md)
- [Search Channel Priority and Automation Strategy](./search-channel-priority-automation.md)
- [YouTube SEO Automation Guide](./youtube-seo-automation-guide.md)
- [Channel Automation Monitoring](./channel-automation-monitoring.md)
