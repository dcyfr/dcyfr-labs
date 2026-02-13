#!/usr/bin/env node
import { createServer as createHttpsServer } from "https";
import next from "next";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { isPortInUse, getPortPIDs } from "./scripts/port-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// Check if SSL certificates exist
const certPath = join(__dirname, "certs", "localhost+2.pem");
const keyPath = join(__dirname, "certs", "localhost+2-key.pem");
const useHttps = existsSync(certPath) && existsSync(keyPath);

const protocol = useHttps ? "https" : "http";

(async () => {
  // --- Port conflict check ---
  const portOccupied = await isPortInUse(port);
  if (portOccupied) {
    const pids = await getPortPIDs(port);
    const hint = pids.length > 0 ? ` (PID: ${pids.join(", ")})` : "";
    console.error(`\n❌ Port ${port} is already in use${hint}.`);
    console.error(`   Free it:  kill ${pids.length > 0 ? pids.join(" ") : "<PID>"}`);
    console.error(`   Or run:   npm run dev:fresh  (auto-kills port then starts)`);
    process.exit(1);
  }

  const app = next({ dev, hostname, port, turbopack: dev });
  const handle = app.getRequestHandler();

  await app.prepare();

  const requestHandler = async (req, res) => {
    try {
      // Use WHATWG URL API instead of deprecated url.parse()
      const parsedUrl = new URL(req.url, `${protocol}://${req.headers.host}`);
      await handle(req, res, parsedUrl);
    } catch (err) {
      // Sanitize URL to prevent log injection (remove newlines)
      const sanitizedUrl = req.url?.replace(/[\r\n]/g, "") || "unknown";
      console.error("Error occurred handling", sanitizedUrl, err);
      res.statusCode = 500;
      res.end("internal server error");
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
    console.log(`> Ready on ${protocol}://${hostname}:${port}`);
  });
})().catch((err) => {
  console.error("Server startup error:", err.message);
  process.exit(1);
});
