import type { ProjectImage } from "@/data/projects";

/**
 * Default Project Image Variants
 * 
 * Pre-designed fallback images for projects without custom featured images.
 * Each variant has a unique color scheme and pattern overlay:
 * - code: Red gradient with dot pattern
 * - tech: Blue gradient with circuit pattern
 * - design: Green gradient with grid pattern
 * - startup: Violet gradient with wave pattern
 * - nonprofit: Indigo gradient with hexagon pattern
 * - general: Orange gradient with line pattern
 * 
 * All images support automatic light/dark mode via CSS custom properties.
 */
export const DEFAULT_PROJECT_IMAGES = {
  code: {
    url: "/images/projects/code.svg",
    alt: "Default code project background with red gradient and dot pattern",
    position: "center" as const,
  },
  tech: {
    url: "/images/projects/tech.svg",
    alt: "Default tech project background with blue gradient and circuit pattern",
    position: "center" as const,
  },
  design: {
    url: "/images/projects/design.svg",
    alt: "Default design project background with green gradient and grid pattern",
    position: "center" as const,
  },
  startup: {
    url: "/images/projects/startup.svg",
    alt: "Default startup project background with violet gradient and wave pattern",
    position: "center" as const,
  },
  nonprofit: {
    url: "/images/projects/nonprofit.svg",
    alt: "Default nonprofit project background with indigo gradient and hexagon pattern",
    position: "center" as const,
  },
  general: {
    url: "/images/projects/general.svg",
    alt: "Default project background with orange gradient and line pattern",
    position: "center" as const,
  },
} as const;

export type DefaultProjectImageVariant = keyof typeof DEFAULT_PROJECT_IMAGES;

/**
 * Get a default image for a project based on tags
 * 
 * Selection priority:
 * 1. Explicit variant parameter
 * 2. Project tags and tech stack (code/tech/design/startup/nonprofit)
 * 3. General variant as fallback
 * 
 * @param options - Project metadata for selecting appropriate default
 * @returns ProjectImage object with default image data
 * 
 * @example
 * const defaultImg = getDefaultProjectImage({ 
 *   tags: ["web-development", "typescript"]
 * }); // Returns tech variant
 * 
 * @example
 * const startupImg = getDefaultProjectImage({
 *   tags: ["entrepreneurship", "mvp"]
 * }); // Returns startup variant
 */
export function getDefaultProjectImage(options?: {
  tags?: string[];
  tech?: string[];
  variant?: DefaultProjectImageVariant;
}): ProjectImage {
  // If variant explicitly specified, use it
  if (options?.variant) {
    return DEFAULT_PROJECT_IMAGES[options.variant];
  }

  // Combine tags and tech for analysis
  const allTags = [
    ...(options?.tags || []),
    ...(options?.tech || []),
  ].map((t) => t.toLowerCase());

  // Code/programming content → code variant (red)
  if (allTags.some((t) => 
    ["code", "programming", "algorithm", "software", "development",
     "coding", "engineer", "developer"].includes(t.toLowerCase())
  )) {
    return DEFAULT_PROJECT_IMAGES.code;
  }

  // Tech/infrastructure content → tech variant (blue)
  if (allTags.some((t) => 
    ["javascript", "typescript", "react", "vue", "angular", "node", "python", 
     "java", "web development", "api", "backend", "frontend",
     "next.js", "tailwind", "css", "html", "infrastructure", "cloud",
     "devops", "database"].includes(t.toLowerCase())
  )) {
    return DEFAULT_PROJECT_IMAGES.tech;
  }

  // Design/UI content → design variant (green)
  if (allTags.some((t) => 
    ["design", "ui", "ux", "graphic design", "branding", "visual",
     "illustration", "figma", "sketch", "adobe", "creative"].includes(t.toLowerCase())
  )) {
    return DEFAULT_PROJECT_IMAGES.design;
  }

  // Startup/entrepreneurship content → startup variant (violet)
  if (allTags.some((t) => 
    ["startup", "mvp", "entrepreneurship", "venture", "innovation",
     "founder", "business", "saas", "product"].includes(t.toLowerCase())
  )) {
    return DEFAULT_PROJECT_IMAGES.startup;
  }

  // Nonprofit/community content → nonprofit variant (indigo)
  if (allTags.some((t) => 
    ["nonprofit", "non-profit", "charity", "community", "social impact",
     "volunteer", "civic", "public service", "ngo"].includes(t.toLowerCase())
  )) {
    return DEFAULT_PROJECT_IMAGES.nonprofit;
  }

  // Default to general for other content (orange)
  return DEFAULT_PROJECT_IMAGES.general;
}

/**
 * Ensure a project has a featured image, using default if needed
 * 
 * @param image - Optional image from project data
 * @param fallbackOptions - Options for selecting default image
 * @returns ProjectImage object (custom or default)
 * 
 * @example
 * const featuredImage = ensureProjectImage(project.image, {
 *   tags: project.tags,
 *   tech: project.tech
 * });
 */
export function ensureProjectImage(
  image: ProjectImage | undefined,
  fallbackOptions?: Parameters<typeof getDefaultProjectImage>[0]
): ProjectImage {
  return image || getDefaultProjectImage(fallbackOptions);
}
