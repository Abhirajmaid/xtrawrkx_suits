"use client";

import React, { useState } from "react";
import { 
  X, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  User, 
  Calendar, 
  BarChart3,
  FileText,
  Plus
} from "lucide-react";
import SubTasksSection from "./SubTasksSection";
import CommentsSection from "./CommentsSection";

const TaskDetailModal = ({ 
  isOpen, 
  onClose, 
  task, 
  isFullView = false, 
  onToggleView,
  onOpenProject 
}) => {
  const [activeTab, setActiveTab] = useState("subtasks");

  if (!isOpen || !task) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "In Review":
        return "bg-green-100 text-green-700 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Done":
        return "bg-green-100 text-green-700 border-green-200";
      case "To Do":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Backlog":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const modalClasses = isFullView 
    ? "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[80] p-4"
    : "fixed inset-y-0 right-0 bg-black/50 backdrop-blur-sm flex items-center justify-end z-[80]";

  const contentClasses = isFullView
    ? "bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] border border-gray-200"
    : "bg-white shadow-2xl w-[600px] h-full border-l border-gray-200";

  return (
    <div className={modalClasses}>
      <div className={contentClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">{task.name}</h1>
          
          <div className="flex items-center gap-2">
            {/* Open Project Button */}
            <button
              onClick={() => onOpenProject?.(task.project)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
            >
              <ExternalLink className="w-4 h-4" />
              Open Project
            </button>
            
            {/* Full/Half View Toggle */}
            <button
              onClick={onToggleView}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
            >
              {isFullView ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  Open Half
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  Open Full
                </>
              )}
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Task Details Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Project */}
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Project
                  </label>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 bg-gradient-to-br ${task.project.color} rounded-md flex items-center justify-center text-white text-xs font-bold`}>
                      {task.project.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {task.project.name}
                    </span>
                  </div>
                </div>

                {/* Assignee */}
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Assignee
                  </label>
                  <div className="flex items-center gap-2">
                    {task.hasMultipleAssignees ? (
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                          <User className="w-3 h-3" />
                        </div>
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                          <User className="w-3 h-3" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                        <User className="w-3 h-3" />
                      </div>
                    )}
                    <span className="text-sm text-gray-900">{task.assignee}</span>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Due Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {task.dueDate}
                      {task.time && <span className="text-gray-500 ml-1">{task.time}</span>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Status
                  </label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                {/* Progress */}
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Progress
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 min-w-[3rem]">
                      {task.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                Description
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Aliquam suscipit ante et viverra aliquam.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="flex-1 flex flex-col">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("subtasks")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "subtasks"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Sub-Tasks
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "comments"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Comment
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "subtasks" ? (
                <SubTasksSection task={task} />
              ) : (
                <CommentsSection task={task} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
