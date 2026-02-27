<!-- TLP:GREEN - Internal + Community -->
# Automated Repository Showcase

**Information Classification:** TLP:GREEN (Organization + Trusted Contributors)  
**Last Updated:** 2026-03

The Automated Repository Showcase pulls GitHub repository data at **build time** and
merges it with the hand-crafted static projects in `src/data/projects.ts`.  The result is
a unified `/work` page that stays in sync with real DCYFR repos without manual effort.

---

## How It Works

```
GitHub REST API
    ↓  fetchOrgRepos()         (src/lib/github/fetch-repos.ts)
    ↓  fetchRepoReadme()       (src/lib/github/fetch-readme.ts)
    ↓  parseReadmeMetadata()   (src/lib/markdown/parse-readme-metadata.ts)
    ↓  repoToProject()         (src/lib/projects/repo-to-project.ts)
    ↓  mergeProjects()         (src/lib/projects/merge-projects.ts)
    ↓
/work page (src/app/work/page.tsx)
```

### Which repos appear?

A repository is included when **any** of these conditions is true:

1. Its README contains `workShowcase: true` in the YAML frontmatter (`---` block).
2. Its name is listed in `REPO_INCLUDE_LIST` in `src/config/repos-config.ts`.

Repos are **excluded** when:

- Listed in `REPO_EXCLUDE_LIST` (e.g. `dcyfr-labs`, `.github`, `dcyfr-workspace`).
- Forked or private **and** not in `REPO_INCLUDE_LIST`.

---

## README Frontmatter Convention

Add a YAML block at the very top of your `README.md` to control how the repo
appears on the `/work` page.  All fields are optional — sensible defaults
apply when they are absent.

```yaml
---
workShowcase: true          # Required to opt-in (or add to REPO_INCLUDE_LIST)

# Display
title: "My Project"         # Overrides the repo name. Defaults to repo.name.
description: "Short blurb." # 1-2 sentences. Falls back to repo.description or
                             # the first paragraph of the README body.

# Categorisation
category: code              # "code" | "ai" | "ux" | "data" | "infra"
status: active              # "active" | "in-progress" | "archived" | "idea"
featured: false             # Pinned to top of listing when true.
timeline: "2025 – present"  # Free-form date range shown in project detail.

# Technology & tags
tech:
  - TypeScript
  - Next.js
  - PostgreSQL
tags:
  - ai
  - open-source

# Key capabilities / selling points
highlights:
  - "Zero-config TypeScript setup"
  - "Automatic OpenSpec change tracking"

# External links (GitHub link auto-populated)
demo: "https://example.com"
docs: "https://docs.example.com"
---

<!-- Regular README content starts here -->
# My Project
...
```

