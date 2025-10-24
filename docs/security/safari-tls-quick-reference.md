# Safari TLS Fix - Quick Reference

## Problem
Safari on macOS shows TLS errors when loading the development site.

## Solution
Use HTTPS development server with locally-trusted certificates.

## Quick Start

```bash
# Run HTTPS development server
npm run dev:https
```

Then open **https://localhost:3000** in Safari.

## First Time Setup (Already Done)

The certificates are already generated and installed. If you need to set up on a new machine:

```bash
# Install mkcert
brew install mkcert

# Install local CA
mkcert -install

# Generate certificates (from project root)
mkdir -p certs && cd certs
mkcert localhost 127.0.0.1 ::1
```

## Troubleshooting

### Safari still shows certificate warnings

1. Check mkcert CA is installed:
   ```bash
   mkcert -install
   ```

2. Verify in Keychain Access:
   - Open **Keychain Access** app
   - Go to **System** keychain
   - Look for "mkcert" certificate
   - Ensure it's trusted

3. Clear Safari cache:
   - Safari → Settings → Privacy → Manage Website Data → Remove All
   - Restart Safari

### Port 3000 already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Then restart
npm run dev:https
```

### Certificates missing/expired

```bash
cd certs
mkcert localhost 127.0.0.1 ::1
```

Current certificates expire: **January 23, 2028**

## Scripts

- `npm run dev` - HTTP development server (default)
- `npm run dev:https` - HTTPS development server (for Safari)

## Files

- `/server.mjs` - Custom Next.js server with HTTPS
- `/certs/localhost+2.pem` - SSL certificate (gitignored)
- `/certs/localhost+2-key.pem` - Private key (gitignored)
- `/certs/README.md` - Detailed setup guide

## More Info

See `/docs/security/safari-tls-fix.md` for complete documentation.
