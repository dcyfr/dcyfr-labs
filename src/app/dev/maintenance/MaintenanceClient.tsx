"use client";

/**
 * Maintenance Dashboard - Client Component
 *
 * Displays automated maintenance workflow status, trends, and observation logging.
 *
 * Features:
 * - Workflow status grid (4 tracked workflows)
 * - 52-week trend visualization
 * - Recent workflow history
 * - Observation logging system
 * - Auto-refresh every 60 seconds
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, RefreshCw, ExternalLink, CheckCircle2, XCircle, Server, TrendingUp, Plus, X as XIcon, FileWarning, Database } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TYPOGRAPHY } from "@/lib/design-tokens";
import dynamic from "next/dynamic";
import type { WorkflowSummary, WeeklyMetrics, Observation, ObservationCategory, ObservationSeverity } from "@/types/maintenance";

// Dynamically import Recharts to avoid SSR issues
const LineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { ssr: false }
);
const Line = dynamic(
  () => import("recharts").then((mod) => mod.Line),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((mod) => mod.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((mod) => mod.YAxis),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((mod) => mod.Tooltip),
  { ssr: false }
);
const Legend = dynamic(
  () => import("recharts").then((mod) => mod.Legend),
  { ssr: false }
);
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

/**
 * API Health types
 */
interface ApiHealth {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  services: {
    edge: boolean;
    vercel: boolean;
  };
  serverInfo: {
    runtime: string;
    region: string;
  };
}

/**
 * Design System Report types
 */
interface DesignSystemViolation {
  file: string;
  line: number;
  column: number;
  type: string;
  violation: string;
  suggestion: string;
  description: string;
}

interface DesignSystemReport {
  generatedAt: string;
  totalViolations: number;
  filesScanned: number;
  violations: DesignSystemViolation[];
  summary: {
    spacing: number;
    typography: number;
  };
}

/**
 * Redis Health Status types
 */
interface RedisTestResult {
  success: boolean;
  latency: number;
  error?: string;
}

interface RedisHealthStatus {
  enabled: boolean;
  configured: boolean;
  connected: boolean;
  message: string;
  error?: string;
  url?: string;
  testResult?: RedisTestResult;
  timestamp?: string;
}

/**
 * Workflow status badge component
 */
function WorkflowStatusBadge({
  status,
  conclusion,
}: {
  status: string;
  conclusion: string | null;
}) {
  if (status === "in_progress" || status === "queued") {
    return (
      <Badge variant="secondary" className="gap-1">
        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        {status === "queued" ? "Queued" : "Running"}
      </Badge>
    );
  }

  if (conclusion === "success") {
    return (
      <Badge variant="default" className="gap-1 bg-green-600">
        <span className="h-2 w-2 rounded-full bg-white" />
        Success
      </Badge>
    );
  }

  if (conclusion === "failure" || conclusion === "timed_out" || conclusion === "action_required") {
    return (
      <Badge variant="destructive" className="gap-1">
        <span className="h-2 w-2 rounded-full bg-white" />
        Failed
      </Badge>
    );
  }

  if (conclusion === "cancelled" || conclusion === "skipped") {
    return (
      <Badge variant="secondary" className="gap-1">
        <span className="h-2 w-2 rounded-full bg-yellow-500" />
        {conclusion === "cancelled" ? "Cancelled" : "Skipped"}
      </Badge>
    );
  }

  return <Badge variant="outline">Unknown</Badge>;
}

/**
 * Workflow status card component
 */
