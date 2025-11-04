# Skeleton Sync Strategy

**Last Updated:** November 4, 2025

## Problem Statement

Skeleton loaders need to stay synchronized with their actual components. When components are updated (structure, layout, styling), skeletons often fall out of sync, leading to layout shifts and poor UX.

**Current Issues:**
- Skeletons are in separate files (`*-skeleton.tsx`)
- No automated checks to ensure structural parity
- Manual updates required when components change
- Easy to forget to update skeletons after component changes

## Proposed Solutions

### Strategy 1: Co-location with Visual Markers ⭐ **RECOMMENDED**

Keep skeletons in separate files but add clear visual markers in the component to help developers remember.

#### Implementation

**In Component File:**
```tsx
/**
 * ProjectCard Component
 * 
 * ⚠️ SKELETON SYNC REQUIRED
 * When updating this component's structure, also update:
 * - src/components/project-card-skeleton.tsx
 * 
 * Key structural elements that must match:
 * - Card padding and layout
 * - CardHeader with title + badge
 * - CardDescription
 * - Tech badges section
 * - CardContent (highlights section)
 * - CardFooter (action buttons)
 */
export function ProjectCard({ ... }) {
  // Component code
}
```

**Benefits:**
- ✅ Clear reminder at component level
- ✅ No architectural changes needed
- ✅ Works with existing patterns
- ✅ Low maintenance overhead

**Implementation Checklist:**
1. Add JSDoc comment with skeleton sync warning to all components with skeletons
2. List the skeleton file path explicitly
3. Document key structural elements that must match
4. Consider adding to component template/snippet

---

### Strategy 2: Structural Testing

Add tests that compare the DOM structure of skeletons to loaded components.

#### Implementation

Create a test helper that validates structure:

```tsx
// tests/skeleton-sync.test.tsx
import { render } from "@testing-library/react";
import { ProjectCard } from "@/components/project-card";
import { ProjectCardSkeleton } from "@/components/project-card-skeleton";

describe("Skeleton Structural Sync", () => {
  it("ProjectCardSkeleton matches ProjectCard structure", () => {
    const mockProject = createMockProject();
    
    // Render both
    const { container: cardContainer } = render(<ProjectCard project={mockProject} />);
    const { container: skeletonContainer } = render(<ProjectCardSkeleton />);
    
    // Check Card element exists
    expect(cardContainer.querySelector(".flex.h-full")).toBeTruthy();
    expect(skeletonContainer.querySelector("div.p-6")).toBeTruthy();
    
    // Check CardHeader section
    const cardHeader = cardContainer.querySelector("header");
    const skeletonHeader = skeletonContainer.querySelector(".space-y-4 > div:first-child");
    expect(cardHeader).toBeTruthy();
    expect(skeletonHeader).toBeTruthy();
    
    // Check tech badges section
    const cardTechBadges = cardContainer.querySelectorAll("[variant='outline']");
    const skeletonTechBadges = skeletonContainer.querySelectorAll(".flex-wrap > *");
    expect(skeletonTechBadges.length).toBeGreaterThan(0);
    
    // Check footer actions
    const cardFooter = cardContainer.querySelector("footer");
    const skeletonFooter = skeletonContainer.querySelector(".flex.gap-2.pt-2");
    expect(cardFooter).toBeTruthy();
    expect(skeletonFooter).toBeTruthy();
  });
});
```

**Benefits:**
- ✅ Automated validation
- ✅ Catches structural drift
- ✅ CI/CD integration
- ✅ Forces awareness of skeleton updates

**Drawbacks:**
- ⚠️ Requires test setup and maintenance
- ⚠️ May have false positives/negatives
- ⚠️ Doesn't catch styling differences

---

### Strategy 3: Shared Layout Components

Extract common layout patterns into reusable components.

#### Implementation

```tsx
// src/components/card-layouts/project-card-layout.tsx
export function ProjectCardLayout({
  title,
  status,
  timeline,
  description,
  techStack,
  highlights,
  actions,
  isLoading = false
}: ProjectCardLayoutProps) {
  return (
    <Card className="flex h-full flex-col ...">
      <CardHeader className="space-y-3 ...">
        <div className="flex flex-wrap items-center gap-2">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-5 w-20" />
            </>
          ) : (
            <>
              <CardTitle>{title}</CardTitle>
              <Badge>{status}</Badge>
            </>
          )}
        </div>
        
        {timeline && (
          isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <p className="text-xs ...">{timeline}</p>
          )
        )}
        
        {/* Continue pattern for all sections */}
      </CardHeader>
    </Card>
  );
}

// Usage in ProjectCard
export function ProjectCard({ project }) {
  return (
    <ProjectCardLayout
      title={project.title}
      status={project.status}
      // ... other props
    />
  );
}

// Usage for skeleton
export function ProjectCardSkeleton() {
  return <ProjectCardLayout isLoading />;
}
```

