"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Check, 
  X, 
  MoreHorizontal,
  User,
  Clock
} from "lucide-react";

const SubTasksSection = ({ task }) => {
  const [subtasks, setSubtasks] = useState([
    {
      id: 1,
      name: "Create Moodboard",
      completed: true,
      assignee: "Jonathan Bustos",
      createdAt: "25 min ago"
    },
    {
      id: 2,
      name: "Option 1: Gradient",
      completed: false,
      assignee: "Jonathan Bustos",
      createdAt: "19 min ago"
    }
  ]);

  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskName, setNewSubtaskName] = useState("");

  const handleAddSubtask = () => {
    if (newSubtaskName.trim()) {
      const newSubtask = {
        id: Date.now(),
        name: newSubtaskName,
        completed: false,
        assignee: "Jonathan Bustos",
        createdAt: "just now"
      };
      setSubtasks([...subtasks, newSubtask]);
      setNewSubtaskName("");
      setIsAddingSubtask(false);
    }
  };

  const toggleSubtaskComplete = (id) => {
    setSubtasks(subtasks.map(subtask => 
      subtask.id === id 
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    ));
  };

  const deleteSubtask = (id) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6">
        {/* Add Subtask Button */}
        <div className="mb-6">
          {!isAddingSubtask ? (
            <button
              onClick={() => setIsAddingSubtask(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-blue-300 w-full justify-center"
            >
              <Plus className="w-4 h-4" />
              Add sub-task
            </button>
          ) : (
            <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
              <input
                type="text"
                value={newSubtaskName}
                onChange={(e) => setNewSubtaskName(e.target.value)}
                placeholder="Enter subtask name..."
                className="flex-1 text-sm border-none outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSubtask();
                  } else if (e.key === 'Escape') {
                    setIsAddingSubtask(false);
                    setNewSubtaskName("");
                  }
                }}
              />
              <button
                onClick={handleAddSubtask}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsAddingSubtask(false);
                  setNewSubtaskName("");
                }}
                className="p-1 text-gray-400 hover:bg-gray-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Subtasks List */}
        <div className="space-y-4">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleSubtaskComplete(subtask.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  subtask.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 hover:border-green-400"
                }`}
              >
                {subtask.completed && <Check className="w-3 h-3" />}
              </button>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium ${
                    subtask.completed 
                      ? "text-gray-500 line-through" 
                      : "text-gray-900"
                  }`}>
                    {subtask.name}
                  </h4>
                  
                  {/* Actions */}
                  <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 rounded transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{subtask.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>created sub-task</span>
                  </div>
                  <span className="text-xs text-gray-400">{subtask.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {subtasks.length === 0 && !isAddingSubtask && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-4">No subtasks yet</p>
            <button
              onClick={() => setIsAddingSubtask(true)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Add your first subtask
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubTasksSection;
