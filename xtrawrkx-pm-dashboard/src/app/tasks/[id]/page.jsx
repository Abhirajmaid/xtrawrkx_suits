"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Share2,
  Download,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  Activity,
  GitBranch,
  TrendingUp,
  Target,
  Users,
  Flag,
  Tag,
  Link as LinkIcon,
  MoreVertical,
  Plus,
} from "lucide-react";
import { Card } from "../../../components/ui";
import PageHeader from "../../../components/shared/PageHeader";
import taskService from "../../../lib/taskService";
import subtaskService from "../../../lib/subtaskService";
import commentService from "../../../lib/commentService";
import { transformTask, transformSubtask, transformComment } from "../../../lib/dataTransformers";

export default function TaskDetailPage({ params: paramsProp }) {
  const router = useRouter();
  const [params, setParams] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");

  // Handle params (can be Promise in Next.js 15+)
  useEffect(() => {
    const resolveParams = async () => {
      if (paramsProp instanceof Promise) {
        const resolved = await paramsProp;
        setParams(resolved);
      } else {
        setParams(paramsProp);
      }
    };
    resolveParams();
  }, [paramsProp]);

  // Load task data
  useEffect(() => {
    const loadTask = async () => {
      if (!params?.id) return;

      try {
        setIsLoading(true);
        setError(null);

        const taskId = parseInt(params.id, 10);
        if (isNaN(taskId)) {
          throw new Error("Invalid task ID");
        }

        // Fetch task with all relations
        const strapiTask = await taskService.getTaskById(taskId, [
          'project', 'assignee', 'createdBy', 'subtasks', 'subtasks.assignee', 'subtasks.childSubtasks'
        ]);

        // Transform to frontend format
        const transformedTask = transformTask(strapiTask);
        setTask(transformedTask);

        // Fetch comments for this task
        const commentsResponse = await commentService.getTaskComments(taskId);
        const transformedComments = commentsResponse.data?.map(transformComment) || [];
        setComments(transformedComments);

        // TODO: Fetch activities when available
        setActivities([]);

      } catch (error) {
        console.error("Error loading task:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (params?.id) {
      loadTask();
    }
  }, [params]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "In Progress":
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "In Review":
      case "IN_REVIEW":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "To Do":
      case "TODO":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Backlog":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "MEDIUM":
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "LOW":
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getAssigneeAvatar = (assignee) => {
    if (assignee) {
      return {
        initials: assignee.initials || (assignee.name ? assignee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "??"),
        color: assignee.color || "bg-blue-500",
      };
    }
    return {
      initials: "??",
      color: "bg-gray-500",
    };
  };

  const getAssigneeName = (assignee) => {
    if (!assignee) return "Unassigned";
    return assignee.name || assignee.firstName || "Unknown Assignee";
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !task) return;

    try {
      const createdComment = await commentService.createTaskComment(
        task.id,
        newComment,
        1 // TODO: Get current user ID from auth context
      );

      const transformedComment = transformComment(createdComment);
      setComments(prev => [...prev, transformedComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditTask = () => {
    router.push(`/tasks/${task.id}/edit`);
  };

  const handleShareTask = () => {
    // TODO: Implement share functionality
    console.log("Share task");
  };

  const handleExportTask = () => {
    // TODO: Implement export functionality
    console.log("Export task");
  };

  const tabItems = [
    { key: "overview", label: "Overview", icon: FileText },
    { key: "subtasks", label: "Subtasks", icon: GitBranch },
    { key: "comments", label: "Comments", icon: MessageSquare },
    { key: "activity", label: "Activity", icon: Activity },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error ? "Error Loading Task" : "Task not found"}
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The task you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.push("/my-task")}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  const assigneeAvatar = getAssigneeAvatar(task.assignee);
  const allSubtasks = task.subtasks || [];
  const completedSubtasks = allSubtasks.filter(st => st.status === "Done" || st.status === "COMPLETED").length;
  const totalSubtasks = allSubtasks.length;

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 space-y-4">
        <PageHeader
          title={task.name}
          subtitle={`${task.project?.name || "No Project"} • ${task.status || "Unknown Status"}`}
          breadcrumb={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "My Tasks", href: "/my-task" },
            {
              label: task.name,
              href: `/tasks/${task.id}`,
            },
          ]}
          showProfile={true}
          actions={[
            {
              icon: Edit,
              onClick: handleEditTask,
              className: "",
              title: "Edit Task",
            },
            {
              icon: Share2,
              onClick: handleShareTask,
              className: "",
              title: "Share Task",
            },
            {
              icon: Download,
              onClick: handleExportTask,
              className: "",
              title: "Export Task Data",
            },
          ]}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  Progress
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {task.progress || 0}%
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-blue-200">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  Subtasks
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {completedSubtasks}/{totalSubtasks}
                </p>
              </div>
              <div className="w-16 h-16 bg-purple-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-purple-200">
                <GitBranch className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  Comments
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {comments.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-green-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-green-200">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  Time Spent
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {task.timeSpent || "0h"}
                </p>
              </div>
              <div className="w-16 h-16 bg-orange-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-orange-200">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-2 shadow-lg">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === tab.key
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-transparent text-gray-700 hover:bg-white/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Task Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Status
                      </label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                          {task.status || "Unknown"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Priority
                      </label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority || "Medium"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Assignee
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <div
                          className={`w-8 h-8 ${assigneeAvatar.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}
                        >
                          {assigneeAvatar.initials}
                        </div>
                        <span className="text-gray-900">
                          {getAssigneeName(task.assignee)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Project
                      </label>
                      <p className="text-gray-900 mt-1">
                        {task.project?.name || "No Project"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Due Date
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "No due date"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Created By
                      </label>
                      <p className="text-gray-900 mt-1">
                        {task.createdBy?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Description
                    </label>
                    <p className="text-gray-900 mt-1 leading-relaxed">
                      {task.description || "No description provided"}
                    </p>
                  </div>
                  {task.progress !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">
                        Progress
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                          {task.progress || 0}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleEditTask}
                    className="w-full flex items-center justify-start px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Task
                  </button>
                  <button
                    onClick={() => setActiveTab("subtasks")}
                    className="w-full flex items-center justify-start px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subtask
                  </button>
                  <button
                    onClick={() => setActiveTab("comments")}
                    className="w-full flex items-center justify-start px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Comment
                  </button>
                </div>
              </div>

              {/* Task Details */}
              <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Task Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Created
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {task.createdAt
                          ? new Date(task.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Last Updated
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {task.updatedAt
                          ? new Date(task.updatedAt).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                  {task.tags && task.tags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "subtasks" && (
          <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Subtasks ({totalSubtasks})
              </h3>
              <button
                onClick={() => {
                  // TODO: Open add subtask modal
                  console.log("Add subtask");
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Subtask
              </button>
            </div>
            {allSubtasks.length > 0 ? (
              <div className="space-y-2">
                {allSubtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/30 hover:bg-white/70 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={subtask.status === "Done" || subtask.status === "COMPLETED"}
                        onChange={() => {
                          // TODO: Handle status change
                        }}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span
                        className={`flex-1 ${
                          subtask.status === "Done" || subtask.status === "COMPLETED"
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                      >
                        {subtask.name}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(subtask.status)}`}>
                        {subtask.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <GitBranch className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">No subtasks yet</p>
                <p className="text-sm">Click "Add Subtask" to create one</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Comments ({comments.length})
              </h3>
            </div>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-4 bg-white/50 rounded-lg border border-white/30">
                    <div
                      className={`w-10 h-10 ${comment.user?.color || "bg-blue-500"} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                    >
                      {comment.user?.initials || "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {comment.author || comment.user?.name || "Unknown"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {comment.timestamp || new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">No comments yet</p>
                  <p className="text-sm">Be the first to comment on this task</p>
                </div>
              )}
            </div>
            <div className="border-t border-white/30 pt-4">
              <div className="flex gap-3">
                <div
                  className={`w-10 h-10 ${assigneeAvatar.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                >
                  {assigneeAvatar.initials}
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg shadow-lg transition-all duration-300"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Activity Log
              </h3>
            </div>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 p-4 bg-white/50 rounded-lg border border-white/30"
                  >
                    <Activity className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">No activity yet</p>
                <p className="text-sm">Activity will appear here as the task progresses</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
