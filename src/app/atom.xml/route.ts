import { redirect } from "next/navigation";

/**
 * Legacy Atom feed endpoint redirect
 * 
 * Redirects /atom.xml to /feed with HTTP 301 (Permanent Redirect).
 * This maintains backwards compatibility for users with old feed URLs.
 */
export function GET() {
  redirect("/feed");
}
