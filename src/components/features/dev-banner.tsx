"use client"
/**
 * DevBanner
 *
 * Displays a dismissible development banner with fade animations when
 * running in development. The dismissed state is preserved only for the
 * duration of the browser session (sessionStorage).
 * 
 * Positioned absolutely to avoid shifting the header navigation.
 */
import { useState, useRef, useLayoutEffect } from "react";
import { X } from "lucide-react";
import { CONTAINER_WIDTHS, CONTAINER_PADDING, SEMANTIC_COLORS, ANIMATION } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "dev-banner-dismissed";

export function DevBanner() {
  const persistAcrossSessions = process.env.NEXT_PUBLIC_DEV_BANNER_PERSIST === 'true';

  // Initialize to true for server-rendered and initial client hydration to
  // avoid hydration mismatches. The real value is read on mount (useEffect)
  // and the state adjusted accordingly.
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleClose = () => {
    setIsAnimating(true);
    // Wait for fade out animation to complete
    setTimeout(() => {
      try {
        const storage = persistAcrossSessions ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEY, "true");
      } catch (err) {
        // ignore
      }
      setIsOpen(false);
      setIsAnimating(false);
    }, 200); // Match animation duration
  };
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Attach a native click event handler as a fallback for environments
  // where synthetic React events may not fire as expected (e.g., some E2E runners)
  // Use a callback ref to ensure the handler is attached/unattached as the
  // button mounts/unmounts during the component's lifecycle.
  const setCloseButtonRef = (el: HTMLButtonElement | null) => {
    if (closeButtonRef.current) {
      closeButtonRef.current.removeEventListener('click', handleClose);
    }
    closeButtonRef.current = el;
    if (el) {
      el.addEventListener('click', handleClose);
    }
  };

  // Read the storage on mount and update `isOpen` to reflect the user's
  // persisted dismissal preference. We do this in an effect to avoid
  // hydration mismatch with the server-rendered visible banner.
  useLayoutEffect(() => {
    try {
      const storage = persistAcrossSessions ? localStorage : sessionStorage;
      const dismissed = storage.getItem(STORAGE_KEY) === 'true';
      // It's safe to synchronously set the state here on mount to reflect the
      // persisted dismissal preference. This avoids a flash of content during
      // hydration and ensures client state reflects persisted storage.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (dismissed && isOpen) setIsOpen(false);
    } catch (err) {
      // ignore storage access errors and keep banner visible
    }
  }, [persistAcrossSessions, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="Dev Banner"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 pointer-events-none",
        "transition-opacity",
        ANIMATION.duration.standard,
        isAnimating ? "opacity-0" : "opacity-100"
      )}
    >
      <div className={cn("mx-auto", CONTAINER_WIDTHS.content, CONTAINER_PADDING, "pt-4")}>
        <div className={cn("rounded-lg p-3 flex items-center justify-between pointer-events-auto", SEMANTIC_COLORS.alert.info.border, SEMANTIC_COLORS.alert.info.container)}>
          <div className="flex items-center gap-3">
            <strong className={cn("text-sm", SEMANTIC_COLORS.alert.info.text)}>DEV Mode</strong>
            <span className={cn("text-sm", SEMANTIC_COLORS.alert.info.text)}>
              This is a development build of the site. Features here may be unstable or incomplete.
            </span>
          </div>

          <button
            type="button"
            aria-label="Close Dev Banner"
            className={cn("p-2 rounded-md hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1", SEMANTIC_COLORS.alert.info.icon)}
            data-testid="dev-banner-close"
            onClick={handleClose}
            onPointerDown={handleClose}
            ref={setCloseButtonRef}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
