/**
 * Fetch organisation repositories from the GitHub REST API.
 *
 * Falls back to the file-based cache when:
 *  - The API is rate-limited (remaining === 0)
 *  - The network request fails
 *
 * Authentication is optional but recommended (60 → 5000 req/hour with token).
 */

import { GITHUB_API_CONFIG, GITHUB_ORG, ENV_VARS } from "@/config/repos-config";
import { writeReposCache, readReposCache } from "./cache";
import type { GitHubRepo, GitHubRateLimitResponse } from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "dcyfr-labs-repo-showcase/1.0",
  };
  const token = process.env[ENV_VARS.token];
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function fetchWithTimeout(url: string, headers: Record<string, string>): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GITHUB_API_CONFIG.timeoutMs);
  try {
    return await fetch(url, { headers, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Rate-limit check
// ---------------------------------------------------------------------------

async function isRateLimited(headers: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${GITHUB_API_CONFIG.baseUrl}/rate_limit`, headers);
    if (!res.ok) return false;
    const data = (await res.json()) as GitHubRateLimitResponse;
    return data.resources.core.remaining === 0;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return all public repositories for the configured GitHub organisation.
 *
 * Strategy:
 *  1. Return fresh cache if available.
 *  2. Check rate limit; if exhausted return stale cache (or empty array).
 *  3. Fetch from GitHub API and populate cache.
 *  4. On any error, fall back to stale cache (or empty array).
 */
export async function fetchOrgRepos(): Promise<GitHubRepo[]> {
  const headers = buildHeaders();

  // 1. Fresh cache hit
  const cached = readReposCache();
  if (cached) return cached.repos;

  // 2. Rate-limit guard
  const limited = await isRateLimited(headers);
  if (limited) {
    // Return stale cache if we have it (ignore TTL on rate limit)
    const force = readReposCache();
    if (force) return force.repos;
    return [];
  }

  // 3. Fetch from API (handle pagination — up to perPage repos per page)
  const allRepos: GitHubRepo[] = [];
  let page = 1;

  while (true) {
    const url =
      `${GITHUB_API_CONFIG.baseUrl}/orgs/${GITHUB_ORG}/repos` +
      `?per_page=${GITHUB_API_CONFIG.perPage}&page=${page}&type=public&sort=updated`;

    let res: Response;
    try {
      res = await fetchWithTimeout(url, headers);
    } catch (err) {
      // Network error — fall back to stale cache
      const stale = readReposCache();
      return stale ? stale.repos : [];
    }

    if (!res.ok) {
      if (res.status === 403) {
        // Rate limited despite our earlier check — use stale cache
        const stale = readReposCache();
        return stale ? stale.repos : [];
      }
      throw new Error(
        `GitHub API error fetching repos for ${GITHUB_ORG}: ${res.status} ${res.statusText}`,
      );
    }

    const page_repos = (await res.json()) as GitHubRepo[];
    allRepos.push(...page_repos);

    // Last page reached when fewer than perPage items are returned
    if (page_repos.length < GITHUB_API_CONFIG.perPage) break;
    page++;
  }

  // 4. Write cache
  writeReposCache({ fetchedAt: new Date().toISOString(), repos: allRepos });

  return allRepos;
}
