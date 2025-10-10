"use client";

import React from "react";
import {
  Eye,
  Edit,
  MessageSquare,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import { getTaskWithSubtasks } from "../../../../data/centralData";

const TaskRowDropdown = ({
  isOpen,
  task,
  onClose,
  onTaskDetail,
  onOpenProject,
  onEditTask,
}) => {
  if (!isOpen || !task) return null;

  // Get task with subtasks
  const taskWithSubtasks = getTaskWithSubtasks(task.id);
  const subtasks = taskWithSubtasks?.subtasks || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "To Do":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

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
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            {task.name}
          </h4>
          <p className="text-xs text-gray-600">
            Due:{" "}
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {task.dueTime ? ` at ${task.dueTime}` : ""}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {taskWithSubtasks?.project?.icon || "P"}
              </span>
            </div>
            <span className="text-xs text-gray-600">
              {taskWithSubtasks?.project?.name || "Project"}
            </span>
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
          <span className="text-xs text-gray-500">
            Assignee:{" "}
            {typeof task.assignee === "object"
              ? task.assignee?.name
              : task.assignee}
          </span>
          <span
            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}
          >
            {task.status}
          </span>
        </div>

        {/* Subtasks Section */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs font-semibold text-gray-700">
              Subtasks ({subtasks.length})
            </h5>
            {subtasks.length > 0 && (
              <span className="text-xs text-gray-500">
                {subtasks.filter((subtask) => subtask.status === "Done").length}{" "}
                completed
              </span>
            )}
          </div>

          {subtasks.length > 0 ? (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {subtask.status === "Done" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <span
                      className={`text-xs truncate ${subtask.status === "Done" ? "line-through text-gray-500" : "text-gray-700"}`}
                    >
                      {subtask.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {subtask.assignee && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {subtask.assignee.name}
                        </span>
                      </div>
                    )}
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(subtask.status)}`}
                    >
                      {subtask.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 text-gray-500">
              <p className="text-xs">No subtasks available</p>
              <p className="text-xs">This task has no breakdown yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskRowDropdown;
