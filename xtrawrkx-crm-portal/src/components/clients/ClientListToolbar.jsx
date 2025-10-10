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
  Building2,
} from "lucide-react";

export default function ClientListToolbar({
  searchQuery,
  onSearch,
  filters,
  onFilterChange,
  selectedCount,
  totalCount,
  viewMode,
  onViewModeChange,
  onBulkAction,
  selectedClients,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const industryOptions = [
    { value: "all", label: "All Industries" },
    { value: "Technology", label: "Technology" },
    { value: "SaaS", label: "SaaS" },
    { value: "Consulting", label: "Consulting" },
    { value: "Research & Development", label: "Research & Development" },
    { value: "Marketing", label: "Marketing" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Finance", label: "Finance" },
    { value: "Education", label: "Education" },
    { value: "Manufacturing", label: "Manufacturing" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "prospect", label: "Prospect" },
    { value: "on-hold", label: "On Hold" },
    { value: "inactive", label: "Inactive" },
  ];

  const ownerOptions = [
    { value: "all", label: "All Owners" },
    { value: "John Smith", label: "John Smith" },
    { value: "Jane Doe", label: "Jane Doe" },
    { value: "Mike Johnson", label: "Mike Johnson" },
  ];

  const bulkActions = [
    {
      id: "email",
      label: "Send Email",
      icon: Mail,
      action: () => onBulkAction("email", selectedClients),
    },
    {
      id: "call",
      label: "Log Call",
      icon: Phone,
      action: () => onBulkAction("call", selectedClients),
    },
    {
      id: "tag",
      label: "Add Tag",
      icon: Tag,
      action: () => onBulkAction("tag", selectedClients),
    },
    {
      id: "assign",
      label: "Assign Owner",
      icon: UserPlus,
      action: () => onBulkAction("assign", selectedClients),
    },
    {
      id: "export",
      label: "Export",
      icon: Download,
      action: () => onBulkAction("export", selectedClients),
    },
    {
      id: "archive",
      label: "Archive",
      icon: Archive,
      action: () => onBulkAction("archive", selectedClients),
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      action: () => onBulkAction("delete", selectedClients),
      destructive: true,
    },
  ];

  const clearAllFilters = () => {
    onFilterChange("industry", "all");
    onFilterChange("status", "all");
    onFilterChange("owner", "all");
  };

  const hasActiveFilters = 
    filters.industry !== "all" ||
    filters.status !== "all" ||
    filters.owner !== "all";

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
              placeholder="Search clients..."
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
                  filters.industry !== "all" ? 1 : 0,
                  filters.status !== "all" ? 1 : 0,
                  filters.owner !== "all" ? 1 : 0,
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
            {totalCount} clients
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Industry Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                value={filters.industry}
                onChange={(e) => onFilterChange("industry", e.target.value)}
                className="input py-2"
              >
                {industryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

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
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                <Building2 className="w-4 h-4" />
                Save View
              </button>
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

