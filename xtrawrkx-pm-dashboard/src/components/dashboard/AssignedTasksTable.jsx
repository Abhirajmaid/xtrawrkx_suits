import React, { useState } from "react";
import { Table } from "../ui";
import ModernButton from "../shared/ModernButton";
import {
  Eye,
  Calendar,
  Clock,
  User,
  Tag,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  ArrowRight,
  Edit,
  GitBranch,
} from "lucide-react";

const AssignedTasksTable = ({ data, onTaskComplete = () => {} }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const getPriorityColor = (priority = "medium") => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getUrgencyColor = (dueDate) => {
    if (!dueDate || typeof dueDate !== "string") return "text-gray-600";
    if (dueDate.includes("Overdue")) return "text-red-600";
    if (dueDate.includes("Due today") || dueDate.includes("Due tomorrow"))
      return "text-yellow-600";
    return "text-gray-600";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const columns = [
    {
      key: "completed",
      label: "",
      sortable: false,
      render: (_, row) => (
        <input
          type="checkbox"
          checked={row.status === "Done"}
          onChange={(e) => {
            e.stopPropagation();
            onTaskComplete(row.id, e.target.checked ? "Done" : "To Do");
          }}
          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
        />
      ),
    },
    {
      key: "name",
      label: "TASK",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0 hover:border-blue-500 transition-colors cursor-pointer"></div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <p
                className={`font-semibold text-sm truncate transition-all duration-200 ${
                  row.status === "Done"
                    ? "text-gray-500 line-through"
                    : "text-gray-900"
                }`}
              >
                {value}
              </p>
              {row.subtaskCount && row.subtaskCount > 0 && (
                <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-0.5">
                  <span className="text-xs text-gray-600 font-medium">
                    {row.subtaskCount}
                  </span>
                  <GitBranch className="h-3 w-3 text-gray-500" />
                </div>
              )}
            </div>
            <p
              className={`text-xs truncate mt-1 transition-all duration-200 ${
                row.status === "Done" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {row.description || "No description available"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "project",
      label: "PROJECT",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <div
            className={`w-6 h-6 rounded ${row.color || "bg-gray-500"} flex items-center justify-center`}
          >
            <span className="text-white text-xs font-bold">
              {value ? value.charAt(0).toUpperCase() : "?"}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: "assignee",
      label: "ASSIGNEE",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {row.assignee
                ? row.assignee
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
            </span>
          </div>
          <span className="text-sm text-gray-900">
            {row.assignee || "Unassigned"}
          </span>
        </div>
      ),
    },
    {
      key: "priority",
      label: "PRIORITY",
      sortable: true,
      render: (value) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(value)}`}
        >
          {value || "Medium"}
        </span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      sortable: true,
      render: (value) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(value)}`}
        >
          {value ? value.replace("_", " ") : "Pending"}
        </span>
      ),
    },
    {
      key: "progress",
      label: "PROGRESS",
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${value || 0}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-600 font-medium min-w-[3rem]">
            {value || 0}%
          </span>
        </div>
      ),
    },
    {
      key: "dueDateText",
      label: "DUE DATE",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {row.dueDate
                ? new Date(row.dueDate).toLocaleDateString()
                : "No due date"}
            </div>
            <div className={`text-xs font-medium ${getUrgencyColor(value)}`}>
              {value}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "time",
      label: "TIME",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {value || row.estimatedHours
              ? `${value || row.estimatedHours}h`
              : "No estimate"}
          </span>
        </div>
      ),
    },
    {
      key: "subtasks",
      label: "SUBTASKS",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center space-x-1">
          {row.subtaskCount > 0 ? (
            <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
              <span className="text-xs text-gray-600 font-medium">
                {row.subtaskCount}
              </span>
              <GitBranch className="h-3 w-3 text-gray-500" />
            </div>
          ) : (
            <span className="text-xs text-gray-400">None</span>
          )}
        </div>
      ),
    },
    {
      key: "tags",
      label: "TAGS",
      sortable: false,
      render: (_, row) => (
        <div className="flex flex-wrap gap-1">
          {(row.tags || []).slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
          {(row.tags || []).length > 2 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              +{(row.tags || []).length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "ACTIONS",
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewTask(row)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
            title="View task details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 hover:text-gray-700"
            title="Edit task"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const TaskDetailModal = () => {
    if (!selectedTask) return null;

    const mockSubtasks = [
      { id: 1, name: "Research competitor designs", completed: true },
      { id: 2, name: "Create initial wireframes", completed: true },
      { id: 3, name: "Design homepage mockup", completed: false },
      { id: 4, name: "Design about page mockup", completed: false },
      { id: 5, name: "Design contact page mockup", completed: false },
      { id: 6, name: "Review and refine designs", completed: false },
    ];

    const completedSubtasks = mockSubtasks.filter(
      (subtask) => subtask.completed
    ).length;
    const subtaskProgress = Math.round(
      (completedSubtasks / mockSubtasks.length) * 100
    );

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30 p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-white/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedTask.name}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project
                  </label>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-6 h-6 rounded ${selectedTask.color} flex items-center justify-center`}
                    >
                      <span className="text-white text-xs font-bold">
                        {selectedTask.project.charAt(0)}
                      </span>
                    </div>
                    <span className="text-gray-900">
                      {selectedTask.project}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">
                      {selectedTask.dueDate}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedTask.priority)}`}
                  >
                    {selectedTask.priority || "Medium"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    In Progress
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned to
                  </label>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">You</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Tracking
                  </label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">2h 30m logged</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <p className="text-gray-600 text-sm leading-relaxed">
                Create comprehensive mockups for the Yellow Branding project
                including homepage, about page, and contact sections. Ensure
                brand consistency and modern design principles.
              </p>
            </div>

            {/* Subtasks Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-lg font-semibold text-gray-900">
                  Subtasks
                </label>
                <span className="text-sm text-gray-500">
                  {completedSubtasks} of {mockSubtasks.length} completed
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Progress</span>
                  <span className="text-gray-900 font-bold">
                    {subtaskProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${subtaskProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Subtasks List */}
              <div className="space-y-3">
                {mockSubtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/80 hover:shadow-sm transition-all duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => {}}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span
                      className={`flex-1 text-sm ${
                        subtask.completed
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {subtask.name}
                    </span>
                    {subtask.completed && (
                      <span className="text-green-600">
                        <CheckCircle className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  <Tag className="h-3 w-3 mr-1" />
                  Design
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  <Tag className="h-3 w-3 mr-1" />
                  UI/UX
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  <Tag className="h-3 w-3 mr-1" />
                  High Priority
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/30 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Created 3 days ago • Updated 2 hours ago
              </div>
              <div className="flex items-center space-x-3">
                <ModernButton
                  type="secondary"
                  size="sm"
                  text="Edit Task"
                  className="bg-white/80 backdrop-blur-sm border border-gray-200"
                />
                <ModernButton
                  type="success"
                  size="sm"
                  text="Mark Complete"
                  icon={CheckCircle}
                  hideArrow
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </div>
      <p className="text-gray-900 font-semibold text-base mb-2">
        You don&apos;t have any assigned tasks
      </p>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        List of tasks you&apos;re assigned to will appear here.
      </p>
    </div>
  );

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
        <div className="px-6 py-5 border-b border-white/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">My Tasks</h3>
              <p className="text-sm text-gray-500 mt-1">
                Track your current tasks and progress
              </p>
            </div>
            <ModernButton
              type="secondary"
              size="sm"
              text="New Task"
              icon={Plus}
              className="bg-white/80 backdrop-blur-sm border border-gray-200"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 pb-4">
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full shadow-sm transition-all duration-200">
              All Tasks
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 transition-all duration-200">
              Upcoming
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 transition-all duration-200">
              Ongoing
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 transition-all duration-200">
              Completed
            </button>
          </div>
        </div>

        <div className="flex-1 p-4">
          {data.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              <Table
                columns={columns}
                data={data}
                onRowClick={handleViewTask}
                className="w-full"
              />

              {data.length > 0 && (
                <div className="pt-4 border-t border-white/30 backdrop-blur-sm">
                  <ModernButton
                    type="secondary"
                    size="sm"
                    text={`View All Tasks (${data.length})`}
                    className="w-full bg-white/80 backdrop-blur-sm border border-gray-200"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && <TaskDetailModal />}
    </>
  );
};

export default AssignedTasksTable;
