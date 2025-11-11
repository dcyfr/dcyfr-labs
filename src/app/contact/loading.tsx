import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { PageLayout } from "@/components/layouts/page-layout";
import { PAGE_LAYOUT, SPACING } from "@/lib/design-tokens";

/**
 * Loading state for contact page.
 * Matches the structure of the refactored contact page with hero and form.
 */
export default function Loading() {
  return (
    <PageLayout>
      {/* Hero Section Skeleton */}
      <section className={PAGE_LAYOUT.hero.container}>
        <div className={PAGE_LAYOUT.hero.content}>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-full max-w-2xl" />
          <Skeleton className="h-6 w-4/5 max-w-2xl" />
        </div>
      </section>

      {/* Contact Form Section */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <Card className="p-6">
            <div className="space-y-6">
              {/* Name field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Email field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Message field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-32 w-full" />
              </div>
              {/* Submit button */}
              <Skeleton className="h-10 w-32" />
            </div>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
