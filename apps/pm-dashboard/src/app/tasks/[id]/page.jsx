"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Calendar,
  ChevronDown,
  ChevronRight,
  Edit,
  Plus,
  MoreVertical,
  Share,
  List,
  Paperclip,
  Image,
  X,
  GitBranch,
} from "lucide-react";
import { Card } from "@xtrawrkx/ui";
import { getEnrichedTask, teamMembers, tasks } from "../../../data/centralData";

export default function TaskDetailPage({ params }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [expandedSubtasks, setExpandedSubtasks] = useState(new Set());
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
            status: "Done",
            assignee: "You",
            assigneeId: 1,
            progress: 100,
            dueDate: "2024-01-15",
            subtasks: [
              {
                id: 11,
                name: "Research color palettes",
                status: "Done",
                assignee: "You",
                assigneeId: 1,
                progress: 100,
                dueDate: "2024-01-12",
              },
              {
                id: 12,
                name: "Gather inspiration images",
                status: "Done",
                assignee: "You",
                assigneeId: 1,
                progress: 100,
                dueDate: "2024-01-14",
              },
            ],
          },
          {
            id: 2,
            name: "Option 1: Gradient",
            status: "In Progress",
            assignee: "You",
            assigneeId: 1,
            progress: 60,
            dueDate: "2024-01-20",
            subtasks: [
              {
                id: 21,
                name: "Create gradient variations",
                status: "In Progress",
                assignee: "You",
                assigneeId: 1,
                progress: 40,
                dueDate: "2024-01-18",
              },
              {
                id: 22,
                name: "Test gradient accessibility",
                status: "To Do",
                assignee: "You",
                assigneeId: 1,
                progress: 0,
                dueDate: "2024-01-19",
              },
            ],
          },
          {
            id: 3,
            name: "Option 2: Light Mode",
            status: "To Do",
            assignee: "You",
            assigneeId: 1,
            progress: 0,
            dueDate: "2024-01-25",
          },
          {
            id: 4,
            name: "Option 3: Different Layout",
            status: "To Do",
            assignee: "You",
            assigneeId: 1,
            progress: 0,
            dueDate: "2024-01-30",
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
    const updateSubtasks = (subtasks) => {
      return subtasks.map((subtask) => {
        if (subtask.id === subtaskId) {
          return { ...subtask, status: newStatus };
        }
        if (subtask.subtasks && subtask.subtasks.length > 0) {
          return {
            ...subtask,
            subtasks: updateSubtasks(subtask.subtasks),
          };
        }
        return subtask;
      });
    };

    setTask((prev) => ({
      ...prev,
      subtasks: updateSubtasks(prev.subtasks || []),
    }));
  };

  const handleAddSubtask = () => {
    const newSubtask = {
      id: Date.now(),
      name: "New Subtask",
      status: "To Do",
      assignee: "You",
      assigneeId: 1,
      progress: 0,
      dueDate: null,
    };
    setTask((prev) => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), newSubtask],
    }));
  };

  const toggleSubtaskExpansion = (subtaskId) => {
    console.log(
      "Toggling subtask:",
      subtaskId,
      "Current expanded:",
      expandedSubtasks
    );
    setExpandedSubtasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subtaskId)) {
        newSet.delete(subtaskId);
        console.log("Collapsing subtask:", subtaskId);
      } else {
        newSet.add(subtaskId);
        console.log("Expanding subtask:", subtaskId);
      }
      console.log("New expanded set:", newSet);
      return newSet;
    });
  };

  // Helper function to get all subtasks recursively
  const getAllSubtasks = (subtasks) => {
    let allSubtasks = [];
    subtasks.forEach((subtask) => {
      allSubtasks.push(subtask);
      if (subtask.subtasks && subtask.subtasks.length > 0) {
        allSubtasks = allSubtasks.concat(getAllSubtasks(subtask.subtasks));
      }
    });
    return allSubtasks;
  };

  const renderSubtaskRow = (subtask, level = 0) => {
    const hasNestedSubtasks = subtask.subtasks && subtask.subtasks.length > 0;
    const isExpanded = expandedSubtasks.has(subtask.id);
    const assigneeAvatar = getAssigneeAvatar(
      subtask.assigneeId || task.assigneeId
    );

    return (
      <React.Fragment key={subtask.id}>
        <tr className="hover:bg-white/40 hover:backdrop-blur-sm transition-all duration-200">
          <td className="px-4 py-3">
            <input
              type="checkbox"
              checked={subtask.status === "Done"}
              onChange={(e) => {
                e.stopPropagation();
                handleSubtaskStatusChange(
                  subtask.id,
                  e.target.checked ? "Done" : "To Do"
                );
              }}
              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
            />
          </td>
          <td
            className="px-4 py-3"
            style={{ paddingLeft: `${16 + level * 24}px` }}
          >
            <div className="flex items-center space-x-2">
              {hasNestedSubtasks ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSubtaskExpansion(subtask.id);
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              ) : (
                <div className="w-6 h-6" />
              )}
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm font-medium transition-all duration-200 ${
                    subtask.status === "Done"
                      ? "text-gray-500 line-through"
                      : "text-gray-900"
                  }`}
                >
                  {subtask.name}
                </span>
                {hasNestedSubtasks && (
                  <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-0.5">
                    <span className="text-xs text-gray-600 font-medium">
                      {subtask.subtasks.length}
                    </span>
                    <GitBranch className="h-3 w-3 text-gray-500" />
                  </div>
                )}
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <select
              value={subtask.status}
              onChange={(e) =>
                handleSubtaskStatusChange(subtask.id, e.target.value)
              }
              className={`text-sm px-3 py-1 rounded border ${getStatusColor(subtask.status)}`}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center space-x-2">
              <div
                className={`w-6 h-6 ${assigneeAvatar.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}
              >
                {assigneeAvatar.initials}
              </div>
              <span className="text-sm text-gray-700">
                {getAssigneeName(subtask.assignee || task.assignee)}
              </span>
            </div>
          </td>
          <td className="px-4 py-3">
            <span className="text-sm text-gray-600">
              {subtask.dueDate
                ? new Date(subtask.dueDate).toLocaleDateString()
                : "No due date"}
            </span>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${subtask.progress || 0}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 font-medium min-w-[3rem]">
                {subtask.progress || 0}%
              </span>
            </div>
          </td>
          <td className="px-4 py-3">
            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </td>
        </tr>
        {/* Render nested subtasks if expanded */}
        {hasNestedSubtasks &&
          isExpanded &&
          subtask.subtasks.map((nestedSubtask) =>
            renderSubtaskRow(nestedSubtask, level + 1)
          )}
      </React.Fragment>
    );
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
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-auto w-full relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-blue-500/8 to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-bl from-green-400/8 to-teal-500/5 rounded-full blur-3xl" />
      </div>
      {/* Header */}
      <div className="border-b border-white/30 bg-white/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
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
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg hover:bg-white/90 hover:shadow-md transition-all duration-300">
                <User className="w-4 h-4" />
                Assign
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg hover:bg-white/90 hover:shadow-md transition-all duration-300">
                <Share className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative z-10">
        <div className="w-full mx-auto px-6 py-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column - Task Details */}
            <div className="lg:col-span-3 space-y-6">
              {/* Overview Section */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Overview
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-white/60 backdrop-blur-sm rounded-lg transition-all duration-300 border border-white/30"
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
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Sub-Tasks
                  </h2>
                  <button
                    onClick={handleAddSubtask}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl rounded-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Plus className="w-4 h-4" />
                    Sub-Task
                  </button>
                </div>

                <div className="overflow-x-auto">
                  {task.subtasks && task.subtasks.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/30 bg-white/40 backdrop-blur-sm">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                              onChange={(e) => {
                                // Handle select all subtasks
                                const allSubtasks = getAllSubtasks(
                                  task.subtasks
                                );
                                allSubtasks.forEach((subtask) => {
                                  handleSubtaskStatusChange(
                                    subtask.id,
                                    e.target.checked ? "Done" : "To Do"
                                  );
                                });
                              }}
                            />
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Task Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assignee
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/30 backdrop-blur-sm divide-y divide-white/20">
                        {task.subtasks.map((subtask) =>
                          renderSubtaskRow(subtask)
                        )}
                      </tbody>
                    </table>
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
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
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
                    <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl rounded-lg transition-all duration-300 hover:scale-[1.02]">
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
