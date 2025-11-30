"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Share2, Bookmark, Link2, Linkedin } from "lucide-react";
import { toast } from "sonner";

interface PostQuickActionsProps {
  slug?: string;
  postTitle?: string;
}

/**
 * Post Quick Actions Section
 * 
 * Provides bookmark, share, copy link, and LinkedIn share buttons.
 */
export function PostQuickActions({ slug, postTitle }: PostQuickActionsProps) {
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  // Check if post is bookmarked on mount
  React.useEffect(() => {
    if (typeof window === "undefined" || !slug) return;
    const bookmarks = JSON.parse(localStorage.getItem("bookmarked-posts") || "[]");
    setIsBookmarked(bookmarks.includes(slug));
  }, [slug]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = postTitle || "Check out this article";

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        toast.success("Shared successfully!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await copyToClipboard(url);
        }
      }
    } else {
      await copyToClipboard(url);
    }
  };

  const handleCopyLink = async () => {
    await copyToClipboard(window.location.href);
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(window.location.href);
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  const handleBookmark = () => {
    if (!slug) return;
    
    const bookmarks = JSON.parse(localStorage.getItem("bookmarked-posts") || "[]");
    const newBookmarks = isBookmarked
      ? bookmarks.filter((s: string) => s !== slug)
      : [...bookmarks, slug];
    
    localStorage.setItem("bookmarked-posts", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Bookmark removed" : "Bookmarked for later");
  };

  return (
    <div className="space-y-2 pb-6 border-b">
      <h2 className="font-semibold mb-3 text-sm">Quick Actions</h2>

      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2"
        onClick={handleBookmark}
      >
        <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
        {isBookmarked ? "Bookmarked" : "Bookmark"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2"
        onClick={handleCopyLink}
      >
        <Link2 className="h-4 w-4" />
        Copy Link
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2"
        onClick={handleLinkedInShare}
      >
        <Linkedin className="h-4 w-4" />
        Share on LinkedIn
      </Button>
    </div>
  );
}
