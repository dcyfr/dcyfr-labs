# GitHub MCP Quick Reference

**Status**: ✅ Installed and Ready (HTTP MCP)  
**Version**: GitHub Copilot HTTP MCP  
**Updated**: November 11, 2025

## ⚡ Quick Start (1 minute)

### 1. Configuration
The GitHub MCP is now configured as an HTTP server that uses your existing VS Code GitHub authentication:

```json
{
  "github": {
    "type": "http",
    "url": "https://api.githubcopilot.com/mcp/"
  }
}
```

**No additional token setup required!** The server uses your VS Code GitHub credentials automatically.

### 2. Activate the Server
1. Reload VS Code window: `Cmd+Shift+P` → "Developer: Reload Window"
2. GitHub MCP tools become available immediately

### 3. Start Using
```
"Create a new branch for this feature"
"Update the README in the remote repository"
"Fork this repository to my account"
"Get my team members"
"Assign Copilot to issue #123"
```

## 🛠️ Configuration Files

### VS Code Workspace Config
```
.vscode/mcp.json
```

Contains:
- GitHub HTTP MCP server configuration
- Uses VS Code's existing GitHub authentication
- No token management required

**Configuration**:
```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

## 📦 Available Toolsets

Default enabled:
- `context` - User/org context
- `repos` - Repository operations
- `issues` - Issue management
- `pull_requests` - PR operations
- `users` - User information

Add more by modifying Docker env:
```json
"GITHUB_TOOLSETS": "default,actions,code_security"
```

## 🔑 What You Can Do

### Code Discovery
```
"Find all files that import React"
"Search for TODO comments in the codebase"
"Show the project structure"
```

### Issue Automation
```
"Create a bug report for the login issue"
"List all high-priority open issues"
"Add a comment to issue #42"
```

### PR Operations
```
"Create a PR with my changes"
"Show PR reviews and comments"
"Merge PR #15 when ready"
```

### CI/CD Intelligence
```
"What's the status of the latest workflow run?"
"Show failed tests from the last build"
"Trigger a deployment workflow"
```

## 🔒 Security Checklist

- [ ] Token created with minimal necessary permissions
- [ ] Token has reasonable expiration date
- [ ] Token never committed to git
- [ ] Review what repo/org scopes you're allowing
- [ ] Rotate token every 3-6 months

## 🚀 Docker Management

Pull latest:
```bash
docker pull ghcr.io/github/github-mcp-server
```

Check if running:
```bash
docker ps | grep github-mcp-server
```

## ❌ Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| "Cannot connect to Docker" | Start Docker app and wait 30s |
| "Token rejected" | Verify token has correct permissions |
| "MCP won't start" | Update VS Code to 1.101+ |
| "Specific tool unavailable" | Check toolset is enabled in config |

## 📚 Documentation Files

- `docs/mcp/github/implementation.md` - Complete guide (30min read)
- `docs/mcp/github/setup.md` - Step-by-step onboarding (15min read)
- This file - Quick reference (5min read)

## 🔗 Useful Links

- **GitHub MCP Repo**: https://github.com/github/github-mcp-server
- **Create PAT**: https://github.com/settings/personal-access-tokens/new
- **GitHub Docs**: https://docs.github.com

## 💡 Pro Tips

1. **Use read-only mode** for sensitive/production repos
2. **Limit toolsets** to what you actually need (faster, cleaner)
3. **Rotate tokens regularly** for security
4. **Combine with Filesystem MCP** for powerful code analysis
5. **Check GitHub Actions logs** when diagnosing CI failures

## 📊 Current Setup

Active MCPs (5):
- ✅ Context7 - Documentation lookup
- ✅ Sequential Thinking - Complex planning
- ✅ Memory - Context persistence
- ✅ Filesystem - File operations
- ✅ **GitHub** ← NEW!

---

**Ready to go!** Start using GitHub operations in your AI conversations. 🚀
