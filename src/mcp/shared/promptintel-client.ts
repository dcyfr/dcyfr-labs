/**
 * PromptIntel API Client
 * Handles authentication, rate limiting, and error handling for PostgREST API
 * Supports filtering, ordering, and pagination via PostgREST query parameters
 */

import type {
  PromptIntelIoPC,
  PromptIntelTaxonomy,
  PromptIntelAgentReport,
  PromptIntelSearchParams,
  PromptIntelClientConfig,
  PromptIntelHealthResponse,
  PromptIntelErrorResponse,
} from './promptintel-types.js';

export class PromptIntelClient {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;

  constructor(config: PromptIntelClientConfig) {
    if (!config.apiKey) {
      throw new Error('PromptIntel API key is required');
    }

    this.baseUrl = config.baseUrl || 'https://api.promptintel.novahunting.ai/api/v1';
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 10000;
  }

  /**
   * Build request headers with authentication
   */
  private buildHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Build URL with PostgREST query parameters
   * Supports filtering, ordering, pagination, and column selection
   */
  private buildUrl(endpoint: string, params?: PromptIntelSearchParams): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      // Column selection
      if (params.select) {
        url.searchParams.set('select', params.select);
      }

      // Filtering by severity
      if (params.severity) {
        url.searchParams.set('severity', `eq.${params.severity}`);
      }

      // Filtering by category
      if (params.category) {
        url.searchParams.set('category', `eq.${params.category}`);
      }

      // Pagination
      if (params.limit) {
        url.searchParams.set('limit', String(params.limit));
      }
      if (params.offset) {
        url.searchParams.set('offset', String(params.offset));
      }

      // Ordering
      if (params.order) {
        url.searchParams.set('order', params.order);
      }
    }

    return url.toString();
  }

  /**
   * Fetch with timeout support
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Handle error responses
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    const contentType = response.headers.get('content-type');
    let errorData: Partial<PromptIntelErrorResponse> = {
      error: `HTTP ${response.status}`,
    };

    try {
      if (contentType?.includes('application/json')) {
        errorData = await response.json();
      } else {
        const text = await response.text();
        errorData.message = text;
      }
    } catch {
      // If parsing fails, just use status text
      errorData.message = response.statusText;
    }

    throw new Error(
      `PromptIntel API error: ${errorData.error} - ${errorData.message || 'Unknown error'}`
    );
  }

  /**
   * Fetch IoPC (Indicators of Prompt Compromise)
   * Returns adversarial prompt patterns and attack indicators
   */
  async getPrompts(params?: PromptIntelSearchParams): Promise<PromptIntelIoPC[]> {
    const url = this.buildUrl('/prompts', params);

    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers: this.buildHeaders(),
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  }

  /**
   * Fetch threat taxonomy
   * Returns hierarchical classification of attack techniques
   */
  async getTaxonomy(params?: PromptIntelSearchParams): Promise<PromptIntelTaxonomy[]> {
    const url = this.buildUrl('/taxonomy', params);

    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers: this.buildHeaders(),
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  }

  /**
   * Fetch agent reports (all or user's own)
   */
  async getAgentReports(
    mine = false,
    params?: PromptIntelSearchParams
  ): Promise<PromptIntelAgentReport[]> {
    const endpoint = mine ? '/agents/reports/mine' : '/agents/reports';
    const url = this.buildUrl(endpoint, params);

    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers: this.buildHeaders(),
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  }

  /**
   * Submit a new security finding or vulnerability report
   */
  async submitReport(
    report: Omit<PromptIntelAgentReport, 'id' | 'created_at'>
  ): Promise<PromptIntelAgentReport> {
    const url = this.buildUrl('/agents/reports');

    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        ...this.buildHeaders(),
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(report),
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  }

  /**
   * Check API health and connectivity
   * Does not require authentication
   */
  async healthCheck(): Promise<PromptIntelHealthResponse> {
    const url = `${this.baseUrl}/health`;

    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    return response.json();
  }
}
