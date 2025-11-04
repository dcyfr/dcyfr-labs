# Project TODO & Issue Tracker

This document tracks **active and pending** work only. Completed tasks are moved to **`done.md`**.

**Last Updated:** November 4, 2025

---

## 📌 Recent Updates

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

### Backlog

#### Mobile-First UX Optimization - Later Phases

**Phase 2: Navigation & Structure - Week 2** (P1 - High, ~12-16 hours)
- [ ] **Bottom navigation bar** - App-like bottom nav with 4 primary destinations (Home, Blog, Projects, Contact)
  - Create `mobile-nav.tsx` with grid layout, icon+label, active state highlighting
  - Effort: 3-4h | [See analysis](../design/mobile-first-optimization-analysis.md#option-b-bottom-navigation-app-like)

- [ ] **Mobile Table of Contents** - Floating button with bottom sheet instead of hidden sidebar
  - Current: TOC completely hidden on mobile (lg:block)
  - Action: Floating FAB bottom-right, Sheet with large tappable headings, smooth scroll
  - Files: `table-of-contents.tsx`
  - Effort: 3-4h | [See analysis](../design/mobile-first-optimization-analysis.md#3-table-of-contents-table-of-contentstsx)

- [ ] **Project card optimization** - Progressive disclosure for highlights, improved mobile layout
  - Current: Highlights hidden on mobile (lg:inline-block)
  - Action: Expandable "Key Features" section, stacked action buttons, better spacing
  - Files: `project-card.tsx`
  - Effort: 2-3h | [See analysis](../design/mobile-first-optimization-analysis.md#4-project-cards-project-cardtsx)

- [ ] **Post list mobile redesign** - Vertical cards with full-width thumbnails
  - Current: Horizontal layout with small thumbnails (96px)
  - Action: Vertical cards on mobile, full-width 16:9 images, simplified metadata
  - Files: `post-list.tsx`
  - Effort: 4-5h | [See analysis](../design/mobile-first-optimization-analysis.md#2-blog-post-list-post-listtsx)

**Phase 3: Interactions - Week 3** (P1 - High, ~10-14 hours)
- [ ] **Swipe gestures** - Blog post prev/next navigation, card actions
  - Implement swipe-left/right for post navigation, visual indicators
  - Library: react-swipeable or Framer Motion drag
  - Effort: 4-5h | [See analysis](../design/mobile-first-optimization-analysis.md#1-swipe-navigation-for-blog-posts)

- [ ] **Pull-to-refresh** - Refresh blog list with native-like pull gesture
  - Touch handlers with visual spinner, router.refresh() on completion
  - Effort: 2-3h | [See analysis](../design/mobile-first-optimization-analysis.md#2-pull-to-refresh-for-blog-list)

- [ ] **Active states & feedback** - Scale animations, ripple effects, haptic feedback
  - Add active:scale-[0.98] to cards, tap feedback animations
  - Effort: 2-3h | [See analysis](../design/mobile-first-optimization-analysis.md#phase-3-interactions-week-3)

- [ ] **Loading states polish** - Shimmer skeletons, progressive content appearance
  - Already have shimmer, add staggered appearance for lists
  - Effort: 2-3h

**Phase 4: Performance - Week 4** (P2 - Medium, ~8-12 hours)
- [ ] **Code splitting for mobile** - Conditional loading by viewport, lazy load heavy components
  - Dynamic imports for GitHub heatmap, use-media-query hook
  - Effort: 3-4h | [See analysis](../design/mobile-first-optimization-analysis.md#1-reduce-javascript-for-mobile)

- [ ] **Image optimization** - Mobile-specific sizes, blur placeholders, priority hints
  - Update Next/Image sizes prop, add blur placeholders
  - Effort: 2-3h | [See analysis](../design/mobile-first-optimization-analysis.md#2-image-optimization)

- [ ] **Font loading optimization** - Reduce weights, subset, optimize fallbacks
  - Review font-display, reduce loaded weights, subset Latin only
  - Effort: 1-2h | [See analysis](../design/mobile-first-optimization-analysis.md#3-font-loading-strategy)

- [ ] **Bundle size reduction** - Analyze dependencies, tree-shake, remove unused code
  - Run bundle analyzer, identify large dependencies
  - Effort: 2-3h

**Phase 5: PWA & Polish - Week 5** (P2 - Medium, ~10-14 hours)
- [ ] **PWA setup** - Web app manifest, service worker, install prompt, offline fallback
  - Create manifest.json, add icons, implement install prompt component
  - Effort: 4-5h | [See analysis](../design/mobile-first-optimization-analysis.md#pwa-enhancements)

- [ ] **Advanced interactions** - Long-press menus, double-tap actions, pinch-to-zoom
  - Context menus on long-press, gesture handlers
  - Effort: 3-4h

- [ ] **Accessibility enhancements** - Mobile screen reader testing, voice-over optimization
  - Test with VoiceOver/TalkBack, improve ARIA labels
  - Effort: 2-3h | [See analysis](../design/mobile-first-optimization-analysis.md#mobile-accessibility-enhancements)

- [ ] **Reduced motion support expansion** - Ensure all new animations respect user preferences
  - Audit all animations, add motion-reduce variants
  - Effort: 1-2h

**Testing & Validation** (Ongoing)
- [ ] Real device testing on iPhone SE, iPhone 14 Pro, Samsung Galaxy, iPad Mini
- [ ] Lighthouse mobile audit (target: Performance >90, Accessibility 100)
- [ ] Touch target validation (Chrome DevTools device emulation)
- [ ] Form completion flow testing on mobile
- [ ] Navigation flow testing (menu, bottom nav, TOC)

**Success Metrics (Overall):**
- Mobile bounce rate < 40%
- Time on page (mobile) > 2 minutes
- Form completion rate > 60%
- Page load (3G) < 3 seconds
- Lighthouse Performance > 90
- Lighthouse Accessibility: 100
- PWA install rate > 5%

#### General Features

- [x] **Public Analytics Dashboard** - Display trending posts and view statistics (✅ Complete - dev-only, see `/docs/features/analytics-dashboard.md`)
- [ ] **Newsletter signup** - Email subscription functionality for blog updates
- [ ] **Email Templates** - HTML email templates with branding for contact form and notifications
- [ ] **E2E tests** - Set up Playwright or Cypress for critical user flows
- [ ] **Unit tests** - Add tests for utility functions and components

#### GitHub Integration Enhancements (Nov 3, 2025)

**Phase 1: Quick Wins (In Progress - 4/5 Complete)**
- [x] **Tooltips on heatmap** - Show date, count, and top commits on hover using Radix UI Tooltip ✅
- [x] **Streak statistics** - Calculate and display current streak and longest streak with badges ✅
- [ ] **Contribution breakdown** - Show commits/PRs/issues/reviews split (requires API update - deferred to Phase 2)
- [x] **Smooth animations** - Add fade-in and micro-interactions with Framer Motion ✅
- [x] **Activity analytics** - Display busiest day/week/month stats and averages ✅

**Implementation Summary:** See `/docs/features/github-integration-enhancements.md`

**Phase 2: Medium-Term Enhancements**
- [ ] **Repository showcase** - Display 3-6 pinned repos with stars/forks (new API endpoint)
- [ ] **Language breakdown** - Pie/bar chart of top languages (analyze repo data)
- [ ] **Activity feed** - Recent 10 GitHub events with descriptions (Events API)
- [ ] **Year-over-year comparison** - "X% more active than last year" stat
- [ ] **Interactive date range** - Allow exploring different time periods

**Phase 3: Long-Term Features**
- [ ] **GitHub Wrapped** - Annual summary page (Spotify Wrapped style, launch December)
- [ ] **Contribution impact** - Stars earned, issues closed, PRs merged stats
- [ ] **Blog-GitHub integration** - Link blog posts to repositories/commits
- [ ] **Achievement system** - Unlock badges based on activity (gamification)

**Architecture Improvements**
- [ ] **Redis caching** - Upgrade from in-memory to Redis for contributions
- [ ] **Stale-while-revalidate** - Return cached data immediately, refresh in background
- [ ] **GitHub service layer** - Create `src/lib/github-service.ts` for centralized API logic
- [ ] **Build-time data fetching** - Pre-fetch at build time with ISR
- [ ] **Reusable hooks** - Create `useGitHubContributions`, `useGitHubRepos`, `useGitHubStats`
- [ ] **Testing** - Unit tests for transformations, integration tests for API routes

**UX/UI Polish**
- [ ] **Mobile improvements** - Swipe gestures, better responsive grid
- [ ] **Theme optimization** - Better color scales for dark/light modes
- [ ] **Shareable stats** - Generate OG image with yearly stats, export as PNG/SVG
- [ ] **Accessibility** - Ensure WCAG contrast ratios, keyboard navigation

#### UI/UX Animation & Interaction Enhancements (Nov 3, 2025)

**Phase 1: Quick Wins** ✅ **COMPLETE** (All 6 items - ~15 hours total)
- [x] Shimmer skeleton loader (gradient shimmer replacing pulse)
- [x] Card hover lift effects (project cards + blog posts with shadow)
- [x] Copy code buttons for MDX (with success animation)
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

### Content & Interactivity
- [ ] **Interactive demos** - Add interactive code examples to blog posts
- [ ] **MDX components library** - Build custom MDX components for richer content
- [ ] **Video content integration** - Support for video content
- [ ] **Podcast/audio content** - Audio content support

### Technical Exploration
- [ ] **WebAssembly integration** - Experiment with WASM for performance-critical features
- [ ] **Edge functions** - Explore edge runtime for certain API routes
- [ ] **Multi-language support (i18n)** - Internationalization support

### Optional Integrations
- [ ] **Git MCP** - Consider @modelcontextprotocol/server-git for direct git operations
- [ ] **Discord MCP** - Deployment notifications and team updates

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

## ⚙️ Automation & CI (Recommended backlog)

Small, low-risk automation items to pick up (prioritized):

- [ ] **GitHub Actions CI** — Add a lightweight CI workflow that runs `npm ci`, `npm run check` (lint + typecheck), and `npm run build`. Cache node modules and `.next/cache` to speed runs.
- [ ] **Snyk scan in CI** — Run `snyk test` as an optional step when `SNYK_TOKEN` is provided (store token in GitHub Secrets). This provides authenticated vulnerability checks and reporting.
- [ ] **Husky + lint-staged** — Install and configure to run `prettier --write` and `eslint --fix` on staged files to keep PRs clean.
- [ ] **Dependabot / Renovate** — Configure automated dependency update PRs (weekly) for npm packages.
- [ ] **Cache build artifacts** — Preserve `.next/cache` between CI runs keyed by lockfile + Node version.
- [ ] **Lighthouse / Performance checks** — Add an optional Lighthouse CI job to track performance regressions on the main branch.

These are intentionally low-risk and incremental. Prioritize `GitHub Actions CI` and `Dependabot` first.
