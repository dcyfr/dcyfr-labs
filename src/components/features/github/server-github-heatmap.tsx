/**
 * Server GitHub Heatmap Component
 * 
 * Server-side rendered GitHub contribution heatmap that fetches data
 * directly from Redis cache without exposing public API endpoints.
 * This component fetches data server-side and passes it to the client component.
 */

import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { GitHubHeatmapSkeleton } from "@/components/common";
import { getGitHubContributions } from "@/lib/github-data";
import { ClientGitHubHeatmap } from "./calendar-heatmap-client";

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
  username = "dcyfr",
  showWarning = true 
}: ServerGitHubHeatmapProps) {
  // Fetch data server-side from Redis cache
  let data;
  let hasError = false;
  
  try {
    data = await getGitHubContributions(username);
  } catch (error) {
    console.error('[ServerGitHubHeatmap] Failed to load data:', error);
    hasError = true;
  }
  
  // Return appropriate JSX based on data fetch result
  if (hasError) {
    return (
      <Card className="p-4">
        <GitHubHeatmapSkeleton />
      </Card>
    );
  }
  
  return (
    <Card className="p-4">
      <Suspense fallback={<GitHubHeatmapSkeleton />}>
        <ClientGitHubHeatmap 
          data={data}
          username={username}
          showWarning={showWarning}
        />
      </Suspense>
    </Card>
  );
}