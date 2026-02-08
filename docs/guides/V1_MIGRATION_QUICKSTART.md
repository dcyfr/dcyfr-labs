<!-- TLP:AMBER - Internal Use Only -->

# V1 Content Migration Tool - Quick Start Guide

**Information Classification:** TLP:AMBER (Limited Distribution)
**Document Type:** User Guide
**Created:** February 7, 2026
**For Use With:** [V1 Integration Plan](../../plans/V1_INTEGRATION_PLAN_2026-02-07.md)

---

## Overview

The V1 Content Migration Tool automates the migration of legacy website content to DCYFR Labs (Next.js 16), including:
- AI-powered content modernization (Claude Sonnet 4)
- Automatic MDX conversion
- SEO redirect configuration
- Analytics datapreservation

**Tool Location:** `scripts/migrate-v1-content.mjs`

---

## Prerequisites

### 1. Environment Setup

**Required Environment Variables** (`.env.local`):
```bash
# Required for AI modernization
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Custom V1 source path
V1_SOURCE_PATH=./v1-website-export

# Optional: Custom manifest path
V1_MANIFEST_PATH=./custom-manifest.json
```

**Get Anthropic API Key:**
1. Sign up at https://console.anthropic.com
2. Create API key
3. Add to `.env.local`

### 2. V1 Content Source

You need one of the following:

**Option A: Local Directory**
```
v1-export/
├── posts/
│   ├── post-001.html
│   ├── post-002.md
│   └── post-003.html
└── assets/
    └── images/
```

**Option B: Git Repository**
```bash
git clone https://github.com/yourusername/old-website.git v1-export
```

**Option C: WordPress Export**
```bash
# Export from WordPress admin panel
# Tools → Export → Download XML file
# Convert XML to directory structure
```

**Option D: Manual Archive**
- Save HTML pages from wayback machine
- Organize into directory structure
- Extract content manually

---

## Quick Start

### Step 1: Create Migration Manifest

**Auto-generate template:**
``` bash
npm run migrate:v1
```

This creates `v1-migration-manifest.json` with an example structure.

**Edit the manifest:**
```json
{
  "version": "1.0.0",
  "source": {
    "type": "jekyll",
    "url": "https://github.com/yourusername/old-blog",
    "exportDate": "2026-02-07"
  },
  "posts": [
    {
      "id": "security-best-practices",
      "title": "Security Best Practices for Node.js",
      "slug": "nodejs-security-best-practices",
      "v1Url": "/2020/03/nodejs-security",
      "v2Url": "/blog/nodejs-security-best-practices",
      "priority": "P0",
      "date": "2020-03-15",
      "views": 1250,
      "contentPath": "./v1-export/posts/nodejs-security.md",
      "status": "pending",
      "notes": "High-traffic post, update to Node 24.x"
    },
    {
      "id": "docker-basics",
      "title": "Docker for Beginners",
      "slug": "docker-for-beginners",
      "v1Url": "/2019/11/docker-intro",
      "v2Url": "/blog/docker-for-beginners",
      "priority": "P1",
      "date": "2019-11-20",
      "views": 780,
      "contentPath": "./v1-export/posts/docker-intro.html",
      "status": "pending",
      "notes": "Good intro, needs Docker Compose examples"
    }
  ],
  "analytics": {
    "totalPosts": 2,
    "highPriority": 1
  }
}
```

### Step 2: Test with Dry Run

```bash
# Preview migration without making changes
npm run migrate:v1:dry-run
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════╗
║      DCYFR V1 Website Content Migration Tool          ║
╚════════════════════════════════════════════════════════╝

✅ Loaded V1 manifest: 2 posts

🚀 Starting migration: 2 posts
   Mode: DRY RUN

📄 Migrating: Security Best Practices for Node.js
   V1 URL: /2020/03/nodejs-security
   Priority: P0
🤖 Processing with Claude AI...
   [DRY RUN] Would create: src/content/blog/nodejs-security-best-practices/index.mdx
   [DRY RUN] Would add redirect: /2020/03/nodejs-security → /blog/nodejs-security-best-practices
   ✅ Migrated successfully
   V2 URL: /blog/nodejs-security-best-practices
```

### Step 3: Migrate Specific Priority

```bash
# Migrate P0 (high-priority) content first
npm run migrate:v1:p0

# Then P1
npm run migrate:v1 -- --priority=P1

# Then P2
npm run migrate:v1 -- --priority=P2
```

### Step 4: Full Migration

```bash
# Migrate all content (after testing)
npm run migrate:v1
```

**Confirmation Prompt:**
```
? Migrate 2 posts from V1 to V2? › (y/N)
```

---

## Command Reference

| Command | Description |
|---------|-------------|
| `npm run migrate:v1` | Interactive migration (with confirmation) |
| `npm run migrate:v1:dry-run` | Preview migration without changes |
| `npm run migrate:v1:p0` | Migrate P0 (high-priority) content only |
| `npm run migrate:v1:verbose` | Detailed logging |
| `npm run migrate:v1 -- --priority=P1` | Migrate specific priority |

