# Legacy Test Scripts Archive

**Archived:** November 14, 2025

These scripts were one-off development tests used to verify specific features during development. They have been superseded by proper testing infrastructure:

- **Vitest** for unit and integration tests (`src/__tests__/`, `tests/`)
- **Playwright** for E2E tests (`e2e/`)
- **Lighthouse CI** for performance and accessibility validation

## Archived Scripts

### API & Security Tests
- `test-rate-limit.mjs` - Manual rate limit testing (replaced by Vitest integration tests)
- `test-csp-report.mjs` - CSP violation reporting test (replaced by E2E tests)

### Component Tests
- `test-mcp-servers.mjs` - MCP servers page validation
- `test-toc.mjs` - Table of contents functionality
- `test-related-posts.mjs` - Related posts algorithm
- `test-tracking.mjs` - Analytics tracking verification
- `check-heatmap-display.mjs` - GitHub heatmap display check

### Data & Calculations
- `test-streak-calculation.mjs` - GitHub streak calculation validation
- `validate-metrics.mjs` - Analytics metrics validation

### Content & Feeds
- `test-featured-images.mjs` - Featured image validation
- `test-feeds.mjs` - RSS/Atom feed testing
- `test-feed-enhancements.mjs` - Feed enhancement validation
- `test-print.mjs` - Print stylesheet testing

### Page Tests
- `test-dev-pages.mjs` - Developer page rendering
- `test-dev-pages-static.mjs` - Static page validation
- `check-siteurl.js` - Site URL configuration check

## Migration to Proper Tests

These ad-hoc scripts served their purpose during feature development but should not be maintained long-term. Key functionality has been or should be migrated to:

1. **Unit tests** (`src/__tests__/`) for pure functions and utilities
2. **Integration tests** (`tests/integration/`) for API routes and data flows
3. **E2E tests** (`e2e/`) for user-facing features and page interactions
4. **Lighthouse CI** for automated performance and accessibility validation

## If You Need These Scripts

These scripts are preserved in archive for reference but are no longer maintained. If you need to verify specific functionality:

1. Check if an equivalent test exists in `src/__tests__/`, `tests/`, or `e2e/`
2. If not, write a proper test rather than resurrecting these scripts
3. Use `npm run test` (Vitest) or `npm run test:e2e` (Playwright) for validation

## Related Documentation

- `/docs/testing/` - Testing infrastructure and best practices
- `/docs/performance/lighthouse-ci.md` - Lighthouse CI setup and usage
- `/docs/accessibility/` - Accessibility testing guides
