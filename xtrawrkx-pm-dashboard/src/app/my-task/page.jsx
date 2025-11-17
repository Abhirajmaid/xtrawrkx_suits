"use client";

import { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  Clock,
  Calendar,
  MoreVertical,
  CheckSquare,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  TasksHeader,
  TasksKPIs,
  TasksTabs,
  TasksListView,
  TaskKanban,
  TaskDetailModal,
  TaskDeleteConfirmationModal,
} from "../../components/my-task";
import { Card } from "../../components/ui";
import taskService from "../../lib/taskService";
import projectService from "../../lib/projectService";
import { transformTask } from "../../lib/dataTransformers";
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
  const [activeTab, setActiveTab] = useState("all");
  const [activeView, setActiveView] = useState("list");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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

        // Load user's tasks and projects in parallel
        const [tasksResponse, projectsResponse] = await Promise.all([
          taskService
            .getTasksByAssignee(currentUserId, {
              pageSize: 100,
              populate: ["project", "assignee", "createdBy", "subtasks"],
            })
            .catch((err) => {
              console.error("Error fetching tasks:", err);
              // Return empty response if tasks fail
              return { data: [] };
            }),
          projectService.getAllProjects({ pageSize: 50 }).catch((err) => {
            console.error("Error fetching projects:", err);
            // Return empty response if projects fail
            return { data: [] };
          }),
        ]);

        // Transform data
        const transformedTasks = tasksResponse.data?.map(transformTask) || [];
        const transformedProjects =
          projectsResponse.data?.map((project) => ({
            id: project.id,
            name: project.name,
            slug: project.slug,
          })) || [];

        setTasks(transformedTasks);
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

  // Calculate task statistics
  const getTaskStats = () => {
    const stats = {
      all: tasks.length,
      "to-do": 0,
      "in-progress": 0,
      "in-review": 0,
      done: 0,
      overdue: 0,
    };

    const now = new Date();
    tasks.forEach((task) => {
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
    { key: "all", label: "All Tasks", badge: taskStats.all.toString() },
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
  const filteredTasks = tasks.filter((task) => {
    if (!task) return false;

    const matchesSearch =
      searchQuery === "" ||
      (task.name &&
        task.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.project?.name &&
        task.project.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.description &&
        task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const taskStatus = task.status?.toLowerCase().replace(/\s+/g, "-") || "";
    const matchesTab =
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
      render: (_, task) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {task.name?.charAt(0)?.toUpperCase() || "T"}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {task.name}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {task.project?.name || "No Project"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "project",
      label: "PROJECT",
      render: (_, task) => (
        <div className="min-w-[150px]">
          <span className="text-sm text-gray-600">
            {task.project?.name || "No Project"}
          </span>
        </div>
      ),
    },
    {
      key: "assignee",
      label: "ASSIGNEE",
      render: (_, task) => (
        <div className="flex items-center gap-2 min-w-[140px]">
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
            {task.assignee?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <span className="text-sm text-gray-600 truncate">
            {task.assignee?.name || "Unassigned"}
          </span>
        </div>
      ),
    },
    {
      key: "dueDate",
      label: "DUE DATE",
      render: (_, task) => (
        <div className="flex items-center gap-2 text-sm text-gray-500 min-w-[120px]">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span className="whitespace-nowrap">
            {task.scheduledDate
              ? formatDate(task.scheduledDate)
              : "No due date"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (_, task) => {
        const status = task.status?.toLowerCase().replace(/\s+/g, "-") || "";
        const statusColors = {
          "to-do": {
            bg: "bg-blue-100",
            text: "text-blue-800",
            border: "border-blue-400",
            shadow: "shadow-blue-200",
          },
          "in-progress": {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            border: "border-yellow-400",
            shadow: "shadow-yellow-200",
          },
          "in-review": {
            bg: "bg-purple-100",
            text: "text-purple-800",
            border: "border-purple-400",
            shadow: "shadow-purple-200",
          },
          done: {
            bg: "bg-green-100",
            text: "text-green-800",
            border: "border-green-400",
            shadow: "shadow-green-200",
          },
          completed: {
            bg: "bg-green-100",
            text: "text-green-800",
            border: "border-green-400",
            shadow: "shadow-green-200",
          },
          overdue: {
            bg: "bg-red-100",
            text: "text-red-800",
            border: "border-red-400",
            shadow: "shadow-red-200",
          },
        };

        const colors = statusColors[status] || {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-400",
          shadow: "shadow-gray-200",
        };
        const displayStatus = task.status || "Unknown";

        return (
          <div className="min-w-[120px]">
            <div
              className={`${colors.bg} ${colors.text} ${colors.border} border-2 rounded-lg px-3 py-2 font-bold text-xs text-center shadow-md ${colors.shadow} transition-all duration-200 hover:scale-105 hover:shadow-lg inline-block`}
            >
              {displayStatus.toUpperCase()}
            </div>
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
              handleStatusUpdate(task.id, "done");
            }}
            className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
            title="Mark as Done"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTaskClick(task);
            }}
            className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
            title="View Details"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Handle status updates
  const handleStatusUpdate = async (taskId, newStatus) => {
    if (!taskId) return;

    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Handle task click
  const handleTaskClick = (task) => {
    setTaskDetailModal({
      isOpen: true,
      task: task,
    });
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
      router.push(`/tasks/${task.id}`);
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
            setIsModalOpen={() => router.push("/tasks/add")}
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
            setIsModalOpen={() => router.push("/tasks/add")}
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
                    onClick={() => router.push("/tasks/add")}
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
    <div className="space-y-4">
      {/* Success Messages */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Task status updated successfully!
        </div>
      )}

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
          setIsModalOpen={() => router.push("/tasks/add")}
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
            onAddClick={() => router.push("/tasks/add")}
            onExportClick={handleExport}
          />

          {/* Single Horizontal Scroll Container */}
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* Tasks Table/Board */}
            {activeView === "list" && (
              <TasksListView
                filteredTasks={filteredTasks}
                taskColumnsTable={taskColumnsTable}
                selectedTasks={selectedTasks}
                setSelectedTasks={setSelectedTasks}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setIsModalOpen={() => router.push("/tasks/add")}
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
      />

      {/* Delete Confirmation Modal */}
      <TaskDeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, task: null })}
        onConfirm={async () => {
          if (deleteModal.task?.id) {
            try {
              await taskService.deleteTask(deleteModal.task.id);
              setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== deleteModal.task.id)
              );
              setDeleteModal({ isOpen: false, task: null });
            } catch (error) {
              console.error("Error deleting task:", error);
            }
          }
        }}
        taskName={deleteModal.task?.name || ""}
      />
    </div>
  );
}
