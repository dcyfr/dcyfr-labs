'use client';

import * as React from 'react';
import { Compass, Zap, BarChart3, Target, SlidersHorizontal, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SPACING_VALUES, BORDERS } from '@/lib/design-tokens';

/**
 * RivetPillarCard Component
 *
 * A themed card component for displaying RIVET framework pillars.
 * Used to showcase the five pillars: Reader, Interactive, Visual, Engagement, Tiered.
 *
 * @component
 * @example
 * ```tsx
 * <RivetPillarCard
 *   iconName="compass"
 *   title="Reader Navigation"
 *   description="Progress tracking, TOC, scroll indicators"
 *   color="cyan"
 * />
 * ```
 *
 * @variants
 * - cyan: Reader navigation (cyan)
 * - purple: Interactive elements (purple)
 * - orange: Visual density (orange)
 * - green: Engagement & Discoverability (green)
 * - blue: Tiered depth (blue)
 *
 * @accessibility
 * - Icon is decorative (aria-hidden="true")
 * - Semantic heading structure
 * - High contrast colors in light/dark modes
 */

type PillarColor = 'cyan' | 'purple' | 'orange' | 'green' | 'blue';
type IconName = 'compass' | 'zap' | 'bar-chart-3' | 'target' | 'sliders-horizontal';

interface RivetPillarCardProps {
  /** Icon name to resolve */
  iconName: IconName;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Color theme variant */
  color: PillarColor;
  /** Optional className */
  className?: string;
}

const colorConfig: Record<
  PillarColor,
  { bg: string; border: string; titleColor: string; iconColor: string }
> = {
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/20',
    border: 'border-cyan-500/20',
    titleColor: 'text-cyan-700 dark:text-cyan-300',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-500/20',
    titleColor: 'text-purple-700 dark:text-purple-300',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-500/20',
    titleColor: 'text-orange-700 dark:text-orange-300',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-500/20',
    titleColor: 'text-green-700 dark:text-green-300',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-500/20',
    titleColor: 'text-blue-700 dark:text-blue-300',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
};

const iconMap: Record<IconName, LucideIcon> = {
  compass: Compass,
  zap: Zap,
  'bar-chart-3': BarChart3,
  target: Target,
  'sliders-horizontal': SlidersHorizontal,
};

export function RivetPillarCard({
  iconName,
  title,
  description,
  color,
  className,
}: RivetPillarCardProps) {
  const config = colorConfig[color];
  const Icon = iconMap[iconName];

  return (
    <div
      className={cn(
        // Consistent padding and spacing using design tokens
        `p-${SPACING_VALUES.lg}`,
        // Responsive layout and spacing
        'flex flex-col',
        `gap-${SPACING_VALUES.sm}`,
        // Visual styling
        config.bg,
        'rounded-lg border-2',
        config.border,
        // Enhanced interaction states
        'transition-all duration-200 hover:shadow-md hover:scale-[1.02]',
        'focus-within:ring-2 focus-within:ring-primary/20',
        className
      )}
    >
      {/* Icon and title row */}
      <div className="flex items-center gap-3 mb-2">
        <Icon className={cn('shrink-0', config.iconColor)} aria-hidden="true" />
        <h5 className={cn(config.titleColor, 'font-semibold leading-tight')}>{title}</h5>
      </div>

      <p className={cn('text-sm leading-relaxed text-muted-foreground')}>{description}</p>
    </div>
  );
}
