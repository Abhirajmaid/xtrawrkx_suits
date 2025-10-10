"use client";

import React, { useState } from "react";
import { X, Maximize2, ExternalLink, User, Calendar } from "lucide-react";
import SubTasksSection from "../shared/SubTasksSection";
import CommentsSection from "../shared/CommentsSection";

const TaskDetailModal = ({
  isOpen,
  onClose,
  task,
  onOpenProject,
  onOpenFullPage,
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

  const modalClasses =
    "fixed inset-y-0 right-0 bg-black/50 backdrop-blur-sm flex items-center justify-end z-[80]";
  const contentClasses =
    "bg-white shadow-2xl w-[450px] h-screen max-h-screen border-l border-gray-200 flex flex-col";

  return (
    <div className={modalClasses}>
      <div className={contentClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900 truncate pr-4">
            {task.name}
          </h1>

          <div className="flex items-center gap-2">
            {/* Open Project Button */}
            <button
              onClick={() => onOpenProject?.(task.project)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors border border-blue-200"
            >
              <ExternalLink className="w-3 h-3" />
              Open Project
            </button>

            {/* Full Page Button */}
            <button
              onClick={() => {
                console.log("Full button clicked for task:", task);
                onOpenFullPage?.(task);
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded transition-colors border border-gray-200"
            >
              <Maximize2 className="w-3 h-3" />
              Full
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content - Full Height No Scroll */}
        <div className="flex-1 flex flex-col h-full">
          {/* Task Details Section - Compact */}
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <div className="grid grid-cols-2 gap-3">
              {/* Left Column */}
              <div className="space-y-2">
                {/* Project */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Project
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 bg-gradient-to-br ${task.project.color} rounded-md flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {task.project.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {task.project.name}
                    </span>
                  </div>
                </div>

                {/* Assignee */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Assignee
                  </label>
                  <div className="flex items-center gap-2">
                    {task.hasMultipleAssignees ? (
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border border-white">
                          <User className="w-2.5 h-2.5" />
                        </div>
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs border border-white">
                          <User className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                        <User className="w-2.5 h-2.5" />
                      </div>
                    )}
                    <span className="text-sm text-gray-900">
                      {typeof task.assignee === "object"
                        ? task.assignee?.name
                        : task.assignee || "Unassigned"}
                    </span>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Due Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {task.dueDate}
                      {task.time && (
                        <span className="text-orange-500 ml-1 font-medium">
                          {task.time}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-2">
                {/* Status */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${getStatusColor(task.status)}`}
                  >
                    {task.status}
                  </span>
                </div>

                {/* Progress */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Progress
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 min-w-[2rem]">
                      {task.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description - Compact */}
            <div className="mt-3">
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Description
              </label>
              <div className="bg-gray-50 rounded-md p-2">
                <p className="text-xs text-gray-700 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  pretium elit nulla, nec malesuada nisl volutpat ut. Aliquam
                  suscipit ante et viverra aliquam.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Section - Full Height */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 flex-shrink-0">
              <button
                onClick={() => setActiveTab("subtasks")}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "subtasks"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Sub-Tasks
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "comments"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Comment
              </button>
            </div>

            {/* Tab Content - Full Height */}
            <div className="flex-1 min-h-0">
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
