/**
 * @file Request validation middleware
 *
 * Utility functions that parse and validate request bodies / query parameters
 * using Zod schemas, returning either validated data or a ready-made error response.
 *
 * @module lib/validation/middleware
 *
 * @example
 * import { validateRequestBody } from '@/lib/validation/middleware';
 * import { contactFormSchema } from '@/lib/validation/schemas';
 *
 * export async function POST(request: NextRequest) {
 *   const result = await validateRequestBody(request, contactFormSchema);
 *   if ('error' in result) return result.error;
 *
 *   const { name, email, message } = result.data;
 *   // ...
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { type ZodType, ZodError } from 'zod';

/**
 * Parse and validate a JSON request body against a Zod schema.
 *
 * Returns `{ data }` on success, `{ error }` (a ready NextResponse) on failure.
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: ZodType<T>
): Promise<{ data: T } | { error: NextResponse }> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      error: NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      ),
    };
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    return {
      error: NextResponse.json(
        {
          error: 'Validation failed',
          details: formatZodErrors(result.error),
        },
        { status: 400 }
      ),
    };
  }

  return { data: result.data };
}

/**
 * Parse and validate query parameters against a Zod schema.
 *
 * Returns `{ data }` on success, `{ error }` (a ready NextResponse) on failure.
 */
export function validateQueryParams<T>(
  request: NextRequest,
  schema: ZodType<T>
): { data: T } | { error: NextResponse } {
  const { searchParams } = request.nextUrl;
  const params = Object.fromEntries(searchParams.entries());

  const result = schema.safeParse(params);

  if (!result.success) {
    return {
      error: NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: formatZodErrors(result.error),
        },
        { status: 400 }
      ),
    };
  }

  return { data: result.data };
}

/**
 * Format Zod errors into a user-friendly array.
 */
function formatZodErrors(error: ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((err) => ({
    field: err.path.join('.') || 'body',
    message: err.message,
  }));
}