**Benefits:**
- ✅ Single source of truth
- ✅ Guaranteed structural sync
- ✅ DRY principle
- ✅ Easier to maintain

**Drawbacks:**
- ⚠️ Significant refactoring required
- ⚠️ More complex component API
- ⚠️ May reduce flexibility
- ⚠️ Potential performance overhead

---

### Strategy 4: Documentation-Driven Approach

Maintain detailed documentation with visual structure maps.

#### Implementation

Create a structure map in component docs:

```markdown
## Component Structure

```
ProjectCard
├── Card (flex, h-full, hover effects)
│   ├── Background Image Layer (z-0)
│   ├── CardHeader (z-10, px-4 sm:px-6, py-4 sm:py-6)
│   │   ├── Title + Badge
│   │   ├── Timeline (optional)
│   │   ├── Description
│   │   └── Tech Badges (flex-wrap)
│   ├── CardContent (conditional, z-10, px-4 sm:px-6)
│   │   ├── Desktop: Highlights list
│   │   └── Mobile: Expandable accordion
│   └── CardFooter (z-10, px-4 sm:px-6, py-4)
│       └── Action buttons (flex-col sm:flex-row)
```

**ProjectCardSkeleton MUST match:**
1. Card padding
2. Header section with title + badge skeletons
3. Description lines
4. Tech badge section (3-4 skeleton badges)
5. Footer with 2-3 action button skeletons
```

**Benefits:**
- ✅ Clear reference documentation
- ✅ Easy to review during PRs
- ✅ No code changes needed
- ✅ Good for onboarding

**Drawbacks:**
- ⚠️ Still manual process
- ⚠️ Docs can go stale
- ⚠️ No automated enforcement

---

### Strategy 5: Component Metadata & Linting

Add metadata to components that can be checked by linters.

#### Implementation

```tsx
// project-card.tsx
/**
 * @component ProjectCard
 * @skeleton ProjectCardSkeleton
 * @skeletonPath src/components/project-card-skeleton.tsx
 * @structureVersion 2.0.0
 */
export function ProjectCard() { ... }

// project-card-skeleton.tsx
/**
 * @skeletonFor ProjectCard
 * @structureVersion 2.0.0
 * @lastSyncDate 2025-11-04
 */
export function ProjectCardSkeleton() { ... }
```

Custom ESLint rule to check:
- Version numbers match
- lastSyncDate is recent
- Referenced files exist

**Benefits:**
- ✅ Automated checks
- ✅ CI/CD integration
- ✅ Clear versioning

**Drawbacks:**
- ⚠️ Requires custom tooling
- ⚠️ Version management overhead
- ⚠️ Doesn't validate actual structure

---

## Recommended Implementation Plan

### Phase 1: Quick Wins (Immediate)

1. **Add JSDoc warnings to all components with skeletons** ⭐
   - Lists skeleton file path
   - Documents key structural elements
   - Takes 5 minutes per component

2. **Update skeleton sync checklist in PR template**
   ```markdown
   - [ ] If component structure changed, did you update the skeleton?
   - [ ] Tested loading state matches loaded state?
   ```

3. **Create visual comparison script**
   ```bash
   npm run compare-skeletons
   # Opens browser with side-by-side skeleton vs loaded component
   ```

### Phase 2: Enhanced Documentation (Week 1)

4. **Add structure maps to all component docs**
   - ASCII tree showing hierarchy
   - Key classes and breakpoints
   - Skeleton matching requirements

5. **Create skeleton sync guide**
   - When to update skeletons
   - How to validate sync
   - Common patterns

### Phase 3: Automation (Month 1)

6. **Add structural tests for critical components**
   - GitHub Heatmap
   - Project Card
   - Post List
   - Blog Post

7. **Set up visual regression testing** (optional)
   - Percy, Chromatic, or similar
   - Captures skeleton vs loaded states
   - Flags visual differences

### Phase 4: Long-term (Future)

8. **Consider shared layout components** (if patterns emerge)
9. **Explore Storybook integration** for visual testing
10. **Build custom ESLint rule** if needed

---

## Current Component-Skeleton Pairs

| Component | Skeleton | Status | Priority |
|-----------|----------|--------|----------|
| `ProjectCard` | `ProjectCardSkeleton` | ✅ Updated (Nov 4) | LOW |
| `GitHubHeatmap` | `GitHubHeatmapSkeleton` | ✅ Updated (Nov 4) | LOW |
| `PostList` | `PostListSkeleton` | ✅ Synced (Nov 4) | LOW |
| `BlogPost` | `BlogPostSkeleton` | ✅ Synced (Nov 4) | LOW |

