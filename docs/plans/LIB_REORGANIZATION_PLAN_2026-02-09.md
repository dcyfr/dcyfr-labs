# Library Reorganization Plan

## Current State
- **77 top-level files** in `src/lib/`
- **18 existing subdirectories**
- Target: Reduce to ~30 top-level files

## Files to Keep at Top Level (High-Frequency Imports)

### Core Utilities (10 files)
- `design-tokens.ts` (120 imports) - Design system foundation
- `utils.ts` (78 imports) - Core utility functions  
- `metadata.ts` (24 imports) - SEO/metadata generation
- `site-config.ts` (19 imports) - Site configuration
- `json-ld.ts` (10 imports) - Structured data
- `cn.ts` - Tailwind class merging
- `constants.ts` - Application constants
- `types.ts` - Shared TypeScript types
- `env.ts` - Environment validation
- `config.ts` - Configuration management

## Files to Reorganize

### 1. API Domain → `lib/api/`
**Files to move:**
- `api-security.ts` (11 imports)
- `api-guardrails.ts`
- `api-headers.ts`
- `api-monitor.ts`
- `api-usage-tracker.ts`
- `api-cost-calculator.ts`

**Impact:** 6 files moved, medium import frequency

### 2. Cache Domain → `lib/cache/`
**Files to move:**
- `redis.ts` (10 imports)
- `cache-versioning.ts`
- `cache-utils.ts`
- `cache-invalidation.ts`

**Impact:** 4 files moved, medium import frequency

### 3. Security Domain → `lib/security/` (already exists)
**Files to move:**
- `rate-limit.ts` (16 imports)
- `ip-reputation.ts` (3 imports)
- `secure-session-manager.ts` (3 imports)

**Impact:** 3 files to existing directory

### 4. Monitoring Domain → `lib/monitoring/`
**Files to move:**
- `logger.ts` (5 imports)
- `error-handler.ts` (6 imports)
- `error-logger.ts`

**Impact:** 3 files moved, low-medium import frequency

## Reorganization Strategy

**Phase 3.2:** API files (lowest risk, barrel exports for compatibility)
**Phase 3.3:** Cache + Monitoring files (medium risk)
**Phase 3.4:** Update documentation

## Risk Mitigation
- Use barrel exports (`index.ts`) for backward compatibility
- Update imports in batches
- Test after each batch
- Keep backups

## Expected Outcome
- Top-level files: 77 → ~40 (48% reduction)
- Better organization by domain
- Easier navigation and discovery
- Maintained backward compatibility
