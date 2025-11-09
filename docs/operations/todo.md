# Project TODO & Issue Tracker

This document tracks **active and pending** work only, **organized by criticality**. Completed tasks are moved to **`done.md`**.

**Last Updated:** October 27, 2025

---

## 🎯 Priority Overview

This todo list is organized by **criticality and user impact**, not arbitrary phases:

- **🚨 CRITICAL** - Broken/inaccessible features, affects majority of users (mobile traffic = 50-70%)
- **🔴 HIGH** - Major UX issues, affects key user flows  
- **🟡 MEDIUM** - Enhancements to working features, optimization
- **🟢 LOW** - Polish, nice-to-have improvements
- **⚪ BACKLOG** - Future consideration, exploration

**Current Focus:** Design System foundation complete (Nov 8) - Implementation ready!

---

## 📌 Recent Updates

### 🎨 Design System Analysis & Foundation Complete (Nov 8, 2025) ✅
**Major Achievement:** Comprehensive UX/UI consistency analysis completed with full design system

**What Was Created:**
- ✅ Complete UX/UI consistency analysis (44% → 95%+ target consistency)
- ✅ Design tokens system (`src/lib/design-tokens.ts`)
- ✅ Comprehensive documentation (6 new docs in `docs/design/`)
- ✅ Implementation roadmap (4-phase plan, 33 hours total)
- ✅ Component patterns library with examples

**Deliverables:**
1. **Design Tokens** - TypeScript constants for all design decisions:
   - Container widths (prose, standard, narrow)
   - Typography patterns (h1, h2, h3, descriptions)
   - Spacing scale (section, subsection, content)
   - Hover effects (card, button, link)
   - Utility functions and TypeScript types

2. **Documentation:**
   - `QUICK_START.md` - 5-minute overview with examples
   - `EXECUTIVE_SUMMARY.md` - Business case and ROI analysis
   - `ux-ui-consistency-analysis.md` - Full problem breakdown (5 categories, 12 issues)
   - `design-system.md` - Complete reference guide
   - `component-patterns.md` - Copy-paste implementation examples
   - `implementation-roadmap.md` - Step-by-step rollout plan

3. **Updated `docs/INDEX.md`** - Added design system section

**Key Findings:**
- 5 major inconsistency categories identified
- 12 specific issues with severity ratings
- Container widths: 3 inconsistent → 3 semantic patterns
- Typography: Mixed font-bold/font-semibold → Standardized
- Hover effects: 4 different patterns → 4 semantic patterns
- Spacing: Ad-hoc → System-based vertical rhythm

**Implementation Phases:**
- Phase 1: Foundation ✅ COMPLETE (design tokens + docs)
- Phase 2: Page Updates (~6 hours) - Fix typography, containers, spacing
- Phase 3: Component Updates (~8 hours) - Standardize hover effects
- Phase 4: Enforcement (~13 hours) - ESLint rules, tests, docs site

**Impact:** 
- Provides clear patterns for all future development
- Enables 95%+ consistency score (from 44%)
- Reduces developer confusion and onboarding time
- Establishes single source of truth for design decisions
- Very low risk, high impact implementation

**Next Steps:** Review docs and plan Phase 2 execution (page updates)

**See:** `docs/design/QUICK_START.md` for immediate usage examples

---

### Blog Quick Wins Complete (Nov 5, 2025) ✅
**5 improvements implemented** - Enhanced blog UX and content discovery

**Completed:**
- ✅ Pagination (12 posts per page with Previous/Next navigation)
- ✅ Reading time filters (Quick <5min, Medium 5-15min, Deep >15min)
- ✅ Breadcrumb navigation in blog posts
- ✅ Post series/collections feature with dedicated pages
- ✅ Verified social sharing and comments already implemented

**New Components:**
- `breadcrumbs.tsx` - Hierarchical navigation component
- `series-navigation.tsx` - Series navigation UI for posts
- `/blog/series/[slug]` - Series listing pages

**Updated:**
- Enhanced Post type with optional `series` field
- Blog page now supports pagination and reading time filters
- BlogSearchForm preserves all filters across searches

**Impact:** Better content discovery, navigation, and reading experience. Series feature enables multi-part content organization.

---

### Bottom Navigation Bar Complete (Nov 4, 2025) ✅
**First HIGH priority item complete** - App-like mobile navigation

**Completed:**
- ✅ Created `bottom-nav.tsx` with 4 primary destinations
- ✅ Grid layout with large touch targets (64px height)
- ✅ Active state highlighting (color + bold stroke)
- ✅ Icons: Home, Blog (FileText), Projects (FolderGit2), Contact (Mail)
- ✅ Fixed positioning, mobile-only (< md breakpoint)
- ✅ Backdrop blur effect

**Additional Improvements:**
- Main content padding adjusted: `pb-20 md:pb-0` (80px mobile clearance)
- BackToTop button repositioned: `bottom-[104px] md:bottom-24`
- TOC FAB button repositioned: `bottom-[104px]` (consistent 104px = 64px nav + 40px spacing)

**Impact:** Enhanced mobile navigation with app-like UX. Users can navigate primary destinations without opening hamburger menu.

---

### 🎉 ALL CRITICAL PRIORITIES COMPLETE! (Nov 4, 2025)
**Major Milestone:** All 🚨 CRITICAL mobile-first items are now complete!

**Status:**
- ✅ Mobile Navigation - **Implemented today** (Sheet drawer, hamburger menu, 56px touch targets)
- ✅ Mobile Table of Contents - **Already complete** (discovered existing FAB + Sheet implementation)
- ✅ Mobile Blog Typography - **Already complete** (discovered comprehensive mobile CSS)

**P0 Foundation: 4/4 Complete**
1. ✅ Touch target audit & fixes (Nov 4)
2. ✅ Form optimization (Nov 4)
3. ✅ Responsive spacing system (Nov 4)
4. ✅ Mobile navigation (Nov 4)

**Additional Critical Discoveries:**
- Table of Contents had full mobile support at lines 175-216 in `table-of-contents.tsx`
- Blog typography had comprehensive mobile enhancements at lines 492-555 in `globals.css`

**Impact:** Mobile-first foundation is 100% complete. 50-70% of users (mobile traffic) now have optimized experience. Ready for 🔴 HIGH PRIORITY enhancements.

**Next Focus:** High-priority items (bottom nav, post list redesign, swipe gestures, etc.)

---

### Mobile Navigation Implementation Completed (Nov 4, 2025) ✅
**Phase 1 Foundation: 4/4 Complete** - All P0 mobile-first foundation items are now done!

**Just Completed:**
- ✅ Mobile navigation with Sheet drawer and hamburger menu
- ✅ Large touch targets (56px) for all navigation items
- ✅ Responsive breakpoint: mobile nav < md, desktop nav ≥ md
- ✅ Auto-close on navigation, active page indicator
- Files: `mobile-nav.tsx` (new), `site-header.tsx` (updated)

**Foundation Complete (4/4 items):**
1. ✅ Touch target audit & fixes (Nov 4)
2. ✅ Form optimization (Nov 4)
3. ✅ Responsive spacing system (Nov 4)
4. ✅ Mobile navigation (Nov 4)

