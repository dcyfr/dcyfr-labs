# Project TODO & Issue Tracker

This document tracks bugs, feature requests, improvements, and technical debt.

**Last Updated:** October 21, 2025

---

## 🐛 Bugs

### Active
- None currently tracked

### Resolved
- ✅ **Turbopack build claim** - Fixed misleading claim in blog post about Turbopack being used for production builds (2025-10-03)

---

## 🚀 Feature Requests

### High Priority
- [x] **Blog search functionality** - Add search across blog posts by title, content, and tags (shipped 2025-10-15)
- [x] **Tag filtering** - Allow filtering blog posts by tags on `/blog` page (shipped 2025-10-15)
- [x] **View counts** - Track and display view counts for blog posts (shipped 2025-10-16)

### Medium Priority
- [x] **RSS feed improvements** - Enhance RSS/Atom feeds with full content and better formatting (completed 2025-10-18)
- [x] **Reading progress indicator** - Show reading progress bar with GPU-accelerated animations for blog posts (completed 2025-10-20)
- [ ] **Table of contents** - Generate TOC for long blog posts from headings
- [ ] **Related posts** - Show related posts at the end of each blog post based on tags
- [ ] **Code syntax highlighting themes** - Add syntax highlighting with theme support for code blocks

### Low Priority
- [ ] **Share buttons** - Add social sharing buttons to blog posts
- [ ] **Comments system** - Consider adding comments (Giscus or similar)
- [ ] **Newsletter signup** - Add email newsletter subscription
- [ ] **Print stylesheet improvements** - Enhance print.css for better blog post printing

---

## 🔧 Technical Debt & Improvements

### Code Quality
- [x] **Error boundaries** - Add comprehensive error boundary system with 5+ specialized boundaries for client components (completed 2025-10-20)
- [x] **GitHub heatmap refactoring** - Refactored heatmap component to work with error boundaries and simplified by removing all caching logic (completed 2025-10-20)
- [x] **Loading states** - Add skeleton loaders for async content (completed 2025-10-21)
- [ ] **E2E tests** - Set up Playwright or Cypress for critical user flows
- [ ] **Unit tests** - Add tests for utility functions and components
- [x] **Contact email fallback** - Gracefully handle missing `RESEND_API_KEY` with 200 response and warning instead of 500 error (completed 2025-10-20)
- [x] **GitHub API header hygiene** - Only send `Authorization` header when `GITHUB_TOKEN` is configured (completed 2025-10-20)

### Performance
- [ ] **Image optimization** - Add next/image for all images in blog posts
- [ ] **Bundle analysis** - Set up bundle analyzer to monitor bundle size
- [ ] **Font optimization** - Review font loading strategy for better performance
- [ ] **Incremental Static Regeneration** - Consider ISR for blog posts if content updates frequently

### SEO & Accessibility
- [ ] **Structured data** - Add JSON-LD structured data for blog posts
- [ ] **Accessibility audit** - Run full a11y audit with axe or Lighthouse
- [ ] **Meta descriptions** - Ensure all pages have unique, optimized meta descriptions
- [ ] **Alt text review** - Audit all images for proper alt text
- [ ] **Vercel OG image generation** - Add server-side OG image support using Vercel's OG image generation feature (https://vercel.com/docs/og-image-generation) to produce dynamic social preview images for blog posts and projects

### Documentation
- [x] **API documentation** - Document API routes and their expected payloads (see `docs/api/reference.md`) - completed 2025-10-19
- [x] **Environment variable quickstart** - Published comprehensive `.env.example` with all variables documented (completed 2025-10-20)
- [ ] **Component documentation** - Add JSDoc comments to complex components
- [ ] **Contributing guide** - Create CONTRIBUTING.md for potential contributors
- [ ] **Deployment guide** - Document deployment process and environment variables (partially covered in environment-variables.md)
- [ ] **GitHub heatmap setup guide** - Add documentation that matches the in-app link referenced in `github-heatmap.tsx`

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
- [ ] **Dark mode refinements** - Review color contrast in dark mode
- [ ] **Mobile navigation** - Improve mobile menu if navigation grows
- [ ] **Micro-interactions** - Add subtle animations and transitions
- [ ] **Focus states** - Audit and improve keyboard focus indicators

### Layout
- [ ] **Grid layout for projects** - Consider card grid instead of list
- [ ] **Blog post formatting** - Review typography and spacing in blog posts
- [ ] **Footer enhancements** - Add more useful links/info to footer

