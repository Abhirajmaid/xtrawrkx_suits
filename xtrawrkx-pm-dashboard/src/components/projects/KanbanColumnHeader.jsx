"use client";

import React from "react";
import { Plus, MoreHorizontal } from "lucide-react";

const KanbanColumnHeader = ({ title, count, color, onAddTask, onMoreOptions }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <h3 className="font-semibold text-brand-foreground text-sm">{title}</h3>
        <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200">
          {count}
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={onAddTask}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          title="Add task"
        >
          <Plus className="w-4 h-4 text-brand-text-light hover:text-brand-foreground" />
        </button>
        
        <button
          onClick={onMoreOptions}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4 text-brand-text-light hover:text-brand-foreground" />
        </button>
      </div>
    </div>
  );
};

export default KanbanColumnHeader;
