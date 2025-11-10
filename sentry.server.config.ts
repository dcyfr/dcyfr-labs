// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://7c23751564e8b5a59d004f525b892077@o4510339435134976.ingest.us.sentry.io/4510339435331584",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1, // 10% sampling in production

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Disable sending user PII (Personally Identifiable Information) for privacy
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false, // Changed to false for privacy compliance

  // Set environment
  environment: process.env.NODE_ENV || "development",

  // Enable session replay for better debugging (only for errors in production)
  replaysSessionSampleRate: 0, // Don't capture all sessions
  replaysOnErrorSampleRate: process.env.NODE_ENV === "production" ? 1.0 : 0, // Capture 100% of errors in production
});
