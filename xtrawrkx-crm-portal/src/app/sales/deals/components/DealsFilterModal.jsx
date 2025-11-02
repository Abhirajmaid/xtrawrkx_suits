"use client";

import { useState } from "react";
import { Modal, Button, Select, Input } from "../../../../components/ui";
import { Filter, X } from "lucide-react";

export default function DealsFilterModal({ isOpen, onClose, onApplyFilters }) {
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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
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
  };

  const stageOptions = [
    { value: "", label: "All Stages" },
    { value: "new", label: "New" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
    { value: "won", label: "Won" },
    { value: "lost", label: "Lost" },
  ];

  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Deals" size="lg">
      <div className="space-y-6">
        {/* Stage and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stage
            </label>
            <Select
              value={filters.stage}
              onChange={(e) => handleFilterChange("stage", e.target.value)}
            >
              {stageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <Select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Owner and Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner
            </label>
            <Input
              value={filters.owner}
              onChange={(e) => handleFilterChange("owner", e.target.value)}
              placeholder="Filter by owner name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <Input
              value={filters.company}
              onChange={(e) => handleFilterChange("company", e.target.value)}
              placeholder="Filter by company name"
            />
          </div>
        </div>

        {/* Deal Value Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal Value Range
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              value={filters.valueMin}
              onChange={(e) => handleFilterChange("valueMin", e.target.value)}
              placeholder="Min value"
            />
            <Input
              type="number"
              value={filters.valueMax}
              onChange={(e) => handleFilterChange("valueMax", e.target.value)}
              placeholder="Max value"
            />
          </div>
        </div>

        {/* Probability Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Probability Range (%)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              min="0"
              max="100"
              value={filters.probabilityMin}
              onChange={(e) =>
                handleFilterChange("probabilityMin", e.target.value)
              }
              placeholder="Min %"
            />
            <Input
              type="number"
              min="0"
              max="100"
              value={filters.probabilityMax}
              onChange={(e) =>
                handleFilterChange("probabilityMax", e.target.value)
              }
              placeholder="Max %"
            />
          </div>
        </div>

        {/* Close Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Close Date Range
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              value={filters.closeDateFrom}
              onChange={(e) =>
                handleFilterChange("closeDateFrom", e.target.value)
              }
            />
            <Input
              type="date"
              value={filters.closeDateTo}
              onChange={(e) =>
                handleFilterChange("closeDateTo", e.target.value)
              }
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear All
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
