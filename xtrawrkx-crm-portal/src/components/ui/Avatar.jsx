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
    xs: "w-6 h-6 text-xs",
    sm: "w-7 h-7 text-xs",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
    xl: "w-12 h-12 text-base",
  };

  const initials = fallback || (alt ? alt.charAt(0).toUpperCase() : "?");

  return (
    <div
      className={clsx(
        "inline-flex items-center justify-center rounded-full bg-gray-500 font-medium text-white flex-shrink-0",
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
        <span className="select-none">{initials}</span>
      )}
    </div>
  );
}

export default Avatar;