function WorkflowCard({ workflow }: { workflow: WorkflowSummary }) {
  const lastRun = workflow.last_run;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{workflow.workflow_name}</CardTitle>
            <CardDescription className="mt-1">
              Pass rate: {workflow.pass_rate.toFixed(1)}% ({workflow.successful_runs}/
              {workflow.total_runs})
            </CardDescription>
          </div>
          {lastRun && (
            <WorkflowStatusBadge status={lastRun.status} conclusion={lastRun.conclusion} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {lastRun ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last run:</span>
              <span>{new Date(lastRun.created_at).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Run number:</span>
              <span>#{lastRun.run_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Branch:</span>
              <span className="font-mono text-xs">{lastRun.head_branch || "N/A"}</span>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a
                  href={lastRun.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  View on GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-4">
            No runs found
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Loading skeleton for workflow grid
 */
function WorkflowGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * API Health status component
 */
function ApiHealthCard({ health }: { health: ApiHealth | null }) {
  if (!health) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  const statusConfig = {
    healthy: { variant: "default" as const, className: "bg-green-600", icon: CheckCircle2 },
    degraded: { variant: "secondary" as const, className: "bg-yellow-600", icon: AlertCircle },
    unhealthy: { variant: "destructive" as const, className: "", icon: XCircle },
  };

  const config = statusConfig[health.status];
  const StatusIcon = config.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">API Health</CardTitle>
          </div>
          <Badge variant={config.variant} className={config.className}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Edge Runtime:</span>
            <div className="flex items-center gap-1 mt-1">
              {health.services.edge ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span>{health.services.edge ? "Operational" : "Down"}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Vercel:</span>
            <div className="flex items-center gap-1 mt-1">
              {health.services.vercel ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span>{health.services.vercel ? "Operational" : "Down"}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Region:</span>
            <div className="font-mono text-xs mt-1">{health.serverInfo.region}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Last Check:</span>
            <div className="text-xs mt-1">
              {new Date(health.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 52-Week Trend Chart Component
 */
function TrendChart({ trends }: { trends: WeeklyMetrics[] | null }) {
  if (!trends || trends.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Show only every 4th week label to avoid crowding
  const chartData = trends.map((t, i) => ({
    ...t,
    weekLabel: i % 4 === 0 ? t.week.split("-W")[1] : "",
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="weekLabel"
          label={{ value: "Week", position: "insideBottom", offset: -5 }}
        />
        <YAxis label={{ value: "Percentage / Score", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="testPassRate"
          stroke="#10b981"
          name="Test Pass Rate %"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="coverage"
          stroke="#3b82f6"
          name="Coverage %"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="securityScore"
          stroke="#8b5cf6"
          name="Security Score"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/**
 * Observation Logger Component
 */
function ObservationLogger({ onSubmit }: { onSubmit: () => void }) {
  const [category, setCategory] = useState<ObservationCategory>("general");
  const [severity, setSeverity] = useState<ObservationSeverity>("info");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/maintenance/observations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          severity,
          title: title.trim(),
          description: description.trim(),
          tags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to create observation");
      }

      toast.success("Observation logged successfully");

      // Reset form
      setTitle("");
      setDescription("");
      setTags([]);
      setCategory("general");
      setSeverity("info");

      onSubmit();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to log observation";
      console.error("Observation creation error:", errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Observation</CardTitle>
        <CardDescription>Record AI performance issues, dev tool bugs, or workflow notes</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ObservationCategory)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-performance">AI Performance</SelectItem>
                  <SelectItem value="dev-tools">Dev Tools</SelectItem>
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select value={severity} onValueChange={(v) => setSeverity(v as ObservationSeverity)}>
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of the observation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what you observed"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tags (press Enter)"
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Logging..." : "Log Observation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/**
 * Observation List Component
 */
function ObservationList({ observations }: { observations: Observation[] }) {
  if (observations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No observations logged yet</p>
      </div>
    );
  }

  const severityConfig: Record<string, { variant: "secondary" | "destructive"; icon: typeof CheckCircle2; className: string }> = {
    info: { variant: "secondary", icon: CheckCircle2, className: "" },
    warning: { variant: "secondary", icon: AlertCircle, className: "bg-yellow-600" },
    error: { variant: "destructive", icon: XCircle, className: "" },
  };

  return (
    <div className="space-y-4">
      {observations.map((obs) => {
        const config = severityConfig[obs.severity];
        const SeverityIcon = config.icon;

        return (
          <Card key={obs.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{obs.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {obs.category}
                    </Badge>
                  </div>
                  <CardDescription>{obs.description}</CardDescription>
                </div>
                <Badge variant={config.variant} className={config.className || undefined}>
                  <SeverityIcon className="h-3 w-3 mr-1" />
                  {obs.severity}
                </Badge>
              </div>
            </CardHeader>
            {(obs.tags.length > 0 || obs.createdAt) && (
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex flex-wrap gap-2">
                    {obs.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(obs.createdAt).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

/**
 * Redis Health Status Component
 */
function RedisHealthCard({ health }: { health: RedisHealthStatus | null }) {
  if (!health) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  const statusConfig = {
    connected: { variant: "default" as const, className: "bg-green-600", icon: CheckCircle2 },
    notConfigured: { variant: "secondary" as const, className: "bg-blue-600", icon: AlertCircle },
    unavailable: { variant: "destructive" as const, className: "", icon: XCircle },
  };

  let status: "connected" | "notConfigured" | "unavailable" = "unavailable";
  if (!health.configured) {
    status = "notConfigured";
  } else if (health.connected) {
    status = "connected";
  }

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className={!health.configured ? "border-blue-500/50" : health.connected ? "border-green-500/50" : "border-red-500/50"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Redis Cache</CardTitle>
          </div>
          <Badge variant={config.variant} className={config.className}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status === "connected" && "Connected"}
            {status === "notConfigured" && "Not Configured"}
            {status === "unavailable" && "Unavailable"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          {health.configured ? (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">URL:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs font-mono">{health.url || "N/A"}</code>
              </div>

              {health.testResult && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Connection:</span>
                    <span className={health.testResult.success ? "text-green-600" : "text-red-600"}>
                      {health.testResult.success ? "✓ OK" : "✗ Failed"}
                    </span>
                  </div>

                  {health.testResult.success && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latency:</span>
                      <span className="font-mono">{health.testResult.latency}ms</span>
                    </div>
                  )}

                  {health.testResult.error && (
                    <div className="bg-red-50 dark:bg-red-950 rounded p-2">
                      <p className="text-xs text-red-600 dark:text-red-300 font-mono">
                        {health.testResult.error}
                      </p>
                    </div>
                  )}
                </>
              )}

              {health.error && (
                <div className="bg-red-50 dark:bg-red-950 rounded p-2">
                  <p className="text-xs text-red-600 dark:text-red-300 font-mono">
                    {health.error}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-muted-foreground">{health.message}</p>
              <div className="bg-blue-50 dark:bg-blue-950 rounded p-2">
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Fallback: Using in-memory storage for observations and metrics
                </p>
              </div>
            </>
          )}

          {health.timestamp && (
            <div className="pt-2 text-xs text-muted-foreground border-t">
              Checked: {new Date(health.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Design System Report Card Component
 */
function DesignSystemReportCard({ report }: { report: DesignSystemReport | null }) {
  const [expanded, setExpanded] = useState(false);

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Design System Report</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No report available</p>
            <p className="text-xs mt-2">Run: <code className="bg-muted px-1 py-0.5 rounded">node scripts/validate-design-tokens.mjs</code></p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasViolations = report.totalViolations > 0;

  // Group violations by file
  const violationsByFile = report.violations.reduce((acc, v) => {
    const fileName = v.file.split("/").slice(-2).join("/");
    if (!acc[fileName]) acc[fileName] = [];
    acc[fileName].push(v);
    return acc;
  }, {} as Record<string, DesignSystemViolation[]>);

  return (
    <Card className={hasViolations ? "border-yellow-500/50" : "border-green-500/50"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileWarning className={`h-5 w-5 ${hasViolations ? "text-yellow-500" : "text-green-500"}`} />
            <div>
              <CardTitle>Design System Report</CardTitle>
              <CardDescription>
                Generated {new Date(report.generatedAt).toLocaleString()}
              </CardDescription>
            </div>
          </div>
          <Badge variant={hasViolations ? "secondary" : "default"} className={hasViolations ? "bg-yellow-600" : "bg-green-600"}>
            {report.totalViolations} violation{report.totalViolations !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-muted rounded-lg p-3">
              <div className="text-2xl font-bold">{report.filesScanned}</div>
              <div className="text-xs text-muted-foreground">Files Scanned</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-600">{report.summary.spacing}</div>
              <div className="text-xs text-muted-foreground">Spacing Issues</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">{report.summary.typography}</div>
              <div className="text-xs text-muted-foreground">Typography Issues</div>
            </div>
          </div>

          {/* Violations List */}
          {hasViolations && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="w-full justify-between"
              >
                <span>{expanded ? "Hide" : "Show"} Violations</span>
                <span className="text-xs text-muted-foreground">
                  {Object.keys(violationsByFile).length} files affected
                </span>
              </Button>

              {expanded && (
                <div className="max-h-96 overflow-y-auto space-y-3 text-sm">
                  {Object.entries(violationsByFile).map(([file, violations]) => (
                    <div key={file} className="border rounded-lg p-3">
                      <div className="font-mono text-xs text-muted-foreground mb-2">{file}</div>
                      <div className="space-y-1">
                        {violations.map((v, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <span className="text-muted-foreground">L{v.line}:</span>
                            <span className="text-red-500 font-mono">{v.violation}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className="text-green-600">{v.suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main maintenance dashboard component
 */
export default function MaintenanceClient() {
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null);
  const [trends, setTrends] = useState<WeeklyMetrics[] | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [designSystemReport, setDesignSystemReport] = useState<DesignSystemReport | null>(null);
  const [redisHealth, setRedisHealth] = useState<RedisHealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  /**
   * Fetch dashboard data (workflows, health, trends, observations, reports)
   */
  const fetchDashboardData = async (showToast = false) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [workflowsRes, healthRes, trendsRes, observationsRes, designReportRes, redisHealthRes] = await Promise.all([
        fetch("/api/maintenance/workflows"),
        fetch("/api/health"),
        fetch("/api/maintenance/metrics?period=52weeks"),
        fetch("/api/maintenance/observations?limit=10"),
        fetch("/dev/api/reports/design-system-report.json"),
        fetch("/dev/api/redis-health"),
      ]);

      if (!workflowsRes.ok) {
        throw new Error(`Failed to fetch workflows: ${workflowsRes.statusText}`);
      }

      const workflowsData = await workflowsRes.json();
      setWorkflows(workflowsData.workflows);

      // Optional data sources - don't fail if unavailable
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setApiHealth(healthData);
      }

      if (trendsRes.ok) {
        const trendsData = await trendsRes.json();
        setTrends(trendsData.trends);
      }

      if (observationsRes.ok) {
        const observationsData = await observationsRes.json();
        setObservations(observationsData.observations);
      }

      if (designReportRes.ok) {
        const designData = await designReportRes.json();
        setDesignSystemReport(designData);
      }

      if (redisHealthRes.ok) {
        const redisData = await redisHealthRes.json();
        setRedisHealth(redisData);
      }

      setLastRefresh(new Date());

      if (showToast) {
        toast.success("Dashboard refreshed successfully");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      toast.error(`Failed to fetch dashboard data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh observations after logging a new one
   */
  const refreshObservations = async () => {
    try {
      const response = await fetch("/api/maintenance/observations?limit=10");
      if (response.ok) {
        const data = await response.json();
        setObservations(data.observations);
      }
    } catch (error) {
      console.error("Failed to refresh observations:", error);
    }
  };

  /**
   * Initial data fetch
   */
  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Auto-refresh every 60 seconds
   */
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  /**
   * Manual refresh handler
   */
  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  return (
    <DashboardLayout
      title="Maintenance Dashboard"
      description="Monitor automated workflows, trends, and system health"
      actions={
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Refresh
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* API Health & Design System Status */}
        <section className="grid gap-4 lg:grid-cols-3">
          <ApiHealthCard health={apiHealth} />
          <DesignSystemReportCard report={designSystemReport} />
          <RedisHealthCard health={redisHealth} />
        </section>

        {/* Workflow Status Grid */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className={TYPOGRAPHY.h2.standard}>Workflow Status</h2>
              <p className="text-sm text-muted-foreground">
                Status of automated maintenance workflows
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Auto-refresh (60s)
              </label>
            </div>
          </div>

          {error && (
            <Card className="border-destructive mb-6">
              <CardHeader>
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <CardTitle>Error Loading Workflows</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button variant="outline" onClick={handleRefresh} className="mt-4">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {loading && workflows.length === 0 ? (
            <WorkflowGridSkeleton />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {workflows.map((workflow) => (
                <WorkflowCard key={workflow.workflow_id} workflow={workflow} />
              ))}
            </div>
          )}
        </section>

        {/* 52-Week Trends */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle>52-Week Trends</CardTitle>
                  <CardDescription>
                    Test pass rate, coverage, and security score over time
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TrendChart trends={trends} />
            </CardContent>
          </Card>
        </section>

        {/* Workflow History */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Recent Workflow Runs</CardTitle>
              <CardDescription>Detailed history across all tracked workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workflows.flatMap((workflow) =>
                  workflow.recent_runs.slice(0, 3).map((run) => (
                    <div
                      key={run.id}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{workflow.workflow_name}</div>
                        <div className="text-xs text-muted-foreground">
                          Run #{run.run_number} • {new Date(run.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <WorkflowStatusBadge status={run.status} conclusion={run.conclusion} />
                        <Button variant="ghost" size="sm" asChild>
                          <a href={run.html_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Observations */}
        <section>
          <div className="grid gap-6 lg:grid-cols-2">
            <ObservationLogger onSubmit={refreshObservations} />
            <Card>
              <CardHeader>
                <CardTitle>Recent Observations</CardTitle>
                <CardDescription>Last 10 logged observations</CardDescription>
              </CardHeader>
              <CardContent>
                <ObservationList observations={observations} />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
