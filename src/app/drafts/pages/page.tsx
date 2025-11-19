/**
 * Draft Pages Overview - Developer Tools
 * 
 * Lists all draft pages in the application for easy discovery and testing
 * during development. Only accessible in development mode.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHero } from "@/components/layouts/page-hero";
import { createPageMetadata } from "@/lib/metadata";
import { SPACING, PAGE_LAYOUT } from "@/lib/design-tokens";
import { assertDevOr404 } from "@/lib/dev-only";

export const metadata: Metadata = createPageMetadata({
  title: "Draft Pages",
  description: "Overview of all draft pages in development",
  path: "/drafts/pages",
});

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface DraftPage {
  slug: string;
  title: string;
  description: string;
  path: string;
}

// Registry of all draft pages in the application
const DRAFT_PAGES: DraftPage[] = [
  {
    slug: "team",
    title: "Team",
    description: "Meet the dynamic duo: Drew and DCYFR, building secure and innovative solutions together.",
    path: "/team",
  },
  // Add more draft pages here as they are created
];

export default function DraftPagesOverview() {
  // Only allow in development
  assertDevOr404();

  return (
    <PageLayout>
      <PageHero
        title="Draft Pages"
        description="Overview of all draft pages in the application. These pages are only visible in development and will not render in preview or production environments."
        image={
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <Badge variant="secondary">Development Only</Badge>
          </div>
        }
      />

      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.subsection}>

        {/* Draft Pages List */}
        {DRAFT_PAGES.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No draft pages found. Add draft pages to this registry to see them here.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {DRAFT_PAGES.map((page) => (
              <Card key={page.slug}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {page.path}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">Draft</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {page.description}
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link href={page.path}>
                      View Page
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-base">About Draft Pages</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Draft pages use the <code className="px-1 py-0.5 rounded bg-muted">IS_DRAFT</code> flag
              and are automatically excluded from production builds.
            </p>
            <p>
              To create a new draft page, set <code className="px-1 py-0.5 rounded bg-muted">const IS_DRAFT = true</code>
              at the top of your page component and add a check to return null in non-development environments.
            </p>
          </CardContent>
        </Card>
        </div>
      </section>
    </PageLayout>
  );
}
