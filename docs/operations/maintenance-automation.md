# Maintenance Automation System

**Status:** Phase 1-2 Complete (Testing + Security Automation)
**Last Updated:** November 28, 2025

---

## Overview

Automated recurring maintenance tasks with GitHub Issues, email alerts, and dashboard metrics. The system creates notification-based workflows that integrate with existing infrastructure (GitHub Actions, Inngest, Sentry, Redis).

**Priorities:**
- Testing (5) ✅ **Implemented**
- Security (4) ✅ **Implemented**
- Content (3) - Planned
- AI/Dev (3) - Planned
- Cleanup (2) - Planned

---

## Phase 1: Testing Automation ✅

### Weekly Test Health Reports

**Workflow:** [`.github/workflows/weekly-test-health.yml`](.github/workflows/weekly-test-health.yml)

**Schedule:** Every Monday at 08:00 UTC (after Dependabot runs)

**What it does:**
1. Runs full test suite with coverage
2. Compares results to previous week's baseline
3. Queries Sentry API for related production errors
4. Creates GitHub Issue if:
   - Pass rate < 95%
   - Coverage decreased > 2%
   - Critical tests failing
5. Sends email alert for critical failures only

**Sentry Enrichment:**
- Automatically queries Sentry for errors matching test failures
- Includes error count, affected users, stack traces
- Links to Sentry issues for investigation

**Deduplication:**
- Checks for existing open Issues with `test-health` label
- Updates existing Issue instead of creating duplicates
- Uses Redis cache to prevent spam

### Scripts

**`scripts/analyze-test-health.mjs`**
- Main analysis script
- Parses Vitest JSON output
- Extracts metrics: pass rate, coverage, slow tests, flaky tests
- Compares to baseline from previous run
- Generates Issue body with markdown tables

**`scripts/sentry-enricher.mjs`**
- Queries Sentry API for related errors
- Matches test failures to production errors
- Formats enrichment data as markdown
- Rate-limited to prevent API throttling

**`scripts/github-api.mjs`**
- Shared GitHub API utilities
- Issue creation, updating, deduplication
- Branch management
- CodeQL alert fetching

### Issue Template

**`.github/ISSUE_TEMPLATE/test-health-report.md`**
- Standardized format for test health reports
- Includes metrics, failures, Sentry data, action items
- Auto-assigned to `drew` with `test-health` and `automated` labels

### Manual Triggering

You can manually trigger the workflow from GitHub Actions tab:

```
Actions → Weekly Test Health → Run workflow
```

Options:
- `create_issue`: Create Issue even if tests are healthy (for testing)

### Monitoring

