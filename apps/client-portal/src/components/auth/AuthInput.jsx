import { Input } from "@xtrawrkx/ui";
import { Mail, Lock, User } from "lucide-react";

const iconMap = {
  email: Mail,
  password: Lock,
  text: User,
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
  const Icon = iconMap[type] || null;
  
  return (
    <div className={`w-full ${className}`}>
      <Input
        type={type}
        label={label}
        placeholder={placeholder}
        required={required}
        error={error}
        icon={Icon}
        className="w-full"
        {...props}
      />
    </div>
  );
}
