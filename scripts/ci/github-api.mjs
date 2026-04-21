#!/usr/bin/env node

/**
 * Minimal GitHub Issue helper for CI scripts.
 *
 * Provides get-or-create behavior keyed by a signature marker included in
 * the issue body. Gracefully degrades (returns null) when auth is missing.
 */

const API_BASE = 'https://api.github.com';

function getRepo() {
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo || !repo.includes('/')) return null;
  const [owner, name] = repo.split('/');
  return { owner, repo: name };
}

function getHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'dcyfr-ci-github-api',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function request(path, options = {}) {
  const headers = getHeaders();
  const repo = getRepo();
  if (!headers || !repo) return null;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${response.status}: ${text}`);
  }

  return response.status === 204 ? null : response.json();
}

async function findExistingBySignature({ owner, repo, signature, label }) {
  if (!signature) return null;

  const encodedLabel = encodeURIComponent(label);
  const issues =
    (await request(
      `/repos/${owner}/${repo}/issues?state=open&labels=${encodedLabel}&per_page=50&sort=updated&direction=desc`
    )) || [];

  return (
    issues.find((issue) => typeof issue.body === 'string' && issue.body.includes(signature)) || null
  );
}

export async function getOrCreateIssue({
  label,
  signature,
  title,
  body,
  labels = [],
  assignees = [],
  updateIfExists = true,
}) {
  const repoInfo = getRepo();
  const headers = getHeaders();
  if (!repoInfo || !headers) {
    console.warn(
      '⚠️ GitHub API unavailable (missing GITHUB_REPOSITORY or GITHUB_TOKEN); skipping issue upsert.'
    );
    return null;
  }

  const { owner, repo } = repoInfo;

  try {
    const existing = await findExistingBySignature({ owner, repo, signature, label });

    if (existing && updateIfExists) {
      const updated = await request(`/repos/${owner}/${repo}/issues/${existing.number}`, {
        method: 'PATCH',
        body: JSON.stringify({ title, body, labels, assignees }),
      });
      return updated;
    }

    if (existing) return existing;

    const created = await request(`/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      body: JSON.stringify({ title, body, labels, assignees }),
    });

    return created;
  } catch (error) {
    console.warn(`⚠️ Failed to upsert issue: ${error.message}`);
    return null;
  }
}
