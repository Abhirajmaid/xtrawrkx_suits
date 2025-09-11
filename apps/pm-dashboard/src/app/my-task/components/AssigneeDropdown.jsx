"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  ChevronDown, 
  User, 
  Check,
  X,
  Search
} from "lucide-react";

const AssigneeDropdown = ({ isOpen, onClose, onToggle, anchorRef, selectedAssignees, onAssigneeChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const allAssignees = [
    { id: 'you', name: 'You', avatar: 'Y', color: 'bg-blue-500', isCurrentUser: true },
    { id: 'jonathan-bustos', name: 'Jonathan Bustos', avatar: 'JB', color: 'bg-blue-500' },
    { id: 'jane-cooper', name: 'Jane Cooper', avatar: 'JC', color: 'bg-green-500' },
    { id: 'sarah-wilson', name: 'Sarah Wilson', avatar: 'SW', color: 'bg-purple-500' },
    { id: 'mike-johnson', name: 'Mike Johnson', avatar: 'MJ', color: 'bg-orange-500' },
    { id: 'lisa-chen', name: 'Lisa Chen', avatar: 'LC', color: 'bg-pink-500' }
  ];

  const filteredAssignees = allAssignees.filter(assignee =>
    assignee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const toggleAssignee = (assigneeId) => {
    const newSelectedAssignees = selectedAssignees.includes(assigneeId)
      ? selectedAssignees.filter(id => id !== assigneeId)
      : [...selectedAssignees, assigneeId];
    
    onAssigneeChange(newSelectedAssignees);
  };

  const clearAllAssignees = () => {
    onAssigneeChange([]);
  };

  if (!isOpen) return null;

  // Get position from anchor element
  const getDropdownPosition = () => {
    if (!anchorRef.current) return { top: 0, left: 0 };
    
    const rect = anchorRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      left: rect.right - 320 // Align to the right edge of the anchor
    };
  };

  const position = getDropdownPosition();

  return (
    <div
      ref={dropdownRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-80"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Assignee</h3>
          <div className="flex items-center gap-2">
            {selectedAssignees.length > 0 && (
              <button
                onClick={clearAllAssignees}
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

      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assignees..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Assignee List */}
      <div className="max-h-80 overflow-y-auto">
        {filteredAssignees.map((assignee) => {
          const isSelected = selectedAssignees.includes(assignee.id);
          
          return (
            <div
              key={assignee.id}
              className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
              onClick={() => toggleAssignee(assignee.id)}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 ${assignee.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {assignee.avatar}
              </div>

              {/* Name */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {assignee.name}
                  </span>
                  {assignee.isCurrentUser && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </div>
              </div>

              {/* Check */}
              {isSelected && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          );
        })}

        {filteredAssignees.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No assignees found</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {selectedAssignees.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600">
            {selectedAssignees.length} assignee{selectedAssignees.length !== 1 ? 's' : ''} selected
          </div>
        </div>
      )}
    </div>
  );
};

export default AssigneeDropdown;
