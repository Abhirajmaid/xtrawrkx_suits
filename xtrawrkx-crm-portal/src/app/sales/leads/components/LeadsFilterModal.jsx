import { useState } from 'react';
import { X, Filter, Calendar, User, Building2, DollarSign } from 'lucide-react';
import { Card, Button, Input, Select } from "../../../../../../../../../../components/ui";

export default function LeadsFilterModal({ 
  isOpen, 
  onClose, 
  onApplyFilters 
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
    setFilters({
      status: '',
      source: '',
      assignedTo: '',
      dateRange: '',
      valueRange: '',
      company: ''
    });
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
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-xl flex items-center justify-center shadow-lg">
                <Filter className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Filter Leads</h2>
                <p className="text-sm text-gray-600">Refine your leads with advanced filters</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Filter Form */}
          <div className="space-y-6">
            {/* Status and Source Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <Select
                  value={filters.source}
                  onChange={(value) => handleFilterChange('source', value)}
                  options={[
                    { value: '', label: 'All Sources' },
                    { value: 'Website', label: 'Website' },
                    { value: 'LinkedIn', label: 'LinkedIn' },
                    { value: 'Referral', label: 'Referral' },
                    { value: 'Email Campaign', label: 'Email Campaign' },
                    { value: 'Trade Show', label: 'Trade Show' }
                  ]}
                  placeholder="Select source"
                />
              </div>
            </div>

            {/* Assigned To and Company Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned To
                </label>
                <Select
                  value={filters.assignedTo}
                  onChange={(value) => handleFilterChange('assignedTo', value)}
                  options={[
                    { value: '', label: 'All Assignees' },
                    { value: 'John Smith', label: 'John Smith' },
                    { value: 'Sarah Wilson', label: 'Sarah Wilson' },
                    { value: 'Emily Davis', label: 'Emily Davis' }
                  ]}
                  placeholder="Select assignee"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <Input
                  value={filters.company}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
            </div>

            {/* Date Range and Value Range Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value Range
                </label>
                <Select
                  value={filters.valueRange}
                  onChange={(value) => handleFilterChange('valueRange', value)}
                  options={[
                    { value: '', label: 'All Values' },
                    { value: '0-25k', label: '$0 - $25K' },
                    { value: '25k-50k', label: '$25K - $50K' },
                    { value: '50k-100k', label: '$50K - $100K' },
                    { value: '100k+', label: '$100K+' }
                  ]}
                  placeholder="Select value range"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="px-6 py-2.5"
            >
              Clear All
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
