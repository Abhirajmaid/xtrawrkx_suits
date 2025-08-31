import { clsx } from "clsx";

export function Card({
  children,
  className,
  title,
  subtitle,
  actions,
  padding = true,
  hoverable = false,
  gradient = false,
  gradientType = "primary",
  glass = false,
  onClick,
  ...props
}) {
  const gradientClasses = {
    primary: "bg-gradient-primary",
    secondary: "bg-gradient-secondary",
    warm: "bg-gradient-warm",
    peach: "bg-gradient-peach",
    coral: "bg-gradient-coral",
    gold: "bg-gradient-gold",
    sunset: "bg-gradient-sunset",
    amber: "bg-gradient-amber",
    default: "bg-gradient-card",
  };

  return (
    <div
      className={clsx(
        glass
          ? "bg-gradient-glass rounded-2xl shadow-card border border-white/30 backdrop-blur-md"
          : gradient
            ? `${gradientClasses[gradientType] || gradientClasses.default} rounded-2xl shadow-card border border-brand-border/20`
            : "bg-white rounded-2xl shadow-card border border-brand-border/50 backdrop-blur-sm",
        hoverable &&
          "hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer",
        !hoverable && "transition-all duration-300",
        padding && "p-6",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-brand-foreground">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-brand-text-light mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
