/**
 * Homepage Hero Actions Component
 * 
 * Client component for hero section buttons with conversion tracking.
 * Provides responsive button layout with visual hierarchy and icons.
 * Uses centralized navigation configuration for consistency.
 */

'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { ANIMATION } from '@/lib/design-tokens';
import { PRIMARY_NAV_LINKS, getAnalyticsSource } from '@/lib/nav-links';

export function HomepageHeroActions() {
  const handleLinkClick = (href: string) => {
    trackEvent({
      name: 'external_link_clicked',
      properties: {
        url: href,
        source: getAnalyticsSource(href, 'hero'),
      },
    });
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center">
      {PRIMARY_NAV_LINKS.map((link) => {
        // Determine button variant based on link variant
        const buttonVariant = 
          link.variant === 'primary' ? 'cta' :
          link.variant === 'secondary' ? 'cta-outline' :
          'secondary';

        return (
          <Button
            key={link.href}
            variant={buttonVariant}
            asChild
            size="default"
            className={cn(
              "gap-4 hover:scale-105 transition-transform",
              ANIMATION.duration.fast
            )}
          >
            <Link href={link.href} onClick={() => handleLinkClick(link.href)}>
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
