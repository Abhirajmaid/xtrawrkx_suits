import Link from "next/link";

export default function AuthToggle({ 
  text, 
  linkText, 
  href, 
  onClick,
  className = "" 
}) {
  return (
    <div className={`text-center text-sm ${className}`}>
      <span className="text-neutral-600">
        {text}{" "}
        {href ? (
          <Link 
            href={href}
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            {linkText}
          </Link>
        ) : (
          <button
            onClick={onClick}
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            {linkText}
          </button>
        )}
      </span>
    </div>
  );
}
