# Cost Management Guide

**Version:** 1.0.0
**Last Updated:** January 23, 2026
**Purpose:** Track, optimize, and control costs for Claude Code, MCP servers, and AI tooling

---

## Cost Overview

### Current Monthly Costs (Estimated)

| Category           | Service           | Tier     | Est. Monthly Cost | Notes                      |
| ------------------ | ----------------- | -------- | ----------------- | -------------------------- |
| **AI Models**      | Claude Opus 4.5   | Primary  | $80-120           | Production work            |
|                    | Claude Sonnet 4.5 | Fallback | $20-40            | Quick fixes, research      |
|                    | Claude Haiku 4.5  | Budget   | $5-10             | Ultra-fast tasks           |
| **MCP Servers**    | Perplexity        | Paid     | $20               | Web search, research       |
|                    | Context7          | Paid     | $10               | Enhanced context retrieval |
|                    | GitHub (Free)     | Free     | $0                | Included with Copilot      |
|                    | Vercel (Free)     | Free     | $0                | Included with plan         |
|                    | Sentry (Free)     | Free     | $0                | Developer tier             |
|                    | Axiom (Free)      | Free     | $0                | Starter tier               |
|                    | Octocode (Free)   | Free     | $0                | Community version          |
| **Infrastructure** | Redis (Upstash)   | Paid     | $10               | Analytics, health tracking |
| **TOTAL**          |                   |          | **$145-200/mo**   |                            |

---

## Model Selection Strategy

### Decision Matrix: When to Use Which Model

```
Task Complexity Analysis:
├─ Ultra-simple (token replacement, typo fix)
│  └─ Use: Haiku 4.5 ($0.0025/1K tokens)
│
├─ Simple (component creation, bug fix)
│  └─ Use: Sonnet 4.5 ($0.003/1K tokens)
│
├─ Medium (feature implementation, refactoring)
│  └─ Use: Sonnet 4.5 or Opus 4.5 ($0.015/1K tokens)
│
└─ Complex (architecture design, security review)
   └─ Use: Opus 4.5 ($0.015/1K tokens)
```

### Model Cost Comparison

| Model          | Input ($/1K) | Output ($/1K) | Speed  | Best For                   |
| -------------- | ------------ | ------------- | ------ | -------------------------- |
| **Haiku 4.5**  | $0.0025      | $0.01         | ⚡⚡⚡ | Quick fixes, simple edits  |
| **Sonnet 4.5** | $0.003       | $0.015        | ⚡⚡   | Features, bug fixes        |
| **Opus 4.5**   | $0.015       | $0.075        | ⚡     | Complex work, architecture |

**Cost Ratio:** Haiku : Sonnet : Opus = 1 : 1.2 : 6

### Fallback Strategy

**Configured in conductor.json:**

```json
{
  "agent_configs": {
    "default": {
      "model": "claude-opus-4.5",
      "fallback_model": "claude-sonnet-4.5",
      "fallback_trigger": "rate_limit_exceeded",
      "max_turns": 25
    },
    "quick_fixes": {
      "model": "claude-haiku-4.5",
      "max_turns": 10
    }
  }
}
```

**Fallback Triggers:**

- Rate limit exceeded (429 status)
- Budget threshold exceeded
- Extended session (>25 turns)
- User override

---

## MCP Server Cost Tracking

### Paid MCP Servers

#### 1. Perplexity ($20/mo)

**Usage Tracking:**

```bash
# Count Perplexity tool calls
grep "mcp_perplexity" ~/.claude/bash-command-log.txt | wc -l

# Estimate cost
# Perplexity: ~$0.50 per research query
# 40 queries/month = $20
```

**Optimization:**

- Use Octocode for code-specific research (free)
- Use Context7 for documentation (cheaper)
- Batch research questions (fewer API calls)

**Target:** <40 queries/month

#### 2. Context7 ($10/mo)

**Usage Tracking:**

```bash
# Count Context7 tool calls
grep "mcp_context7" ~/.claude/bash-command-log.txt | wc -l

# Estimate cost
# Context7: ~$0.25 per enhanced retrieval
# 40 retrievals/month = $10
```

**Optimization:**

- Use for complex queries only
- Fallback to grep/semantic search for simple lookups

**Target:** <40 retrievals/month

### Free MCP Servers (Monitor for Tier Changes)

**Watch for pricing changes:**

- GitHub MCP (currently free with Copilot)
- Sentry (free tier: 5K events/mo)
- Axiom (free tier: 0.5GB/mo)
- Octocode (community version)

**Set alerts:**

```bash
# Weekly check for tier limits
npm run mcp:check:usage
```

---

## Cost Tracking System

### Current Implementation (Manual)

**Log all AI interactions:**

```bash
# In .claude/settings.json hooks
mkdir -p ~/.claude/usage
echo "$(date),DCYFR,opus-4.5,estimated_tokens" >> ~/.claude/usage/ai-usage.csv
```

### Recommended Implementation (Automated)

**Create cost tracking hook:**

