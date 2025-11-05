"use client";

import {
  Plus,
  Calendar,
  Columns,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  TaskContextMenu,
  TaskDeleteConfirmationModal,
  ColumnsDropdown,
  AssigneeDropdown,
  FilterComponent,
  TaskTable,
  TaskKanban,
  TaskCalendar,
  TaskDetailModal,
} from "../../components/my-task";
import Header from "../../components/shared/Header";
import taskService from "../../lib/taskService";
import projectService from "../../lib/projectService";
import { transformTask } from "../../lib/dataTransformers";

export default function MyTasks() {
  const router = useRouter();
  const [activeView, setActiveView] = useState("table");
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0)); // January 2024
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([
    "Task Name",
    "Project",
    "Assignee",
    "Due Date",
    "Status",
    "Progress",
  ]);
  const [filters, setFilters] = useState({
    status: "all",
    project: "all",
    assignee: "all",
  });

  // API state management
  const [allTasks, setAllTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks and projects from API
  useEffect(() => {
    const loadMyTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentUserId = 1; // TODO: Get from auth context

        // Load user's tasks and projects in parallel
        const [tasksResponse, projectsResponse] = await Promise.all([
          taskService.getTasksByAssignee(currentUserId, { 
            pageSize: 100,
            populate: ['project', 'assignee', 'createdBy', 'subtasks']
          }),
          projectService.getAllProjects({ pageSize: 50 })
        ]);

        // Transform data
        const transformedTasks = tasksResponse.data?.map(transformTask) || [];
        const transformedProjects = projectsResponse.data?.map(project => ({
          id: project.id,
          name: project.name,
          slug: project.slug
        })) || [];

        setAllTasks(transformedTasks);
        setProjects(transformedProjects);

      } catch (error) {
        console.error("Error loading my tasks:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMyTasks();
  }, []);

  // Refs for dropdowns
  const columnsMenuRef = useRef(null);
  const filterMenuRef = useRef(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    task: null,
  });

  // Row dropdown state
  const [rowDropdown, setRowDropdown] = useState({
    isOpen: false,
    taskId: null,
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        columnsMenuRef.current &&
        !columnsMenuRef.current.contains(event.target)
      ) {
        setShowColumnsMenu(false);
      }
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target)
      ) {
        setShowFilterMenu(false);
      }
      // Close row dropdown when clicking outside
      if (rowDropdown.isOpen) {
        const dropdownElement = document.getElementById(
          `row-dropdown-${rowDropdown.taskId}`
        );
        const triggerElement = document.getElementById(
          `row-trigger-${rowDropdown.taskId}`
        );
        if (
          dropdownElement &&
          !dropdownElement.contains(event.target) &&
          triggerElement &&
          !triggerElement.contains(event.target)
        ) {
          setRowDropdown({ isOpen: false, taskId: null });
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [rowDropdown.isOpen, rowDropdown.taskId]);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    task: null,
  });

  // Task detail modal state
  const [taskDetailModal, setTaskDetailModal] = useState({
    isOpen: false,
    task: null,
  });

  // Dropdown states
  const [columnsDropdown, setColumnsDropdown] = useState(false);
  const [assigneeDropdown, setAssigneeDropdown] = useState(false);
  const [filterDropdown, setFilterDropdown] = useState(false);

  // Filter states
  const [selectedAssignees, setSelectedAssignees] = useState(["only-me"]);
  const [appliedFilters, setAppliedFilters] = useState({
    status: ["to-do"],
    assignee: ["only-me"],
  });

  // Refs for dropdown positioning
  const columnsButtonRef = useRef(null);
  const assigneeButtonRef = useRef(null);
  const filterButtonRef = useRef(null);

  const [dueDateSortOrder, setDueDateSortOrder] = useState("asc"); // "asc" or "desc"

  // Apply filters to tasks
  const getFilteredTasks = () => {
    let filteredTasks = [...allTasks];

    // Apply status filter
    if (filters.status !== "all") {
      filteredTasks = filteredTasks.filter(task => {
        const taskStatus = task.status.toLowerCase().replace(/\s+/g, "-");
        return taskStatus === filters.status;
      });
    }

    // Apply project filter
    if (filters.project !== "all") {
      filteredTasks = filteredTasks.filter(task => {
        const projectSlug = task.project?.name?.toLowerCase().replace(/\s+/g, "-");
        return projectSlug === filters.project;
      });
    }

    // Apply assignee filter
    if (filters.assignee === "me") {
      const currentUserId = 1; // TODO: Get from auth context
      filteredTasks = filteredTasks.filter(task => task.assigneeId === currentUserId);
    }

    // Apply applied filters
    if (appliedFilters.status && appliedFilters.status.length > 0) {
      filteredTasks = filteredTasks.filter(task => {
        const taskStatus = task.status.toLowerCase().replace(/\s+/g, "-");
        return appliedFilters.status.includes(taskStatus);
      });
    }

    if (appliedFilters.assignee && appliedFilters.assignee.includes("only-me")) {
      const currentUserId = 1; // TODO: Get from auth context
      filteredTasks = filteredTasks.filter(task => task.assigneeId === currentUserId);
    }

    // Sort by due date
    filteredTasks.sort((a, b) => {
      const dateA = a.scheduledDate ? new Date(a.scheduledDate) : new Date('9999-12-31');
      const dateB = b.scheduledDate ? new Date(b.scheduledDate) : new Date('9999-12-31');
      
      if (dueDateSortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    return filteredTasks;
  };

  const tasks = getFilteredTasks();

  const handleColumnToggle = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle task completion
  const handleTaskComplete = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      
      setAllTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDateChange = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // Handle context menu
  const handleContextMenuOpen = (event, task) => {
    event.preventDefault();
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    setContextMenu({
      isOpen: true,
      position: {
        x: rect.right - 180, // Offset to the left of the button (reduced for smaller menu)
        y: rect.top + rect.height / 2,
      },
      task,
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      task: null,
    });
  };

  // Handle row dropdown toggle

  // Handle delete task
  const handleDeleteTask = (task) => {
    setDeleteModal({
      isOpen: true,
      task: task,
    });
    handleContextMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log("Deleting task:", deleteModal.task?.name);
      
      if (deleteModal.task?.id) {
        await taskService.deleteTask(deleteModal.task.id);
        
        // Remove task from local state
        setAllTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== deleteModal.task.id)
        );
      }
      
      setDeleteModal({ isOpen: false, task: null });
    } catch (error) {
      console.error("Error deleting task:", error);
      // Keep modal open to show error or handle it appropriately
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, task: null });
  };

  // Task action handlers

  // Task detail handlers
  const handleTaskClick = (task) => {
    console.log("handleTaskClick called with task:", task);
    console.log("Task ID:", task.id);
    console.log("Task name:", task.name);

    // Use the task data from API (already enriched with relations)
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
    console.log("Opening project:", project.name);
    // Navigate to project page
    router.push(`/projects/${project.name.toLowerCase().replace(/\s+/g, "-")}`);
  };

  const handleOpenFullPage = (task) => {
    console.log("Opening full page for task:", task);
    console.log("Task ID:", task.id);
    console.log("Task ID type:", typeof task.id);
    console.log("Task name:", task.name);

    if (!task || !task.id) {
      console.error("Task or Task ID is undefined or null!", { task });
      alert("Error: Task ID is missing. Cannot open full page view.");
      return;
    }

    // Ensure ID is valid
    const taskId = task.id.toString();
    if (!taskId || taskId === "undefined" || taskId === "null") {
      console.error("Invalid task ID:", taskId);
      alert("Error: Invalid task ID. Cannot open full page view.");
      return;
    }

    console.log("Navigating to /tasks/" + taskId);
    router.push(`/tasks/${taskId}`);
  };

  // Dropdown handlers
  const handleColumnsDropdownToggle = () => {
    setColumnsDropdown(!columnsDropdown);
    setAssigneeDropdown(false);
    setFilterDropdown(false);
  };

  const handleAssigneeDropdownToggle = () => {
    setAssigneeDropdown(!assigneeDropdown);
    setColumnsDropdown(false);
    setFilterDropdown(false);
  };

  const handleFilterDropdownToggle = () => {
    setFilterDropdown(!filterDropdown);
    setColumnsDropdown(false);
    setAssigneeDropdown(false);
  };

  const handleAssigneeChange = (newAssignees) => {
    setSelectedAssignees(newAssignees);
    setAppliedFilters((prev) => ({
      ...prev,
      assignee: newAssignees,
    }));
  };

  const handleFiltersChange = (newFilters) => {
    setAppliedFilters(newFilters);
  };

  const removeFilter = (category, filterId) => {
    const categoryFilters = appliedFilters[category] || [];
    const newCategoryFilters = categoryFilters.filter((id) => id !== filterId);

    setAppliedFilters((prev) => ({
      ...prev,
      [category]: newCategoryFilters,
    }));

    if (category === "assignee") {
      setSelectedAssignees(newCategoryFilters);
    }
  };

  const clearAllFilters = () => {
    setAppliedFilters({});
    setSelectedAssignees([]);
  };

  const getFilterLabel = (category, filterId) => {
    const filterOptions = {
      status: {
        "to-do": "To Do",
        "in-progress": "In Progress",
        "in-review": "In Review",
        done: "Done",
        backlog: "Backlog",
      },
      assignee: {
        "only-me": "Only Me",
        "jonathan-bustos": "Jonathan Bustos",
        "jane-cooper": "Jane Cooper",
      },
    };

    return filterOptions[category]?.[filterId] || filterId;
  };

  const getTotalFilterCount = () => {
    return Object.values(appliedFilters).reduce(
      (total, filters) => total + filters.length,
      0
    );
  };

  // Kanban handlers
  const handleTaskUpdate = async (updatedTask) => {
    console.log(
      "Updating task:",
      updatedTask.name,
      "to status:",
      updatedTask.status
    );

    try {
      // Update task status in the API
      await taskService.updateTaskStatus(updatedTask.id, updatedTask.status);
      
      // Update the task in the state
      setAllTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Handle task date modal

  // renderCalendar removed - using shared TaskCalendar component

  // renderTableView removed - using shared TaskTable component

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header title="My Tasks" subtitle="Monitor all of your tasks here" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header title="My Tasks" subtitle="Monitor all of your tasks here" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Tasks</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header title="My Tasks" subtitle="Monitor all of your tasks here" />

      {/* Main Content Area */}
      <div className="flex-1 p-4 lg:p-6 overflow-hidden bg-gray-50">
        <div className="h-full max-w-full mx-auto px-2 lg:px-4">
          <div className="h-full flex flex-col space-y-4 lg:space-y-6">
            {/* Header Controls Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-4 flex-shrink-0">
              {/* Left Side - View Toggle Buttons */}
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveView("table")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeView === "table"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setActiveView("kanban")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeView === "kanban"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Kanban
                  </button>
                  <button
                    onClick={() => setActiveView("calendar")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeView === "calendar"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Calendar
                  </button>
                </div>
              </div>

              {/* Right Side - Controls */}
              <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                {/* Month Navigation Arrows */}
                <button
                  onClick={() => handleDateChange("prev")}
                  className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </button>

                {/* Date Display */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm h-10">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {currentMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <button
                  onClick={() => handleDateChange("next")}
                  className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* Columns Dropdown */}
                <div className="relative" ref={columnsMenuRef}>
                  <button
                    ref={columnsButtonRef}
                    onClick={handleColumnsDropdownToggle}
                    className={`flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm h-10 ${
                      columnsDropdown ? "bg-gray-50" : ""
                    }`}
                  >
                    <Columns className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Columns
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${columnsDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showColumnsMenu && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                      <div className="p-2">
                        {[
                          "Task Name",
                          "Project",
                          "Assignee",
                          "Due Date",
                          "Status",
                          "Progress",
                          "Actions",
                        ].map((column) => (
                          <label
                            key={column}
                            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedColumns.includes(column)}
                              onChange={() => handleColumnToggle(column)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-900">
                              {column}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Filter Dropdown */}
                <div className="relative" ref={filterMenuRef}>
                  <button
                    ref={filterButtonRef}
                    onClick={handleFilterDropdownToggle}
                    className={`flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm h-10 ${
                      filterDropdown ? "bg-gray-50" : ""
                    }`}
                  >
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Filter
                    </span>
                    {getTotalFilterCount() > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                        {getTotalFilterCount()}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${filterDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showFilterMenu && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-900 mb-2 block">
                            Status
                          </label>
                          <select
                            value={filters.status}
                            onChange={(e) =>
                              handleFilterChange("status", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900"
                          >
                            <option value="all">All Status</option>
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="in-review">In Review</option>
                            <option value="done">Done</option>
                            <option value="backlog">Backlog</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-900 mb-2 block">
                            Project
                          </label>
                          <select
                            value={filters.project}
                            onChange={(e) =>
                              handleFilterChange("project", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900"
                          >
                            <option value="all">All Projects</option>
                            {projects.map((project) => (
                              <option 
                                key={project.id} 
                                value={project.slug || project.name.toLowerCase().replace(/\s+/g, "-")}
                              >
                                {project.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-900 mb-2 block">
                            Assignee
                          </label>
                          <select
                            value={filters.assignee}
                            onChange={(e) =>
                              handleFilterChange("assignee", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900"
                          >
                            <option value="all">All Assignees</option>
                            <option value="me">Me</option>
                            <option value="others">Others</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort */}
                <button
                  onClick={() =>
                    setDueDateSortOrder(
                      dueDateSortOrder === "asc" ? "desc" : "asc"
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm h-10"
                >
                  {dueDateSortOrder === "asc" ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    Nearest Due Date
                  </span>
                </button>

                {/* New Task Button */}
                <button
                  onClick={() => router.push("/tasks/add")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm h-10"
                >
                  <Plus className="w-4 h-4" />
                  New Task
                </button>
              </div>
            </div>

            {/* Applied Filters */}
            {getTotalFilterCount() > 0 && (
              <div className="flex items-center gap-3 flex-wrap mb-6 flex-shrink-0">
                <span className="text-sm font-medium text-gray-700">
                  Filter
                </span>

                {Object.entries(appliedFilters).map(([category, filters]) =>
                  filters.map((filterId) => (
                    <div
                      key={`${category}-${filterId}`}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 shadow-sm"
                    >
                      <span className="text-sm font-medium capitalize">
                        {category}
                      </span>
                      <span className="text-sm">
                        {getFilterLabel(category, filterId)}
                      </span>
                      <button
                        onClick={() => removeFilter(category, filterId)}
                        className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  ))
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Remove Filter
                </button>
              </div>
            )}

            {/* Content based on active view */}
            <div className="w-full flex-1 overflow-auto">
              {activeView === "table" && (
                <TaskTable
                  tasks={tasks}
                  project={null}
                  onTaskClick={(task) => handleTaskClick(task)}
                  onContextMenuOpen={handleContextMenuOpen}
                  onTaskComplete={handleTaskComplete}
                />
              )}
              {activeView === "kanban" && (
                <TaskKanban
                  tasks={tasks}
                  project={null}
                  onTaskClick={(task) => handleTaskClick(task)}
                  onContextMenuOpen={handleContextMenuOpen}
                  onTaskStatusChange={(task, newStatus) => {
                    handleTaskUpdate({ ...task, status: newStatus });
                  }}
                />
              )}
              {activeView === "calendar" && (
                <TaskCalendar
                  tasks={tasks}
                  project={null}
                  onTaskClick={(task) => handleTaskClick(task)}
                  onDateClick={(date) => console.log("Date clicked:", date)}
                  onAddTask={(date) => console.log("Add task for date:", date)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <TaskContextMenu
        isOpen={contextMenu.isOpen}
        onClose={handleContextMenuClose}
        position={contextMenu.position}
        task={contextMenu.task}
        onDelete={handleDeleteTask}
      />

      {/* Delete Confirmation Modal */}
      <TaskDeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        taskName={deleteModal.task?.name || ""}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={taskDetailModal.isOpen}
        onClose={handleTaskDetailClose}
        task={taskDetailModal.task}
        onOpenProject={handleOpenProject}
        onOpenFullPage={handleOpenFullPage}
      />

      {/* Dropdown Components */}
      <ColumnsDropdown
        isOpen={columnsDropdown}
        onClose={() => setColumnsDropdown(false)}
        onToggle={handleColumnsDropdownToggle}
        anchorRef={columnsButtonRef}
      />

      <AssigneeDropdown
        isOpen={assigneeDropdown}
        onClose={() => setAssigneeDropdown(false)}
        onToggle={handleAssigneeDropdownToggle}
        anchorRef={assigneeButtonRef}
        selectedAssignees={selectedAssignees}
        onAssigneeChange={handleAssigneeChange}
      />

      <FilterComponent
        isOpen={filterDropdown}
        onClose={() => setFilterDropdown(false)}
        onToggle={handleFilterDropdownToggle}
        anchorRef={filterButtonRef}
        appliedFilters={appliedFilters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
}
