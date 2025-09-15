import React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = {
  variant: {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    neutral: 'bg-neutral-100 text-neutral-800',
    outline: 'border border-neutral-200 text-neutral-700',
  },
  size: {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  },
};

const Badge = React.forwardRef(({ 
  className, 
  variant = 'neutral', 
  size = 'md',
  children,
  ...props 
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'badge',
        badgeVariants.variant[variant],
        badgeVariants.size[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export { Badge, badgeVariants };