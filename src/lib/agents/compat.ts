/**
 * Compatibility Adapter for @dcyfr/ai Framework
 *
 * Bridges the old dcyfr-labs agent system with the new @dcyfr/ai framework.
 * Provides backward compatibility while migrating to the new modular architecture.
 *
 * Migration Strategy:
 * 1. Import new packages (@dcyfr/ai, @dcyfr/agents)
 * 2. Adapt old interfaces to new framework
 * 3. Maintain existing API surface
 * 4. Gradually deprecate old code
 */

import {
  TelemetryEngine,
  TelemetrySessionManager,
  ProviderRegistry,
  loadConfig,
  type FrameworkConfig,
  type TelemetrySession as NewTelemetrySession,
  type TelemetryMetrics as NewTelemetryMetrics,
} from '@dcyfr/ai';

import type {
  AgentType,
  TaskType,
  TaskOutcome,
  ValidationStatus,
  TelemetrySession as OldTelemetrySession,
  TelemetryMetrics as OldTelemetryMetrics,
  ViolationRecord,
  HandoffRecord,
  CostEstimate,
} from './agent-telemetry';

import type {
  ProviderType,
  ProviderConfig as OldProviderConfig,
  TaskContext,
  ExecutionResult,
  ProviderHealth,
} from './provider-fallback-manager';

/**
 * Compatibility wrapper for TelemetryEngine
 * Adapts the new framework to the old agent-telemetry interface
 */
export class CompatibilityTelemetryAdapter {
  private engine: TelemetryEngine;
  private sessionManager: TelemetrySessionManager;
  private config: FrameworkConfig | null = null;

  constructor() {
    // Initialize with memory storage for now
    this.engine = new TelemetryEngine({
      storage: 'memory',
      enabled: true,
    });
    this.sessionManager = new TelemetrySessionManager(this.engine);
  }

  /**
   * Load configuration from new framework
   */
  async initialize(): Promise<void> {
    try {
      this.config = await loadConfig({
        projectRoot: process.cwd(),
        validate: true,
      });

      // Update engine with config settings
      if (this.config.telemetry) {
        this.engine = new TelemetryEngine({
          storage: this.config.telemetry.storage,
          enabled: this.config.telemetry.enabled,
          storagePath: this.config.telemetry.storagePath,
        });
        this.sessionManager = new TelemetrySessionManager(this.engine);
      }
    } catch (error) {
      console.warn('⚠️  Failed to load config, using defaults:', error);
      // Continue with memory storage
    }
  }

  /**
   * Start a telemetry session (old interface)
   */
  startSession(
    agent: AgentType,
    context: {
      taskType: TaskType;
      description: string;
      projectName?: string;
    }
  ): CompatibleTelemetrySession {
    const session = this.sessionManager.startSession(agent as any, {
      taskType: context.taskType as any,
      taskDescription: context.description,
      projectName: context.projectName || 'dcyfr-labs',
    });

    return new CompatibleTelemetrySession(session, this.engine);
  }

  /**
   * Get agent statistics (old interface)
   */
  async getAgentStats(agent: AgentType, period: string = '30d'): Promise<any> {
    const stats = await this.engine.getAgentStats(agent as any, period);
    return stats;
  }

  /**
   * Get all sessions
   */
  async getAllSessions(): Promise<OldTelemetrySession[]> {
    const sessions = await this.engine.getAllSessions();
    return sessions.map(this.adaptNewToOldSession);
  }

  /**
   * Adapt new session format to old format
   */
  private adaptNewToOldSession(newSession: NewTelemetrySession): OldTelemetrySession {
    return {
      sessionId: newSession.sessionId,
      agent: newSession.agent as AgentType,
      taskType: newSession.taskType as TaskType,
      taskDescription: newSession.taskDescription,
      startTime: newSession.startTime,
      endTime: newSession.endTime,
      outcome: newSession.outcome as TaskOutcome | undefined,
      metrics: this.adaptNewToOldMetrics(newSession.metrics),
      violations: [],
      handoffs: [],
      cost: {
        estimatedCost: 0,
        tokensUsed: newSession.metrics.tokensUsed,
        provider: newSession.agent,
      },
    };
  }

  /**
   * Adapt new metrics to old format
   */
  private adaptNewToOldMetrics(newMetrics: NewTelemetryMetrics): OldTelemetryMetrics {
    return {
      tokenCompliance: newMetrics.tokenCompliance,
      testPassRate: newMetrics.testPassRate,
      lintViolations: newMetrics.lintViolations,
      typeErrors: newMetrics.typeErrors,
      executionTime: newMetrics.executionTime,
      tokensUsed: newMetrics.tokensUsed,
      filesModified: newMetrics.filesModified,
      linesChanged: newMetrics.linesChanged,
      validations: newMetrics.validations as any,
    };
  }
}

/**
 * Compatible session wrapper
 */
export class CompatibleTelemetrySession {
  constructor(
    private session: any,
    private engine: TelemetryEngine
  ) {}

  /**
   * Record a metric
   */
  recordMetric(name: string, value: number): void {
    if (this.session && typeof this.session.recordMetric === 'function') {
      this.session.recordMetric(name, value);
    }
  }

