---
name: "Copilot Task"
about: "Well-scoped task for GitHub Copilot coding agent"
labels: ["copilot", "automation"]
---

## Problem / Requirements

**What needs to be done?**
[Clear, specific description of the work required. Think of this as a prompt to an AI.]

**Example:**
> Create a new `/bookmarks` page that:
> - Uses PageLayout component
> - Shows a list of bookmarks fetched from `/api/bookmarks`
> - Includes category filtering (Work, Personal, Learning)
> - Responsive design (mobile-first)
> - Full test coverage

## Files to Change

**Which files need to be created or modified?**
- [ ] `src/app/bookmarks/page.tsx` (new page component)
- [ ] `src/components/bookmarks/BookmarkCard.tsx` (new component)
- [ ] `src/app/api/bookmarks/route.ts` (API route)
- [ ] `tests/pages/bookmarks.test.tsx` (test file)

## Acceptance Criteria

**How will we know this is complete?**

- [ ] Page renders without errors
- [ ] All design tokens used (no hardcoded spacing/colors)
- [ ] Uses barrel exports for component imports
- [ ] Uses PageLayout component
- [ ] Category filtering works as expected
- [ ] Responsive on mobile, tablet, and desktop
- [ ] All tests pass (run `npm run test:run`)
- [ ] ESLint passes (run `npm run lint`)
- [ ] TypeScript compiles (no errors)
- [ ] Design token compliance ≥90%
- [ ] Test coverage ≥80%
- [ ] No breaking changes (or approved separately)

## Additional Context

**What should Copilot know?**

### Related Documentation
- [Component Patterns](../../docs/ai/component-patterns.md) - Layout and import guidelines
- [Design System](../../docs/ai/design-system.md) - Token reference
- [Decision Trees](../../docs/ai/decision-trees.md) - Quick patterns

### Similar Examples
- See `/src/app/projects/page.tsx` for similar list page pattern
- See `/src/components/blog/PostCard.tsx` for component pattern

### Important Notes
- Target ≥99% test pass rate
- Use `PageLayout` (90% rule for layouts)
- Environment checks for test data (NODE_ENV + VERCEL_ENV)
- No emojis in public content (use lucide-react icons)

### Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind v4 + shadcn/ui
- **Patterns:** Validate→Queue→Respond for API routes
- **Testing:** Vitest + React Testing Library

## Definition of Done

This task is complete when:
1. ✅ All acceptance criteria met
2. ✅ Code review passes (design tokens, patterns, tests)
3. ✅ No ESLint/TypeScript errors
4. ✅ Test coverage meets target (≥80%)
5. ✅ Ready to merge without additional work

## Questions?

If anything is unclear, please add a comment `@copilot [your question]` to this issue.
Copilot will respond with clarification before starting work.

---

**Tips for Success:**
- Be specific about expected behavior
- Link to similar existing code
- Mention any constraints or concerns
- Include links to design tokens/patterns
- Batch multiple feedback comments into one review for efficiency
