# Project TODO & Issue Tracker

This document tracks **active and pending** work only, **organized by criticality**. Completed tasks are moved to **`done.md`**.

**Last Updated:** November 11, 2025

---

## 🎯 Priority Overview

This todo list is organized by **criticality and user impact**:

- **🚨 CRITICAL** - Broken/inaccessible features, affects majority of users
- **🔴 HIGH** - Major UX issues, affects key user flows  
- **🟡 MEDIUM** - Enhancements to working features, optimization
- **🟢 LOW** - Polish, nice-to-have improvements
- **⚪ BACKLOG** - Future consideration, exploration

**Current Focus:** Developer dashboard refactoring (analytics, admin tools)

---

## 🟡 MEDIUM Priority

### Architecture Refactoring

#### Developer Dashboard & Tools Refactor
**Status:** ✅ Phase 3 COMPLETE - Dashboard refactoring finished  
**Progress:** 15 of 15 files complete (100%)

- [x] **Analysis phase** ✅
  - ✅ Reviewed current implementation: 1,249-line AnalyticsClient.tsx
  - ✅ Planning document complete: `/docs/architecture/dashboard-refactor-plan.md`
  
- [x] **Phase 1: Create foundation** ✅ COMPLETE
  - [x] `src/components/dashboard/dashboard-layout.tsx` - Universal dashboard wrapper
  - [x] `src/components/dashboard/dashboard-stats.tsx` - Stats cards components
  - [x] `src/components/dashboard/index.ts` - Barrel export for easy imports
  - [x] `src/lib/dashboard/table-utils.ts` - Sorting, filtering, pagination logic
  - [x] `src/lib/dashboard/export-utils.ts` - CSV/JSON export logic
  - [x] `src/lib/design-tokens.ts` - Added `dashboard` container width (max-w-6xl)

- [x] **Phase 2: Extract analytics components** ✅ COMPLETE
  - [x] Analytics types, overview, trending components created
  - [x] 8 new files in `src/components/analytics/`

- [x] **Phase 3: Refactor AnalyticsClient.tsx** ✅ COMPLETE
  - [x] Refactored using new components and hooks (1,249 → 583 lines, 53% reduction)
  - [x] Replaced inline data fetching with `useAnalyticsData` hook
  - [x] Replaced inline filter state with `useDashboardFilters` hook
  - [x] Replaced inline sort state with `useDashboardSort` hook
  - [x] Replaced stats section with `AnalyticsOverview` component
  - [x] Replaced trending section with `AnalyticsTrending` component
  - [x] Verified zero compilation errors
  - [x] Tested all functionality (filters, sorting, refresh, export)
  
- [x] **Phase 4: Documentation & Architecture Decision** ✅ COMPLETE
  - [x] Updated `docs/operations/done.md` with Phase 3 summary
  - [x] Created `docs/operations/dashboard-refactor-phase-3-complete.md` (technical deep dive)
  - [x] Created `docs/architecture/analytics-architecture-decision.md` (Vercel Analytics evaluation)
  - [x] Updated `docs/architecture/README.md` with dashboard refactor section
  - [x] Documented reusable dashboard patterns for future use

**Completed in Sessions 1-3:**
- ✅ **Phase 1 Complete:** 5 foundation files (862 lines)
  - Dashboard layout, stats components, table/export utilities
- ✅ **Phase 2 Complete:** 8 analytics files (~1,000 lines)
  - Types, components, custom hooks with URL sync
- ✅ **Phase 3 Complete:** AnalyticsClient.tsx refactored (1,249 → 583 lines, 53% reduction)
  - Integrated all hooks and components successfully
  - Zero TypeScript errors, 100% feature parity maintained
- ✅ **Phase 4 Complete:** Documentation and architecture decision
  - Created comprehensive technical summary
  - Evaluated and documented Vercel Analytics architecture decision
  - Updated all architecture documentation
- ✅ **Design Tokens:** Added `dashboard` container width
- ✅ **Type Safety:** Zero TypeScript compilation errors
- ✅ **Documentation:** Comprehensive JSDoc on all functions

**Total Impact:**
- **15 files created** (~1,862 lines of new infrastructure)
- **1 file refactored** (1,249 → 583 lines, 53% reduction)
- **4 documentation files** created/updated
- **100% feature parity** with improved maintainability

**Files Created (13 total, ~1,862 lines):**

**Foundation (Phase 1):**
1. `src/components/dashboard/dashboard-layout.tsx` (78 lines)
2. `src/components/dashboard/dashboard-stats.tsx` (200 lines)
3. `src/components/dashboard/index.ts` (38 lines)
4. `src/lib/dashboard/table-utils.ts` (286 lines)
5. `src/lib/dashboard/export-utils.ts` (260 lines)

