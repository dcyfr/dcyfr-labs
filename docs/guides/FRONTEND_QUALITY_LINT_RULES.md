<!-- TLP:CLEAR -->

# Frontend Quality Lint Rules

This guide documents the frontend quality lint rules introduced for animation and inline-style compliance.

## Rules

- `dcyfr-local/no-hardcoded-animations` (initial: `warn`)
- `dcyfr-local/no-hardcoded-inline-styles` (initial: `warn`)

## Promote-to-Error Criteria

Promote a rule from `warn` to `error` when all of the following are true for at least 2 consecutive weekly checks:

1. New violations trend downward or stable at low volume.
2. False positives are below 5% in sampled results.
3. The team has documented known exceptions (allowlist or inline disable with rationale).
4. CI lint noise is manageable and does not block unrelated work.

## Token-Compliant Examples

### Animation

Use token constants (or wrappers that map to them), not hardcoded transition classes:

- Prefer: class values sourced from `ANIMATION_CONSTANTS`
- Avoid: `transition-all`, `duration-300`, `ease-in-out`, `animate-pulse`

Example:

```tsx
import { ANIMATION_CONSTANTS } from '@/lib/design-tokens';

<div className={ANIMATION_CONSTANTS.fadeIn} />;
```

### Inline Styles

Use design tokens or CSS variables:

- Prefer: `style={{ color: 'var(--semantic-text-primary)' }}`
- Prefer: token-derived values passed via variables/props
- Avoid: `style={{ color: '#ff0000' }}`
- Avoid: `style={{ marginTop: '16px', fontSize: '24px' }}`

Example:

```tsx
<div
  style={{
    color: 'var(--semantic-text-primary)',
    marginTop: 'var(--spacing-md)',
    fontSize: 'var(--font-size-body)',
  }}
/>
```

## Frontend Audit Cron Integration

The `frontend-audit` automation job now tracks:

- Lint-based frontend quality (`lintScore`)
- Design token validation (`designTokenCompliance`)
- Composite health score (`healthScore`)

If alerts spike, use `data/frontend-health-history.jsonl` breakdown fields to prioritize high-impact rule categories first.

## Allowlist Guidance

Allowlists should be narrow and explicit:

- Property-level exceptions only when unavoidable.
- Value-pattern exceptions for framework/system constraints.
- Revisit exceptions regularly and remove stale entries.
