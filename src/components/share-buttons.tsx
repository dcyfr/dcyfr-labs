"use client";

import { useState, useEffect } from "react";
import { Share2, Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * ShareButtons Component
 * 
 * A reusable component for sharing blog posts on social media platforms.
 * Provides buttons for Twitter, LinkedIn, native sharing, and copy-to-clipboard.
 * 
 * Features:
 * - Native Web Share API on mobile devices (when available)
 * - Twitter share with pre-filled text and hashtags
 * - LinkedIn share with URL
 * - Copy link to clipboard with visual feedback
 * - Responsive design - icon-only on mobile, text+icon on desktop
 * - Touch-friendly 44px button size on mobile
 * - Toast notifications for user feedback
 * - Accessible with proper ARIA labels and keyboard navigation
 * 
 * @param props.url - The full URL to share (e.g., https://example.com/blog/post-slug)
 * @param props.title - The title of the content being shared
 * @param props.tags - Optional array of tags to include as Twitter hashtags
 * 
 * @example
 * ```tsx
 * <ShareButtons
 *   url="https://example.com/blog/my-post"
 *   title="My Awesome Blog Post"
 *   tags={["react", "nextjs"]}
 * />
 * ```
 */
interface ShareButtonsProps {
  url: string;
  title: string;
  tags?: string[];
}

export function ShareButtons({ url, title, tags = [] }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  // Check if Web Share API is available (typically on mobile)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      setCanShare(true);
    }
  }, []);

  /**
   * Handle native Web Share API
   * Falls back to traditional sharing if not available
   */
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this post: ${title}`,
          url: url,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        // User cancelled the share dialog or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast.error("Failed to share");
        }
      }
    }
  };

  /**
   * Generate Twitter share URL with encoded parameters
   * Includes title, URL, and up to 3 relevant hashtags
   */
  const getTwitterShareUrl = () => {
    const text = title;
    // Take first 3 tags and clean them for hashtags (remove spaces, special chars)
    const hashtags = tags
      .slice(0, 3)
      .map(tag => tag.replace(/[^a-zA-Z0-9]/g, ''))
      .join(',');
    
    const params = new URLSearchParams({
      text,
      url,
      ...(hashtags && { hashtags }),
    });
    
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  };

  /**
   * Generate LinkedIn share URL
   * LinkedIn doesn't support pre-filled text, only URL
   */
  const getLinkedInShareUrl = () => {
    const params = new URLSearchParams({ url });
    return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
  };

  /**
   * Copy URL to clipboard with fallback for older browsers
   * Shows success toast and temporary check icon
   */
  const handleCopyLink = async () => {
    try {
      // Modern Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopied(true);
      toast.success("Link copied to clipboard!");
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error("Failed to copy link");
    }
  };

  /**
   * Open share URL in a popup window for better UX
   * Falls back to new tab if popup is blocked
   */
  const handleShare = (shareUrl: string, platform: string) => {
    try {
      const popup = window.open(
        shareUrl,
        `share-${platform}`,
        'width=600,height=400,toolbar=no,menubar=no,resizable=yes'
      );
      
      // Fallback if popup is blocked
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error(`Failed to open ${platform} share:`, error);
      // Final fallback
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Share2 className="h-4 w-4" aria-hidden="true" />
        <span>Share this post</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Native Share Button (Mobile only) */}
        {canShare && (
          <Button
            variant="outline"
            size="default"
            onClick={handleNativeShare}
            className="gap-2 h-11 md:h-10"
            aria-label="Share via native share menu"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        )}

        {/* Copy Link Button */}
        <Button
          variant="outline"
          size="default"
          onClick={handleCopyLink}
          className={cn("gap-2 h-11 md:h-10", copied && "text-green-600 dark:text-green-400")}
          aria-label="Copy link to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <LinkIcon className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">
            {copied ? "Copied!" : "Copy Link"}
          </span>
        </Button>

        {/* Twitter Share Button */}
        <Button
          variant="outline"
          size="default"
          onClick={() => handleShare(getTwitterShareUrl(), 'twitter')}
          className="gap-2 h-11 md:h-10"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Twitter</span>
        </Button>

        {/* LinkedIn Share Button */}
        <Button
          variant="outline"
          size="default"
          onClick={() => handleShare(getLinkedInShareUrl(), 'linkedin')}
          className="gap-2 h-11 md:h-10"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">LinkedIn</span>
        </Button>
      </div>
    </div>
  );
}
