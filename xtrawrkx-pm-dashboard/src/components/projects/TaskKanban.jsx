"use client";

import React, { useState } from "react";
import { Plus, MoreHorizontal, User } from "lucide-react";

const TaskKanban = ({
  tasks = [],
  project = null,
  onTaskClick = () => {},
  onContextMenuOpen = () => {},
  onTaskStatusChange = () => {},
}) => {
  // Drag over state for kanban
  const [draggedOver, setDraggedOver] = useState(null);

  // Group tasks by status - matching my-task page structure
  const groupedTasks = {
    Backlog: tasks.filter((task) => task.status === "Backlog"),
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    Done: tasks.filter(
      (task) => task.status === "Done" || task.status === "Completed"
    ),
  };

  // Drag and drop handlers - matching my-task page
  const handleKanbanDragStart = (e, task) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(task));
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.5";
  };

  const handleKanbanDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedOver(null);
  };

  const handleKanbanDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleKanbanDragEnter = (e, status) => {
    e.preventDefault();
    setDraggedOver(status);
  };

  const handleKanbanDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOver(null);
    }
  };

  const handleKanbanDrop = (e, newStatus) => {
    e.preventDefault();
    setDraggedOver(null);

    const taskData = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (taskData.status !== newStatus) {
      onTaskStatusChange(taskData, newStatus);
    }
  };

  const getStatusProgressCircle = (status) => {
    switch (status) {
      case "Backlog":
        return (
          <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
          </div>
        );
      case "To Do":
        return (
          <svg className="w-4 h-4 transform -rotate-90" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#fb923c"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#fb923c"
              strokeWidth="2"
              fill="none"
              strokeDasharray="20 60"
              strokeLinecap="round"
            />
          </svg>
        );
      case "In Progress":
        return (
          <svg className="w-4 h-4 transform -rotate-90" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#60a5fa"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#60a5fa"
              strokeWidth="2"
              fill="none"
              strokeDasharray="40 40"
              strokeLinecap="round"
            />
          </svg>
        );
      case "Done":
        return (
          <div className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-3 overflow-x-auto pb-6">
        {Object.entries(groupedTasks).map(([status, statusTasks]) => (
          <div
            key={status}
            className={`flex-shrink-0 w-64 transition-colors ${
              draggedOver === status ? "bg-blue-50 rounded-lg" : ""
            }`}
            onDragOver={handleKanbanDragOver}
            onDragEnter={(e) => handleKanbanDragEnter(e, status)}
            onDragLeave={handleKanbanDragLeave}
            onDrop={(e) => handleKanbanDrop(e, status)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                {getStatusProgressCircle(status)}
                <h3 className="font-bold text-sm text-gray-800">{status}</h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
                  {statusTasks.length}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Plus className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Task Cards */}
            <div className="space-y-2">
              {statusTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleKanbanDragStart(e, task)}
                  onDragEnd={handleKanbanDragEnd}
                  className="bg-white rounded-lg border border-gray-200 p-2.5 hover:shadow-md transition-all cursor-move group"
                  onClick={() => onTaskClick(task)}
                >
                  {/* Task Header with Three Dots */}
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-sm text-gray-900 leading-tight flex-1">
                      {task.name}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onContextMenuOpen(e, task);
                      }}
                      className="p-0.5 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <MoreHorizontal className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>

                  {/* Dotted Separator Line */}
                  <div className="border-b border-dashed border-gray-300 mb-3"></div>

                  {/* Middle Row: Profile • Date • Progress */}
                  <div className="flex items-center mb-3">
                    {/* Profile Circle */}
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border border-white flex items-center justify-center flex-shrink-0">
                      <User className="w-2.5 h-2.5 text-white" />
                    </div>

                    {/* Dot Separator */}
                    <div className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mx-1"></div>

                    {/* Date and Progress Circle */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-700 font-medium">
                        {new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        {task.dueTime && (
                          <span className="text-orange-500 font-semibold">
                            , {task.dueTime}
                          </span>
                        )}
                      </span>

                      <span className="text-gray-400 text-xs">•</span>

                      {/* Progress Circle */}
                      <div className="w-5 h-5 rounded-full border border-white bg-white flex items-center justify-center relative flex-shrink-0">
                        <svg
                          width="20"
                          height="20"
                          className="transform -rotate-90"
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="6"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                            fill="transparent"
                          />
                          <circle
                            cx="10"
                            cy="10"
                            r="6"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={`${(task.progress / 100) * 37.7} 37.7`}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Project Icon and Name */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 bg-gradient-to-br ${project?.color || "from-blue-500 to-blue-600"} rounded-md flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-xs">
                        {project?.icon || "P"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {project?.name || "Project"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskKanban;
