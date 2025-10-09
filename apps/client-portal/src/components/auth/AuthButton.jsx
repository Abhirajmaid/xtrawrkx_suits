import { motion } from "framer-motion";

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
  const baseClasses =
    "w-full py-4 text-base font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary:
      disabled || loading
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
    secondary:
      disabled || loading
        ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-purple-500",
  };

  return (
    <motion.div
      className="pt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        type={type}
        disabled={disabled || loading}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        whileHover={!disabled && !loading ? { y: -1 } : {}}
        whileTap={!disabled && !loading ? { y: 0 } : {}}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin opacity-70"></div>
            Loading...
          </div>
        ) : (
          children
        )}
      </motion.button>
    </motion.div>
  );
}
