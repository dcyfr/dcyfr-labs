"use client";

import * as React from "react";
import { ZoomIn } from "lucide-react";
import { ANIMATION, BORDERS, SHADOWS } from "@/lib/design-tokens";

/**
 * ZoomableImage Component
 * 
 * Wraps an img element to provide click-to-zoom functionality.
 * Shows a zoom icon on hover and opens a full-screen lightbox on click.
 * 
 * @component
 * @param {Object} props - Image element props
 * @returns {React.ReactElement} Interactive zoomable image wrapper
 * 
 * @features
 * - Click to view image in full-screen modal
 * - Hover icon indicates zoom capability
 * - Escape key and click outside to close
 * - Smooth fade-in/out transitions
 * - Accessible with keyboard navigation
 * 
 * @example
 * <ZoomableImage src="/image.jpg" alt="Description" />
 */
export function ZoomableImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Handle escape key to close
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="relative group inline-block cursor-zoom-in w-full">
      {/* Image with hover zoom indicator */}
      {/* eslint-disable-next-line @next/next/no-img-element -- Native img required for zoom functionality */}
      <img
        {...props}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Zoom image: ${props.alt || 'image'}`}
      />
      
      {/* Zoom icon overlay on hover */}
      <span className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 ${ANIMATION.transition.theme} flex items-center justify-center pointer-events-none ${BORDERS.card}`}>
        <span className={`opacity-0 group-hover:opacity-100 ${ANIMATION.transition.theme} bg-black/60 backdrop-blur-sm ${BORDERS.circle} p-3`}>
          <ZoomIn className="w-6 h-6 text-white" aria-hidden="true" />
        </span>
      </span>

      {/* Full-screen modal */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in ${ANIMATION.duration.fast}`}
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close zoomed image"
        >
          <div className="relative max-w-[95vw] max-h-[95vh] p-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- Native img required for zoom functionality */}
            <img
              src={props.src}
              alt={props.alt}
              className={`max-w-full max-h-[90vh] object-contain ${BORDERS.card} ${SHADOWS.xl} cursor-zoom-out`}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />
            
            {/* Close hint */}
            <div className={`absolute top-6 right-6 bg-black/60 backdrop-blur-sm ${BORDERS.circle} px-4 py-2 text-white text-sm pointer-events-none`}>
              Click or press ESC to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ZoomableImage.displayName = "ZoomableImage";
