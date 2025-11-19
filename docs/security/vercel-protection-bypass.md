# Vercel Protection Bypass for Automation

This document describes how Vercel deployment protection bypass is configured for automated testing and CI/CD workflows.

## Overview

Vercel deployment protection (password protection, Vercel Authentication, or Trusted IPs) can block automated testing tools. The Protection Bypass for Automation feature allows authorized automation tools to access protected deployments without manual authentication.

**Documentation**: <https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation>

## Configuration

### Environment Variable

The bypass secret is stored in `.env.local` for local development and as a GitHub secret for CI/CD:

```bash
VERCEL_AUTOMATION_BYPASS_SECRET="your-secret-here"
```

**To generate a new secret:**

1. Go to Vercel Project Settings → Deployment Protection
2. Navigate to "Protection Bypass for Automation"
3. Generate a new secret or use an existing one
4. Copy the secret to your environment variables

### Playwright Configuration

E2E tests automatically include the bypass headers when the environment variable is set:

**File**: `playwright.config.ts`

```typescript
use: {
  // ... other settings
  extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    ? {
        'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
        'x-vercel-set-bypass-cookie': 'samesitenone',
      }
    : {},
}
```

### Lighthouse CI Configuration

Lighthouse CI includes bypass headers in the request configuration:

**File**: `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "settings": {
        "extraHeaders": "{\"x-vercel-protection-bypass\": \"${VERCEL_AUTOMATION_BYPASS_SECRET}\", \"x-vercel-set-bypass-cookie\": \"samesitenone\"}"
      }
    }
  }
}
```

### Accessibility Testing Script

The custom Lighthouse accessibility script dynamically adds bypass headers:

**File**: `scripts/test-accessibility.mjs`

```javascript
if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
  args.push(`--extra-headers={"x-vercel-protection-bypass":"${process.env.VERCEL_AUTOMATION_BYPASS_SECRET}","x-vercel-set-bypass-cookie":"samesitenone"}`);
}
```

## CI/CD Integration

### GitHub Actions

Both E2E and Lighthouse CI workflows reference the secret from GitHub Secrets:

**E2E Tests** (`.github/workflows/test.yml`):

```yaml
- name: Run E2E tests
  run: npm run test:e2e
  env:
    CI: true
    VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
```

**Lighthouse CI** (`.github/workflows/lighthouse-ci.yml`):

```yaml
- name: Run Lighthouse CI
  run: npm run lhci:autorun
  env:
    VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
```

**Setup Instructions:**

1. Go to GitHub Repository Settings → Secrets and variables → Actions
2. Add a new secret named `VERCEL_AUTOMATION_BYPASS_SECRET`
3. Paste the secret value from Vercel
4. Save the secret

## How It Works

The protection bypass uses one of three methods:

### 1. HTTP Header (Recommended)

```http
x-vercel-protection-bypass: your-secret
```

### 2. Query Parameter

```url
https://your-deployment.vercel.app/page?x-vercel-protection-bypass=your-secret
```

### 3. Cookie (Set via header)

```http
x-vercel-set-bypass-cookie: samesitenone
```

Setting `x-vercel-set-bypass-cookie` instructs Vercel to set a `__vercel_deployment_bypass` cookie that persists for subsequent requests. The value `samesitenone` sets `SameSite=None`, which is required for cross-origin contexts like iframes.

## Security Considerations

### Secret Management

- **Never commit secrets** to version control
- Store secrets in `.env.local` (git-ignored) for local development
- Use GitHub Secrets for CI/CD workflows
- Rotate secrets periodically via Vercel dashboard

### Access Control

- The bypass secret grants access to **all protected deployments** in the project
- Limit secret access to authorized team members only
- Revoke and regenerate secrets if compromised

### Best Practices

1. Use HTTP headers instead of query parameters (prevents exposure in logs)
2. Set bypass cookies for in-browser testing to avoid repeated header configuration
3. Use `samesitenone` for cross-origin testing contexts
4. Monitor secret usage in Vercel logs

## Testing Locally

To test protection bypass locally against a protected deployment:

```bash
# Set the environment variable
export VERCEL_AUTOMATION_BYPASS_SECRET="your-secret"

# Run Playwright tests
npm run test:e2e

# Run Lighthouse CI
npm run lhci:autorun

# Run accessibility tests
node scripts/test-accessibility.mjs
```

## Troubleshooting

### Tests Fail with 401/403

- Verify `VERCEL_AUTOMATION_BYPASS_SECRET` is set in environment
- Check that the secret matches the one in Vercel dashboard
- Ensure GitHub Secret is correctly configured for CI/CD

### Headers Not Applied

- Confirm the environment variable is available during test execution
- Check that configuration files properly reference `process.env.VERCEL_AUTOMATION_BYPASS_SECRET`
- Verify JSON escaping in Lighthouse CI configuration

### Cookie Issues

- Use `samesitenone` for cross-origin contexts
- Ensure `x-vercel-set-bypass-cookie` header is sent
- Check browser cookie settings in Playwright

## Related Documentation

- [Vercel Protection Bypass Documentation](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation)
- [Vercel Deployment Protection](https://vercel.com/docs/deployment-protection)
- [Playwright Configuration](https://playwright.dev/docs/test-configuration)
- [Lighthouse CI Configuration](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md)

## Skew Protection

For information about Vercel Skew Protection (different from deployment protection bypass), see:

- [Vercel Skew Protection Documentation](https://vercel.com/docs/skew-protection)
- Next.js 14.1.4+ has built-in skew protection (no configuration needed)
