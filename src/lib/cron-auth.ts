/**
 * Cron route authentication helper
 *
 * Validates the Authorization: Bearer <CRON_SECRET> header that Vercel
 * automatically sends to cron job endpoints. In development, requests
 * are allowed when CRON_SECRET is unset.
 *
 * @see https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
 */
export function validateCronRequest(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;

  // Development: allow without secret
  if (!cronSecret) {
    return process.env.NODE_ENV !== 'production';
  }

  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${cronSecret}`;
}