```jsonc
// Add to .claude/settings.json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "comment": "Track session cost",
            "command": "node scripts/track-ai-costs.mjs",
            "timeout": 10,
          },
        ],
      },
    ],
  },
}
```

**Create tracking script:**

```javascript
// scripts/track-ai-costs.mjs
import fs from 'fs';
import path from 'path';

const COST_PER_1K = {
  'claude-opus-4.5': { input: 0.015, output: 0.075 },
  'claude-sonnet-4.5': { input: 0.003, output: 0.015 },
  'claude-haiku-4.5': { input: 0.0025, output: 0.01 },
};

async function trackCost() {
  const sessionState = JSON.parse(fs.readFileSync('.claude/.session-state.json', 'utf8'));

  const model = sessionState.model || 'claude-opus-4.5';
  const estimatedTokens = sessionState.estimated_tokens || 10000;

  const cost = (estimatedTokens / 1000) * COST_PER_1K[model].input;

  const logEntry = {
    timestamp: new Date().toISOString(),
    model,
    tokens: estimatedTokens,
    cost: cost.toFixed(4),
    branch: sessionState.branch,
  };

  const logFile = path.join(process.env.HOME, '.claude/usage/ai-usage.jsonl');
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

  console.log(`💰 Session cost: $${cost.toFixed(4)} (${estimatedTokens} tokens)`);
}

trackCost();
```

---

## Budget Alerts

### Daily Budget Tracking

**Create alert script:**

```bash
#!/bin/bash
# scripts/check-daily-budget.sh

DAILY_LIMIT=10.00  # $10/day max
TODAY=$(date +%Y-%m-%d)

DAILY_COST=$(awk -F, -v date="$TODAY" '$1 ~ date {sum+=$4} END {print sum}' ~/.claude/usage/ai-usage.csv)

if (( $(echo "$DAILY_COST > $DAILY_LIMIT" | bc -l) )); then
  echo "⚠️  BUDGET ALERT: Daily cost ($DAILY_COST) exceeds limit ($DAILY_LIMIT)"
  echo "Consider switching to Sonnet or Haiku models"
fi
```

**Add to cron (run hourly):**

```bash
0 * * * * /path/to/scripts/check-daily-budget.sh
```

### Monthly Budget Tracking

**Create dashboard:**

```bash
#!/bin/bash
# scripts/cost-dashboard.sh

echo "=== AI Cost Dashboard ==="
echo ""

# This month
MONTH=$(date +%Y-%m)
MONTHLY_COST=$(awk -F, -v month="$MONTH" '$1 ~ month {sum+=$4} END {printf "%.2f", sum}' ~/.claude/usage/ai-usage.csv)
echo "This Month: \$$MONTHLY_COST"

# By model
echo ""
echo "By Model:"
awk -F, '{model[$2]+=$4} END {for (m in model) printf "  %s: $%.2f\n", m, model[m]}' ~/.claude/usage/ai-usage.csv

# Top 10 expensive sessions
echo ""
echo "Top 10 Sessions:"
sort -t, -k4 -rn ~/.claude/usage/ai-usage.csv | head -10 | awk -F, '{printf "  %s: $%.2f (%s)\n", $1, $4, $2}'
```

**Run weekly:**

```bash
0 9 * * 1 /path/to/scripts/cost-dashboard.sh | mail -s "Weekly AI Cost Report" you@email.com
```

---

## Cost Optimization Strategies

### 1. Agent Selection Optimization

**Current:** DCYFR always uses Opus 4.5
**Optimized:**

```yaml
# In .claude/agents/DCYFR.md
model: claude-opus-4.5  # Complex work
fallback_model: claude-sonnet-4.5  # Standard work

# In .claude/agents/quick-fix.md
model: claude-haiku-4.5  # Simple fixes
```

**Expected Savings:** 30-40% (by using Sonnet for 60% of tasks)

### 2. Context Window Optimization

**Current:** 40-60% context reduction via .claudeignore
**Optimized:**

```bash
# Additional exclusions for cost-sensitive work
# In .claudeignore
**/*.test.ts    # Exclude tests (save ~20% context)
src/content/**  # Exclude content (save ~15% context)
```

**Expected Savings:** 10-15% additional context reduction = 10-15% cost savings

### 3. MCP Server Optimization

**Audit MCP usage monthly:**

```bash
# Count tool calls per MCP server
for server in perplexity context7 octocode; do
  count=$(grep "mcp_$server" ~/.claude/bash-command-log.txt | wc -l)
  echo "$server: $count calls"
done
```

**Optimization Targets:**

- Perplexity: <40 calls/month (save $20 if unused)
- Context7: <30 calls/month (save $10 if unused)

### 4. Hook Performance Optimization

**Slow hooks = longer sessions = higher costs**

**Optimize slow hooks:**

```bash
# Before: TypeScript check on every write (15s)
# After: Only check changed files on Stop (5s)

# Expected Savings: 50% faster sessions = 20% cost reduction
```

### 5. Batch Operations

**Instead of:**

