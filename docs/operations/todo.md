# Project TODO & Issue Tracker

This document tracks **active and pending** work only. Completed tasks are moved to **`done.md`**.

**Last Updated:** October 28, 2025

---

## 📌 Recent Updates

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
- None currently

### Backlog
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
