"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Calendar,
  ChevronDown,
  Edit,
  Plus,
  MoreVertical,
  Share,
  List,
  Paperclip,
  Image,
  X,
} from "lucide-react";
import { Card } from "@xtrawrkx/ui";
import { getEnrichedTask, teamMembers, tasks } from "../../../data/centralData";

export default function TaskDetailPage({ params }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("TaskDetailPage params:", params);
  console.log("TaskDetailPage params.id:", params.id);

  // Load task data from centralData
  React.useEffect(() => {
    const loadTask = async () => {
      setLoading(true);

      // Handle both direct and Promise-based params (Next.js App Router compatibility)
      let taskIdParam;
      if (params.id instanceof Promise) {
        const resolvedParams = await params;
        taskIdParam = resolvedParams.id;
      } else {
        taskIdParam = params.id;
      }

      console.log("Loading task with ID:", taskIdParam);

      // Validate task ID exists
      if (!taskIdParam) {
        console.error("Task ID is undefined or null!");
        setLoading(false);
        return;
      }

      // Try to get task from centralData first
      const taskId = parseInt(taskIdParam, 10);

      // Check if parsing was successful
      if (isNaN(taskId)) {
        console.error("Task ID is not a valid number:", taskIdParam);
        setLoading(false);
        return;
      }

      console.log("Parsed task ID:", taskId);

      // Debug: Check if task exists in raw data first
      console.log("Checking if task exists in raw tasks data...");
      const rawTask = tasks[taskId];
      console.log("Raw task data:", rawTask);

      const taskFromData = getEnrichedTask(taskId);
      console.log("getEnrichedTask result:", taskFromData);

      if (taskFromData) {
        console.log("Found task in centralData:", taskFromData);
        console.log("Task subtasks:", taskFromData.subtasks);
        console.log("Task comments:", taskFromData.comments);
        console.log(
          "Task ID:",
          taskFromData.id,
          "Task name:",
          taskFromData.name
        );
        setTask(taskFromData);
        setLoading(false);
        return;
      }

      // Fallback to mock data if not found
      console.log("Task not found in centralData, using mock data");
      console.warn(
        "This should not happen! Task ID:",
        taskId,
        "should exist in centralData"
      );
      const mockTask = {
        id: taskId,
        name: "Mock Task (Error State)",
        project: {
          name: "Mock Project",
          color: "from-red-400 to-red-600",
          icon: "!",
        },
        assignee: "System",
        assigneeId: 1,
        dueDate: "January 31, 2024",
        time: null,
        status: "Error",
        progress: 0,
        priority: "high",
        description:
          "This is mock data shown because the real task data could not be loaded. Please check the console for errors.",
        tags: ["error", "mock"],
        subtasks: [
          {
            id: 1,
            name: "Collect Moodboard",
            status: "To Do",
            assignee: "You",
            assigneeId: 1,
          },
          {
            id: 2,
            name: "Option 1: Gradient",
            status: "To Do",
            assignee: "You",
            assigneeId: 1,
          },
          {
            id: 3,
            name: "Option 2: Light Mode",
            status: "To Do",
            assignee: "You",
            assigneeId: 1,
          },
          {
            id: 4,
            name: "Option 3: Different Layout",
            status: "To Do",
            assignee: "You",
            assigneeId: 1,
          },
        ],
        comments: [
          {
            id: 1,
            author: "Jonathan Bustos",
            authorId: 1,
            content: "created this task",
            timestamp: "12:00",
            type: "action",
          },
          {
            id: 2,
            author: "Jonathan Bustos",
            authorId: 1,
            content: "added Jane Cooper",
            timestamp: "15:00",
            type: "action",
          },
          {
            id: 3,
            author: "Jane Cooper",
            authorId: 2,
            content: "Thanks @Jonathan Bustos, Reviewing this task",
            timestamp: "30 min ago",
            type: "comment",
            hasProfilePic: true,
          },
          {
            id: 4,
            author: "Jonathan Bustos",
            authorId: 1,
            content: "created sub-task Create Moodboard",
            timestamp: "25 min ago",
            type: "action",
          },
          {
            id: 5,
            author: "Jonathan Bustos",
            authorId: 1,
            content: "Hi Jane, please do the following subtask",
            timestamp: "20 min ago",
            type: "comment",
          },
          {
            id: 6,
            author: "Jonathan Bustos",
            authorId: 1,
            content: "created sub-task Option 1: Gradient",
            timestamp: "19 min ago",
            type: "action",
          },
        ],
      };

      setTask(mockTask);
      setLoading(false);
    };

    loadTask();
  }, [params]);

  const getStatusColor = (status) => {
    switch (status) {
      case "In Review":
        return "bg-green-100 text-green-700 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Done":
        return "bg-green-100 text-green-700 border-green-200";
      case "To Do":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Backlog":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getAssigneeAvatar = (assigneeId) => {
    const member = teamMembers[assigneeId];
    if (member) {
      return {
        initials: member.avatar,
        color: member.color,
      };
    }
    return {
      initials: "JB",
      color: "bg-blue-500",
    };
  };

  const getAssigneeName = (assignee) => {
    if (!assignee) return "Unassigned";
    if (typeof assignee === "string") return assignee;
    if (typeof assignee === "object" && assignee.name) return assignee.name;
    return "Unknown Assignee";
  };

  const handleSubtaskStatusChange = (subtaskId, newStatus) => {
    setTask((prev) => ({
      ...prev,
      subtasks: (prev.subtasks || []).map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, status: newStatus } : subtask
      ),
    }));
  };

  const handleAddSubtask = () => {
    const newSubtask = {
      id: Date.now(),
      name: "New Subtask",
      status: "To Do",
      assignee: "You",
      assigneeId: 1,
    };
    setTask((prev) => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), newSubtask],
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading task...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Task Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The task you&apos;re looking for doesn&apos;t exist.
              </p>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const assigneeAvatar = getAssigneeAvatar(task.assigneeId);

  return (
    <div className="flex flex-col h-full bg-white overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 bg-gradient-to-br ${task.project.color} rounded-lg flex items-center justify-center shadow-sm`}
                >
                  <span className="text-white font-bold text-sm">
                    {task.project.icon}
                  </span>
                </div>
                <span className="text-gray-600">→</span>
                <h1 className="text-xl font-bold text-gray-900">{task.name}</h1>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <User className="w-4 h-4" />
                Assign
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Task Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview Section */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Overview
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Assignee */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignee
                    </label>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 ${assigneeAvatar.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}
                      >
                        {assigneeAvatar.initials}
                      </div>
                      <span className="text-gray-900">
                        {getAssigneeName(task.assignee)}
                      </span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded ml-auto">
                        <Plus className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{task.dueDate}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="relative">
                      <button
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor(task.status)}`}
                      >
                        {task.status}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Progress
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">
                        {task.progress}%
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <p className="text-gray-700 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Sub-Tasks Section */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Sub-Tasks
                  </h2>
                  <button
                    onClick={handleAddSubtask}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Sub-Task
                  </button>
                </div>

                <div className="space-y-3">
                  {task.subtasks && task.subtasks.length > 0 ? (
                    task.subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <select
                          value={subtask.status}
                          onChange={(e) =>
                            handleSubtaskStatusChange(
                              subtask.id,
                              e.target.value
                            )
                          }
                          className={`text-sm px-3 py-1 rounded border ${getStatusColor(subtask.status)}`}
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                        <span className="flex-1 text-gray-900">
                          {subtask.name}
                        </span>
                        <div
                          className={`w-6 h-6 ${assigneeAvatar.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                        >
                          {assigneeAvatar.initials}
                        </div>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No subtasks available</p>
                      <p className="text-sm">
                        Click &quot;Sub-Task&quot; above to add one
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column - Comments */}
            <div className="space-y-6">
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Comments
                  </h2>
                  <select className="text-sm text-gray-600 bg-white border border-gray-300 rounded px-3 py-1">
                    <option>All Activity</option>
                    <option>Comments Only</option>
                    <option>Actions Only</option>
                  </select>
                </div>

                {/* Comments Feed */}
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {task.comments && task.comments.length > 0 ? (
                    task.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div
                          className={`w-8 h-8 ${comment.hasProfilePic ? "bg-blue-500" : "bg-gray-300"} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                        >
                          {comment.hasProfilePic ? "JC" : "JB"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {comment.author}
                            </span>
                            <span className="text-sm text-gray-500">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No comments yet</p>
                      <p className="text-sm">
                        Be the first to comment on this task
                      </p>
                    </div>
                  )}
                </div>

                {/* Comment Input */}
                <div className="mt-6 space-y-3">
                  <div className="flex gap-3">
                    <div
                      className={`w-8 h-8 ${assigneeAvatar.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                    >
                      {assigneeAvatar.initials}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Write a comment"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <List className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded">
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Post
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
