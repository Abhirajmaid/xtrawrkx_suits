// Project Kanban Drag and Drop Functionality
"use client";

import { useState, useCallback, useEffect } from 'react';

export const useProjectKanbanDragDrop = (projectSlug, initialTasks) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);

  // Update tasks when initialTasks changes (when project loads)
  useEffect(() => {
    if (initialTasks && initialTasks.length > 0) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  // Handle drag start
  const handleDragStart = useCallback((e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    // Create a slightly transparent version for drag image
    e.dataTransfer.setDragImage(e.target, e.target.offsetWidth / 2, e.target.offsetHeight / 2);
  }, []);

  // Handle drag over column
  const handleDragOver = useCallback((e, columnType) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedOverColumn !== columnType) {
      setDraggedOverColumn(columnType);
    }
  }, [draggedOverColumn]);

  // Handle drag leave
  const handleDragLeave = useCallback((e) => {
    // Only clear if leaving the entire column area
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOverColumn(null);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e, newStatus) => {
    e.preventDefault();
    
    if (!draggedTask) {
      return;
    }

    // Update task status
    const updatedTasks = tasks.map(task => {
      if (task.id === draggedTask.id) {
        return {
          ...task,
          status: newStatus,
          // Update progress based on status
          progress: newStatus === "Completed" || newStatus === "Done" ? 100 :
                   newStatus === "In Progress" ? Math.max(task.progress, 25) :
                   newStatus === "To Do" ? Math.min(task.progress, 25) :
                   newStatus === "Backlog" ? 0 : task.progress
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    setDraggedTask(null);
    setDraggedOverColumn(null);
  }, [draggedTask, tasks]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDraggedOverColumn(null);
  }, []);

  // Get organized kanban columns
  const getKanbanColumns = useCallback(() => {
    return {
      "Backlog": {
        tasks: tasks.filter(task => task.status === "Backlog"),
        color: "bg-gray-400",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200"
      },
      "To Do": {
        tasks: tasks.filter(task => task.status === "To Do"),
        color: "bg-blue-400", 
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
      },
      "In Progress": {
        tasks: tasks.filter(task => task.status === "In Progress"),
        color: "bg-yellow-400",
        bgColor: "bg-yellow-50", 
        borderColor: "border-yellow-200"
      },
      "Completed": {
        tasks: tasks.filter(task => task.status === "Completed" || task.status === "Done"),
        color: "bg-green-400",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      }
    };
  }, [tasks]);

  return {
    tasks,
    draggedTask,
    draggedOverColumn,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    getKanbanColumns
  };
};

// Utility function to get drop zone styling
export const getProjectDropZoneClass = (columnType, draggedOverColumn, draggedTask) => {
  const baseClass = "bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 min-h-[500px] transition-all duration-300";
  
  if (!draggedTask) return baseClass;
  
  if (draggedOverColumn === columnType) {
    return `${baseClass} border-blue-400 border-2 bg-blue-50/50 transform scale-[1.01] shadow-lg`;
  }
  
  return `${baseClass} opacity-70 border-dashed`;
};

// Utility function to get task card styling
export const getProjectTaskCardClass = (task, draggedTask) => {
  const baseClass = "bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing group";
  
  if (draggedTask && draggedTask.id === task.id) {
    return `${baseClass} opacity-50 transform rotate-2 scale-95 shadow-xl border-blue-300`;
  }
  
  return baseClass;
};

// Utility function to get task status color
export const getTaskStatusColor = (status) => {
  switch (status) {
    case "Completed":
    case "Done":
      return "border-green-300 bg-green-100 text-green-800";
    case "In Progress":
      return "border-yellow-300 bg-yellow-100 text-yellow-800";
    case "To Do":
      return "border-blue-300 bg-blue-100 text-blue-800";
    case "Backlog":
      return "border-gray-300 bg-gray-100 text-gray-800";
    case "Overdue":
      return "border-red-300 bg-red-100 text-red-800";
    default:
      return "border-gray-300 bg-gray-100 text-gray-800";
  }
};

// Utility function to get priority color
export const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "border-red-300 bg-red-100 text-red-800";
    case "medium":
      return "border-yellow-300 bg-yellow-100 text-yellow-800";
    case "low":
      return "border-green-300 bg-green-100 text-green-800";
    default:
      return "border-gray-300 bg-gray-100 text-gray-800";
  }
};