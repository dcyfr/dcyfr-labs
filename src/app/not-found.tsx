import Link from "next/link";
import { TYPOGRAPHY, PAGE_LAYOUT } from "@/lib/design-tokens";
import { PageLayout } from "@/components/layouts/page-layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageLayout>
      <section className={PAGE_LAYOUT.hero.container}>
        <div className={`${PAGE_LAYOUT.hero.content} text-center`}>
          <h1 className={TYPOGRAPHY.h1.standard}>Page not found</h1>
          <p className={TYPOGRAPHY.description}>
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <div className="pt-2">
            <Button asChild>
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
