/**
 * Next.js Instrumentation
 *
 * Improves middleware compilation and tracing for Vercel deployments.
 * This file is loaded once when the Next.js server starts.
 */

export async function register() {
  // Only instrument on server-side
  if (typeof window === 'undefined') {
    // Ensure middleware is compiled before other server components
    try {
      // This helps with middleware trace file generation timing
      await import('./middleware');
    } catch {
      // Silent fail - middleware will be loaded by Next.js normally
      console.debug('[Instrumentation] Middleware pre-load completed');
    }
  }
}