**GitHub Actions:**
- Check workflow runs: [Actions tab](https://github.com/dcyfr/cyberdrew-dev/actions/workflows/weekly-test-health.yml)
- View test artifacts: Uploaded for 90 days
- Coverage reports: Uploaded for 30 days

**GitHub Issues:**
- Filter by label: [`test-health`](https://github.com/dcyfr/cyberdrew-dev/issues?q=is%3Aissue+label%3Atest-health)
- Auto-assigned to `drew`

**Email Alerts:**
- Sent via Resend for critical failures only
- Pass rate < 90% triggers immediate alert

---

## Phase 2: Security Automation ✅

### Monthly Security Reviews

**Workflow:** [`.github/workflows/monthly-security-review.yml`](.github/workflows/monthly-security-review.yml)

**Schedule:** First day of each month at 09:00 UTC

**What it does:**
1. Runs `npm audit` to check for dependency vulnerabilities
2. Queries CodeQL for security findings (last 30 days)
3. Lists open Dependabot PRs and categorizes them
4. Analyzes branches for cleanup (merged + stale)
5. Generates SBOM (Software Bill of Materials)
6. Creates GitHub Issue if:
   - Critical or high severity vulnerabilities found
   - More than 5 open Dependabot PRs
   - Critical/high CodeQL findings
7. Auto-deletes merged branches (optional, dry run by default)

### Scripts

**`scripts/security-audit.mjs`**
- Runs npm audit and parses JSON output
- Fetches CodeQL alerts via GitHub API
- Lists Dependabot PRs using gh CLI
- Generates SBOM (CycloneDX format)
- Aggregates all findings into single Issue

**`scripts/branch-cleanup.mjs`**
- Lists all repository branches
- Categorizes: protected, merged, stale, active
- Auto-deletes merged branches >7 days old (if enabled)
- Flags stale branches (>90 days inactive) for manual review
- Generates cleanup checklist for Issue

### Issue Template

**`.github/ISSUE_TEMPLATE/monthly-security-review.md`**
- Standardized format for security reviews
- Includes CodeQL, npm audit, Dependabot, branch cleanup
- Auto-assigned to `drew` with `security` and `automated` labels

### Branch Cleanup Criteria

**Auto-delete (when enabled):**
- Merged into main or preview
- Last commit >7 days ago
- Not protected (main/preview/production)

**Manual review required:**
- Unmerged branches >90 days inactive
- Branches with open PRs
- Feature/fix branches not yet merged

### Manual Triggering

Trigger workflow manually:

```
Actions → Monthly Security Review → Run workflow
```

Options:
- `auto_delete_branches`: Set to `true` to actually delete branches (default: dry run)

### Monitoring

**GitHub Actions:**
- Workflow runs: [Actions tab](https://github.com/dcyfr/cyberdrew-dev/actions/workflows/monthly-security-review.yml)
- SBOM artifacts: Uploaded for 90 days
- Branch cleanup reports: Uploaded for 30 days

**GitHub Issues:**
- Filter by label: [`security`](https://github.com/dcyfr/cyberdrew-dev/issues?q=is%3Aissue+label%3Asecurity)
- Auto-assigned to `drew`

**Email Alerts:**
- Sent for critical/high severity findings only

---

## Environment Variables

**Required:**
- `GITHUB_TOKEN` - Already configured, needs `repo` and `issues:write` scopes ✅
- `SENTRY_AUTH_TOKEN` - Already configured for source maps, reused for API queries ✅

**Optional:**
- `SENTRY_ORG` - Defaults to `cyberdrew-dev`
- `SENTRY_PROJECT` - Defaults to `cyberdrew-dev`

---

## Dependencies

**Added in Phase 1:**
- `@octokit/rest@^20.0.0` - GitHub API client

---

## Metrics Tracked

### Test Health
- **Pass rate** - Percentage of tests passing (target: ≥95%)
- **Coverage** - Average code coverage (lines, statements, functions, branches)
- **Flaky tests** - Tests with inconsistent pass/fail patterns
- **Slow tests** - Tests taking >1s to execute
- **Test failures** - Details, error messages, stack traces

### Sentry Enrichment
- **Related errors** - Production errors matching test failures
- **User impact** - Number of users affected by errors
- **Error frequency** - Occurrences in last 7 days
- **Stack traces** - Links to Sentry issues for investigation

---

## Troubleshooting

### Workflow fails with "test-results.json not found"

The workflow expects Vitest to generate `test-results.json` using the `--reporter=json` flag.

**Fix:** Ensure Vitest is configured with JSON reporter:
```bash
npm run test:coverage -- --reporter=json --outputFile=test-results.json
```

### Sentry enrichment shows "No related errors found"

This is normal if:
- No production errors match the test failure signature
- Errors occurred >7 days ago (query window)
- SENTRY_AUTH_TOKEN not set (enrichment skipped)

### Issue not created despite test failures

Check the logs:
1. View workflow run in Actions tab
2. Check "Analyze test health" step
3. Look for "Test health is good! No Issue needed."

The workflow only creates Issues if:
- Pass rate < 95%
- Coverage decreased > 2%
- Critical tests failing

### Too many Issues created

The deduplication logic should prevent this. If it's happening:
1. Check Redis cache is working
2. Verify signature generation is consistent
3. Review open Issues with `test-health` label

---

## Future Enhancements

**Phase 3: Content & Cleanup** (Planned)
- Blog frontmatter validation
- Dead code detection
- Workspace cleanup checklists

**Phase 4: Dashboard** (Planned)
- Maintenance dashboard at `/admin/maintenance`
- 52-week trend visualizations
- Observation logging system

---

## Resources

**GitHub Actions:**
- [Workflow file](.github/workflows/weekly-test-health.yml)
- [Actions tab](https://github.com/dcyfr/cyberdrew-dev/actions/workflows/weekly-test-health.yml)

**Phase 1 Scripts:**
- [`scripts/analyze-test-health.mjs`](../../scripts/analyze-test-health.mjs)
- [`scripts/sentry-enricher.mjs`](../../scripts/sentry-enricher.mjs)
- [`scripts/github-api.mjs`](../../scripts/github-api.mjs)

**Phase 2 Scripts:**
- [`scripts/security-audit.mjs`](../../scripts/security-audit.mjs)
- [`scripts/branch-cleanup.mjs`](../../scripts/branch-cleanup.mjs)

**Issue Templates:**
- [`.github/ISSUE_TEMPLATE/test-health-report.md`](.github/ISSUE_TEMPLATE/test-health-report.md)
- [`.github/ISSUE_TEMPLATE/monthly-security-review.md`](.github/ISSUE_TEMPLATE/monthly-security-review.md)

**Comprehensive Plan:**
- [Phase 1-4 Implementation Plan](../../.claude/plans/)

---

## Contact

Questions or issues? Open a GitHub Issue with the `maintenance-automation` label.
