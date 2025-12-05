"use client";

import { useState, useEffect } from "react";
import { X, Filter, Calendar, User, Building2, Target, DollarSign, TrendingUp } from "lucide-react";
import { Card, Button, Input, Select } from "../../../../components/ui";

export default function DealsFilterModal({ isOpen, onClose, onApplyFilters, users = [], appliedFilters = {} }) {
  const [filters, setFilters] = useState({
    stage: "",
    priority: "",
    owner: "",
    company: "",
    valueMin: "",
    valueMax: "",
    probabilityMin: "",
    probabilityMax: "",
    closeDateFrom: "",
    closeDateTo: "",
  });

  // Initialize filters with applied filters when modal opens
  useEffect(() => {
    if (isOpen) {
      // Map "qualified" to "proposal" since they both map to PROPOSAL in API
      let stageValue = appliedFilters.stage || "";
      if (stageValue === "qualified") {
        stageValue = "proposal";
      }
      
      setFilters({
        stage: stageValue,
        priority: appliedFilters.priority || "",
        owner: appliedFilters.owner || "",
        company: appliedFilters.company || "",
        valueMin: appliedFilters.valueMin || "",
        valueMax: appliedFilters.valueMax || "",
        probabilityMin: appliedFilters.probabilityMin || "",
        probabilityMax: appliedFilters.probabilityMax || "",
        closeDateFrom: appliedFilters.closeDateFrom || "",
        closeDateTo: appliedFilters.closeDateTo || "",
      });
    }
  }, [isOpen, appliedFilters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      stage: "",
      priority: "",
      owner: "",
      company: "",
      valueMin: "",
      valueMax: "",
      probabilityMin: "",
      probabilityMax: "",
      closeDateFrom: "",
      closeDateTo: "",
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card
        glass={true}
        className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Filter Deals
                </h2>
                <p className="text-sm text-gray-500">
                  Refine your deal search
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Stage Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                Stage
              </label>
              <Select
                value={filters.stage}
                onChange={(value) => handleFilterChange("stage", value)}
                options={[
                  { value: "", label: "All Stages" },
                  { value: "new", label: "Discovery" },
                  { value: "proposal", label: "Proposal" },
                  { value: "negotiation", label: "Negotiation" },
                  { value: "won", label: "Won" },
                  { value: "lost", label: "Lost" },
                ]}
                placeholder="Select an option"
                className="w-full"
              />
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Priority
              </label>
              <Select
                value={filters.priority}
                onChange={(value) => handleFilterChange("priority", value)}
                options={[
                  { value: "", label: "All Priorities" },
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" },
                ]}
                placeholder="Select an option"
                className="w-full"
              />
            </div>

            {/* Owner Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Owner
              </label>
              <Select
                value={filters.owner}
                onChange={(value) => handleFilterChange("owner", value)}
                options={[
                  { value: "", label: "All Owners" },
                  ...users.map((user) => {
                    const userId = (user.id || user.documentId).toString();
                    const userName =
                      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                      user.username ||
                      user.email ||
                      "Unknown User";
                    return {
                      value: userId,
                      label: userName,
                    };
                  }),
                ]}
                placeholder="Select an option"
                className="w-full"
              />
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                Company
              </label>
              <Input
                type="text"
                placeholder="Filter by company..."
                value={filters.company}
                onChange={(e) => handleFilterChange("company", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Deal Value Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Deal Value Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Min value (₹)"
                  value={filters.valueMin}
                  onChange={(e) => handleFilterChange("valueMin", e.target.value)}
                  className="w-full"
                />
                <Input
                  type="number"
                  placeholder="Max value (₹)"
                  value={filters.valueMax}
                  onChange={(e) => handleFilterChange("valueMax", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Probability Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Probability Range (%)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Min %"
                  value={filters.probabilityMin}
                  onChange={(e) =>
                    handleFilterChange("probabilityMin", e.target.value)
                  }
                  className="w-full"
                />
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Max %"
                  value={filters.probabilityMax}
                  onChange={(e) =>
                    handleFilterChange("probabilityMax", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Close Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Expected Close Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={filters.closeDateFrom}
                  onChange={(e) =>
                    handleFilterChange("closeDateFrom", e.target.value)
                  }
                  className="w-full"
                />
                <Input
                  type="date"
                  value={filters.closeDateTo}
                  onChange={(e) =>
                    handleFilterChange("closeDateTo", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear All
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="bg-orange-500 hover:bg-orange-600 text-white"
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
