# docs/\_private/

<!-- audience: humans + agents who already know what _private is for -->

Dated, status, and report artifacts that are kept for history but not
surfaced to bots via the automation manifest. Files here do not count
against per-topic doc budgets.

## What goes here

Any file matching:

- `*-summary.md`
- `*-complete.md`
- `*-status.md`
- `*-report.md`
- `*-validation.md`
- `*-YYYY-MM-DD.md`
- phase completion consolidations, production warning remediation logs,
  validation snapshots, triage dumps, and anything else with a wall-clock
  stamp

## What does not go here

- Public guides, how-tos, and runbooks — these live in their canonical
  topic directory (`docs/operations/`, `docs/architecture/`, etc.)
- Security findings that need to be private for compliance reasons —
  those live under `docs/security/private/` (a subdir-specific private
  area), not here
- Generated content (move to `docs/_generated/` if/when that exists)

## Subdirectory layout

Mirror the canonical topic tree so that an artifact's origin is obvious:

- `docs/_private/reports/` — phase completion, validation, session logs
- `docs/_private/operations/` — dated operational consolidations
- `docs/_private/<topic>/` — any topic can have a private subdir

## Why the underscore prefix

The underscore makes these directories sort first in filesystem listings,
makes them easy to glob-exclude (`docs/!(_*)/**`), and signals to readers
that they are out of band. Do not rename to `docs/private/`.
