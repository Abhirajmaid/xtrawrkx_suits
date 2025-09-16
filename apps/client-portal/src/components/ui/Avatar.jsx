import React from 'react';
import { cn } from '../../lib/utils';

const avatarSizes = {
  sm: 'avatar-sm',
  md: 'avatar',
  lg: 'avatar-lg',
  xl: 'avatar-xl',
};

const Avatar = React.forwardRef(({ 
  className,
  size = 'md',
  src,
  alt,
  fallback,
  ...props 
}, ref) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      ref={ref}
      className={cn(avatarSizes[size], className)}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full rounded-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span className="text-inherit">
          {fallback || alt?.[0]?.toUpperCase() || '?'}
        </span>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

const AvatarGroup = ({ children, max = 3, size = 'md', className }) => {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = Math.max(0, childrenArray.length - max);

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleChildren.map((child, index) => (
        <div key={index} className="ring-2 ring-white rounded-full">
          {React.cloneElement(child, { size })}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className={cn(avatarSizes[size], 'ring-2 ring-white bg-neutral-200 text-neutral-600')}>
          <span>+{remainingCount}</span>
        </div>
      )}
    </div>
  );
};

export { Avatar, AvatarGroup };