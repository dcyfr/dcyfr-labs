#!/usr/bin/env node
/**
 * PromptIntel MCP Server
 *
 * Provides AI assistants with direct access to PromptIntel threat intelligence database.
 * Enables real-time security scanning, threat detection, and vulnerability reporting.
 *
 * Tools:
 * - promptintel:searchThreats - Search IoPC database for adversarial prompt patterns
 * - promptintel:getTaxonomy - Fetch threat attack technique taxonomy
 * - promptintel:submitReport - Submit security finding or vulnerability
 *
 * Resources:
 * - promptintel://threats/critical - Critical severity threats
 * - promptintel://taxonomy - Full threat taxonomy
 * - promptintel://health - API health status
 */

import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import { PromptIntelClient } from './shared/promptintel-client.js';
import {
  handleToolError,
  logToolExecution,
  measurePerformance,
} from './shared/utils.js';
import { SimpleCache } from './shared/cache.js';

// ============================================================================
// Server Configuration
// ============================================================================

const server = new FastMCP({
  name: 'dcyfr-promptintel',
  version: '1.0.0',
  instructions:
    'Provides access to PromptIntel threat intelligence platform. Use these tools to search IoPC (Indicators of Prompt Compromise), analyze attack patterns, and submit security findings. All data is from collaborative threat intelligence community.',
});

// ============================================================================
// Client Initialization
// ============================================================================

const apiKey = process.env.PROMPTINTEL_API_KEY;
if (!apiKey) {
  throw new Error(
    'PROMPTINTEL_API_KEY environment variable is required. Get your key from https://promptintel.novahunting.ai/account/api-keys'
  );
}

const client = new PromptIntelClient({
  apiKey,
  baseUrl: process.env.PROMPTINTEL_BASE_URL,
});

// Initialize cache (5 minutes TTL for threat data)
const promptIntelCache = new SimpleCache(300000);

// ============================================================================
// Tool 1: Search Threats
// ============================================================================

server.addTool({
  name: 'promptintel:searchThreats',
  description:
    'Search PromptIntel IoPC (Indicators of Prompt Compromise) database for threats, attack patterns, and vulnerabilities. Returns adversarial prompt patterns with detection methods and mitigations.',
  parameters: z.object({
    severity: z
      .enum(['critical', 'high', 'medium', 'low', 'info'])
      .optional()
      .describe('Filter by severity level'),
    category: z.string().optional().describe('Filter by category (e.g., injection, jailbreak, exfiltration)'),
    limit: z
      .number()
      .optional()
      .default(20)
      .describe('Maximum results to return (default: 20, max: 100)'),
    order: z
      .enum(['severity', 'created_at', 'updated_at'])
      .optional()
      .default('severity')
      .describe('Sort order'),
  }),
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
  execute: async (
    args: {
      severity?: 'critical' | 'high' | 'medium' | 'low' | 'info';
      category?: string;
      limit?: number;
      order?: string;
    },
    { log }: { log: any }
  ) => {
    return handleToolError(
      async () => {
        const { result, durationMs } = await measurePerformance(async () => {
          const cacheKey = `threats:${args.severity || 'all'}:${args.category || 'all'}:${args.limit || 20}`;
          const cached = promptIntelCache.get(cacheKey);

          if (cached) {
            log.info('Returning cached threat data');
            return cached;
          }

          const threats = await client.getPrompts({
            severity: args.severity,
            category: args.category,
            limit: Math.min(args.limit || 20, 100),
            order: `${args.order || 'severity'}.desc`,
          });

          promptIntelCache.set(cacheKey, threats);
          return threats;
        });

        logToolExecution('promptintel:searchThreats', durationMs, log);

        return {
          threats: result,
          count: result.length,
          cached: false,
          summary: `Found ${result.length} threats. Top severity: ${
            result.length > 0
              ? result.reduce((max, t) => {
                  const severity_order = {
                    critical: 4,
                    high: 3,
                    medium: 2,
                    low: 1,
                    info: 0,
                  };
                  return severity_order[t.severity] > severity_order[max.severity]
                    ? t
                    : max;
                }).severity
              : 'N/A'
          }`,
        };
      },
      'promptintel:searchThreats',
      log
    );
  },
});

// ============================================================================
// Tool 2: Get Taxonomy
// ============================================================================