  /**
   * Record a violation
   */
  recordViolation(violation: ViolationRecord): void {
    // Store in session metadata for now
    if (this.session) {
      const violations = (this.session as any).violations || [];
      violations.push(violation);
      (this.session as any).violations = violations;
    }
  }

  /**
   * Record a handoff
   */
  recordHandoff(handoff: HandoffRecord): void {
    // Store in session metadata
    if (this.session) {
      const handoffs = (this.session as any).handoffs || [];
      handoffs.push(handoff);
      (this.session as any).handoffs = handoffs;
    }
  }

  /**
   * End session
   */
  end(outcome: TaskOutcome): OldTelemetrySession {
    if (this.session && typeof this.session.complete === 'function') {
      this.session.complete({
        success: outcome === 'success',
        outcome: outcome as any,
      });
    }

    // Return adapted session
    return {
      sessionId: this.session.sessionId,
      agent: this.session.agent,
      taskType: this.session.taskType,
      taskDescription: this.session.taskDescription,
      startTime: this.session.startTime,
      endTime: new Date(),
      outcome,
      metrics: this.session.metrics,
      violations: (this.session as any).violations || [],
      handoffs: (this.session as any).handoffs || [],
      cost: {
        estimatedCost: 0,
        tokensUsed: this.session.metrics.tokensUsed,
        provider: this.session.agent,
      },
    };
  }
}

/**
 * Compatibility wrapper for ProviderRegistry
 * Adapts the new framework to the old provider-fallback-manager interface
 */
export class CompatibilityProviderAdapter {
  private registry: ProviderRegistry;
  private config: FrameworkConfig | null = null;

  constructor() {
    this.registry = new ProviderRegistry({
      providers: {
        claude: { enabled: true },
        groq: { enabled: true },
        ollama: { enabled: true },
        copilot: { enabled: true },
      },
      fallbackOrder: ['claude', 'groq', 'ollama', 'copilot'],
    });
  }

  /**
   * Initialize with configuration
   */
  async initialize(): Promise<void> {
    try {
      this.config = await loadConfig({
        projectRoot: process.cwd(),
        validate: true,
      });

      if (this.config.providers) {
        this.registry = new ProviderRegistry({
          providers: this.config.providers.providers as any,
          fallbackOrder: [
            this.config.providers.primary,
            ...this.config.providers.fallback,
          ] as any,
        });
      }
    } catch (error) {
      console.warn('⚠️  Failed to load provider config, using defaults:', error);
    }
  }

  /**
   * Execute with provider (old interface)
   */
  async executeWithProvider<T>(
    provider: ProviderType,
    context: TaskContext,
    executor: (provider: ProviderType) => Promise<T>
  ): Promise<ExecutionResult<T>> {
    try {
      const result = await this.registry.executeWithFallback(
        provider as any,
        context as any,
        executor as any
      );

      return {
        result,
        provider: provider,
        attempts: 1,
        totalTime: 0,
        errors: [],
      };
    } catch (error) {
      return {
        result: null as any,
        provider,
        attempts: 1,
        totalTime: 0,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * Get provider health
   */
  async getProviderHealth(provider: ProviderType): Promise<ProviderHealth> {
    const health = this.registry.getProviderHealth(provider as any);
    return health as any;
  }

  /**
   * Switch provider
   */
  async switchProvider(
    from: ProviderType,
    to: ProviderType,
    reason: string
  ): Promise<void> {
    await this.registry.switchProvider(from as any, to as any, reason);
  }
}

/**
 * Global compatibility adapters
 */
let globalTelemetryAdapter: CompatibilityTelemetryAdapter | null = null;
let globalProviderAdapter: CompatibilityProviderAdapter | null = null;

/**
 * Get or create global telemetry adapter
 */
export function getCompatibilityTelemetry(): CompatibilityTelemetryAdapter {
  if (!globalTelemetryAdapter) {
    globalTelemetryAdapter = new CompatibilityTelemetryAdapter();
    // Initialize asynchronously
    globalTelemetryAdapter.initialize().catch(console.error);
  }
  return globalTelemetryAdapter;
}

/**
 * Get or create global provider adapter
 */
export function getCompatibilityProvider(): CompatibilityProviderAdapter {
  if (!globalProviderAdapter) {
    globalProviderAdapter = new CompatibilityProviderAdapter();
    // Initialize asynchronously
    globalProviderAdapter.initialize().catch(console.error);
  }
  return globalProviderAdapter;
}

/**
 * Reset adapters (for testing)
 */
export function resetCompatibilityAdapters(): void {
  globalTelemetryAdapter = null;
  globalProviderAdapter = null;
}

/**
 * Backward compatible exports matching old agent-telemetry interface
 */
export const telemetry = getCompatibilityTelemetry();

/**
 * Track agent session (old interface wrapper)
 */
export function trackAgentSession(
  agent: AgentType,
  taskType: TaskType,
  executor: (session: any) => Promise<void>
): Promise<OldTelemetrySession> {
  return new Promise(async (resolve, reject) => {
    const session = telemetry.startSession(agent, {
      taskType,
      description: `${taskType} task`,
    });

    try {
      await executor(session);
      const result = session.end('success');
      resolve(result);
    } catch (error) {
      const result = session.end('failed');
      reject(error);
    }
  });
}
