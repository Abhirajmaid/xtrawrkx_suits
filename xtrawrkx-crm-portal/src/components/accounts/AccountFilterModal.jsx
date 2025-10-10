"use client";

import { useState } from "react";
import { Card, Button, Input, Select } from "../../components/ui";
import { X, Filter } from "lucide-react";

export default function AccountFilterModal({ isOpen, onClose, onApplyFilters, filters, setFilters }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      type: "",
      industry: "",
      owner: "",
      minRevenue: "",
      maxRevenue: "",
      healthScore: "",
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
        className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-xl flex items-center justify-center shadow-lg">
                <Filter className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Filter Accounts</h2>
                <p className="text-sm text-gray-600">Refine your accounts with advanced filters</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <Select
                value={localFilters.type}
                onChange={(value) => updateFilter('type', value)}
                options={[
                  { value: "", label: "All Types" },
                  { value: "Customer", label: "Customer" },
                  { value: "Prospect", label: "Prospect" },
                  { value: "Partner", label: "Partner" },
                  { value: "Vendor", label: "Vendor" }
                ]}
                placeholder="Select account type"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <Select
                value={localFilters.industry}
                onChange={(value) => updateFilter('industry', value)}
                options={[
                  { value: "", label: "All Industries" },
                  { value: "Technology", label: "Technology" },
                  { value: "Manufacturing", label: "Manufacturing" },
                  { value: "Healthcare", label: "Healthcare" },
                  { value: "Finance", label: "Finance" },
                  { value: "Retail", label: "Retail" },
                  { value: "Education", label: "Education" },
                  { value: "Energy", label: "Energy" },
                  { value: "Marketing", label: "Marketing" },
                  { value: "Consulting", label: "Consulting" },
                  { value: "Real Estate", label: "Real Estate" }
                ]}
                placeholder="Select industry"
              />
            </div>

            {/* Account Owner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Owner
              </label>
              <Select
                value={localFilters.owner}
                onChange={(value) => updateFilter('owner', value)}
                options={[
                  { value: "", label: "All Owners" },
                  { value: "John Smith", label: "John Smith" },
                  { value: "Emily Davis", label: "Emily Davis" },
                  { value: "Sarah Wilson", label: "Sarah Wilson" },
                  { value: "Mike Johnson", label: "Mike Johnson" },
                  { value: "Lisa Brown", label: "Lisa Brown" }
                ]}
                placeholder="Select owner"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleClear}
                className="px-6 py-2.5"
              >
                Clear All
              </Button>
              <Button
                onClick={handleApply}
                className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
