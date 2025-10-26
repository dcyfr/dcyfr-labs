# Content Strategy & Editorial Calendar

**Last Updated:** October 26, 2025  
**Publishing Cadence:** 1 post per month (starting Q4 2025)  
**Target Audience:** Mid-senior developers, tech leads, indie builders

---

## 📅 Publishing Schedule (Q4 2025 - Q2 2026)

### Q4 2025 (October - December)

**November 2025** - "Tiny Portfolio" Series Part 3  
**Title:** *Background Jobs at the Edge: Inngest, Next.js & Event-Driven Architecture*  
**Status:** 🟢 Ready to write (documentation complete, code shipped)  
**Estimated Length:** 2,500-3,000 words  
**Target Publish Date:** November 15, 2025

**December 2025** - "Tiny Portfolio" Series Part 4  
**Title:** *Next.js Performance Mastery: ISR, Caching & CDN Strategy*  
**Status:** 🟡 Planning phase (implementation complete, needs outline)  
**Estimated Length:** 2,000-2,500 words  
**Target Publish Date:** December 15, 2025

### Q1 2026 (January - March)

**January 2026** - "Tiny Portfolio" Series Part 5  
**Title:** *Zero-Infrastructure Blog Features: Comments, Analytics & RSS*  
**Status:** 🟡 Planning phase  
**Estimated Length:** 1,800-2,200 words  
**Target Publish Date:** January 15, 2026

**February 2026** - "Tiny Portfolio" Series Part 6  
**Title:** *Developer Experience: AI Assistants, MCP & Documentation-Driven Development*  
**Status:** 🟡 Planning phase  
**Estimated Length:** 2,200-2,800 words  
**Target Publish Date:** February 15, 2026

**March 2026** - New Series Launch  
**Title:** *TBD - Select from backlog*  
**Status:** 🔴 Backlog  
**Target Publish Date:** March 15, 2026

### Q2 2026 (April - June)

**April 2026** - Continued from March series or standalone  
**May 2026** - Continued or new topic  
**June 2026** - Continued or new topic

---

## 📚 Current Series: "From Weekend to Production"

**Series Overview:**  
A comprehensive journey from building a minimal portfolio in a weekend to running a production-grade, observable platform. Each post builds on the previous, showing real-world challenges and solutions.

**Series Arc:**
1. ✅ **Foundation** - Shipping a Tiny Portfolio (Published: Sep 2025)
2. ✅ **Hardening** - Security, Performance & Production Readiness (Published: Oct 2025)
3. 🎯 **Scaling** - Event-Driven Architecture & Background Jobs (Nov 2025)
4. 🎯 **Optimization** - ISR, Caching & CDN Strategy (Dec 2025)
5. 🎯 **Features** - Zero-Infrastructure Blog Additions (Jan 2026)
6. 🎯 **DX** - AI Assistants & Workflow Automation (Feb 2026)

**Target Audience:** Developers who want to ship fast but also care about production quality.

**Key Themes:** Next.js, TypeScript, serverless, edge computing, developer experience

---

## 📝 Detailed Post Outlines

### Part 3: Background Jobs at the Edge (November 2025)

**Working Title:** *Background Jobs at the Edge: Inngest, Next.js & Event-Driven Architecture*

**Hook:** "Your API routes are lying to your users. They say '200 OK' while work is still happening. Here's how to fix it."

**Outline:**

1. **The Problem** (300 words)
   - Synchronous API route limitations (slow, can timeout, poor UX)
   - Real example: Contact form taking 1-2s to respond
   - What happens when email service is slow or down?
   - User experience degrades with each integration

2. **Why Event-Driven?** (400 words)
   - Decouple response time from work time
   - Automatic retries without user involvement
   - Better observability and debugging
   - Scales infinitely with serverless
   - When NOT to use event-driven (simple CRUD, low traffic)

3. **Introducing Inngest** (300 words)
   - What it is: Durable execution engine for serverless
   - Why not just Vercel cron? (Comparison table)
   - Key features: retries, scheduling, observability, local dev
   - Pricing transparency (generous free tier)

4. **Implementation: Contact Form** (600 words)
   - Before/after architecture diagram
   - Code walkthrough: sending events
   - Step functions with retry logic
   - Email sending with failure handling
   - Result: 1-2s → <100ms (10-20x improvement)

