"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  Download,
  Upload,
  Mail,
  Phone,
  Tag,
  Trash2,
  Archive,
  UserPlus,
  Settings,
  ChevronDown,
  X,
} from "lucide-react";

export default function ContactListToolbar({
  searchQuery,
  onSearch,
  filters,
  onFilterChange,
  selectedCount,
  totalCount,
  viewMode,
  onViewModeChange,
  onBulkAction,
  selectedContacts,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "prospect", label: "Prospect" },
    { value: "inactive", label: "Inactive" },
  ];

  const ownerOptions = [
    { value: "all", label: "All Owners" },
    { value: "John Smith", label: "John Smith" },
    { value: "Jane Doe", label: "Jane Doe" },
    { value: "Mike Johnson", label: "Mike Johnson" },
  ];

  const leadSourceOptions = [
    { value: "all", label: "All Sources" },
    { value: "website", label: "Website" },
    { value: "referral", label: "Referral" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "email-campaign", label: "Email Campaign" },
    { value: "conference", label: "Conference" },
    { value: "cold-call", label: "Cold Call" },
  ];

  const tagOptions = [
    "hot-lead",
    "enterprise",
    "startup",
    "technical",
    "high-value",
    "product",
    "mid-market",
    "ceo",
    "priority",
  ];

  const bulkActions = [
    {
      id: "email",
      label: "Send Email",
      icon: Mail,
      action: () => onBulkAction("email", selectedContacts),
    },
    {
      id: "call",
      label: "Log Call",
      icon: Phone,
      action: () => onBulkAction("call", selectedContacts),
    },
    {
      id: "tag",
      label: "Add Tag",
      icon: Tag,
      action: () => onBulkAction("tag", selectedContacts),
    },
    {
      id: "archive",
      label: "Archive",
      icon: Archive,
      action: () => onBulkAction("archive", selectedContacts),
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      action: () => onBulkAction("delete", selectedContacts),
      destructive: true,
    },
  ];

  const handleTagToggle = (tag) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFilterChange("tags", newTags);
  };

  const clearAllFilters = () => {
    onFilterChange("status", "all");
    onFilterChange("owner", "all");
    onFilterChange("leadSource", "all");
    onFilterChange("tags", []);
  };

  const hasActiveFilters = 
    filters.status !== "all" ||
    filters.owner !== "all" ||
    filters.leadSource !== "all" ||
    (filters.tags && filters.tags.length > 0);

  return (
    <div className="bg-white rounded-xl shadow-card border border-brand-border/50 p-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section - Search and Filters */}
        <div className="flex items-center gap-4 flex-1">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="input pl-10 pr-4 py-2 w-full"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              showFilters || hasActiveFilters
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="bg-white text-brand-primary text-xs px-1.5 py-0.5 rounded-full">
                {[
                  filters.status !== "all" ? 1 : 0,
                  filters.owner !== "all" ? 1 : 0,
                  filters.leadSource !== "all" ? 1 : 0,
                  filters.tags?.length || 0,
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange("table")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-white text-brand-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-brand-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Section - Bulk Actions and Count */}
        <div className="flex items-center gap-3">
          {/* Selection Count */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <span className="text-sm font-medium">
                {selectedCount} selected
              </span>
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="p-1 hover:bg-blue-100 rounded transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Total Count */}
          <div className="text-sm text-gray-500">
            {totalCount} contacts
          </div>

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => onFilterChange("status", e.target.value)}
                className="input py-2"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Owner Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner
              </label>
              <select
                value={filters.owner}
                onChange={(e) => onFilterChange("owner", e.target.value)}
                className="input py-2"
              >
                {ownerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Lead Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lead Source
              </label>
              <select
                value={filters.leadSource}
                onChange={(e) => onFilterChange("leadSource", e.target.value)}
                className="input py-2"
              >
                {leadSourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Tags Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.tags?.includes(tag)
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Dropdown */}
      {showBulkActions && selectedCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Bulk Actions:
            </span>
            <div className="flex items-center gap-2">
              {bulkActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                      action.destructive
                        ? "text-red-600 border-red-300 hover:bg-red-50"
                        : "text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
