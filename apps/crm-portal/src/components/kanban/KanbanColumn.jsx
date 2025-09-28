"use client";

import React from "react";
import { formatNumber } from "../../lib/utils";
import { Plus, MoreHorizontal } from "lucide-react";

export default function KanbanColumn({
  column,
  columnIndex,
  isDragOver = false,
  showStats = true,
  onClick,
  children,
  droppableProps = {},
  droppablePlaceholder,
}) {
  const getColumnColor = () => {
    return column.color || '#f3f4f6';
  };

  const getColumnStats = () => {
    if (!showStats) return null;
    
    const totalValue = column.items.reduce((sum, item) => sum + (item.value || 0), 0);
    const avgValue = column.items.length > 0 ? totalValue / column.items.length : 0;
    
    return {
      count: column.items.length,
      totalValue,
      avgValue,
    };
  };

  const stats = getColumnStats();

  return (
    <div
      className={`flex-shrink-0 w-80 bg-white rounded-xl shadow-card border border-brand-border/50 transition-all duration-200 ${
        isDragOver ? 'ring-2 ring-brand-primary/50 bg-brand-primary/5' : ''
      }`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-brand-border/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getColumnColor() }}
            />
            <h3 className="font-semibold text-gray-900">{column.title}</h3>
            {stats && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {stats.count}
              </span>
            )}
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {stats && stats.totalValue > 0 && (
          <div className="text-xs text-gray-500">
            Total: ${formatNumber(stats.totalValue)} | Avg: ${formatNumber(stats.avgValue)}
          </div>
        )}
      </div>

      {/* Column Content - This is the droppable area */}
      <div
        className="p-4 space-y-3 min-h-[400px]"
        {...droppableProps}
      >
        {children}
        {droppablePlaceholder}

        {/* Add Item Button */}
        <button
          onClick={() => onClick?.(column)}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-brand-primary hover:text-brand-primary transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Item</span>
        </button>
      </div>
    </div>
  );
}
