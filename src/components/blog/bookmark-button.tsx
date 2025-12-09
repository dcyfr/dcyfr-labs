"use client";

import * as React from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBookmarks } from "@/hooks/use-bookmarks";

interface BookmarkButtonProps {
  slug: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  className?: string;
}

/**
 * Bookmark Button Component
 * 
 * Reusable button for bookmarking posts. Uses centralized useBookmarks hook
 * for state management and localStorage persistence.
 * 
 * Features:
 * - Visual feedback (filled icon when bookmarked)
 * - Toast notifications on toggle
 * - Configurable appearance (variant, size, label)
 * - Accessible (proper ARIA labels)
 * 
 * @example
 * ```tsx
 * // Icon only (for cards)
 * <BookmarkButton slug="my-post" size="icon" variant="ghost" />
 * 
 * // With label (for sidebars)
 * <BookmarkButton slug="my-post" showLabel />
 * ```
 */
export function BookmarkButton({
  slug,
  variant = "ghost",
  size = "icon",
  showLabel = false,
  className,
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is inside a link
    e.stopPropagation(); // Prevent parent click handlers
    
    toggleBookmark(slug);
    
    toast.success(
      bookmarked ? "Bookmark removed" : "Bookmarked for later",
      {
        duration: 2000,
      }
    );
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(className)}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark post"}
      title={bookmarked ? "Remove bookmark" : "Bookmark post"}
    >
      <Bookmark 
        className={cn(
          "h-4 w-4",
          bookmarked && "fill-current"
        )} 
      />
      {showLabel && (
        <span className="ml-2">
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </span>
      )}
    </Button>
  );
}