**Next:** Mobile Table of Contents (critical - content completely hidden on mobile/tablet)

---

### Mobile-First Design Optimization Analysis (Nov 4, 2025)
A comprehensive mobile-first UX analysis has been completed identifying critical touch target and navigation issues.

**Status:** 🔴 **Critical Issues Identified**  
**Key Findings:** Touch targets below 44px minimum, no mobile navigation, hidden content, forms not optimized

**Documents:**
- 📍 **Start here:** [`/docs/design/mobile-first-quick-reference.md`](../design/mobile-first-quick-reference.md) - 5-minute overview
- 📊 **Full analysis:** [`/docs/design/mobile-first-optimization-analysis.md`](../design/mobile-first-optimization-analysis.md) - 500+ lines, detailed guide
- 🎨 **Visual guide:** [`/docs/design/mobile-first-visual-comparison.md`](../design/mobile-first-visual-comparison.md) - Before/after diagrams

**Critical Issues** (4 items added to Features > Mobile-First UX below - P0 priority)

### UI/UX Animation Phase 1 - Quick Wins Completed (Nov 3, 2025)
All Phase 1 quick wins from the UI/UX optimization roadmap have been implemented:

✅ **Completed:**
- Shimmer skeleton loader (replaced animate-pulse with gradient)
- Card hover lift effects (project cards and blog posts)
- Copy code buttons for MDX with success animation
- Back to top floating button with scroll detection
- Navigation loading bar for route transitions
- `prefers-reduced-motion` support (hook + comprehensive CSS)

**Next:** Phase 2 enhancements (staggered animations, scroll-triggered effects, enhanced components)

**Reference:** [`/docs/design/ui-ux-optimization-roadmap.md`](../design/ui-ux-optimization-roadmap.md)

### Security Analysis Completed (Oct 28, 2025)
A comprehensive security analysis has been completed with an overall **A+ rating (Excellent)**.

**Status:** ✅ Production Ready  
**Key Findings:** 0 vulnerabilities, 0 code security issues, defense-in-depth architecture

**Documents:**
- 📍 **Start here:** [`/docs/security/INDEX.md`](../security/INDEX.md) - Navigation guide
- ⚡ **Quick overview:** [`/docs/security/QUICK_REFERENCE.md`](../security/QUICK_REFERENCE.md) - 5-minute summary
- 📋 **Action items:** [`/docs/security/FINDINGS_AND_ACTION_ITEMS.md`](../security/FINDINGS_AND_ACTION_ITEMS.md) - Implementation guide
- 📊 **Full analysis:** [`/docs/security/COMPREHENSIVE_SECURITY_ANALYSIS_2025-10-28.md`](../security/COMPREHENSIVE_SECURITY_ANALYSIS_2025-10-28.md) - 16-section deep dive

**Recommendations** (5 items added to backlog below - 3 medium priority, 2 optional)

---

## 🐛 Bugs

- None currently tracked

---

## 🚀 Features

### High Priority

#### Mobile-First UX Optimization (Nov 4, 2025) 🔴 **CRITICAL**

**Phase 1: Foundation - Week 1** (P0 - Critical, ~8-12 hours) — **IN PROGRESS (3/4 complete)**
- [x] **Touch target audit & fixes** — ✅ COMPLETE (Nov 4, 2025)
  - Added touch-target utility classes to globals.css (44px, 48px, 56px)
  - Updated site-header.tsx navigation links with touch-target class and px-2 padding
  - Increased blog tag filter badges to h-10 (40px) with px-4 padding
  - Logo now always visible on mobile (removed hidden md:block)
  - Header height reduced to h-14 (56px) on mobile, h-16 (64px) on desktop
  - All interactive elements now meet 44px minimum touch target
  - Files changed: `globals.css`, `site-header.tsx`, `blog/page.tsx`

