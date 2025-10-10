"use client";

import { useState } from "react";
import { Input, Select, Button } from "@xtrawrkx/ui";
import { X, Filter } from "lucide-react";
import { BaseModal } from "../ui";

export default function ClientFilterModal({ isOpen, onClose, onApplyFilters, filters, setFilters }) {
  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      industry: "all",
      status: "all",
      owner: "all",
    });
  };

  const industries = [
    "Technology", "Healthcare", "Finance", "Manufacturing", "Retail", 
    "Consulting", "SaaS", "Marketing", "Education", "Real Estate"
  ];

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "prospect", label: "Prospect" },
    { value: "active", label: "Active" },
    { value: "on-hold", label: "On Hold" },
    { value: "inactive", label: "Inactive" }
  ];

  const owners = [
    "John Smith", "Jane Doe", "Mike Johnson", "Sarah Wilson", "Alex Brown"
  ];

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="small">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <Filter className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Filter Clients</h2>
              <p className="text-xs text-gray-600">Refine your client list</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Industry Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <Select
              value={filters.industry}
              onChange={(value) => setFilters({ ...filters, industry: value })}
              options={[
                { value: "all", label: "All Industries" },
                ...industries.map(industry => ({ value: industry, label: industry }))
              ]}
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Select
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              options={statuses}
            />
          </div>

          {/* Owner Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Owner</label>
            <Select
              value={filters.owner}
              onChange={(value) => setFilters({ ...filters, owner: value })}
              options={[
                { value: "all", label: "All Owners" },
                ...owners.map(owner => ({ value: owner, label: owner }))
              ]}
            />
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Created Date</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="From"
                className="text-sm"
              />
              <Input
                type="date"
                placeholder="To"
                className="text-sm"
              />
            </div>
          </div>

          {/* Engagement Score Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Engagement Score</label>
            <Select
              value="all"
              onChange={() => {}}
              options={[
                { value: "all", label: "All Scores" },
                { value: "high", label: "High (80-100)" },
                { value: "medium", label: "Medium (50-79)" },
                { value: "low", label: "Low (0-49)" }
              ]}
            />
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {["enterprise", "startup", "vip", "high-value", "priority", "technology"].map(tag => (
                <button
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm"
          >
            Clear All
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
