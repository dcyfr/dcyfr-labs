# Safari TLS Error Fix - October 23, 2025

## Problem

Safari on macOS Tahoe was failing to load resources with TLS errors when accessing the Next.js development server:

```
[Error] Failed to load resource: A TLS error caused the secure connection to fail.
```

This affected all static assets (CSS, JS) causing the site to fail to load completely.

## Root Cause

Safari on macOS (especially recent versions like Tahoe) has stricter TLS/SSL requirements than other browsers. When running `next dev` in plain HTTP mode, Safari may encounter issues or attempt to upgrade connections, leading to TLS failures.

## Solution

Implemented local HTTPS development using `mkcert` to generate locally-trusted SSL certificates.

### Implementation

1. **Installed mkcert** via Homebrew
2. **Created local CA** and installed it in the system trust store
3. **Generated certificates** for localhost in `/certs` directory
4. **Created custom server** (`server.mjs`) that:
   - Uses HTTPS when certificates are available
   - Falls back to HTTP if certificates are missing
   - Supports Turbopack in development mode
   - Provides clear console feedback about the mode
5. **Added npm script** `dev:https` to run the HTTPS server
6. **Updated documentation** in README and added `certs/README.md`

### Files Modified/Created

- ✅ `/server.mjs` - Custom Next.js server with HTTPS support
- ✅ `/package.json` - Added `dev:https` and `predev:https` scripts
- ✅ `/certs/README.md` - SSL certificate documentation
- ✅ `/certs/.gitkeep` - Ensures directory structure is tracked
- ✅ `/README.md` - Updated with HTTPS development instructions
- ✅ `/docs/security/safari-tls-fix.md` - This documentation

### Certificate Files (gitignored)

- `/certs/localhost+2.pem` - SSL certificate
- `/certs/localhost+2-key.pem` - Private key

These are automatically ignored by git due to the `*.pem` rule in `.gitignore`.

## Usage

### Start HTTPS Development Server

```bash
npm run dev:https
```

Access the site at: **https://localhost:3000**

### Regenerate Certificates (if needed)

```bash
# Install mkcert (if not already installed)
brew install mkcert

# Install local CA
mkcert -install

# Generate new certificates
mkdir -p certs
cd certs
mkcert localhost 127.0.0.1 ::1
```

## Certificate Details

- **Generated**: October 23, 2025
- **Expires**: January 23, 2028
- **Valid for**: localhost, 127.0.0.1, ::1

## Testing

1. Stop any running dev server
2. Run `npm run dev:https`
3. Open Safari and navigate to https://localhost:3000
4. Verify the site loads without TLS errors
5. Check that Safari shows a secure connection (padlock icon)

## Fallback Behavior

The custom server (`server.mjs`) gracefully falls back to HTTP if certificates are not found, with a helpful console message explaining how to set up HTTPS.

## Security Notes

- ✅ Certificates are locally-trusted via mkcert's CA
- ✅ Certificate files are gitignored and never committed
- ✅ Only affects local development (production uses proper SSL)
- ✅ mkcert CA is installed in system trust store only

## Related Documentation

- `/certs/README.md` - SSL certificate setup guide
- `README.md` - Updated development instructions
- [mkcert documentation](https://github.com/FiloSottile/mkcert)

## Status

✅ **RESOLVED** - Safari now loads the development site successfully over HTTPS without TLS errors.