- [ ] **Mobile navigation implementation** - Replace horizontal nav with hamburger menu using Sheet component
  - Current: Cramped horizontal links with small targets, logo text hidden on mobile
  - Action: Implement Sheet drawer with large touch targets (56px), keep desktop horizontal nav
  - Files: `site-header.tsx`, create `mobile-nav.tsx` (optional bottom nav)
  - Effort: 3-4h | [See analysis](../design/mobile-first-optimization-analysis.md#1-site-header-site-headertsx)

- [x] **Form optimization** — ✅ COMPLETE (Nov 4, 2025)
  - Updated Input component: h-12 (48px) on mobile, h-10 (40px) on desktop
  - Updated Textarea component: min-h-[120px], text-base on mobile
  - Added inputMode="email" and inputMode="text" attributes to contact form
  - Contact form submit button: size="lg" (40px height), full-width on mobile
  - Textarea set to resize-none for better mobile UX
  - Better font sizing: text-base on mobile, text-sm on desktop
  - Files changed: `ui/input.tsx`, `ui/textarea.tsx`, `contact-form.tsx`

- [x] **Responsive spacing system** — ✅ COMPLETE (Nov 4, 2025)
  - Updated main layout padding: px-4 sm:px-6 md:px-8 (progressive enhancement)
  - Reduced mobile padding from px-6 to px-4 for more content space
  - Header updated with px-4 sm:px-6 md:px-8 padding
  - Files changed: `layout.tsx`, `site-header.tsx`

**Success Metrics:**
- ✅ All touch targets ≥ 44x44px
- ✅ Mobile navigation functional with large targets
- ✅ Form completion rate increase
- ✅ Lighthouse Accessibility: 100

**Reference:** [`/docs/design/mobile-first-optimization-analysis.md`](../design/mobile-first-optimization-analysis.md)

---

## 🚨 CRITICAL PRIORITY

**Impact:** Affects 50-70% of users (mobile traffic), blocks core content access  
**Timeline:** Complete within 1 week (~7-10 hours total)

### 1. Mobile Navigation Implementation ✅ **COMPLETE** (Nov 4, 2025)
**Status:** P0 Phase 1 now 4/4 complete!  
**Effort:** 3-4 hours  
**Completed:** All P0 foundation items now done (touch targets, forms, spacing, navigation)

**Implementation:**
- Created `mobile-nav.tsx` with Sheet drawer
- Large touch targets (56px height for all links)
- Hamburger menu on mobile (< md breakpoint)
- Desktop horizontal nav preserved (≥ md breakpoint)
- Auto-closes on navigation
- Active page indicator
- Files changed: `site-header.tsx`, new `mobile-nav.tsx`

**✅ Phase 1 Foundation Complete!** All critical mobile UX foundation items are now done.

---

### 2. Mobile Table of Contents for Blog Posts ✅ **ALREADY COMPLETE**
**Status:** Feature was already fully implemented!  
**Discovery:** Component at `table-of-contents.tsx` already has complete mobile support

**Existing Implementation:**
- ✅ Floating action button (FAB) at bottom-right
- ✅ Sheet drawer slides up from bottom on mobile (< xl breakpoint)
- ✅ Large touch targets (44px min-height for links)
- ✅ Active section tracking with IntersectionObserver
- ✅ Smooth scroll with 80px offset
- ✅ Auto-closes on navigation
- ✅ Appears after 400px scroll (consistent with BackToTop)
- ✅ Desktop: Fixed sidebar on right (≥ xl breakpoint)
- ✅ Already integrated in `blog/[slug]/page.tsx`

**No action needed** - Feature complete and working as specified!

---

### 3. Mobile Blog Typography Enhancements ✅ **ALREADY COMPLETE**
**Status:** Comprehensive mobile typography already implemented in `globals.css`  
**Discovery:** Lines 492-555 contain all specified mobile typography improvements

**Existing Implementation:**
- ✅ Larger base font: `1.0625rem` (17px) - iOS standard for readability
- ✅ Enhanced line-height: `1.85` - More breathing room on mobile
- ✅ Better paragraph separation: `1.25rem` margin-bottom
- ✅ Responsive heading sizes:
  - h1: `2rem` (32px)
  - h2: `1.75rem` (28px)
  - h3: `1.375rem` (22px)
- ✅ Optimized code blocks: `0.8125rem` (13px) font, bleeding edges for max width
- ✅ Inline code: `0.875rem` (14px)
- ✅ Better list spacing (0.5rem margins)
- ✅ Enhanced blockquote prominence
- ✅ All improvements scoped to `@media (max-width: 768px)`

**No action needed** - All critical typography improvements implemented and working!

---

## 🎉 ALL CRITICAL PRIORITIES COMPLETE!

**Achievement Unlocked:** All 🚨 CRITICAL priority items are done!

### Summary
1. ✅ **Mobile Navigation** - Completed Nov 4, 2025 (new implementation)
2. ✅ **Mobile Table of Contents** - Already complete (discovered existing implementation)
3. ✅ **Mobile Blog Typography** - Already complete (discovered existing implementation)

**Total Time Invested:** ~3-4 hours (mobile nav only, other items were already done)

**Impact:** Mobile-first foundation is 100% complete. All P0 items addressed. Ready to move to 🔴 HIGH PRIORITY items.

---

## 🔴 HIGH PRIORITY

**Impact:** Major UX improvements, design consistency, key interaction patterns  
**Timeline:** Weeks 1-2 after critical items

### Design System Implementation (NEW - Nov 8, 2025)

**Status:** Foundation complete (Phase 1 ✅), ready for Phase 2 execution  
**Priority:** High - Establishes consistency for all future work  
**Effort:** 27 hours remaining (33 total, 6 done)

#### Phase 1: Foundation ✅ **COMPLETE** (Nov 8, 2025)
- [x] Created `src/lib/design-tokens.ts` with TypeScript constants
- [x] Wrote comprehensive documentation (6 docs in `docs/design/`)
- [x] Defined container, typography, spacing, and hover patterns
- [x] Updated `docs/INDEX.md` with design system section

**Deliverables:** Design tokens, Quick Start, Executive Summary, Full Analysis, Design System Guide, Component Patterns, Implementation Roadmap

---

#### Phase 2: Page Updates (TODO - ~6 hours)
**Goal:** Standardize typography, containers, and spacing across all pages  
**Files:** 6 page files to update

- [ ] **Update H1 font weights** (~2 hours)
  - Projects page: Change `font-bold` → `font-semibold`
  - Contact page: Change `font-bold` → `font-semibold`
  - Import and use `TYPOGRAPHY.h1.standard` from design tokens
  - Files: `src/app/projects/page.tsx`, `src/app/contact/page.tsx`

- [ ] **Standardize page containers** (~3 hours)
  - Replace hard-coded container classes with `getContainerClasses()`
  - Update About page: `py-12 md:py-16` → `py-14 md:py-20`
  - Verify all pages use appropriate width (prose/standard/narrow)
  - Files: `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/blog/page.tsx`, `src/app/projects/page.tsx`, `src/app/contact/page.tsx`, `src/app/resume/page.tsx`

- [ ] **Fix prose spacing inconsistency** (~1 hour)
  - About page hero: Change `prose space-y-6` → `prose space-y-4`
  - Use `SPACING.proseHero` constant
  - Files: `src/app/about/page.tsx`

**Success Criteria:**
- All pages use `font-semibold` for H1
- All pages use consistent container patterns
- All prose wrappers use `space-y-4`
- No visual regressions

**Reference:** [`docs/design/implementation-roadmap.md`](../design/implementation-roadmap.md#phase-2-page-updates-week-1-2)

---

#### Phase 3: Component Updates (TODO - ~8 hours)
**Goal:** Standardize hover effects and card styling  
**Files:** 3 component files + 2 skeleton files

- [ ] **Update card hover effects** (~4 hours)
  - ProjectCard: Use `HOVER_EFFECTS.card` (change `-translate-y-1` → `-translate-y-0.5`)
  - PostList: Use `HOVER_EFFECTS.card` (add `hover:bg-muted/30`)
  - FeaturedPostHero: Use `HOVER_EFFECTS.cardFeatured`
  - Files: `src/components/project-card.tsx`, `src/components/post-list.tsx`, `src/components/featured-post-hero.tsx`

- [ ] **Update skeleton components** (~2 hours)
  - Ensure skeletons match updated card styles
  - Files: `src/components/project-card-skeleton.tsx`, `src/components/post-list-skeleton.tsx`

- [ ] **Update component documentation** (~2 hours)
  - Add design token imports to JSDoc examples
  - Document hover effect patterns
  - Link to design system docs
  - Files: Same as above

**Success Criteria:**
- All cards use consistent hover effects
- Skeletons match production components
- Component docs reference design tokens

**Reference:** [`docs/design/implementation-roadmap.md`](../design/implementation-roadmap.md#phase-3-component-updates-week-2-3)

---

#### Phase 4: Enforcement & Tooling (TODO - ~13 hours)
**Goal:** Prevent future inconsistencies with automation  
**Priority:** Medium (can be done incrementally)

- [ ] **ESLint rules for design tokens** (~3 hours)
  - Warn on hard-coded spacing values
  - Warn on hard-coded font weights
  - Warn on hard-coded container widths
  - Suggest design token imports

- [ ] **Visual regression tests** (~4 hours)
  - Set up Playwright
  - Create test snapshots for all pages (light/dark)
  - Create test snapshots for components
  - Add to CI pipeline

- [ ] **Interactive documentation site** (~6 hours)
  - Set up Storybook or similar
  - Add stories for all components
  - Add stories for design tokens
  - Deploy to Vercel subdomain or `/design-system` route

**Success Criteria:**
- ESLint catches common violations
- Visual regression tests in CI
- Interactive docs published
- Team onboarded to new patterns

**Reference:** [`docs/design/implementation-roadmap.md`](../design/implementation-roadmap.md#phase-4-enforcement--tooling-week-3)

---

### Mobile Navigation & Structure

#### 4. Bottom Navigation Bar ✅ **COMPLETE** (Nov 4, 2025)
**Effort:** 3-4 hours  
**Completed:** App-like navigation for primary destinations

**Implementation:**
- Created `bottom-nav.tsx` with grid layout
- 4 primary destinations: Home, Blog, Projects, Contact
- Icons from lucide-react (Home, FileText, FolderGit2, Mail)
- Large touch targets (64px height, full-width tap areas)
- Active state highlighting with color and bold stroke
- Fixed at bottom, mobile-only (< md breakpoint)
- Backdrop blur effect
- Files: `bottom-nav.tsx` (new), `layout.tsx` (updated)

**Additional Improvements:**
- Adjusted main padding to `pb-20 md:pb-0` (80px clearance on mobile)
- Updated BackToTop button position to `bottom-[104px] md:bottom-24`
- Updated TOC FAB button position to `bottom-[104px]` (consistent spacing)

---

#### 5. Post List Mobile Redesign (P1) ✅ **COMPLETE** (Nov 4, 2025)
**Effort:** 4-5 hours  
**Completed:** Vertical card layout with full-width images for mobile

**Implementation:**
- Vertical card layout on mobile (< md), horizontal on desktop (≥ md)
- Full-width 16:9 featured images on mobile (192px height)
- Simplified metadata: date + reading time (tags hidden on mobile)
- Entire card is now tappable with Link wrapper
- Content padding: p-3 sm:p-4 on mobile, optimized spacing on desktop
- Desktop maintains side thumbnail (128x96px) with horizontal layout
- Files: `post-list.tsx` (updated JSDoc and layout)

**Design improvements:**
- Better visual hierarchy with prominent images on mobile
- Cleaner metadata display focused on essential info
- Improved touch targets (entire card is tappable)
- Smooth responsive transition between mobile/desktop layouts
- Overflow hidden on article element for cleaner borders

---

#### 6. Project Card Optimization (P1) ✅ **COMPLETE** (Nov 4, 2025)
**Effort:** 2-3 hours  
**Completed:** Progressive disclosure with expandable highlights, stacked action buttons

**Implementation:**
- **Progressive disclosure:** Expandable "Key Features" accordion on mobile (< lg)
- Button shows highlight count with ChevronDown icon (rotates when expanded)
- Smooth animation: max-height transition (300ms ease-in-out)
- **Stacked action buttons:** Full-width on mobile with 44px touch targets
- Button-like styling with `bg-accent/50` background, converts to inline links on desktop
- **Enhanced spacing:** Progressive padding (px-4 sm:px-6), optimized font sizes
- **Desktop:** Always-visible highlights list, inline link layout
- Files: `project-card.tsx` (client component), new JSDoc documentation

**Features:**
- ✅ Expandable highlights with smooth accordion animation
- ✅ Full-width stacked buttons on mobile (w-full sm:w-auto)
- ✅ 44px minimum touch targets for all actions
- ✅ ARIA attributes (aria-expanded, aria-controls) for accessibility
- ✅ Keyboard navigation support (Button component)
- ✅ Responsive font sizes and spacing
- ✅ Desktop: Always-visible highlights, inline links

**Documentation:** `/docs/components/project-card.md` (comprehensive guide)

---

### Mobile Interactions

#### 7. Native Share API for Blog Posts (P1)
**Effort:** 1-2 hours  
**Why High:** Common mobile user action, quick win

**Action:** Mobile-optimized sharing
- Web Share API with fallback
- Larger touch targets (44x44px)
- Icon-only layout on mobile
- Native share sheet on mobile devices
- Files: `share-buttons.tsx`

**Reference:** [`/docs/design/mobile-blog-improvements-brainstorm.md#a-share-buttons-mobile-optimization`](../design/mobile-blog-improvements-brainstorm.md#a-share-buttons-mobile-optimization)

---

#### 8. Swipe Gestures (P1)
**Effort:** 4-5 hours  
**Why High:** Expected mobile interaction pattern

**Action:** Blog post prev/next navigation, card actions
- Swipe-left/right for post navigation
- Visual indicators
- Library: react-swipeable or Framer Motion drag
- Files: Blog post pages, card components

**Reference:** [`/docs/design/mobile-first-optimization-analysis.md#1-swipe-navigation-for-blog-posts`](../design/mobile-first-optimization-analysis.md#1-swipe-navigation-for-blog-posts)

---

#### 9. Active States & Feedback (P1)
**Effort:** 2-3 hours

**Action:** Scale animations, ripple effects
- Add active:scale-[0.98] to cards
- Tap feedback animations
- Better visual feedback on touch

---

#### 10. Jump to Top Button for Blog Posts
**Effort:** 1-2 hours

**Action:** Floating FAB that appears on scroll
- Bottom-right floating button
- Fade-in after scrolling 2-3 viewports
- Smooth scroll animation
- Consider combining with TOC button in FAB menu or opposite corner
- Files: New component `jump-to-top.tsx`, integrate in `blog/[slug]/page.tsx`

**Reference:** [`/docs/design/mobile-blog-improvements-brainstorm.md#b-jump-to-top-button`](../design/mobile-blog-improvements-brainstorm.md#b-jump-to-top-button)

---

## 🟡 MEDIUM PRIORITY

**Impact:** Enhancements to working features, performance optimization  
**Timeline:** Weeks 3-4 and beyond

### Mobile Blog Enhancements

#### Blog Badge Overflow Handling
- [x] Back to top button (floating FAB with scroll detection)
- [x] Navigation loading bar (top progress bar for route transitions)
- [x] `prefers-reduced-motion` support (hook + comprehensive CSS rules)

**Phase 1.5: Blog Featured Images & Animations** ✅ **COMPLETE** (Nov 3, 2025 - ~5 hours)
- [x] Extended Post type with optional `image` field (url, alt, width, height, caption, credit, position)
- [x] Created `PostThumbnail` component with next/image optimization
- [x] Updated `PostList` with conditional thumbnail rendering
- [x] Built `useScrollAnimation` hook with IntersectionObserver + prefers-reduced-motion
- [x] Created `ScrollReveal` wrapper component for scroll animations
- [x] Applied staggered fade-in animations to post list items

**Phase 2: Blog Image System & Detail Pages** (~8-10 hours) 🆕
- [ ] **Hero image component** - Full-width hero with gradient overlays for post detail pages
- [ ] **Image caption display** - Caption and credit rendering below images
- [ ] **OG image integration** - Use featured images for social shares (fallback to generated)
- [ ] **Magazine layout variant** - Alternate large image left/right layout for PostList
- [ ] **Grid layout variant** - 2-column grid with images on top
- [ ] **Related posts with images** - Update RelatedPosts component to show thumbnails
- [ ] **RSS feed images** - Include featured images in RSS/Atom feeds with `<enclosure>` tags
- [ ] **Frontmatter schema docs** - Document image field in `/docs/blog/frontmatter-schema.md`

**Phase 3: Enhanced Interactions** (~26 hours)
- [ ] **Enhanced table of contents** - Sliding active indicator, smoother expand/collapse
- [ ] **Toast improvements** - Custom enter/exit animations for sonner, success micro-animations
- [ ] **GitHub heatmap polish** - Staggered square appearance, animated tooltips, smooth data loading transition
- [ ] **Theme transition animations** - Smooth dark/light mode switch without FOUC
- [ ] **Parallax hero images** - Subtle parallax effect for hero images (desktop only, 0.8x scroll speed)
- [ ] **Progressive image blur** - Images start blurred and sharpen as they load

**Phase 4: Advanced Features** (~74 hours)
- [ ] **Command palette (Cmd+K)** - Search posts, navigate site, keyboard shortcuts (cmdk + Radix UI)
- [ ] **Page transition system** - View Transitions API (primary) + Framer Motion fallback
- [ ] **Micro-interactions library** - Reusable animated components (button ripples, input focus effects, success/error animations)
- [ ] **Virtual scrolling** - For blog list with >50 posts (@tanstack/virtual)
- [ ] **Reading mode toggle** - Distraction-free interface (hide header/footer, adjust typography)
- [ ] **Advanced gestures** - Swipe navigation on mobile, pull-to-refresh, drag-to-share
- [ ] **3D card tilt effect** - Subtle tilt on hover for project cards (vanilla-tilt or Framer Motion)
- [ ] **Image galleries** - Multiple images per post with lightbox viewer
- [ ] **Pull quotes** - Styled blockquotes with custom borders and typography

**Phase 5: Future Considerations** (Backlog - no timeline)
- [ ] Infinite scroll for blog list
- [ ] Keyboard navigation (j/k for posts, Esc to close)
- [ ] Progressive image loading (LQIP)
- [ ] Blog post preview on hover (tooltip with excerpt)

---

### Resume Page Enhancements

**Quick Wins Completed** ✅ (Nov 5, 2025 - ~2 hours)
- [x] **Print CSS** - Print-optimized layout with hidden nav, adjusted spacing
- [x] **GitHub heatmap integration** - Visual proof of development activity in Skills section
- [x] **Collapsible certifications** - Mobile-friendly expandable cert display (fixes overflow)
- [x] **Metric highlighting** - Bold/colored emphasis for achievements (23%, 35%, 40%)
- [x] **Semantic HTML** - article, section, header, time elements with ARIA labels

**Files Modified:**
- `src/app/resume/page.tsx` - Added print styles, semantic HTML, metric highlighting
- `src/components/collapsible-certifications.tsx` - New component for expandable certs
- `src/lib/highlight-metrics.tsx` - Utility to parse and style quantifiable achievements

---

**Phase 1: Professional Polish** (~6-8 hours)
- [ ] **Timeline visualization** - Visual timeline for experience with duration bars
- [ ] **Certification verification links** - Clickable badges linking to Credly/verification
- [ ] **Download options** - PDF generation (jsPDF or server route), JSON export
- [ ] **Company logos** - Small logos/favicons next to experience cards

**Phase 2: Interactive Features** (~8-10 hours)
- [ ] **Skills search/filter** - Debounced search like blog-search-form (100+ skills)
- [ ] **Skills proficiency levels** - Visual indicators for expertise (dots, bars, gradients)
- [ ] **Dynamic summary toggle** - Switch between shortSummary and full summary
- [ ] **Dark mode optimization** - Better badge contrast and readability

**Phase 3: Advanced Features** (~12-16 hours)
- [ ] **View analytics** - Redis-backed view counter like blog posts
- [ ] **Testimonials carousel** - Rotating quotes from colleagues/LinkedIn
- [ ] **"Ask About My Resume" AI chat** - Interactive Q&A chatbot
- [ ] **A/B testing layouts** - Track conversion to /contact after /resume visit

**Phase 4: Future Exploration** (Backlog)
- [ ] **Multi-language support** - i18n for PT, ES translations
- [ ] **Dynamic resume generator** - Admin interface or headless CMS integration
- [ ] **Component extraction** - Create `resume/` component directory like `/about`

---
- [ ] Animated mesh backgrounds (hero sections)
- [ ] Font size controls (user preference)
- [ ] Reading time indicator (live progress)
- [ ] Multi-author support with author cards
- [ ] Post series indicator and navigation

**Reference:** [`/docs/design/ui-ux-optimization-roadmap.md`](../design/ui-ux-optimization-roadmap.md) - Complete analysis, code examples, and implementation guide

---

## 🔧 Technical Improvements

### Performance
- None currently - all optimized

### SEO & Accessibility
- [x] **Vercel OG image generation** - Dynamic social preview images using Vercel's OG API (✅ Complete - see `/docs/features/og-image-generation.md`)

### Security (Post-Analysis, Oct 28)
- [ ] **CSP Violation Monitoring** - Integrate Sentry for centralized CSP violation tracking and alerts (Effort: 1-2h) | [See security analysis](../security/FINDINGS_AND_ACTION_ITEMS.md#1-set-up-csp-violation-monitoring-medium-priority)
- [ ] **Privacy Policy Documentation** - Create GDPR/CCPA compliant privacy policy (Effort: 2-3h) | [See security analysis](../security/FINDINGS_AND_ACTION_ITEMS.md#2-create-privacy-policy--data-retention-documentation-medium-priority)
- [ ] **Incident Response Plan** - Document security incident procedures and escalation paths (Effort: 1-2h) | [See security analysis](../security/FINDINGS_AND_ACTION_ITEMS.md#3-document-security-incident-response-plan-medium-priority)
- [ ] **CSP Level 3 Implementation** - Add `'strict-dynamic'` support for next-generation CSP (Effort: 1h) [OPTIONAL]
- [ ] **Security Monitoring Dashboard** - Create analytics dashboard for CSP violations and rate limiting (Effort: 2-3h) [OPTIONAL]

### Monitoring
- [ ] **Error tracking** - Consider Sentry or similar for error monitoring (integrates with CSP monitoring above)
- [ ] **Custom analytics events** - Track specific user interactions
- [ ] **Performance monitoring** - Set up performance budgets and alerts
- [ ] **Uptime monitoring** - Configure uptime monitoring service

---

## 📝 Content & Design

### Blog Posts
- [ ] Write about implementing GitHub contributions heatmap
- [ ] Write about security best practices for Next.js apps
- [ ] Write about MDX setup and customization
- [ ] Document Tailwind v4 migration experience

### Pages
- [ ] Expand About page with more personal background
- [ ] Add speaking/presentations section if applicable
- [ ] Consider adding a /uses page (tools, software, setup)

### UI & Layout
- [ ] **Mobile navigation** - Improve mobile menu if navigation grows
- [ ] **Micro-interactions** - Add subtle animations and transitions
- [ ] **Grid layout for projects** - Consider card grid instead of list
- [ ] **Blog post formatting** - Review typography and spacing
- [ ] **Footer enhancements** - Add more useful links/info to footer

---

## 🔄 Dependencies & Maintenance

- [ ] **Automated dependency updates** - Set up Dependabot or Renovate
- [ ] **Quarterly dependency review** - Review and update dependencies regularly
- [ ] **Security advisories** - Monitor for security advisories
- [ ] **Next.js 16 migration** - Stay updated on Next.js 16 features and migration path
- [ ] **Turbopack production** - Monitor Turbopack production build support

---

## 💡 Ideas & Future Enhancements

### Homepage Improvements (Nov 4, 2025)
**Recently Completed:**
- ✅ **Featured Post Hero** - Large prominent card showcasing featured blog posts (Nov 4)
- ✅ **Scroll Reveal Animations** - Fade-up animations for homepage sections (Nov 4)

**Tier 1: Quick Wins (High Impact, Low Effort)**
- [ ] **GitHub Contribution Heatmap on Homepage** - Shows activity, builds technical credibility
  - Component already exists (`github-heatmap.tsx`)
  - Just needs import and placement between hero and latest articles
  - Effort: 5-10 minutes
  
- [ ] **Stats/Metrics Section** - Quantifiable expertise display
  - Total blog posts published
  - Projects completed
  - Years of experience
  - Technologies mastered
  - Effort: 30 minutes
  
- [ ] **Better Section Spacing** - Improve visual hierarchy
  - Increase spacing from 12-16 to 16-24
  - Add subtle dividers or visual breaks
  - Make section headers more distinctive
  - Effort: 15 minutes

**Tier 2: High Value Additions (Weekend Project)**
- [ ] **Tech Stack Visualization** - Show expertise with icon grid
  - React, Next.js, TypeScript, Tailwind
  - Security tools/frameworks
  - Cloud platforms
  - Simple icon grid or logo cloud
  - Effort: 2-3 hours
  
- [ ] **Newsletter Signup Section** - Most important for growth!
  - Form component pattern already exists (contact form)
  - Add email capture above footer
  - Integrate with newsletter service (Resend, ConvertKit, etc.)
  - Build audience
  - Effort: 2-3 hours
  
- [ ] **Popular/Trending Posts Section** - Social proof via view counts
  - Show "Hot" posts (view count based)
  - Separate from "Latest" articles
  - View count system already implemented
  - Effort: 1-2 hours
  
- [ ] **Tag Cloud / Popular Topics** - Content discovery + SEO
  - Show most-used blog tags
  - Visual sizing based on usage
  - Clickable (links to `/blog?tag=<tag>`)
  - Effort: 1-2 hours
  
- [ ] **Social Links Section** - More prominent social presence
  - Dedicated section vs. just footer
  - Larger icons with hover effects
  - "Let's connect" framing
  - Links already in `socials.ts`
  - Effort: 1 hour

**Tier 3: Nice-to-Have Enhancements**
- [ ] **Testimonials/Recommendations** - LinkedIn recommendations, client testimonials, peer endorsements
- [ ] **Recent Activity Timeline** - Blog posts, project updates, GitHub activity, talks/appearances
- [ ] **Call-Out Boxes** - "Currently learning...", "Available for consulting", "Latest project..."
- [ ] **Better CTA Strategy** - More specific/action-oriented calls-to-action
- [ ] **Mobile Post Carousel** - Swipeable post cards on mobile, native app-like feel

**Tier 4: Advanced Features (Future)**
- [ ] **Newsletter Preview** - Show latest newsletter issue, drive subscriptions
- [ ] **Live Search on Homepage** - Quick access to content, search-first experience
- [ ] **Interactive Filters** - Filter posts by technology, projects by type
- [ ] **Personalization** - Remember preferences, suggest content, adaptive layout
- [ ] **A/B Testing** - Test different hero copy, CTA placement, data-driven optimization

### Content & Interactivity
- [ ] **Interactive demos** - Add interactive code examples to blog posts
- [ ] **MDX components library** - Build custom MDX components for richer content
- [ ] **Video content integration** - Support for video content
- [ ] **Podcast/audio content** - Audio content support

---

## 📝 Blog Feature Enhancements (Future Improvements)

**Status:** Added Nov 5, 2025 - Comprehensive blog improvement backlog

### Quick Wins Already Implemented ✅
- [x] **Pagination** - 12 posts per page with Previous/Next navigation (Nov 5)
- [x] **Reading Time Filters** - Quick (<5min), Medium (5-15min), Deep (>15min) (Nov 5)
- [x] **Breadcrumb Navigation** - Hierarchical navigation in blog posts (Nov 5)
- [x] **Post Series/Collections** - Multi-part content organization with dedicated pages (Nov 5)
- [x] **Social Sharing** - ShareButtons component already integrated
- [x] **Comments System** - Giscus (GitHub Discussions) already integrated

### Medium Effort (3-5 days each)
- [ ] **Popular Posts Widget** — Sidebar showing top 5 posts by views (Redis-backed), updates daily
- [ ] **Bookmark/Reading List** — Let readers save posts for later, localStorage for anonymous users
- [ ] **Post Reactions** — Quick emoji reactions (👍 ❤️ 🔥 💡) beyond view counts, Redis counters + client UI
- [ ] **Keyboard Shortcuts** — `/` for search, `n`/`p` for next/prev post, `t` for TOC toggle, power user feature
- [ ] **Print-Friendly Styling** — `@media print` CSS rules for clean printing/PDF export
- [ ] **Advanced Search Filters** — Date range picker, multiple tag selection, sort by popularity/date/reading-time
- [ ] **Newsletter Signup Widget** — Email capture form (integrate with Buttondown, ConvertKit, or Mailchimp)

### Major Projects (1-2 weeks each)
- [ ] **Full-Text Search** — Replace client-side search with Meilisearch/Algolia/SQLite FTS for better quality and search analytics
- [ ] **Content Analytics Dashboard** — `/admin` route with charts, post performance, search queries, engagement metrics (query Redis)
- [ ] **Infinite Scroll Option** — Auto-load more posts on scroll (alternative to pagination), Intersection Observer + dynamic loading
- [ ] **Reading History & Recommendations** — Track read posts, recommend based on history, localStorage tracking + tag-based suggestions
- [ ] **Post Scheduling System** — Schedule posts for future publication, `scheduledAt` frontmatter + build hook or cron job
- [ ] **Draft Preview Sharing** — Shareable preview links for draft posts with secret token auth

### Future Considerations (Complex/Lower Priority)
- [ ] **PWA / Offline Reading** — Service worker for offline post access, read saved posts without internet (high complexity)
- [ ] **Multi-Author Support** — Author profiles, filter by author (only needed if expanding beyond solo blog)
- [ ] **Code Playground Embeds** — Interactive code editors (CodeSandbox, StackBlitz) embedded in posts
- [ ] **AI-Powered Summaries** — Auto-generate TL;DR using GPT during build (OpenAI API)
- [ ] **Post Translation** — Multi-language support for international readers (i18n)
- [ ] **Audio Version** — Text-to-speech or recorded audio versions of posts
- [ ] **Related Posts by ML** — Use embeddings/vectors for smarter recommendations beyond tag matching
- [ ] **Post Edit History** — Show changelog/version history for updated posts
- [ ] **Collaborative Editing** — Allow guest authors or co-authors
- [ ] **Post Templates** — Pre-built templates for tutorials, announcements, essays
- [ ] **Table of Contents Improvements** — Nested TOC, progress tracking per section, estimated time per section

**Impact:** These enhancements focus on content discovery, reader engagement, and content management workflows.  
**Reference:** Blog improvements brainstorm session (Nov 5, 2025)

---

## 🎨 Blog Search & Filter UI Improvements (Backlog)

**Status:** Added Nov 5, 2025 - P0 Quick Wins Complete!

### ✅ Implemented (Nov 5, 2025)
- [x] **Remove "Reading time:" label** - Badges are self-explanatory, cleaner UI
- [x] **Remove Search button** - Auto-submit on type (250ms debounce), one less click
- [x] **Active filter pills** - Dismissible chips showing query/tag/reading time with individual X buttons
- [x] **Clear all filters link** - Single click to reset all active filters
- [x] **Improved badge contrast** - Active = `default` variant (solid), Inactive = `outline`, hover states

**Files Changed:**
- `src/app/blog/page.tsx` - Removed label, updated badge variants, added ActiveFilters
- `src/components/blog-search-form.tsx` - Removed Search button and imports
- `src/components/active-filters.tsx` - New component for dismissible filter pills

**Impact:** Cleaner, simpler UI with better visual feedback and one-click filter management

---

### P1: High Impact Improvements (3-5 hours each)

- [ ] **Collapsible Tag List**
  - Show top 5-8 most popular tags by default
  - "Show more tags" button to expand full list
  - Reduces visual overwhelm for growing tag collections
  - Effort: 2-3 hours

- [ ] **Combine Reading Time into Search Bar**
  - Add dropdown/select inside search bar: `[Search posts...] [All times ▾]`
  - Saves vertical space, groups related filters
  - Stack on mobile for responsive design
  - Effort: 3-4 hours

- [ ] **Sticky Filter Bar**
  - Make filter section sticky after scrolling past header
  - Easy to refine search without scrolling back
  - Common pattern in e-commerce/search UIs
  - Effort: 1-2 hours

- [ ] **Keyboard Shortcuts**
  - `/` - Focus search bar
  - `Esc` - Clear search/filters
  - `↓/↑` - Navigate results (future)
  - Add tooltip documentation
  - Effort: 2-3 hours

- [ ] **Smart Sorting Toggle**
  - Add sort options: Latest (default) | Popular (views) | Relevant (when searching)
  - Better discovery and multiple browsing modes
  - Effort: 3-4 hours

---

### P2: Mobile-Specific Improvements (5-8 hours)

- [ ] **Bottom Sheet Filters (Mobile)**
  - "Filters" button opens bottom sheet modal
  - Contains: Search, Reading time, Tags, Apply/Clear
  - More space for results on small screens
  - Similar to existing TOC sheet pattern
  - Effort: 6-8 hours

- [ ] **Horizontal Scroll Tags (Mobile)**
  - Single row with horizontal scroll instead of wrapping
  - Snap scroll with fade indicators at edges
  - Saves vertical space
  - Effort: 2-3 hours

- [ ] **Floating Filter FAB (Mobile)**
  - Floating button like TOC FAB
  - Opens filter bottom sheet
  - Badge shows active filter count
  - Maximizes content space
  - Effort: 4-5 hours

---

### P3: Advanced Features (8+ hours)

- [ ] **Search Suggestions/Autocomplete**
  - Dropdown showing: Recent searches, Popular tags, Matching post titles
  - Faster search and improved discovery
  - Effort: 8-10 hours

- [ ] **Tag Search/Filter**
  - Search bar within tag list (for 50+ tags)
  - Scalability for growing tag collection
  - Effort: 2-3 hours

- [ ] **Saved Searches**
  - Save filter combinations in localStorage
  - Power user workflow optimization
  - Effort: 5-6 hours

- [ ] **Pretty Filter URLs**
  - SEO-friendly URLs like `/blog/quick-reads/typescript`
  - More shareable, better for SEO
  - Effort: 6-8 hours

**Guiding Principles:**
- **Simplicity** - Remove visual noise, consolidate elements
- **Progressive Disclosure** - Hide complexity until needed
- **Clear Feedback** - Obvious active states, easy dismissal
- **Mobile-First** - Appropriate patterns for small screens

**Reference:** Search/filter UI brainstorm session (Nov 5, 2025)

---

### Technical Exploration
- [ ] **WebAssembly integration** - Experiment with WASM for performance-critical features
- [ ] **Edge functions** - Explore edge runtime for certain API routes
- [ ] **Multi-language support (i18n)** - Internationalization support

### Optional Integrations
- [ ] **Git MCP** - Consider @modelcontextprotocol/server-git for direct git operations
- [ ] **Discord MCP** - Deployment notifications and team updates

---

## 📊 Analytics Dashboard Enhancements (Backlog)

### TIER 1: ✅ COMPLETE (Nov 5, 2025)
**Status:** All quick wins implemented successfully!

- [x] **Sortable Table Columns** — Click-to-sort on views, 24h views, published date, title, and range views. Visual indicators (↑/↓). Preference saved in URL state.
- [x] **Date Range Selector** — Toggle between 24h/7d/30d/90d/All Time. All metrics update based on selection. Uses existing Redis sorted sets.
- [x] **Search & Filter Posts** — Search bar for title filtering, multi-select tag filter, filter by post status. Active filter count badge shows applied filters.
- [x] **Export to CSV/JSON** — Download buttons for full analytics dataset. Respects current filters/date range. Includes metadata.
- [x] **Auto-Refresh Toggle** — Polling option (every 30s), manual refresh button with loading spinner, last updated timestamp display.
- [x] **URL State Persistence** — All filters, sorting, date range saved in URL params. Enables sharing views and browser back/forward navigation.

**Implementation Notes:**
- Added new backend functions: `getPostViewsInRange()`, `getMultiplePostViewsInRange()` in `src/lib/views.ts`
- API route now accepts `?days=1|7|30|90|all` parameter for flexible date ranges
- Client component uses Next.js `useRouter` and `useSearchParams` for URL state management
- Export functions generate timestamped CSV/JSON files with full metadata
- Auto-refresh uses 30-second interval with visual loading indicators

### TIER 2: Enhanced Insights (Medium Priority)
**Goal:** Visual analytics and deeper insights into content performance

- [ ] **Visual Trend Charts** — Add recharts or tremor for line charts (views over time), bar charts (top 10 comparison), area charts (cumulative by tag)
- [ ] **Sparkline Trends in Table** — Mini 7-day view trend chart in each row. Color-coded (green = up, red = down, gray = stable)
- [ ] **Historical Data Snapshots** — Daily/weekly/monthly rollups via Inngest. Store in Redis as `analytics:snapshot:{date}`. Enable week-over-week comparisons.
- [ ] **Tag Performance Dashboard** — Dedicated view showing analytics by tag, average views per tag, most popular tags by post count vs views, tag growth trends
- [ ] **Post Lifecycle Labels** — Auto-detect and badge posts: "🔥 Viral" (5x spike), "🌲 Evergreen" (consistent 30+ days), "📈 Rising" (20%+ growth), "📉 Declining" (30%+ drop), "🆕 Fresh" (<7 days old)
- [ ] **Content Performance Metrics** — Views per day since publication (velocity), peak views with timestamp, reading time vs views correlation, tag combination performance

### TIER 3: Advanced Analytics (Low Priority / Future)
**Goal:** Production-ready analytics with engagement tracking and intelligence

- [ ] **Engagement Tracking** — Client-side instrumentation: scroll depth (25/50/75/100%), time on page buckets, code block copy events, external link clicks
- [ ] **Real-Time Updates** — WebSocket or SSE for live view counter, "someone is reading now" indicator, throttled updates
- [ ] **Advanced Trending Algorithm** — Weighted scoring: `(views24h * recency) + (velocity * momentum) + (totalViews * authority)`. Factor in recency, velocity (views/hour), authority boost, time decay
- [ ] **Referrer & Traffic Analysis** — Privacy-respecting referrer tracking via `document.referrer`. Categorize: Direct/Social/Search/Internal. Top referrers by domain, UTM support
- [ ] **Goal & Conversion Tracking** — Track conversions from blog posts: newsletter signups with source post, contact form submissions, GitHub repo stars, project page visits, related post clicks

### UX & Visual Enhancements (Backlog)
- [ ] **Improved Visual Hierarchy** — Color-coded performance tiers (green/yellow/red), larger trending indicators, better mobile/tablet responsive layout, sticky table headers
- [ ] **Contextual Tooltips** — Explain metrics on hover ("What is views24h?"), show formulas for calculated metrics, tips for improving performance
- [ ] **Comparative Views** — Side-by-side: this week vs last week, this month vs last month, post A vs B comparison mode, personal best highlights
- [ ] **Simplified Mobile View** — Swipeable cards for top posts, collapsible sections, touch-optimized filters, portrait-oriented charts

### Technical Architecture (Backlog)
- [ ] **Optimized Data Layer** — Improve Redis key structure: `analytics:post:{id}:views:hourly/daily`, `analytics:global:summary`, `analytics:tags:{tag}:summary`
- [ ] **Background Aggregation Jobs** — Inngest functions: hourly rollups, daily snapshots/lifecycle labels, weekly tag performance, monthly archival
- [ ] **API Query Optimizations** — Parallel Redis queries with `Promise.all()`, response caching (5-10s TTL), server-side filtering/sorting, incremental loading

**Reference:** Full brainstorm in analysis session (Nov 5, 2025)

---

## � Completed Work

All completed tasks have been moved to **`done.md`** for historical reference.

See `/docs/operations/done.md` for:
- Session summaries with dates and accomplishments
- Project statistics and metrics
- Lessons learned and patterns established
- Documentation coverage tracking
- Key achievements and milestones

---

## 📋 Quick Reference

### Project Conventions
- Documentation: `/docs` directory
- Imports: Use `@/*` alias consistently
- Components: Server-first, add `"use client"` when needed
- Styling: Tailwind utilities only
- Types: TypeScript strict mode

### Before Committing
- Update `updatedAt` in blog post frontmatter for content changes
- Run `npm run lint`
- Test with `npm run build`
- Review Lighthouse scores for major UI changes

---

## 🔧 Configuration & Architecture (Backlog)

### Site Configuration Centralization
**Status:** ✅ Phase 1 Complete (Nov 5, 2025)  
**Goal:** Centralize all site configuration for easier maintenance and type safety

**Completed:**
- ✅ **FEATURES** config - Feature flags for all toggleable features
- ✅ **CONTENT_CONFIG** - Display settings, reading metrics, badges, TOC, code themes
- ✅ **SERVICES** config - External service integration (GitHub, Redis, Giscus, Resend, Inngest, Vercel)
- ✅ TypeScript types exported (`SiteConfig` type)
- ✅ Example refactor: `giscus-comments.tsx` now uses centralized config

**Remaining Work:**
- [ ] **Refactor components to use centralized config**
  - Update components with hardcoded values (views, badges, TOC, related posts, etc.)
  - Replace direct `process.env` checks with `siteConfig.services.*.enabled`
  - Pattern: See `giscus-comments.tsx` for reference implementation
  
- [ ] **SEO_CONFIG** - SEO & metadata defaults (locale, Twitter, OG images, sitemap priorities, robots, schemas)
- [ ] **SECURITY_CONFIG** - Rate limits per endpoint, CSP settings, CORS
- [ ] **NAV_CONFIG** - Header/footer links, mobile breakpoints, logo
- [ ] **THEME_CONFIG** - Default theme, fonts, logo paths/sizes
- [ ] **CACHE_CONFIG** - ISR revalidation times, server cache durations, SWR
- [ ] **ANALYTICS_CONFIG** - Tracking preferences, privacy settings, custom events
- [ ] **CONTACT_CONFIG** - Email settings, form validation, calendar
- [ ] **BLOG_CONFIG** - Content dir, visibility rules, feeds, search, defaults

**Benefits:**
- Single source of truth for all configuration
- Type-safe config access across codebase
- Easier environment management
- Centralized feature toggling
- Better documentation through structure

---

## ⚙️ Automation & CI (Recommended backlog)

Small, low-risk automation items to pick up (prioritized):

- [ ] **GitHub Actions CI** — Add a lightweight CI workflow that runs `npm ci`, `npm run check` (lint + typecheck), and `npm run build`. Cache node modules and `.next/cache` to speed runs.
- [ ] **Snyk scan in CI** — Run `snyk test` as an optional step when `SNYK_TOKEN` is provided (store token in GitHub Secrets). This provides authenticated vulnerability checks and reporting.
- [ ] **Husky + lint-staged** — Install and configure to run `prettier --write` and `eslint --fix` on staged files to keep PRs clean.
- [ ] **Dependabot / Renovate** — Configure automated dependency update PRs (weekly) for npm packages.
- [ ] **Cache build artifacts** — Preserve `.next/cache` between CI runs keyed by lockfile + Node version.
- [ ] **Lighthouse / Performance checks** — Add an optional Lighthouse CI job to track performance regressions on the main branch.

These are intentionally low-risk and incremental. Prioritize `GitHub Actions CI` and `Dependabot` first.

---

## 🎨 About Page Enhancements (Backlog)

**Phase 2 - Enhanced UX** (Medium Priority):
- [ ] **Interactive Timeline** — Replace card-based "Previously" section with vertical timeline with connection lines, animated reveals on scroll, expandable cards
- [ ] **Featured Blog Posts Section** — Show 2-3 recent/featured posts with snippets to drive engagement and showcase expertise
- [ ] **Downloadable Resume Button** — Add PDF download option near "View full resume" link with download icon
- [ ] **Mission Statement Callout** — Prominent highlighted quote box for "security as enabler" philosophy with accent styling
- [ ] **Enhanced Personal Interests** — Expand "Outside work" with specific hobbies, side projects (this site!), community involvement details

**Phase 3 - Advanced Features** (Low Priority):
- [ ] **Testimonials/Recommendations** — Add rotating testimonials or static quotes from LinkedIn with attribution and company logos
- [ ] **FAQ/Quick Facts Accordion** — Expandable sections for common questions (work approach, industries, consulting availability, tech stack preferences)
- [ ] **Community Contributions Display** — Reuse GitHub heatmap component to show open source contributions and blog post frequency
- [ ] **Interactive Career Map** — Geographic visualization of companies worked at with logos and tooltips
- [ ] **Currently Available Status** — Toggle indicator for consulting/collaboration availability with booking calendar link
- [ ] **Reading List Integration** — Sync with Goodreads to show currently reading book and security recommendations

**Implementation Notes:**
- All Phase 2/3 items should follow existing design patterns (shadcn/ui, Tailwind, responsive-first)
- Use `ScrollReveal` component for animations
- Maintain accessibility standards (keyboard nav, ARIA labels)
- Keep mobile experience optimized
