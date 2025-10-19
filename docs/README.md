# Documentation

This directory contains project documentation for the developer portfolio.

## Files

### `API.md`
Complete API reference documentation covering:
- GitHub Contributions API (`/api/github-contributions`)
- Contact Form API (`/api/contact`)
- Security features, authentication, testing, and deployment

**Use when**: Implementing API integrations, troubleshooting API issues, or understanding security measures.

### `CSP_IMPLEMENTATION.md`
Comprehensive Content Security Policy documentation:
- Two-layer CSP architecture (middleware + Vercel config)
- Directive explanations and security benefits
- Third-party service configuration
- Testing, troubleshooting, and maintenance
- Future enhancements and compliance information

**Use when**: Understanding CSP setup, adding new services, or troubleshooting CSP violations.

### `CSP_QUICKREF.md`
Quick reference for CSP implementation:
- Current CSP header at a glance
- Common tasks (adding sources, domains)
- Troubleshooting guide
- Testing checklist

**Use when**: Quick lookup for CSP directives or making routine CSP updates.

### `SECURITY_FINDINGS_RESOLUTION.md`
Complete resolution summary for all security assessment findings:
- Finding #1: Content Security Policy implementation
- Finding #2: Clickjacking protection verification
- Finding #3: MIME-sniffing protection verification
- Testing, validation, and compliance information
- Complete security posture before/after comparison

**Use when**: Understanding security improvements, compliance reporting, or reviewing resolved vulnerabilities.

### `RATE_LIMITING.md`
Comprehensive guide to the rate limiting implementation:
- Current in-memory implementation details
- Configuration and usage
- Upgrade paths to distributed Redis solutions (Upstash, Redis Cloud, Vercel KV)
- Testing procedures and monitoring

**Use when**: Understanding rate limiting, upgrading to distributed storage, or troubleshooting rate limit issues.

### `RATE_LIMITING_QUICKREF.md`
Quick reference guide for developers:
- Common code patterns and examples
- API reference for rate limiting functions
- Configuration recommendations by use case
- Debugging and troubleshooting tips

**Use when**: Quick lookup while implementing rate limiting features or debugging rate limit behavior.

### `RATE_LIMITING_FLOW.md`
Visual diagrams and flow charts showing:
- Request flow from client to API
- Rate limit decision logic
- Storage architecture
- Example scenarios and edge cases

**Use when**: Understanding the system architecture or explaining rate limiting to others.

### `VIEW_COUNTS.md`
Implementation guide for blog view tracking:
- Redis-backed storage requirements
- Environment variable configuration
- Verification steps and future enhancements

**Use when**: Setting up or maintaining blog view counts.

### `RATE_LIMITING_IMPLEMENTATION.md`
Implementation summary and change log:
- What was implemented and why
- Files created and modified
- Testing and validation results
- Next steps and future enhancements

**Use when**: Reviewing the implementation, onboarding new contributors, or planning related work.

### `DEPLOYMENT_CHECKLIST.md`
Operational checklist for deploying and verifying the GitHub contributions feature.

**Use when**: Deploying to production, setting up environment variables, or troubleshooting deployment issues.

### `MCP_QUICKREF.md`
Quick reference card for MCP server testing:
- Run the test command
- Interpret results
- Quick troubleshooting fixes
- Documentation links
- MCP servers quick overview

**Use when**: Quick lookup for test command or troubleshooting common issues.

### `MCP_SERVERS.md`
Complete guide to Model Context Protocol (MCP) servers integrated with this project:
- **Context7**: Documentation lookup for Next.js, React, Tailwind, shadcn/ui
- **Sequential Thinking**: Complex problem-solving and architectural planning
- **Memory**: Maintains project context and decisions across conversations
- Configuration details, security best practices, and usage examples
- Integration with project workflow for development, testing, and deployment

**Use when**: Setting up MCP servers, understanding AI tools available, or leveraging MCP capabilities for development tasks.

### `MCP_SERVERS_TEST.md`
Validation test documentation for MCP server dependency checking:
- Running `npm run test:mcp-servers` to validate MCP configuration
- What the test validates and interpretation of results
- Troubleshooting common MCP server issues
- CI/CD integration examples
- Maintenance procedures for MCP server validation

**Use when**: Validating MCP server setup, debugging configuration issues, or integrating MCP tests into CI/CD pipelines.

### `MCP_SERVERS_TEST_IMPLEMENTATION.md`
Implementation summary for MCP server test suite:
- What was delivered (test script, documentation, commands)
- Test coverage details (33 tests across 6 categories)
- MCP servers validated (Context7, Sequential Thinking, Memory)
- Integration with project workflow
- Files created and modified

**Use when**: Understanding what was implemented or reviewing technical changes.

### `MCP_DEPENDENCY_VALIDATION.md`
Comprehensive reference for treating MCP servers as project dependencies:
- Validation test details and results
- Success criteria and metrics
- Continuous integration setup
- Maintenance procedures
- Complete technical documentation

**Use when**: Full reference for MCP server dependency validation or CI/CD integration.

### `TODO.md`
Active project task tracker covering:
- Bugs (active and resolved)
- Feature requests (high/medium/low priority)
- Technical debt and improvements
- Content tasks
- Design and UX enhancements
- Security considerations

**Use when**: Planning new features, tracking progress, or identifying areas for improvement.

---

## Quick Links by Task

### Development & Tools (MCP Servers)
- [MCP Quick Reference](./MCP_QUICKREF.md) — Quick lookup for test command and troubleshooting
- [MCP Servers Guide](./MCP_SERVERS.md) — Setup and usage of Context7, Sequential Thinking, Memory
- [MCP Servers Test](./MCP_SERVERS_TEST.md) — Comprehensive test documentation
- [Test Command](./MCP_SERVERS_TEST.md#running-the-test) — Run `npm run test:mcp-servers`
- [Dependency Validation](./MCP_DEPENDENCY_VALIDATION.md) — Full technical reference

### Security & Protection
- [Security Findings Resolution](./SECURITY_FINDINGS_RESOLUTION.md) - Complete resolution of all security findings
- [Content Security Policy (CSP)](./CSP_IMPLEMENTATION.md) - Full CSP implementation guide
- [CSP Quick Reference](./CSP_QUICKREF.md) - Quick CSP lookup
- [Rate Limiting Documentation](./RATE_LIMITING.md) - Full implementation guide
- [Rate Limiting Quick Reference](./RATE_LIMITING_QUICKREF.md) - Developer quick reference
- [API Security](./API.md#security) - API security features and headers

### Implementation & Development
- [Rate Limiting Implementation Summary](./RATE_LIMITING_IMPLEMENTATION.md) - What was built
- [Rate Limiting Flow Diagrams](./RATE_LIMITING_FLOW.md) - Visual architecture
- [API Reference](./API.md) - Complete API documentation

### Planning & Tasks
- [TODO List](./TODO.md) - Active tasks and feature roadmap
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Production deployment guide

---

## Documentation Organization

- **Active documentation**: Files in this directory are current and actively maintained
- **Historical records**: Past implementation notes, completed work logs, and analysis documents have been archived or removed
- **Updates**: Last updated October 5, 2025

## Related Documentation

- `/.github/copilot-instructions.md` - AI contributor guide and architecture overview
- `/agents.md` - Auto-synced copy of AI instructions (root level)
- `/README.md` - Project overview and quick start guide
- `/src/content/blog/README.md` - Blog content guidelines

## Contributing

When adding documentation:
- Keep files focused and up-to-date
- Remove or consolidate outdated information
- Cross-reference related files
- Update this README when adding new documentation
