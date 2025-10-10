import { clsx } from "clsx";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral", // 'increase', 'decrease', 'neutral'
  icon: Icon,
  iconBg = "bg-blue-50",
  iconColor = "text-blue-600",
  subtitle,
  gradient = false,
  gradientType = "primary",
  className,
  ...props
}) {
  const getTrendIcon = () => {
    if (changeType === "increase") return TrendingUp;
    if (changeType === "decrease") return TrendingDown;
    return Minus;
  };

  const TrendIcon = getTrendIcon();

  const trendColors = {
    increase: "text-emerald-600 bg-emerald-50",
    decrease: "text-red-600 bg-red-50",
    neutral: "text-gray-600 bg-gray-50",
  };

  return (
    <div
      className={clsx(
        "bg-white rounded-lg border border-gray-200 shadow-sm p-6",
        "transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            {subtitle && (
              <span className="text-sm text-gray-500">{subtitle}</span>
            )}
          </div>
          {change !== undefined && (
            <div className="mt-3 flex items-center gap-1">
              <span
                className={clsx(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                  trendColors[changeType]
                )}
              >
                <TrendIcon className="w-3 h-3" />
                {change}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={clsx("p-2 rounded-lg", iconBg)}>
            <Icon className={clsx("w-5 h-5", iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