**Analytics (Phase 2):**
6. `src/types/analytics.ts` (80 lines)
7. `src/components/analytics/analytics-overview.tsx` (150 lines)
8. `src/components/analytics/analytics-trending.tsx` (90 lines)
9. `src/components/analytics/index.ts` (24 lines)
10. `src/hooks/use-analytics-data.ts` (136 lines)
11. `src/hooks/use-dashboard-filters.ts` (196 lines)
12. `src/hooks/use-dashboard-sort.ts` (136 lines)
13. `src/hooks/index.ts` (10 lines)

**Refactored (Phase 3):**
14. `src/app/analytics/AnalyticsClient.tsx` (1,249 → 583 lines)

**Documentation (Phase 4):**
15. `docs/operations/dashboard-refactor-phase-3-complete.md` (technical deep dive)
16. `docs/architecture/analytics-architecture-decision.md` (Vercel Analytics evaluation)
17. Updated `docs/operations/done.md` and `docs/architecture/README.md`

**Plan:** `/docs/architecture/dashboard-refactor-plan.md`

---

## 🐛 Bugs

- None currently tracked

---

## 🚀 Features

### Security & Documentation (Medium Priority)

#### Privacy Policy Documentation
**Status:** 📝 Not started  
**Priority:** Medium - Compliance and transparency  
**Effort:** 2-3 hours

**Scope:**
- Create GDPR/CCPA compliant privacy policy
- Document data collection practices (analytics, view counts, contact form)
- Explain third-party services (Vercel, Redis, Giscus, Inngest)
- User rights and data retention policies

**Reference:** `/docs/security/FINDINGS_AND_ACTION_ITEMS.md#2`

---

#### Incident Response Plan
**Status:** 📝 Not started  
**Priority:** Medium - Security preparedness  
**Effort:** 1-2 hours

**Scope:**
- Document security incident procedures
- Define escalation paths and responsibilities
- Create response playbook for common scenarios
- Contact information and notification protocols

**Reference:** `/docs/security/FINDINGS_AND_ACTION_ITEMS.md#3`

---

## 🔧 Technical Improvements

### Monitoring
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

---

## 🔄 Dependencies & Maintenance

- [ ] **Automated dependency updates** - Set up Dependabot or Renovate
- [ ] **Quarterly dependency review** - Review and update dependencies regularly
- [ ] **Security advisories** - Monitor for security advisories
- [ ] **Next.js 16 migration** - Stay updated on Next.js 16 features and migration path

---

## 💡 Ideas & Future Enhancements

### Homepage Improvements

**Tier 1: Quick Wins (High Impact, Low Effort)**
- [ ] **GitHub Contribution Heatmap on Homepage** - Shows activity, builds technical credibility (5-10 min)
- [ ] **Stats/Metrics Section** - Total posts, projects, years of experience, technologies mastered (30 min)
- [ ] **Better Section Spacing** - Improve visual hierarchy (15 min)

**Tier 2: High Value Additions (Weekend Project)**
- [ ] **Tech Stack Visualization** - Show expertise with icon grid (2-3 hours)
- [ ] **Newsletter Signup Section** - Email capture for audience building (2-3 hours)
- [ ] **Popular/Trending Posts Section** - Social proof via view counts (1-2 hours)
- [ ] **Tag Cloud / Popular Topics** - Content discovery + SEO (1-2 hours)
- [ ] **Social Links Section** - More prominent social presence (1 hour)

**Tier 3: Nice-to-Have Enhancements**
- [ ] **Testimonials/Recommendations** - Social proof from LinkedIn/clients
- [ ] **Recent Activity Timeline** - Blog posts, project updates, GitHub activity
- [ ] **Call-Out Boxes** - "Currently learning...", "Available for consulting"
- [ ] **Better CTA Strategy** - More specific/action-oriented calls-to-action

**Tier 4: Advanced Features (Future)**
- [ ] **Newsletter Preview** - Show latest newsletter issue
- [ ] **Live Search on Homepage** - Quick access to content
- [ ] **Interactive Filters** - Filter posts by technology, projects by type
- [ ] **Personalization** - Remember preferences, suggest content

---

## ⚪ BACKLOG - Content & Features

### Feed System Enhancements (Future)

**Priority:** LOW - Quality of life improvements  
**Estimated Effort:** 8-12 hours

**See:** `docs/rss/feed-improvements-brainstorm.md` for complete analysis

#### Medium Priority Items
- [ ] **Enhanced Image Enclosures** - Add file size and dimensions metadata (4-6 hours)
- [ ] **Explicit Project Publication Dates** - Replace timeline inference (3-4 hours)
- [ ] **Feed Documentation Page** - Create `/feeds` user-facing page (2-3 hours)

