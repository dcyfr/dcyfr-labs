/**
 * InlineMath Component
 * 
 * Wrapper for inline mathematical expressions to ensure consistent styling
 * and optimal baseline alignment across different contexts.
 * 
 * While KaTeX handles most styling automatically, this component is useful for:
 * - Ensuring consistent appearance across browsers
 * - Adding accessibility attributes if needed
 * - Future customization (e.g., hover tooltips, explanations)
 * 
 * @example
 * ```tsx
 * // In MDX, KaTeX is rendered automatically
 * Einstein's equation is $E = mc^2$.
 * 
 * // For direct component usage (rare):
 * <InlineMath>E = mc^2</InlineMath>
 * ```
 * 
 * @see src/styles/katex.css for styling
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InlineMathProps {
  /** The math expression content (without $ delimiters) */
  children: ReactNode;
  
  /** Optional CSS class name for additional styling */
  className?: string;
  
  /** Optional label for accessibility */
  ariaLabel?: string;
}

/**
 * Inline Math Wrapper Component
 * 
 * Provides consistent styling and baseline alignment for mathematical expressions.
 * Primarily used when KaTeX auto-rendering isn't suitable.
 * 
 * @param props Component props
 * @returns Styled inline math element
 * 
 * @example Basic usage
 * ```tsx
 * <InlineMath>x^2 + y^2 = z^2</InlineMath>
 * ```
 * 
 * @example With custom styling
 * ```tsx
 * <InlineMath className="font-semibold">E = mc^2</InlineMath>
 * ```
 * 
 * @example With accessibility
 * ```tsx
 * <InlineMath ariaLabel="E equals m times c squared">
 *   E = mc^2
 * </InlineMath>
 * ```
 */
export function InlineMath({
  children,
  className,
  ariaLabel,
}: InlineMathProps) {
  return (
    <span
      className={cn(
        // Baseline alignment (matches katex.css)
        "[vertical-align:-0.125em]",
        // Spacing around inline math (matches katex.css)
        "mx-[0.1em]",
        // Inline-block for better control if needed
        "inline-block",
        // Prevent wrapping of multi-line expressions
        "whitespace-nowrap",
        // Additional classes
        className
      )}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
    >
      {children}
    </span>
  );
}

/**
 * Display Math Wrapper Component
 * 
 * Provides consistent styling for block/display mode equations.
 * Useful when display equations need special handling.
 * 
 * @example
 * ```tsx
 * <DisplayMath>
 *   \int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
 * </DisplayMath>
 * ```
 */
export interface DisplayMathProps {
  /** The math expression content (without $$ delimiters) */
  children: ReactNode;
  
  /** Optional CSS class name for additional styling */
  className?: string;
  
  /** Optional title or description */
  title?: string;
  
  /** Optional label for accessibility */
  ariaLabel?: string;
}

export function DisplayMath({
  children,
  className,
  title,
  ariaLabel,
}: DisplayMathProps) {
  return (
    <div
      className={cn(
        // Center alignment (matches katex.css)
        "flex justify-center",
        // Margin for vertical breathing room
        "my-6",
        // Handle overflow on small screens
        "overflow-x-auto",
        // Additional classes
        className
      )}
      title={title}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

/**
 * Math Environment Hook
 * 
 * Detects whether content is being rendered in inline or display context
 * for adaptive styling. Useful for components that render equations dynamically.
 * 
 * @example
 * ```tsx
 * const isMathInline = useMathContext();
 * 
 * return (
 *   <span className={isMathInline ? "inline-block" : "block"}>
 *     {equation}
 *   </span>
 * );
 * ```
 */
export const INLINE_MATH_CLASSES = {
  /** Inline math styling (default) */
  inline: "[vertical-align:-0.125em] mx-[0.1em] inline-block",
  
  /** Display math styling */
  display: "flex justify-center my-6 overflow-x-auto",
  
  /** Heading context adjustments */
  heading: "[vertical-align:-0.15em]",
  
  /** Table cell context (tighter) */
  tableCell: "mx-[0.05em]",
  
  /** List item context */
  listItem: "mx-[0.1em]",
  
  /** Blockquote context */
  blockquote: "mx-[0.1em]",
} as const;

export type MathContext = keyof typeof INLINE_MATH_CLASSES;

/**
 * Get appropriate CSS classes for math in a given context
 * 
 * @param context The rendering context
 * @returns Tailwind classes appropriate for that context
 * 
 * @example
 * ```tsx
 * const classes = getMathClasses('heading');
 * // Returns: "[vertical-align:-0.15em]"
 * ```
 */
export function getMathClasses(context: MathContext = "inline"): string {
  return INLINE_MATH_CLASSES[context];
}
