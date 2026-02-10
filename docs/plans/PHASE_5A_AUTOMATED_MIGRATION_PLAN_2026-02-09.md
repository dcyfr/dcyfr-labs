<!-- TLP:AMBER - Internal Use Only -->
# Phase 5A: Automated Design Token Migration

**Information Classification:** TLP:AMBER (Internal Team Only)
**Created:** February 9, 2026
**Goal:** Automated migration of hardcoded values to design tokens
**Estimated Effort:** 8-10 hours
**Status:** 🚧 In Progress

---

## Objective

Build an automated code transformation tool to migrate hardcoded Tailwind classes to design tokens across the entire codebase.

**Key Outcomes:**
- ✅ Fix 15+ existing ESLint violations automatically
- ✅ Safe, AST-based transformations (no regex)
- ✅ Dry-run mode to preview changes
- ✅ CLI tool: `npm run migrate:tokens`
- ✅ Detailed migration report

---

## Problem Statement

**Current State:**
- Phase 4 ESLint rules detect 15+ violations in 3 sample files
- Estimated ~100-200 violations across entire codebase (942 files)
- Manual migration is tedious and error-prone
- Blocking switch from warn → error mode

**Desired State:**
- Automated migration of all hardcoded values
- Zero manual intervention required
- Safe transformations that preserve functionality
- Comprehensive migration report

---

## Technical Approach

### Tool Selection: ts-morph

**Why ts-morph over jscodeshift:**
- ✅ TypeScript-first design (better .tsx support)
- ✅ Synchronous API (easier to reason about)
- ✅ Full TypeScript compiler API access
- ✅ Better error handling
- ✅ Simpler learning curve

**Installation:**
```bash
npm install --save-dev ts-morph
```

---

## Migration Patterns

### Pattern 1: Hardcoded Spacing → SPACING tokens

**Detection:**
```tsx
// Before
<div className="space-y-8 mb-4">
<div className="gap-6">
```

**Transformation:**
```tsx
// After
import { SPACING } from '@/lib/design-tokens';
<div className={SPACING.section}>
<div className={SPACING.horizontal}>
```

**Mapping Rules:**
| Hardcoded | Design Token | Rationale |
|-----------|--------------|-----------|
| `space-y-12`, `space-y-16` | `SPACING.section` | Major section spacing |
| `space-y-6`, `space-y-8` | `SPACING.content` | Content area spacing |
| `space-y-2`, `space-y-4` | `SPACING.compact` | Compact list spacing |
| `gap-4`, `gap-6`, `gap-8` | `SPACING.horizontal` | Horizontal spacing |
| `mb-*`, `mt-*`, `my-*` | Context-dependent | Requires pattern matching |

### Pattern 2: Hardcoded Colors → SEMANTIC_COLORS

**Detection:**
```tsx
// Before
<p className="text-red-500">Error</p>
<div className="bg-blue-600">
```

**Transformation:**
```tsx
// After
import { SEMANTIC_COLORS } from '@/lib/design-tokens';
<p className={SEMANTIC_COLORS.text.error}>Error</p>
<div className={SEMANTIC_COLORS.background.primary}>
```

**Mapping Rules:**
| Color Pattern | Design Token | Context |
|--------------|--------------|---------|
| `text-red-*` | `SEMANTIC_COLORS.text.error` | Error messages |
| `text-green-*` | `SEMANTIC_COLORS.text.success` | Success messages |
| `text-yellow-*` | `SEMANTIC_COLORS.text.warning` | Warnings |
| `text-gray-*` | `SEMANTIC_COLORS.text.secondary` | Secondary text |
| `bg-red-*` | `SEMANTIC_COLORS.alert.critical.*` | Error backgrounds |

### Pattern 3: Hardcoded Typography → TYPOGRAPHY

**Detection:**
```tsx
// Before
<h1 className="text-4xl font-bold">
<p className="text-lg leading-relaxed">
```

**Transformation:**
```tsx
// After
import { TYPOGRAPHY } from '@/lib/design-tokens';
<h1 className={TYPOGRAPHY.h1.standard}>
<p className={TYPOGRAPHY.body}>
```

**Mapping Rules:**
| Typography Pattern | Design Token | Element Type |
|-------------------|--------------|--------------|
| `text-4xl font-bold` | `TYPOGRAPHY.h1.standard` | Page headlines |
| `text-3xl font-bold` | `TYPOGRAPHY.h2.standard` | Section headers |
| `text-2xl font-semibold` | `TYPOGRAPHY.h3.standard` | Subsection headers |
| `text-base`, `text-lg` | `TYPOGRAPHY.body` | Body text |
| `text-sm`, `text-xs` | `TYPOGRAPHY.caption` | Small text |

