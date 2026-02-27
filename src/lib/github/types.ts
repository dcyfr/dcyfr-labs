/**
 * TypeScript interfaces for GitHub REST API responses.
 * Only the fields we actually use are declared; extras are silently ignored.
 */

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export interface GitHubRepo {
  /** Repository name (no owner prefix) */
  name: string;
  /** Owner + repo path, e.g. "dcyfr/dcyfr-ai" */
  full_name: string;
  /** Human-readable description (may be null) */
  description: string | null;
  /** Whether the repository is private */
  private: boolean;
  /** Whether the repository is archived */
  archived: boolean;
  /** Whether the repository is a fork */
  fork: boolean;
  /** Primary URL of the repository */
  html_url: string;
  /** Homepage URL (may be null or empty) */
  homepage: string | null;
  /** Primary language detected by GitHub (may be null) */
  language: string | null;
  /** Topics / tags applied to the repo */
  topics: string[];
  /** Star count */
  stargazers_count: number;
  /** Fork count */
  forks_count: number;
  /** Open issue + PR count */
  open_issues_count: number;
  /** ISO date of the last push */
  pushed_at: string;
  /** ISO date the repo was created */
  created_at: string;
  /** ISO date of the last metadata update */
  updated_at: string;
  /** Default branch name */
  default_branch: string;
  /** Visibility: "public" | "private" | "internal" */
  visibility?: string;
  /** Contents URL template (used to derive README URL) */
  contents_url: string;
}

// ---------------------------------------------------------------------------
// README content endpoint
// ---------------------------------------------------------------------------

export interface GitHubReadmeResponse {
  /** File name (usually "README.md") */
  name: string;
  /** File path relative to repo root */
  path: string;
  /** Base64-encoded file content */
  content: string;
  /** Encoding type — always "base64" */
  encoding: string;
  /** Raw bytes size */
  size: number;
  /** GitHub SHA for cache ETags */
  sha: string;
  /** Download URL for the raw file */
  download_url: string | null;
}

// ---------------------------------------------------------------------------
// Rate limit response
// ---------------------------------------------------------------------------

export interface GitHubRateLimit {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  used: number;
}

export interface GitHubRateLimitResponse {
  resources: {
    core: GitHubRateLimit;
    search: GitHubRateLimit;
  };
  rate: GitHubRateLimit;
}

// ---------------------------------------------------------------------------
// Internal cache entry
// ---------------------------------------------------------------------------

export interface RepoCacheEntry {
  /** ISO timestamp when this entry was written */
  fetchedAt: string;
  /** The cached repo list */
  repos: GitHubRepo[];
}

export interface ReadmeCacheEntry {
  /** ISO timestamp when this entry was written */
  fetchedAt: string;
  /** Raw README markdown (empty string if repo has no README) */
  content: string;
}
