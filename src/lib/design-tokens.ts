/**
 * Design Tokens - Single Source of Truth for Design Decisions
 * 
 * This file centralizes all design decisions to ensure consistency across the site.
 * Use these constants instead of magic strings in components.
 * 
 * @see /docs/design/ux-ui-consistency-analysis.md for rationale and usage guidelines
 */

// ============================================================================
// CONTAINER WIDTHS
// ============================================================================

/**
 * Semantic container width patterns based on content type
 * 
 * @example
 * ```tsx
 * <div className={`mx-auto ${CONTAINER_WIDTHS.prose} ${CONTAINER_PADDING}`}>
 *   {content}
 * </div>
 * ```
 */
export const CONTAINER_WIDTHS = {
  /** Long-form content optimized for reading (blog posts, about page) */
  prose: "max-w-2xl",
  
  /** Standard width for list/grid pages (blog listing, projects) */
  standard: "max-w-4xl",
  
  /** Narrow width for forms and focused content (contact page) */
  narrow: "max-w-xl",
  
  /** Wide width for data-heavy pages (dashboards, analytics, tables) */
  dashboard: "max-w-6xl",
} as const;

/**
 * Standard horizontal padding for all containers
 * Provides consistent edge spacing across breakpoints
 */
export const CONTAINER_PADDING = "px-4 sm:px-6 md:px-8" as const;

/**
 * Standard vertical padding for page containers
 * Provides consistent top/bottom spacing
 */
export const CONTAINER_VERTICAL_PADDING = "py-14 md:py-20" as const;

/**
 * Utility function to build complete container classes
 * 
 * @param width - Container width variant
 * @returns Complete className string with centering, width, and padding
 * 
 * @example
 * ```tsx
 * <div className={getContainerClasses('prose')}>
 *   <article>{content}</article>
 * </div>
 * ```
 */
export function getContainerClasses(
  width: keyof typeof CONTAINER_WIDTHS = 'standard'
): string {
  return `mx-auto ${CONTAINER_WIDTHS[width]} ${CONTAINER_VERTICAL_PADDING} ${CONTAINER_PADDING}`;
}

// ============================================================================
// TYPOGRAPHY
// ============================================================================

/**
 * Typography patterns for consistent heading hierarchy and text styles
 * 
 * @example
 * ```tsx
 * <h1 className={TYPOGRAPHY.h1.standard}>Page Title</h1>
 * <p className={TYPOGRAPHY.description}>Page description</p>
 * ```
 */
export const TYPOGRAPHY = {
  /** H1 heading variants for different contexts */
  h1: {
    /** Standard page titles (about, projects, contact, blog listing) */
    standard: "font-serif text-3xl md:text-4xl font-semibold tracking-tight",
    
    /** Homepage hero section */
    hero: "font-serif text-3xl md:text-4xl font-semibold tracking-tight",
    
    /** Blog post titles (larger, more prominent) */
    article: "font-serif text-3xl md:text-5xl font-semibold tracking-tight leading-tight",
  },
  
  /** H2 heading variants */
  h2: {
    /** Standard section headings */
    standard: "font-serif text-xl md:text-2xl font-medium",
  },
  
  /** H3 heading variants */
  h3: {
    /** Standard subsection headings */
    standard: "font-serif text-lg md:text-xl font-medium",
  },
  
  /** Lead text / page descriptions */
  description: "text-lg md:text-xl text-muted-foreground",
  
  /** Metadata text (dates, reading time, etc.) */
  metadata: "text-sm text-muted-foreground",
  
  /** Body text for long-form content */
  body: "text-base text-foreground leading-relaxed",
} as const;

// ============================================================================
// SPACING
// ============================================================================

/**
 * Spacing patterns for consistent vertical rhythm
 * 
 * @example
 * ```tsx
 * <div className={SPACING.section}>
 *   <section>...</section>
 *   <section>...</section>
 * </div>
 * ```
 */
export const SPACING = {
  /** Between major page sections (largest gaps) */
  section: "space-y-10 md:space-y-12",
  
  /** Between related content blocks within a section */
  subsection: "space-y-6 md:space-y-8",
  
  /** Within content blocks (tightest spacing) */
  content: "space-y-4",
  
  /** Page hero/header sections with prose wrapper */
  proseHero: "prose space-y-4",
  
  /** Generic prose sections */
  proseSection: "prose space-y-4",
} as const;

// ============================================================================
// HOVER EFFECTS
// ============================================================================

/**
 * Hover effect patterns for interactive elements
 * Ensures consistent feedback across different component types
 * 
 * @example
 * ```tsx
 * <Card className={HOVER_EFFECTS.card}>
 *   {content}
 * </Card>
 * ```
 */
export const HOVER_EFFECTS = {
  /** Standard card hover (projects, posts, content cards) */
  card: "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:bg-muted/30 active:scale-[0.98] active:shadow-md",
  
  /** Subtle hover for secondary/inline cards */
  cardSubtle: "transition-all duration-300 hover:shadow-md hover:bg-muted/50 active:scale-[0.99]",
  
  /** Featured/hero cards (already prominent, minimal transform) */
  cardFeatured: "transition-all duration-300 hover:shadow-xl active:scale-[0.99]",
  
  /** Interactive buttons (FAB, CTAs) */
  button: "transition-shadow hover:shadow-xl active:scale-95 active:shadow-lg",
  
  /** Text links */
  link: "hover:underline underline-offset-4 will-change-auto transition-colors active:opacity-70",
} as const;

// ============================================================================
// ANIMATIONS
// ============================================================================