---

## Implementation

### Script Structure

```typescript
// scripts/migrate-design-tokens.ts
import { Project, SourceFile, SyntaxKind } from 'ts-morph';
import path from 'path';

interface MigrationResult {
  filePath: string;
  changes: Array<{
    line: number;
    column: number;
    from: string;
    to: string;
    type: 'spacing' | 'color' | 'typography';
  }>;
}

class DesignTokenMigrator {
  private project: Project;
  private results: MigrationResult[] = [];

  constructor(private dryRun: boolean = true) {
    this.project = new Project({
      tsConfigFilePath: path.resolve(__dirname, '../tsconfig.json'),
    });
  }

  // Migration rules
  private spacingMappings = {
    'space-y-12': 'SPACING.section',
    'space-y-8': 'SPACING.section',
    'space-y-6': 'SPACING.content',
    'gap-6': 'SPACING.horizontal',
    // ... more mappings
  };

  async migrateFiles(pattern: string): Promise<void> {
    const sourceFiles = this.project.addSourceFilesAtPaths(pattern);

    for (const file of sourceFiles) {
      await this.migrateFile(file);
    }

    if (!this.dryRun) {
      await this.project.save();
    }
  }

  private async migrateFile(file: SourceFile): Promise<void> {
    const changes: MigrationResult['changes'] = [];

    // Find JSX elements with className attributes
    const jsxElements = file.getDescendantsOfKind(SyntaxKind.JsxElement);
    const jsxSelfClosing = file.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);

    [...jsxElements, ...jsxSelfClosing].forEach(element => {
      const classAttr = element.getAttribute('className');
      if (!classAttr) return;

      const value = this.getClassNameValue(classAttr);
      const migrated = this.migrateClassName(value);

      if (migrated !== value) {
        changes.push({
          line: classAttr.getStartLineNumber(),
          column: classAttr.getStartLinePos(),
          from: value,
          to: migrated,
          type: this.detectType(value),
        });

        if (!this.dryRun) {
          this.updateClassName(classAttr, migrated);
          this.ensureImports(file);
        }
      }
    });

    if (changes.length > 0) {
      this.results.push({
        filePath: file.getFilePath(),
        changes,
      });
    }
  }

  private migrateClassName(className: string): string {
    let migrated = className;

    // Apply spacing transformations
    for (const [hardcoded, token] of Object.entries(this.spacingMappings)) {
      if (migrated.includes(hardcoded)) {
        migrated = migrated.replace(hardcoded, `{${token}}`);
      }
    }

    // Apply color transformations
    // Apply typography transformations

    return migrated;
  }

  private ensureImports(file: SourceFile): void {
    // Add import if not present
    const hasImport = file.getImportDeclarations()
      .some(imp => imp.getModuleSpecifierValue() === '@/lib/design-tokens');

    if (!hasImport) {
      file.addImportDeclaration({
        moduleSpecifier: '@/lib/design-tokens',
        namedImports: ['SPACING', 'SEMANTIC_COLORS', 'TYPOGRAPHY'],
      });
    }
  }

  generateReport(): string {
    const totalChanges = this.results.reduce((sum, r) => sum + r.changes.length, 0);

    let report = `# Design Token Migration Report\n\n`;
    report += `**Total Files:** ${this.results.length}\n`;
    report += `**Total Changes:** ${totalChanges}\n\n`;

    this.results.forEach(result => {
      report += `\n## ${result.filePath}\n\n`;
      result.changes.forEach(change => {
        report += `- Line ${change.line}: \`${change.from}\` → \`${change.to}\` (${change.type})\n`;
      });
    });

    return report;
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--apply');
  const pattern = args.find(a => !a.startsWith('--')) || 'src/**/*.{ts,tsx}';

  console.log(`🔄 Design Token Migration Tool`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'APPLY'}`);
  console.log(`Pattern: ${pattern}\n`);

  const migrator = new DesignTokenMigrator(dryRun);
  await migrator.migrateFiles(pattern);

  const report = migrator.generateReport();
  console.log(report);

  if (dryRun) {
    console.log(`\n💡 Run with --apply to apply changes`);
  } else {
    console.log(`\n✅ Migration complete!`);
  }
}

main().catch(console.error);
```

---

## CLI Usage

