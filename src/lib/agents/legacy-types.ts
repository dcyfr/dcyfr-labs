/**
 * Legacy Agent Type Definitions
 *
 * @deprecated These types are preserved for backward compatibility only.
 * The implementation files (agent-telemetry.ts, provider-fallback-manager.ts)
 * have been deleted. Use @dcyfr/ai types directly for new code.
 *
 * Migrated from:
 *   - src/lib/agents/agent-telemetry.ts
 *   - src/lib/agents/provider-fallback-manager.ts
 */

// ============================================================================
// agent-telemetry types
// ============================================================================

export type AgentType = 'claude' | 'copilot' | 'groq' | 'ollama';
export type TaskType = 'feature' | 'bug' | 'refactor' | 'quick-fix' | 'research';
export type TaskOutcome = 'success' | 'escalated' | 'failed';
export type ValidationStatus = 'pass' | 'fail' | 'pending' | 'skipped';

export interface TelemetrySession {
  sessionId: string;
  agent: AgentType;
  taskType: TaskType;
  taskDescription: string;
  startTime: Date;
  endTime?: Date;
  outcome?: TaskOutcome;
  metrics: TelemetryMetrics;
  violations: ViolationRecord[];
  handoffs: HandoffRecord[];
  cost: CostEstimate;
}

export interface TelemetryMetrics {
  tokenCompliance: number;
  testPassRate: number;
  lintViolations: number;
  typeErrors: number;
  executionTime: number;
  tokensUsed: number;
  filesModified: number;
  linesChanged: number;
  validations: {
    typescript: ValidationStatus;
    eslint: ValidationStatus;
    tests: ValidationStatus;
    designTokens: ValidationStatus;
    security: ValidationStatus;
  };
}

export interface ViolationRecord {
  timestamp: Date;
  type: 'design-token' | 'eslint' | 'typescript' | 'test' | 'security';
  severity: 'error' | 'warning';
  message: string;
  file?: string;
  line?: number;
  fixed: boolean;
}

export interface HandoffRecord {
  timestamp: Date;
  fromAgent: AgentType;
  toAgent: AgentType;
  reason: 'rate-limit' | 'quality' | 'manual' | 'cost-optimization' | 'offline';
  automatic: boolean;
}

export interface CostEstimate {
  provider: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  currency: 'USD';
}

export interface AgentStats {
  agent: AgentType;
  period: string;
  totalSessions: number;
  totalTime: number;
  averageSessionTime: number;
  outcomes: {
    success: number;
    escalated: number;
    failed: number;
  };
  quality: {
    averageTokenCompliance: number;
    averageTestPassRate: number;
    totalViolations: number;
    violationsFixed: number;
  };
  performance: {
    averageExecutionTime: number;
    totalTokensUsed: number;
    averageFilesModified: number;
  };
  cost: {
    totalCost: number;
    averageCostPerSession: number;
    costByTaskType: Record<TaskType, number>;
  };
  taskTypes: Record<TaskType, number>;
}

export interface ComparisonStats {
  period: string;
  agents: Record<AgentType, AgentStats>;
  recommendations: string[];
}

// ============================================================================
// provider-fallback-manager types
// ============================================================================

export type ProviderType = 'claude' | 'groq' | 'ollama' | 'copilot';

export interface ProviderConfig {
  name: ProviderType;
  apiEndpoint?: string;
  healthCheckUrl?: string;
  maxRetries: number;
  retryDelay: number;
  timeout: number;
}

export interface FallbackManagerConfig {
  primaryProvider: ProviderType;
  fallbackChain: ProviderType[];
  autoReturn: boolean;
  healthCheckInterval: number;
  sessionStatePath?: string;
  validationLevel: 'standard' | 'enhanced' | 'strict';
}

export interface TaskContext {
  description: string;
  phase: 'planning' | 'implementation' | 'validation' | 'complete';
  estimatedTime?: string;
  filesInProgress: string[];
  validationStatus?: {
    typescript?: 'pass' | 'fail' | 'pending';
    eslint?: 'pass' | 'fail' | 'pending';
    tests?: 'pass' | 'fail' | 'pending';
    designTokens?: 'pass' | 'fail' | 'pending';
  };
}

export interface ExecutionResult<T = unknown> {
  success: boolean;
  data?: T;
  provider: ProviderType;
  fallbackUsed: boolean;
  error?: Error;
  executionTime: number;
  validationsPassed: string[];
  validationsFailed: string[];
}

export interface ProviderHealth {
  provider: ProviderType;
  available: boolean;
  responseTime?: number;
  lastChecked: Date;
  rateLimitRemaining?: number;
  rateLimitReset?: Date;
  error?: string;
}
