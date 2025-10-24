#!/usr/bin/env node
import { createServer as createHttpsServer } from 'https';
import { createServer as createHttpServer } from 'http';
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
  
  if (useHttps) {
    const httpsOptions = {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
    };
    server = createHttpsServer(httpsOptions, requestHandler);
    console.log(`🔒 Using HTTPS with local certificates`);
  } else {
    server = createHttpServer(requestHandler);
    console.log(`⚠️  Running in HTTP mode (certificates not found at ${certPath})`);
    console.log(`   Run: mkcert -install && mkdir -p certs && cd certs && mkcert localhost 127.0.0.1 ::1`);
  }

  server.listen(port, (err) => {
    if (err) throw err;
    const protocol = useHttps ? 'https' : 'http';
    console.log(`> Ready on ${protocol}://${hostname}:${port}`);
  });
});
