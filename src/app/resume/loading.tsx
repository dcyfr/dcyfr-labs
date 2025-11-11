import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { PageLayout } from "@/components/layouts/page-layout";
import { PAGE_LAYOUT, SPACING } from "@/lib/design-tokens";

/**
 * Loading state for resume page.
 * Matches the structure of the refactored resume page with experience, education, and skills sections.
 */
export default function Loading() {
  return (
    <PageLayout>
      {/* Hero Section Skeleton */}
      <section className={PAGE_LAYOUT.hero.container}>
        <div className={PAGE_LAYOUT.hero.content}>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-full max-w-3xl" />
          <Skeleton className="h-6 w-4/5 max-w-3xl" />
        </div>
      </section>

      {/* Experience Section */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-4 w-32 mt-1 md:mt-0" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Certifications Section */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <Skeleton className="h-5 w-40 mb-3" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <Skeleton className="h-8 w-24 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-20" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
