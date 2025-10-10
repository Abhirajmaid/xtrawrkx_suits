"use client";

import React from "react";
import { Avatar, Badge } from "@xtrawrkx/ui";
import { formatCurrency, formatDate } from "../../lib/utils";
import { Calendar, DollarSign, User, MoreHorizontal, Star, AlertCircle } from "lucide-react";

export default function KanbanCard({
  item,
  columnId,
  itemIndex,
  isDragging = false,
  onClick,
  draggableProps = {},
}) {

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "badge-error";
      case "medium":
        return "badge-warning";
      case "low":
        return "badge-success";
      default:
        return "badge-gray";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "completed":
        return "badge-primary";
      case "cancelled":
        return "badge-error";
      default:
        return "badge-gray";
    }
  };

  return (
    <div
      onClick={() => onClick?.(item)}
      className={`bg-white rounded-lg border border-gray-200 p-4 cursor-move hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-70 shadow-lg' : 'hover:border-brand-primary/50'
      }`}
      {...draggableProps}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate mb-1">
            {item.title || item.name}
          </h4>
          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors ml-2">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Tags/Badges */}
      <div className="flex flex-wrap gap-1 mb-3">
        {item.priority && (
          <Badge className={getPriorityColor(item.priority)}>
            {item.priority}
          </Badge>
        )}
        {item.status && (
          <Badge className={getStatusColor(item.status)}>
            {item.status}
          </Badge>
        )}
        {item.tags && item.tags.slice(0, 2).map((tag, index) => (
          <Badge key={index} className="badge-gray text-xs">
            {tag}
          </Badge>
        ))}
        {item.tags && item.tags.length > 2 && (
          <span className="text-xs text-gray-400">
            +{item.tags.length - 2}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="space-y-2 mb-3">
        {item.value && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-medium text-gray-900">
              {formatCurrency(item.value)}
            </span>
          </div>
        )}
        
        {item.dueDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(item.dueDate, 'en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
        
        {item.owner && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{item.owner}</span>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {item.assignees && item.assignees.slice(0, 3).map((assignee, index) => (
            <Avatar
              key={index}
              name={assignee.name || assignee}
              size="sm"
              className="ring-2 ring-white"
            />
          ))}
          {item.assignees && item.assignees.length > 3 && (
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600">
              +{item.assignees.length - 3}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {item.isStarred && (
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          )}
          {item.hasAlerts && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
        </div>
      </div>
    </div>
  );
}