#### Low Priority Items
- [ ] **JSON Feed Support** - Modern JSON alternative to XML (4-5 hours)
- [ ] **Filtered Feeds** - Tag and status-based feeds (6-8 hours)
- [ ] **Feed Analytics** - Track subscription metrics (6-8 hours)

---

### Blog Feature Enhancements (Future Improvements)

#### Medium Effort (3-5 days each)
- [ ] **Popular Posts Widget** - Sidebar showing top 5 posts by views
- [ ] **Bookmark/Reading List** - Let readers save posts for later
- [ ] **Post Reactions** - Quick emoji reactions (👍 ❤️ 🔥 💡)
- [ ] **Keyboard Shortcuts** - `/` for search, `n`/`p` for next/prev
- [ ] **Print-Friendly Styling** - `@media print` CSS rules
- [ ] **Advanced Search Filters** - Date range, multiple tags, sort options
- [ ] **Newsletter Signup Widget** - Email capture form

#### Major Projects (1-2 weeks each)
- [ ] **Full-Text Search** - Meilisearch/Algolia/SQLite FTS
- [ ] **Content Analytics Dashboard** - `/admin` route with charts
- [ ] **Infinite Scroll Option** - Auto-load more posts
- [ ] **Reading History & Recommendations** - Track read posts
- [ ] **Post Scheduling System** - Schedule posts for future publication
- [ ] **Draft Preview Sharing** - Shareable preview links with secret token

---

### ESLint Design Token Migration (Low Priority)

**Status:** Quick wins complete (Nov 9, 2025) - Remaining 71 warnings backlogged  
**Priority:** LOW - Maintenance/polish, no user-facing impact  
**Effort:** ~10-15 hours for complete migration

**Remaining Work (71 warnings):**
- **Analytics Page** (~18 warnings) - Internal admin page, lowest priority
- **Project Detail Page** (~7 warnings) - Medium traffic
- **Resume Page** (~5 warnings) - Low traffic
- **Component Files** (~39 warnings) - As needed when editing
- **Blog Page False Positives** (2 warnings) - Consider refining rules

**Reference:** `docs/design/eslint-warnings-quick-ref.md`

---

### Blog Search & Filter UI Improvements (Backlog)

#### P1: High Impact Improvements (3-5 hours each)
- [ ] **Collapsible Tag List** - Show top 5-8 tags by default with expand button
- [ ] **Combine Reading Time into Search Bar** - Dropdown inside search bar
- [ ] **Sticky Filter Bar** - Sticky after scrolling past header
- [ ] **Keyboard Shortcuts** - `/` to focus search, `Esc` to clear
- [ ] **Smart Sorting Toggle** - Latest | Popular | Relevant

#### P2: Mobile-Specific Improvements (5-8 hours)
- [ ] **Bottom Sheet Filters (Mobile)** - Filter button opens bottom sheet modal
- [ ] **Horizontal Scroll Tags (Mobile)** - Single row with horizontal scroll
- [ ] **Floating Filter FAB (Mobile)** - Like TOC FAB with badge count

#### P3: Advanced Features (8+ hours)
- [ ] **Search Suggestions/Autocomplete** - Recent searches, popular tags
- [ ] **Tag Search/Filter** - Search bar within tag list
- [ ] **Saved Searches** - Save filter combinations in localStorage
- [ ] **Pretty Filter URLs** - SEO-friendly URLs like `/blog/quick-reads/typescript`

---

### UI/UX Enhancements (Backlog)

#### Phase 3: Enhanced Interactions (~26 hours)
- [ ] **Enhanced table of contents** - Sliding active indicator
- [ ] **Toast improvements** - Custom enter/exit animations
- [ ] **GitHub heatmap polish** - Staggered square appearance
- [ ] **Theme transition animations** - Smooth dark/light mode switch
- [ ] **Parallax hero images** - Subtle parallax effect (desktop only)
- [ ] **Progressive image blur** - Images start blurred, sharpen as they load

#### Phase 4: Advanced Features (~74 hours)
- [ ] **Command palette (Cmd+K)** - Search posts, navigate site (cmdk)
- [ ] **Page transition system** - View Transitions API + Framer Motion fallback
- [ ] **Micro-interactions library** - Reusable animated components
- [ ] **Virtual scrolling** - For blog list with >50 posts
- [ ] **Reading mode toggle** - Distraction-free interface
- [ ] **Advanced gestures** - Pull-to-refresh, drag-to-share
- [ ] **3D card tilt effect** - Subtle tilt on hover for project cards
- [ ] **Image galleries** - Multiple images per post with lightbox

---

### Resume Page Enhancements (Backlog)

