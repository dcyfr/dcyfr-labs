---
name: Monthly Security Review
about: Automated monthly security audit
labels: security, automated, monthly-review
assignees: drew
---

## Security Review - {MONTH} {YEAR}

### CodeQL Findings

{CODEQL_SUMMARY}

### Dependency Vulnerabilities

{NPM_AUDIT_SUMMARY}

### Dependabot PRs

- **Open PRs:** {DEPENDABOT_OPEN}
- **Auto-mergeable:** {AUTO_MERGE_COUNT}
- **Requires Review:** {MANUAL_REVIEW_COUNT}

{DEPENDABOT_TABLE}

### Branch Cleanup

{BRANCH_CLEANUP_SUMMARY}

### Security Headers

- **Rating:** {SECURITY_HEADERS_GRADE}
- **Last Checked:** {HEADER_CHECK_DATE}

{SECURITY_HEADERS_DETAILS}

### License Compliance

{LICENSE_SUMMARY}

### Action Items

{ACTION_ITEMS}

---

*Automated by `monthly-security-review` workflow • [View workflow runs](https://github.com/{REPO}/actions/workflows/monthly-security-review.yml)*
