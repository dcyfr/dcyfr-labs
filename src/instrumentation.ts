import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Initialize Sentry
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }

  // Initialize development debugging tools
  // Only runs in development, zero overhead in production
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_RUNTIME === 'nodejs') {
    const { initializeDevTools } = await import('./lib/dev-init');
    initializeDevTools();
  }
}

export const onRequestError = Sentry.captureRequestError;
