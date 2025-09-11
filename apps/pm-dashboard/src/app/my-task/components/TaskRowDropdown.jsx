"use client";

import React from "react";
import { Eye, Edit, MessageSquare } from "lucide-react";

const TaskRowDropdown = ({ isOpen, task, onClose, onTaskDetail, onOpenProject, onEditTask }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mt-2 w-full">
      {/* Task Actions */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => {
            onTaskDetail?.(task);
            onClose();
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          Task Detail
        </button>
        
        <button
          onClick={() => {
            onOpenProject?.(task);
            onClose();
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Open Project
        </button>
        
        <button
          onClick={() => {
            onEditTask?.(task);
            onClose();
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Task
        </button>
      </div>

      {/* Task Details */}
      <div className="space-y-3 pt-3 border-t border-gray-100">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{task.name}</h4>
          <p className="text-xs text-gray-600">
            Due: {task.dueDate}{task.time ? ` at ${task.time}` : ''}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 bg-gradient-to-br ${task.project.color} rounded-md flex items-center justify-center`}
            >
              <span className="text-white font-bold text-xs">
                {task.project.icon}
              </span>
            </div>
            <span className="text-xs text-gray-600">{task.project.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{task.progress}%</span>
            <div className="w-16 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Assignee: {task.assignee}</span>
          <span
            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
              task.status === "In Review"
                ? "bg-green-100 text-green-700 border-green-200"
                : task.status === "In Progress"
                ? "bg-blue-100 text-blue-700 border-blue-200"
                : task.status === "Done"
                ? "bg-green-100 text-green-700 border-green-200"
                : task.status === "To Do"
                ? "bg-orange-100 text-orange-700 border-orange-200"
                : "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {task.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskRowDropdown;
