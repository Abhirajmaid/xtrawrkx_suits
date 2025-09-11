"use client";

import React, { useState } from "react";
import { Plus, MoreHorizontal, User, Clock } from "lucide-react";
import KanbanCard from "./KanbanCard";
import KanbanColumnHeader from "./KanbanColumnHeader";

const KanbanBoard = ({ tasks, onTaskUpdate, onTaskDelete, onTaskCreate, onTaskClick }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);

  // Define the 4 main columns
  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'bg-purple-500', count: 0 },
    { id: 'todo', title: 'To Do', color: 'bg-orange-500', count: 0 },
    { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-500', count: 0 },
    { id: 'done', title: 'Done', color: 'bg-green-500', count: 0 }
  ];

  // Group tasks by status
  const getTasksByStatus = (status) => {
    return tasks.filter(task => {
      switch (status) {
        case 'backlog':
          return task.status === 'Backlog';
        case 'todo':
          return task.status === 'To Do';
        case 'in-progress':
          return task.status === 'In Progress';
        case 'done':
          return task.status === 'Done';
        default:
          return false;
      }
    });
  };

  // Update column counts
  const columnsWithCounts = columns.map(column => ({
    ...column,
    count: getTasksByStatus(column.id).length
  }));

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOverColumn(columnId);
  };

  const handleDragEnter = (e, columnId) => {
    e.preventDefault();
    setDraggedOverColumn(columnId);
  };

  const handleDragLeave = (e) => {
    // Only clear if we're leaving the entire column area
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOverColumn(null);
    }
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    
    if (draggedTask) {
      // Map column ID to status
      const statusMap = {
        'backlog': 'Backlog',
        'todo': 'To Do',
        'in-progress': 'In Progress',
        'done': 'Done'
      };

      const newStatus = statusMap[columnId];
      if (newStatus && draggedTask.status !== newStatus) {
        onTaskUpdate({
          ...draggedTask,
          status: newStatus
        });
      }
    }

    setDraggedTask(null);
    setDraggedOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedOverColumn(null);
  };

  const getColumnClass = (columnId) => {
    const baseClass = "min-h-[600px] bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 transition-all duration-300";
    
    if (draggedOverColumn === columnId && draggedTask) {
      return `${baseClass} bg-blue-100/20 border-blue-300/50 shadow-lg`;
    }
    
    return baseClass;
  };

  return (
    <div className="flex gap-1.5 h-full overflow-x-auto pb-4 w-full">
      {/* Main Kanban Columns */}
      {columnsWithCounts.map((column) => (
        <div
          key={column.id}
          className={`${getColumnClass(column.id)} w-1/4 flex-shrink-0`}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragEnter={(e) => handleDragEnter(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <KanbanColumnHeader
            title={column.title}
            count={column.count}
            color={column.color}
            onAddTask={() => onTaskCreate(column.id)}
          />

          {/* Task Cards */}
          <div className="space-y-3 mt-4">
            {getTasksByStatus(column.id).map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                isDragging={draggedTask?.id === task.id}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDelete={onTaskDelete}
                onTaskClick={onTaskClick}
              />
            ))}

            {/* Add Task Button */}
            <button
              onClick={() => onTaskCreate(column.id)}
              className="w-full p-3 border-2 border-dashed border-white/20 rounded-lg text-brand-text-light hover:border-white/40 hover:text-brand-foreground transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white/5"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add task</span>
            </button>
          </div>
        </div>
      ))}

      {/* Add New Column Button */}
      <div className="w-1/5 flex-shrink-0 ml-1.5">
        <button
          onClick={() => console.log('Add new column')}
          className="w-full h-full min-h-[600px] border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-4 text-brand-text-light hover:border-white/40 hover:text-brand-foreground transition-all duration-300 hover:bg-white/5"
        >
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-1">Add Status</h3>
            <p className="text-sm text-brand-text-muted">Create a new column</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default KanbanBoard;
