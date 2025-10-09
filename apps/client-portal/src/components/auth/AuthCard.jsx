import { motion } from "framer-motion";

export default function AuthCard({
  title,
  subtitle,
  children,
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h1>
        {subtitle && <p className="text-gray-600 text-base">{subtitle}</p>}
      </motion.div>

      {/* Form Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
