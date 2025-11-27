"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Table } from "../ui";
import { Check, Calendar, Eye, GitBranch } from "lucide-react";
import ProjectSelector from "../my-task/ProjectSelector";
import taskService from "../../lib/taskService";
import projectService from "../../lib/projectService";
import {
  transformStatusToStrapi,
  transformPriorityToStrapi,
} from "../../lib/dataTransformers";
import { useAuth } from "../../contexts/AuthContext";

const AssignedTasksTable = ({
  data,
  onTaskComplete = () => {},
  projects = [],
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [expandedSubtasks, setExpandedSubtasks] = useState({});
  const [loadedSubtasks, setLoadedSubtasks] = useState({});
  const [allProjects, setAllProjects] = useState(projects);

  // Load projects if not provided
  React.useEffect(() => {
    if (projects.length === 0) {
      projectService.getAllProjects({ pageSize: 50 }).then((response) => {
        setAllProjects(
          response.data?.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
          })) || []
        );
      });
    }
  }, [projects]);

  // Handle status updates
  const handleStatusUpdate = async (taskId, newStatus) => {
    const strapiStatus = transformStatusToStrapi(newStatus);
    try {
      await taskService.updateTaskStatus(taskId, strapiStatus);
      onTaskComplete(taskId, newStatus);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Handle priority updates
  const handlePriorityUpdate = async (taskId, newPriority) => {
    const strapiPriority = transformPriorityToStrapi(newPriority);
    try {
      await taskService.updateTask(taskId, { priority: strapiPriority });
    } catch (error) {
      console.error("Error updating task priority:", error);
    }
  };

  // Handle due date updates
  const handleDueDateUpdate = async (taskId, newDate) => {
    const scheduledDate = newDate
      ? new Date(newDate + "T00:00:00").toISOString()
      : null;
    try {
      await taskService.updateTask(taskId, { scheduledDate });
    } catch (error) {
      console.error("Error updating due date:", error);
    }
  };

  // Handle task click - navigate to task detail page
  const handleTaskClick = (task) => {
    if (task?.id) {
      router.push(`/my-task/${task.slug || task.id}`);
    }
  };

  const columns = [
    {
      key: "name",
      label: "TASK NAME",
      render: (_, task) => {
        const isDone =
          task.status?.toLowerCase() === "done" ||
          task.status?.toLowerCase() === "completed";

        // Check if task has subtasks
        const taskSubtasks = task.subtasks || [];
        const loadedTaskSubtasks = loadedSubtasks[task.id] || [];
        const allSubtasks =
          loadedTaskSubtasks.length > 0 ? loadedTaskSubtasks : taskSubtasks;
        const rootSubtasks = allSubtasks.filter((st) => {
          return (
            !st.parentSubtask ||
            st.parentSubtask === null ||
            (typeof st.parentSubtask === "object" && !st.parentSubtask.id)
          );
        });
        const hasSubtasks = rootSubtasks.length > 0;

        return (
          <div className="flex items-center gap-3 min-w-[200px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isDone) {
                  handleStatusUpdate(task.id, "To Do");
                } else {
                  handleStatusUpdate(task.id, "Done");
                }
              }}
              className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                isDone
                  ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                  : "border-gray-300 hover:border-green-500 hover:bg-green-50 cursor-pointer"
              }`}
              title={
                isDone ? "Click to mark as incomplete" : "Mark as complete"
              }
            >
              {isDone && <Check className="w-4 h-4 stroke-[3]" />}
            </button>
            <div className="min-w-0 flex-1 flex items-center gap-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskClick(task);
                }}
                className={`font-medium truncate cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors flex-1 min-w-0 ${
                  isDone ? "line-through text-gray-500" : "text-gray-900"
                }`}
                title="Click to view task"
              >
                {task.name}
              </div>
              {hasSubtasks && (
                <div
                  className="flex items-center gap-1 flex-shrink-0 px-1.5 py-0.5 rounded bg-gray-100 text-gray-600"
                  title={`${rootSubtasks.length} ${
                    rootSubtasks.length === 1 ? "subtask" : "subtasks"
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">
                    {rootSubtasks.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "project",
      label: "PROJECT",
      render: (_, task) => (
        <ProjectSelector
          task={task}
          projects={allProjects}
          onUpdate={() => {}}
        />
      ),
    },
    {
      key: "assignee",
      label: "ASSIGNEE",
      render: (_, task) => {
        const collaborators =
          task.collaborators || (task.assignee ? [task.assignee] : []);
        const hasCollaborators = collaborators.length > 0;

        return (
          <div className="flex items-center gap-2 min-w-[140px]">
            {hasCollaborators ? (
              <div className="flex items-center gap-1">
                {collaborators.slice(0, 3).map((person, index) => {
                  const name =
                    person?.name ||
                    (person?.firstName && person?.lastName
                      ? `${person.firstName} ${person.lastName}`
                      : person?.firstName || person?.lastName || "Unknown");
                  const initial = name?.charAt(0)?.toUpperCase() || "U";
                  return (
                    <div
                      key={person?.id || index}
                      className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0 border border-white"
                      title={name}
                      style={{
                        marginLeft: index > 0 ? "-4px" : "0",
                        zIndex: 10 - index,
                      }}
                    >
                      {initial}
                    </div>
                  );
                })}
                {collaborators.length > 3 && (
                  <div
                    className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 flex-shrink-0 border border-white"
                    title={`${collaborators.length - 3} more`}
                    style={{ marginLeft: "-4px", zIndex: 7 }}
                  >
                    +{collaborators.length - 3}
                  </div>
                )}
                <span className="text-sm text-gray-600 truncate ml-1">
                  {collaborators.length === 1
                    ? collaborators[0]?.name ||
                      (collaborators[0]?.firstName && collaborators[0]?.lastName
                        ? `${collaborators[0].firstName} ${collaborators[0].lastName}`
                        : collaborators[0]?.firstName ||
                          collaborators[0]?.lastName ||
                          "Unassigned")
                    : `${collaborators.length} people`}
                </span>
              </div>
            ) : (
              <>
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                  U
                </div>
                <span className="text-sm text-gray-600 truncate">
                  Unassigned
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      key: "dueDate",
      label: "DUE DATE",
      render: (_, task) => {
        const getDateValue = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const currentValue = getDateValue(task.scheduledDate);

        return (
          <div
            className="flex items-center gap-2 min-w-[150px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar className="w-4 h-4 flex-shrink-0 text-gray-500" />
            <input
              type="date"
              value={currentValue}
              onChange={(e) => {
                handleDueDateUpdate(task.id, e.target.value);
              }}
              className="flex-1 text-sm text-gray-700 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="No due date"
            />
          </div>
        );
      },
    },
    {
      key: "status",
      label: "STATUS",
      render: (_, task) => {
        const statusOptions = [
          { value: "To Do", label: "To Do" },
          { value: "In Progress", label: "In Progress" },
          { value: "In Review", label: "In Review" },
          { value: "Done", label: "Done" },
          { value: "Cancelled", label: "Cancelled" },
        ];

        const currentStatus = task.status || "To Do";
        const status = currentStatus?.toLowerCase().replace(/\s+/g, "-") || "";

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

        const colors = statusColors[status] || {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-400",
        };

        return (
          <div className="min-w-[140px]" onClick={(e) => e.stopPropagation()}>
            <select
              value={currentStatus}
              onChange={(e) => {
                e.stopPropagation();
                handleStatusUpdate(task.id, e.target.value);
              }}
              className={`w-full ${colors.bg} ${colors.text} ${colors.border} border-2 rounded-lg px-3 py-2 font-bold text-xs text-center shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                paddingRight: "2rem",
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      },
    },
    {
      key: "priority",
      label: "PRIORITY",
      render: (_, task) => {
        const priorityOptions = [
          { value: "Low", label: "Low" },
          { value: "Medium", label: "Medium" },
          { value: "High", label: "High" },
        ];

        const currentPriority = task.priority || "Medium";
        const priorityLower = currentPriority.toLowerCase();

        const priorityColors = {
          high: {
            bg: "bg-red-100",
            text: "text-red-800",
            border: "border-red-400",
          },
          medium: {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            border: "border-yellow-400",
          },
          low: {
            bg: "bg-green-100",
            text: "text-green-800",
            border: "border-green-400",
          },
        };

        const colors = priorityColors[priorityLower] || {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-400",
        };

        return (
          <div className="min-w-[120px]" onClick={(e) => e.stopPropagation()}>
            <select
              value={currentPriority}
              onChange={(e) => {
                e.stopPropagation();
                handlePriorityUpdate(task.id, e.target.value);
              }}
              className={`w-full ${colors.bg} ${colors.text} ${colors.border} border-2 rounded-lg px-3 py-2 font-bold text-xs text-center shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                paddingRight: "2rem",
              }}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      },
    },
    {
      key: "progress",
      label: "PROGRESS",
      render: (_, task) => (
        <div className="min-w-[120px]">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${task.progress || 0}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900">
              {task.progress || 0}%
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (_, task) => (
        <div className="flex items-center gap-1 min-w-[120px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTaskClick(task);
            }}
            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
            title="View Task"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl flex flex-col h-full">
      <div className="px-6 py-5 border-b border-white/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">My Tasks</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tasks where you are a collaborator
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-x-auto">
        {data.length === 0 ? (
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
              You don&apos;t have any tasks
            </p>
            <p className="text-gray-500 text-sm text-center max-w-xs">
              Tasks where you are a collaborator will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl overflow-hidden">
            <Table
              columns={columns}
              data={data}
              onRowClick={handleTaskClick}
              className="min-w-[1800px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedTasksTable;