### All Skeletons Now Have Sync Warnings ✅

**Status (Nov 4, 2025):** All components with skeletons now include JSDoc warnings with:
- ⚠️ Clear "SKELETON SYNC REQUIRED" marker
- Path to skeleton file
- List of key structural elements to match
- Links to documentation
- Last synced date

**Components updated:**
1. ✅ `ProjectCard` → `ProjectCardSkeleton` - Updated structure + JSDoc
2. ✅ `GitHubHeatmap` → `GitHubHeatmapSkeleton` - Added JSDoc warning
3. ✅ `PostList` → `PostListSkeleton` - Added JSDoc warning
4. ✅ `BlogPost page` → `BlogPostSkeleton` - Added JSDoc warning

---

### Phase 1 Implementation Complete! 🎉

All immediate quick wins from Phase 1 have been implemented:
- ✅ JSDoc warnings added to all components with skeletons
- ✅ ProjectCardSkeleton updated to match current structure
- ✅ Comprehensive documentation created
- ✅ Quick reference guide available

**Next:** Phase 2 (Enhanced Documentation) and Phase 3 (Automation)

---

## Old Status (Pre-Nov 4, 2025)

### ProjectCard Skeleton Update Needed

**Current mismatch:**
- ✅ Skeleton uses `Card className="p-6"`
- ❌ Actual uses `CardHeader`, `CardContent`, `CardFooter` with specific padding
- ❌ Missing statistics grid (new feature)
- ❌ Missing responsive padding (px-4 sm:px-6)

**Action required:**
Update `project-card-skeleton.tsx` to match new structure from Nov 4, 2025 updates.

---

## Best Practices

### When Creating New Components

1. **Create skeleton alongside component**
   - Same PR, same commit
   - Not an afterthought

2. **Add JSDoc skeleton reference**
   - Clear path to skeleton file
   - List structural elements to sync

3. **Test loading state immediately**
   - View in browser with throttled network
   - Check for layout shifts

### When Updating Existing Components

1. **Check for skeleton file**
   - Search for `*-skeleton.tsx`
   - Check imports in loading.tsx

2. **Update skeleton structure**
   - Match new layout
   - Update padding/spacing
   - Test side-by-side

3. **Update component docs**
   - Note structural changes
   - Update structure map
   - Bump version if using versioning

### Code Review Checklist

- [ ] Does this component have a skeleton?
- [ ] If structure changed, was skeleton updated?
- [ ] Are padding/spacing values consistent?
- [ ] Does skeleton match responsive breakpoints?
- [ ] Tested loading state in browser?
- [ ] Documentation updated?

---

## Tools & Scripts

### Quick Skeleton Comparison Script

```typescript
// scripts/compare-skeleton.mjs
import { chromium } from 'playwright';

async function compareSkeletons() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to dev server
  await page.goto('http://localhost:3000/projects');
  
  // Take screenshot of loaded state
  await page.screenshot({ path: 'screenshots/loaded.png' });
  
  // Throttle network to trigger loading state
  await page.route('**/*', route => {
    setTimeout(() => route.continue(), 2000);
  });
  
  // Reload to see skeleton
  await page.reload();
  await page.screenshot({ path: 'screenshots/skeleton.png' });
  
  console.log('Screenshots saved! Compare loaded.png vs skeleton.png');
  await browser.close();
}

compareSkeletons();
```

**Usage:**
```bash
npm run dev
node scripts/compare-skeleton.mjs
```

### Visual Diff Tool

```bash
# Use ImageMagick to create diff
compare screenshots/skeleton.png screenshots/loaded.png screenshots/diff.png
```

---

## Success Metrics

- **Zero layout shifts** when content loads (Lighthouse CLS score)
- **< 5% visual difference** between skeleton and loaded state
- **100% of components** with skeletons have JSDoc references
- **PR review time** for skeleton updates < 5 minutes

---

## Future Enhancements

1. **Automatic skeleton generation**
   - AI-powered skeleton generation from component JSX
   - Preserve structure, replace content with Skeleton components

2. **Real-time validation**
   - Dev server plugin that warns when skeleton is stale
   - Shows diff in browser dev tools

3. **Component library integration**
   - Storybook stories for all skeletons
   - Visual regression suite
   - Interactive comparison tool

---

## Related Documentation

- [Loading States Overview](/docs/components/loading-states.md)
- [Component Documentation Index](/docs/components/)
- [Mobile-First Optimization](/docs/design/mobile-first-optimization-analysis.md)

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-11-04 | Adopt Strategy 1 (Visual Markers) | Quick to implement, low overhead, immediate value |
| 2025-11-04 | Add structural tests (Phase 3) | Automated validation worth investment for critical components |
| 2025-11-04 | Defer shared layout components | Wait for clear patterns to emerge before major refactor |
