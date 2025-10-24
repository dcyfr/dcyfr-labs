# Local SSL Certificates

This directory contains SSL certificates for local HTTPS development, generated using [mkcert](https://github.com/FiloSottile/mkcert).

## Why?

Safari on macOS (especially recent versions) has strict TLS requirements that can cause issues with plain HTTP development servers. Using HTTPS locally resolves these issues and provides a more production-like environment.

## Setup

Certificates are already generated and trusted. If you need to regenerate them:

```bash
# Install mkcert (macOS)
brew install mkcert

# Install the local CA in the system trust store
mkcert -install

# Generate certificates (from project root)
mkdir -p certs
cd certs
mkcert localhost 127.0.0.1 ::1
```

## Usage

Use the HTTPS development server:

```bash
npm run dev:https
```

The server will automatically use the certificates if they exist in this directory.

## Files

- `localhost+2.pem` - SSL certificate
- `localhost+2-key.pem` - Private key

⚠️ **Note**: These files are ignored by git (see `.gitignore`) and should never be committed.

## Troubleshooting

If Safari still shows certificate warnings:

1. Make sure mkcert's CA is installed: `mkcert -install`
2. Check that Safari trusts the certificate in **Keychain Access** → **System** → Look for "mkcert"
3. Try clearing Safari's cache and restarting the browser

## Certificate Expiration

Certificates expire on **23 January 2028**. Regenerate them before expiration using the setup commands above.
