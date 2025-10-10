import { clsx } from "clsx";

export function Card({
  children,
  className,
  title,
  subtitle,
  actions,
  padding = true,
  hoverable = false,
  variant = "default",
  onClick,
  ...props
}) {
  const variants = {
    default: "bg-white border border-gray-100 shadow-sm",
    elevated: "bg-white border border-gray-100 shadow-md",
    outlined: "bg-white border border-gray-200",
    ghost: "bg-transparent border-0",
  };

  return (
    <div
      className={clsx(
        "rounded-lg transition-all duration-200",
        variants[variant] || variants.default,
        hoverable && "hover:shadow-md hover:border-gray-200 cursor-pointer",
        padding && "p-6",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {(title || subtitle || actions) && (
        <CardHeader>
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </div>
  );
}

// Card sub-components for compatibility
export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={clsx("flex items-start justify-between mb-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={clsx("text-lg font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export default Card;
