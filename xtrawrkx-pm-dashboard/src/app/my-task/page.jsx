"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle,
  Clock,
  Calendar,
  CheckSquare,
  AlertCircle,
  Check,
  Eye,
  Trash2,
  GitBranch,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import {
  TasksHeader,
  TasksKPIs,
  TasksTabs,
  TasksListView,
  TaskKanban,
  TaskDetailModal,
  TaskDeleteConfirmationModal,
  AddTaskModal,
  CollaboratorModal,
} from "../../components/my-task";
import ProjectSelector from "../../components/my-task/ProjectSelector";
import { Card } from "../../components/ui";
import taskService from "../../lib/taskService";
import subtaskService from "../../lib/subtaskService";
import projectService from "../../lib/projectService";
import commentService from "../../lib/commentService";
import {
  transformTask,
  transformSubtask,
  transformStatusToStrapi,
  transformPriorityToStrapi,
} from "../../lib/dataTransformers";
import { useAuth } from "../../contexts/AuthContext";

// Local utility function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function MyTasks() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // State management
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("my-tasks");
  const [allTasks, setAllTasks] = useState([]); // Store all tasks for "All Tasks" tab
  const [activeView, setActiveView] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [collaboratorModal, setCollaboratorModal] = useState({
    isOpen: false,
    task: null,
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskName, setEditingTaskName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Task detail modal state
  const [taskDetailModal, setTaskDetailModal] = useState({
    isOpen: false,
    task: null,
  });

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    task: null,
  });

  // Add task modal state
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // Subtask expansion state
  const [expandedSubtasks, setExpandedSubtasks] = useState({});
  const [loadedSubtasks, setLoadedSubtasks] = useState({});
  const [subtaskDropdownPositions, setSubtaskDropdownPositions] = useState({});
  const subtaskButtonRefs = useRef({});

  // Bulk selection state
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);

  // Close subtask dropdowns on scroll
  useEffect(() => {
    const handleScroll = () => {
      setExpandedSubtasks({});
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  const exportDropdownRef = useRef(null);

  // Load tasks and projects from API
  useEffect(() => {
    // Don't load if auth is still loading
    if (authLoading) {
      return;
    }

    const loadMyTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user ID - check multiple possible properties
        const currentUserId =
          user?.id || user?._id || user?.xtrawrkxUserId || 1;

        if (!currentUserId || currentUserId === 1) {
          console.warn("No valid user ID found, using default ID 1");
        }

        // Load both user's tasks and all PM tasks in parallel
        const [myTasksResponse, allTasksResponse, projectsResponse] =
          await Promise.all([
            // User's assigned tasks
            taskService
              .getPMTasksByAssignee(currentUserId, {
                pageSize: 100,
                populate: [
                  "projects",
                  "assignee",
                  "assignee.firstName",
                  "assignee.lastName",
                  "assignee.email",
                  "createdBy",
                  "subtasks",
                  "collaborators",
                  "collaborators.firstName",
                  "collaborators.lastName",
                  "collaborators.email",
                ],
              })
              .catch((err) => {
                console.error("Error fetching user PM tasks:", err);
                return { data: [] };
              }),
            // All PM tasks (for "All Tasks" tab)
            taskService
              .getAllTasks({
                pageSize: 100,
                populate: [
                  "projects",
                  "assignee",
                  "assignee.firstName",
                  "assignee.lastName",
                  "assignee.email",
                  "createdBy",
                  "subtasks",
                  "collaborators",
                  "collaborators.firstName",
                  "collaborators.lastName",
                  "collaborators.email",
                ],
                filters: {
                  // Filter out CRM tasks - only PM tasks
                  // This will be filtered client-side
                },
              })
              .catch((err) => {
                console.error("Error fetching all PM tasks:", err);
                return { data: [] };
              }),
            projectService.getAllProjects({ pageSize: 50 }).catch((err) => {
              console.error("Error fetching projects:", err);
              return { data: [] };
            }),
          ]);

        // Transform all tasks
        const allTransformedTasks =
          allTasksResponse.data?.map(transformTask) || [];

        // Filter out CRM tasks from all tasks (PM tasks only)
        const allPMTasks = allTransformedTasks.filter((task) => {
          // PM tasks should NOT have CRM entity relations
          const hasCRMRelation = !!(
            task.leadCompany ||
            task.clientAccount ||
            task.contact ||
            task.deal
          );
          return !hasCRMRelation;
        });

        // Transform user's tasks
        const transformedMyTasks =
          myTasksResponse.data?.map(transformTask) || [];

        // Normalize IDs for comparison (handle both string and number IDs)
        const normalizedCurrentUserId =
          typeof currentUserId === "string"
            ? parseInt(currentUserId)
            : currentUserId;

        // Filter tasks where user is assignee OR collaborator
        // Use allPMTasks to include tasks where user might be collaborator but not assignee
        const userAssignedTasks = allPMTasks.filter((task) => {
          // Check if task is assigned to current user
          const taskAssigneeId =
            task.assignee?.id || task.assignee?._id || task.assignee;
          const normalizedTaskAssigneeId =
            typeof taskAssigneeId === "string"
              ? parseInt(taskAssigneeId)
              : taskAssigneeId;
          const isAssignee = normalizedTaskAssigneeId === normalizedCurrentUserId;

          // Check if user is a collaborator
          const collaborators = task.collaborators || [];
          const isCollaborator = collaborators.some((collab) => {
            const collabId = collab?.id || collab?._id || collab;
            const normalizedCollabId =
              typeof collabId === "string" ? parseInt(collabId) : collabId;
            return normalizedCollabId === normalizedCurrentUserId;
          });

          return isAssignee || isCollaborator;
        });

        const transformedProjects =
          projectsResponse.data?.map((project) => ({
            id: project.id,
            name: project.name,
            slug: project.slug,
          })) || [];

        setTasks(userAssignedTasks);
        setAllTasks(allPMTasks);
        setProjects(transformedProjects);
      } catch (error) {
        console.error("Error loading my tasks:", error);
        // Provide more user-friendly error message
        const errorMessage =
          error?.response?.data?.error?.message ||
          error?.message ||
          "Failed to load tasks. Please try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadMyTasks();
  }, [user, authLoading]);

  // Load subtask counts for all visible tasks (only once per task)
  useEffect(() => {
    const loadSubtaskCounts = async () => {
      const tasksToCheck = activeTab === "my-tasks" ? tasks : allTasks;

      // Load subtask counts for tasks that don't have them loaded yet
      const tasksNeedingCounts = tasksToCheck.filter(
        (task) => task.id && !loadedSubtasks[task.id]
      );

      if (tasksNeedingCounts.length === 0) return;

      // Load subtask counts in parallel (limit to avoid too many requests)
      const tasksToLoad = tasksNeedingCounts.slice(0, 10); // Load first 10 to avoid overwhelming

      try {
        const subtaskCountPromises = tasksToLoad.map(async (task) => {
          try {
            const response = await subtaskService.getRootSubtasksByTask(
              task.id,
              {
                populate: ["assignee"],
              }
            );

            // Handle different response structures
            let subtasksData = [];
            if (Array.isArray(response.data)) {
              subtasksData = response.data;
            } else if (
              response.data?.data &&
              Array.isArray(response.data.data)
            ) {
              subtasksData = response.data.data;
            } else if (Array.isArray(response)) {
              subtasksData = response;
            }

            const transformedSubtasks = subtasksData
              .map(transformSubtask)
              .filter(Boolean);
            return { taskId: task.id, subtasks: transformedSubtasks };
          } catch (error) {
            console.error(`Error loading subtasks for task ${task.id}:`, error);
            return { taskId: task.id, subtasks: [] };
          }
        });

        const results = await Promise.all(subtaskCountPromises);

        // Update loaded subtasks state
        setLoadedSubtasks((prev) => {
          const updated = { ...prev };
          results.forEach(({ taskId, subtasks }) => {
            updated[taskId] = subtasks;
          });
          return updated;
        });
      } catch (error) {
        console.error("Error loading subtask counts:", error);
      }
    };

    // Only load if we have tasks
    if ((tasks.length > 0 || allTasks.length > 0) && !loading) {
      loadSubtaskCounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks.length, allTasks.length, activeTab, loading]); // Only depend on lengths and activeTab to avoid infinite loops

  // Determine which tasks to use based on active tab
  const tasksToUse = activeTab === "my-tasks" ? tasks : allTasks;

  // Calculate task statistics based on current tab
  const getTaskStats = () => {
    const tasksForStats = tasksToUse;
    const stats = {
      all: tasksForStats.length,
      "to-do": 0,
      "in-progress": 0,
      "in-review": 0,
      done: 0,
      overdue: 0,
    };

    const now = new Date();
    tasksForStats.forEach((task) => {
      const status = task.status?.toLowerCase().replace(/\s+/g, "-") || "";
      if (status === "to-do" || status === "todo") stats["to-do"]++;
      else if (status === "in-progress") stats["in-progress"]++;
      else if (status === "in-review") stats["in-review"]++;
      else if (status === "done" || status === "completed") stats.done++;

      // Check for overdue
      if (
        task.scheduledDate &&
        new Date(task.scheduledDate) < now &&
        status !== "done" &&
        status !== "completed"
      ) {
        stats.overdue++;
      }
    });

    return stats;
  };

  const taskStats = getTaskStats();

  // Status statistics for KPIs
  const statusStats = [
    {
      label: "To Do",
      count: taskStats["to-do"],
      color: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      icon: CheckSquare,
    },
    {
      label: "In Progress",
      count: taskStats["in-progress"],
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
      icon: Clock,
    },
    {
      label: "Done",
      count: taskStats.done,
      color: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      icon: CheckCircle,
    },
    {
      label: "Overdue",
      count: taskStats.overdue,
      color: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      icon: AlertCircle,
    },
  ];

  // Tab items for navigation
  const tabItems = [
    { key: "my-tasks", label: "My Tasks", badge: tasks.length.toString() },
    { key: "all", label: "All Tasks", badge: allTasks.length.toString() },
    { key: "to-do", label: "To Do", badge: taskStats["to-do"].toString() },
    {
      key: "in-progress",
      label: "In Progress",
      badge: taskStats["in-progress"].toString(),
    },
    {
      key: "in-review",
      label: "In Review",
      badge: taskStats["in-review"].toString(),
    },
    { key: "done", label: "Done", badge: taskStats.done.toString() },
    { key: "overdue", label: "Overdue", badge: taskStats.overdue.toString() },
  ];

  // Filter tasks based on search and active tab
  const filteredTasks = tasksToUse.filter((task) => {
    if (!task) return false;

    const matchesSearch =
      searchQuery === "" ||
      (task.name &&
        task.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.project?.name &&
        task.project.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.description &&
        task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // Handle tab filtering - "my-tasks" and "all" show all tasks (filtered by search only)
    // Other tabs filter by status
    const taskStatus = task.status?.toLowerCase().replace(/\s+/g, "-") || "";
    const matchesTab =
      activeTab === "my-tasks" ||
      activeTab === "all" ||
      taskStatus === activeTab ||
      (activeTab === "overdue" &&
        task.scheduledDate &&
        new Date(task.scheduledDate) < new Date() &&
        taskStatus !== "done" &&
        taskStatus !== "completed");

    return matchesSearch && matchesTab;
  });

  // Table columns configuration
  const taskColumnsTable = [
    {
      key: "name",
      label: "TASK NAME",
      render: (_, task) => {
        const isDone =
          task.status?.toLowerCase() === "done" ||
          task.status?.toLowerCase() === "completed";
        const isEditing = editingTaskId === task.id;

        const handleNameClick = (e) => {
          e.stopPropagation();
          setEditingTaskId(task.id);
          setEditingTaskName(task.name || "");
        };

        const handleNameChange = (e) => {
          setEditingTaskName(e.target.value);
        };

        const handleNameBlur = async () => {
          if (editingTaskId === task.id) {
            const newName = editingTaskName.trim();
            if (newName && newName !== task.name) {
              try {
                await taskService.updateTask(task.id, { title: newName });
                // Update both task lists
                setTasks((prevTasks) =>
                  prevTasks.map((t) =>
                    t.id === task.id ? { ...t, name: newName } : t
                  )
                );
                setAllTasks((prevTasks) =>
                  prevTasks.map((t) =>
                    t.id === task.id ? { ...t, name: newName } : t
                  )
                );
              } catch (error) {
                console.error("Error updating task name:", error);
              }
            }
            setEditingTaskId(null);
            setEditingTaskName("");
          }
        };

        const handleNameKeyDown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleNameBlur();
          } else if (e.key === "Escape") {
            setEditingTaskId(null);
            setEditingTaskName("");
          }
        };

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
                // Toggle between Done and To Do
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
              {isEditing ? (
                <input
                  type="text"
                  value={editingTaskName}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  onKeyDown={handleNameKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full font-medium px-2 py-1 rounded border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDone ? "line-through text-gray-500" : "text-gray-900"
                  }`}
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div
                    onClick={handleNameClick}
                    className={`font-medium truncate cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors flex-1 min-w-0 ${
                      isDone ? "line-through text-gray-500" : "text-gray-900"
                    }`}
                    title="Click to edit task name"
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
          projects={projects}
          onUpdate={(updatedTask) => {
            // Update both tasks and allTasks states
            setTasks((prevTasks) =>
              prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );
            setAllTasks((prevTasks) =>
              prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );

            // Update taskDetailModal if it's showing this task
            if (taskDetailModal.task?.id === updatedTask.id) {
              setTaskDetailModal((prev) => ({
                ...prev,
                task: updatedTask,
              }));
            }
          }}
        />
      ),
    },
    {
      key: "assignee",
      label: "ASSIGNEE",
      render: (_, task) => {
        // Support both single assignee and multiple collaborators
        const assignee = task.assignee;

        // Check if assignee is a valid user object (not null and has identifying properties)
        const hasAssignee =
          assignee &&
          (assignee.id ||
            assignee._id ||
            assignee.firstName ||
            assignee.lastName ||
            assignee.name ||
            assignee.email);

        // Get collaborators - prefer task.collaborators array, fallback to assignee if no collaborators
        let collaborators = [];
        if (
          task.collaborators &&
          Array.isArray(task.collaborators) &&
          task.collaborators.length > 0
        ) {
          // Filter out null/undefined collaborators
          collaborators = task.collaborators.filter(
            (c) =>
              c &&
              (c.id || c._id || c.firstName || c.lastName || c.name || c.email)
          );
        } else if (hasAssignee) {
          collaborators = [assignee];
        }

        const hasCollaborators = collaborators.length > 0;

        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCollaboratorModal({ isOpen: true, task });
            }}
            className="flex items-center gap-2 min-w-[140px] hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors text-left"
          >
            {hasCollaborators ? (
              <div className="flex items-center gap-1">
                {/* Show up to 3 avatars, then show count */}
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
                  Click to assign
                </span>
              </>
            )}
          </button>
        );
      },
    },
    {
      key: "dueDate",
      label: "DUE DATE",
      render: (_, task) => {
        // Convert scheduledDate to date format (YYYY-MM-DD)
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
      key: "subtasks",
      label: "SUBTASKS",
      render: (_, task) => {
        const taskId = task.id;
        const isExpanded = expandedSubtasks[taskId] || false;

        // Use loaded subtasks from state (most reliable)
        const loadedTaskSubtasks = loadedSubtasks[taskId] || [];

        // Also check task.subtasks as fallback (might be populated from initial load)
        const taskSubtasks = task.subtasks || [];

        // Prefer loaded subtasks, fallback to task subtasks
        const allSubtasks =
          loadedTaskSubtasks.length > 0 ? loadedTaskSubtasks : taskSubtasks;

        // Count only root-level subtasks (those without parentSubtask or with null parentSubtask)
        const rootSubtasks = allSubtasks.filter((st) => {
          // Root subtask: no parentSubtask property, or it's null/undefined, or it's an empty object
          return (
            !st.parentSubtask ||
            st.parentSubtask === null ||
            (typeof st.parentSubtask === "object" && !st.parentSubtask.id)
          );
        });
        const subtaskCount = rootSubtasks.length;

        const handleToggleExpand = async (e) => {
          e.stopPropagation();

          const newExpandedState = !isExpanded;

          // Update position when expanding
          if (newExpandedState && subtaskButtonRefs.current[taskId]) {
            const rect =
              subtaskButtonRefs.current[taskId].getBoundingClientRect();
            setSubtaskDropdownPositions((prev) => ({
              ...prev,
              [taskId]: {
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
                width: rect.width,
              },
            }));
          }

          // Always load subtasks when expanding (to ensure fresh data)
          if (newExpandedState) {
            try {
              const response = await subtaskService.getRootSubtasksByTask(
                taskId,
                {
                  populate: ["assignee", "childSubtasks"],
                }
              );

              // Handle different response structures
              let subtasksData = [];
              if (Array.isArray(response.data)) {
                subtasksData = response.data;
              } else if (
                response.data?.data &&
                Array.isArray(response.data.data)
              ) {
                subtasksData = response.data.data;
              } else if (Array.isArray(response)) {
                subtasksData = response;
              }

              const transformedSubtasks = subtasksData
                .map(transformSubtask)
                .filter(Boolean);

              console.log(
                `Loaded ${transformedSubtasks.length} subtasks for task ${taskId}`,
                transformedSubtasks
              );

              setLoadedSubtasks((prev) => ({
                ...prev,
                [taskId]: transformedSubtasks,
              }));
            } catch (error) {
              console.error("Error loading subtasks:", error);
              // If error, still allow expansion with existing data
            }
          }

          setExpandedSubtasks((prev) => ({
            ...prev,
            [taskId]: newExpandedState,
          }));
        };

        const handleSubtaskClick = (e, subtask) => {
          e.stopPropagation();
          // Navigate to task detail page - the detail page will handle opening subtask modal
          router.push(`/my-task/${task.slug || task.id}`);
        };

        // Show button if we have subtasks OR if we haven't checked yet (to allow loading)
        const hasSubtasks = subtaskCount > 0;
        const shouldShowButton =
          hasSubtasks ||
          (!loadedTaskSubtasks.length && taskSubtasks.length === 0);

        const dropdownPosition = subtaskDropdownPositions[taskId];
        const dropdownContent =
          isExpanded && rootSubtasks.length > 0 && dropdownPosition ? (
            <div
              className="fixed z-[9999] border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2 space-y-1">
                {rootSubtasks.map((subtask) => {
                  const isSubtaskDone =
                    subtask.status?.toLowerCase() === "done" ||
                    subtask.status?.toLowerCase() === "completed";
                  const childCount =
                    subtask.childSubtasks?.length ||
                    subtask.subtasks?.length ||
                    0;
                  return (
                    <button
                      key={subtask.id}
                      onClick={(e) => handleSubtaskClick(e, subtask)}
                      className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 ${
                        isSubtaskDone ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-sm font-medium truncate ${
                              isSubtaskDone
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {subtask.name || subtask.title}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {subtask.assignee && (
                              <div className="text-xs text-gray-500 truncate">
                                {typeof subtask.assignee === "object"
                                  ? subtask.assignee?.name || "Unassigned"
                                  : subtask.assignee || "Unassigned"}
                              </div>
                            )}
                            {childCount > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <GitBranch className="w-3 h-3" />
                                <span>{childCount}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null;

        return (
          <>
            <div className="min-w-[180px]" onClick={(e) => e.stopPropagation()}>
              {hasSubtasks ? (
                <div className="relative">
                  <button
                    ref={(el) => {
                      if (el) subtaskButtonRefs.current[taskId] = el;
                    }}
                    onClick={handleToggleExpand}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 w-full"
                  >
                    <GitBranch className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">
                      {subtaskCount}{" "}
                      {subtaskCount === 1 ? "subtask" : "subtasks"}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500 ml-auto" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleToggleExpand}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 w-full text-gray-400"
                >
                  <GitBranch className="w-4 h-4" />
                  <span className="text-sm">No subtasks</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                </button>
              )}
            </div>
            {typeof window !== "undefined" &&
              isExpanded &&
              rootSubtasks.length > 0 &&
              dropdownPosition &&
              createPortal(dropdownContent, document.body)}
          </>
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, task: task });
            }}
            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Handle due date updates
  const handleDueDateUpdate = async (taskId, newDate) => {
    if (!taskId) return;

    try {
      // Convert date to ISO string (date only, no time) if provided, or null if empty
      const scheduledDate = newDate
        ? new Date(newDate + "T00:00:00").toISOString()
        : null;

      await taskService.updateTask(taskId, { scheduledDate });

      // Format due date for display
      const formattedDueDate = scheduledDate
        ? formatDate(scheduledDate)
        : "No due date";

      // Update both task lists in real-time
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, scheduledDate: scheduledDate } : task
        )
      );

      setAllTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, scheduledDate: scheduledDate } : task
        )
      );

      // Update task in modal if it's currently open and showing this task
      if (taskDetailModal.isOpen && taskDetailModal.task?.id === taskId) {
        setTaskDetailModal((prev) => ({
          ...prev,
          task: {
            ...prev.task,
            scheduledDate: scheduledDate,
            dueDate: formattedDueDate,
          },
        }));
      }
    } catch (error) {
      console.error("Error updating due date:", error);
    }
  };

  // Handle status updates
  const handleStatusUpdate = async (taskId, newStatus) => {
    if (!taskId) return;

    // Transform frontend status to Strapi format
    const strapiStatus = transformStatusToStrapi(newStatus);

    // Check if marking as done/completed - check in both task lists
    const isCompleting = strapiStatus === "COMPLETED";
    const task =
      tasks.find((t) => t.id === taskId) ||
      allTasks.find((t) => t.id === taskId);
    const wasAlreadyDone =
      task?.status?.toLowerCase() === "done" ||
      task?.status?.toLowerCase() === "completed";

    // Update both task lists immediately (optimistic update)
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    setAllTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Update taskDetailModal immediately if it's currently open and showing this task
    if (taskDetailModal.isOpen && taskDetailModal.task?.id === taskId) {
      setTaskDetailModal((prev) => ({
        ...prev,
        task: {
          ...prev.task,
          status: newStatus,
        },
      }));
    }

    try {
      await taskService.updateTaskStatus(taskId, strapiStatus);

      // Trigger confetti animation only when completing a task (not when uncompleting)
      const isUncompleting = !isCompleting && wasAlreadyDone;
      if (isCompleting && !wasAlreadyDone && !isUncompleting) {
        // Trigger confetti animation from both sides
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
          });

          // Confetti from right
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          });
        }, 250);
      }

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Handle priority updates
  const handlePriorityUpdate = async (taskId, newPriority) => {
    if (!taskId) return;

    // Transform frontend priority to Strapi format
    const strapiPriority = transformPriorityToStrapi(newPriority);

    // Update both task lists immediately (optimistic update - like status)
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task
      )
    );

    setAllTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task
      )
    );

    // Update taskDetailModal immediately if it's currently open and showing this task (like status)
    if (taskDetailModal.isOpen && taskDetailModal.task?.id === taskId) {
      setTaskDetailModal((prev) => ({
        ...prev,
        task: {
          ...prev.task,
          priority: newPriority,
        },
      }));
    }

    try {
      await taskService.updateTask(taskId, { priority: strapiPriority });
    } catch (error) {
      console.error("Error updating task priority:", error);
    }
  };

  // Handle task click - fetch full task details
  const handleTaskClick = async (task) => {
    if (!task?.id) return;

    try {
      // Fetch full task details with all relations
      const fullTaskData = await taskService.getTaskById(task.id, [
        "project",
        "assignee",
        "createdBy",
        "subtasks",
        "subtasks.assignee",
        "subtasks.childSubtasks",
        "collaborators",
      ]);

      // Transform the task data
      const transformedTask = transformTask(fullTaskData);

      // Format due date for display
      const formattedDueDate = transformedTask.scheduledDate
        ? formatDate(transformedTask.scheduledDate)
        : "No due date";

      // Fetch comments for this task
      let comments = [];
      try {
        const commentsResponse = await commentService.getTaskComments(task.id);
        // Transform comments to frontend format
        comments = commentsResponse.data?.map(transformComment) || [];
      } catch (commentError) {
        console.error("Error fetching comments:", commentError);
      }

      // Prepare task for modal with all necessary data
      const taskForModal = {
        ...transformedTask,
        dueDate: formattedDueDate,
        description: transformedTask.description || task.description || "",
        // Ensure subtasks are included
        subtasks: transformedTask.subtasks || fullTaskData.subtasks || [],
        // Include fetched comments
        comments: comments,
      };

      setTaskDetailModal({
        isOpen: true,
        task: taskForModal,
      });
    } catch (error) {
      console.error("Error fetching task details:", error);
      // Fallback to using the task from the table if fetch fails
      setTaskDetailModal({
        isOpen: true,
        task: task,
      });
    }
  };

  const handleTaskDetailClose = () => {
    setTaskDetailModal({
      isOpen: false,
      task: null,
    });
  };

  const handleOpenProject = (project) => {
    if (project?.slug) {
      router.push(`/projects/${project.slug}`);
    } else if (project?.name) {
      router.push(
        `/projects/${project.name.toLowerCase().replace(/\s+/g, "-")}`
      );
    }
  };

  const handleOpenFullPage = (task) => {
    if (task?.id) {
      router.push(`/my-task/${task.id}`);
    }
  };

  // Bulk selection handlers
  const handleSelectTask = (taskId, isSelected) => {
    if (isSelected) {
      setSelectedTaskIds((prev) => [...prev, taskId]);
    } else {
      setSelectedTaskIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedTaskIds(filteredTasks.map((task) => task.id));
    } else {
      setSelectedTaskIds([]);
    }
  };

  // Toggle bulk edit mode
  const handleToggleBulkEdit = () => {
    setIsBulkEditMode((prev) => !prev);
    // Clear selection when turning off bulk edit mode
    if (isBulkEditMode) {
      setSelectedTaskIds([]);
    }
  };

  // Bulk action handlers
  const handleBulkDelete = () => {
    if (selectedTaskIds.length === 0) return;

    // Find the first selected task for the delete modal
    const firstSelectedTask = filteredTasks.find(
      (task) => task.id === selectedTaskIds[0]
    );

    if (firstSelectedTask) {
      setDeleteModal({
        isOpen: true,
        task: {
          ...firstSelectedTask,
          bulkDelete: true,
          taskIds: selectedTaskIds,
        },
      });
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedTaskIds.length === 0) return;

    try {
      const strapiStatus = transformStatusToStrapi(newStatus);

      // Update all selected tasks
      await Promise.all(
        selectedTaskIds.map((taskId) =>
          taskService.updateTaskStatus(taskId, strapiStatus)
        )
      );

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          selectedTaskIds.includes(task.id)
            ? { ...task, status: newStatus }
            : task
        )
      );
      setAllTasks((prevTasks) =>
        prevTasks.map((task) =>
          selectedTaskIds.includes(task.id)
            ? { ...task, status: newStatus }
            : task
        )
      );

      // Clear selection
      setSelectedTaskIds([]);

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error updating task statuses:", error);
      setError("Failed to update task statuses");
    }
  };

  // Handle task creation
  const handleTaskCreated = async () => {
    // Reload tasks to include the newly created task
    try {
      setLoading(true);
      const currentUserId = user?.id || user?._id || user?.xtrawrkxUserId || 1;

      // Small delay to ensure backend has processed the creation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Reload both user tasks and all tasks
      const [myTasksResponse, allTasksResponse] = await Promise.all([
        taskService.getPMTasksByAssignee(currentUserId, {
          pageSize: 100,
          populate: [
            "projects",
            "assignee",
            "assignee.firstName",
            "assignee.lastName",
            "assignee.email",
            "createdBy",
            "subtasks",
            "collaborators",
            "collaborators.firstName",
            "collaborators.lastName",
            "collaborators.email",
          ],
        }),
        taskService.getAllTasks({
          pageSize: 100,
          populate: [
            "projects",
            "assignee",
            "assignee.firstName",
            "assignee.lastName",
            "assignee.email",
            "createdBy",
            "subtasks",
            "collaborators",
            "collaborators.firstName",
            "collaborators.lastName",
            "collaborators.email",
          ],
        }),
      ]);

      // Transform all tasks
      const allTransformedTasks =
        allTasksResponse.data?.map(transformTask) || [];
      const allPMTasks = allTransformedTasks.filter((task) => {
        const hasCRMRelation = !!(
          task.leadCompany ||
          task.clientAccount ||
          task.contact ||
          task.deal
        );
        return !hasCRMRelation;
      });

      // Transform user's tasks
      const transformedMyTasks = myTasksResponse.data?.map(transformTask) || [];

      // Normalize IDs for comparison (handle both string and number IDs)
      const normalizedCurrentUserId =
        typeof currentUserId === "string"
          ? parseInt(currentUserId)
          : currentUserId;

      // Filter tasks where user is assignee OR collaborator
      // Use allPMTasks to include tasks where user might be collaborator but not assignee
      const userAssignedTasks = allPMTasks.filter((task) => {
        // Check if task is assigned to current user
        const taskAssigneeId =
          task.assignee?.id || task.assignee?._id || task.assignee;
        const normalizedTaskAssigneeId =
          typeof taskAssigneeId === "string"
            ? parseInt(taskAssigneeId)
            : taskAssigneeId;
        const isAssignee = normalizedTaskAssigneeId === normalizedCurrentUserId;

        // Check if user is a collaborator
        const collaborators = task.collaborators || [];
        const isCollaborator = collaborators.some((collab) => {
          const collabId = collab?.id || collab?._id || collab;
          const normalizedCollabId =
            typeof collabId === "string" ? parseInt(collabId) : collabId;
          return normalizedCollabId === normalizedCurrentUserId;
        });

        return isAssignee || isCollaborator;
      });

      setTasks(userAssignedTasks);
      setAllTasks(allPMTasks);
      setLoading(false);

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error refreshing tasks after creation:", error);
      setLoading(false);
      setError("Failed to refresh tasks. Please reload the page.");
    }
  };

  // Handle export
  const handleExport = (format) => {
    console.log(`Exporting tasks as ${format}`);
    setShowExportDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        exportDropdownRef.current &&
        !exportDropdownRef.current.contains(event.target)
      ) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Loading state (including auth loading)
  if (loading || authLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="p-4 space-y-4">
          <TasksHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setIsFilterModalOpen={setIsFilterModalOpen}
            setIsImportModalOpen={setIsImportModalOpen}
            showExportDropdown={showExportDropdown}
            setShowExportDropdown={setShowExportDropdown}
            exportDropdownRef={exportDropdownRef}
            handleExport={handleExport}
            setIsModalOpen={() => setIsAddTaskModalOpen(true)}
          />
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {authLoading
                  ? "Loading user information..."
                  : "Loading your tasks..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - but still show the page structure
  if (error && tasks.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="p-4 space-y-4">
          <TasksHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setIsFilterModalOpen={setIsFilterModalOpen}
            setIsImportModalOpen={setIsImportModalOpen}
            showExportDropdown={showExportDropdown}
            setShowExportDropdown={setShowExportDropdown}
            exportDropdownRef={exportDropdownRef}
            handleExport={handleExport}
            setIsModalOpen={() => setIsAddTaskModalOpen(true)}
          />
          <div className="space-y-4">
            {/* Stats Overview - show empty stats */}
            <TasksKPIs statusStats={statusStats} />

            {/* Error message */}
            <Card glass={true} className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Error Loading Tasks
                </h2>
                <p className="text-gray-600 mb-4">
                  {error === "Resource not found."
                    ? "No tasks found for your account. You may not have any tasks assigned yet, or there might be an issue with the API connection."
                    : error}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                      window.location.reload();
                    }}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => setIsAddTaskModalOpen(true)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Create Your First Task
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Success Messages - Outside main flow to prevent layout shifts */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-[9999] pointer-events-none">
          Task created successfully!
        </div>
      )}

      <div className="space-y-4">
        <div className="p-4 space-y-4 bg-white min-h-screen">
          {/* Page Header */}
          <TasksHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setIsFilterModalOpen={setIsFilterModalOpen}
            setIsImportModalOpen={setIsImportModalOpen}
            showExportDropdown={showExportDropdown}
            setShowExportDropdown={setShowExportDropdown}
            exportDropdownRef={exportDropdownRef}
            handleExport={handleExport}
            setIsModalOpen={() => setIsAddTaskModalOpen(true)}
          />

          <div className="space-y-4">
            {/* Stats Overview */}
            <TasksKPIs statusStats={statusStats} />

            {/* View Toggle */}
            <TasksTabs
              tabItems={tabItems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeView={activeView}
              setActiveView={setActiveView}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddClick={() => setIsAddTaskModalOpen(true)}
              onExportClick={handleExport}
              isBulkEditMode={isBulkEditMode}
              onToggleBulkEdit={handleToggleBulkEdit}
            />

            {/* Single Horizontal Scroll Container */}
            <div className="-mx-4 px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Tasks Table/Board */}
              {activeView === "list" && (
                <TasksListView
                  filteredTasks={filteredTasks}
                  taskColumnsTable={taskColumnsTable}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  setIsModalOpen={() => setIsAddTaskModalOpen(true)}
                  onRowClick={handleTaskClick}
                  selectable={isBulkEditMode}
                  selectedTaskIds={selectedTaskIds}
                  onSelectTask={handleSelectTask}
                  onSelectAll={handleSelectAll}
                  bulkActions={
                    isBulkEditMode && selectedTaskIds.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleBulkStatusUpdate(e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue=""
                        >
                          <option value="">Change Status...</option>
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="In Review">In Review</option>
                          <option value="Done">Done</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={handleBulkDelete}
                          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                        <button
                          onClick={() => setSelectedTaskIds([])}
                          className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    ) : null
                  }
                />
              )}
              {activeView === "board" && (
                <Card glass={true}>
                  <TaskKanban
                    tasks={filteredTasks}
                    project={null}
                    onTaskClick={handleTaskClick}
                    onContextMenuOpen={() => {}}
                    onTaskStatusChange={(task, newStatus) => {
                      handleStatusUpdate(task.id, newStatus);
                    }}
                  />
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Task Detail Modal */}
        <TaskDetailModal
          isOpen={taskDetailModal.isOpen}
          onClose={handleTaskDetailClose}
          task={taskDetailModal.task}
          onOpenProject={handleOpenProject}
          onOpenFullPage={handleOpenFullPage}
          onTaskRefresh={async () => {
            // Refresh task data in modal AND update the task list in real-time
            if (taskDetailModal.task?.id) {
              const taskId = taskDetailModal.task.id;
              try {
                // Get the updated task first to update the table immediately
                const fullTaskData = await taskService.getTaskById(taskId, [
                  "project",
                  "assignee",
                  "createdBy",
                  "subtasks",
                  "subtasks.assignee",
                  "subtasks.childSubtasks",
                  "collaborators",
                ]);

                const transformedTask = transformTask(fullTaskData);

                // Update task lists immediately with the updated task (real-time update)
                setTasks((prevTasks) =>
                  prevTasks.map((task) =>
                    task.id === taskId ? transformedTask : task
                  )
                );

                setAllTasks((prevTasks) =>
                  prevTasks.map((task) =>
                    task.id === taskId ? transformedTask : task
                  )
                );

                // Refresh subtask count for this task
                try {
                  const response = await subtaskService.getRootSubtasksByTask(
                    taskId,
                    {
                      populate: ["assignee"],
                    }
                  );

                  let subtasksData = [];
                  if (Array.isArray(response.data)) {
                    subtasksData = response.data;
                  } else if (
                    response.data?.data &&
                    Array.isArray(response.data.data)
                  ) {
                    subtasksData = response.data.data;
                  } else if (Array.isArray(response)) {
                    subtasksData = response;
                  }

                  const transformedSubtasks = subtasksData
                    .map(transformSubtask)
                    .filter(Boolean);

                  // Update loaded subtasks state to refresh the count
                  setLoadedSubtasks((prev) => ({
                    ...prev,
                    [taskId]: transformedSubtasks,
                  }));
                } catch (subtaskError) {
                  console.error(
                    `Error refreshing subtasks for task ${taskId}:`,
                    subtaskError
                  );
                }

                // Update modal task
                const formattedDueDate = transformedTask.scheduledDate
                  ? formatDate(transformedTask.scheduledDate)
                  : "No due date";

                let comments = [];
                try {
                  const commentsResponse = await commentService.getTaskComments(
                    taskId
                  );
                  comments = commentsResponse.data?.map(transformComment) || [];
                } catch (commentError) {
                  console.error("Error fetching comments:", commentError);
                }

                const taskForModal = {
                  ...transformedTask,
                  dueDate: formattedDueDate,
                  description: transformedTask.description || "",
                  subtasks:
                    transformedTask.subtasks || fullTaskData.subtasks || [],
                  comments: comments,
                };

                setTaskDetailModal((prev) => ({
                  ...prev,
                  task: taskForModal,
                }));
              } catch (error) {
                console.error("Error refreshing task:", error);
              }
            }
          }}
        />

        {/* Collaborator Modal */}
        <CollaboratorModal
          isOpen={collaboratorModal.isOpen}
          onClose={() => setCollaboratorModal({ isOpen: false, task: null })}
          task={collaboratorModal.task}
          onUpdate={async (updatedTask) => {
            // Update both tasks and allTasks states
            setTasks((prevTasks) =>
              prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );
            setAllTasks((prevTasks) =>
              prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );

            // Also update taskDetailModal if it's showing the same task
            if (taskDetailModal.task?.id === updatedTask.id) {
              setTaskDetailModal((prev) => ({
                ...prev,
                task: updatedTask,
              }));
            }
          }}
        />

        {/* Delete Confirmation Modal */}
        <TaskDeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, task: null })}
          onConfirm={async () => {
            if (deleteModal.task) {
              try {
                // Handle bulk delete
                if (deleteModal.task.bulkDelete && deleteModal.task.taskIds) {
                  const taskIds = deleteModal.task.taskIds;
                  await Promise.all(
                    taskIds.map((taskId) => taskService.deleteTask(taskId))
                  );
                  setTasks((prevTasks) =>
                    prevTasks.filter((task) => !taskIds.includes(task.id))
                  );
                  setAllTasks((prevTasks) =>
                    prevTasks.filter((task) => !taskIds.includes(task.id))
                  );
                  setSelectedTaskIds([]);
                } else if (deleteModal.task.id) {
                  // Single task delete
                  await taskService.deleteTask(deleteModal.task.id);
                  setTasks((prevTasks) =>
                    prevTasks.filter((task) => task.id !== deleteModal.task.id)
                  );
                  setAllTasks((prevTasks) =>
                    prevTasks.filter((task) => task.id !== deleteModal.task.id)
                  );
                }
                setDeleteModal({ isOpen: false, task: null });
              } catch (error) {
                console.error("Error deleting task:", error);
              }
            }
          }}
          taskName={
            deleteModal.task?.bulkDelete
              ? `${deleteModal.task.taskIds?.length || 0} tasks`
              : deleteModal.task?.name || ""
          }
        />

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={() => setIsAddTaskModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      </div>
    </>
  );
}
