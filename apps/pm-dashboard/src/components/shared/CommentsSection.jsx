"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  ChevronDown,
  Send,
  Plus,
  UserPlus,
  CheckSquare,
} from "lucide-react";
import {
  getCommentsByTaskId,
  teamMembers,
  taskComments as allTaskComments,
} from "../../data/centralData";

const CommentsSection = ({ task }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Get task ID - try different possible property names
  const taskId = task?.id || task?.taskId || task?.key;

  // Fallback for testing - if no ID found, use task 1 for testing
  const finalTaskId = taskId || 1;

  // Get comments from central data
  const taskComments = finalTaskId ? getCommentsByTaskId(finalTaskId) : [];

  // Fallback: manually filter comments if function doesn't work
  const fallbackComments = finalTaskId
    ? Object.values(allTaskComments || {}).filter(
        (comment) => comment.taskId === parseInt(finalTaskId)
      )
    : [];
  const finalComments =
    taskComments.length > 0 ? taskComments : fallbackComments;

  // Debug logging
  console.log("=== CommentsSection Debug ===");
  console.log("Task object:", task);
  console.log("Task object keys:", task ? Object.keys(task) : []);
  console.log("Task ID (original):", task?.id);
  console.log("Task ID (resolved):", taskId);
  console.log("Final Task ID:", finalTaskId);
  console.log("Task ID type:", typeof finalTaskId);
  console.log("Task Comments result:", taskComments);
  console.log("Fallback Comments:", fallbackComments);
  console.log("Final Comments:", finalComments);
  console.log("Final Comments length:", finalComments?.length || 0);
  console.log(
    "All taskComments from import:",
    Object.keys(allTaskComments || {})
  );
  console.log(
    "Direct test - comments for task 1:",
    Object.values(allTaskComments || {}).filter((c) => c.taskId === 1)
  );

  // Generate activity feed from comments and task data
  const activities = [
    {
      id: `task_created_${finalTaskId}`,
      type: "task_created",
      user: teamMembers[1], // Jonathan Bustos
      action: "created this task",
      timestamp: "12 min",
      content: null,
      icon: <Plus className="w-3 h-3" />,
    },
    {
      id: `user_added_${finalTaskId}`,
      type: "user_added",
      user: teamMembers[1], // Jonathan Bustos
      action: "added Jane Cooper",
      timestamp: "10 min",
      content: null,
      targetUser: teamMembers[2], // Jane Cooper
      icon: <UserPlus className="w-3 h-3" />,
    },
    // Add comments from central data
    ...finalComments.map((comment) => ({
      id: `comment_${comment.id}`,
      type: "comment",
      user: teamMembers[comment.authorId],
      action: null,
      timestamp: getTimeAgo(comment.timestamp),
      content: comment.content,
      icon: <MessageCircle className="w-3 h-3" />,
    })),
    // Add task-specific activities based on task ID
    ...(finalTaskId === 1
      ? [
          {
            id: `subtask_1_${finalTaskId}`,
            type: "subtask_created",
            user: teamMembers[1], // Jonathan Bustos
            action: "created sub-task Create Moodboard",
            timestamp: "25 min ago",
            content: null,
            icon: <CheckSquare className="w-3 h-3" />,
          },
          {
            id: `subtask_2_${finalTaskId}`,
            type: "subtask_created",
            user: teamMembers[1], // Jonathan Bustos
            action: "created sub-task Option 1: Gradient",
            timestamp: "19 min ago",
            content: null,
            icon: <CheckSquare className="w-3 h-3" />,
          },
        ]
      : []),
    ...(finalTaskId === 2
      ? [
          {
            id: `subtask_3_${finalTaskId}`,
            type: "subtask_created",
            user: teamMembers[2], // Jane Cooper
            action: "created sub-task Wireframe Layout",
            timestamp: "30 min ago",
            content: null,
            icon: <CheckSquare className="w-3 h-3" />,
          },
          {
            id: `subtask_4_${finalTaskId}`,
            type: "subtask_created",
            user: teamMembers[2], // Jane Cooper
            action: "created sub-task User Flow Diagram",
            timestamp: "25 min ago",
            content: null,
            icon: <CheckSquare className="w-3 h-3" />,
          },
        ]
      : []),
    ...(finalTaskId === 3
      ? [
          {
            id: `subtask_5_${finalTaskId}`,
            type: "subtask_created",
            user: teamMembers[1], // Jonathan Bustos
            action: "created sub-task Color Palette Research",
            timestamp: "35 min ago",
            content: null,
            icon: <CheckSquare className="w-3 h-3" />,
          },
        ]
      : []),
    ...(finalTaskId === 4
      ? [
          {
            id: `subtask_6_${finalTaskId}`,
            type: "subtask_created",
            user: teamMembers[3], // Sarah Wilson
            action: "created sub-task Character Design",
            timestamp: "40 min ago",
            content: null,
            icon: <CheckSquare className="w-3 h-3" />,
          },
        ]
      : []),
    ...(finalTaskId === 5
      ? [
          {
            id: `subtask_7_${finalTaskId}`,
            type: "subtask_created",
            user: teamMembers[2], // Jane Cooper
            action: "created sub-task User Journey Mapping",
            timestamp: "45 min ago",
            content: null,
            icon: <CheckSquare className="w-3 h-3" />,
          },
        ]
      : []),
    ...(finalTaskId === 6
      ? [
          {
            id: `subtask_8_${finalTaskId}`,
            type: "subtask_created",
            user: teamMembers[1], // Jonathan Bustos
            action: "created sub-task Mobile Layout Design",
            timestamp: "50 min ago",
            content: null,
            icon: <CheckSquare className="w-3 h-3" />,
          },
        ]
      : []),
    ...(finalTaskId === 7
      ? [
          {
            id: `subtask_9_${finalTaskId}`,
            type: "subtask_created",
            user: teamMembers[3], // Sarah Wilson
            action: "created sub-task Animation Sequence",
            timestamp: "55 min ago",
            content: null,
            icon: <CheckSquare className="w-3 h-3" />,
          },
        ]
      : []),
    ...(finalTaskId === 8
      ? [
          {
            id: `subtask_10_${finalTaskId}`,
            type: "subtask_created",
            user: teamMembers[2], // Jane Cooper
            action: "created sub-task Database Schema",
            timestamp: "60 min ago",
            content: null,
            icon: <CheckSquare className="w-3 h-3" />,
          },
        ]
      : []),
    ...(finalTaskId === 9
      ? [
          {
            id: `subtask_11_${finalTaskId}`,
            type: "subtask_created",
            user: teamMembers[1], // Jonathan Bustos
            action: "created sub-task API Documentation",
            timestamp: "65 min ago",
            content: null,
            icon: <CheckSquare className="w-3 h-3" />,
          },
        ]
      : []),
  ];

  // Helper function to get time ago
  function getTimeAgo(timestamp) {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? "s" : ""} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? "s" : ""} ago`;
  }

  const filterOptions = [
    { value: "all", label: "All Activity", count: activities.length },
    {
      value: "comments",
      label: "Comments",
      count: activities.filter((a) => a.type === "comment").length,
    },
    {
      value: "tasks",
      label: "Task Updates",
      count: activities.filter((a) => a.type !== "comment").length,
    },
  ];

  const filteredActivities = activities.filter((activity) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "comments") return activity.type === "comment";
    if (activeFilter === "tasks") return activity.type !== "comment";
    return true;
  });

  // Debug logging
  console.log("All Activities:", activities);
  console.log("Filtered Activities:", filteredActivities);

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      console.log("Adding comment:", newComment);
      setNewComment("");
    }
  };

  return (
    <div className="flex flex-col h-full max-h-full">
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>
                {filterOptions.find((f) => f.value === activeFilter)?.label}
              </span>
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
                      activeFilter === option.value
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className="text-xs text-gray-500">
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-1 min-h-0">
        <div className="space-y-6">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                {/* Avatar */}
                <div
                  className={`w-8 h-8 ${activity.user.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                >
                  {activity.user.avatar}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {activity.user.name}
                    </span>
                    {activity.action && (
                      <span className="text-sm text-gray-600">
                        {activity.action}
                      </span>
                    )}
                    {activity.targetUser && (
                      <div
                        className={`w-5 h-5 ${activity.targetUser.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {activity.targetUser.avatar}
                      </div>
                    )}
                    <span className="text-xs text-gray-500 ml-auto">
                      {activity.timestamp}
                    </span>
                  </div>

                  {/* Comment Content */}
                  {activity.content && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-2">
                      <p className="text-sm text-gray-700">
                        {activity.content}
                      </p>
                    </div>
                  )}

                  {/* Activity Icon */}
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 text-gray-400">{activity.icon}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No activities yet</p>
                <p className="text-gray-400 text-xs">
                  Start the conversation by adding a comment
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comment Input - Fixed at bottom */}
      <div
        className="p-4 border-t border-gray-200 flex-shrink-0 bg-white"
        style={{ minHeight: "80px" }}
      >
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            JB
          </div>
          <div className="flex-1">
            <div className="flex items-end gap-2">
              <div className="flex-1 min-h-[40px] max-h-24 border border-gray-300 rounded-lg">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full h-full min-h-[40px] p-3 border-none outline-none resize-none rounded-lg text-sm"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
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
