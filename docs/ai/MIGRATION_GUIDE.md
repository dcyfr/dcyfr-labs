# DCYFR AI Migration Guide

**Status:** In Progress
**Date:** January 27, 2026
**Version:** 1.0.0

## Overview

This guide documents the migration from dcyfr-labs' monolithic agent system to the modular @dcyfr/ai framework and @dcyfr/agents packages.

## Migration Status

### ✅ Completed

1. **Validation Logic Migration**
   - [x] Moved validation patterns to `@dcyfr/agents/cli/validate-patterns`
   - [x] Updated `scripts/validate-dcyfr-patterns.mjs` to use new CLI
   - [x] Added deprecation warnings to old implementations

2. **Framework Extraction**
   - [x] Created `@dcyfr/ai` package with core framework
   - [x] Created `@dcyfr/agents` package with DCYFR-specific validators
   - [x] Built compatibility adapter in `src/lib/agents/compat.ts`

3. **Documentation Updates**
   - [x] Added deprecation notices to old modules
   - [x] Created migration guide (this document)

### 🚧 In Progress

4. **Test Migration**
   - [ ] Move agent tests to `@dcyfr/ai` package
   - [ ] Update integration tests in dcyfr-labs
   - [ ] Verify backward compatibility

5. **Documentation Reorganization**
   - [ ] Move generic AI docs to `@dcyfr/ai/docs/`
   - [ ] Move DCYFR-specific rules to `@dcyfr/agents/docs/`
   - [ ] Update references in AGENTS.md

### 📋 Planned

6. **Deprecation Phase**
   - [ ] Mark old telemetry for removal (v2.0)
   - [ ] Mark old provider manager for removal (v2.0)
   - [ ] Create migration scripts for external users

7. **Final Cleanup**
   - [ ] Remove deprecated implementations
   - [ ] Keep only compat layer in dcyfr-labs
   - [ ] Publish @dcyfr/ai as open source (optional)

## Architecture Changes

### Before (Monolithic)

```
dcyfr-labs/
└── src/lib/agents/
    ├── agent-telemetry.ts (641 lines)
    ├── provider-fallback-manager.ts (495 lines)
    └── index.ts
scripts/
└── validate-dcyfr-patterns.mjs (338 lines)
```

### After (Modular)

```
@dcyfr/ai/                          # Portable framework
├── config/                         # Configuration system
├── telemetry/                      # Telemetry engine
├── providers/                      # Provider registry
├── plugins/                        # Plugin loader
└── validation/                     # Validation framework

@dcyfr/agents/                      # DCYFR-specific
├── specialized/
│   ├── design-token-validator.ts
│   ├── barrel-export-checker.ts
│   ├── pagelayout-enforcer.ts
│   └── test-data-guardian.ts
└── cli/
    └── validate-patterns.ts        # Consolidated CLI

dcyfr-labs/
├── src/lib/agents/
│   ├── compat.ts                   # Adapter layer
│   ├── agent-telemetry.ts (deprecated)
│   ├── provider-fallback-manager.ts (deprecated)
│   └── index.ts                    # Exports compat layer
└── scripts/
    └── validate-dcyfr-patterns.mjs # Thin wrapper
```

## Code Migration Examples

### Validation Scripts

**Before:**
```javascript
// scripts/validate-dcyfr-patterns.mjs
const STRICT_RULES = [
  {
    name: 'Design Tokens',
    check: (content, file) => {
      // 50+ lines of validation logic
    }
  },
  // ... more inline rules
];
```

**After:**
```javascript
// scripts/validate-dcyfr-patterns.mjs
import { cli } from '@dcyfr/agents';
cli(process.argv.slice(2));
```

```typescript
// @dcyfr/agents/cli/validate-patterns.ts
import { PluginLoader } from '@dcyfr/ai';
import designTokenValidator from '../specialized/design-token-validator';
// Reusable, testable, modular
```

