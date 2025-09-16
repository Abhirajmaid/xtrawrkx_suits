import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ 
  className, 
  type = 'text',
  error,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          {leftIcon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          'input-base',
          leftIcon && 'pl-10',
          rightIcon && 'pr-10',
          error && 'border-error-500 ring-error-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
          {rightIcon}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));

Label.displayName = 'Label';

const FormField = ({ label, error, children, required }) => (
  <div className="space-y-2">
    {label && (
      <Label>
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </Label>
    )}
    {children}
    {error && (
      <p className="text-sm text-error-600">{error}</p>
    )}
  </div>
);

export { Input, Label, FormField };