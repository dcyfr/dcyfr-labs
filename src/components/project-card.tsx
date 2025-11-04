"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Project, ProjectStatus } from "@/data/projects";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ensureProjectImage } from "@/lib/default-project-images";

const STATUS_VARIANT: Record<ProjectStatus, "secondary" | "default" | "outline"> = {
  "active": "secondary",
  "in-progress": "default",
  "archived": "outline",
};

const STATUS_LABEL: Record<ProjectStatus, string> = {
  "active": "Active",
  "in-progress": "In progress",
  "archived": "Archived",
};

/**
 * ProjectCard Component
 * 
 * Displays a portfolio project with adaptive layout for mobile and desktop.
 * Features progressive disclosure for project highlights on mobile devices.
 * 
 * ⚠️ SKELETON SYNC REQUIRED
 * When updating this component's structure, also update:
 * - src/components/project-card-skeleton.tsx
 * 
 * Key structural elements that must match:
 * - Card: flex, h-full, relative positioning, overflow-hidden
 * - CardHeader: space-y-3, px-4 sm:px-6, py-4 sm:py-6, z-10
 *   - Timeline (optional, text-xs)
 *   - Title + Status Badge (flex-wrap, gap-2)
 *   - Description (CardDescription)
 *   - Tech Stack (flex-wrap, gap-1.5, Badge variant="outline")
 * - CardContent: px-4 sm:px-6, py-0 (highlights section)
 *   - Mobile: Expandable button (lg:hidden)
 *   - Desktop: Always-visible list (hidden lg:block)
 * - CardFooter: flex-col sm:flex-row, gap-2 sm:gap-3, px-4 sm:px-6, py-4
 *   - Action buttons/links
 * 
 * @component
 * 
 * Mobile Optimizations (< lg breakpoint):
 * - Expandable "Key Features" section with smooth accordion animation
 * - Full-width stacked action buttons with 44px touch targets
 * - Enhanced padding and spacing for better readability
 * - Button-like link styling with background colors
 * 
 * Desktop Features (≥ lg breakpoint):
 * - Always-visible highlights list
 * - Inline link layout with padding for hover
 * - Optimized spacing for larger screens
 * 
 * @param {Object} props - Component props
 * @param {Project} props.project - Project data object
 * @param {boolean} [props.showHighlights=true] - Whether to display project highlights
 * 
 * @example
 * ```tsx
 * <ProjectCard project={projectData} />
 * <ProjectCard project={projectData} showHighlights={false} />
 * ```
 * 
 * Accessibility:
 * - Touch targets meet 44px minimum (mobile action buttons)
 * - Expandable section uses aria-expanded and aria-controls
 * - Semantic HTML with proper heading hierarchy
 * - Keyboard navigation support for expand/collapse
 * 
 * State Management:
 * - Local state for mobile accordion (expand/collapse)
 * - No external state dependencies
 * 
 * Related Components:
 * - Card components from @/components/ui/card
 * - Button from @/components/ui/button
 * - Badge from @/components/ui/badge
 * - ProjectCardSkeleton from @/components/project-card-skeleton
 * 
 * @see {@link /docs/design/mobile-first-optimization-analysis.md} for design rationale
 * @see {@link /docs/components/project-card.md} for detailed documentation
 * @see {@link /docs/components/skeleton-sync-strategy.md} for skeleton sync guidelines
 */
export function ProjectCard({ 
  project,
  showHighlights = true 
}: { 
  project: Project;
  showHighlights?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Always ensure we have an image (custom or default)
  const image = ensureProjectImage(project.image, {
    tags: project.tags,
    tech: project.tech,
  });
  
  // Check if we have highlights to show
  const hasHighlights = showHighlights && project.highlights && project.highlights.length > 0;
  
  return (
    <Card className="flex h-full flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden relative">
      {/* Background Image - always present now (custom or default) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          className={cn(
            "object-cover opacity-20 dark:opacity-10 transition-opacity duration-300 group-hover:opacity-30",
            image.position && `object-${image.position}`
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
      </div>

      {/* Content - positioned above background */}
      <CardHeader className="space-y-2 relative z-10 px-4 sm:px-6 py-4 sm:py-6">
        {project.timeline && (
          <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <Badge variant={STATUS_VARIANT[project.status]}>{STATUS_LABEL[project.status]}</Badge> {project.timeline}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base sm:text-lg md:text-xl flex align-middle gap-2">
           {project.title}
          </CardTitle>
        </div>
        <CardDescription className="text-sm sm:text-base md:text-[0.95rem] leading-relaxed">
          {project.description}
        </CardDescription>
        {project.tech && project.tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tech.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline" className="font-normal text-xs sm:text-sm">
                {tech}
              </Badge>
            ))}
            {project.tech.length > 3 && (
              <Badge variant="outline" className="font-normal text-xs sm:text-sm text-muted-foreground">
                +{project.tech.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      
      {/* Key Features / Highlights Section */}
      {hasHighlights && (
        <CardContent className="relative z-10 px-4 sm:px-6 pb-0">
          {/* Desktop: Always visible */}
          <ul className="hidden lg:block list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
            {project.highlights!.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          
          {/* Mobile: Expandable with button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between text-sm font-medium hover:bg-accent/50 touch-target"
              aria-expanded={isExpanded}
              aria-controls={`highlights-${project.slug}`}
            >
              <span>Key Features ({project.highlights!.length})</span>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
                aria-hidden="true"
              />
            </Button>
            
            {/* Expandable content with smooth animation */}
            <div
              id={`highlights-${project.slug}`}
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isExpanded ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
              )}
            >
              <ul className="list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
                {project.highlights!.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="mt-auto flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 relative z-10 px-4 sm:px-6 py-3 sm:py-4">
        {project.links.map((link) => {
          const isExternal = /^(?:https?:)?\/\//.test(link.href);
          // Mobile: Full-width buttons with touch targets, Desktop: Consistent padding for hover
          const linkClassName = cn(
            "inline-flex items-center justify-center gap-1.5 text-sm font-medium transition-colors",
            // Mobile: Button-like styling with full width
            "w-full sm:w-auto px-4 py-2.5 sm:px-3 sm:py-2 rounded-md",
            "bg-accent/50 hover:bg-accent sm:bg-transparent sm:hover:bg-accent/30",
            "touch-target"
          );
          return isExternal ? (
            <a
              key={`${project.slug}-${link.href}`}
              className={linkClassName}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              <span>{link.label}</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : (
            <Link
              key={`${project.slug}-${link.href}`}
              className={linkClassName}
              href={link.href}
            >
              <span>{link.label}</span>
            </Link>
          );
        })}
      </CardFooter>
    </Card>
  );
}
