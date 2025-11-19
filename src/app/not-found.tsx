import Link from "next/link";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHero } from "@/components/layouts/page-hero";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageLayout>
      <PageHero
        title="Page not found"
        description="The page you're looking for doesn't exist."
        align="center"
        actions={
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
        }
      />
    </PageLayout>
  );
}
