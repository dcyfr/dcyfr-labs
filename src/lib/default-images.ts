import type { PostImage } from "@/data/posts";

/**
 * Default Blog Image Variants
 * 
 * Pre-designed fallback images for blog posts without custom featured images.
 * Each variant has a unique style to provide visual variety.
 */
export const DEFAULT_IMAGES = {
  gradient: {
    url: "/blog/images/default/hero.svg",
    alt: "Default blog post featured image with gradient background",
  },
  minimal: {
    url: "/blog/images/default/minimal.svg",
    alt: "Minimal dark blog post featured image with code icon",
  },
  geometric: {
    url: "/blog/images/default/geometric.svg",
    alt: "Geometric pattern blog post featured image",
  },
} as const;

export type DefaultImageVariant = keyof typeof DEFAULT_IMAGES;

/**
 * Get a default image for a blog post based on various factors
 * 
 * Selection priority:
 * 1. Post title hash (deterministic based on title)
 * 2. Post tags (tech/code gets minimal, design gets geometric)
 * 3. Random variant
 * 
 * @param options - Post metadata for selecting appropriate default
 * @returns PostImage object with default image data
 * 
 * @example
 * const defaultImg = getDefaultBlogImage({ 
 *   title: "My Post",
 *   tags: ["react", "typescript"]
 * });
 */
export function getDefaultBlogImage(options?: {
  title?: string;
  tags?: string[];
  variant?: DefaultImageVariant;
}): PostImage {
  // If variant explicitly specified, use it
  if (options?.variant) {
    return DEFAULT_IMAGES[options.variant];
  }

  // Select based on tags
  if (options?.tags && options.tags.length > 0) {
    const tags = options.tags.map((t) => t.toLowerCase());
    
    // Tech/code content → minimal (dark with code icon)
    if (tags.some((t) => ["javascript", "typescript", "react", "node", "code", "programming"].includes(t))) {
      return DEFAULT_IMAGES.minimal;
    }
    
    // Design/UI content → geometric
    if (tags.some((t) => ["design", "ui", "ux", "css", "tailwind", "styling"].includes(t))) {
      return DEFAULT_IMAGES.geometric;
    }
    
    // Default to gradient for other content
    return DEFAULT_IMAGES.gradient;
  }

  // Hash title to get consistent variant for same title
  if (options?.title) {
    const hash = options.title.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const variants = Object.keys(DEFAULT_IMAGES) as DefaultImageVariant[];
    const index = Math.abs(hash) % variants.length;
    return DEFAULT_IMAGES[variants[index]];
  }

  // Fallback to gradient
  return DEFAULT_IMAGES.gradient;
}

/**
 * Get dynamic default image URL from API endpoint
 * 
 * Uses the OG image generation API to create a custom default image
 * with the post title overlaid on a styled background.
 * 
 * @param title - Post title to display on image
 * @param style - Visual style (gradient, minimal, geometric)
 * @returns PostImage object with API URL
 * 
 * @example
 * const dynamicImg = getDynamicDefaultImage(
 *   "Getting Started with Next.js",
 *   "gradient"
 * );
 */
export function getDynamicDefaultImage(
  title: string,
  style: "gradient" | "minimal" | "geometric" = "gradient"
): PostImage {
  const params = new URLSearchParams({
    title,
    style,
  });

  return {
    url: `/api/default-blog-image?${params.toString()}`,
    alt: `${title} - Blog post featured image`,
  };
}

/**
 * Ensure a post has a featured image, using default if needed
 * 
 * @param image - Optional image from post frontmatter
 * @param fallbackOptions - Options for selecting default image
 * @returns PostImage object (custom or default)
 * 
 * @example
 * const featuredImage = ensurePostImage(post.image, {
 *   title: post.title,
 *   tags: post.tags
 * });
 */
export function ensurePostImage(
  image: PostImage | undefined,
  fallbackOptions?: Parameters<typeof getDefaultBlogImage>[0]
): PostImage {
  return image || getDefaultBlogImage(fallbackOptions);
}
