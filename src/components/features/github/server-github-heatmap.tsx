/**
 * Server GitHub Heatmap Component
 *
 * Server-side rendered GitHub contribution heatmap that fetches data
 * directly from Redis cache without exposing public API endpoints.
 * This component fetches data server-side and passes it to the client component.
 */

import { Suspense } from 'react';
import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { GitHubHeatmapSkeleton } from '@/components/common';
import { getGitHubContributions } from '@/lib/github-data';
import { ClientGitHubHeatmap } from './calendar-heatmap-client';
import { SEMANTIC_COLORS, TYPOGRAPHY } from '@/lib/design-tokens';

// ============================================================================
// TYPES
// ============================================================================

interface ServerGitHubHeatmapProps {
  username?: string;
  showWarning?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Server-rendered GitHub contribution heatmap
 *
 * Fetches data from Redis cache during server-side rendering,
 * then passes it to the client component for interactive display.
 */
export async function ServerGitHubHeatmap({
  username = 'dcyfr',
  showWarning = true,
}: ServerGitHubHeatmapProps) {
  // Fetch data server-side from Redis cache
  let data;

  try {
    data = await getGitHubContributions(username);
  } catch (error) {
    console.error('[ServerGitHubHeatmap] Failed to load data:', error);
    // Return error state instead of skeleton
    return (
      <Card
        className={`p-4 ${SEMANTIC_COLORS.alert.critical.container} ${SEMANTIC_COLORS.alert.critical.border}`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle
            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${SEMANTIC_COLORS.alert.critical.icon}`}
          />
          <div className="flex-1 min-w-0">
            <h3 className={`${TYPOGRAPHY.h3.standard} mb-1`}>Unable to Load GitHub Activity</h3>
            <p className={`text-sm ${SEMANTIC_COLORS.alert.critical.text}`}>
              We&apos;re unable to load your GitHub contribution data at this time. Please try again
              later.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // TypeScript safety: data should be defined at this point, but add explicit check
  if (!data) {
    return (
      <Card
        className={`p-4 ${SEMANTIC_COLORS.alert.critical.container} ${SEMANTIC_COLORS.alert.critical.border}`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle
            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${SEMANTIC_COLORS.alert.critical.icon}`}
          />
          <div className="flex-1 min-w-0">
            <h3 className={`${TYPOGRAPHY.h3.standard} mb-1`}>Unable to Load GitHub Activity</h3>
            <p className={`text-sm ${SEMANTIC_COLORS.alert.critical.text}`}>
              GitHub contribution data is temporarily unavailable. Please try again later.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Handle error state when contributions data is empty (Redis unavailable in production)
  if (data.contributions.length === 0 && data.source === 'error') {
    return (
      <Card
        className={`p-4 ${SEMANTIC_COLORS.alert.warning.container} ${SEMANTIC_COLORS.alert.warning.border}`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle
            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${SEMANTIC_COLORS.alert.warning.icon}`}
          />
          <div className="flex-1 min-w-0">
            <h3 className={`${TYPOGRAPHY.h3.standard} mb-1`}>GitHub Activity Unavailable</h3>
            <p className={`text-sm ${SEMANTIC_COLORS.alert.warning.text}`}>
              {data.warning ||
                'Unable to retrieve your GitHub contribution history. Please check back later.'}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <Suspense fallback={<GitHubHeatmapSkeleton />}>
        <ClientGitHubHeatmap data={data} username={username} showWarning={showWarning} />
      </Suspense>
    </Card>
  );
}
