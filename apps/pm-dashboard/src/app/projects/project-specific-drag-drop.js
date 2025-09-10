"use client";

import { useState, useCallback, useEffect } from 'react';

export const useProjectSpecificKanbanDragDrop = (projectSlug, initialTasks) => {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);

  // Update tasks when initialTasks changes
  useEffect(() => {
    if (initialTasks && initialTasks.length > 0) {
      setTasks(initialTasks);
    }
  }, [initialTasks, projectSlug]);

  // Handle drag start
  const handleDragStart = useCallback((e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ 
      taskId: task.id, 
      source: 'project',
      projectSlug 
    }));
    
    // Set drag image
    e.dataTransfer.setDragImage(e.target, e.target.offsetWidth / 2, e.target.offsetHeight / 2);
  }, [projectSlug]);

  // Handle drag over column
  const handleDragOver = useCallback((e, columnType) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedOverColumn !== columnType) {
      setDraggedOverColumn(columnType);
    }
  }, [draggedOverColumn, projectSlug]);

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

    // Update task status and progress
    const updatedTasks = tasks.map(task => {
      if (task.id === draggedTask.id) {
        const updatedTask = {
          ...task,
          status: newStatus,
          // Update progress based on status
          progress: newStatus === "Completed" || newStatus === "Done" ? 100 :
                   newStatus === "In Progress" ? Math.max(task.progress || 0, 25) :
                   newStatus === "To Do" ? Math.max(task.progress || 0, 10) :
                   newStatus === "Backlog" ? 0 : task.progress || 0
        };
        return updatedTask;
      }
      return task;
    });
    setTasks(updatedTasks);
    setDraggedTask(null);
    setDraggedOverColumn(null);
  }, [draggedTask, tasks, projectSlug]);

  // Handle drag end
  const handleDragEnd = useCallback((e) => {
    console.log(`🏁 Project ${projectSlug} - Drag ended`);
    setDraggedTask(null);
    setDraggedOverColumn(null);
  }, [projectSlug]);

  // Get organized kanban columns for projects
  const getKanbanColumns = useCallback(() => {
    // Pre-categorize tasks in a single pass for better performance
    const backlogTasks = [];
    const todoTasks = [];
    const inProgressTasks = [];
    const completedTasks = [];

    tasks.forEach(task => {
      const status = task.status;
      
      if (status === "Completed" || status === "Done") {
        completedTasks.push(task);
      } else if (status === "In Progress") {
        inProgressTasks.push(task);
      } else if (status === "To Do") {
        todoTasks.push(task);
      } else if (status === "Backlog") {
        backlogTasks.push(task);
      }
    });

    const columns = {
      "Backlog": {
        tasks: backlogTasks,
        color: "bg-gray-500",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-300"
      },
      "To Do": {
        tasks: todoTasks,
        color: "bg-blue-500", 
        bgColor: "bg-blue-50",
        borderColor: "border-blue-300"
      },
      "In Progress": {
        tasks: inProgressTasks,
        color: "bg-yellow-500",
        bgColor: "bg-yellow-50", 
        borderColor: "border-yellow-300"
      },
      "Completed": {
        tasks: completedTasks,
        color: "bg-green-500",
        bgColor: "bg-green-50",
        borderColor: "border-green-300"
      }
    };

    return columns;
  }, [tasks, projectSlug]);

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

// Utility function to get drop zone styling for Projects
export const getProjectSpecificDropZoneClass = (columnType, draggedOverColumn, draggedTask) => {
  const baseClass = "bg-white/5 backdrop-blur-md border-2 border-white/20 rounded-xl p-4 min-h-[500px] transition-all duration-300";
  
  if (!draggedTask) return baseClass;
  
  if (draggedOverColumn === columnType) {
    return `${baseClass} border-green-400 bg-green-100/10 transform scale-[1.01] shadow-xl ring-2 ring-green-300/30`;
  }
  
  return `${baseClass} opacity-50 border-dashed border-gray-400`;
};

// Utility function to get task card styling for Projects
export const getProjectSpecificTaskCardClass = (task, draggedTask) => {
  const baseClass = "bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing group";
  
  if (draggedTask && draggedTask.id === task.id) {
    return `${baseClass} opacity-60 transform rotate-2 scale-95 shadow-xl border-green-400 z-50`;
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
