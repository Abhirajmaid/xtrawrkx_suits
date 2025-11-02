"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Edit,
  Filter,
  X,
  AlertCircle,
} from "lucide-react";
import { Button, Avatar, Badge } from "../ui";
import taskService from "../../lib/api/taskService";
import { useAuth } from "../../contexts/AuthContext";
import {
  format,
  isPast,
  isToday,
  isTomorrow,
  differenceInDays,
} from "date-fns";

const TaskTab = ({ entityType, entityId, onActivityCreated }) => {
  const { user } = useAuth();

  // Tasks state
  const [tasksList, setTasksList] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    scheduledDate: "",
    assignee: "",
    priority: "MEDIUM",
  });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, PENDING, COMPLETED
  const [sortBy, setSortBy] = useState("DATE_DESC"); // DATE_DESC, DATE_ASC, PRIORITY

  // Fetch Tasks from separate task system
  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const response = await taskService.getTasks(entityType, entityId);
      const tasks = response?.data || [];

      const transformed = tasks
        .map((task) => {
          const taskData = task.attributes || task;
          return {
            id: task.id,
            ...taskData,
            createdBy:
              taskData.createdBy?.data?.attributes || taskData.createdBy,
            assignee: taskData.assignee?.data?.attributes || taskData.assignee,
            priority: taskData.priority || "MEDIUM",
            status: taskData.status || "SCHEDULED",
          };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setTasksList(transformed);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasksList([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Fetch data when entityId changes
  useEffect(() => {
    if (entityId) {
      fetchTasks();
    }
  }, [entityId, entityType]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await fetch("/api/users?pagination[pageSize]=100", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (showNewTask || editingTask) {
      fetchUsers();
    }
  }, [showNewTask, editingTask]);

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      alert("Please enter task title");
      return;
    }

    try {
      const userId = user?.documentId || user?.id || user?.data?.id;

      if (!userId) {
        alert(
          "Unable to identify user. Please refresh the page and try again."
        );
        return;
      }

      const taskData = {
        title: newTask.title,
        description: newTask.description || null,
        status: "SCHEDULED",
        scheduledDate: newTask.scheduledDate || null,
        priority: newTask.priority || "MEDIUM",
        assignee: newTask.assignee || null,
      };

      await taskService.createTask(entityType, entityId, taskData, userId);

      setNewTask({
        title: "",
        description: "",
        scheduledDate: "",
        assignee: "",
        priority: "MEDIUM",
      });
      setShowNewTask(false);

      // Refresh tasks after a short delay to ensure the new task is included
      setTimeout(() => {
        fetchTasks();
      }, 500);

      if (onActivityCreated) onActivityCreated();
    } catch (error) {
      console.error("Error creating task:", error);
      alert(`Failed to create task: ${error.message}`);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask.title.trim()) {
      alert("Please enter task title");
      return;
    }

    try {
      const taskData = {
        title: editingTask.title,
        description: editingTask.description || null,
        scheduledDate: editingTask.scheduledDate || null,
        priority: editingTask.priority || "MEDIUM",
        assignee: editingTask.assignee || null,
      };

      await taskService.updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setTimeout(() => {
        fetchTasks();
      }, 500);
    } catch (error) {
      console.error("Error updating task:", error);
      alert(`Failed to update task: ${error.message}`);
    }
  };

  const handleCompleteActivity = async (taskId) => {
    try {
      const task = tasksList.find((t) => t.id === taskId);
      const newStatus = task.status === "COMPLETED" ? "SCHEDULED" : "COMPLETED";
      await taskService.updateStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status");
    }
  };

  const handleDeleteActivity = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskService.deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask({
      id: task.id,
      title: task.title || "",
      description: task.description || "",
      scheduledDate: task.scheduledDate
        ? format(new Date(task.scheduledDate), "yyyy-MM-dd")
        : "",
      assignee: task.assignee?.id || task.assignee || "",
      priority: task.priority || "MEDIUM",
    });
  };

  // Format date for display
  const formatTaskDate = (date) => {
    if (!date) return null;
    const taskDate = new Date(date);

    if (isToday(taskDate)) {
      return "Today";
    } else if (isTomorrow(taskDate)) {
      return "Tomorrow";
    } else if (isPast(taskDate)) {
      const daysPast = differenceInDays(new Date(), taskDate);
      return `${daysPast} day${daysPast > 1 ? "s" : ""} ago`;
    } else {
      return format(taskDate, "MMM d, yyyy");
    }
  };

  // Get date urgency status
  const getDateStatus = (date) => {
    if (!date) return null;
    const taskDate = new Date(date);

    if (isPast(taskDate)) {
      return "OVERDUE";
    } else if (isToday(taskDate)) {
      return "DUE_TODAY";
    } else if (differenceInDays(taskDate, new Date()) <= 3) {
      return "DUE_SOON";
    }
    return "UPCOMING";
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "LOW":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = tasksList
    .filter((task) => {
      if (filterStatus === "ALL") return true;
      if (filterStatus === "PENDING") return task.status !== "COMPLETED";
      if (filterStatus === "COMPLETED") return task.status === "COMPLETED";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "DATE_ASC") {
        const dateA = a.scheduledDate ? new Date(a.scheduledDate) : new Date(0);
        const dateB = b.scheduledDate ? new Date(b.scheduledDate) : new Date(0);
        return dateA - dateB;
      } else if (sortBy === "DATE_DESC") {
        const dateA = a.scheduledDate ? new Date(a.scheduledDate) : new Date(0);
        const dateB = b.scheduledDate ? new Date(b.scheduledDate) : new Date(0);
        return dateB - dateA;
      } else if (sortBy === "PRIORITY") {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return (
          (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        );
      }
      return 0;
    });

  return (
    <>
      <div className="space-y-4">
        {/* Header with Add Task Button */}
        <div className="flex items-center justify-end mb-2">
          <Button
            size="sm"
            onClick={() => setShowNewTask(true)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Filters and Sort */}
        {tasksList.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/40">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm bg-transparent border-none outline-none text-gray-700 font-medium"
              >
                <option value="ALL">All Tasks</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/40">
              <Clock className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-transparent border-none outline-none text-gray-700 font-medium"
              >
                <option value="DATE_DESC">Date: Newest</option>
                <option value="DATE_ASC">Date: Oldest</option>
                <option value="PRIORITY">Priority</option>
              </select>
            </div>
          </div>
        )}

        {/* Tasks List */}
        {loadingTasks ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            <span className="ml-2 text-gray-600">Loading tasks...</span>
          </div>
        ) : filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-2">✅</div>
            <p className="text-gray-600 font-medium">
              {filterStatus === "ALL"
                ? "No tasks yet"
                : filterStatus === "COMPLETED"
                ? "No completed tasks"
                : "No pending tasks"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {filterStatus === "ALL"
                ? "Create tasks to track your work"
                : "Try changing the filter"}
            </p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-200">
                  <tr>
                    <th className="w-12 px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500 focus:ring-1"
                        onChange={(e) => {
                          // Select all/deselect all logic can be added here
                        }}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignee
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedTasks.map((task) => {
                    const dateStatus = getDateStatus(task.scheduledDate);
                    const isOverdue =
                      dateStatus === "OVERDUE" && task.status !== "COMPLETED";

                    return (
                      <tr
                        key={task.id}
                        className={`group hover:bg-gray-50 transition-colors duration-200 ${
                          task.status === "COMPLETED" ? "opacity-75" : ""
                        } ${isOverdue ? "bg-red-50/50" : ""}`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={task.status === "COMPLETED"}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleCompleteActivity(task.id);
                            }}
                            className="w-4 h-4 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500 focus:ring-1"
                          />
                        </td>

                        {/* Task Name */}
                        <td className="px-4 py-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p
                                className={`font-semibold text-sm truncate transition-all duration-200 ${
                                  task.status === "COMPLETED"
                                    ? "text-gray-500 line-through"
                                    : "text-gray-900"
                                }`}
                              >
                                {task.title}
                              </p>
                              {isOverdue && (
                                <Badge className="text-xs px-1.5 py-0.5 border bg-red-100 text-red-700 border-red-200">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Overdue
                                </Badge>
                              )}
                            </div>
                            {task.description && (
                              <p
                                className={`text-xs truncate transition-all duration-200 ${
                                  task.status === "COMPLETED"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {task.description}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Assignee */}
                        <td className="px-4 py-3">
                          {task.assignee ? (
                            <div className="flex items-center space-x-2">
                              <Avatar
                                fallback={
                                  (
                                    (task.assignee.firstName?.[0] || "") +
                                    (task.assignee.lastName?.[0] || "")
                                  ).toUpperCase() || "U"
                                }
                                size="sm"
                                className="w-7 h-7 border border-gray-200"
                              />
                              <span className="text-sm text-gray-900">
                                {task.assignee.firstName}{" "}
                                {task.assignee.lastName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Unassigned
                            </span>
                          )}
                        </td>

                        {/* Due Date */}
                        <td className="px-4 py-3">
                          {task.scheduledDate ? (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <div
                                  className={`text-sm font-medium ${
                                    isOverdue
                                      ? "text-red-600"
                                      : dateStatus === "DUE_TODAY"
                                      ? "text-yellow-600"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {formatTaskDate(task.scheduledDate)}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No due date
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <Badge
                            className={`text-xs px-2 py-1 rounded-full border ${
                              task.status === "COMPLETED"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : task.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : task.status === "CANCELLED"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {task.status.replace("_", " ")}
                          </Badge>
                        </td>

                        {/* Priority */}
                        <td className="px-4 py-3">
                          <Badge
                            className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority || "MEDIUM"}
                          </Badge>
                        </td>

                        {/* Created By */}
                        <td className="px-4 py-3">
                          {task.createdBy ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-700">
                                {task.createdBy.firstName}{" "}
                                {task.createdBy.lastName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {task.status !== "COMPLETED" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditTask(task);
                                }}
                                className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors text-gray-400 hover:text-orange-600"
                                title="Edit Task"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteActivity(task.id);
                              }}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                              title="Delete Task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Table Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50/50">
              <div className="text-sm text-gray-600">
                {filteredAndSortedTasks.length} Task
                {filteredAndSortedTasks.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {typeof window !== "undefined" &&
        showNewTask &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Add Task</h2>
                  <Button
                    onClick={() => {
                      setShowNewTask(false);
                      setNewTask({
                        title: "",
                        description: "",
                        scheduledDate: "",
                        assignee: "",
                        priority: "MEDIUM",
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateTask();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                      placeholder="Enter task title..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                      placeholder="Task description..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newTask.scheduledDate}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            scheduledDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) =>
                          setNewTask({ ...newTask, priority: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign To
                    </label>
                    <select
                      value={newTask.assignee}
                      onChange={(e) =>
                        setNewTask({ ...newTask, assignee: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                    >
                      <option value="">Select assignee...</option>
                      <option value={user?.id}>Assign to me</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.attributes?.firstName} {u.attributes?.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowNewTask(false);
                        setNewTask({
                          title: "",
                          description: "",
                          scheduledDate: "",
                          assignee: "",
                          priority: "MEDIUM",
                        });
                      }}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!newTask.title.trim()}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg disabled:opacity-50"
                    >
                      Add Task
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Edit Task Modal */}
      {typeof window !== "undefined" &&
        editingTask &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Task
                  </h2>
                  <Button
                    onClick={() => setEditingTask(null)}
                    className="text-gray-400 hover:text-gray-600"
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateTask();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          title: e.target.value,
                        })
                      }
                      placeholder="Enter task title..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingTask.description}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          description: e.target.value,
                        })
                      }
                      placeholder="Task description..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={editingTask.scheduledDate}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            scheduledDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={editingTask.priority}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            priority: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign To
                    </label>
                    <select
                      value={editingTask.assignee}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          assignee: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                    >
                      <option value="">Select assignee...</option>
                      <option value={user?.id}>Assign to me</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.attributes?.firstName} {u.attributes?.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => setEditingTask(null)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!editingTask.title.trim()}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg disabled:opacity-50"
                    >
                      Update Task
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default TaskTab;
