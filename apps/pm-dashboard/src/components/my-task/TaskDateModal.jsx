"use client";

import {
  X,
  Calendar,
  Clock,
  User,
  Flag,
  MoreHorizontal,
  CheckCircle,
  Circle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Card } from "../ui";
import TaskContextMenu from "./TaskContextMenu";

const TaskDateModal = ({ isOpen, onClose, selectedDate, tasks, title }) => {
  const modalRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    task: null,
  });

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle context menu
  const handleContextMenuOpen = (event, task) => {
    event.preventDefault();
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    const modalRect = modalRef.current.getBoundingClientRect();

    setContextMenu({
      isOpen: true,
      position: {
        x: rect.left - modalRect.left + rect.width - 180,
        y: rect.top - modalRect.top + rect.height / 2,
      },
      task,
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      task: null,
    });
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case "Completed":
      case "Done":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "In Progress":
        return {
          icon: AlertCircle,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        };
      case "In Review":
        return { icon: Clock, color: "text-blue-600", bgColor: "bg-blue-100" };
      default:
        return { icon: Circle, color: "text-gray-600", bgColor: "bg-gray-100" };
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filter tasks for the selected date
  const tasksForDate = tasks.filter((task) => {
    if (!selectedDate || !task.dueDate) return false;

    // Parse task due date and compare with selected date
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getDate() === selectedDate.getDate() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] mx-4 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {title || "Tasks for"}
              </h2>
              <p className="text-sm text-gray-600">
                {formatDate(selectedDate)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {tasksForDate.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tasks scheduled
              </h3>
              <p className="text-gray-500">
                There are no tasks scheduled for {formatDate(selectedDate)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {tasksForDate.length}{" "}
                  {tasksForDate.length === 1 ? "Task" : "Tasks"}
                </h3>
                <div className="text-sm text-gray-500">
                  {
                    tasksForDate.filter(
                      (t) => t.status === "Completed" || t.status === "Done"
                    ).length
                  }{" "}
                  completed
                </div>
              </div>

              {tasksForDate.map((task) => {
                const statusInfo = getStatusInfo(task.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <Card
                    key={task.id}
                    glass={true}
                    className="p-0 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`w-8 h-8 ${statusInfo.bgColor} rounded-lg flex items-center justify-center mt-1`}
                          >
                            <StatusIcon
                              className={`w-4 h-4 ${statusInfo.color}`}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {task.name}
                            </h4>
                            {task.project && (
                              <div className="flex items-center gap-2 mb-2">
                                <div
                                  className={`w-4 h-4 bg-gradient-to-br ${task.project.color} rounded-md flex items-center justify-center`}
                                >
                                  <span className="text-white font-bold text-xs">
                                    {task.project.icon}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-600">
                                  {task.project.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {task.priority && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}
                            >
                              <Flag className="w-3 h-3 inline mr-1" />
                              {task.priority}
                            </span>
                          )}
                          <button
                            onClick={(e) => handleContextMenuOpen(e, task)}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      {/* Task Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{task.assignee || "Unassigned"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{task.time || "No time set"}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {task.progress !== undefined && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              Progress
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {task.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs px-3 py-1 rounded-full border ${statusInfo.bgColor} ${statusInfo.color}`}
                        >
                          {task.status}
                        </span>
                        <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          View Details
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {tasksForDate.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-white/20 bg-gray-50/50">
            <div className="text-sm text-gray-600">
              {
                tasksForDate.filter(
                  (t) => t.status === "Completed" || t.status === "Done"
                ).length
              }{" "}
              of {tasksForDate.length} tasks completed
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add New Task
            </button>
          </div>
        )}

        {/* Context Menu */}
        {contextMenu.isOpen && (
          <div className="relative">
            <TaskContextMenu
              isOpen={contextMenu.isOpen}
              onClose={handleContextMenuClose}
              position={contextMenu.position}
              task={contextMenu.task}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDateModal;
