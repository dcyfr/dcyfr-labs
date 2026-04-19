import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Brand-aligned Card variants.
// Tokens come from @/lib/design-tokens in the consumer app; never hardcode.
const dcyfrCardVariants = cva('flex flex-col gap-4 rounded-xl border text-card-foreground', {
  variants: {
    variant: {
      default: 'bg-card shadow-sm',
      elevated: 'bg-card shadow-md hover:shadow-lg transition-shadow',
      secure: 'bg-card ring-1 ring-secure/30 shadow-sm',
      glass: 'bg-card/60 backdrop-blur-md border-border/50 shadow-sm',
      ghostly: 'bg-transparent border-dashed',
    },
    padding: {
      sm: 'py-4',
      md: 'py-6',
      lg: 'py-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'lg',
  },
});

export interface DcyfrCardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dcyfrCardVariants> {}

const DcyfrCard = React.forwardRef<HTMLDivElement, DcyfrCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      className={cn(dcyfrCardVariants({ variant, padding, className }))}
      {...props}
    />
  )
);
DcyfrCard.displayName = 'DcyfrCard';

const DcyfrCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        'grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 sm:px-8 [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  )
);
DcyfrCardHeader.displayName = 'DcyfrCardHeader';

const DcyfrCardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
);
DcyfrCardTitle.displayName = 'DcyfrCardTitle';

const DcyfrCardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
);
DcyfrCardDescription.displayName = 'DcyfrCardDescription';

const DcyfrCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="card-content" className={cn('px-4 sm:px-8', className)} {...props} />
  )
);
DcyfrCardContent.displayName = 'DcyfrCardContent';

const DcyfrCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn('flex items-center px-4 sm:px-8 [.border-t]:pt-6', className)}
      {...props}
    />
  )
);
DcyfrCardFooter.displayName = 'DcyfrCardFooter';

export {
  DcyfrCard,
  DcyfrCardHeader,
  DcyfrCardTitle,
  DcyfrCardDescription,
  DcyfrCardContent,
  DcyfrCardFooter,
  dcyfrCardVariants,
};
