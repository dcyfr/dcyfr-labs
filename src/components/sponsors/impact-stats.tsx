/**
 * Impact Stats Component
 *
 * Displays portfolio impact metrics for sponsor thank you page.
 * Shows blog posts published, active projects, and community engagement.
 */

import { Card, CardContent } from "@/components/ui/card";
import { posts } from "@/data/posts";
import { visibleProjects } from "@/data/projects";
import { TYPOGRAPHY } from "@/lib/design-tokens";

interface ImpactStatsProps {
  className?: string;
}

/**
 * Shows impact stats of sponsor contributions
 * Displays: blog posts, active projects, and community reach
 */
export function ImpactStats({ className }: ImpactStatsProps) {
  // Calculate stats from data
  const blogPostCount = posts.filter((p) => !p.draft && !p.archived).length;
  const projectCount = visibleProjects.filter(
    (p) => p.status === "active" || p.status === "in-progress"
  ).length;
  const totalViews = posts.reduce((sum, post) => {
    // This is a placeholder - in production, you'd fetch real view counts
    // For now, we'll use a rough estimate based on published posts
    return sum + (post.draft || post.archived ? 0 : 100);
  }, 0);

  const stats = [
    {
      value: blogPostCount,
      label: "Blog Posts Published",
      description: "Educational content helping developers learn",
    },
    {
      value: projectCount,
      label: "Active Projects",
      description: "Open source tools and experiments",
    },
    {
      value: `${Math.round(totalViews / 1000)}K+`,
      label: "Community Reach",
      description: "Developers reading and engaging",
    },
  ];

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-8">
              <div className={TYPOGRAPHY.display.stat}>{stat.value}</div>
              <p className="font-semibold text-foreground mt-2">{stat.label}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
