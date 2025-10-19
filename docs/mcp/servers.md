# MCP Servers Configuration & Usage Guide

## Overview

This project uses **Model Context Protocol (MCP)** servers in VS Code to enhance AI-assisted development with secure, local integrations and intelligent tools.

## Active MCP Servers

### 1. **Context7** (`@upstash/context7-mcp@latest`)

**Purpose**: Documentation and knowledge base lookup for libraries and frameworks

**Use Cases**:
- Fetch up-to-date documentation for Next.js, React, Tailwind CSS, and shadcn/ui
- Get code examples and API references without leaving the editor
- Verify library APIs before making assumptions in implementations

**How to Use**:
- Ask about library-specific features: "How do I implement streaming in Next.js?"
- Request documentation: "Show me the latest shadcn/ui Button component API"
- Get code examples: "What's the pattern for using React hooks in Server Components?"

**Benefits**:
- ✅ Always up-to-date documentation
- ✅ No external web calls required
- ✅ Faster than searching manually
- ✅ Integrated directly into the coding workflow

---

### 2. **Sequential Thinking** (`@modelcontextprotocol/server-sequential-thinking`)

**Purpose**: Complex problem-solving, planning, and multi-step task breakdown

**Use Cases**:
- Plan architectural decisions and design patterns
- Debug complex issues with structured reasoning
- Break down large refactoring tasks into steps
- Verify logic before implementation

**How to Use**:
- "Debug this race condition in the rate limiter"
- "Plan the migration from in-memory cache to Upstash Redis"
- "Help me design the CSP implementation strategy"
- "Break down the API integration into steps"

**Benefits**:
- ✅ Transparent reasoning process (see all thinking steps)
- ✅ Catches edge cases and potential issues early
- ✅ Produces well-structured plans
- ✅ Reduces bugs by thinking through problems systematically

---

### 3. **Memory** (`@modelcontextprotocol/server-memory`)

**Purpose**: Maintains project context, decisions, and patterns across conversations

**Use Cases**:
- Track project decisions and architectural patterns
- Build context about code conventions and project-specific idioms
- Maintain continuity across multiple development sessions
- Reference previously learned project quirks and best practices

**How to Use**:
- Store decisions: "Remember: We prefer Tailwind utilities over CSS classes"
- Reference context: "What was our decision on error handling?"
- Track patterns: "Add this to project patterns: Always use `cn()` for class merging"

**Benefits**:
- ✅ No need to repeat context in every conversation
- ✅ Consistent patterns across the project
- ✅ Faster development with learned conventions
- ✅ Better continuity when switching between tasks

---

## Additional Tools

### Snyk Extension
**Purpose**: Security scanning and vulnerability analysis

**Features**:
- Scan for vulnerabilities in dependencies (SCA)
- Static Application Security Testing (SAST)
- Container image security scanning
- Infrastructure as Code (IaC) security analysis

### GitHub Pull Requests Extension
**Purpose**: PR management and review directly in VS Code

**Features**:
- Create, view, and manage pull requests
- Review code changes
- Add comments and suggestions
- Merge PRs without switching to the browser

---

## Configuration

### File Location
```
~/.config/Code/User/mcp.json  (Linux/macOS)
%APPDATA%\Code\User\mcp.json  (Windows)
```

### Current Configuration
```json
{
  "servers": {
    "sequentialthinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "type": "stdio"
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MEMORY_FILE_PATH": "${input:memory_file_path}"
      },
      "type": "stdio"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "type": "stdio"
    }
  }
}
```

---

## Security & Best Practices

### ✅ Do's
- ✅ Use MCP servers for documentation lookups instead of external web calls
- ✅ Use Memory to track project context and decisions
- ✅ Use Sequential Thinking for complex architectural decisions
- ✅ Keep secrets in environment variables and `.env.local`
- ✅ Use server routes (`src/app/api/*`) for third-party API calls

### ❌ Don'ts
- ❌ Never print tokens or API keys
- ❌ Don't exfiltrate secrets outside MCP boundaries
- ❌ Don't assume library APIs without checking Context7
- ❌ Don't make direct network calls when an MCP server can help

---

## When to Use Each MCP Server

| Task | Server | Why |
|------|--------|-----|
| "How do I use X in Next.js?" | Context7 | Get authoritative, up-to-date docs |
| "Debug this complex issue" | Sequential Thinking | Think through problems systematically |
| "What's our pattern for X?" | Memory | Reference project conventions |
| "Add security feature Y" | Snyk + MCP servers | Scan + research best practices |
| "Manage/review a PR" | GitHub PRs | Integrated PR workflow |

---

## Troubleshooting

### MCP Server Not Responding
1. Check that the server is configured in `mcp.json`
2. Ensure `npx` is available in your PATH
3. Restart VS Code
4. Check the MCP extension logs

### Memory Not Persisting
- Verify `MEMORY_FILE_PATH` is set correctly
- Ensure the directory exists and is writable
- Check file permissions

### Context7 Documentation Outdated
- Context7 pulls from up-to-date sources
- If results seem outdated, describe your issue more specifically
- The tool will fetch the most current available documentation

---

## Integration with Project Workflow

### Development
1. Start dev server: `npm run dev`
2. Use **Context7** for API lookups
3. Use **Sequential Thinking** for architectural decisions
4. Use **Memory** to maintain project context

### Testing
1. Write tests locally
2. Use **Snyk** for security analysis
3. Use **Sequential Thinking** to plan test cases

### Code Review
1. Use **GitHub Pull Requests** to manage PRs
2. Use **Snyk** to scan for vulnerabilities
3. Use **Sequential Thinking** to review complex logic

### Deployment
1. Build: `npm run build`
2. Scan with **Snyk** before merging
3. Use **Sequential Thinking** to plan deployment steps

---

## Reference Files

Key project files that benefit from MCP server support:
- `.github/copilot-instructions.md` — Main contributor guide
- `agents.md` — Auto-synced agent instructions
- `src/app/layout.tsx` — Theme provider, SEO setup
- `src/app/api/*` — API routes (server-side operations)
- `src/lib/rate-limit.ts` — Rate limiting logic
- `src/components/*` — UI components

---

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Context7 Documentation](https://context7.upstash.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
