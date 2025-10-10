"use client";

import React, { useState } from "react";
import { KanbanBoard, KanbanCard } from "./index";
// import { useDragDropBoard } from "../../lib/dragdrop"; // Removed - using react-beautiful-dnd now
import { formatDate } from "../../lib/utils";
import { Plus, Filter, Search, CheckCircle, Clock, AlertCircle } from "lucide-react";

// Custom Task Card Component
function TaskCard({ item, columnId, itemIndex, isDragging, onDragStart, onDragEnd, onClick }) {

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "badge-error";
      case "high":
        return "badge-warning";
      case "medium":
        return "badge-primary";
      case "low":
        return "badge-success";
      default:
        return "badge-gray";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "blocked":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && item.status !== "completed";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onClick?.(item)}
      className={`bg-white rounded-lg border border-gray-200 p-4 cursor-move hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : 'hover:border-brand-primary/50'
      } ${isOverdue(item.dueDate) ? 'border-red-200 bg-red-50' : ''}`}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {getStatusIcon(item.status)}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate mb-1">
              {item.title}
            </h4>
            {item.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={`badge ${getPriorityColor(item.priority)}`}>
            {item.priority}
          </div>
        </div>
      </div>

      {/* Task Details */}
      <div className="space-y-2 mb-3">
        {item.project && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Project:</span>
            <span className="font-medium text-gray-900">{item.project}</span>
          </div>
        )}
        
        {item.assignee && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Assignee:</span>
            <span className="font-medium text-gray-900">{item.assignee}</span>
          </div>
        )}
        
        {item.dueDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Due:</span>
            <span className={`font-medium ${
              isOverdue(item.dueDate) ? 'text-red-600' : 'text-gray-900'
            }`}>
              {formatDate(item.dueDate, 'en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {/* Task Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {item.tags && item.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
          {item.tags && item.tags.length > 2 && (
            <span className="text-xs text-gray-400">
              +{item.tags.length - 2}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {item.estimatedHours && (
            <span className="text-xs text-gray-500">
              {item.estimatedHours}h
            </span>
          )}
          {isOverdue(item.dueDate) && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function TasksBoard({ onAddTask }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Mock initial data
  const initialColumns = [
    {
      id: "todo",
      title: "To Do",
      color: "#f3f4f6",
      items: [
        {
          id: "t1",
          title: "Design new landing page",
          description: "Create wireframes and mockups for the new landing page design",
          status: "todo",
          priority: "high",
          project: "Website Redesign",
          assignee: "Sarah Johnson",
          dueDate: "2024-02-15",
          estimatedHours: 8,
          tags: ["design", "frontend"],
        },
        {
          id: "t2",
          title: "Update API documentation",
          description: "Document the new endpoints and update the API reference",
          status: "todo",
          priority: "medium",
          project: "API Development",
          assignee: "Mike Chen",
          dueDate: "2024-02-20",
          estimatedHours: 4,
          tags: ["documentation", "api"],
        },
        {
          id: "t3",
          title: "Review client feedback",
          description: "Analyze and categorize feedback from the latest client survey",
          status: "todo",
          priority: "low",
          project: "Client Portal",
          assignee: "Jane Doe",
          dueDate: "2024-02-25",
          estimatedHours: 3,
          tags: ["feedback", "analysis"],
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "#dbeafe",
      items: [
        {
          id: "t4",
          title: "Implement user authentication",
          description: "Set up OAuth2 and JWT token management",
          status: "in-progress",
          priority: "urgent",
          project: "CRM System",
          assignee: "John Smith",
          dueDate: "2024-02-10",
          estimatedHours: 12,
          tags: ["backend", "security"],
        },
        {
          id: "t5",
          title: "Database optimization",
          description: "Optimize queries and add proper indexing",
          status: "in-progress",
          priority: "high",
          project: "Performance",
          assignee: "Alex Wilson",
          dueDate: "2024-02-18",
          estimatedHours: 6,
          tags: ["database", "optimization"],
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      color: "#fef3c7",
      items: [
        {
          id: "t6",
          title: "Code review for payment module",
          description: "Review the implementation of the new payment processing module",
          status: "review",
          priority: "high",
          project: "Payment System",
          assignee: "Lisa Brown",
          dueDate: "2024-02-12",
          estimatedHours: 2,
          tags: ["code-review", "payments"],
        },
      ],
    },
    {
      id: "completed",
      title: "Completed",
      color: "#d1fae5",
      items: [
        {
          id: "t7",
          title: "Setup CI/CD pipeline",
          description: "Configure automated testing and deployment pipeline",
          status: "completed",
          priority: "medium",
          project: "DevOps",
          assignee: "Tom Davis",
          dueDate: "2024-01-30",
          estimatedHours: 8,
          tags: ["devops", "automation"],
        },
        {
          id: "t8",
          title: "Update user interface",
          description: "Apply the new design system to all components",
          status: "completed",
          priority: "high",
          project: "UI/UX",
          assignee: "Sarah Johnson",
          dueDate: "2024-02-05",
          estimatedHours: 16,
          tags: ["ui", "design-system"],
        },
      ],
    },
  ];

  const handleItemDrop = (item, sourceColumnId, targetColumnId, newIndex) => {
    console.log("Task moved:", {
      item: item.title,
      from: sourceColumnId,
      to: targetColumnId,
      index: newIndex,
    });
    
    // Here you would typically make an API call to update the task status
    // Example:
    // fetch(`/api/tasks/${item.id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: targetColumnId })
    // });
  };

  const handleTaskClick = (task, columnId) => {
    console.log("Task clicked:", task.title, "in column:", columnId);
    // Navigate to task detail page
    // router.push(`/delivery/tasks/${task.id}`);
  };

  const handleAddTask = (column) => {
    console.log("Add task to column:", column.title);
    if (onAddTask) {
      onAddTask(column);
    }
  };

  return (
    <div className="space-y-6">

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Tasks</div>
          <div className="text-2xl font-bold text-gray-900">8</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-gray-900">2</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Completed</div>
          <div className="text-2xl font-bold text-gray-900">2</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Overdue</div>
          <div className="text-2xl font-bold text-red-600">1</div>
        </div>
      </div>

      {/* Tasks Board */}
      <div className="bg-white rounded-xl shadow-card border border-brand-border/50 p-6">
        <KanbanBoard
          initialColumns={initialColumns}
          onItemDrop={handleItemDrop}
          onItemClick={handleTaskClick}
          onColumnClick={handleAddTask}
          cardComponent={TaskCard}
          showColumnStats={true}
          className="min-h-[600px]"
        />
      </div>
    </div>
  );
}
