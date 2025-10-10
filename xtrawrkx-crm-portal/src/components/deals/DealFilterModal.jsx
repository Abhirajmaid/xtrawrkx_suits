"use client";

import { useState } from "react";
import { Card, Button, Input, Select } from "../../../../../../../../components/ui";
import { X, Filter } from "lucide-react";

export default function DealFilterModal({ isOpen, onClose, onApplyFilters, filters, setFilters }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      stage: "",
      priority: "",
      assignee: "",
      company: "",
      minValue: "",
      maxValue: "",
      probability: "",
      daysInStage: "",
    };
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const handleClose = () => {
    setLocalFilters(filters); // Reset to original filters
    onClose();
  };

  const updateFilter = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card 
        glass={true}
        className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl max-h-[85vh] flex flex-col"
      >
        {/* Header - Fixed */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
                <Filter className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Filter Deals</h2>
                <p className="text-xs text-gray-600">Refine your deals</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {/* Essential Filters Only */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <Select
                  value={localFilters.stage}
                  onChange={(value) => updateFilter('stage', value)}
                  options={[
                    { value: "", label: "All Stages" },
                    { value: "discovery", label: "Discovery" },
                    { value: "proposal", label: "Proposal" },
                    { value: "negotiation", label: "Negotiation" }
                  ]}
                  placeholder="Stage"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <Select
                  value={localFilters.priority}
                  onChange={(value) => updateFilter('priority', value)}
                  options={[
                    { value: "", label: "All Priorities" },
                    { value: "high", label: "High" },
                    { value: "medium", label: "Medium" },
                    { value: "low", label: "Low" }
                  ]}
                  placeholder="Priority"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Company
              </label>
              <Input
                value={localFilters.company}
                onChange={(e) => updateFilter('company', e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            {/* Deal Value Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Min Value ($)
                </label>
                <Input
                  type="number"
                  value={localFilters.minValue}
                  onChange={(e) => updateFilter('minValue', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Max Value ($)
                </label>
                <Input
                  type="number"
                  value={localFilters.maxValue}
                  onChange={(e) => updateFilter('maxValue', e.target.value)}
                  placeholder="1000000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClear}
              className="px-4 py-2 text-sm"
            >
              Clear All
            </Button>
            <Button
              onClick={handleApply}
              className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}