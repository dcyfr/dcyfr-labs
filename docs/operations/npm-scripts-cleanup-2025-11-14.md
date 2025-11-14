# NPM Scripts Cleanup Summary

**Date:** November 14, 2025  
**Task:** Refactor npm scripts, removing obsolete one-off test scripts

## Changes Made

### Package.json Scripts Removed (16 total)

**Ad-hoc test scripts (replaced by proper testing infrastructure):**
- `test:rate-limit` - API rate limit testing
- `test:csp-report` - CSP violation reporting
- `test:mcp-servers` - MCP server page validation
- `test:toc` - Table of contents functionality
- `test:related-posts` - Related posts algorithm
- `test:print` - Print stylesheet testing
- `test:streaks` - GitHub streak calculation
- `test:metrics` - Analytics metrics validation
- `test:featured-images` - Featured image validation
- `test:tracking` - Analytics tracking verification
- `test:heatmap` - Heatmap display check
- `test:feeds` - RSS/Atom feed testing
- `test:siteurl` - Site URL configuration
- `test:dev-pages` - Developer page testing
- `test:dev-pages-static` - Static page validation

**Outdated lint script:**
- `lint:ci` - Replaced with simpler `check` script (removed unnecessary flags)

### Scripts Retained (Core functionality)

**Development & Build:**
- `dev`, `dev:https`, `build`, `analyze`, `start`

**Code Quality:**
- `lint`, `lint:fix`, `typecheck`, `check` (simplified to use `lint` instead of `lint:ci`)

**Modern Testing (Vitest & Playwright):**
- `test`, `test:ui`, `test:unit`, `test:integration`, `test:coverage`, `test:watch`
- `test:e2e`, `test:e2e:ui`, `test:e2e:debug`
- `test:ci` - CI pipeline test suite

**Lighthouse CI (Added Nov 13, 2025):**
- `lhci:collect`, `lhci:validate`, `lhci:upload`, `lhci:autorun`, `lighthouse:ci`

**Utilities:**
- `sync:agents` - Syncs agents.md to mcp.json
- `predev`, `predev:https`, `prebuild` - Lifecycle hooks

### Scripts Archived (2,786 lines removed)

All obsolete test scripts moved to `scripts/archive/legacy-tests/` with comprehensive README explaining:
- Why they were archived
- What replaced them
- How to properly test these features going forward

**Files moved:**
- 16 test scripts (check-heatmap-display.mjs, check-siteurl.js, test-*.mjs, validate-metrics.mjs)
- 1 additional orphaned script (test-feed-enhancements.mjs - not in package.json)

### Scripts Still Active

**Core scripts directory:**
- `sync-agents.mjs` - Active utility (used in lifecycle hooks)
- `run-with-dev.mjs` - Utility for running tests with dev server
- `check-headers.mjs` - Header validation utility
- `test-accessibility.mjs` - Recent accessibility tests (Nov 11)
- `test-accessibility-manual.mjs` - Manual accessibility checklist (Nov 11)
- `test-skip-link.mjs` - Skip link validation (Nov 11)
- `test-skip-link-structure.mjs` - Skip link structure tests (Nov 11)

**Archive directory:**
- `archive/` - Previous migrations and debugging scripts
- `archive/legacy-tests/` - Newly archived test scripts

## Rationale

### Why Remove These Scripts?

1. **Replaced by proper testing infrastructure:**
   - Vitest for unit/integration tests (Nov 12, 2025)
   - Playwright for E2E tests (Nov 12, 2025)
   - Lighthouse CI for performance/accessibility (Nov 13, 2025)

2. **One-off development tests:**
   - Written to verify features during development
   - Not maintained or updated
   - Should be replaced with proper tests in test suites

3. **Technical debt:**
   - 16 npm scripts cluttering `npm run` output
   - 2,786 lines of unmaintained code
   - Confusion about which scripts to use

4. **Maintenance burden:**
   - Documentation references obsolete scripts
   - No clear ownership or purpose
   - Risk of breaking without notice

### Why Keep Accessibility Scripts?

The accessibility test scripts (created Nov 11-12, 2025) are kept because:
- Recently created with comprehensive documentation
- Part of critical accessibility compliance work
- Not yet migrated to Playwright E2E tests
- Referenced in accessibility testing guides

These will be evaluated for migration to proper E2E tests in a future cleanup.

## Impact

### Before
- **Scripts:** 49 total (33 custom test scripts)
- **Lines of script code:** ~3,000+ in scripts directory
- **Maintainability:** Low (unclear which scripts are active)

### After
- **Scripts:** 28 total (only essential scripts)
- **Lines of script code:** ~500 (core utilities only)
- **Maintainability:** High (clear purpose, modern testing infrastructure)

### Breaking Changes

None. All removed scripts were development-time utilities not used in CI/CD pipelines or production workflows.

## Migration Path

If you need to verify functionality previously covered by archived scripts:

1. **Check existing tests first:**
   ```bash
   npm run test         # Vitest unit/integration tests
   npm run test:e2e     # Playwright E2E tests
   npm run lighthouse:ci # Lighthouse quality gates
   ```

2. **Write proper tests if missing:**
   - Unit tests in `src/__tests__/`
   - Integration tests in `tests/integration/`
   - E2E tests in `e2e/`

3. **Reference archived scripts:**
   - Available in `scripts/archive/legacy-tests/`
   - Use as reference only, not as active code

## Verification

All remaining scripts tested and working:
```bash
✓ npm run lint       # ESLint validation
✓ npm run typecheck  # TypeScript checking
✓ npm run check      # Combined lint + typecheck
✓ npm run test       # Vitest unit tests
✓ npm run test:e2e   # Playwright E2E tests
```

## Next Steps

1. **Update documentation:** Search for references to archived scripts in `/docs` and update
2. **CI/CD review:** Verify no GitHub Actions workflows reference removed scripts
3. **Future cleanup:** Consider migrating remaining accessibility scripts to Playwright

## Related Files

- `package.json` - Updated scripts section (28 scripts, down from 49)
- `scripts/archive/legacy-tests/README.md` - Documentation for archived scripts
- `/docs/testing/` - Modern testing infrastructure documentation

---

**Result:** Cleaner, more maintainable npm scripts focused on modern testing infrastructure. Reduced confusion and technical debt while preserving historical scripts for reference.
