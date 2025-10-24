#!/usr/bin/env node
import { createServer as createHttpsServer } from 'https';
import { parse } from 'url';
import next from 'next';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Check if SSL certificates exist
const certPath = join(__dirname, 'certs', 'localhost+2.pem');
const keyPath = join(__dirname, 'certs', 'localhost+2-key.pem');
const useHttps = existsSync(certPath) && existsSync(keyPath);

const app = next({ dev, hostname, port, turbopack: dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const requestHandler = async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  };

  let server;
  
  try {
    if (useHttps) {
      const httpsOptions = {
        key: readFileSync(keyPath),
        cert: readFileSync(certPath),
      };
      server = createHttpsServer(httpsOptions, requestHandler);
      console.log(`🔒 Using HTTPS with local certificates`);
    } else {
      console.warn(`⚠️  HTTPS certificates not found at ${certPath}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`Failed to load HTTPS certificates: ${err.message}`);
    process.exit(1);
  }

  server.listen(port, (err) => {
    if (err) throw err;
    const protocol = useHttps ? 'https' : 'http';
    console.log(`> Ready on ${protocol}://${hostname}:${port}`);
  });
});
