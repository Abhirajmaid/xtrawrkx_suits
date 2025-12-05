"use client";

import { useState, useEffect } from "react";
import { X, Filter, Calendar, User, Target, FolderOpen, TrendingUp } from "lucide-react";
import { Card, Button, Input, Select } from "../ui";

export default function ProjectsFilterModal({ 
  isOpen, 
  onClose, 
  onApplyFilters,
  users = [],
  appliedFilters = {}
}) {
  const [filters, setFilters] = useState({
    status: '',
    projectManager: '',
    dateRange: '',
    startDateFrom: '',
    startDateTo: '',
    endDateFrom: '',
    endDateTo: '',
  });

  // Initialize filters with applied filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setFilters({
        status: appliedFilters.status || '',
        projectManager: appliedFilters.projectManager || '',
        dateRange: appliedFilters.dateRange || '',
        startDateFrom: appliedFilters.startDateFrom || '',
        startDateTo: appliedFilters.startDateTo || '',
        endDateFrom: appliedFilters.endDateFrom || '',
        endDateTo: appliedFilters.endDateTo || '',
      });
    }
  }, [isOpen, appliedFilters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      projectManager: '',
      dateRange: '',
      startDateFrom: '',
      startDateTo: '',
      endDateFrom: '',
      endDateTo: '',
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
                  Filter Projects
                </h2>
                <p className="text-sm text-gray-500">
                  Refine your project search
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
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                Status
              </label>
              <Select
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'planning', label: 'Planning' },
                  { value: 'active', label: 'Active' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'on-hold', label: 'On Hold' },
                  { value: 'cancelled', label: 'Cancelled' }
                ]}
                placeholder="Select status"
                className="w-full"
              />
            </div>

            {/* Project Manager Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Project Manager
              </label>
              <Select
                value={filters.projectManager}
                onChange={(value) => handleFilterChange('projectManager', value)}
                options={[
                  { value: '', label: 'All Managers' },
                  ...users.map((user) => ({
                    value: (user.id || user._id || user.documentId)?.toString(),
                    label:
                      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                      user.username ||
                      user.email ||
                      user.name ||
                      "Unknown User",
                  }))
                ]}
                placeholder="Select project manager"
                className="w-full"
              />
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Created Date Range
              </label>
              <Select
                value={filters.dateRange}
                onChange={(value) => handleFilterChange('dateRange', value)}
                options={[
                  { value: '', label: 'All Time' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' },
                  { value: 'quarter', label: 'This Quarter' }
                ]}
                placeholder="Select date range"
                className="w-full"
              />
            </div>

            {/* Start Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Start Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  placeholder="From"
                  value={filters.startDateFrom}
                  onChange={(e) => handleFilterChange('startDateFrom', e.target.value)}
                  className="w-full"
                />
                <Input
                  type="date"
                  placeholder="To"
                  value={filters.startDateTo}
                  onChange={(e) => handleFilterChange('startDateTo', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* End Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                End Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  placeholder="From"
                  value={filters.endDateFrom}
                  onChange={(e) => handleFilterChange('endDateFrom', e.target.value)}
                  className="w-full"
                />
                <Input
                  type="date"
                  placeholder="To"
                  value={filters.endDateTo}
                  onChange={(e) => handleFilterChange('endDateTo', e.target.value)}
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

