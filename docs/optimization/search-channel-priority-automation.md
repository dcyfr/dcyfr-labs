<!-- TLP:CLEAR -->

# Search Channel Priority and Automation Strategy

## Summary

This guide defines DCYFR's search-channel SEO priority model and automation policy for feature planning and implementation.

- Google and Bing are the current automation baseline.
- YouTube is the next expansion target for dual-surface visibility (YouTube + Google).
- Reddit is a high-trust discovery channel but requires strict anti-automation controls.

## Priority Matrix (Current)

| Channel | Priority | Current State | Why It Matters | Automation Approach |
| --- | --- | --- | --- | --- |
| Google Search | P0 | Implemented | Dominant U.S. search channel; first-page visibility drives most traffic | Continue indexing automation and technical SEO hygiene |
| Bing Search (IndexNow) | P0 | Implemented | Strong secondary reach; Microsoft ecosystem and AI search surfaces | Continue IndexNow event-driven submission pipeline |
| YouTube Search | P1 | Planned | Large video search demand and dual ranking opportunity with Google | Add content/metadata workflow automation and publish checklists |
| Reddit Discovery | P1 | Planned (restricted) | High trust and weekly usage; strong community-driven visibility | Human-in-the-loop only; no engagement manipulation |

## Market Context Used for Prioritization

- Google remains the primary U.S. search engine and should anchor SEO execution.
- Bing remains the second priority and benefits from existing IndexNow support.
- YouTube is a major search behavior surface and should be treated as a parallel SEO channel for video-first topics.
- Reddit is increasingly used as a trusted search/discovery surface and should be optimized through community-native participation.

## Channel Execution Policy

### P0 Channels (Google + Bing)

1. Keep current Google and Bing indexing updates active in publish/update flows.
2. Preserve Validate → Queue → Respond behavior for submission APIs.
3. Track submission health and indexing lag in monthly SEO ops review.

### P1 Channel: YouTube

Implement automation that assists content quality and discoverability without fake engagement tactics:

- Auto-generate draft metadata packs per video:
  - title variants
  - description template blocks
  - keyword/tag candidates
  - chapter/timestamp scaffolds
- Add publishing checklist automation:
  - schema alignment between blog post and video page
  - thumbnail accessibility checks
  - transcript and caption completeness checks
- Link strategy automation:
  - canonical cross-links between related post and video
  - structured references in `VideoObject` JSON-LD where applicable

### P1 Channel: Reddit (Special Treatment)

Reddit optimization must be community-native and policy-safe.

Allowed automation support:

- Internal topic-to-subreddit mapping suggestions
- Draft post-outline assistance (human review required)
- UTM/link tracking generation for approved campaigns
- Comment/reply queueing for human operators (no auto-send)

Prohibited automation:

- Auto-posting to subreddits without human approval
- Auto-commenting or bot-based engagement
- Vote manipulation, coordinated brigading, or synthetic account behavior
- Mass DM/outreach automation

Required controls:

1. Human approval before every Reddit post/comment.
2. Rate limits and per-community posting cadence caps.
3. Subreddit rule validation checklist before publication.
4. Transparent disclosure where policy or context requires it.

## Feature and Automation Backlog Alignment

### Completed

- [x] Google indexing workflow integrated into SEO operations.
- [x] Bing indexing workflow integrated via IndexNow.

### Next

- [ ] YouTube SEO automation pack for video metadata and cross-linking.
- [ ] Reddit community workflow with policy enforcement and human approval gates.

## Implementation Notes

- Treat Reddit as a trust channel, not a volume channel.
- Prioritize sustainable reputation and contribution quality over posting frequency.
- Keep all automation auditable with clear ownership for each publication action.

## Related Documentation

- [Inngest Integration](../features/inngest-integration.md)
- [JSON-LD Implementation](./json-ld-implementation.md)
- [Tag Analytics (Consolidated)](./tag-analytics-consolidated.md)
