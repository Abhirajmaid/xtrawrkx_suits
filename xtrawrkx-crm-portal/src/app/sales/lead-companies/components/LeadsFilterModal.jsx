import { useState } from 'react';
import { X, Filter, Calendar, User, Building2, DollarSign, Target } from 'lucide-react';
import { Card, Button, Input, Select } from "../../../../components/ui";

export default function LeadsFilterModal({ 
  isOpen, 
  onClose, 
  onApplyFilters,
  users = []
}) {
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    assignedTo: '',
    dateRange: '',
    valueRange: '',
    company: ''
  });

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
      source: '',
      assignedTo: '',
      dateRange: '',
      valueRange: '',
      company: ''
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
                  Filter Lead Companies
                </h2>
                <p className="text-sm text-gray-500">
                  Refine your lead company search
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
                  { value: 'new', label: 'New' },
                  { value: 'contacted', label: 'Contacted' },
                  { value: 'qualified', label: 'Qualified' },
                  { value: 'lost', label: 'Lost' }
                ]}
                placeholder="Select status"
                className="w-full"
              />
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                Source
              </label>
              <Select
                value={filters.source}
                onChange={(value) => handleFilterChange('source', value)}
                options={[
                  { value: '', label: 'All Sources' },
                  { value: 'WEBSITE', label: 'Website' },
                  { value: 'REFERRAL', label: 'Referral' },
                  { value: 'COLD_OUTREACH', label: 'Cold Outreach' },
                  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
                  { value: 'EVENT', label: 'Event' },
                  { value: 'PARTNER', label: 'Partner' },
                  { value: 'ADVERTISING', label: 'Advertising' },
                  { value: 'MANUAL', label: 'Manual' }
                ]}
                placeholder="Select source"
                className="w-full"
              />
            </div>

            {/* Assigned To Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Assigned To
              </label>
              <Select
                value={filters.assignedTo}
                onChange={(value) => handleFilterChange('assignedTo', value)}
                options={[
                  { value: '', label: 'All Assignees' },
                  ...users.map((user) => ({
                    value: (user.id || user.documentId).toString(),
                    label:
                      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                      user.username ||
                      user.email ||
                      "Unknown User",
                  }))
                ]}
                placeholder="Select assignee"
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
                onChange={(e) => handleFilterChange('company', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date Range
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

            {/* Value Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Value Range
              </label>
              <Select
                value={filters.valueRange}
                onChange={(value) => handleFilterChange('valueRange', value)}
                options={[
                  { value: '', label: 'All Values' },
                  { value: '0-25k', label: '₹0 - ₹25K' },
                  { value: '25k-50k', label: '₹25K - ₹50K' },
                  { value: '50k-100k', label: '₹50K - ₹100K' },
                  { value: '100k+', label: '₹100K+' }
                ]}
                placeholder="Select value range"
                className="w-full"
              />
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
