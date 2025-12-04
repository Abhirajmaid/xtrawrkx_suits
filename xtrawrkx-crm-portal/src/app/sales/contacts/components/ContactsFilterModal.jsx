import { useState } from "react";
import { X, Filter, Calendar, User, Mail, Phone } from "lucide-react";
import { Card, Button, Input, Select } from "../../../../components/ui";

export default function ContactsFilterModal({
  isOpen,
  onClose,
  onApplyFilters,
}) {
  const [filters, setFilters] = useState({
    status: "",
    company: "",
    title: "",
    dateRange: "",
    source: "",
    role: "",
  });

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
      status: "",
      company: "",
      title: "",
      dateRange: "",
      source: "",
      role: "",
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
                  Filter Contacts
                </h2>
                <p className="text-sm text-gray-500">
                  Refine your contact search
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
                <User className="w-4 h-4 inline mr-2" />
                Status
              </label>
              <Select
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                options={[
                  { value: "", label: "All Statuses" },
                  { value: "ACTIVE", label: "Active" },
                  { value: "NEW", label: "New" },
                  { value: "QUALIFIED", label: "Qualified" },
                  { value: "INACTIVE", label: "Inactive" },
                ]}
                placeholder="Select an option"
                className="w-full"
              />
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
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

            {/* Title Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Job Title
              </label>
              <Input
                type="text"
                placeholder="Filter by title..."
                value={filters.title}
                onChange={(e) => handleFilterChange("title", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Role
              </label>
              <Select
                value={filters.role}
                onChange={(value) => handleFilterChange("role", value)}
                options={[
                  { value: "", label: "All Roles" },
                  { value: "PRIMARY_CONTACT", label: "Primary Contact" },
                  { value: "DECISION_MAKER", label: "Decision Maker" },
                  { value: "INFLUENCER", label: "Influencer" },
                  { value: "TECHNICAL_CONTACT", label: "Technical Contact" },
                  { value: "GATEKEEPER", label: "Gatekeeper" },
                ]}
                placeholder="Select an option"
                className="w-full"
              />
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date Added
              </label>
              <Select
                value={filters.dateRange}
                onChange={(value) => handleFilterChange("dateRange", value)}
                options={[
                  { value: "", label: "All Time" },
                  { value: "today", label: "Today" },
                  { value: "week", label: "This Week" },
                  { value: "month", label: "This Month" },
                  { value: "quarter", label: "This Quarter" },
                ]}
                placeholder="Select an option"
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