---

## 🔐 Security

### Active
- [ ] **CSP hardening** - Replace `unsafe-inline` allowances with nonce/hash workflow and update middleware + vercel headers accordingly
- [ ] **Shared rate limiting store** - Move in-memory rate limiters to Redis/Vercel KV and standardize trusted client IP detection
- [ ] **Contact form PII logging** - Remove or anonymize contact submission logs before writing to console
- [ ] **Security docs alignment** - Reconcile CSP implementation docs with current header behavior
- [ ] **CAPTCHA consideration** - Evaluate need for spam prevention on contact form
- [ ] **Environment variable audit** - Ensure all sensitive data uses env vars
- [ ] **CSP violation monitoring** - Set up endpoint to log CSP violations

### Completed
- ✅ **Security Assessment Findings** - All 3 findings from security report resolved (2025-10-05)
  - Finding #1: Content Security Policy implemented
  - Finding #2: Clickjacking protection (CSP + X-Frame-Options)
  - Finding #3: MIME-sniffing protection (X-Content-Type-Options)
- ✅ **Content Security Policy (CSP)** - Implemented comprehensive CSP with middleware and nonce support (2025-10-05)
- ✅ **Rate limiting** - Implemented rate limiting for contact form API (3 req/60s per IP) (2025-10-05)
- ✅ Security headers configured in vercel.json (X-Frame-Options, X-Content-Type-Options, HSTS, etc.)
- ✅ API route input validation implemented
- ✅ Safe MDX rendering with next-mdx-remote/rsc

---

## 📊 Analytics & Monitoring

- [ ] **Error tracking** - Consider Sentry or similar for error monitoring
- [ ] **Custom analytics events** - Track specific user interactions (blog views, contact form submissions)
- [ ] **Performance monitoring** - Set up performance budgets and alerts
- [ ] **Uptime monitoring** - Configure uptime monitoring service

---

## 🔄 Dependencies

### MCP Servers
- [x] **Filesystem MCP** - Add Filesystem MCP for enhanced project navigation and bulk operations (completed 2025-10-18)
- [ ] **Git MCP** - Integrate Git MCP when available (currently @modelcontextprotocol/server-git doesn't exist on npm)
- [ ] **GitHub MCP** - Set up GitHub MCP server for PR/issue automation and workflow management
- [ ] **Slack MCP** (optional) - Add Slack MCP for deployment notifications and team updates

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

## Archive

Completed tasks are moved here with completion date for reference.

### 2025-10-18
- ✅ **RSS feed improvements** - Enhanced RSS and Atom feeds with full content and better formatting
  - Added full HTML content in feeds (not just summaries)
  - Created `src/lib/mdx-to-html.ts` utility for MDX → HTML conversion
  - Added author information (name and email) in both RSS and Atom
  - Added categories/tags for each post
  - Added proper feed metadata (generator, build dates, self-referential links)
  - Improved XML formatting and structure
  - Implemented security via sanitized HTML output
  - Optimized performance (20 posts limit, parallel processing)
  - Comprehensive documentation in `docs/RSS_FEED_IMPROVEMENTS.md`

### 2025-10-05
- ✅ Resolved all security findings from security assessment
  - Finding #1: Implemented Content Security Policy (CSP)
  - Finding #2: Confirmed clickjacking protection (CSP frame-src + X-Frame-Options)
  - Finding #3: Confirmed MIME-sniffing protection (X-Content-Type-Options)
  - Created comprehensive documentation in `docs/SECURITY_FINDINGS_RESOLUTION.md`
- ✅ Implemented Content Security Policy (CSP)
  - Created `src/middleware.ts` with dynamic CSP and nonce generation
  - Updated `vercel.json` with static CSP header (defense in depth)
  - Configured CSP directives for Vercel Analytics, Google Fonts, and app resources
  - Protection against XSS and Clickjacking attacks
  - Created comprehensive documentation in `docs/security/csp/implementation.md`
- ✅ Implemented rate limiting for contact form API
  - Created `src/lib/rate-limit.ts` with in-memory rate limiter
  - Updated `/api/contact` route with IP-based rate limiting (3 req/60s)
  - Added standard rate limit headers (X-RateLimit-*)
  - Enhanced contact page to handle 429 responses gracefully
  - Created comprehensive documentation in `docs/security/rate-limiting/guide.md`

### 2025-10-03
- ✅ Fixed Turbopack build claim in shipping blog post
- ✅ Created centralized TODO tracker
