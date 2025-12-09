/**
 * DraftBanner - Notification banner for draft pages
 * 
 * Displays a prominent banner indicating that a page is in draft mode
 * and only visible in development environments. Automatically integrated
 * into PageLayout when isDraft prop is true.
 * 
 * Uses dashboard width to match SiteHeader width for visual consistency.
 * 
 * @example
 * ```tsx
 * <PageLayout isDraft>
 *   {children}
 * </PageLayout>
 * ```
 */

import { AlertCircle } from "lucide-react";
import { CONTAINER_WIDTHS, CONTAINER_PADDING, SEMANTIC_COLORS } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export function DraftBanner() {
  return (
    <div className={cn("mx-auto", CONTAINER_WIDTHS.content, CONTAINER_PADDING, "pt-6")}>
      <div className={cn("rounded-lg p-4", SEMANTIC_COLORS.alert.warning.border, SEMANTIC_COLORS.alert.warning.container)}>
        <div className="flex items-start gap-3">
          <AlertCircle className={cn("h-5 w-5 mt-0.5 shrink-0", SEMANTIC_COLORS.alert.warning.icon)} />
          <div className="flex-1">
            <p className={cn("text-sm", SEMANTIC_COLORS.alert.warning.text)}>
              <strong className="font-semibold">Draft Page</strong> — This page is only visible in development and will not render in preview or production environments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
