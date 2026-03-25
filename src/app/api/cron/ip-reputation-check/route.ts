import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import { IPReputationService } from '@/lib/ip-reputation';
import type { IPReputationConfig } from '@/types/ip-reputation';
import {
  fetchIpsFromAxiom,
  updateBlockedIpsList,
  updateSuspiciousIpsList,
  sendSecurityAlert,
} from '@/inngest/ip-reputation-functions';

const DEFAULT_CONFIG: IPReputationConfig = {
  check_interval_minutes: 60,
  axiom_dataset: 'vercel',
  axiom_query:
    "['vercel'] | where isnotnull(['request.ip']) | summarize Value = count() by ['request.ip'] | order by Value desc",
  min_request_threshold: 10,
  cache_ttl_hours: 24,
  auto_block_malicious: true,
  auto_rate_limit_suspicious: true,
  rate_limits: {
    malicious: { limit: 1, window_seconds: 3600, block_immediately: true },
    suspicious: { limit: 10, window_seconds: 3600, block_immediately: false },
    unknown: { limit: 100, window_seconds: 3600, block_immediately: false },
    benign: { limit: 1000, window_seconds: 3600, block_immediately: false },
  },
  alert_thresholds: {
    new_malicious_ips_per_hour: 5,
    total_malicious_requests_per_hour: 100,
  },
};

/** Schedule: Every 4 hours (0, 4, 8, 12, 16, 20 UTC) — migrated from Inngest scheduleIpReputationCheck */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const config = DEFAULT_CONFIG;

  try {
    const ipsToCheck = await fetchIpsFromAxiom(config);

    if (ipsToCheck.length === 0) {
      console.log('[cron/ip-reputation-check] No IPs to check');
      return NextResponse.json({ status: 'no-ips-to-check' });
    }

    console.log(`[cron/ip-reputation-check] Checking ${ipsToCheck.length} IPs...`);

    const service = new IPReputationService();
    const reputationResult = await service.bulkCheckReputation(ipsToCheck);

    const maliciousIps = reputationResult.results
      .filter((r) => r.is_malicious && config.auto_block_malicious)
      .map((r) => r.ip);

    const suspiciousIps = reputationResult.results
      .filter((r) => r.is_suspicious && config.auto_rate_limit_suspicious)
      .map((r) => r.ip);

    if (maliciousIps.length > 0) {
      await updateBlockedIpsList(maliciousIps, 'malicious');
    }

    if (suspiciousIps.length > 0) {
      await updateSuspiciousIpsList(suspiciousIps);
    }

    if (reputationResult.malicious_count > config.alert_thresholds.new_malicious_ips_per_hour) {
      await sendSecurityAlert(
        'high-malicious-ip-count',
        `High number of malicious IPs detected: ${reputationResult.malicious_count}`,
        {
          malicious_count: reputationResult.malicious_count,
          threshold: config.alert_thresholds.new_malicious_ips_per_hour,
        }
      );
    }

    return NextResponse.json({
      status: 'completed',
      malicious: reputationResult.malicious_count,
      suspicious: reputationResult.suspicious_count,
      blocked: maliciousIps.length,
      rateLimited: suspiciousIps.length,
    });
  } catch (error) {
    console.error('[cron/ip-reputation-check] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