### Field reference

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `workShowcase` | `boolean` | — | Must be `true` to opt-in |
| `title` | `string` | `repo.name` | Human-readable display name |
| `description` | `string` | `repo.description` or first paragraph | Shown in cards & detail page |
| `category` | enum | `"code"` | Controls which tab the project appears in |
| `status` | enum | `"active"` | Shown as a badge |
| `featured` | `boolean` | `false` | Pinned first in sorted order |
| `timeline` | `string` | `repo.pushedAt year` | Display-only |
| `tech` | `string[]` | `repo.topics` | Technology tags (chip list) |
| `tags` | `string[]` | `repo.topics` | Filtering tags |
| `highlights` | `string[]` | Parsed from `## Features` / `## Highlights` section | Bullet list on detail page |
| `demo` | `string` | — | Link shown as "Live Demo" |
| `docs` | `string` | — | Link shown as "Documentation" |

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GITHUB_TOKEN` | No | — | Personal Access Token with `public_repo` scope. Raises API rate limit from 60 → 5000 requests/hour. Without it the showcase still works on the unauthenticated limit. |
| `ENABLE_AUTOMATED_REPOS` | No | `"true"` | Set to `"false"` to disable the feature entirely and use only the static `projects.ts` data. Useful for fast local dev or CI environments that must not call the GitHub API. |

Add to `.env.local`:

```bash
# GitHub API (optional — raises rate limit from 60 to 5000 req/hour)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Feature toggle (default: enabled)
# ENABLE_AUTOMATED_REPOS=false
```

---

## Configuration (`src/config/repos-config.ts`)

| Export | Type | Description |
|--------|------|-------------|
| `GITHUB_ORG` | `string` | The GitHub org/user to query. Default: `"dcyfr"`. |
| `REPO_INCLUDE_LIST` | `string[]` | Repo names forced-included regardless of frontmatter. |
| `REPO_EXCLUDE_LIST` | `string[]` | Repo names never shown. |
| `REPO_DEFAULTS.category` | `ProjectCategory` | Category when not set in frontmatter. Default: `"code"`. |
| `REPO_DEFAULTS.status` | `ProjectStatus` | Status when not set in frontmatter. Default: `"active"`. |
| `REPO_DEFAULTS.maxHeuristicsLines` | `number` | Max README lines to scan for heuristic extraction. Default: `50`. |
| `CACHE_CONFIG.cacheDir` | `string` | Cache directory (relative to project root). Default: `".cache/github-repos"`. |
| `CACHE_CONFIG.ttlMs` | `number` | Cache TTL in milliseconds. Default: `4 * 60 * 60 * 1000` (4 hours). |
| `GITHUB_API_CONFIG.perPage` | `number` | Max repos per API request (GitHub max: 100). |
| `GITHUB_API_CONFIG.timeoutMs` | `number` | HTTP request timeout. Default: `10000`. |

---

## Caching

Fetched repo and README data is written to `.cache/github-repos/` (gitignored).
On subsequent builds the cache is read from disk if it is within the TTL (4 hours).

### Clearing the Cache

```bash
# From dcyfr-labs/
npm run clear-cache:repos
```

This removes `.cache/github-repos/` so the next build fetches fresh data from the API.

---

## Graceful Degradation

If the GitHub API is unavailable (network error, rate limit exhausted, token missing):

1. The cache is checked first — stale-but-present data is used.
2. If no cache exists, `getAutomatedProjects()` returns an empty array.
3. The `/work` page renders with only the static projects — **no build failure**.
4. A console warning is logged so CI can flag the situation.

---

## Example: Minimal Frontmatter

The simplest opt-in, relying on heuristics for metadata:

```yaml
---
workShowcase: true
---
```

The parser will extract:
- `description` from the first non-heading paragraph
- `tech` from `repo.topics`
- `highlights` from a `## Features` or `## Highlights` section (up to the first 50 lines)
- `timeline` from `repo.pushedAt`

---

## Example: Full Frontmatter

```yaml
---
workShowcase: true
title: "DCYFR AI Framework"
description: "Open-source AI agent orchestration framework with delegation, reputation, and context engineering."
category: ai
status: active
featured: true
timeline: "2025 – present"
tech:
  - TypeScript
  - Node.js
  - Vercel AI SDK
tags:
  - ai
  - open-source
  - agents
highlights:
  - "Delegation framework with 8-layer security middleware"
  - "22 workspace agents with capability manifests"
  - "OpenSpec artifact workflow for all changes"
demo: "https://www.dcyfr.ai/work/dcyfr-ai"
docs: "https://www.dcyfr.ai/docs"
---
```

---

## Adding a New Repo to the Showcase

1. Add the YAML frontmatter block (shown above) to the top of the repo's `README.md`.
2. Optionally add the repo name to `REPO_INCLUDE_LIST` in `repos-config.ts` to force-include
   it without requiring `workShowcase: true`.
3. Clear the cache locally (`npm run clear-cache:repos`) and run `npm run dev` to preview.
4. Commit the README change to the source repo.
5. On the next dcyfr-labs build (Vercel), the repo will appear on `/work`.

---

## Related Files

| File | Purpose |
|------|---------|
| [`src/config/repos-config.ts`](../../src/config/repos-config.ts) | Master configuration |
| [`src/lib/github/`](../../src/lib/github/) | GitHub API fetch + cache utilities |
| [`src/lib/markdown/`](../../src/lib/markdown/) | README metadata parser |
| [`src/lib/projects/`](../../src/lib/projects/) | Transformation + merge logic |
| [`src/data/projects.ts`](../../src/data/projects.ts) | `getAutomatedProjects()` orchestration |
| [`src/app/work/page.tsx`](../../src/app/work/page.tsx) | Consumes merged project list |
| [`src/__tests__/lib/`](../../src/__tests__/lib/) | Unit tests (91 tests) |
