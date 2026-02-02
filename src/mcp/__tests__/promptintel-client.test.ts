/**
 * PromptIntel API Client Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PromptIntelClient } from '../shared/promptintel-client';

describe('PromptIntelClient', () => {
  let client: PromptIntelClient;
  let fetchSpy: any;

  beforeEach(() => {
    client = new PromptIntelClient({
      apiKey: 'ak_test_key_123',
      baseUrl: 'https://api.test.com/api/v1',
      timeout: 5000,
    });

    fetchSpy = vi.fn();
    global.fetch = fetchSpy;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw if API key is missing', () => {
      expect(() => {
        new PromptIntelClient({
          apiKey: '',
        });
      }).toThrow('PromptIntel API key is required');
    });

    it('should use default base URL if not provided', () => {
      const clientDefault = new PromptIntelClient({
        apiKey: 'ak_test_key',
      });
      expect(clientDefault).toBeDefined();
    });

    it('should use custom base URL if provided', () => {
      const custom = new PromptIntelClient({
        apiKey: 'ak_test_key',
        baseUrl: 'https://custom.api.com/v2',
      });
      expect(custom).toBeDefined();
    });
  });

  describe('getPrompts', () => {
    it('should fetch prompts successfully', async () => {
      const mockPrompts = [
        {
          id: '1',
          title: 'Test Prompt',
          description: 'Test description',
          severity: 'high' as const,
          category: 'injection',
          prompt_pattern: 'test pattern',
          created_at: '2026-02-02T00:00:00Z',
          updated_at: '2026-02-02T00:00:00Z',
        },
      ];

      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => mockPrompts,
      });

      const prompts = await client.getPrompts();

      expect(prompts).toHaveLength(1);
      expect(prompts[0].title).toBe('Test Prompt');
      expect(prompts[0].severity).toBe('high');
    });

    it('should include authentication header', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await client.getPrompts();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer ak_test_key_123',
          }),
        })
      );
    });

    it('should handle severity filter', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await client.getPrompts({ severity: 'critical' });

      const url = fetchSpy.mock.calls[0][0];
      expect(url).toContain('severity=eq.critical');
    });

    it('should handle category filter', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await client.getPrompts({ category: 'injection' });

      const url = fetchSpy.mock.calls[0][0];
      expect(url).toContain('category=eq.injection');
    });

    it('should handle pagination parameters', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await client.getPrompts({ limit: 10, offset: 20 });

      const url = fetchSpy.mock.calls[0][0];
      expect(url).toContain('limit=10');
      expect(url).toContain('offset=20');
    });

    it('should handle ordering', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await client.getPrompts({ order: 'created_at.asc' });

      const url = fetchSpy.mock.calls[0][0];
      expect(url).toContain('order=created_at.asc');
    });

    it('should handle API errors', async () => {
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          error: 'Invalid API key',
          message: 'The provided API key is invalid or expired',
        }),
      });

      await expect(client.getPrompts()).rejects.toThrow(
        'PromptIntel API error: Invalid API key - The provided API key is invalid or expired'
      );
    });
  });

  describe('getTaxonomy', () => {
    it('should fetch taxonomy successfully', async () => {
      const mockTaxonomy = [
        {
          id: '1',
          name: 'Prompt Injection',
          description: 'Direct prompt injection attacks',
          category_type: 'attack' as const,
          created_at: '2026-02-02T00:00:00Z',
        },
      ];

      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => mockTaxonomy,
      });

      const taxonomy = await client.getTaxonomy();

      expect(taxonomy).toHaveLength(1);
      expect(taxonomy[0].name).toBe('Prompt Injection');
    });

    it('should limit results', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await client.getTaxonomy({ limit: 25 });

      const url = fetchSpy.mock.calls[0][0];
      expect(url).toContain('limit=25');
    });
  });

  describe('getAgentReports', () => {
    it('should fetch all agent reports', async () => {
      const mockReports = [
        {
          id: '1',
          agent_name: 'TestAgent',
          title: 'Test Finding',
          description: 'Test description',
          severity: 'high' as const,
          findings: { type: 'injection' },
          metadata: {},
          created_at: '2026-02-02T00:00:00Z',
        },
      ];

      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => mockReports,
      });

      const reports = await client.getAgentReports();

      expect(reports).toHaveLength(1);
      expect(reports[0].agent_name).toBe('TestAgent');
    });

    it('should fetch user own reports with mine=true', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await client.getAgentReports(true);

      const url = fetchSpy.mock.calls[0][0];
      expect(url).toContain('/agents/reports/mine');
    });

    it('should fetch all reports with mine=false', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await client.getAgentReports(false);

      const url = fetchSpy.mock.calls[0][0];
      expect(url).toContain('/agents/reports');
      expect(url).not.toContain('/agents/reports/mine');
    });
  });

  describe('submitReport', () => {
    it('should submit a report successfully', async () => {
      const mockResponse = {
        id: 'report_123',
        agent_name: 'TestAgent',
        title: 'Security Finding',
        description: 'Test description',
        severity: 'high',
        findings: { type: 'injection' },
        metadata: {},
        created_at: '2026-02-02T00:00:00Z',
      };

      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => [mockResponse],
      });

      const report = await client.submitReport({
        agent_name: 'TestAgent',
        title: 'Security Finding',
        description: 'Test description',
        severity: 'high',
        findings: { type: 'injection' },
        metadata: {},
      });

      expect(report.id).toBe('report_123');
      expect(report.agent_name).toBe('TestAgent');
    });

    it('should use POST method', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => [{}],
      });

      await client.submitReport({
        agent_name: 'TestAgent',
        title: 'Test',
        description: 'Test',
        severity: 'low',
        findings: {},
        metadata: {},
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should include Prefer header for representation', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => [{}],
      });

      await client.submitReport({
        agent_name: 'TestAgent',
        title: 'Test',
        description: 'Test',
        severity: 'low',
        findings: {},
        metadata: {},
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Prefer: 'return=representation',
          }),
        })
      );
    });

    it('should serialize findings to JSON', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => [{}],
      });

      const findings = { type: 'injection', vector: 'user_input' };
      await client.submitReport({
        agent_name: 'TestAgent',
        title: 'Test',
        description: 'Test',
        severity: 'low',
        findings,
        metadata: {},
      });

      const body = fetchSpy.mock.calls[0][1].body;
      expect(body).toContain(JSON.stringify(findings));
    });
  });

  describe('healthCheck', () => {
    it('should check API health', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'healthy',
          timestamp: '2026-02-02T00:00:00Z',
        }),
      });

      const health = await client.healthCheck();

      expect(health.status).toBe('healthy');
    });

    it('should not require authentication', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'healthy', timestamp: '2026-02-02T00:00:00Z' }),
      });

      await client.healthCheck();

      const headers = fetchSpy.mock.calls[0][1].headers;
      expect(headers).toBeUndefined();
    });

    it('should throw on API down', async () => {
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Map([['content-type', 'text/plain']]),
        text: async () => 'Service down',
      });

      await expect(client.healthCheck()).rejects.toThrow(
        'PromptIntel API error: HTTP 503'
      );
    });
  });

  describe('error handling', () => {
    it('should handle non-JSON error responses', async () => {
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Map([['content-type', 'text/plain']]),
        text: async () => 'Database connection failed',
      });

      await expect(client.getPrompts()).rejects.toThrow(
        'PromptIntel API error: HTTP 500'
      );
    });

    it('should handle network timeouts', async () => {
      const timeoutError = new Error('AbortError');
      timeoutError.name = 'AbortError';
      fetchSpy.mockRejectedValue(timeoutError);

      await expect(client.getPrompts()).rejects.toThrow('AbortError');
    });
  });
});
