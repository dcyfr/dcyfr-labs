# Documentation

This directory is the knowledge base for the portfolio. Content is now organized by topic-focused subfolders so it is faster to find the right reference.

## Directory Overview

- `ai/discovery/` – AI discovery research, including [`overview.md`](./ai/discovery/overview.md), [`summary.md`](./ai/discovery/summary.md), and [`quick-reference.md`](./ai/discovery/quick-reference.md).
- `api/` – API integration references such as [`reference.md`](./api/reference.md).
- `mcp/` – Model Context Protocol documentation, including:
	- [`servers.md`](./mcp/servers.md) and [`quick-reference.md`](./mcp/quick-reference.md).
	- `filesystem-git/` for the Filesystem and Git MCP rollout (index, integration, quick reference, ready checklist).
	- `github/` for the GitHub MCP deployment notes and quick references.
	- `tests/` for validation documentation (`servers-test.md`, `servers-test-implementation.md`, `dependency-validation.md`).
- `operations/` – Operational checklists and historical change logs such as [`deployment-checklist.md`](./operations/deployment-checklist.md) and [`implementation-changelog.md`](./operations/implementation-changelog.md).
- `performance/` – Site performance findings, currently [`inp-optimization.md`](./performance/inp-optimization.md).
- `platform/` – Platform configuration references like [`site-config.md`](./platform/site-config.md) and [`view-counts.md`](./platform/view-counts.md).
- `rss/` – Feed documentation (`improvements.md`, `quick-reference.md`).
- `security/` – Security guidance including:
	- `csp/` for Content Security Policy implementation and quick reference.
	- `rate-limiting/` for rate limiting guides, flows, and implementation summaries.
	- [`security-findings-resolution.md`](./security/security-findings-resolution.md).
- `archive/` – Historical or superseded documentation retained for reference. Files here are read-only snapshots of earlier milestones.

## Quick Links

| Topic | Primary References |
|-------|--------------------|
| AI Discovery | [`overview.md`](./ai/discovery/overview.md) · [`summary.md`](./ai/discovery/summary.md) |
| APIs | [`api/reference.md`](./api/reference.md) |
| MCP (Core) | [`mcp/servers.md`](./mcp/servers.md) · [`mcp/quick-reference.md`](./mcp/quick-reference.md) |
| MCP (Filesystem + Git) | [`mcp/filesystem-git/index.md`](./mcp/filesystem-git/index.md) · [`mcp/filesystem-git/integration.md`](./mcp/filesystem-git/integration.md) |
| MCP Tests | [`mcp/tests/servers-test.md`](./mcp/tests/servers-test.md) · [`mcp/tests/dependency-validation.md`](./mcp/tests/dependency-validation.md) |
| Security – CSP | [`security/csp/implementation.md`](./security/csp/implementation.md) · [`security/csp/quick-reference.md`](./security/csp/quick-reference.md) |
| Security – Rate Limiting | [`security/rate-limiting/guide.md`](./security/rate-limiting/guide.md) · [`security/rate-limiting/quick-reference.md`](./security/rate-limiting/quick-reference.md) |
| Security Findings | [`security/security-findings-resolution.md`](./security/security-findings-resolution.md) |
| Operations | [`operations/todo.md`](./operations/todo.md) · [`operations/deployment-checklist.md`](./operations/deployment-checklist.md) |
| Platform | [`platform/site-config.md`](./platform/site-config.md) · [`platform/view-counts.md`](./platform/view-counts.md) |
| RSS | [`rss/improvements.md`](./rss/improvements.md) |

## Maintenance Guidelines

- Keep new documentation in the appropriate topical folder; avoid reintroducing flat files at the root.
- Normalize headings to start with a level-one title (`# Title`) followed by a short **Summary** section when adding new content.
- When archiving superseded material, move it into `archive/` and add a note at the top describing why it is archived.
- Update this README whenever folders or key references change to maintain a reliable entry point.

## Related References

- `.github/copilot-instructions.md` – AI contributor guidelines and architectural constraints.
- `agents.md` – Auto-synced instructions consumed by agents.
- Project root `README.md` – High-level overview and developer quick start.

_Last reorganized: October 19, 2025._
