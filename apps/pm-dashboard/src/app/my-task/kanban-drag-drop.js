// Kanban Drag and Drop Functionality
"use client";

import { useState, useCallback } from 'react';

export const useKanbanDragDrop = (initialTasks) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);

  // Handle drag start
  const handleDragStart = useCallback((e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.dataTransfer.setDragImage(e.target, 0, 0);
  }, []);

  // Handle drag over column
  const handleDragOver = useCallback((e, columnType) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOverColumn(columnType);
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e) => {
    // Only clear if leaving the entire column area
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOverColumn(null);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e, targetColumn) => {
    e.preventDefault();
    
    if (!draggedTask) return;

    // Update the task status based on target column
    const updatedTasks = tasks.map(task => {
      if (task.id === draggedTask.id) {
        let newStatus = task.status;
        let newProgress = task.progress;

              switch (targetColumn) {
        case 'To Do':
          newStatus = 'To Do';
          newProgress = Math.max(task.progress || 0, 10);
          break;
        case 'In Progress':
          newStatus = 'In Progress';
          newProgress = Math.max(task.progress || 0, 25);
          break;
        case 'Completed':
          newStatus = 'Completed';
          newProgress = 100;
          break;
        default:
          break;
      }

        return {
          ...task,
          status: newStatus,
          progress: newProgress
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    setDraggedTask(null);
    setDraggedOverColumn(null);
  }, [tasks, draggedTask]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDraggedOverColumn(null);
  }, []);

  // Group tasks by kanban columns
  const getKanbanColumns = useCallback(() => {
    return {
      "To Do": {
        color: "bg-blue-500",
        tasks: tasks.filter(task => task.status === "In Progress" && task.progress < 50)
      },
      "In Progress": {
        color: "bg-yellow-500", 
        tasks: tasks.filter(task => task.status === "In Progress" && task.progress >= 50)
      },
      "Completed": {
        color: "bg-green-500",
        tasks: tasks.filter(task => task.status === "Completed")
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

// Utility function to get column drop zone class
export const getDropZoneClass = (columnTitle, draggedOverColumn, draggedTask) => {
  const baseClass = "bg-gray-100 rounded-lg p-4 transition-all duration-200";
  
  if (draggedTask && draggedOverColumn === columnTitle) {
    return `${baseClass} bg-blue-100 border-2 border-blue-300 border-dashed`;
  }
  
  if (draggedTask) {
    return `${baseClass} opacity-75`;
  }
  
  return baseClass;
};

// Utility function to get task card class
export const getTaskCardClass = (task, draggedTask) => {
  const baseClass = "bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group cursor-move";
  
  if (draggedTask && draggedTask.id === task.id) {
    return `${baseClass} opacity-50 scale-95`;
  }
  
  return baseClass;
};
