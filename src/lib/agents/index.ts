/**
 * @/lib/agents barrel export
 *
 * Central export point for agent telemetry and provider fallback management.
 *
 * MIGRATION NOTE: Now using @dcyfr/ai framework with compatibility adapter
 * for backward compatibility. Gradually migrate to direct @dcyfr/ai usage.
 */

// NEW: Export compatibility adapter (wraps @dcyfr/ai)
export {
  telemetry,
  trackAgentSession,
  getCompatibilityTelemetry as TelemetrySessionManager,
  getCompatibilityTelemetry as AgentTelemetryManager,
  getCompatibilityProvider as ProviderFallbackManager,
  getCompatibilityProvider,
  getCompatibilityTelemetry,
} from './compat';

// Re-export types from old system (for backward compatibility)
export type {
  AgentType,
  TaskType,
  TaskOutcome,
  ValidationStatus,
  TelemetrySession,
  TelemetryMetrics,
  ViolationRecord,
  HandoffRecord,
  CostEstimate,
  AgentStats,
  ComparisonStats,
} from "./agent-telemetry";

export type {
  ProviderType,
  ProviderConfig,
  FallbackManagerConfig,
  TaskContext,
  ExecutionResult,
  ProviderHealth,
} from "./provider-fallback-manager";

// Legacy exports (kept for backward compatibility)
// These now use the compatibility adapter under the hood
export {
  getGlobalFallbackManager,
  initializeGlobalFallbackManager,
  destroyGlobalFallbackManager,
  RateLimitError,
  ProviderUnavailableError,
} from "./provider-fallback-manager";
