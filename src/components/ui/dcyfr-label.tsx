import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const dcyfrLabelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        required: "text-foreground after:ml-0.5 after:text-destructive after:content-['*']",
        secure: 'text-secure',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface DcyfrLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof dcyfrLabelVariants> {
  /** Shorthand for variant="required" */
  required?: boolean;
}

const DcyfrLabel = React.forwardRef<HTMLLabelElement, DcyfrLabelProps>(
  ({ className, variant, required, ...props }, ref) => {
    const resolvedVariant = required ? 'required' : variant;
    return (
      <label
        ref={ref}
        data-slot="label"
        className={cn(dcyfrLabelVariants({ variant: resolvedVariant, className }))}
        {...props}
      />
    );
  }
);
DcyfrLabel.displayName = 'DcyfrLabel';

export { DcyfrLabel, dcyfrLabelVariants };
