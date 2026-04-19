import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { cn } from '@/lib/utils';

// Brand-aligned textarea with built-in validation states.
// Mirrors dcyfr-input API. Tokens come from the consumer app; never hardcode.
const dcyfrTextareaVariants = cva(
  'flex min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-[color,background,border,box-shadow] duration-200',
  {
    variants: {
      variant: {
        default: 'border-input hover:border-ring/50 focus:border-ring focus-visible:ring-ring',
        secure:
          'border-secure/40 bg-secure/5 hover:border-secure/60 focus:border-secure focus-visible:ring-secure/30',
        ghostly:
          'border-transparent bg-muted/40 hover:bg-muted/60 focus:bg-background focus:border-ring focus-visible:ring-ring/40',
      },
      state: {
        idle: '',
        error:
          'border-destructive pr-10 hover:border-destructive focus:border-destructive focus-visible:ring-destructive/20',
        success:
          'border-success pr-10 hover:border-success focus:border-success focus-visible:ring-success/20',
      },
    },
    defaultVariants: {
      variant: 'default',
      state: 'idle',
    },
  }
);

export interface DcyfrTextareaProps
  extends
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    Pick<VariantProps<typeof dcyfrTextareaVariants>, 'variant'> {
  /** Error message to display (also applies error styling + aria-invalid) */
  error?: string | null;
  /** Show success indicator */
  success?: boolean;
  /** Wrapper div className for error/success message positioning */
  wrapperClassName?: string;
}

const DcyfrTextarea = React.forwardRef<HTMLTextAreaElement, DcyfrTextareaProps>(
  ({ className, variant, error, success, wrapperClassName, id, ...props }, ref) => {
    const hasError = Boolean(error && error.trim() !== '');
    const showSuccess = Boolean(success && !hasError);
    const state = hasError ? 'error' : showSuccess ? 'success' : 'idle';

    if (state === 'idle') {
      return (
        <textarea
          id={id}
          ref={ref}
          className={cn(dcyfrTextareaVariants({ variant, state, className }))}
          {...props}
        />
      );
    }

    return (
      <div className={cn('relative', wrapperClassName)}>
        <textarea
          id={id}
          ref={ref}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={hasError && id ? `${id}-error` : undefined}
          className={cn(dcyfrTextareaVariants({ variant, state, className }))}
          {...props}
        />
        {showSuccess && (
          <CheckCircle2
            aria-hidden="true"
            className="absolute right-3 top-3 h-4 w-4 text-success"
          />
        )}
        {hasError && (
          <AlertCircle
            aria-hidden="true"
            className="absolute right-3 top-3 h-4 w-4 text-destructive"
          />
        )}
        {hasError && (
          <p
            id={id ? `${id}-error` : undefined}
            role="alert"
            className="mt-1.5 text-xs text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
DcyfrTextarea.displayName = 'DcyfrTextarea';

export { DcyfrTextarea, dcyfrTextareaVariants };
