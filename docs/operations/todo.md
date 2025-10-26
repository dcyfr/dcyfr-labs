# Project TODO & Issue Tracker

This document tracks **active and pending** work only. Completed tasks are moved to **`done.md`**.

**Last Updated:** October 26, 2025

---

## 🐛 Bugs

- None currently tracked

---

## 🚀 Features

### High Priority
- [ ] **Public Analytics Dashboard** - Display trending posts and view statistics (moved up - data already being collected via Inngest)

### Backlog
- [ ] **Newsletter signup** - Email subscription functionality for blog updates
- [ ] **Email Templates** - HTML email templates with branding for contact form and notifications
- [ ] **E2E tests** - Set up Playwright or Cypress for critical user flows
- [ ] **Unit tests** - Add tests for utility functions and components

---

## 🔧 Technical Improvements

### Performance
- [ ] **Bundle analysis** - Set up bundle analyzer to monitor bundle size
- [ ] **Font optimization** - Review font loading strategy for better performance

### SEO & Accessibility
- [ ] **Accessibility audit** - Run full a11y audit with axe or Lighthouse (automated testing)
- [ ] **Vercel OG image generation** - Dynamic social preview images using Vercel's OG API

### Monitoring
- [ ] **Error tracking** - Consider Sentry or similar for error monitoring
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
