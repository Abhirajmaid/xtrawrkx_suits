import { clsx } from "clsx";

export function Avatar({
  src,
  alt,
  size = "md",
  fallback,
  className,
  ...props
}) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const initials = fallback || (alt ? alt.charAt(0).toUpperCase() : "?");

  return (
    <div
      className={clsx(
        "inline-flex items-center justify-center rounded-full bg-gray-500 font-medium text-white",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export default Avatar;
