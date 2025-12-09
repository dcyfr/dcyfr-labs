"use client"
/**
 * DevBanner
 *
 * Displays a dismissible development banner across the top of the site when
 * running in development. The dismissed state is preserved only for the
 * duration of the browser session (sessionStorage).
 */
import { useState } from "react";
import { X } from "lucide-react";
import { CONTAINER_WIDTHS, CONTAINER_PADDING, SEMANTIC_COLORS } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "dev-banner-dismissed";

export function DevBanner() {
  const persistAcrossSessions = process.env.NEXT_PUBLIC_DEV_BANNER_PERSIST === 'true';

  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true; // server / SSR
    try {
      const storage = persistAcrossSessions ? localStorage : sessionStorage;
      return storage.getItem(STORAGE_KEY) !== "true";
    } catch (err) {
      return true;
    }
  });

  const handleClose = () => {
    try {
      const storage = persistAcrossSessions ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY, "true");
    } catch (err) {
      // ignore
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div role="region" aria-label="Dev Banner" className={cn("mx-auto", CONTAINER_WIDTHS.content, CONTAINER_PADDING, "pt-4")}>
      <div className={cn("rounded-lg p-3 flex items-center justify-between", SEMANTIC_COLORS.alert.info.border, SEMANTIC_COLORS.alert.info.container)}>
        <div className="flex items-center gap-3">
          <strong className={cn("text-sm", SEMANTIC_COLORS.alert.info.text)}>DEV MODE</strong>
          <span className={cn("text-sm", SEMANTIC_COLORS.alert.info.text)}>
            This site is running in development. Some features or content may not be present in production.
          </span>
        </div>

        <button
          aria-label="Close Dev Banner"
          className={cn("p-2 rounded-md hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1", SEMANTIC_COLORS.alert.info.icon)}
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
