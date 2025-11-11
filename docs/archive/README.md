# Documentation Archive

This directory contains **historical documentation** for completed features and implementations. These files serve as reference for understanding how specific features were built and the decisions made during development.

## Purpose

Archive documents are **read-only snapshots** of:
- Implementation completion summaries
- Feature rollout documentation
- Historical bug fixes and patches
- Migration guides for completed refactors

## When to Use Archive Docs

**Use these docs when:**
- Understanding the history of a feature implementation
- Learning from past architectural decisions
- Troubleshooting issues related to older implementations
- Researching how a specific problem was solved

**Do not use for:**
- Current development guidance (use main docs instead)
- Active feature documentation (see `/docs` root directories)
- Ongoing refactoring or optimization work

## Archive Contents

### Security & Performance (Completed)
- **`csp-implementation-complete.md`** - Content Security Policy rollout
- **`csp-nonce-fix.md`** - CSP nonce implementation fix
- **`csp-vercel-live-fix.md`** - Production CSP deployment fix
- **`rate-limiting-implementation-complete.md`** - Rate limiting system implementation

### MCP Integration (Completed)
- **`mcp-implementation-complete.md`** - Model Context Protocol setup
- **`mcp-test-complete.md`** - MCP testing and validation
- **`mcp-filesystem-git-complete-summary.md`** - Filesystem + Git MCP integration

### Component Implementations (Completed)
- **`social-links-implementation-complete.md`** - Social links component extraction

## Current Documentation

For **active development**, refer to:
- **Architecture**: `/docs/architecture/` - Current patterns and guidelines
- **Features**: `/docs/features/` - Active feature documentation
- **Security**: `/docs/security/` - Current security implementation
- **Components**: `/docs/components/` - Active component documentation

## Maintenance

**Archiving Guidelines:**
1. Add completion date to archived document
2. Add note at top explaining why it's archived
3. Update this README with new archive entries
4. Keep original content intact (do not edit historical content)
5. Link to current documentation if applicable

---

**Last Updated:** November 10, 2025  
**Total Archived Docs:** 8
