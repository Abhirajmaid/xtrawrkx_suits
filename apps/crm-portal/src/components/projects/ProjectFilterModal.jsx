"use client";

import { useState } from "react";
import { Input, Select, Button } from "@xtrawrkx/ui";
import { X, Filter } from "lucide-react";
import { BaseModal } from "../ui";
import { clients } from "../../lib/data/projectsData";

export default function ProjectFilterModal({ isOpen, onClose, onApplyFilters, filters, setFilters }) {
  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      client: "",
      priority: "",
      health: "",
      minBudget: "",
      maxBudget: "",
    });
  };

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
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Filter Projects</h2>
              <p className="text-xs text-gray-600">Refine your projects</p>
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
        <div className="space-y-3">
          {/* Essential Filters Only */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Client</label>
              <Select
                value={filters.client}
                onChange={(value) => setFilters({ ...filters, client: value })}
                options={[
                  { value: "", label: "All Clients" },
                  ...clients.map(client => ({ value: client, label: client }))
                ]}
                placeholder="Client"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
              <Select
                value={filters.priority}
                onChange={(value) => setFilters({ ...filters, priority: value })}
                options={[
                  { value: "", label: "All Priorities" },
                  { value: "High", label: "High" },
                  { value: "Medium", label: "Medium" },
                  { value: "Low", label: "Low" }
                ]}
                placeholder="Priority"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Health Status</label>
            <Select
              value={filters.health}
              onChange={(value) => setFilters({ ...filters, health: value })}
              options={[
                { value: "", label: "All Health Status" },
                { value: "Good", label: "Good" },
                { value: "At Risk", label: "At Risk" },
                { value: "Critical", label: "Critical" }
              ]}
              placeholder="Health Status"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min Budget ($)</label>
              <Input
                type="number"
                value={filters.minBudget}
                onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max Budget ($)</label>
              <Input
                type="number"
                value={filters.maxBudget}
                onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
                placeholder="1000000"
              />
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