"use client";

import React, { useState } from "react";
import { 
  MessageCircle, 
  ChevronDown, 
  User, 
  Clock,
  Send,
  Plus,
  CheckCircle
} from "lucide-react";

const CommentsSection = ({ task }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [newComment, setNewComment] = useState("");

  const activities = [
    {
      id: 1,
      type: "task_created",
      user: {
        name: "Jonathan Bustos",
        avatar: "JB",
        color: "bg-blue-500"
      },
      action: "created this task",
      timestamp: "12 min",
      content: null
    },
    {
      id: 2,
      type: "user_added",
      user: {
        name: "Jonathan Bustos",
        avatar: "JB",
        color: "bg-blue-500"
      },
      action: "added Jane Cooper",
      timestamp: "10 min",
      content: null,
      targetUser: {
        name: "Jane Cooper",
        avatar: "JC",
        color: "bg-green-500"
      }
    },
    {
      id: 3,
      type: "comment",
      user: {
        name: "Jane Cooper",
        avatar: "JC",
        color: "bg-green-500"
      },
      action: null,
      timestamp: "30 min ago",
      content: "Thanks to Jonathan Bustos. Reviewing this task"
    },
    {
      id: 4,
      type: "subtask_created",
      user: {
        name: "Jonathan Bustos",
        avatar: "JB",
        color: "bg-blue-500"
      },
      action: "created sub-task Create Moodboard",
      timestamp: "25 min ago",
      content: null
    },
    {
      id: 5,
      type: "comment",
      user: {
        name: "Jonathan Bustos",
        avatar: "JB",
        color: "bg-blue-500"
      },
      action: null,
      timestamp: "20 min ago",
      content: "Hi Jane, please do the following subtask"
    },
    {
      id: 6,
      type: "subtask_created",
      user: {
        name: "Jonathan Bustos",
        avatar: "JB",
        color: "bg-blue-500"
      },
      action: "created sub-task Option 1: Gradient",
      timestamp: "19 min ago",
      content: null
    }
  ];

  const filterOptions = [
    { value: "all", label: "All Activity", count: activities.length },
    { value: "comments", label: "Comments", count: activities.filter(a => a.type === "comment").length },
    { value: "tasks", label: "Task Updates", count: activities.filter(a => a.type !== "comment").length }
  ];

  const filteredActivities = activities.filter(activity => {
    if (activeFilter === "all") return true;
    if (activeFilter === "comments") return activity.type === "comment";
    if (activeFilter === "tasks") return activity.type !== "comment";
    return true;
  });

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      console.log("Adding comment:", newComment);
      setNewComment("");
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "task_created":
        return <Plus className="w-3 h-3" />;
      case "subtask_created":
        return <CheckCircle className="w-3 h-3" />;
      case "user_added":
        return <User className="w-3 h-3" />;
      case "comment":
        return <MessageCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>{filterOptions.find(f => f.value === activeFilter)?.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setActiveFilter(option.value);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      activeFilter === option.value ? "bg-blue-50 text-blue-700" : "text-gray-700"
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className="text-xs text-gray-500">{option.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              {/* Avatar */}
              <div className={`w-8 h-8 ${activity.user.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {activity.user.avatar}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {activity.user.name}
                  </span>
                  {activity.action && (
                    <span className="text-sm text-gray-600">
                      {activity.action}
                    </span>
                  )}
                  {activity.targetUser && (
                    <div className={`w-5 h-5 ${activity.targetUser.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                      {activity.targetUser.avatar}
                    </div>
                  )}
                  <span className="text-xs text-gray-500 ml-auto">
                    {activity.timestamp}
                  </span>
                </div>

                {/* Comment Content */}
                {activity.content && (
                  <div className="bg-gray-50 rounded-lg p-3 mt-2">
                    <p className="text-sm text-gray-700">{activity.content}</p>
                  </div>
                )}

                {/* Activity Icon */}
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-4 text-gray-400">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            JB
          </div>
          <div className="flex-1">
            <div className="flex items-end gap-2">
              <div className="flex-1 min-h-[40px] max-h-32 border border-gray-200 rounded-lg">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full h-full min-h-[40px] p-3 border-none outline-none resize-none rounded-lg text-sm"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className={`p-2 rounded-lg transition-colors ${
                  newComment.trim()
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
