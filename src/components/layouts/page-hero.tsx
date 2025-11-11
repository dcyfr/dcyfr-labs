/**
 * PageHero - Standardized hero section for all core pages
 * 
 * Provides consistent hero sections with title, description, and optional actions.
 * Automatically handles responsive spacing, typography, and layout based on variant.
 * 
 * @example Standard hero
 * ```tsx
 * <PageHero 
 *   title="About Me" 
 *   description="Full-stack developer passionate about building great experiences"
 * />
 * ```
 * 
 * @example Homepage hero with actions
 * ```tsx
 * <PageHero 
 *   variant="homepage"
 *   title="Hi, I'm Drew"
 *   description="Full-stack developer and designer"
 *   actions={
 *     <div className="flex gap-4">
 *       <Button>View Work</Button>
 *       <Button variant="outline">Contact Me</Button>
 *     </div>
 *   }
 * />
 * ```
 * 
 * @example With custom image/avatar
 * ```tsx
 * <PageHero 
 *   title="About"
 *   description="Learn more about me"
 *   image={<Avatar src="/avatar.jpg" size="lg" />}
 * />
 * ```
 */

import { ReactNode } from 'react'
import { PAGE_LAYOUT, HERO_VARIANTS } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

type HeroVariant = keyof typeof HERO_VARIANTS

interface PageHeroProps {
  /** Hero title (H1) */
  title: string
  /** Hero description/tagline */
  description?: string
  /** Hero variant (determines size and styling) */
  variant?: HeroVariant
  /** Optional image/avatar element */
  image?: ReactNode
  /** Optional action buttons/links */
  actions?: ReactNode
  /** Additional CSS classes for the container */
  className?: string
  /** Additional CSS classes for the content wrapper */
  contentClassName?: string
}

export function PageHero({
  title,
  description,
  variant = 'standard',
  image,
  actions,
  className,
  contentClassName,
}: PageHeroProps) {
  const styles = HERO_VARIANTS[variant]

  return (
    <section className={cn(PAGE_LAYOUT.hero.container, className)}>
      <div className={cn(PAGE_LAYOUT.hero.content, contentClassName)}>
        {/* Optional image/avatar */}
        {image && (
          <div className="flex justify-center md:justify-start">
            {image}
          </div>
        )}

        {/* Title */}
        <h1 className={styles.title}>{title}</h1>

        {/* Description */}
        {description && (
          <p className={styles.description}>{description}</p>
        )}

        {/* Actions */}
        {actions && (
          <div className="pt-2">{actions}</div>
        )}
      </div>
    </section>
  )
}