/**
 * Animation duration patterns for consistent motion design
 * 
 * @example
 * ```tsx
 * <div className={`transition-all ${ANIMATIONS.standard}`}>
 *   {content}
 * </div>
 * ```
 */
export const ANIMATIONS = {
  /** Fast transitions (hover states, small movements) */
  fast: "duration-200",
  
  /** Standard transitions (most UI interactions) */
  standard: "duration-300",
  
  /** Slow transitions (dramatic reveals, page transitions) */
  slow: "duration-500",
} as const;

// ============================================================================
// BORDERS & SHADOWS
// ============================================================================

/**
 * Border radius patterns for consistent rounded corners
 */
export const BORDERS = {
  /** Default card/component border radius */
  card: "rounded-lg",
  
  /** Button border radius */
  button: "rounded-md",
  
  /** Input border radius */
  input: "rounded-md",
  
  /** Badge border radius */
  badge: "rounded-md",
  
  /** Circular elements (avatars, FABs) */
  circle: "rounded-full",
} as const;

/**
 * Shadow elevation patterns
 */
export const SHADOWS = {
  /** Subtle elevation (cards at rest) */
  sm: "shadow-sm",
  
  /** Standard elevation (hover states) */
  md: "shadow-md",
  
  /** High elevation (focused elements, modals) */
  lg: "shadow-lg",
  
  /** Maximum elevation (floating action buttons) */
  xl: "shadow-xl",
} as const;

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

/**
 * Standard breakpoint values for consistent responsive behavior
 * Based on Tailwind's default breakpoints
 */
export const BREAKPOINTS = {
  sm: "640px",   // Small devices (phones in landscape)
  md: "768px",   // Medium devices (tablets)
  lg: "1024px",  // Large devices (laptops)
  xl: "1280px",  // Extra large devices (desktops)
  "2xl": "1536px", // 2X large devices (large desktops)
} as const;

/**
 * Touch target size for mobile accessibility
 */
export const TOUCH_TARGET = {
  /** Minimum recommended size (44x44px) */
  min: "min-h-11 min-w-11",
  
  /** Standard button/link size */
  standard: "h-12 w-12",
} as const;

// ============================================================================
// PAGE LAYOUT PATTERNS
// ============================================================================

/**
 * Page-level layout patterns for core pages (/, /about, /contact, /resume)
 * Ensures consistent structure and spacing across all main pages
 * 
 * @example
 * ```tsx
 * <div className={PAGE_LAYOUT.wrapper}>
 *   <PageHero />
 *   <PageSection>{content}</PageSection>
 * </div>
 * ```
 */
export const PAGE_LAYOUT = {
  /** Root page wrapper - provides consistent vertical rhythm */
  wrapper: "min-h-screen",
  
  /** Hero section spacing - larger than standard sections */
  hero: {
    /** Container for hero content */
    container: `mx-auto ${CONTAINER_WIDTHS.standard} ${CONTAINER_PADDING} pt-14 pb-10 md:pt-20 md:pb-14`,
    /** Hero title + description wrapper */
    content: SPACING.proseHero,
  },
  
  /** Standard page section spacing */
  section: {
    /** Section container */
    container: `mx-auto ${CONTAINER_WIDTHS.standard} ${CONTAINER_PADDING} py-10 md:py-14`,
    /** Section content wrapper */
    content: SPACING.subsection,
  },
  
  /** Prose/reading-optimized section (about page, long-form content) */
  proseSection: {
    /** Container for prose content */
    container: `mx-auto ${CONTAINER_WIDTHS.prose} ${CONTAINER_PADDING} py-10 md:py-14`,
    /** Prose content wrapper */
    content: SPACING.content,
  },
  
  /** Narrow section for forms (contact page) */
  narrowSection: {
    /** Container for narrow content */
    container: `mx-auto ${CONTAINER_WIDTHS.narrow} ${CONTAINER_PADDING} py-10 md:py-14`,
    /** Content wrapper */
    content: SPACING.content,
  },
} as const;

/**
 * Hero section variants for different page types
 */
export const HERO_VARIANTS = {
  /** Standard hero (about, contact, projects) */
  standard: {
    title: TYPOGRAPHY.h1.standard,
    description: TYPOGRAPHY.description,
    spacing: SPACING.proseHero,
  },
  
  /** Homepage hero (larger, more prominent) */
  homepage: {
    title: TYPOGRAPHY.h1.hero,
    description: TYPOGRAPHY.description,
    spacing: SPACING.proseHero,
  },
  
  /** Article hero (blog posts) */
  article: {
    title: TYPOGRAPHY.h1.article,
    description: TYPOGRAPHY.description,
    spacing: SPACING.proseHero,
  },
} as const;

// ============================================================================
// COMPONENT-SPECIFIC PATTERNS
// ============================================================================

/**
 * Reusable class combinations for common component patterns
 */
export const COMPONENT_PATTERNS = {
  /** Page hero section (title + description) */
  pageHero: `${SPACING.proseHero}`,
  
  /** Card base styles (before hover effects) */
  card: `${BORDERS.card} border overflow-hidden`,
  
  /** Section wrapper */
  section: SPACING.section,
  
  /** Content wrapper */
  contentBlock: SPACING.content,
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/** Type for container width variants */
export type ContainerWidth = keyof typeof CONTAINER_WIDTHS;

/** Type for heading variants */
export type HeadingVariant = keyof typeof TYPOGRAPHY.h1;

/** Type for hover effect variants */
export type HoverEffect = keyof typeof HOVER_EFFECTS;

/** Type for animation durations */
export type AnimationDuration = keyof typeof ANIMATIONS;