**Phase 1: Professional Polish** (~6-8 hours)
- [ ] **Timeline visualization** - Visual timeline for experience
- [ ] **Certification verification links** - Clickable badges to Credly
- [ ] **Download options** - PDF generation, JSON export
- [ ] **Company logos** - Small logos next to experience cards

**Phase 2: Interactive Features** (~8-10 hours)
- [ ] **Skills search/filter** - Debounced search (100+ skills)
- [ ] **Skills proficiency levels** - Visual indicators for expertise
- [ ] **Dynamic summary toggle** - Switch between short and full summary
- [ ] **Dark mode optimization** - Better badge contrast

**Phase 3: Advanced Features** (~12-16 hours)
- [ ] **View analytics** - Redis-backed view counter
- [ ] **Testimonials carousel** - Rotating quotes from LinkedIn
- [ ] **"Ask About My Resume" AI chat** - Interactive Q&A chatbot
- [ ] **A/B testing layouts** - Track conversion to /contact

---

### About Page Enhancements (Backlog)

**Phase 2: Enhanced UX** (Medium Priority)
- [ ] **Interactive Timeline** - Vertical timeline with connection lines
- [ ] **Featured Blog Posts Section** - Show 2-3 recent posts
- [ ] **Downloadable Resume Button** - PDF download option
- [ ] **Mission Statement Callout** - Prominent quote box
- [ ] **Enhanced Personal Interests** - Expand "Outside work" section

**Phase 3: Advanced Features** (Low Priority)
- [ ] **Testimonials/Recommendations** - Rotating testimonials with attribution
- [ ] **FAQ/Quick Facts Accordion** - Common questions
- [ ] **Community Contributions Display** - Reuse GitHub heatmap
- [ ] **Interactive Career Map** - Geographic visualization
- [ ] **Currently Available Status** - Toggle for consulting availability
- [ ] **Reading List Integration** - Sync with Goodreads

---

### Analytics Dashboard Enhancements (Backlog)

**TIER 2: Enhanced Insights** (Medium Priority)
- [ ] **Visual Trend Charts** - Line charts, bar charts (recharts or tremor)
- [ ] **Sparkline Trends in Table** - Mini 7-day view trend in each row
- [ ] **Historical Data Snapshots** - Daily/weekly/monthly rollups
- [ ] **Tag Performance Dashboard** - Analytics by tag
- [ ] **Post Lifecycle Labels** - Auto-detect: Viral, Evergreen, Rising
- [ ] **Content Performance Metrics** - Velocity, peak views, correlations

**TIER 3: Advanced Analytics** (Low Priority / Future)
- [ ] **Engagement Tracking** - Scroll depth, time on page, code copy events
- [ ] **Real-Time Updates** - WebSocket or SSE for live counters
- [ ] **Advanced Trending Algorithm** - Weighted scoring with recency
- [ ] **Referrer & Traffic Analysis** - Privacy-respecting referrer tracking
- [ ] **Goal & Conversion Tracking** - Newsletter signups, contact form

---

### Configuration & Architecture (Backlog)

#### Site Configuration Centralization
**Status:** Phase 1 Complete (Nov 5, 2025)  
**Remaining Work:**
- [ ] **Refactor components to use centralized config** - Replace hardcoded values
- [ ] **SEO_CONFIG** - SEO & metadata defaults
- [ ] **SECURITY_CONFIG** - Rate limits, CSP, CORS
- [ ] **NAV_CONFIG** - Header/footer links, mobile breakpoints
- [ ] **THEME_CONFIG** - Default theme, fonts, logo paths
- [ ] **CACHE_CONFIG** - ISR revalidation times, cache durations
- [ ] **ANALYTICS_CONFIG** - Tracking preferences, privacy settings
- [ ] **CONTACT_CONFIG** - Email settings, form validation
- [ ] **BLOG_CONFIG** - Content dir, visibility rules, feeds

---

### Security Infrastructure (Backlog)

#### API Security Audit - Phase 2 (Enhanced Protection)
**Priority:** MEDIUM - Infrastructure improvements  
**Estimated Effort:** 12-16 hours

- [ ] **Input Validation & Sanitization** - DOMPurify, validator.js
- [ ] **Standardize Error Handling** - Error response utility, error codes
- [ ] **API Middleware Layer** - Request ID, logging, CORS, rate limits
- [ ] **API Monitoring & Security Events** - Track violations, error rates, alerts

---

### Automation & CI (Recommended Backlog)

- [ ] **GitHub Actions CI** - Lint, typecheck, build with caching
- [ ] **Snyk scan in CI** - Authenticated vulnerability checks
- [ ] **Husky + lint-staged** - Pre-commit prettier and eslint
- [ ] **Dependabot / Renovate** - Automated dependency updates
- [ ] **Lighthouse / Performance checks** - Track performance regressions

---

## ✅ Completed Work

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
