import { clsx } from "clsx";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}) {
  return (
    <div className={clsx("text-center py-12 px-6", className)} {...props}>
      {Icon && (
        <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
          <Icon className="w-full h-full" />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

export default EmptyState;
