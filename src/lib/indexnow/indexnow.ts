export const INDEXNOW_MAX_URLS_PER_REQUEST = 10_000;
export const INDEXNOW_BATCH_SIZE = 100;

export interface IndexNowApiPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export function isUuidV4(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

export function normalizeValidUrls(urls: string[]): {
  validUrls: string[];
  invalidUrls: string[];
} {
  const validUrls: string[] = [];
  const invalidUrls: string[] = [];

  for (const url of urls) {
    try {
      const normalized = new URL(url);
      normalized.hash = '';
      validUrls.push(normalized.toString());
    } catch {
      invalidUrls.push(url);
    }
  }

  return { validUrls, invalidUrls };
}

export function buildKeyLocation(
  siteUrl: string | undefined,
  key: string,
  keyLocation?: string
): string {
  if (keyLocation) return keyLocation;

  const baseUrl = siteUrl || 'http://localhost:3000';
  return `${baseUrl.replace(/\/$/, '')}/${key}.txt`;
}

export function validateSameDomain(
  urls: string[],
  siteUrl?: string
): {
  isValid: boolean;
  invalidUrl?: string;
  allowedDomain?: string;
} {
  if (!siteUrl) {
    return { isValid: true };
  }

  const allowedDomain = new URL(siteUrl).hostname;

  for (const rawUrl of urls) {
    const urlDomain = new URL(rawUrl).hostname;
    if (urlDomain !== allowedDomain) {
      return {
        isValid: false,
        invalidUrl: rawUrl,
        allowedDomain,
      };
    }
  }

  return { isValid: true, allowedDomain };
}

export function buildIndexNowPayloads(
  validUrls: string[],
  key: string,
  keyLocation: string,
  batchSize = INDEXNOW_BATCH_SIZE,
  maxUrlsPerRequest = INDEXNOW_MAX_URLS_PER_REQUEST
): IndexNowApiPayload[] {
  if (validUrls.length === 0) {
    return [];
  }

  const host = new URL(validUrls[0]).hostname;
  const payloads: IndexNowApiPayload[] = [];

  if (validUrls.length <= maxUrlsPerRequest) {
    payloads.push({
      host,
      key,
      keyLocation,
      urlList: validUrls,
    });
    return payloads;
  }

  for (let i = 0; i < validUrls.length; i += batchSize) {
    payloads.push({
      host,
      key,
      keyLocation,
      urlList: validUrls.slice(i, i + batchSize),
    });
  }

  return payloads;
}

export function isInngestBranchEnvironmentIssue(message: string): boolean {
  return (
    message.includes('Branch environment name is required') ||
    message.includes('Branch environment does not exist')
  );
}
