"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Plus,
  GripVertical,
  X
} from "lucide-react";

const ColumnsDropdown = ({ isOpen, onClose, onToggle, anchorRef }) => {
  const [columns, setColumns] = useState([
    { id: 'task-name', name: 'Task Name', visible: true, locked: true },
    { id: 'project', name: 'Project', visible: true, locked: false },
    { id: 'assignee', name: 'Assignee', visible: true, locked: false },
    { id: 'due-date', name: 'Due Date', visible: true, locked: false },
    { id: 'status', name: 'Status', visible: true, locked: false },
    { id: 'progress', name: 'Progress', visible: true, locked: false }
  ]);

  const [newColumnName, setNewColumnName] = useState('');
  const [showAddColumn, setShowAddColumn] = useState(false);
  const dropdownRef = useRef(null);

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

  const toggleColumnVisibility = (columnId) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const newColumn = {
        id: newColumnName.toLowerCase().replace(/\s+/g, '-'),
        name: newColumnName,
        visible: true,
        locked: false
      };
      setColumns([...columns, newColumn]);
      setNewColumnName('');
      setShowAddColumn(false);
    }
  };

  const removeColumn = (columnId) => {
    setColumns(columns.filter(col => col.id !== columnId));
  };

  if (!isOpen) return null;

  // Get position from anchor element
  const getDropdownPosition = () => {
    if (!anchorRef.current) return { top: 0, left: 0 };
    
    const rect = anchorRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      left: rect.left
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
          <h3 className="font-semibold text-gray-900">Columns</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Column List */}
      <div className="p-2 max-h-80 overflow-y-auto">
        <div className="space-y-1">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group"
            >
              {/* Drag Handle */}
              <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded cursor-grab">
                <GripVertical className="w-3 h-3 text-gray-400" />
              </button>

              {/* Visibility Toggle */}
              <button
                onClick={() => !column.locked && toggleColumnVisibility(column.id)}
                className={`p-1 rounded ${column.locked ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200'}`}
                disabled={column.locked}
              >
                {column.visible ? (
                  <Eye className="w-4 h-4 text-blue-500" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Column Name */}
              <span className={`flex-1 text-sm ${column.visible ? 'text-gray-900' : 'text-gray-500'}`}>
                {column.name}
              </span>

              {/* Remove Button */}
              {!column.locked && (
                <button
                  onClick={() => removeColumn(column.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add New Column */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          {!showAddColumn ? (
            <button
              onClick={() => setShowAddColumn(true)}
              className="w-full flex items-center gap-2 p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add new column
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="Column name"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddColumn();
                  } else if (e.key === 'Escape') {
                    setShowAddColumn(false);
                    setNewColumnName('');
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddColumn}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddColumn(false);
                    setNewColumnName('');
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColumnsDropdown;
