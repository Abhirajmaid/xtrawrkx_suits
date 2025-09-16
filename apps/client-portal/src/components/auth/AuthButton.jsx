import { Button } from "@xtrawrkx/ui";

export default function AuthButton({ 
  children, 
  type = "button", 
  variant = "primary", 
  size = "lg", 
  loading = false,
  disabled = false,
  className = "",
  ...props 
}) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={`w-full font-medium ${className}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
