"use client";

import React, { useState, useEffect } from "react";
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

  // Reset active tab when task changes
  useEffect(() => {
    if (task?.id) {
      console.log("TaskDetailModal: Task changed, resetting to subtasks tab");
      setActiveTab("subtasks");
    }
  }, [task?.id]);

  if (!isOpen || !task) return null;

  console.log("TaskDetailModal rendered with task:", task);
  console.log("TaskDetailModal onOpenFullPage:", onOpenFullPage);

  // Ensure task has required properties with fallbacks
  const safeTask = {
    ...task, // Include all original task properties (including subtasks, comments)
    id: task.id, // Explicitly preserve the ID
    name: task.name || "Untitled Task",
    project: task.project || {
      name: "Unknown Project",
      color: "from-gray-400 to-gray-600",
      icon: "?",
    },
    assignee: task.assignee || "Unassigned",
    dueDate: task.dueDate || "No due date",
    time: task.time || null,
    status: task.status || "To Do",
    progress: task.progress || 0,
    hasMultipleAssignees: task.hasMultipleAssignees || false,
    // Explicitly preserve enriched data
    subtasks: task.subtasks || [],
    comments: task.comments || [],
  };

  console.log("TaskDetailModal safeTask subtasks:", safeTask.subtasks);
  console.log("TaskDetailModal safeTask comments:", safeTask.comments);

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "In Review":
  //       return "bg-green-100 text-green-700 border-green-200";
  //     case "In Progress":
  //       return "bg-blue-100 text-blue-700 border-blue-200";
  //     case "Done":
  //       return "bg-green-100 text-green-700 border-green-200";
  //     case "To Do":
  //       return "bg-orange-100 text-orange-700 border-orange-200";
  //     case "Backlog":
  //       return "bg-purple-100 text-purple-700 border-purple-200";
  //     default:
  //       return "bg-gray-100 text-gray-700 border-gray-200";
  //   }
  // };

  const modalClasses =
    "fixed inset-y-0 right-0 bg-black/50 backdrop-blur-sm flex items-center justify-end z-[80]";
  const contentClasses =
    "bg-white shadow-2xl w-[500px] h-screen max-h-screen border-l border-gray-200 flex flex-col";

  return (
    <div className={modalClasses}>
      <div className={contentClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 truncate pr-4">
            {safeTask.name}
          </h1>

          <div className="flex items-center gap-2">
            {/* Open Project Button */}
            <button
              onClick={() => onOpenProject?.(safeTask.project)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
            >
              <ExternalLink className="w-4 h-4" />
              Open Project
            </button>

            {/* Full Page Button */}
            <button
              onClick={() => {
                console.log("Full button clicked for task:", safeTask);
                console.log("onOpenFullPage function:", onOpenFullPage);
                if (onOpenFullPage) {
                  onOpenFullPage(safeTask);
                } else {
                  console.error("onOpenFullPage function is not provided!");
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
            >
              <Maximize2 className="w-4 h-4" />
              Full
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content - Full Height No Scroll */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          {/* Task Details Section */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Project */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">
                    Project
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm font-bold">
                      ?
                    </div>
                    <span className="text-sm text-gray-900">
                      {safeTask.project?.name || "Unknown Project"}
                    </span>
                  </div>
                </div>

                {/* Assignee */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">
                    Assignee
                  </label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {typeof safeTask.assignee === "object"
                        ? safeTask.assignee?.name || "Unassigned"
                        : safeTask.assignee || "Unassigned"}
                    </span>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">
                    Due Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {safeTask.dueDate || "No due date"}
                      {safeTask.time && (
                        <span className="text-orange-500 ml-1 font-medium">
                          {safeTask.time}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">
                    Description
                  </label>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {task.description ||
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pretium elit nulla, nec malesuada nisl volutpat ut. Aliquam suscipit ante et viverra aliquam."}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">
                    Status
                  </label>
                  <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                    {safeTask.status}
                  </span>
                </div>

                {/* Progress */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">
                    Progress
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${safeTask.progress || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 min-w-[3rem]">
                      {safeTask.progress || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section - Full Height */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 flex-shrink-0 px-6">
              <button
                onClick={() => setActiveTab("subtasks")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "subtasks"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Sub-Tasks
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
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
                <SubTasksSection task={safeTask} />
              ) : (
                <CommentsSection task={safeTask} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
