# Automation & CI Backlog

This file tracks recommended small, low-risk automation items to improve developer experience and CI coverage.

Prioritized list (start at the top):

- [ ] GitHub Actions CI — Add a lightweight CI workflow that runs `npm ci`, `npm run check` (lint + typecheck), and `npm run build`. Cache node modules and `.next/cache` to speed runs. (See `.github/workflows/ci.yml` added to the repo as a starting point.)
- [ ] Snyk scan in CI — Run `snyk test` as an optional step when `SNYK_TOKEN` is provided (store token in GitHub Secrets). This provides authenticated vulnerability checks and reporting. The CI workflow includes an optional Snyk step that runs when the secret is present.
- [ ] Husky + lint-staged — Install and configure to run `prettier --write` and `eslint --fix` on staged files to keep PRs clean. Add a `prepare` script to `package.json` to enable hooks.
- [ ] Dependabot / Renovate — Configure automated dependency update PRs (weekly) for npm packages.
- [ ] Cache build artifacts — Preserve `.next/cache` between CI runs keyed by lockfile + Node version.
- [ ] Lighthouse / Performance checks — Add an optional Lighthouse CI job to track performance regressions on the main branch. Consider running only on merges to main or daily.

Notes:
- The provided `.github/workflows/ci.yml` is intentionally minimal; it runs `npm run check` and `npm run build`, and includes an optional Snyk step that runs only when `SNYK_TOKEN` is present in the repository secrets. We keep `continue-on-error: true` on the Snyk step to avoid blocking builds; change this if you prefer failures to be blocking.
- Next steps: pick one item (Husky, Dependabot) and I can implement it end-to-end.
