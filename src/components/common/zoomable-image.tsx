"use client";

import * as React from "react";
import { ZoomIn } from "lucide-react";

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
      <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center pointer-events-none rounded-lg">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 backdrop-blur-sm rounded-full p-3">
          <ZoomIn className="w-6 h-6 text-white" aria-hidden="true" />
        </span>
      </span>

      {/* Full-screen modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
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
            <img
              src={props.src}
              alt={props.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-zoom-out"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />
            
            {/* Close hint */}
            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm pointer-events-none">
              Click or press ESC to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ZoomableImage.displayName = "ZoomableImage";
