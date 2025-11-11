/**
 * PageLayout - Universal wrapper for all core pages
 * 
 * Provides consistent structure, spacing, and max-width constraints for pages
 * like homepage, about, contact, and resume. This component ensures all pages
 * have the same vertical rhythm and responsive behavior.
 * 
 * @example Basic usage
 * ```tsx
 * <PageLayout>
 *   <PageHero title="About" description="Learn more about me" />
 *   <PageSection>{content}</PageSection>
 * </PageLayout>
 * ```
 * 
 * @example With custom className
 * ```tsx
 * <PageLayout className="bg-gradient-to-b from-background to-muted">
 *   {children}
 * </PageLayout>
 * ```
 */

import { ReactNode } from 'react'
import { PAGE_LAYOUT } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  /** Page content */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn(PAGE_LAYOUT.wrapper, className)}>
      {children}
    </div>
  )
}
