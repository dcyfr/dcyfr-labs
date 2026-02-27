import type { Metadata } from 'next';
import { assertAdminOr404 } from '@/lib/admin-guard';
import { createPageMetadata } from '@/lib/metadata';
import McpHealthClient from './McpHealthClient';

export const metadata: Metadata = createPageMetadata({
  title: 'MCP Health Dashboard',
  description: 'Monitor MCP server health, uptime, and response times',
  path: '/admin/mcp-health',
});

export default function Page() {
  assertAdminOr404();
  return <McpHealthClient />;
}
