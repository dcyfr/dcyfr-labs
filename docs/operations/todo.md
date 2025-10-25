# Project TODO & Issue Tracker

This document tracks **active and pending** work only.

Completed tasks have been moved to **`done.md`** for better project organization.

**Last Updated:** October 24, 2025

---

## 🐛 Bugs

### Active
- None currently tracked

---

## 🚀 Feature Requests

### High Priority
- [ ] **Newsletter signup** - Add email newsletter subscription

### Completed (October 24, 2025)
- [x] **Print stylesheet improvements** - Enhance print.css for better blog post printing (comprehensive improvements with documentation)
- [x] **Share buttons** - Add social sharing buttons to blog posts (Twitter, LinkedIn, copy link with toast feedback)
- [x] **Comments system (Giscus)** - GitHub Discussions-powered comments on blog posts with automatic theme switching and lazy loading

---

## 🔧 Technical Debt & Improvements

### Code Quality
- [ ] **E2E tests** - Set up Playwright or Cypress for critical user flows
- [ ] **Unit tests** - Add tests for utility functions and components

### Performance
- [ ] **Image optimization** - Add next/image for all images in blog posts
- [ ] **Bundle analysis** - Set up bundle analyzer to monitor bundle size
- [ ] **Font optimization** - Review font loading strategy for better performance
- [ ] **Incremental Static Regeneration** - Consider ISR for blog posts if content updates frequently

### SEO & Accessibility
- [ ] **Accessibility audit** - Run full a11y audit with axe or Lighthouse
- [ ] **Alt text review** - Audit all images for proper alt text
- [ ] **Vercel OG image generation** - Add server-side OG image support using Vercel's OG image generation feature (https://vercel.com/docs/og-image-generation) to produce dynamic social preview images for blog posts and projects

### Completed (October 24, 2025)
- [x] **Meta descriptions** - Optimized all page descriptions (150-160 characters) with keywords and compelling copy
- [x] **Structured data (JSON-LD)** - Enhanced Schema.org structured data across all pages with reusable utilities

### Documentation
- [x] **Deployment guide** - Document deployment process and environment variables (2025-10-24)

---

## 📝 Content Tasks

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

## 🎨 Design & UX

### UI Improvements
- [ ] **Mobile navigation** - Improve mobile menu if navigation grows
- [ ] **Micro-interactions** - Add subtle animations and transitions

### Layout
- [ ] **Grid layout for projects** - Consider card grid instead of list
- [ ] **Blog post formatting** - Review typography and spacing in blog posts
- [ ] **Footer enhancements** - Add more useful links/info to footer

---

## 🔐 Security

### Active
- [ ] **Environment variable audit** - Ensure all sensitive data uses env vars

### Completed (October 24, 2025)
- [x] **Security docs alignment** - Reconciled CSP implementation docs with current header behavior
- [x] **CSP violation monitoring** - Set up `/api/csp-report` endpoint to log CSP violations with rate limiting
- [x] **CSP violation testing** - Created test script (`npm run test:csp-report`) to verify reporting endpoint
- [x] **Security status documentation** - Created comprehensive `/docs/security/security-status.md` explaining two-layer CSP approach

---

## 📊 Analytics & Monitoring

- [ ] **Error tracking** - Consider Sentry or similar for error monitoring
- [ ] **Custom analytics events** - Track specific user interactions (blog views, contact form submissions)
- [ ] **Performance monitoring** - Set up performance budgets and alerts
- [ ] **Uptime monitoring** - Configure uptime monitoring service

---

## 🔄 Dependencies

### MCP Servers
- [x] **Context7 MCP** - Documentation lookup for Next.js, React, Tailwind, shadcn/ui (installed and active)
- [x] **Sequential Thinking MCP** - Complex problem-solving and planning (installed and active)
- [x] **Memory MCP** - Project context tracking across conversations (installed and active)
- [x] **Filesystem MCP** - Enhanced project navigation and bulk operations (completed 2025-10-18)
- [x] **GitHub MCP** - PR/issue automation and workflow management via Docker (completed 2025-10-18, documented)
- [ ] **Git MCP** - Consider adding @modelcontextprotocol/server-git for direct git operations (optional, filesystem covers most needs)
- [ ] **Discord MCP** (optional) - Add Discord MCP for deployment notifications and team updates

### Maintenance
- [ ] Set up Dependabot or Renovate for automated dependency updates
- [ ] Review and update dependencies quarterly
- [ ] Monitor for security advisories

### Future Upgrades
- [ ] Monitor Turbopack production build support for future migration
- [ ] Stay updated on Next.js 16 features and migration path

---

## 💡 Ideas & Experiments

### Exploration
- [ ] **Interactive demos** - Add interactive code examples to blog posts
- [ ] **MDX components library** - Build custom MDX components for richer content
- [ ] **WebAssembly integration** - Experiment with WASM for performance-critical features
- [ ] **Edge functions** - Explore edge runtime for certain API routes
- [ ] **OG image experiments** - Prototype automated OG image templates (Vercel OG + static fallbacks) for blog posts and projects

### Long-term
- [ ] Multi-language support (i18n)
- [ ] Portfolio case studies with detailed project breakdowns
- [ ] Video content integration
- [ ] Podcast/audio content

---

## 📋 Notes

### Project Conventions
- Store documentation in `/docs` directory
- Use `@/*` import alias consistently
- Server components by default; mark client components with `"use client"`
- Tailwind utilities for styling (no additional CSS frameworks)
- Type everything with TypeScript strict mode

### Release Process
- Update `updatedAt` in blog post frontmatter when making content changes
- Run `npm run lint` before committing
- Test locally with `npm run build` before deploying
- Review lighthouse scores after major UI changes

---

## 📦 Archive

Completed tasks have been moved to **`done.md`** for better project organization and historical reference.

See `/docs/operations/done.md` for:
- 🎯 Session summaries with dates and accomplishments
- 📊 Project statistics and metrics
- 🎓 Lessons learned and patterns established
- 📚 Documentation coverage tracking
- 🚀 Key achievements and milestones
