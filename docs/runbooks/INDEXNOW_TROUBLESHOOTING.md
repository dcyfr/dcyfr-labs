<!-- TLP:CLEAR -->

# IndexNow Troubleshooting Runbook

**Last Updated:** 2026-02-18  
**Scope:** `dcyfr-labs` IndexNow integration (`/api/indexnow/submit`, `/api/admin/indexnow/bulk`, `/dev/seo`)

## Purpose

Use this runbook to diagnose and resolve IndexNow submission issues in development, preview, and production.

## Quick Health Checks

1. Confirm key file is reachable:

```bash
curl -i https://www.dcyfr.ai/<INDEXNOW_API_KEY>.txt
```

Expected:

- `200 OK`
- Body equals the exact key value

2. Confirm submit endpoint metadata:

```bash
curl -s https://www.dcyfr.ai/api/indexnow/submit
```

Expected:

- `status.keyConfigured: true`
- `status.appUrlConfigured: true`

3. Submit a single URL:

```bash
curl -s -X POST https://www.dcyfr.ai/api/indexnow/submit \
  -H "Content-Type: application/json" \
  -d '{"urls":["https://www.dcyfr.ai/blog/example-post"]}'
```

Expected:

- HTTP `200`
- `success: true`
- `queueStatus: queued` or `deferred` (depending on Inngest env setup)

## Common Failures and Fixes

### 1) `503 IndexNow API key not configured`

**Cause**

- `INDEXNOW_API_KEY` missing in environment.

**Fix**

- Set `INDEXNOW_API_KEY` (UUID v4) in deployment environment.
- Redeploy if needed.
- Recheck key file route.

### 2) `400 URLs must be from the same domain`

**Cause**

- Payload contains URLs outside configured site domain.

**Fix**

- Submit only URLs under `NEXT_PUBLIC_SITE_URL` domain.
- Normalize canonical URLs before submission.

### 3) `429 Rate limit exceeded`

**Cause**

- Submit endpoint exceeded per-client limit (currently 30 requests per 60 seconds).

**Fix**

- Respect `Retry-After` header and back off.
- Batch URLs into one request instead of many single-URL calls.

### 4) `queueStatus: deferred`

**Cause**

- Inngest branch environment is not configured for event delivery.

**Fix**

- Configure Inngest environment (`INNGEST_ENV`, signing/event keys).
- Validate event flow in Inngest dashboard.

### 5) Admin bulk endpoint returns `401`

**Cause**

- Missing or invalid `Authorization: Bearer <ADMIN_API_KEY>`.

**Fix**

- Ensure `ADMIN_API_KEY` is configured.
- Pass exact bearer token (timing-safe comparison is enforced).

## Manual Bulk Reindexing

To queue posts + projects + static URLs:

```bash
curl -s -X POST https://www.dcyfr.ai/api/admin/indexnow/bulk \
  -H "Authorization: Bearer $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"types":["posts","projects","static"]}'
```

To queue only posts:

```bash
curl -s -X POST https://www.dcyfr.ai/api/admin/indexnow/bulk \
  -H "Authorization: Bearer $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"types":["posts"]}'
```

## Developer Dashboard

In development mode, open:

- `/dev/seo`

Use it to:

- Verify IndexNow key/app URL configuration
- Test key-file link
- Submit manual URL batches
- Inspect immediate API response payload

## Escalation Checklist

If failures persist after fixes:

1. Capture request/response body and status code.
2. Capture response headers (`X-RateLimit-*`, `Retry-After` if present).
3. Capture Inngest function logs for the same request window.
4. Confirm environment vars in deployment target.
5. Open an issue with logs and reproduction steps.

