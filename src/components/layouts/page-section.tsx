/**
 * PageSection - Consistent section wrapper for page content
 * 
 * Provides standardized spacing, max-width, and structure for content sections
 * within pages. Supports different width variants for different content types
 * (standard, prose, narrow).
 * 
 * @example Standard section
 * ```tsx
 * <PageSection title="Latest Projects">
 *   <ProjectGrid projects={projects} />
 * </PageSection>
 * ```
 * 
 * @example Prose section for reading content
 * ```tsx
 * <PageSection variant="prose" title="My Story">
 *   <p>Long-form content optimized for reading...</p>
 * </PageSection>
 * ```
 * 
 * @example Narrow section for forms
 * ```tsx
 * <PageSection variant="narrow" title="Get in Touch">
 *   <ContactForm />
 * </PageSection>
 * ```
 * 
 * @example Section without title
 * ```tsx
 * <PageSection>
 *   <FeatureGrid features={features} />
 * </PageSection>
 * ```
 */

import { ReactNode } from 'react'
import { PAGE_LAYOUT, TYPOGRAPHY, SPACING } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

type SectionVariant = 'standard' | 'prose' | 'narrow'

interface PageSectionProps {
  /** Section content */
  children: ReactNode
  /** Optional section title (H2) */
  title?: string
  /** Optional section description */
  description?: string
  /** Section width variant */
  variant?: SectionVariant
  /** Additional CSS classes for the container */
  className?: string
  /** Additional CSS classes for the content wrapper */
  contentClassName?: string
  /** HTML id for anchor linking */
  id?: string
}

export function PageSection({
  children,
  title,
  description,
  variant = 'standard',
  className,
  contentClassName,
  id,
}: PageSectionProps) {
  // Get the appropriate layout based on variant
  const layout = {
    standard: PAGE_LAYOUT.section,
    prose: PAGE_LAYOUT.proseSection,
    narrow: PAGE_LAYOUT.narrowSection,
  }[variant]

  return (
    <section id={id} className={cn(layout.container, className)}>
      <div className={cn(layout.content, contentClassName)}>
        {/* Section header */}
        {(title || description) && (
          <div className={`${SPACING.compact} mb-8`}>
            {title && (
              <h2 className={TYPOGRAPHY.h2.standard}>{title}</h2>
            )}
            {description && (
              <p className={TYPOGRAPHY.description}>{description}</p>
            )}
          </div>
        )}

        {/* Section content */}
        {children}
      </div>
    </section>
  )
}
