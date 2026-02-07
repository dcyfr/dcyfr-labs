'use client';

/**
 * Global error boundary for catching errors in root layout
 * This component is only rendered during runtime errors, never statically generated
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
          <h1>Application Error</h1>
          <p>A critical error has occurred.</p>
          <button onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  );
}
