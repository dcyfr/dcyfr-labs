import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Brand-aligned badge variants over semantic design tokens.
// Never hardcode colors — tokens come from the consumer app's CSS variables.
const dcyfrBadgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-colors overflow-hidden active:scale-95 [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  {
    variants: {
      variant: {
        brand:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
        secure:
          'border-secure/40 bg-secure/10 text-secure ring-1 ring-secure/20 hover:bg-secure/15',
        danger:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 focus-visible:ring-destructive/20',
        info: 'border-border/60 bg-muted/60 text-muted-foreground hover:bg-muted',
        outline:
          'border-border/80 bg-background/70 text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/30 active:bg-accent/80',
        ghostly: 'border-transparent bg-transparent text-muted-foreground hover:bg-muted/50',
      },
      size: {
        sm: 'h-5 px-1.5 text-[10px]',
        md: 'h-6 px-2 text-xs',
        lg: 'h-7 px-2.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'brand',
      size: 'md',
    },
  }
);

export interface DcyfrBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof dcyfrBadgeVariants> {
  asChild?: boolean;
}

function DcyfrBadge({ className, variant, size, asChild = false, ...props }: DcyfrBadgeProps) {
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp
      data-slot="badge"
      className={cn(dcyfrBadgeVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { DcyfrBadge, dcyfrBadgeVariants };
