import React from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = {
  variant: {
    primary: 'btn-base btn-primary',
    secondary: 'btn-base btn-secondary',
    ghost: 'btn-base btn-ghost',
    outline: 'btn-base btn-outline',
    destructive: 'btn-base bg-error-500 text-white shadow-sm hover:bg-error-600',
  },
  size: {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    icon: 'h-10 w-10 p-0',
  },
};

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children,
  disabled,
  loading,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  const classes = cn(
    buttonVariants.variant[variant],
    buttonVariants.size[size],
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'cursor-wait',
    className
  );

  return (
    <button
      className={classes}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {leftIcon && !loading && (
        <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {rightIcon && !loading && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };