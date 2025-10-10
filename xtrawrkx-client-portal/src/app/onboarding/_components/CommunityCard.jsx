"use client";

import { Badge } from "@/components/ui";
import { Check } from "lucide-react";

export function CommunityCard({ community, isSelected, onToggle }) {
  return (
    <div
      className={`
        relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200
        hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${
          isSelected
            ? "border-primary-500 bg-primary-50 shadow-card"
            : "border-gray-200 bg-white hover:border-gray-300"
        }
      `}
      onClick={() => onToggle(community.key)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(community.key);
        }
      }}
      tabIndex={0}
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`Select ${community.name} community`}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Community icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${community.color}`}
      >
        {community.icon}
      </div>

      {/* Community info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {community.name}
          </h3>
          {community.freeTier && (
            <Badge variant="success" className="ml-2">
              Free tier
            </Badge>
          )}
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          {community.description}
        </p>
      </div>

      {/* Focus ring for keyboard navigation */}
      <div
        className={`
        absolute inset-0 rounded-2xl pointer-events-none transition-opacity
        ${isSelected ? "ring-2 ring-primary-500 ring-offset-2" : ""}
      `}
      />
    </div>
  );
}
