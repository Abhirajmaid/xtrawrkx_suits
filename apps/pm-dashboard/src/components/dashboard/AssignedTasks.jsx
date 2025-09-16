import React, { useState } from "react";
import {
  ChevronDown,
  MoreHorizontal,
  Eye,
  Calendar,
  X,
  Clock,
  User,
  Tag,
  CheckCircle,
} from "lucide-react";

const AssignedTasks = ({ data }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        You don&apos;t assigned any task
      </p>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        List of tasks you&apos;re assigned to will appear here.
      </p>
    </div>
  );

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const TaskCard = ({ task }) => {
    const getPriorityColor = (priority = "medium") => {
      switch (priority) {
        case "high":
          return "bg-red-100 text-red-700 border-red-200";
        case "medium":
          return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case "low":
          return "bg-green-100 text-green-700 border-green-200";
        default:
          return "bg-gray-100 text-gray-700 border-gray-200";
      }
    };

    const getUrgencyColor = (dueDate) => {
      if (dueDate.includes("20 hours")) return "text-red-600";
      if (dueDate.includes("3 days")) return "text-orange-600";
      return "text-gray-600";
    };

    return (
      <div className="group bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <h4 className="font-semibold text-gray-900 text-lg truncate">
                {task.name}
              </h4>
            </div>

            <div className="ml-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-base text-gray-600 font-medium">
                    {task.project}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span
                      className={`text-base font-semibold ${getUrgencyColor(task.dueDate)}`}
                    >
                      {task.dueDate}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full border ${getPriorityColor(task.priority || "medium")}`}
                  >
                    {task.priority || "Medium"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleViewTask(task)}
            className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-lg transition-all duration-200 ml-3"
            title="View task details"
          >
            <Eye className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
    );
  };

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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
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
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      selectedTask.priority === "high"
                        ? "bg-red-100 text-red-700 border-red-200"
                        : selectedTask.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-green-100 text-green-700 border-green-200"
                    }`}
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
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
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
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${subtaskProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Subtasks List */}
              <div className="space-y-3">
                {mockSubtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Created 3 days ago • Updated 2 hours ago
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit Task
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Mark Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-gray-100 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Assigned Tasks
              </h3>
              <p className="text-base text-gray-500 mt-1">
                {data.length} task{data.length !== 1 ? "s" : ""} assigned to you
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                <span>Nearest Due Date</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4">
          {data.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="space-y-3 flex-1">
                {data.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
              {data.length > 0 && (
                <div className="pt-4 border-t border-gray-200 mt-auto">
                  <button className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 py-3 px-4 font-semibold hover:bg-blue-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200 group">
                    <span>Show All Tasks</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold group-hover:bg-blue-200">
                      {data.length}
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isModalOpen && <TaskDetailModal />}
    </>
  );
};

export default AssignedTasks;