server.addTool({
  name: 'promptintel:getTaxonomy',
  description:
    'Fetch PromptIntel threat taxonomy to understand attack categories, techniques, and defense strategies. Returns hierarchical classification of adversarial techniques.',
  parameters: z.object({
    limit: z
      .number()
      .optional()
      .default(50)
      .describe('Maximum results to return'),
  }),
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
  execute: async (
    args: { limit?: number },
    { log }: { log: any }
  ) => {
    return handleToolError(
      async () => {
        const { result, durationMs } = await measurePerformance(async () => {
          const cacheKey = `taxonomy:all`;
          const cached = promptIntelCache.get(cacheKey);

          if (cached) {
            log.info('Returning cached taxonomy');
            return cached;
          }

          const taxonomy = await client.getTaxonomy({
            limit: Math.min(args.limit || 50, 100),
          });

          promptIntelCache.set(cacheKey, taxonomy);
          return taxonomy;
        });

        logToolExecution('promptintel:getTaxonomy', durationMs, log);

        return {
          taxonomy: result,
          count: result.length,
          categories: [
            ...new Set(result.map((t) => t.category_type)),
          ],
        };
      },
      'promptintel:getTaxonomy',
      log
    );
  },
});

// ============================================================================
// Tool 3: Submit Report
// ============================================================================

server.addTool({
  name: 'promptintel:submitReport',
  description:
    'Submit a security finding or vulnerability report to PromptIntel community. Helps contribute to collaborative threat intelligence.',
  parameters: z.object({
    agentName: z
      .string()
      .describe('Name of the agent or system being reported'),
    title: z.string().describe('Brief title of the finding'),
    description: z.string().describe('Detailed description of the vulnerability'),
    severity: z
      .enum(['critical', 'high', 'medium', 'low'])
      .describe('Severity level'),
    findings: z
      .record(z.unknown())
      .describe('Structured findings data (JSON object)'),
    metadata: z
      .record(z.unknown())
      .optional()
      .describe('Additional metadata'),
  }),
  annotations: {
    readOnlyHint: false,
    openWorldHint: true,
  },
  execute: async (
    args: {
      agentName: string;
      title: string;
      description: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
      findings: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    },
    { log }: { log: any }
  ) => {
    return handleToolError(
      async () => {
        const { result, durationMs } = await measurePerformance(async () => {
          return await client.submitReport({
            agent_name: args.agentName,
            title: args.title,
            description: args.description,
            severity: args.severity,
            findings: args.findings,
            metadata: args.metadata || {},
          });
        });

        logToolExecution('promptintel:submitReport', durationMs, log);

        return {
          success: true,
          report: {
            id: result.id,
            title: result.title,
            created_at: result.created_at,
          },
          message: 'Report submitted successfully to PromptIntel community',
        };
      },
      'promptintel:submitReport',
      log
    );
  },
});

// ============================================================================
// Resources
// ============================================================================

/**
 * Resource: Critical Threats
 * Quick access to the most severe threats
 */
server.addResource({
  uri: 'promptintel://threats/critical',
  name: 'Critical Threats',
  description: 'Critical severity threats from PromptIntel',
  mimeType: 'application/json',
  fetch: async () => {
    const threats = await client.getPrompts({
      severity: 'critical',
      limit: 10,
      order: 'created_at.desc',
    });

    return {
      contents: [
        {
          uri: 'promptintel://threats/critical',
          mimeType: 'application/json',
          text: JSON.stringify(threats, null, 2),
        },
      ],
    };
  },
});

/**
 * Resource: Threat Taxonomy
 * Quick access to attack technique classification
 */
server.addResource({
  uri: 'promptintel://taxonomy',
  name: 'Threat Taxonomy',
  description: 'Attack techniques and defense strategies taxonomy',
  mimeType: 'application/json',
  fetch: async () => {
    const taxonomy = await client.getTaxonomy({ limit: 50 });

    return {
      contents: [
        {
          uri: 'promptintel://taxonomy',
          mimeType: 'application/json',
          text: JSON.stringify(taxonomy, null, 2),
        },
      ],
    };
  },
});

/**
 * Resource: API Health Status
 * Monitor PromptIntel API availability
 */
server.addResource({
  uri: 'promptintel://health',
  name: 'API Health',
  description: 'PromptIntel API health and status',
  mimeType: 'application/json',
  fetch: async () => {
    const health = await client.healthCheck();

    return {
      contents: [
        {
          uri: 'promptintel://health',
          mimeType: 'application/json',
          text: JSON.stringify(health, null, 2),
        },
      ],
    };
  },
});

// ============================================================================
// Server Startup
// ============================================================================

server.listen().then(() => {
  console.log('✅ PromptIntel MCP Server running');
  console.log('Tools: promptintel:searchThreats, promptintel:getTaxonomy, promptintel:submitReport');
  console.log('Resources: promptintel://threats/critical, promptintel://taxonomy, promptintel://health');
});
