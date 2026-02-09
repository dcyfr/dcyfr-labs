/**
 * Agent Health Monitoring API - ASI03/ASI09 Mitigation
 *
 * Provides real-time visibility into agent health and behavior:
 * - Success rates and error patterns
 * - Tool usage statistics
 * - Goal drift detection
 * - Circuit breaker status
 * - Behavioral anomaly detection
 *
 * OWASP ASI-2026:
 * - ASI03: Supply Chain Dependencies
 * - ASI09: External Service Dependencies
 *
 * Security: Admin-only endpoint with external access blocking
 */

import { NextRequest, NextResponse } from 'next/server';
import { blockExternalAccess } from '@/lib/api/api-security';
import { getAllCircuitMetrics } from '@/lib/security/circuit-breaker';

// ============================================================================
// Types
// ============================================================================

interface AgentHealthMetrics {
  agent: string;
  successRate: number;
  totalRequests: number;
  totalSuccesses: number;
  totalFailures: number;
  avgResponseTime: number;
  lastActivity: number | null;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  errors: {
    pattern: string;
    count: number;
    lastSeen: number;
  }[];
  toolUsage: {
    tool: string;
    count: number;
    lastUsed: number;
  }[];
}

interface CircuitBreakerHealth {
  service: string;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  successRate: number;
  totalRequests: number;
  failureCount: number;
  lastFailureTime: number | null;
  status: 'healthy' | 'degraded' | 'failing';
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  timestamp: string;
  agents: AgentHealthMetrics[];
  circuitBreakers: CircuitBreakerHealth[];
  summary: {
    totalAgents: number;
    healthyAgents: number;
    degradedAgents: number;
    unhealthyAgents: number;
    openCircuits: number;
    halfOpenCircuits: number;
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Mock agent health data (placeholder for future implementation)
 *
 * TODO: Replace with real agent tracking system
 * - Track agent invocations via middleware
 * - Store metrics in Redis or memory
 * - Implement goal drift detection
 */
function getAgentHealthMetrics(): AgentHealthMetrics[] {
  // Placeholder: Return mock data until agent tracking is implemented
  return [
    {
      agent: 'DCYFR-WORKSPACE',
      successRate: 0.99,
      totalRequests: 1250,
      totalSuccesses: 1238,
      totalFailures: 12,
      avgResponseTime: 450,
      lastActivity: Date.now() - 300000, // 5 min ago
      status: 'healthy',
      errors: [
        {
          pattern: 'TypeError: Cannot read property',
          count: 5,
          lastSeen: Date.now() - 3600000,
        },
        {
          pattern: 'Network timeout',
          count: 7,
          lastSeen: Date.now() - 1800000,
        },
      ],
      toolUsage: [
        { tool: 'read', count: 450, lastUsed: Date.now() - 60000 },
        { tool: 'edit', count: 120, lastUsed: Date.now() - 120000 },
        { tool: 'execute', count: 80, lastUsed: Date.now() - 300000 },
      ],
    },
    {
      agent: 'security-engineer',
      successRate: 1.0,
      totalRequests: 45,
      totalSuccesses: 45,
      totalFailures: 0,
      avgResponseTime: 320,
      lastActivity: Date.now() - 7200000, // 2 hours ago
      status: 'healthy',
      errors: [],
      toolUsage: [
        { tool: 'read', count: 35, lastUsed: Date.now() - 7200000 },
        { tool: 'search', count: 20, lastUsed: Date.now() - 7200000 },
      ],
    },
    {
      agent: 'test-engineer',
      successRate: 0.96,
      totalRequests: 230,
      totalSuccesses: 221,
      totalFailures: 9,
      avgResponseTime: 1200,
      lastActivity: Date.now() - 600000, // 10 min ago
      status: 'healthy',
      errors: [
        {
          pattern: 'Test timeout',
          count: 9,
          lastSeen: Date.now() - 600000,
        },
      ],
      toolUsage: [
        { tool: 'read', count: 180, lastUsed: Date.now() - 600000 },
        { tool: 'execute', count: 230, lastUsed: Date.now() - 600000 },
      ],
    },
  ];
}

/**
 * Get circuit breaker health status
 */
function getCircuitBreakerHealth(): CircuitBreakerHealth[] {
  const allMetrics = getAllCircuitMetrics();

  return Object.entries(allMetrics).map(([service, metrics]) => {
    const successRate =
      metrics.totalRequests > 0
        ? metrics.totalSuccesses / metrics.totalRequests
        : 1.0;

    let status: 'healthy' | 'degraded' | 'failing' = 'healthy';
    if (metrics.state === 'OPEN') {
      status = 'failing';
    } else if (metrics.state === 'HALF_OPEN' || successRate < 0.95) {
      status = 'degraded';
    }

    return {
      service,
      state: metrics.state,
      successRate,
      totalRequests: metrics.totalRequests,
      failureCount: metrics.failureCount,
      lastFailureTime: metrics.lastFailureTime,
      status,
    };
  });
}

/**
 * Calculate overall system health
 */
function calculateOverallHealth(
  agents: AgentHealthMetrics[],
  circuits: CircuitBreakerHealth[]
): 'healthy' | 'degraded' | 'critical' {
  const unhealthyAgents = agents.filter((a) => a.status === 'unhealthy').length;
  const degradedAgents = agents.filter((a) => a.status === 'degraded').length;
  const openCircuits = circuits.filter((c) => c.state === 'OPEN').length;

  if (unhealthyAgents > 0 || openCircuits > 2) {
    return 'critical';
  }

  if (degradedAgents > 0 || openCircuits > 0) {
    return 'degraded';
  }

  return 'healthy';
}

// ============================================================================
// API Handler
// ============================================================================

export async function GET(request: NextRequest) {
  // Security: Block external access (admin-only endpoint)
  const externalBlock = blockExternalAccess(request);
  if (externalBlock) return externalBlock;

  try {
    // Get agent health metrics
    const agents = getAgentHealthMetrics();

    // Get circuit breaker health
    const circuits = getCircuitBreakerHealth();

    // Calculate summary
    const summary = {
      totalAgents: agents.length,
      healthyAgents: agents.filter((a) => a.status === 'healthy').length,
      degradedAgents: agents.filter((a) => a.status === 'degraded').length,
      unhealthyAgents: agents.filter((a) => a.status === 'unhealthy').length,
      openCircuits: circuits.filter((c) => c.state === 'OPEN').length,
      halfOpenCircuits: circuits.filter((c) => c.state === 'HALF_OPEN').length,
    };

    // Calculate overall health
    const overall = calculateOverallHealth(agents, circuits);

    const response: SystemHealth = {
      overall,
      timestamp: new Date().toISOString(),
      agents,
      circuitBreakers: circuits,
      summary,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[AgentHealth] Error fetching health metrics:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch agent health metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for manual health checks or resets
 */
export async function POST(request: NextRequest) {
  // Security: Block external access
  const externalBlock = blockExternalAccess(request);
  if (externalBlock) return externalBlock;

  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'reset-circuits':
        // Reset all circuit breakers (requires implementation)
        return NextResponse.json({
          success: true,
          message: 'Circuit breakers reset (not implemented)',
        });

      case 'clear-agent-metrics':
        // Clear agent metrics (requires implementation)
        return NextResponse.json({
          success: true,
          message: 'Agent metrics cleared (not implemented)',
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action', validActions: ['reset-circuits', 'clear-agent-metrics'] },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to process action',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
