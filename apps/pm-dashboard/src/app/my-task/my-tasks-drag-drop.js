"use client";

import { useState, useCallback, useEffect } from 'react';

export const useMyTasksKanbanDragDrop = (initialTasks) => {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);

  // Update tasks when initialTasks changes
  useEffect(() => {
    if (initialTasks && initialTasks.length > 0) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  // Handle drag start
  const handleDragStart = useCallback((e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ taskId: task.id, source: 'my-tasks' }));
    
    // Set drag image with better positioning
    e.dataTransfer.setDragImage(e.target, e.target.offsetWidth / 2, e.target.offsetHeight / 2);
  }, []);

  // Handle drag over column
  const handleDragOver = useCallback((e, columnType) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedOverColumn !== columnType) {
      setDraggedOverColumn(columnType);
    }
  }, [draggedOverColumn]);

  // Handle drag enter
  const handleDragEnter = useCallback((e, columnType) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverColumn(columnType);
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only clear if actually leaving the drop zone
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setDraggedOverColumn(null);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e, newStatus) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedTask) {
      return;
    }

    // Map kanban columns to actual task statuses
    const statusMapping = {
      "To Do": "To Do",
      "In Progress": "In Progress", 
      "Completed": "Done"
    };

    const mappedStatus = statusMapping[newStatus] || newStatus;

    // Update task status and progress
    const updatedTasks = tasks.map(task => {
      if (task.id === draggedTask.id) {
        const updatedTask = {
          ...task,
          status: mappedStatus,
          // Update progress based on status
          progress: mappedStatus === "Done" || mappedStatus === "Completed" ? 100 :
                   mappedStatus === "In Progress" ? Math.max(task.progress || 0, 25) :
                   mappedStatus === "To Do" ? Math.min(task.progress || 0, 25) :
                   task.progress || 0
        };
        return updatedTask;
      }
      return task;
    });
    setTasks(updatedTasks);
    setDraggedTask(null);
    setDraggedOverColumn(null);
  }, [draggedTask, tasks]);

  // Handle drag end
  const handleDragEnd = useCallback((e) => {
    setDraggedTask(null);
    setDraggedOverColumn(null);
  }, []);

  // Get organized kanban columns
  const getKanbanColumns = useCallback(() => {
    // Pre-categorize tasks in a single pass for better performance
    const todoTasks = [];
    const inProgressTasks = [];
    const completedTasks = [];

    tasks.forEach(task => {
      const progress = task.progress || 0;
      const status = task.status;

      if (status === "Done" || status === "Completed" || status === "In Review" || progress >= 100) {
        completedTasks.push(task);
      } else if (status === "In Progress" && progress >= 25 && progress < 100) {
        inProgressTasks.push(task);
      } else {
        todoTasks.push(task);
      }
    });

    return {
      "To Do": {
        tasks: todoTasks,
        color: "bg-blue-500",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
      },
      "In Progress": {
        tasks: inProgressTasks,
        color: "bg-yellow-500",
        bgColor: "bg-yellow-50", 
        borderColor: "border-yellow-200"
      },
      "Completed": {
        tasks: completedTasks,
        color: "bg-green-500",
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
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    getKanbanColumns
  };
};

// Utility function to get drop zone styling for My Tasks
export const getMyTasksDropZoneClass = (columnType, draggedOverColumn, draggedTask) => {
  const baseClass = "bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl p-4 min-h-[400px] transition-all duration-300";
  
  if (!draggedTask) return baseClass;
  
  if (draggedOverColumn === columnType) {
    return `${baseClass} border-blue-400 bg-blue-100/20 transform scale-[1.02] shadow-2xl ring-2 ring-blue-300/50`;
  }
  
  return `${baseClass} opacity-60 border-dashed border-gray-300`;
};

// Utility function to get task card styling for My Tasks
export const getMyTasksTaskCardClass = (task, draggedTask) => {
  const baseClass = "bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing group mb-3";
  
  if (draggedTask && draggedTask.id === task.id) {
    return `${baseClass} opacity-50 transform rotate-3 scale-95 shadow-2xl border-blue-400 z-50`;
  }
  
  return baseClass;
};