```
Session 1: Fix component A (Opus, 10K tokens)
Session 2: Fix component B (Opus, 10K tokens)
Session 3: Fix component C (Opus, 10K tokens)
Total: 30K tokens * $0.015 = $0.45
```

**Do:**

```
Session 1: Fix components A, B, C together (Opus, 15K tokens)
Total: 15K tokens * $0.015 = $0.225
Savings: 50%
```

---

## ROI Analysis

### Cost vs Value

**Current Investment:** ~$150-200/month

**Time Savings:**

- Design token enforcement: 5 hours/week automated
- Test coverage maintenance: 3 hours/week automated
- Code review automation: 4 hours/week automated
- **Total:** 12 hours/week = 48 hours/month

**Developer Rate:** $75/hour (conservative)
**Value:** 48 hours × $75 = **$3,600/month**

**ROI:** ($3,600 - $200) / $200 = **1,700%**

### Break-Even Analysis

**Break-Even Point:** $200 cost = 2.67 hours saved/month
**Current Performance:** 48 hours saved/month
**Safety Margin:** 18x over break-even

---

## Cost Reduction Checklist

### Monthly Review (1st of Month)

- [ ] Review cost dashboard (`scripts/cost-dashboard.sh`)
- [ ] Check MCP server usage vs limits
- [ ] Identify expensive sessions (>$5 each)
- [ ] Review model selection (% Opus vs Sonnet vs Haiku)
- [ ] Update budget projections

### Quarterly Review (Jan, Apr, Jul, Oct)

- [ ] Analyze ROI (cost vs time saved)
- [ ] Review MCP server pricing changes
- [ ] Optimize agent delegation rules
- [ ] Update cost tracking scripts
- [ ] Renegotiate paid services if possible

### Annual Review (January)

- [ ] Full cost audit
- [ ] Benchmark against alternatives
- [ ] Update budget for next year
- [ ] Review feature cost vs benefit

---

## Budget Scenarios

### Scenario 1: Tight Budget (<$100/month)

**Configuration:**

- Primary: Sonnet 4.5 (not Opus)
- Quick fixes: Haiku 4.5
- Disable paid MCPs (Perplexity, Context7)
- Aggressive .claudeignore (exclude tests, content)

**Expected Cost:** $60-80/month

### Scenario 2: Standard Budget ($150-200/month)

**Configuration (Current):**

- Primary: Opus 4.5
- Quick fixes: Haiku 4.5
- Paid MCPs: Perplexity, Context7
- Standard .claudeignore

**Expected Cost:** $150-200/month

### Scenario 3: Premium Budget ($300+/month)

**Configuration:**

- Primary: Opus 4.5 (unlimited)
- All MCP servers enabled (Tier 3 included)
- Minimal .claudeignore (full context)
- Extended research sessions

**Expected Cost:** $300-400/month

---

## Emergency Cost Controls

### Immediate Actions (Budget Overrun)

1. **Switch to Sonnet Default**

   ```json
   // conductor.json
   "default": { "model": "claude-sonnet-4.5" }
   ```

2. **Disable Paid MCPs**

   ```jsonc
   // .vscode/mcp.json
   "Perplexity": { "disabled": true },
   "Context7": { "disabled": true }
   ```

3. **Aggressive Context Reduction**

   ```bash
   # .claudeignore
   **/*.test.ts
   **/*.spec.ts
   src/content/**
   ```

4. **Limit Session Turns**
   ```json
   // conductor.json
   "max_turns": 15  // Was 25
   ```

---

## Cost Tracking Dashboard

### View Current Costs

```bash
# Run dashboard
npm run cost:dashboard

# Output:
# === AI Cost Dashboard ===
#
# This Month: $147.32
#
# By Model:
#   claude-opus-4.5: $98.50
#   claude-sonnet-4.5: $38.22
#   claude-haiku-4.5: $10.60
#
# Top 10 Sessions:
#   2026-01-23 14:30: $8.45 (claude-opus-4.5)
#   2026-01-22 10:15: $6.32 (claude-opus-4.5)
#   ...
```

### Add to package.json

```json
{
  "scripts": {
    "cost:dashboard": "bash scripts/cost-dashboard.sh",
    "cost:check": "bash scripts/check-daily-budget.sh",
    "cost:export": "node scripts/export-costs.mjs",
    "cost:analyze": "node scripts/analyze-costs.mjs"
  }
}
```

---

## Related Documentation

- [Claude Hooks Guide](./claude-hooks-guide.md)
- [MCP Configuration](../mcp/README.md)
- [Agent Taxonomy](./.claude/agents/AGENT_TAXONOMY.md)
- [Automation Guide](../automation/AUTOMATED_UPDATES.md)

---

**Next Steps:**

1. Implement cost tracking script (`scripts/track-ai-costs.mjs`)
2. Set up budget alerts (daily + monthly)
3. Create cost dashboard (`scripts/cost-dashboard.sh`)
4. Schedule monthly cost review

**Last Updated:** January 23, 2026
**Next Review:** February 23, 2026
