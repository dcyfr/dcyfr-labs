import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import * as Sentry from '@sentry/nextjs';
import { Resend } from 'resend';
import {
  calculateMonthlyCost,
  generateCostRecommendations,
  PRICING,
  BUDGET,
} from '@/lib/api/api-cost-calculator';
import { getUsageSummary } from '@/lib/api/api-usage-tracker';

/** Schedule: Daily at 9:00 AM UTC — migrated from Inngest monitorApiCosts */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ALERT_THRESHOLDS = { warning: 0.7, critical: 0.9 } as const;
  const ALERT_EMAIL = process.env.ADMIN_EMAIL || 'hello@dcyfr.ai';

  try {
    const monthlyCost = await calculateMonthlyCost();
    const summary = await getUsageSummary();
    const recommendations = await generateCostRecommendations();

    const alerts: Array<{ level: 'warning' | 'critical'; message: string; service?: string }> = [];

    if (monthlyCost.percentUsed >= ALERT_THRESHOLDS.critical * 100) {
      alerts.push({
        level: 'critical',
        message: `Total API cost at ${monthlyCost.percentUsed.toFixed(1)}% of budget ($${monthlyCost.totalCost.toFixed(2)}/$${monthlyCost.totalBudget})`,
      });
    } else if (monthlyCost.percentUsed >= ALERT_THRESHOLDS.warning * 100) {
      alerts.push({
        level: 'warning',
        message: `Total API cost at ${monthlyCost.percentUsed.toFixed(1)}% of budget ($${monthlyCost.totalCost.toFixed(2)}/$${monthlyCost.totalBudget})`,
      });
    }

    for (const { service, cost } of monthlyCost.services) {
      const serviceBudget = BUDGET[service as keyof typeof BUDGET];
      const percentUsed = serviceBudget > 0 ? (cost.estimatedCost / serviceBudget) * 100 : 0;

      if (percentUsed >= ALERT_THRESHOLDS.critical * 100) {
        alerts.push({
          level: 'critical',
          service,
          message: `${PRICING[service as keyof typeof PRICING].name}: $${cost.estimatedCost.toFixed(2)}/$${serviceBudget} (${percentUsed.toFixed(1)}%)`,
        });
      } else if (percentUsed >= ALERT_THRESHOLDS.warning * 100) {
        alerts.push({
          level: 'warning',
          service,
          message: `${PRICING[service as keyof typeof PRICING].name}: $${cost.estimatedCost.toFixed(2)}/$${serviceBudget} (${percentUsed.toFixed(1)}%)`,
        });
      }
    }

    if (alerts.length > 0) {
      for (const alert of alerts) {
        Sentry.captureMessage(`API Cost Alert: ${alert.message}`, {
          level: alert.level === 'critical' ? 'error' : 'warning',
          tags: {
            component: 'api-cost-monitoring',
            service: alert.service || 'all',
            alert_type: alert.level,
          },
          extra: { monthlyCost, summary, recommendations },
        });
      }
      console.warn(`[cron/monitor-api-costs] Sent ${alerts.length} alert(s) to Sentry`);
    }

    const criticalAlerts = alerts.filter((a) => a.level === 'critical');
    if (criticalAlerts.length > 0 && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const emailBody = `
<h2>Critical API Cost Alert</h2>
<p><strong>${criticalAlerts.length} critical alert(s) detected:</strong></p>
<ul>${criticalAlerts.map((alert) => `<li>${alert.message}</li>`).join('\n')}</ul>
<h3>Current Status</h3>
<ul>
  <li><strong>Total Cost:</strong> $${monthlyCost.totalCost.toFixed(2)} / $${monthlyCost.totalBudget}</li>
  <li><strong>Budget Used:</strong> ${monthlyCost.percentUsed.toFixed(1)}%</li>
  <li><strong>Services Near Limit:</strong> ${summary.servicesNearLimit.length}</li>
  <li><strong>Services At Limit:</strong> ${summary.servicesAtLimit.length}</li>
</ul>
<h3>Recommendations</h3>
<ul>${recommendations.map((rec) => `<li>${rec}</li>`).join('\n')}</ul>
<p><em>Sent by dcyfr-labs API Cost Monitor</em></p>
      `.trim();

      try {
        await resend.emails.send({
          from: 'DCYFR Labs <noreply@dcyfr.ai>',
          to: ALERT_EMAIL,
          subject: `Critical API Cost Alert - ${criticalAlerts.length} Alert(s)`,
          html: emailBody,
        });
        console.warn(`[cron/monitor-api-costs] Sent critical alert email to ${ALERT_EMAIL}`);
      } catch (error) {
        console.error('[cron/monitor-api-costs] Failed to send email:', error);
      }
    }

    return NextResponse.json({
      success: true,
      monthlyCost: {
        total: monthlyCost.totalCost,
        budget: monthlyCost.totalBudget,
        percentUsed: monthlyCost.percentUsed,
      },
      alerts: {
        total: alerts.length,
        critical: criticalAlerts.length,
        warning: alerts.filter((a) => a.level === 'warning').length,
      },
      recommendations: recommendations.length,
    });
  } catch (error) {
    console.error('[cron/monitor-api-costs] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
