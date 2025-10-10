import { motion } from "framer-motion";
import { Mail, Lock, User, Phone } from "lucide-react";

const iconMap = {
  email: Mail,
  password: Lock,
  text: User,
  tel: Phone,
};

export default function AuthInput({
  type = "text",
  label,
  placeholder,
  required = false,
  error,
  className = "",
  ...props
}) {
  const Icon = iconMap[type] || User;

  return (
    <motion.div
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          className={`w-full h-12 pl-10 pr-4 border rounded-lg outline-none transition-all ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          }`}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          className="mt-2 text-sm text-red-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
