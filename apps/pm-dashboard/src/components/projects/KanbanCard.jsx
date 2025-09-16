"use client";

import React, { useState } from "react";
import { MoreHorizontal, User } from "lucide-react";
import CircularProgress from "../page/CircularProgress";
import TaskContextMenu from "./TaskContextMenuProject";

const KanbanCard = ({
  task,
  isDragging,
  onDragStart,
  onDragEnd,
  onDelete,
  onTaskClick,
}) => {
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
  });

  const handleContextMenuOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    setContextMenu({
      isOpen: true,
      position: {
        x: rect.right - 180,
        y: rect.top + rect.height / 2,
      },
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
    });
  };

  const handleDeleteTask = (taskToDelete) => {
    onDelete(taskToDelete);
    handleContextMenuClose();
  };

  return (
    <>
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-grab hover:shadow-md transition-all duration-200 group ${
          isDragging ? "opacity-50 rotate-3 scale-105" : ""
        }`}
        draggable
        onDragStart={(e) => onDragStart(e, task)}
        onDragEnd={onDragEnd}
        onClick={() => onTaskClick?.(task)}
      >
        {/* Task Header with Title and 3-dots */}
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-gray-800 text-sm leading-tight flex-1 pr-2">
            {task.name}
          </h4>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleContextMenuOpen(e);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Project Info */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`w-5 h-5 rounded-md bg-gradient-to-br ${task.project.color} flex items-center justify-center text-white text-xs font-bold`}
          >
            {task.project.icon}
          </div>
          <span className="text-xs text-gray-600 truncate">
            {task.project.name}
          </span>
        </div>

        {/* Bottom Row: Avatar, Date, Progress */}
        <div className="flex items-center justify-between">
          {/* Left side: Avatar and Date */}
          <div className="flex items-center gap-2">
            {task.hasMultipleAssignees ? (
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                  <User className="w-3 h-3" />
                </div>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                  <User className="w-3 h-3" />
                </div>
              </div>
            ) : (
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                <User className="w-3 h-3" />
              </div>
            )}

            <span className="text-xs text-gray-500">
              {task.dueDate}
              {task.time && (
                <span className="block text-xs text-blue-500 font-medium">
                  {task.time}
                </span>
              )}
            </span>
          </div>

          {/* Right side: Circular Progress */}
          <CircularProgress percentage={task.progress} size={32} />
        </div>
      </div>

      {/* Context Menu */}
      <TaskContextMenu
        isOpen={contextMenu.isOpen}
        onClose={handleContextMenuClose}
        position={contextMenu.position}
        task={task}
        onDelete={handleDeleteTask}
      />
    </>
  );
};

export default KanbanCard;
