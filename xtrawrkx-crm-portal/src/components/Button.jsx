import React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Button({
  text,
  type = "primary",
  size = "md",
  className = "",
  link,
  onClick,
  disabled = false,
  icon: Icon,
  hideArrow = false,
  children,
  ...props
}) {
  const getBaseClass = () => {
    switch (type) {
      case "primary":
        return "btn-primary";
      case "secondary":
        return "btn-secondary";
      case "tertiary":
        return "btn-tertiary";
      case "ghost":
        return "btn-ghost";
      case "gradient":
        return "btn-gradient";
      default:
        return "btn-primary";
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "btn-sm";
      case "lg":
        return "btn-lg";
      default:
        return "";
    }
  };

  const baseClass = getBaseClass();
  const sizeClass = getSizeClass();
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";
  const groupClass = type === "gradient" ? "group" : "";

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return 16;
      case "lg":
        return 20;
      default:
        return 18;
    }
  };

  const buttonContent = (
    <>
      {Icon && <Icon className="mr-2" size={getIconSize()} />}
      {text || children}
      {!hideArrow && type === "gradient" && (
        <div className="icon-circle">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      )}
      {!hideArrow && type !== "gradient" && (
        <span className="btn-icon">
          <ArrowUpRight size={getIconSize()} />
        </span>
      )}
    </>
  );

  const combinedClassName =
    `${baseClass} ${sizeClass} ${groupClass} ${className} ${disabledClass}`.trim();

  if (link && !disabled) {
    return (
      <Link
        href={link}
        className={combinedClassName}
        onClick={onClick}
        {...props}
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {buttonContent}
    </button>
  );
}