**Custom Options:**
```bash
# Custom source path
V1_SOURCE_PATH=./custom-export npm run migrate:v1

# Custom manifest
V1_MANIFEST_PATH=./custom.json npm run migrate:v1

# Combine options
npm run migrate:v1 -- --priority=P0 --verbose --dry-run
```

---

## Migration Workflow

### What the Tool Does

1. **Loads Manifest** - Reads `v1-migration-manifest.json`
2. **Filters by Priority** - If specified (e.g., `--priority=P0`)
3. **For Each Post:**
   - Reads V1 content from `contentPath`
   - Sends to Claude AI for modernization
   - Converts to Next.js MDX format
   - Saves to `src/content/blog/[slug]/index.mdx`
   - Adds 301 redirect to `v1-redirects.json`
   - Updates manifest status
4. **Generates Summary** - Reports success/failure counts

### Post-Migration Checklist

After running the migration:

- [ ] **Review Migrated Content**
  ```bash
  ls -la src/content/blog/
  # Check generated MDX files
  ```

- [ ] **Test Build**
  ```bash
  npm run build
  ```

- [ ] **Review Redirects**
  ```bash
  cat v1-redirects.json
  # Verify all V1 URLs mapped correctly
  ```

- [ ] **Add Redirects to Next.js Config**
  ```typescript
  // next.config.ts
  import v1Redirects from './v1-redirects.json';

  const nextConfig = {
    async redirects() {
      return [
        ...v1Redirects,
        // ... other redirects
      ];
    },
  };
  ```

- [ ] **Test Redirects Locally**
  ```bash
  npm run dev
  # Visit old URLs: http://localhost:3000/2020/03/nodejs-security
  # Should redirect to: /blog/nodejs-security-best-practices
  ```

- [ ] **Validate Frontmatter**
  ```bash
  npm run validate:frontmatter
  ```

- [ ] **Check Design Token Compliance**
  ```bash
  npm run validate:design-tokens
  ```

- [ ] **Commit Changes**
  ```bash
  git add src/content/blog/
  git add v1-redirects.json
  git add v1-migration-manifest.json
  git commit -m "feat: migrate V1 content (P0 posts)"
  ```

---

## Troubleshooting

### Issue: "ANTHROPIC_API_KEY not set"

**Solution:**
```bash
# Add to .env.local
echo 'ANTHROPIC_API_KEY=your_key_here' >> .env.local

# Or skip AI modernization (manual review needed)
npm run migrate:v1:dry-run
# Edit content manually after migration
```

### Issue: "Content file not found"

**Error:**
```
❌ Content file not found: ./v1-export/posts/missing-post.md
```

**Solution:**
- Verify `contentPath` in manifest matches actual file location
- Check file exists:
  ```bash
  ls -la v1-export/posts/
  ```
- Fix path in manifest and re-run

### Issue: AI Modernization Failed

**Error:**
```
❌ AI modernization failed: Rate limit exceeded
```

**Solution:**
- Wait for rate limit reset (check Anthropic dashboard)
- Or process in smaller batches:
  ```bash
  # Process 5 posts at a time
  npm run migrate:v1 -- --priority=P0 # (first 5)
  # Edit manifest to mark completed posts
  # Then run again for next batch
  ```

### Issue: Slug Collision

**Error:**
```
Error: EEXIST: file already exists, mkdir 'src/content/blog/docker-intro'
```

**Solution:**
- Choose different slug in manifest:
  ```json
  {
    "slug": "docker-introduction-v2",
    ...
  }
  ```

---

## Advanced Usage

### Custom AI Prompts

Edit `scripts/migrate-v1-content.mjs`:

```javascript
const prompt = `Custom modernization instructions...

**Original Content:**
${v1Content}

**Output with:**
- Specific technical focus
- Custom formatting requirements
- Domain-specific enhancements
`;
```

### Batch Processing

**Split large migrations:**

1. Create separate manifests:
   - `v1-manifest-p0.json` (10 posts)
   - `v1-manifest-p1.json` (20 posts)
   - `v1-manifest-p2.json` (30 posts)

2. Process sequentially:
   ```bash
   V1_MANIFEST_PATH=./v1-manifest-p0.json npm run migrate:v1
   V1_MANIFEST_PATH=./v1-manifest-p1.json npm run migrate:v1
   V1_MANIFEST_PATH=./v1-manifest-p2.json npm run migrate:v1
   ```

### Custom Post Processing

**After migration, enhance specific posts:**

```bash
# Migrate base content
npm run migrate:v1:p0

# Manually enhance specific posts
code src/content/blog/nodejs-security-best-practices/index.mdx

# Add:
# - Custom diagrams
# - Interactive demos
# - Updated code examples
```

---

## See Also

- [V1 Integration Plan](../../plans/V1_INTEGRATION_PLAN_2026-02-07.md) - Full migration strategy
- [Frontmatter Validation Guide](../../blog/frontmatter-reference.md)
- [Design Token Compliance](../../architecture/design-tokens.md)
- [Redirect Configuration](../../architecture/redirects.md)

---

**Last Updated:** February 7, 2026
**Maintained By:** DCYFR Workspace Agent
**Support:** If you encounter issues, consult the V1 Integration Plan or create a GitHub issue
