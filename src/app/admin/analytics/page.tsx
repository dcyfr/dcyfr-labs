import type { Metadata } from 'next';
import { assertAdminOr404 } from '@/lib/admin-guard';
import { createPageMetadata } from '@/lib/metadata';
import { getAnalyticsData, getDailyAnalyticsData } from '@/lib/analytics.server';
import AnalyticsClient from './AnalyticsClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Analytics Dashboard',
  description: 'Analytics dashboard for blog post metrics and performance',
  path: '/admin/analytics',
});

export const dynamic = 'force-dynamic';

export default async function Page() {
  assertAdminOr404();
  const data = await getAnalyticsData(null);
  const daily = await getDailyAnalyticsData(null);

  return <AnalyticsClient initialData={data} initialDailyData={daily} />;
}
