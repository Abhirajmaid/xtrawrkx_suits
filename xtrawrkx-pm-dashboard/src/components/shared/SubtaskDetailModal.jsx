"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ExternalLink,
  Calendar,
  Flag,
  ChevronDown,
  ChevronUp,
  Edit,
  GitBranch,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";
import subtaskService from "../../lib/subtaskService";
import { transformSubtask, formatDate } from "../../lib/dataTransformers";
import apiClient from "../../lib/apiClient";
import SubTasksSection from "./SubTasksSection";
import CommentsSection from "./CommentsSection";

export default function SubtaskDetailModal({
  isOpen,
  onClose,
  subtaskId,
  task,
  onTaskRefresh,
  onNavigateToSubtask,
  onNavigateToTask,
}) {
  const [subtask, setSubtask] = useState(null);
  const [activeTab, setActiveTab] = useState("subtasks");
  const [users, setUsers] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [localSubtask, setLocalSubtask] = useState(null);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);

  // Load subtask data
  const loadSubtask = useCallback(async () => {
    if (!subtaskId) return;

    try {
      const subtaskData = await subtaskService.getSubtaskById(subtaskId, [
        "task",
        "assignee",
        "parentSubtask",
        "childSubtasks",
        "childSubtasks.assignee",
        "childSubtasks.childSubtasks",
      ]);

      const transformedSubtask = transformSubtask(subtaskData);
      setSubtask(transformedSubtask);
      setLocalSubtask(transformedSubtask);
    } catch (error) {
      console.error("Error loading subtask:", error);
    }
  }, [subtaskId]);

  useEffect(() => {
    if (isOpen && subtaskId) {
      loadSubtask();
    } else {
      setSubtask(null);
      setLocalSubtask(null);
    }
  }, [isOpen, subtaskId, loadSubtask]);

  // Load users
  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  // Reset active tab when subtask changes
  useEffect(() => {
    if (subtask?.id) {
      setActiveTab("subtasks");
    }
  }, [subtask?.id]);

  const loadUsers = async () => {
    try {
      const usersResponse = await apiClient.get("/api/xtrawrkx-users", {
        "pagination[pageSize]": 100,
        "filters[isActive][$eq]": "true",
      });

      let usersData = [];
      if (usersResponse?.data && Array.isArray(usersResponse.data)) {
        usersData = usersResponse.data;
      } else if (Array.isArray(usersResponse)) {
        usersData = usersResponse;
      }

      const transformedUsers = usersData
        .filter((user) => user && user.id)
        .map((user) => {
          const userData = user.attributes || user;
          const firstName = userData.firstName || "";
          const lastName = userData.lastName || "";
          const email = userData.email || "";
          const name =
            `${firstName} ${lastName}`.trim() || email || "Unknown User";

          return {
            id: user.id,
            firstName,
            lastName,
            email,
            name,
          };
        });

      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = (status || "To Do")?.toLowerCase().replace(/\s+/g, "-");
    const statusColors = {
      "to-do": {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-400",
      },
      "in-progress": {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-400",
      },
      "in-review": {
        bg: "bg-purple-100",
        text: "text-purple-800",
        border: "border-purple-400",
      },
      done: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-400",
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-400",
      },
      cancelled: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-400",
      },
    };
    const colors = statusColors[statusLower] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-400",
    };
    return `${colors.bg} ${colors.text} ${colors.border}`;
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
      const name = typeof assignee === "object" ? assignee?.name : assignee;
      const initials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "??";
      return {
        initials,
        color: "bg-blue-500",
      };
    }
    return {
      initials: "??",
      color: "bg-gray-500",
    };
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!localSubtask?.id) return;
    const subtaskId = localSubtask.id;
    const oldStatus = localSubtask.status;

    // Update local state immediately for instant feedback
    setLocalSubtask((prev) => ({ ...prev, status: newStatus }));

    try {
      // Transform frontend status to Strapi format
      const statusMap = {
        "To Do": "SCHEDULED",
        "In Progress": "IN_PROGRESS",
        "In Review": "IN_REVIEW",
        Done: "COMPLETED",
        Cancelled: "CANCELLED",
      };
      const strapiStatus = statusMap[newStatus] || newStatus;

      await subtaskService.updateSubtask(subtaskId, { status: strapiStatus });

      if (onTaskRefresh) {
        try {
          await onTaskRefresh();
        } catch (refreshError) {
          console.warn("Could not refresh parent:", refreshError);
        }
      }

      await loadSubtask();
    } catch (error) {
      console.error("Error updating status:", error);
      setLocalSubtask((prev) => ({ ...prev, status: oldStatus }));
    }
  };

  const handlePriorityUpdate = async (newPriority) => {
    if (!localSubtask?.id) return;
    const subtaskId = localSubtask.id;
    const oldPriority = localSubtask.priority;

    // Update local state immediately
    setLocalSubtask((prev) => ({ ...prev, priority: newPriority }));

    try {
      // Transform frontend priority to Strapi format
      const priorityMap = {
        Low: "LOW",
        Medium: "MEDIUM",
        High: "HIGH",
      };
      const strapiPriority = priorityMap[newPriority] || newPriority;

      await subtaskService.updateSubtask(subtaskId, {
        priority: strapiPriority,
      });

      if (onTaskRefresh) {
        try {
          await onTaskRefresh();
        } catch (refreshError) {
          console.warn("Could not refresh parent:", refreshError);
        }
      }

      await loadSubtask();
    } catch (error) {
      console.error("Error updating priority:", error);
      setLocalSubtask((prev) => ({ ...prev, priority: oldPriority }));
    }
  };

  const handleAssigneeUpdate = async (newAssigneeId) => {
    if (!localSubtask?.id) return;
    try {
      await subtaskService.updateSubtask(localSubtask.id, {
        assignee: newAssigneeId || null,
      });
      await loadSubtask();
      if (onTaskRefresh) {
        await onTaskRefresh();
      }
    } catch (error) {
      console.error("Error updating assignee:", error);
    }
  };

  const handleDueDateUpdate = async (newDate) => {
    if (!localSubtask?.id) return;
    try {
      const dateValue = newDate ? new Date(newDate).toISOString() : null;
      await subtaskService.updateSubtask(localSubtask.id, {
        dueDate: dateValue,
      });
      await loadSubtask();
      if (onTaskRefresh) {
        await onTaskRefresh();
      }
    } catch (error) {
      console.error("Error updating due date:", error);
    }
  };

  const handleDescriptionUpdate = async (newDescription) => {
    if (!localSubtask?.id) return;
    const oldDescription = localSubtask.description || "";

    // Optimistic update
    setLocalSubtask((prev) => ({ ...prev, description: newDescription }));

    try {
      await subtaskService.updateSubtask(localSubtask.id, {
        description: newDescription || "",
      });
      await loadSubtask();
      if (onTaskRefresh) {
        await onTaskRefresh();
      }
    } catch (error) {
      console.error("Error updating description:", error);
      // Revert optimistic update on error
      setLocalSubtask((prev) => ({ ...prev, description: oldDescription }));
    }
  };

  const handleToggleComplete = async () => {
    if (!localSubtask?.id) return;
    const isCurrentlyComplete =
      localSubtask.status === "Done" ||
      localSubtask.status === "COMPLETED" ||
      localSubtask.status?.toLowerCase() === "done";
    const newStatus = isCurrentlyComplete ? "To Do" : "Done";

    // Trigger confetti animation only when completing (not uncompleting)
    if (!isCurrentlyComplete) {
      triggerConfetti();
    }

    await handleStatusUpdate(newStatus);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
    };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"],
      });

      // Confetti from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"],
      });
    }, 250);
  };

  if (!isOpen || !localSubtask) return null;

  // Ensure subtask has required properties with fallbacks
  const safeSubtask = {
    ...localSubtask,
    id: localSubtask.id,
    name: localSubtask.name || localSubtask.title || "Untitled Subtask",
    task: localSubtask.task || task,
    assignee: localSubtask.assignee || null,
    dueDate: localSubtask.dueDate || "No due date",
    status: localSubtask.status || "To Do",
    priority: localSubtask.priority || "Medium",
    progress: localSubtask.progress || 0,
    childSubtasks: localSubtask.childSubtasks || localSubtask.subtasks || [],
    description: localSubtask.description || "",
  };

  const isComplete =
    safeSubtask.status === "Done" ||
    safeSubtask.status === "COMPLETED" ||
    safeSubtask.status?.toLowerCase() === "done";

  const modalClasses =
    "fixed inset-y-0 right-0 bg-black/50 backdrop-blur-sm flex items-center justify-end z-[9999]";
  const contentClasses =
    "bg-white shadow-2xl w-[600px] h-screen max-h-screen border-l border-gray-200 flex flex-col";

  // Build breadcrumb path
  const breadcrumbs = [];
  if (safeSubtask.task) {
    breadcrumbs.push({
      label: safeSubtask.task.name || safeSubtask.task.title || "Task",
      type: "task",
      id: safeSubtask.task.id,
    });
  }
  if (safeSubtask.parentSubtask) {
    breadcrumbs.push({
      label:
        safeSubtask.parentSubtask.name ||
        safeSubtask.parentSubtask.title ||
        "Parent Subtask",
      type: "subtask",
      id: safeSubtask.parentSubtask.id,
    });
  }
  breadcrumbs.push({
    label: safeSubtask.name,
    type: "subtask",
    id: safeSubtask.id,
    current: true,
  });

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (crumb) => {
    if (crumb.current) return; // Don't navigate to current item

    if (crumb.type === "task" && onNavigateToTask) {
      onNavigateToTask(crumb.id);
    } else if (crumb.type === "subtask" && onNavigateToSubtask) {
      onNavigateToSubtask(crumb.id);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className={modalClasses}>
      <div className={contentClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2 flex-wrap">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-1">
                  {index > 0 && <ArrowRight className="w-3 h-3" />}
                  <button
                    onClick={() => handleBreadcrumbClick(crumb)}
                    disabled={crumb.current}
                    className={
                      crumb.current
                        ? "text-gray-900 font-medium cursor-default"
                        : "hover:text-blue-600 cursor-pointer text-gray-600 hover:underline transition-colors"
                    }
                  >
                    {crumb.label}
                  </button>
                </div>
              ))}
            </div>
            <h1
              className={`text-xl font-semibold truncate ${
                isComplete ? "text-gray-500 line-through" : "text-gray-900"
              }`}
            >
              {safeSubtask.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {/* Open Task Button */}
            {safeSubtask.task && (
              <button
                onClick={() => {
                  // Could navigate to task or open task modal
                  console.log("Open task:", safeSubtask.task);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                <ExternalLink className="w-4 h-4" />
                Open Task
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content - Full Height No Scroll */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto bg-gray-50">
          {/* Subtask Details Card - Matching task details page */}
          <div className="p-6 flex-shrink-0">
            <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
              {/* Mark Complete Bar */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <button
                  onClick={handleToggleComplete}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    isComplete
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 hover:border-green-500"
                  }`}
                >
                  {isComplete && <CheckCircle2 className="w-4 h-4" />}
                </button>
                <span className="text-sm text-gray-700 font-medium">
                  {isComplete ? "Subtask completed" : "Mark as complete"}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Subtask Details
                </h3>
                <button
                  onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title={isDetailsExpanded ? "Collapse" : "Expand"}
                >
                  {isDetailsExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              {isDetailsExpanded && (
                <div className="space-y-3">
                  {/* Task/Parent Subtask */}
                  {safeSubtask.parentSubtask && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <label className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                        Parent Subtask
                      </label>
                      <div className="flex-1 flex items-center gap-2 justify-end">
                        <GitBranch className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900">
                          {safeSubtask.parentSubtask.name ||
                            safeSubtask.parentSubtask.title ||
                            "Unknown"}
                        </span>
                      </div>
                    </div>
                  )}

                  {safeSubtask.task && !safeSubtask.parentSubtask && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <label className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                        Task
                      </label>
                      <div className="flex-1 flex items-center gap-2 justify-end">
                        <GitBranch className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900">
                          {safeSubtask.task.name ||
                            safeSubtask.task.title ||
                            "Unknown"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Assignee */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <label className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                      Assignee
                    </label>
                    <div className="flex-1 flex items-center gap-2 justify-end">
                      {editingField === "assignee" ? (
                        <select
                          value={editingValue || ""}
                          onChange={(e) => {
                            handleAssigneeUpdate(e.target.value);
                            setEditingField(null);
                          }}
                          onBlur={() => setEditingField(null)}
                          autoFocus
                          className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="">Unassigned</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <>
                          {(() => {
                            const assigneeAvatar = getAssigneeAvatar(
                              safeSubtask.assignee
                            );
                            return (
                              <>
                                <div
                                  className={`w-8 h-8 ${assigneeAvatar.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                                >
                                  {assigneeAvatar.initials}
                                </div>
                                <span
                                  className="text-gray-900 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                                  onClick={() => {
                                    setEditingValue(
                                      safeSubtask.assignee?.id?.toString() || ""
                                    );
                                    setEditingField("assignee");
                                  }}
                                >
                                  {typeof safeSubtask.assignee === "object"
                                    ? safeSubtask.assignee?.name || "Unassigned"
                                    : safeSubtask.assignee || "Unassigned"}
                                </span>
                                {safeSubtask.assignee && (
                                  <button
                                    onClick={() => handleAssigneeUpdate(null)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                  >
                                    <X className="w-4 h-4 text-gray-400" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setEditingValue(
                                      safeSubtask.assignee?.id?.toString() || ""
                                    );
                                    setEditingField("assignee");
                                  }}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                              </>
                            );
                          })()}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <label className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                      Due date
                    </label>
                    <div className="flex-1 flex items-center gap-2 justify-end">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {editingField === "dueDate" ? (
                        <input
                          type="date"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={() => {
                            handleDueDateUpdate(editingValue);
                            setEditingField(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleDueDateUpdate(editingValue);
                              setEditingField(null);
                            } else if (e.key === "Escape") {
                              setEditingField(null);
                            }
                          }}
                          autoFocus
                          className="text-sm text-gray-900 px-2 py-1 rounded border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <>
                          <span
                            className="text-gray-900 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                            onClick={() => {
                              const dateValue =
                                safeSubtask.dueDate &&
                                safeSubtask.dueDate !== "No due date"
                                  ? new Date(safeSubtask.dueDate)
                                      .toISOString()
                                      .split("T")[0]
                                  : "";
                              setEditingValue(dateValue);
                              setEditingField("dueDate");
                            }}
                          >
                            {safeSubtask.dueDate &&
                            safeSubtask.dueDate !== "No due date"
                              ? formatDate(safeSubtask.dueDate)
                              : "No due date"}
                          </span>
                          {safeSubtask.dueDate &&
                            safeSubtask.dueDate !== "No due date" && (
                              <button
                                onClick={() => handleDueDateUpdate(null)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <X className="w-4 h-4 text-gray-400" />
                              </button>
                            )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <label className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                      Status
                    </label>
                    <div className="flex-1 flex justify-end">
                      {editingField === "status" ? (
                        <select
                          value={editingValue}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            setEditingValue(newStatus);
                            await handleStatusUpdate(newStatus);
                            setEditingField(null);
                          }}
                          onBlur={() => setEditingField(null)}
                          autoFocus
                          className={`px-3 py-1.5 rounded-lg border-2 font-bold text-xs text-center shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                            editingValue
                          )}`}
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="In Review">In Review</option>
                          <option value="Done">Done</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span
                          onClick={() => {
                            setEditingValue(safeSubtask.status || "To Do");
                            setEditingField("status");
                          }}
                          className={`inline-block px-3 py-1.5 rounded-lg border-2 font-bold text-xs cursor-pointer hover:shadow-md transition-all ${getStatusColor(
                            safeSubtask.status
                          )}`}
                        >
                          {safeSubtask.status || "To Do"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <label className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                      Priority
                    </label>
                    <div className="flex-1 flex items-center gap-2 justify-end">
                      <Flag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {editingField === "priority" ? (
                        <select
                          value={editingValue}
                          onChange={async (e) => {
                            const newPriority = e.target.value;
                            setEditingValue(newPriority);
                            await handlePriorityUpdate(newPriority);
                            setEditingField(null);
                          }}
                          onBlur={() => setEditingField(null)}
                          autoFocus
                          className={`px-3 py-1.5 rounded-lg border-2 font-bold text-xs text-center shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${getPriorityColor(
                            editingValue
                          )}`}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      ) : (
                        <span
                          onClick={() => {
                            setEditingValue(safeSubtask.priority || "Medium");
                            setEditingField("priority");
                          }}
                          className={`inline-block px-3 py-1.5 rounded-lg border-2 font-bold text-xs cursor-pointer hover:shadow-md transition-all ${getPriorityColor(
                            safeSubtask.priority
                          )}`}
                        >
                          {safeSubtask.priority || "Medium"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center justify-between py-2">
                    <label className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                      Progress
                    </label>
                    <div className="flex-1 flex items-center gap-3 justify-end">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${safeSubtask.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 min-w-[3rem]">
                        {safeSubtask.progress || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description Section */}
              {isDetailsExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Description
                    </label>
                    {editingField !== "description" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingField("description");
                          setEditingValue(safeSubtask.description || "");
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit description"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {editingField === "description" ? (
                    <div className="space-y-2">
                      <textarea
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={async () => {
                          await handleDescriptionUpdate(editingValue);
                          setEditingField(null);
                          setEditingValue("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setEditingField(null);
                            setEditingValue("");
                          } else if (
                            e.key === "Enter" &&
                            (e.metaKey || e.ctrlKey)
                          ) {
                            e.preventDefault();
                            handleDescriptionUpdate(editingValue);
                            setEditingField(null);
                            setEditingValue("");
                          }
                        }}
                        className="w-full text-sm text-gray-700 px-3 py-2 rounded-lg border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={4}
                        placeholder="Enter description..."
                        autoFocus
                      />
                      <div className="text-xs text-gray-400">
                        Press Ctrl+Enter or click outside to save, Esc to cancel
                      </div>
                    </div>
                  ) : (
                    <p
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingField("description");
                        setEditingValue(safeSubtask.description || "");
                      }}
                      className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors min-h-[60px]"
                    >
                      {safeSubtask.description ||
                        "No description provided. Click to add description."}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tabs Section - Full Height */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 flex-shrink-0 px-6">
              <button
                onClick={() => setActiveTab("subtasks")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "subtasks"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Sub-Tasks
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "comments"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Comment
              </button>
            </div>

            {/* Tab Content - Full Height */}
            <div className="flex-1 min-h-0">
              {activeTab === "subtasks" ? (
                <SubTasksSection
                  task={
                    safeSubtask.task
                      ? typeof safeSubtask.task === "object"
                        ? safeSubtask.task
                        : { id: safeSubtask.task }
                      : task
                  }
                  parentSubtask={safeSubtask}
                  onTaskUpdate={async () => {
                    await loadSubtask();
                    if (onTaskRefresh) {
                      await onTaskRefresh();
                    }
                  }}
                />
              ) : (
                <CommentsSection subtask={safeSubtask} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