### Telemetry Usage

**Before:**
```typescript
import { telemetry } from '@/lib/agents/agent-telemetry';
const session = telemetry.startSession('claude', { ... });
```

**After (Compatibility):**
```typescript
import { telemetry } from '@/lib/agents/compat';
const session = telemetry.startSession('claude', { ... });
// Same API, different implementation
```

**After (Direct):**
```typescript
import { TelemetryEngine, TelemetrySessionManager } from '@dcyfr/ai';
const engine = new TelemetryEngine({ storage: 'file' });
const manager = new TelemetrySessionManager(engine);
const session = manager.startSession('claude', { ... });
```

### Provider Fallback

**Before:**
```typescript
import { ProviderFallbackManager } from '@/lib/agents/provider-fallback-manager';
const manager = new ProviderFallbackManager({ ... });
```

**After (Compatibility):**
```typescript
import { getCompatibilityProvider } from '@/lib/agents/compat';
const manager = getCompatibilityProvider();
```

**After (Direct):**
```typescript
import { ProviderRegistry } from '@dcyfr/ai';
const registry = new ProviderRegistry();
```

## Benefits of Migration

### 1. Reusability
- **Before:** Validation logic tied to dcyfr-labs
- **After:** Generic framework usable in any project

### 2. Maintainability
- **Before:** 1300+ lines of tightly coupled code
- **After:** Modular packages with single responsibilities

### 3. Testability
- **Before:** Complex integration tests only
- **After:** Unit tests for framework, integration tests for plugins

### 4. Extensibility
- **Before:** Hardcoded rules in scripts
- **After:** Plugin system for custom validators

### 5. Versioning
- **Before:** All changes tied to dcyfr-labs releases
- **After:** Independent versioning (ai v1.2, agents v1.0, labs v2026.01)

## Breaking Changes

### None (Yet)

The migration uses a compatibility layer to maintain 100% backward compatibility. No breaking changes in dcyfr-labs code.

### Future Breaking Changes (v2.0)

When old implementations are removed:
- `@/lib/agents/agent-telemetry` → Use `@/lib/agents/compat` or `@dcyfr/ai`
- `@/lib/agents/provider-fallback-manager` → Use `@/lib/agents/compat` or `@dcyfr/ai`
- Direct imports will need to switch to compat layer or framework

## Testing Strategy

### Phase 1: Parallel Testing
- [x] New validation CLI runs alongside old script
- [x] Verify identical output for same inputs
- [x] No changes to existing workflows

### Phase 2: Integration Testing
- [ ] Run full test suite with compat layer
- [ ] Verify zero regressions
- [ ] Update tests to use new APIs

### Phase 3: Migration Testing
- [ ] Test removal of deprecated code
- [ ] Verify compat layer continues to work
- [ ] Document any edge cases

## Rollback Plan

If issues arise:
1. Revert `scripts/validate-dcyfr-patterns.mjs` to inline validation
2. Keep using old telemetry/provider implementations
3. Compat layer remains functional
4. No data loss (telemetry stored separately)

## Timeline

- **Week 1 (Current):** Validation migration + deprecation notices
- **Week 2:** Test migration + documentation reorganization
- **Week 3:** Review period + community feedback
- **Week 4:** Finalize migration, tag v1.0.0

## Questions & Support

For questions about the migration:
- Review this document
- Check `@dcyfr/ai` and `@dcyfr/agents` documentation
- See examples in `@dcyfr/ai/examples/`

## Related Documents

- [AGENTS.md](../AGENTS.md) - Agent routing and selection
- [@dcyfr/ai README](../../dcyfr-ai/README.md) - Framework documentation
- [@dcyfr/agents README](../../dcyfr-ai-agents/README.md) - Plugin documentation
- [LAUNCH-SUMMARY.md](../../dcyfr-ai/docs/LAUNCH-SUMMARY.md) - Framework launch details
