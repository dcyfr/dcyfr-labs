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
 * @example Centered hero
 * ```tsx
 * <PageHero 
 *   title="Welcome"
 *   description="Explore my work and ideas"
 *   align="center"
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
type HeroAlign = 'left' | 'center'

interface PageHeroProps {
  /** Hero title (H1) - can be string or ReactNode for custom content */
  title: string | ReactNode
  /** Hero description/tagline */
  description?: string | ReactNode
  /** Hero variant (determines size and styling) */
  variant?: HeroVariant
  /** Text alignment */
  align?: HeroAlign
  /** Optional image/avatar element */
  image?: ReactNode
  /** Optional action buttons/links */
  actions?: ReactNode
  /** Additional CSS classes for the container */
  className?: string
  /** Additional CSS classes for the content wrapper */
  contentClassName?: string
  /** Item count for archive pages (e.g., "5 items") */
  itemCount?: number
}

export function PageHero({
  title,
  description,
  variant = 'standard',
  align = 'left',
  image,
  actions,
  className,
  contentClassName,
  itemCount,
}: PageHeroProps) {
  const styles = HERO_VARIANTS[variant]
  const alignmentClasses = align === 'center' ? 'text-center' : ''
  const imageJustify = align === 'center' ? 'justify-center' : 'justify-center md:justify-start'

  return (
    <section className={cn(PAGE_LAYOUT.hero.container, className)}>
      <div className={cn(PAGE_LAYOUT.hero.content, alignmentClasses, contentClassName)}>
        {/* Optional image/avatar */}
        {image && (
          <div className={cn('flex', imageJustify)}>
            {image}
          </div>
        )}

        {/* Title */}
        <h1 className={styles.title}>{title}</h1>

        {/* Description */}
        {description && (
          <p className={styles.description}>
            {description}
            {itemCount !== undefined && (
              <span className="text-muted-foreground">
                {' '}({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </p>
        )}

        {/* Actions */}
        {actions && (
          <div className={cn('pt-2', align === 'center' && 'flex justify-center')}>{actions}</div>
        )}
      </div>
    </section>
  )
}
