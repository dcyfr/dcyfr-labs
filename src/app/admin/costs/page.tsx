import type { Metadata } from 'next';
import { assertAdminOr404 } from '@/lib/admin-guard';
import { createPageMetadata } from '@/lib/metadata';
import UnifiedAiCostsClient from './UnifiedAiCostsClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Unified AI Cost Dashboard',
  description:
    'Monitor AI usage, costs, and budget across Claude Code, GitHub Copilot, and OpenCode.ai',
  path: '/admin/costs',
});

export default function Page() {
  assertAdminOr404();
  return <UnifiedAiCostsClient />;
}
