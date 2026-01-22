# CodeQL Suppression Patterns

**File:** `.github/agents/patterns/CODEQL_SUPPRESSIONS.md`
**Last Updated:** January 21, 2026
**Scope:** False positive handling, suppression syntax, when to suppress vs dismiss

---

## ⚠️ Important: Fix > Suppress

**Primary Strategy:** Always prefer fixing the underlying security issue over suppressing the alert.

**When to fix instead of suppress:**
- ✅ **Always** for High severity findings
- ✅ **Prefer** for Medium severity findings
- ✅ When the fix improves code quality
- ✅ When the fix is straightforward

**Only suppress when:**
- ❌ Issue is a confirmed false positive
- ❌ Fix would require major refactoring
- ❌ Code is intentionally using pattern for valid reason

**See:** [`docs/security/private/CODEQL_FINDINGS_RESOLVED.md`](../../../docs/security/private/CODEQL_FINDINGS_RESOLVED.md) for examples of proper fixes vs suppression.

---

## When to Suppress vs Dismiss

### Suppress Locally (Preferred for Patterns)

**Best for:**

- Recurring false positives in similar code
- Patterns that appear multiple times
- Code that should document why it's safe
- Team-wide learning opportunities

**Benefits:**

- ✅ Visible in source code
- ✅ Documents reasoning inline
- ✅ Persists across branches/resets
- ✅ Reviewable in PRs
- ✅ Helps team understand design

**Method:** Add `// lgtm` comment

### Dismiss via GitHub API (For One-Offs)

**Best for:**

- Single false positives
- Alerts that are truly irrelevant
- Deprecated/archived code

**Benefits:**

- ✅ Cleaner GitHub UI
- ✅ No code changes needed

**Method:** GitHub Security tab → Dismiss

---

## Suppression Syntax

### Standard LGTM Comment

```javascript
// lgtm [rule-id] - Reason why this is safe
const riskyOperation = doSomething();
```

### Full Format

```javascript
/**
 * lgtm [js/file-access-to-http]
 *
 * URLs come from trusted configuration (MCP servers list),
 * not user input. This script is build-time only.
 */
const res = await fetch(url, { method: "HEAD" });
```

### Multiple Rules

```javascript
// lgtm [js/rule1, js/rule2] - Both rules apply to this line
const value = unsafeOperation();
```

---

## Common False Positives

### Pattern 1: js/file-access-to-http

**Rule:** `js/file-access-to-http`
**Severity:** Warning
**False Positive When:**

- URLs from trusted configuration (not user input)
- Build-time/dev-time scripts (not production)
- Legitimate HTTP requests are the entire purpose

**Example:**

```javascript
// lgtm [js/file-access-to-http] - URLs from trusted MCP server configuration
const res = await fetch(url, { method: "HEAD" });
```

**Context:** `scripts/check-mcp-servers.mjs` - health check utility

---

### Pattern 2: js/stored-xss

**Rule:** `js/stored-xss`
**Severity:** High
**False Positive When:**

- Data from trusted sources (MDX files, version-controlled content)
- React JSX auto-escapes by default
- No `dangerouslySetInnerHTML` used

**Example:**

```typescript
// lgtm [js/stored-xss] - Image URLs from trusted MDX frontmatter, React escapes output
const image = ensurePostImage(post.image);
return <Image src={image} alt={post.title} />;
```

**Context:** `src/components/post-list.tsx` - blog post rendering

---

### Pattern 3: js/insecure-randomness

**Rule:** `js/insecure-randomness`
**Severity:** High
**False Positive When:**

- Not used for security-sensitive decisions (not auth)
- Primary path uses `crypto.randomUUID()`
- Fallback for legacy browsers only
- Non-security use case (analytics, sessions)

**Example:**

```typescript
// lgtm [js/insecure-randomness] - Non-security context (analytics session ID)
// Primary: crypto.randomUUID(), Fallback: Math.random() for old browsers
const sessionId =
  globalThis.crypto?.randomUUID?.() || Math.random().toString(36).substring(7);
```

---

### Pattern 4: js/missing-origin-check

**Rule:** `js/missing-origin-check`
**Severity:** Warning/Medium
**False Positive When:**

- Origin check exists within the message handler function body
- `ALLOWED_ORIGINS` list validates `event.origin`
- CodeQL doesn't recognize internal function checks

**Example:**

```typescript
// lgtm [js/missing-origin-check] - Origin verified at line 21 via ALLOWED_ORIGINS check
const handleMessage = (event: MessageEvent) => {
  // Security: Verify origin before processing message
  if (!ALLOWED_ORIGINS.includes(event.origin)) {
    console.warn("Rejected message from unauthorized origin:", event.origin);
    return;
  }

  // Process message safely
  if (event.data && event.data.type === "setTheme") {
    // ...
  }
};
```

**Context:** `src/app/(embed)/embed-theme-handler.tsx` - Embed iframe communication

---

### Pattern 5: actions/missing-workflow-permissions

**Rule:** `actions/missing-workflow-permissions`
**Severity:** Warning
**False Positive When:**

- Workflow has explicit permissions block
- Permissions properly scoped to minimal needed
- Already in `.github/workflows/*.yml`

**Example:**

```yaml
name: Test Workflow
permissions:
  contents: read
  pull-requests: write
```

---

## Full Example: check-mcp-servers.mjs

This file contains 3 `fetch()` calls flagged as `js/file-access-to-http`:

