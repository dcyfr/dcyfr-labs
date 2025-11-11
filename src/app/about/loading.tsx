import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { PageLayout } from "@/components/layouts/page-layout";
import { PAGE_LAYOUT, SPACING } from "@/lib/design-tokens";

/**
 * Loading state for about page.
 * Matches the structure of the refactored about page with stats, skills, and certifications.
 */
export default function Loading() {
  return (
    <PageLayout>
      {/* Hero Section Skeleton */}
      <section className={PAGE_LAYOUT.hero.container}>
        <div className={PAGE_LAYOUT.hero.content}>
          <div className="flex items-center gap-4 md:gap-6">
            <Skeleton className="h-20 w-20 md:h-24 md:w-24 rounded-full" />
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-6 w-full max-w-2xl" />
          <Skeleton className="h-6 w-4/5 max-w-2xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-5 w-5 mb-3" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-full" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections (About Me, Professional Background, etc.) */}
      {Array.from({ length: 5 }).map((_, i) => (
        <section key={i} className={PAGE_LAYOUT.section.container}>
          <div className={SPACING.content}>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </section>
      ))}

      {/* Social Links Section */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
