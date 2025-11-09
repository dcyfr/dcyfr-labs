import Link from "next/link";
import { CONTAINER_WIDTHS, CONTAINER_VERTICAL_PADDING, CONTAINER_PADDING, TYPOGRAPHY } from "@/lib/design-tokens";

export default function NotFound() {
  return (
    <div className={`mx-auto ${CONTAINER_WIDTHS.narrow} ${CONTAINER_VERTICAL_PADDING} ${CONTAINER_PADDING} text-center`}>
      <h1 className={TYPOGRAPHY.h1.standard}>Page not found</h1>
      <p className="mt-2 text-lg md:text-xl text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
      <div className="mt-6">
        <Link href="/" className="underline underline-offset-4">Go home</Link>
      </div>
    </div>
  );
}