### Dry Run (Preview Changes)

```bash
# Preview all changes
npm run migrate:tokens

# Preview specific directory
npm run migrate:tokens src/components/mdx

# Preview single file
npm run migrate:tokens src/components/mdx/code-block.tsx
```

### Apply Changes

```bash
# Apply to entire codebase
npm run migrate:tokens -- --apply

# Apply to specific directory
npm run migrate:tokens src/components/rivet -- --apply
```

### Output Format

```
🔄 Design Token Migration Tool
Mode: DRY RUN
Pattern: src/**/*.{ts,tsx}

# Design Token Migration Report

**Total Files:** 15
**Total Changes:** 47

## src/components/mdx/code-block.tsx

- Line 94: `text-xs` → `{TYPOGRAPHY.caption}` (typography)
- Line 112: `my-6` → `{SPACING.content}` (spacing)
- Line 114: `px-4` → `{SPACING.horizontal}` (spacing)

...

💡 Run with --apply to apply changes
```

---

## Package.json Scripts

```json
{
  "scripts": {
    "migrate:tokens": "tsx scripts/migrate-design-tokens.ts",
    "migrate:tokens:apply": "tsx scripts/migrate-design-tokens.ts -- --apply",
    "migrate:tokens:report": "tsx scripts/migrate-design-tokens.ts > migration-report.md"
  }
}
```

---

## Safety Mechanisms

### 1. AST-Based Transformations
- No regex substitutions
- Preserves TypeScript/JSX syntax
- Type-safe modifications

### 2. Dry Run Default
- Always preview changes first
- Require explicit `--apply` flag
- Generate detailed report

### 3. Import Management
- Automatically add missing imports
- Deduplicate imports
- Preserve existing imports

### 4. Backup Strategy
- Git-based rollback (users must commit before running)
- Diff preview before apply
- File-by-file application

### 5. Validation
- Run ESLint after migration
- Run TypeScript compiler
- Run design token validation

---

## Testing Strategy

### Phase 1: Single File Test
```bash
# Test on safe file
npm run migrate:tokens src/components/mdx/code-block.tsx
# Review output
npm run migrate:tokens src/components/mdx/code-block.tsx -- --apply
# Verify with ESLint
npx eslint src/components/mdx/code-block.tsx
```

### Phase 2: Directory Test
```bash
# Test on small directory
npm run migrate:tokens src/components/mdx
# Review, apply, verify
```

### Phase 3: Full Codebase
```bash
# Commit current state
git add . && git commit -m "Pre-migration checkpoint"

# Run migration
npm run migrate:tokens -- --apply

# Verify
npm run lint
npm run check:tokens
npx tsc --noEmit

# Review changes
git diff --stat
```

---

## Success Criteria

- [ ] Migrates 90%+ of hardcoded spacing values
- [ ] Migrates 80%+ of hardcoded color values
- [ ] Migrates 70%+ of hardcoded typography values
- [ ] Zero TypeScript errors after migration
- [ ] Zero design token validation errors
- [ ] ESLint violations reduced by 80%+
- [ ] All tests pass after migration

---

## Timeline

### Day 1 (3-4 hours)
- [x] Create implementation plan
- [ ] Install ts-morph
- [ ] Build basic migrator structure
- [ ] Implement spacing pattern migrations

### Day 2 (3-4 hours)
- [ ] Implement color pattern migrations
- [ ] Implement typography pattern migrations
- [ ] Add import management
- [ ] Test on single files

### Day 3 (2-3 hours)
- [ ] Add reporting functionality
- [ ] Add CLI arguments
- [ ] Test on directories
- [ ] Full codebase dry run
- [ ] Apply migration
- [ ] Verification and documentation

---

## Risks & Mitigation

**Risk:** Complex className expressions not handled
**Mitigation:** Start with simple string literals, expand to template literals later

**Risk:** Breaking changes to component functionality
**Mitigation:** Comprehensive testing, git rollback strategy

**Risk:** False positive migrations
**Mitigation:** Conservative mapping rules, manual review of report

**Risk:** Missing edge cases
**Mitigation:** Iterative approach, dry run first, manual fixes for edge cases

---

## Future Enhancements

- Support for template literal className values
- Context-aware color mapping (detect error/success from surrounding code)
- Integration with pre-commit hook (auto-migrate on commit)
- VS Code extension for inline migrations
- Machine learning for pattern detection

---

**Status:** 🚧 In Progress
**Next Action:** Install ts-morph and build migration script
