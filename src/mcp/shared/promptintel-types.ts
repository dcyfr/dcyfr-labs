/**
 * PromptIntel API Types
 * Type definitions for PromptIntel threat intelligence platform
 * Shared across MCP server and API client
 */

/**
 * Indicator of Prompt Compromise (IoPC)
 * Represents an adversarial prompt pattern or attack technique
 */
export interface PromptIntelIoPC {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  prompt_pattern: string;
  detection_pattern?: string;
  mitigation?: string;
  cwe_ids?: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Threat Taxonomy
 * Hierarchical classification of attack techniques and defense strategies
 */
export interface PromptIntelTaxonomy {
  id: string;
  name: string;
  description: string;
  category_type: 'attack' | 'defense' | 'technique';
  parent_id?: string;
  created_at: string;
}

/**
 * Agent Report
 * User-submitted security finding or vulnerability report
 */
export interface PromptIntelAgentReport {
  id: string;
  agent_name: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  findings: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
  user_id?: string;
}

/**
 * Search Parameters for PostgREST queries
 * Supports filtering, ordering, and pagination
 */
export interface PromptIntelSearchParams {
  select?: string;
  severity?: string;
  category?: string;
  limit?: number;
  offset?: number;
  order?: string;
}

/**
 * API Client Configuration
 */
export interface PromptIntelClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

/**
 * Health Check Response
 */
export interface PromptIntelHealthResponse {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
}

/**
 * API Error Response
 */
export interface PromptIntelErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}
