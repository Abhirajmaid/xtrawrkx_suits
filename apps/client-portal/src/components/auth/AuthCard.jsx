import { Card } from "@xtrawrkx/ui";

export default function AuthCard({ title, subtitle, children, className = "" }) {
  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <Card 
        className="p-8 shadow-lg border-0 bg-white/95 backdrop-blur-sm"
        padding={false}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-neutral-600 text-sm">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </Card>
    </div>
  );
}
