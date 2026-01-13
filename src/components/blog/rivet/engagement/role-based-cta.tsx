"use client";

import * as React from "react";
import { Briefcase, Code, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SPACING,
  TYPOGRAPHY,
  SEMANTIC_COLORS,
  BORDERS,
  SHADOWS,
  ANIMATION,
} from "@/lib/design-tokens";

/**
 * RoleBasedCTA - Role-specific call-to-action component
 *
 * Displays three-tier CTAs for different audience personas (Executive/Developer/Security).
 * Each role has customizable title, description, and button action.
 *
 * Features:
 * - Responsive grid (mobile: stacked, desktop: 3-column)
 * - Card-based design with hover effects
 * - Role-specific icons and color theming
 * - Analytics tracking for CTA clicks
 * - WCAG AA accessible
 * - Design token compliant
 *
 * @example
 * ```tsx
 * <RoleBasedCTA
 *   executive={{
 *     title: "For Executives",
 *     description: "Get the business impact summary",
 *     buttonText: "Schedule Assessment",
 *     buttonHref: "/contact?role=executive"
 *   }}
 *   developer={{
 *     title: "For Developers",
 *     description: "See implementation patterns",
 *     buttonText: "View Code Examples",
 *     buttonHref: "/contact?role=developer"
 *   }}
 *   security={{
 *     title: "For Security Teams",
 *     description: "Access threat models and audits",
 *     buttonText: "Download Checklist",
 *     buttonHref: "/contact?role=security"
 *   }}
 * />
 * ```
 */

interface RoleConfig {
  /** Role-specific title */
  title: string;
  /** Role-specific description */
  description: string;
  /** Button text */
  buttonText: string;
  /** Button href */
  buttonHref: string;
}

interface RoleBasedCTAProps {
  /** Executive tier config */
  executive?: RoleConfig;
  /** Developer tier config */
  developer?: RoleConfig;
  /** Security tier config */
  security?: RoleConfig;
  /** Optional className */
  className?: string;
}

const roleConfig = {
  executive: {
    icon: Briefcase,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-900/40",
  },
  developer: {
    icon: Code,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    hoverBg: "hover:bg-green-100 dark:hover:bg-green-900/40",
  },
  security: {
    icon: Shield,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    hoverBg: "hover:bg-red-100 dark:hover:bg-red-900/40",
  },
};

interface RoleCardProps {
  role: "executive" | "developer" | "security";
  config: RoleConfig;
}

function RoleCard({ role, config }: RoleCardProps) {
  const theme = roleConfig[role];
  const Icon = theme.icon;

  const handleClick = () => {
    // Track CTA click event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "cta_click", {
        cta_type: "role_based",
        role,
        button_text: config.buttonText,
      });
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-6 rounded-lg border transition-all",
        BORDERS.card,
        theme.bgColor,
        theme.borderColor,
        theme.hoverBg
      )}
    >
      {/* Icon */}
      <div className="flex items-center gap-3">
        <Icon className={cn("h-6 w-6", theme.color)} aria-hidden="true" />
        <h3 className={cn(TYPOGRAPHY.h3.standard)}>
          {config.title}
        </h3>
      </div>

      {/* Description */}
      <p className={cn("text-sm leading-relaxed text-muted-foreground flex-1")}>
        {config.description}
      </p>

      {/* Button */}
      <a
        href={config.buttonHref}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center px-4 py-2 rounded-md",
          "text-sm font-medium transition-colors",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
        )}
        role="button"
        aria-label={`${config.buttonText} for ${config.title}`}
      >
        {config.buttonText}
      </a>
    </div>
  );
}

export function RoleBasedCTA({
  executive,
  developer,
  security,
  className,
}: RoleBasedCTAProps) {
  // Return null if no roles provided
  if (!executive && !developer && !security) {
    return null;
  }

  return (
    <div
      className={cn(
        `grid gap-${SPACING.content} md:grid-cols-3 my-8`,
        className
      )}
      role="region"
      aria-label="Role-based call-to-action options"
    >
      {executive && <RoleCard role="executive" config={executive} />}
      {developer && <RoleCard role="developer" config={developer} />}
      {security && <RoleCard role="security" config={security} />}
    </div>
  );
}

export type { RoleBasedCTAProps, RoleConfig };
