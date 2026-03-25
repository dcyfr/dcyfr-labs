import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import * as Sentry from '@sentry/nextjs';
import { Resend } from 'resend';
import {
  calculateMonthlyCost,
  generateCostRecommendations,
  predictLimitDate,
  PRICING,
} from '@/lib/api/api-cost-calculator';

/** Schedule: 1st of each month at 10:00 AM UTC — migrated from Inngest monthlyApiCostReport */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ALERT_EMAIL = process.env.ADMIN_EMAIL || 'hello@dcyfr.ai';

  try {
    const now = new Date();
    const prevMonth = new Date(now);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const previousMonth = prevMonth.toISOString().slice(0, 7); // YYYY-MM

    const monthlyCost = await calculateMonthlyCost(previousMonth);
    const recommendations = await generateCostRecommendations(previousMonth);

    const services = Object.keys(PRICING) as Array<keyof typeof PRICING>;
    const predictions: Array<{
      service: string;
      prediction: Awaited<ReturnType<typeof predictLimitDate>>;
    }> = [];

    for (const service of services) {
      try {
        const prediction = await predictLimitDate(service, 'default', 7);
        if (prediction.daysUntilLimit !== null) {
          predictions.push({ service, prediction });
        }
      } catch (error) {
        console.warn(`[cron/monthly-api-cost-report] Failed to predict for ${service}:`, error);
      }
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const emailBody = `
<h2>Monthly API Cost Report - ${previousMonth}</h2>
<h3>Summary</h3>
<ul>
  <li><strong>Total Cost:</strong> $${monthlyCost.totalCost.toFixed(2)}</li>
  <li><strong>Budget:</strong> $${monthlyCost.totalBudget}</li>
  <li><strong>Budget Used:</strong> ${monthlyCost.percentUsed.toFixed(1)}%</li>
  <li><strong>Status:</strong> ${monthlyCost.withinBudget ? 'Within Budget' : 'Over Budget'}</li>
</ul>
<h3>Service Breakdown</h3>
<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
  <thead>
    <tr><th>Service</th><th>Requests</th><th>Cost</th><th>Tier</th><th>Status</th></tr>
  </thead>
  <tbody>
${monthlyCost.services
  .map(
    ({ service, usage, cost }) => `
    <tr>
      <td>${PRICING[service as keyof typeof PRICING].name}</td>
      <td>${usage.totalRequests.toLocaleString()}</td>
      <td>$${cost.estimatedCost.toFixed(2)}</td>
      <td>${cost.tier}</td>
      <td>${cost.withinBudget ? 'OK' : 'Over'}</td>
    </tr>`
  )
  .join('')}
  </tbody>
</table>
<h3>Predictions for Current Month</h3>
${
  predictions.length > 0
    ? `<ul>${predictions
        .map(
          ({ service, prediction }) =>
            `<li><strong>${PRICING[service as keyof typeof PRICING].name}:</strong> ${prediction.daysUntilLimit !== null ? `${prediction.daysUntilLimit} days until limit (${prediction.confidence} confidence)` : 'No limit predicted'}</li>`
        )
        .join('\n')}</ul>`
    : '<p><em>No predictions available</em></p>'
}
<h3>Recommendations</h3>
<ul>${recommendations.map((rec) => `<li>${rec}</li>`).join('\n')}</ul>
<p><em>Sent by dcyfr-labs Monthly Cost Reporter</em></p>
      `.trim();

      try {
        await resend.emails.send({
          from: 'DCYFR Labs <noreply@dcyfr.ai>',
          to: ALERT_EMAIL,
          subject: `Monthly API Cost Report - ${previousMonth}`,
          html: emailBody,
        });
        console.warn(`[cron/monthly-api-cost-report] Sent report email to ${ALERT_EMAIL}`);
      } catch (error) {
        console.error('[cron/monthly-api-cost-report] Failed to send email:', error);
      }
    }

    Sentry.captureMessage(`Monthly API Cost Report: ${previousMonth}`, {
      level: 'info',
      tags: { component: 'api-cost-monitoring', month: previousMonth },
      extra: { monthlyCost, recommendations, predictions: predictions.length },
    });

    return NextResponse.json({
      success: true,
      month: previousMonth,
      totalCost: monthlyCost.totalCost,
      budget: monthlyCost.totalBudget,
      percentUsed: monthlyCost.percentUsed,
      servicesReported: monthlyCost.services.length,
      predictions: predictions.length,
    });
  } catch (error) {
    console.error('[cron/monthly-api-cost-report] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
