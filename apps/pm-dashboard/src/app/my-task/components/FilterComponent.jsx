"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Filter, 
  ChevronDown, 
  X,
  Check,
  Calendar,
  User,
  BarChart3
} from "lucide-react";

const FilterComponent = ({ isOpen, onClose, onToggle, anchorRef, appliedFilters, onFiltersChange }) => {
  const [activeTab, setActiveTab] = useState('status');
  const dropdownRef = useRef(null);

  const filterOptions = {
    status: [
      { id: 'to-do', label: 'To Do', color: 'bg-orange-100 text-orange-700 border-orange-200' },
      { id: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { id: 'in-review', label: 'In Review', color: 'bg-green-100 text-green-700 border-green-200' },
      { id: 'done', label: 'Done', color: 'bg-green-100 text-green-700 border-green-200' },
      { id: 'backlog', label: 'Backlog', color: 'bg-purple-100 text-purple-700 border-purple-200' }
    ],
    assignee: [
      { id: 'only-me', label: 'Only Me', avatar: 'Y', color: 'bg-blue-500' },
      { id: 'jonathan-bustos', label: 'Jonathan Bustos', avatar: 'JB', color: 'bg-blue-500' },
      { id: 'jane-cooper', label: 'Jane Cooper', avatar: 'JC', color: 'bg-green-500' },
      { id: 'sarah-wilson', label: 'Sarah Wilson', avatar: 'SW', color: 'bg-purple-500' }
    ],
    priority: [
      { id: 'high', label: 'High', color: 'bg-red-100 text-red-700 border-red-200' },
      { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      { id: 'low', label: 'Low', color: 'bg-green-100 text-green-700 border-green-200' }
    ]
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const toggleFilter = (category, filterId) => {
    const categoryFilters = appliedFilters[category] || [];
    const newCategoryFilters = categoryFilters.includes(filterId)
      ? categoryFilters.filter(id => id !== filterId)
      : [...categoryFilters, filterId];
    
    onFiltersChange({
      ...appliedFilters,
      [category]: newCategoryFilters
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const getTotalFilterCount = () => {
    return Object.values(appliedFilters).reduce((total, filters) => total + filters.length, 0);
  };

  if (!isOpen) return null;

  // Get position from anchor element
  const getDropdownPosition = () => {
    if (!anchorRef.current) return { top: 0, left: 0 };
    
    const rect = anchorRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      left: rect.right - 400 // Align to the right edge of the anchor
    };
  };

  const position = getDropdownPosition();

  return (
    <div
      ref={dropdownRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-96"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Filter</h3>
          <div className="flex items-center gap-2">
            {getTotalFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'status'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Status
            </div>
          </button>
          <button
            onClick={() => setActiveTab('assignee')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'assignee'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              Assignee
            </div>
          </button>
          <button
            onClick={() => setActiveTab('priority')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'priority'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Priority
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className="p-4 max-h-80 overflow-y-auto">
        <div className="space-y-2">
          {filterOptions[activeTab].map((option) => {
            const isSelected = (appliedFilters[activeTab] || []).includes(option.id);
            
            return (
              <div
                key={option.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleFilter(activeTab, option.id)}
              >
                {/* Avatar for assignee */}
                {activeTab === 'assignee' && (
                  <div className={`w-6 h-6 ${option.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                    {option.avatar}
                  </div>
                )}

                {/* Label */}
                <div className="flex-1">
                  {activeTab === 'status' || activeTab === 'priority' ? (
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${option.color}`}>
                      {option.label}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">
                      {option.label}
                    </span>
                  )}
                </div>

                {/* Check */}
                {isSelected && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      {getTotalFilterCount() > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600">
            {getTotalFilterCount()} filter{getTotalFilterCount() !== 1 ? 's' : ''} applied
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
