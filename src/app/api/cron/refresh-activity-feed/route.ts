import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import { posts } from '@/data/posts';
import { projects } from '@/data/projects';
import { changelog } from '@/data/changelog';
import { transformProjects, transformChangelog } from '@/lib/activity';
import {
  transformPostsWithViews,
  transformTrendingPosts,
  transformMilestones,
  transformHighEngagementPosts,
  transformCommentMilestones,
  transformCredlyBadges,
  transformVercelAnalytics,
  transformGitHubTraffic,
  transformGoogleAnalytics,
  transformSearchConsole,
} from '@/lib/activity/server';
import { activityFeedCache } from '@/lib/cache-versioning';

/** Schedule: Hourly — migrated from Inngest refreshActivityFeed */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.warn('[cron/refresh-activity-feed] Gathering activities from all sources...');

    const results = await Promise.allSettled([
      transformPostsWithViews(posts),
      Promise.resolve(transformProjects([...projects])),
      Promise.resolve(transformChangelog(changelog)),
      transformTrendingPosts(posts),
      transformMilestones(posts),
      transformHighEngagementPosts(posts),
      transformCommentMilestones(posts),
      transformCredlyBadges('dcyfr'),
      transformVercelAnalytics(),
      transformGitHubTraffic(),
      transformGoogleAnalytics(),
      transformSearchConsole(),
    ]);

    const allActivities = results
      .filter((r) => r.status === 'fulfilled')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .flatMap((r) => (r as PromiseFulfilledResult<any>).value);

    const failures = results.filter((r) => r.status === 'rejected');
    if (failures.length > 0) {
      console.warn(
        `[cron/refresh-activity-feed] ${failures.length} source(s) failed:`,
        failures.map((f) => (f as PromiseRejectedResult).reason)
      );
    }

    const sorted = allActivities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    console.warn(`[cron/refresh-activity-feed] Sorted ${sorted.length} activities`);

    const success = await activityFeedCache.set('feed:all', sorted);
    if (!success) {
      throw new Error('Failed to write to versioned cache');
    }

    console.warn(`[cron/refresh-activity-feed] Cached ${sorted.length} activities`);

    return NextResponse.json({
      success: true,
      count: sorted.length,
      failures: failures.length,
      cachedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[cron/refresh-activity-feed] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
