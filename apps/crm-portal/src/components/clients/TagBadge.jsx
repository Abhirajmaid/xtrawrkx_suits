"use client";

import { useState } from "react";
import { X, Edit, Plus } from "lucide-react";

export default function TagBadge({
  tag,
  variant = "default",
  size = "sm",
  removable = false,
  editable = false,
  onRemove,
  onEdit,
  onClick,
  className = "",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(tag);

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-brand-primary text-white border-brand-primary";
      case "secondary":
        return "bg-brand-secondary text-white border-brand-secondary";
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "gray":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "outline":
        return "bg-transparent text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "px-1.5 py-0.5 text-xs";
      case "sm":
        return "px-2 py-1 text-xs";
      case "md":
        return "px-2.5 py-1.5 text-sm";
      case "lg":
        return "px-3 py-2 text-sm";
      default:
        return "px-2 py-1 text-xs";
    }
  };

  const handleEdit = () => {
    if (editable) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (onEdit && editValue.trim() !== tag) {
      onEdit(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(tag);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="inline-flex items-center gap-1">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={`${getSizeClasses()} border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary`}
          autoFocus
        />
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 border rounded-full transition-colors duration-200 ${getVariantClasses()} ${getSizeClasses()} ${className} ${
        onClick || editable ? "cursor-pointer hover:opacity-80" : ""
      }`}
      onClick={onClick || (editable ? handleEdit : undefined)}
    >
      <span>{tag}</span>
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(tag);
          }}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      {editable && !removable && (
        <Edit className="w-3 h-3 opacity-50" />
      )}
    </span>
  );
}

// Tag Input Component for adding new tags
export function TagInput({ onAdd, placeholder = "Add tag...", className = "" }) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
        isFocused 
          ? "border-brand-primary ring-2 ring-brand-primary/20" 
          : "border-gray-300 hover:border-gray-400"
      }`}>
        <Plus className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm"
        />
      </div>
    </div>
  );
}

// Tag List Component for managing multiple tags
export function TagList({
  tags = [],
  variant = "default",
  size = "sm",
  removable = false,
  editable = false,
  onRemove,
  onEdit,
  onAdd,
  maxTags = null,
  className = "",
}) {
  const canAddMore = !maxTags || tags.length < maxTags;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {tags.map((tag, index) => (
        <TagBadge
          key={`${tag}-${index}`}
          tag={tag}
          variant={variant}
          size={size}
          removable={removable}
          editable={editable}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
      {canAddMore && onAdd && (
        <TagInput onAdd={onAdd} placeholder="Add tag..." />
      )}
    </div>
  );
}