```javascript
/**
 * MCP Server Health Check
 *
 * Checks if configured MCP servers are reachable.
 *
 * URLs come from trusted servers configuration in .env or hardcoded list.
 * Not exposed to user input. Build-time utility only.
 */

async function checkServer(url, name, opts = {}) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    // lgtm [js/file-access-to-http] - URLs from trusted MCP server configuration, not user input
    const res = await fetch(url, {
      method: "HEAD",
      headers,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (res.status === 405) {
      // Try GET fallback
      const controller2 = new AbortController();
      const timer2 = setTimeout(() => controller2.abort(), timeoutMs * 2);

      // lgtm [js/file-access-to-http] - URLs from trusted MCP server configuration, not user input
      const res2 = await fetch(url, {
        method: "GET",
        headers,
        signal: controller2.signal,
      });

      clearTimeout(timer2);
      return { ok: res2.ok };
    }

    return { ok: res.ok };
  } catch (err) {
    try {
      const controller3 = new AbortController();
      const timer3 = setTimeout(() => controller3.abort(), timeoutMs * 2);

      // lgtm [js/file-access-to-http] - URLs from trusted MCP server configuration, not user input
      const res3 = await fetch(url, {
        method: "GET",
        headers,
        signal: controller3.signal,
      });

      clearTimeout(timer3);
      return { ok: res3.ok };
    } catch (err2) {
      return { ok: false, error: err2 };
    }
  }
}
```

---

## Verification After Suppression

### Local Verification

```bash
# Run CodeQL locally
npm run codeql:analyze

# Or use GitHub CLI
gh code-scanning alerts list
```

### GitHub Verification

1. Go to **Security** → **Code scanning alerts**
2. Filter by rule: `js/file-access-to-http`
3. Verify alerts are gone (no longer open)
4. Suppression comments may take 24h to reflect in UI

---

## Documentation Standards

### Minimum Requirement

```javascript
// lgtm [rule-id] - Brief reason
```

### Recommended

```javascript
// lgtm [rule-id] - Specific reason explaining why this is safe
```

### Best Practice (Team Learning)

```javascript
/**
 * lgtm [rule-id]
 *
 * Detailed explanation of:
 * 1. Why the rule triggered
 * 2. Why it's a false positive in this context
 * 3. What safeguards are in place
 */
```

---

## Examples of Proper Fixes (January 2026)

### js/incomplete-multi-character-sanitization

**❌ Wrong Approach: Suppress**
```typescript
// lgtm [js/incomplete-multi-character-sanitization]
const text = html.replace(/<[^>]*?>/g, '');
```

**✅ Right Approach: Fix with Multi-Pass Sanitization**
```typescript
const text = html
  // Remove script/style tags and content first
  .replace(/<(script|style)[^>]*>.*?<\/\1>/gi, '')
  // Remove all remaining HTML tags
  .replace(/<[^>]+>/g, '')
  // Decode HTML entities
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  // Normalize whitespace
  .replace(/\s+/g, ' ')
  .trim();
```

### js/missing-anchor

**❌ Wrong Approach: Suppress**
```typescript
// lgtm [js/missing-anchor]
expect(screen.getByText(/some text/)).toBeVisible();
```

**✅ Right Approach: Use String Matching Instead of Regex**
```typescript
expect(screen.getByText((content, element) =>
  content.includes('some text')
)).toBeVisible();
```

### js/log-injection

**❌ Wrong Approach: Suppress with Basic Sanitization**
```typescript
// lgtm [js/log-injection]
const safe = error.message.replace(/[\r\n]/g, ' ');
```

**✅ Right Approach: Comprehensive Control Character Removal**
```typescript
const safe = error.message
  // Remove all control characters (0x00-0x1F, 0x7F-0x9F)
  .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
  // Remove newlines and tabs
  .replace(/[\r\n\t]/g, ' ')
  // Remove ANSI escape codes
  .replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '')
  // Normalize whitespace
  .replace(/\s+/g, ' ')
  .trim()
  .substring(0, 200);
```

### js/command-line-injection

**❌ Wrong Approach: Suppress with Comment About "Trusted Input"**
```javascript
// lgtm [js/command-line-injection] - Input is from npm scripts
execSync(`command ${userInput}`);
```

**✅ Right Approach: Validate with Allowlist Pattern**
```javascript
// Validate input against allowlist
const validPattern = /^[a-z0-9._-]+$/i;
if (!validPattern.test(userInput)) {
  console.error(`❌ Invalid input: ${userInput}`);
  process.exit(1);
}
execSync(`command ${userInput}`);
```

**See Full Details:** [`docs/security/private/CODEQL_FINDINGS_RESOLVED.md`](../../../docs/security/private/CODEQL_FINDINGS_RESOLVED.md)

---

## LGTM Naming

The `lgtm` syntax comes from **LGTM.com** (Looks Good To Me), a legacy code analysis platform. GitHub CodeQL adopted this standard for cross-tool compatibility.

---

## Quick Reference

| Task                           | Method                         |
| ------------------------------ | ------------------------------ |
| **False positive (recurring)** | Add `// lgtm` comment          |
| **False positive (one-off)**   | Dismiss via GitHub             |
| **Document reasoning**         | Use multi-line comment         |
| **Multiple rules**             | `lgtm [rule1, rule2]`          |
| **Verify suppression**         | `gh code-scanning alerts list` |
| **Check CodeQL status**        | GitHub Security tab            |

---

## Related Documentation

- **API Patterns:** `.github/agents/patterns/API_PATTERNS.md`
- **Component Patterns:** `.github/agents/patterns/COMPONENT_PATTERNS.md`
- **Testing Patterns:** `.github/agents/patterns/TESTING_PATTERNS.md`
- **Security Documentation:** `docs/security/`
