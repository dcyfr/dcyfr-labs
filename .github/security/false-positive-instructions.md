# DCYFR False-Positive Filtering Instructions

<!-- TLP:AMBER -->
<!-- Referenced by .github/workflows/security-review.yml via false-positive-filtering-instructions -->
<!-- Plain English instructions telling Claude which findings to suppress or downgrade. -->

## Suppress These Categories Entirely

- **Denial of Service / rate limiting on public endpoints**: We use Upstash
  rate limiting deliberately on public API routes. Any finding about missing
  or insufficient rate limiting on public-facing endpoints does not need to
  be reported unless rate limiting is completely absent server-wide.

- **Memory / CPU exhaustion**: These are infrastructure-level concerns handled
  by Vercel's edge runtime limits. Application-level DoS from unbounded loops
  is still reportable.

- **Open redirect on marketing / social share URLs**: The site intentionally
  has social sharing links that accept external URLs (Twitter share, LinkedIn
  share, etc.). These are not vulnerabilities.

- **Missing HttpOnly / Secure flags on session cookies**: We are evaluating
  Next.js Auth.js session configuration separately. Do not report per-cookie
  flag issues.

- **Missing CSRF tokens on GET requests**: GET requests should never have
  side effects in this codebase. CSRF only applies to state-mutating endpoints.

- **Generic "use parameterised queries" warnings on ORM calls**: We use Drizzle
  ORM. Findings that correctly identify a Drizzle query builder call as
  "concatenated string" when it is in fact a parameterised ORM method are
  false positives.

- **Environment variable presence checks**: Calls to
  `process.env.SOME_SECRET` are a configuration pattern, not a hardcoded
  secret. Only report when an actual secret value is hardcoded in source.

- **`dangerouslySetInnerHTML` in MDX blog components**: The blog renderer
  sanitises all input through `rehype-sanitize` before rendering. Do not
  report `dangerouslySetInnerHTML` findings in `src/components/common/mdx.tsx`
  or any MDX rendering pipeline component unless sanitisation is bypassed.

## Lower Severity (Report as Low / Informational Only)

- Design token validation scripts and internal build scripts that process
  trusted developer-authored content — these don't handle untrusted user input.

- Test files (`*.test.ts`, `*.spec.ts`, `e2e/`) — security issues in test
  infrastructure are lower priority and should be noted but not block PRs.

- Internal admin routes under `src/app/admin/` that are protected by
  Anthropic-issued API verification — note access control concerns but mark
  as informational unless an actual bypass is demonstrated.

## Always Report (Do Not Suppress Even If Matching Above)

- Any hardcoded API key, token, or credentials string (even in comments or
  test fixtures).
- Server-Side Request Forgery (SSRF) affecting proxy or URL-fetch routes.
- SQL injection or NoSQL injection in any context.
- Remote Code Execution in any form.
- Broken authentication or privilege escalation on API routes.
- Data exfiltration or PII logged to Vercel / Sentry without redaction.

---

## Calibration Log — First Real PR Findings (PR #282, 2026-03-03)

### Review summary

PR: `feat(api): add AI post summarization endpoint` (`feat/ai-post-summary-endpoint`)
Reviewer: `copilot-pull-request-reviewer`
Total inline findings: 7

### Triage

| # | Line | Finding | Verdict | Action |
| - | ---- | ------- | ------- | ------ |
| 1 | 26 | Docblock says "hyphens only" but regex allows `/` | False positive — doc accuracy, not a security issue | Docblock updated to match actual behaviour |
| 2 | **84** | **Leading `/` in slug allows `path.join` to escape CONTENT_DIR (path traversal)** | **REAL — High** | Fixed: regex tightened to disallow leading/trailing slashes and empty segments |
| 3 | **181** | **No Content-Length / body size check before `request.json()` — DoS surface** | **REAL — Medium** | Fixed: 4 KB cap enforced via Content-Length header and raw body length check |
| 4 | 137 | `parsed.summary` returned without verifying it is a string | Code quality / robustness, not a security issue | Acceptable at current risk level; can improve with runtime validation later |
| 5 | 215 | `await recordApiCall()` on a synchronous function; wrong endpoint path string | Style / misleading code — not a security issue | Fixed as part of patch commit |
| 6 | 238 | Error catch block only logs message string, losing stack trace | Observability quality — not a security issue | Fixed: structured logging with stack and request context added |
| 7 | 170 | No automated tests added for new route | Coverage gap — not a security issue | Deferred; tracked separately |

### False-positive rate: 5/7 (71%)

### Suppression rules added by this review

None required — the 5 non-security findings don't represent a suppressible
pattern, they span documentation, style, observability, and coverage categories
that are better handled by the PR author than suppressed globally. The two real
findings (path traversal, body size) were actionable and correctly flagged.

### Lessons

- Claude Code **does** catch real path traversal issues when a user-supplied
  slug value flows into `path.join()`. Do not suppress path traversal warnings
  on endpoints that call `getPostBySlug()` or any function that reads from the
  filesystem using user input.
- Body size / DoS findings are **medium priority** and actionable; they should
  not be suppressed globally even though rate limiting is in place (rate
  limiting and body size caps defend different attack vectors).
- Style and observability comments (await-on-sync, logging quality, test
  coverage) are noise in a security review context. If future reviews produce
  many of these, consider adding a suppression rule for "non-security code
  quality comments in files that have existing test coverage".
