import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const dcyfrAlertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:size-4 [&>svg+div]:-translate-y-0.5 [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        info: 'bg-background text-foreground border-border [&>svg]:text-muted-foreground',
        secure: 'bg-secure/5 text-secure border-secure/30 [&>svg]:text-secure',
        success: 'bg-success/5 text-success border-success/40 [&>svg]:text-success',
        warning: 'bg-warning/5 text-warning border-warning/40 [&>svg]:text-warning',
        danger:
          'bg-destructive/5 text-destructive border-destructive/50 [&>svg]:text-destructive dark:border-destructive',
        ghostly: 'bg-muted/40 text-foreground border-border/40 [&>svg]:text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export interface DcyfrAlertProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dcyfrAlertVariants> {}

const DcyfrAlert = React.forwardRef<HTMLDivElement, DcyfrAlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      data-slot="alert"
      className={cn(dcyfrAlertVariants({ variant, className }))}
      {...props}
    />
  )
);
DcyfrAlert.displayName = 'DcyfrAlert';

const DcyfrAlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    data-slot="alert-title"
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
DcyfrAlertTitle.displayName = 'DcyfrAlertTitle';

const DcyfrAlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-description"
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
DcyfrAlertDescription.displayName = 'DcyfrAlertDescription';

export { DcyfrAlert, DcyfrAlertTitle, DcyfrAlertDescription, dcyfrAlertVariants };
