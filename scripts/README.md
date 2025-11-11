# Scripts Directory

This directory contains utility scripts for development, testing, and maintenance tasks.

## Active Scripts

### Development Utilities

#### sync-agents.mjs
Syncs `.github/copilot-instructions.md` to `agents.md` in the root directory.

```bash
npm run sync:agents
# or directly:
node scripts/sync-agents.mjs
```

#### run-with-dev.mjs
Helper script for running Next.js dev server with special configurations.

```bash
node scripts/run-with-dev.mjs
```

### Testing & Validation

#### test-feeds.mjs
Tests RSS and Atom feed generation.

```bash
npm run test:feeds
# or directly:
node scripts/test-feeds.mjs
```

#### test-featured-images.mjs
Tests blog post featured image configuration and loading.

```bash
npm run test:featured-images
# or directly:
node scripts/test-featured-images.mjs
```

#### test-related-posts.mjs
Tests the related posts algorithm.

```bash
npm run test:related-posts
# or directly:
node scripts/test-related-posts.mjs
```

#### test-toc.mjs
Tests table of contents generation for blog posts.

```bash
npm run test:toc
# or directly:
node scripts/test-toc.mjs
```

#### test-rate-limit.mjs
Tests API rate limiting functionality.

```bash
npm run test:rate-limit
# or directly:
node scripts/test-rate-limit.mjs
```

#### test-tracking.mjs
Tests view and share tracking with Redis integration.

```bash
npm run test:tracking
# or directly (requires dev server):
node scripts/run-with-dev.mjs scripts/test-tracking.mjs
```

#### test-csp-report.mjs
Tests Content Security Policy reporting.

```bash
npm run test:csp-report
# or directly:
node scripts/test-csp-report.mjs
```

#### test-mcp-servers.mjs
Tests Model Context Protocol (MCP) server configuration.

```bash
npm run test:mcp-servers
# or directly:
node scripts/test-mcp-servers.mjs
```

#### test-dev-pages.mjs
Tests development-only pages.

```bash
npm run test:dev-pages
# or directly:
node scripts/test-dev-pages.mjs
```

#### test-dev-pages-static.mjs
Tests static generation of development pages.

```bash
npm run test:dev-pages-static
# or directly:
node scripts/test-dev-pages-static.mjs
```

#### test-print.mjs
Tests print stylesheet functionality.

```bash
node scripts/test-print.mjs
```

#### test-streak-calculation.mjs
Tests GitHub contribution streak calculation.

```bash
node scripts/test-streak-calculation.mjs
```

### Monitoring & Validation

#### check-headers.mjs
Validates HTTP security headers.

```bash
node scripts/check-headers.mjs
```

#### check-heatmap-display.mjs
Validates GitHub heatmap display and functionality.

```bash
npm run test:heatmap
# or directly:
node scripts/check-heatmap-display.mjs
```

#### check-siteurl.js
Validates site URL configuration.

```bash
npm run test:siteurl
# or directly:
node scripts/check-siteurl.js
```

#### validate-metrics.mjs
Validates analytics metrics and data integrity.

```bash
npm run test:metrics
# or directly:
node scripts/validate-metrics.mjs
```

## Archived Scripts

One-time debug and migration scripts are in `scripts/archive/`. See `scripts/archive/README.md` for details.

## Adding New Scripts

When adding new scripts:
1. Use `.mjs` extension for ES modules
2. Add shebang line: `#!/usr/bin/env node`
3. Include descriptive comment header
4. Update this README with script description and usage
5. Consider adding an npm script alias in `package.json` if frequently used
