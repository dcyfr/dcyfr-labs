---
name: Weekly Test Health Report
about: Automated test health analysis
labels: test-health, automated
assignees: drew
---

## Test Health Summary - Week of {DATE}

### Key Metrics

- **Pass Rate:** {PASS_RATE}% (target: ≥95%)
- **Coverage:** {COVERAGE}% (Δ {DELTA}%)
- **Flaky Tests:** {FLAKY_COUNT}
- **Slow Tests:** {SLOW_COUNT} (>1s)

### Test Failures

{FAILURE_TABLE}

### Related Sentry Errors

{SENTRY_ENRICHMENT}

### Action Items

- [ ] Fix critical test failures
- [ ] Investigate flaky tests
- [ ] Review coverage regressions

---

*Automated by `weekly-test-health` workflow • [View workflow runs](https://github.com/{REPO}/actions/workflows/weekly-test-health.yml)*