5. **Implementation: Scheduled Jobs** (500 words)
   - GitHub data pre-population (cron every 5 minutes)
   - Cache warming for instant page loads
   - Code example with error handling
   - Why scheduled vs. on-demand

6. **Implementation: Blog Analytics** (500 words)
   - View tracking pipeline (5 functions)
   - Milestone celebrations (100, 1K, 10K views)
   - Trending post calculation (hourly cron)
   - Daily analytics summaries
   - Event-driven data flow diagram

7. **Developer Experience** (300 words)
   - Local dev UI (http://localhost:3001/api/inngest)
   - Testing individual functions
   - Replay failed executions
   - Type-safe events with TypeScript

8. **Production Deployment** (200 words)
   - Vercel integration
   - Environment variables
   - Monitoring and observability
   - Cost considerations

9. **Key Takeaways** (200 words)
   - When to use event-driven architecture
   - Performance isn't just about speed, it's about reliability
   - User experience > implementation complexity
   - Start simple, add complexity when needed

10. **What's Next** (100 words)
    - Preview of Part 4 (caching strategies)
    - Call to action

**Assets Needed:**
- Architecture diagrams (before/after)
- Inngest Dev UI screenshots
- Performance comparison graphs
- Code snippets (already have in `/src/inngest/`)

**SEO Keywords:** event-driven architecture, Next.js background jobs, Inngest, serverless functions, async processing, durable execution

---

### Part 4: Performance Mastery (December 2025)

**Working Title:** *Next.js Performance Mastery: ISR, Caching & CDN Strategy*

**Hook:** "Your blog is fast, but is it $0.01/month fast? Here's how I serve 10,000 page views for less than a coffee."

**Outline:**

1. **The Performance Problem** (300 words)
   - Server-rendering every request is expensive
   - 100-300ms might seem fast, but it compounds
   - Cost scaling with traffic
   - CDN vs. compute trade-offs

2. **Understanding Next.js Rendering** (400 words)
   - Static Site Generation (SSG)
   - Server-Side Rendering (SSR)
   - Incremental Static Regeneration (ISR)
   - When to use each (decision tree)

3. **Implementing ISR for Blog Posts** (600 words)
   - `generateStaticParams()` explained
   - `revalidate` configuration (why 1 hour?)
   - Stale-while-revalidate pattern
   - Build output analysis
   - Code examples with before/after

4. **Multi-Layer Caching Strategy** (700 words)
   - **Layer 1:** Build-time static generation
   - **Layer 2:** CDN edge caching (Vercel)
   - **Layer 3:** Server-side caching (GitHub API)
   - **Layer 4:** Redis for dynamic data (view counts)
   - **Layer 5:** Client-side caching (localStorage for heatmap)
   - Cache invalidation strategies
   - Diagram showing all layers

5. **Redis Integration** (400 words)
   - When to use Redis vs. ISR
   - View count implementation
   - Graceful fallback without Redis
   - Cost optimization (connection pooling)

6. **Performance Results** (300 words)
   - Before/after metrics table
   - Lighthouse scores
   - Real User Monitoring data
   - Cost analysis (compute vs. bandwidth)

7. **Trade-offs & Gotchas** (300 words)
   - Content freshness vs. performance
   - Cache invalidation complexity
   - Debugging cached content
   - When to skip caching

8. **Key Takeaways** (200 words)
   - Right tool for right job
   - Performance budgets matter
   - User experience > absolute speed
   - Monitor your cache hit rates

**Assets Needed:**
- Multi-layer caching architecture diagram
- Lighthouse performance screenshots
- Cache hit rate graphs
- Cost comparison table

**SEO Keywords:** Next.js ISR, incremental static regeneration, CDN caching, Redis caching, web performance optimization

---

### Part 5: Zero-Infrastructure Features (January 2026)

**Working Title:** *Zero-Infrastructure Blog Features: Comments, Analytics & RSS*

**Hook:** "I added comments, analytics, and RSS feeds to my blog without spinning up a single database. Here's how."

**Outline:**

1. **The Infrastructure Trap** (250 words)
   - Why developers over-engineer blog features
   - Database costs for simple features
   - Maintenance burden vs. benefit
   - The "zero-infrastructure" philosophy

2. **GitHub Discussions as Comments** (600 words)
   - Why Giscus over Disqus/Commento
   - Setup guide (4 steps with screenshots)
   - Theme integration (automatic dark mode)
   - Lazy loading for performance
   - Moderation with GitHub tools
   - Cost: $0/month forever

3. **Redis-Backed View Counts** (500 words)
   - Why track views? (User engagement, trending content)
   - Upstash Redis serverless setup
   - Atomic increments for accuracy
   - Graceful degradation without Redis
   - Displaying view counts (badges, lists)
   - Privacy considerations (no user tracking)

4. **RSS & Atom Feeds** (400 words)
   - Why RSS still matters in 2025
   - Next.js route handlers for feeds
   - Full content vs. summaries
   - Feed validation tools
   - Auto-discovery meta tags
   - Serving at `/rss.xml` and `/atom.xml`

5. **Print Stylesheet** (300 words)
   - Professional PDF exports for readers
   - Typography optimization for print
   - Smart page breaks
   - Hiding interactive elements
   - Code block handling

6. **Typography System** (300 words)
   - Readable line lengths
   - Proper heading hierarchy
   - Code syntax highlighting (Shiki dual-theme)
   - Mobile-first responsive text

7. **What We Didn't Build** (200 words)
   - Newsletter (use existing platforms)
   - Search (coming later with Algolia or simple JS)
   - User accounts (unnecessary complexity)
   - Admin dashboard (content in Git)

8. **Key Takeaways** (150 words)
   - Leverage existing platforms (GitHub, Upstash)
   - Zero infrastructure ≠ zero features
   - User experience matters most
   - Start simple, add complexity only when needed

**Assets Needed:**
- Giscus setup screenshots
- Print stylesheet examples (before/after)
- RSS feed reader screenshots
- Cost comparison table (traditional vs. zero-infra)

**SEO Keywords:** Giscus comments, GitHub Discussions, RSS feed Next.js, blog analytics, zero-infrastructure blog

---

### Part 6: Developer Experience (February 2026)

**Working Title:** *Developer Experience: AI Assistants, MCP & Documentation-Driven Development*

**Hook:** "I taught an AI assistant my entire codebase's rules. Now it writes better code than I do."

**Outline:**

1. **The DX Problem** (300 words)
   - Context switching kills productivity
   - Documentation drift and outdated guides
   - AI assistants that break conventions
   - Onboarding new contributors (including AI)

2. **AI Contributor Guidelines** (500 words)
   - `.github/copilot-instructions.md` strategy
   - What to document (architecture, conventions, constraints)
   - What NOT to document (too much detail kills flexibility)
   - Auto-sync with workspace root
   - Example rules from this project
   - Measuring effectiveness (fewer reverts, faster PRs)

3. **Model Context Protocol (MCP)** (600 words)
   - What is MCP? (standardized AI-tool communication)
   - Why it matters for local-first development
   - Available servers:
     - **Context7:** Library documentation lookup
     - **Sequential Thinking:** Problem-solving and planning
     - **Memory:** Project context persistence
     - **Filesystem:** Safe file operations
     - **GitHub:** Repository management and PR workflows
   - Configuration in VS Code (`mcp.json`)
   - Security benefits (no cloud API calls for local data)

4. **Testing Automation** (400 words)
   - Test scripts in `/scripts/` directory
   - Testing CSP headers, rate limiting, feeds, related posts
   - Running tests locally vs. CI
   - Integration with Inngest Dev UI

5. **Documentation-Driven Development** (400 words)
   - Documentation BEFORE implementation
   - `/docs/` structure and organization
   - Component documentation with JSDoc
   - API documentation with OpenAPI potential
   - Keeping docs in sync with code (tests that verify examples)

6. **Environment Variable Security** (300 words)
   - Security audit process
   - `.env.example` as documentation
   - Client vs. server variable separation
   - Graceful degradation patterns

7. **Developer Velocity Metrics** (200 words)
   - How to measure DX improvements
   - Time to first PR for new contributors
   - AI-assisted code quality
   - Documentation update frequency

8. **Key Takeaways** (150 words)
   - Invest in DX early, it compounds
   - AI assistants need guardrails
   - Documentation is code
   - Local-first tools reduce security risks

**Assets Needed:**
- MCP server architecture diagram
- VS Code with MCP screenshots
- Documentation structure visualization
- Before/after comparison (AI code quality)

**SEO Keywords:** GitHub Copilot, Model Context Protocol, MCP servers, AI coding assistants, documentation-driven development, developer experience

---

## 🎨 Editorial Guidelines

### Writing Style

**Voice & Tone:**
- Conversational but authoritative
- Technical depth without jargon overload
- Honest about trade-offs (not everything is perfect)
- Learning-focused (share mistakes and discoveries)

**Structure:**
- Hook in first 100 words (problem or surprising claim)
- Visual breaks every 300-500 words (code, diagrams, lists)
- "Key Takeaways" section at end
- "What's Next" preview of next post

**Code Examples:**
- Real code from the project (not toy examples)
- Syntax highlighting with Shiki
- Comments for complex logic
- Before/after comparisons when relevant

### Length Targets

- **Short posts:** 1,500-2,000 words (tactical, focused)
- **Medium posts:** 2,000-2,500 words (most common)
- **Deep-dive posts:** 2,500-3,500 words (architecture, complex topics)

### SEO Best Practices

- Primary keyword in title and first paragraph
- 2-3 secondary keywords naturally throughout
- Internal linking to previous posts in series
- External links to official documentation
- Alt text for all images
- Meta description (155 characters)

### Visual Assets

**Required for each post:**
- Hero image or featured graphic (OpenGraph)
- 2-3 diagrams or screenshots
- Code snippets with syntax highlighting

**Nice to have:**
- GIFs or videos for interactive features
- Performance graphs or charts
- Before/after comparisons

---

## 📊 Content Metrics & Goals

### Success Metrics (Per Post)

**Traffic Goals:**
- Month 1: 500-1,000 views
- Month 3: 2,000-5,000 views (as SEO kicks in)
- Month 12: 10,000+ views (evergreen content)

**Engagement Goals:**
- Average time on page: 5+ minutes
- Scroll depth: 70%+ reach end
- Comments: 5-10 per post (via Giscus)
- Social shares: 20-50 per post

**SEO Goals:**
- Index within 24 hours
- Rank on page 1 for primary keyword (within 6 months)
- Appear in "People also ask" snippets

### Growth Targets

**Q4 2025:** Establish publishing cadence, 2 posts published  
**Q1 2026:** Complete "Tiny Portfolio" series (4 more posts), 10K monthly views  
**Q2 2026:** Launch new series, 20K monthly views  
**Q3 2026:** 2 active series, 40K monthly views

---

## 🗂️ Content Backlog: Series Ideas

### Series 1: "API Design in Practice"

**Concept:** Practical API design patterns using real-world examples from this project

**Potential Posts:**
1. "RESTful API Design: Contact Form to Production" (API routes, validation, error handling)
2. "Rate Limiting Strategies: From In-Memory to Distributed" (evolution of rate limiting)
3. "API Observability: Logging, Monitoring & Debugging" (Inngest, error tracking)
4. "Versioning APIs Without Breaking Clients" (backward compatibility)
5. "GraphQL vs. REST: When to Use Each" (GitHub API integration lessons)

**Target Audience:** Backend developers, API designers  
**Estimated Series Length:** 5-6 posts  
**Difficulty Level:** Intermediate to Advanced

---

### Series 2: "Security Without the Boring Parts"

**Concept:** Make security interesting by showing attacks and defenses in action

**Potential Posts:**
1. "XSS Attacks Explained: Breaking and Fixing a Real Site" (CSP implementation story)
2. "Rate Limiting: Stop Attacks Before They Start" (spam prevention, DOS mitigation)
3. "OWASP Top 10 for Next.js Applications" (practical implementations)
4. "Secrets Management: From .env to Production" (environment variable security)
5. "Content Security Policy: The Good Parts" (CSP without headaches)
6. "Security Headers That Actually Matter" (beyond cargo cult security)

**Target Audience:** Full-stack developers, security-curious engineers  
**Estimated Series Length:** 6-8 posts  
**Difficulty Level:** Beginner to Intermediate

---

### Series 3: "TypeScript Patterns at Scale"

**Concept:** Practical TypeScript patterns learned while building this project

**Potential Posts:**
1. "Type-Safe Environment Variables in Next.js" (validation, autocomplete)
2. "Discriminated Unions for API Responses" (error handling patterns)
3. "Generic Components with TypeScript" (React + TS best practices)
4. "Zod for Runtime Type Safety" (schema validation)
5. "TypeScript Utility Types You'll Actually Use" (Pick, Omit, Partial, etc.)
6. "When to Use 'any' (And How to Remove It Later)" (pragmatic typing)

**Target Audience:** TypeScript developers, React developers  
**Estimated Series Length:** 6-8 posts  
**Difficulty Level:** Intermediate

---

### Series 4: "The MDX Blog Engine"

**Concept:** Deep dive into building a production-ready blog with MDX

**Potential Posts:**
1. "Why MDX? (And Why Not Markdown or a CMS)" (decision-making framework)
2. "Frontmatter Schema Design for Blogs" (metadata architecture)
3. "Syntax Highlighting with Shiki: Dual Themes & Copy Buttons" (code blocks)
4. "Auto-Generated Table of Contents with IntersectionObserver" (TOC implementation)
5. "Related Posts Algorithm: Simple but Effective" (tag-based recommendations)
6. "Search Without a Database: Full-Text Search in Next.js" (client-side search)
7. "Reading Progress Indicators & Reading Time Estimation" (UX enhancements)

**Target Audience:** Content-focused developers, technical bloggers  
**Estimated Series Length:** 7-9 posts  
**Difficulty Level:** Beginner to Intermediate

---

### Series 5: "Serverless Architecture Patterns"

**Concept:** Real-world serverless patterns using Vercel and Next.js

**Potential Posts:**
1. "Edge vs. Node.js Runtime: When to Use Each" (Vercel runtimes)
2. "Durable Execution with Inngest" (background jobs deep-dive)
3. "Caching Strategies for Serverless APIs" (Redis, ISR, CDN)
4. "Cold Starts: Measuring and Mitigating" (performance optimization)
5. "Serverless Costs: The Real Numbers" (transparency on pricing)
6. "Multi-Region Serverless Without the Complexity" (Vercel edge network)

**Target Audience:** Cloud architects, serverless developers  
**Estimated Series Length:** 6-7 posts  
**Difficulty Level:** Intermediate to Advanced

---

### Series 6: "AI-Augmented Development"

**Concept:** How to effectively use AI assistants in your workflow

**Potential Posts:**
1. "Teaching AI Your Codebase Rules" (contributor guidelines)
2. "Model Context Protocol: Local-First AI Tools" (MCP deep-dive)
3. "Code Review with AI: What Works and What Doesn't" (GitHub Copilot patterns)
4. "AI for Documentation: Auto-Generated Guides That Don't Suck" (doc generation)
5. "Debugging with AI: Beyond Stack Overflow" (problem-solving workflows)
6. "When NOT to Use AI: Knowing the Limits" (honest assessment)

**Target Audience:** All developers, AI-curious engineers  
**Estimated Series Length:** 6-8 posts  
**Difficulty Level:** Beginner to Advanced

---

### Series 7: "React Server Components in Production"

**Concept:** Practical patterns for React Server Components (RSC) in Next.js

**Potential Posts:**
1. "Server Components vs. Client Components: The Mental Model" (when to use each)
2. "Data Fetching Patterns in App Router" (async components, streaming)
3. "Streaming and Suspense for Better UX" (progressive rendering)
4. "Server Actions: Forms Without JavaScript" (progressive enhancement)
5. "Error Boundaries and Loading States" (resilient UI patterns)
6. "Migrating from Pages Router to App Router" (migration strategy)

**Target Audience:** React developers, Next.js users  
**Estimated Series Length:** 6-7 posts  
**Difficulty Level:** Intermediate

---

### Series 8: "CSS Architecture for Modern Apps"

**Concept:** Tailwind v4, CSS-in-JS, and styling strategies

**Potential Posts:**
1. "Tailwind v4: What Changed and Why It Matters" (migration guide)
2. "Component Variants with CVA (Class Variance Authority)" (shadcn/ui patterns)
3. "Dark Mode That Doesn't Flash" (theme implementation)
4. "CSS Variables vs. Tailwind Classes: When to Use Each" (hybrid approach)
5. "Print Stylesheets in 2025: Still Relevant?" (PDF generation)
6. "Responsive Typography: Beyond px and rem" (fluid type scales)

**Target Audience:** Frontend developers, designers-who-code  
**Estimated Series Length:** 6-7 posts  
**Difficulty Level:** Beginner to Intermediate

---

## 🔬 Research & Exploration Topics

Topics to research and potentially write about in the future:

### Performance & Optimization
- [ ] View Transitions API in Next.js
- [ ] Partial Prerendering (PPR) in Next.js 15
- [ ] Web Workers for expensive client-side operations
- [ ] Image optimization strategies (beyond next/image)
- [ ] Font loading strategies (FOUT vs. FOIT)

### Testing & Quality
- [ ] E2E testing with Playwright
- [ ] Visual regression testing
- [ ] Accessibility testing automation
- [ ] Performance budgets and CI integration
- [ ] Mutation testing for better coverage

### Infrastructure & DevOps
- [ ] Blue-green deployments on Vercel
- [ ] Feature flags without a service
- [ ] Preview deployments workflow
- [ ] Disaster recovery for serverless apps
- [ ] Multi-tenant Next.js architecture

### Advanced Features
- [ ] Real-time features with Server-Sent Events (SSE)
- [ ] WebSockets in serverless (Pusher, Ably)
- [ ] PDF generation server-side
- [ ] Email templates with React Email
- [ ] Video transcoding on the edge

### User Experience
- [ ] Optimistic UI patterns
- [ ] Skeleton loaders vs. spinners
- [ ] Empty states that convert
- [ ] Error messages users actually understand
- [ ] Progressive enhancement in 2025

### AI & ML Integration
- [ ] OpenAI API integration patterns
- [ ] Semantic search with embeddings
- [ ] AI-generated summaries for blog posts
- [ ] Content moderation with AI
- [ ] Personalized content recommendations

---

## 📈 Content Distribution Strategy

### Primary Channels

**Blog (Primary)**
- Main distribution channel
- Full control over content and design
- SEO foundation

**GitHub (Code Examples)**
- Source code as living documentation
- Issues/Discussions for community feedback
- Stars as social proof

**Social Media (Promotion)**
- Twitter/X: Technical thread with key points
- LinkedIn: Professional angle, career advice
- Reddit: r/nextjs, r/webdev (tactfully)
- Hacker News: Occasional submission for series finales

**Dev.to / Medium (Syndication)**
- Cross-post after 2 weeks (canonical URL to blog)
- Reach broader audience
- Backlinks for SEO

### Community Engagement

**Comments**
- Respond to all Giscus comments within 24 hours
- Ask follow-up questions to encourage discussion
- Feature best comments in future posts

**Newsletter (Future)**
- Monthly digest when backlog is large enough
- Exclusive content or early access
- Start when reaching 10K monthly views

---

## 🎯 Content Goals by Quarter

### Q4 2025 (Current Quarter)
- ✅ Establish monthly publishing cadence
- ✅ Complete 2 posts ("Background Jobs" + "Performance")
- ✅ Document content strategy (this document)
- [ ] Reach 5K monthly blog views
- [ ] Get 50+ Giscus comments across all posts
- [ ] Improve average time on page to 6+ minutes

### Q1 2026
- [ ] Complete "Tiny Portfolio" series (4 more posts)
- [ ] Reach 10K monthly blog views
- [ ] Start second series (pick from backlog)
- [ ] Guest post opportunity or podcast interview
- [ ] 100+ GitHub stars on repo

### Q2 2026
- [ ] Publish 3 posts (continue chosen series)
- [ ] Reach 20K monthly blog views
- [ ] Launch newsletter (if subscriber count justifies)
- [ ] Speak at local meetup about one of the series
- [ ] Feature on high-traffic aggregator (HN, Reddit, etc.)

### Q3 2026
- [ ] Run 2 series in parallel
- [ ] Reach 40K monthly blog views
- [ ] Comprehensive SEO audit and optimization
- [ ] Consider creating video content for YouTube

---

## 📋 Content Production Checklist

### Pre-Writing Phase (1-2 hours)
- [ ] Review outline and key points
- [ ] Gather code examples from repo
- [ ] Create diagrams (architecture, flow charts)
- [ ] Take screenshots if needed
- [ ] Research external sources and competitor content
- [ ] Draft meta description and title variations

### Writing Phase (4-6 hours)
- [ ] Write first draft following outline
- [ ] Add code examples with syntax highlighting
- [ ] Insert images, diagrams, and visual breaks
- [ ] Write introduction hook
- [ ] Write conclusion and key takeaways
- [ ] Add internal links to previous posts
- [ ] Add external links to documentation

### Editing Phase (2-3 hours)
- [ ] Read aloud for flow and clarity
- [ ] Check for typos and grammar (Grammarly)
- [ ] Verify all code examples work
- [ ] Test all links (internal and external)
- [ ] Optimize images (size, format, alt text)
- [ ] Ensure mobile readability
- [ ] Get feedback from trusted reviewer (optional)

### Pre-Publish Phase (1 hour)
- [ ] Add frontmatter (title, summary, tags, dates)
- [ ] Set featured status if applicable
- [ ] Generate OpenGraph image (if custom)
- [ ] Write social media posts (Twitter, LinkedIn)
- [ ] Schedule publish date in CMS/Git
- [ ] Verify sitemap will update
- [ ] Check RSS/Atom feed generation

### Post-Publish Phase (1 hour + ongoing)
- [ ] Share on social media immediately
- [ ] Submit to relevant communities (Reddit, HN - if appropriate)
- [ ] Monitor comments and respond
- [ ] Check analytics after 24 hours
- [ ] Fix any typos or broken links reported
- [ ] Update `done.md` with post completion

**Total Time per Post:** 10-15 hours (research to publish)

---

## 📚 Resources & References

### Writing Tools
- **Grammar:** Grammarly, LanguageTool
- **SEO:** Ahrefs, Semrush (free tier)
- **Images:** Excalidraw (diagrams), Carbon (code screenshots)
- **GIFs/Videos:** Screen Studio, LICEcap

### Inspiration & Research
- **Blogs to follow:**
  - Lee Robinson (Vercel VP, Next.js)
  - Kent C. Dodds (testing, React)
  - Josh W. Comeau (CSS, UI/UX)
  - Dan Abramov (React, deep technical)
  - Tania Rascia (beginner-friendly)

- **Newsletters:**
  - Bytes (JavaScript Weekly)
  - React Status
  - Node Weekly
  - Frontend Focus

### Analytics & SEO
- **Vercel Analytics** - Built-in, track page views
- **Google Search Console** - Monitor search performance
- **Ahrefs Webmaster Tools** - Free SEO audit
- **Plausible/Umami** - Privacy-friendly analytics (future)

---

## 🔄 Review & Update Cadence

**Monthly Review (15th of each month):**
- Review previous month's publishing performance
- Adjust next month's topic if needed
- Update content calendar
- Check backlog for new ideas

**Quarterly Review (End of quarter):**
- Analyze traffic trends and top-performing posts
- Update editorial guidelines based on learnings
- Evaluate series performance (continue or pivot)
- Plan next quarter's content themes

**Annual Review (December):**
- Comprehensive year-in-review post
- Update content strategy for next year
- Evaluate whether to increase publishing frequency
- Consider new content formats (video, podcast, etc.)

---

## 🎬 Next Steps (Immediate Actions)

1. **This Week (Oct 26 - Nov 1):**
   - [ ] Create outline for "Background Jobs" post
   - [ ] Gather code examples from `/src/inngest/`
   - [ ] Create architecture diagram (before/after contact form)
   - [ ] Draft introduction and problem statement

2. **Next Week (Nov 2 - Nov 8):**
   - [ ] Write first draft (2,500 words target)
   - [ ] Add code examples and syntax highlighting
   - [ ] Create Inngest Dev UI screenshots

3. **Week of Nov 9 - Nov 15:**
   - [ ] Edit and polish
   - [ ] Get feedback from trusted reviewer
   - [ ] Create social media posts
   - [ ] Publish on Nov 15

4. **Post-Publish (Nov 15+):**
   - [ ] Promote on social media
   - [ ] Monitor comments and engagement
   - [ ] Start outlining December post

---

**Document Maintenance:**
- Update this document after each post is published
- Track actual vs. estimated writing time to improve planning
- Add new series ideas as they emerge
- Review and adjust goals quarterly

**Owner:** Drew (dcyfr)  
**Last Review:** October 26, 2025  
**Next Review:** November 15, 2025
