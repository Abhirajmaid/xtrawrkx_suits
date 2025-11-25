import { clsx } from "clsx";

export function Textarea({
  label,
  error,
  required = false,
  className,
  containerClassName,
  rows = 3,
  ...props
}) {
  return (
    <div className={clsx("w-full", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={clsx(
          "block w-full rounded-lg border shadow-sm px-3 py-2.5 text-gray-900 placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "transition-colors duration-200 resize-none",
          error
            ? "border-red-300 text-red-900 focus:ring-red-500"
            : "border-gray-300",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default Textarea;

