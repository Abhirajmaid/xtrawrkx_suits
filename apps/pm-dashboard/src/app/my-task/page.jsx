"use client";

import {
  Plus,
  Calendar,
  Columns,
  Filter,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  // CheckSquare,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  // Bell,
  // Settings,
  // HelpCircle,
  X,
} from "lucide-react";
import { Card } from "@xtrawrkx/ui";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import KanbanBoard from "./components/KanbanBoard";
import TaskContextMenu from "./components/TaskContextMenu";
// import TaskDateModal from "./components/TaskDateModal";
import TaskRowDropdown from "./components/TaskRowDropdown";
import TaskDeleteConfirmationModal from "./components/TaskDeleteConfirmationModal";
import TaskCreateModal from "./components/TaskCreateModal";
import TaskDetailModal from "./components/TaskDetailModal";
import ColumnsDropdown from "./components/ColumnsDropdown";
import AssigneeDropdown from "./components/AssigneeDropdown";
import FilterComponent from "./components/FilterComponent";
import Header from "../../components/Header";

export default function MyTasks({ onSearchClick }) {
  const router = useRouter();
  const [activeView, setActiveView] = useState("table");
  const [sortOrder, setSortOrder] = useState("asc");
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

  // Refs for dropdowns
  const columnsMenuRef = useRef(null);
  const filterMenuRef = useRef(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    task: null,
  });

  // Task date modal state
  const [taskDateModal, setTaskDateModal] = useState({
    isOpen: false,
    selectedDate: null,
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

  // Task creation modal state
  const [createModal, setCreateModal] = useState({
    isOpen: false,
    defaultStatus: null,
  });

  // Task detail modal state
  const [taskDetailModal, setTaskDetailModal] = useState({
    isOpen: false,
    task: null,
    isFullView: false,
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

  // Mock data for tasks - will be filtered based on current month
  const allTasksData = [
    // January 2024 tasks
    {
      id: 1,
      name: "Logo Moodboard & Sketch",
      project: {
        name: "The Run Branding & Graphic",
        color: "from-green-400 to-green-600",
        icon: "T",
      },
      assignee: "Multiple",
      dueDate: "Jan 1 2024",
      time: null,
      status: "In Progress",
      progress: 15,
      hasMultipleAssignees: true,
      borderColor: "border-green-400",
    },
    {
      id: 2,
      name: "Logo Finalization",
      project: {
        name: "The Run Branding & Graphic",
        color: "from-green-400 to-green-600",
        icon: "T",
      },
      assignee: "Multiple",
      dueDate: "Jan 4 2024",
      time: null,
      status: "In Progress",
      progress: 25,
      hasMultipleAssignees: true,
      borderColor: "border-green-400",
    },
    {
      id: 3,
      name: "Brand Guide",
      project: {
        name: "The Run Branding & Graphic",
        color: "from-green-400 to-green-600",
        icon: "T",
      },
      assignee: "Multiple",
      dueDate: "Jan 5 2024",
      time: null,
      status: "In Progress",
      progress: 30,
      hasMultipleAssignees: true,
      borderColor: "border-green-400",
    },

    // Week 2 (Jan 7 - Jan 13)
    {
      id: 4,
      name: "Social Illustration",
      project: {
        name: "Hajime Illustration",
        color: "from-green-400 to-green-600",
        icon: "H",
      },
      assignee: "You",
      dueDate: "Jan 8 2024",
      time: null,
      status: "In Progress",
      progress: 20,
      hasMultipleAssignees: false,
      borderColor: "border-green-400",
    },
    {
      id: 5,
      name: "Ads Illustration",
      project: {
        name: "Hajime Illustration",
        color: "from-green-400 to-green-600",
        icon: "H",
      },
      assignee: "You",
      dueDate: "Jan 8 2024",
      time: null,
      status: "In Progress",
      progress: 40,
      hasMultipleAssignees: false,
      borderColor: "border-green-400",
    },
    {
      id: 6,
      name: "Point of Sell",
      project: {
        name: "Resto Dashboard",
        color: "from-pink-400 to-pink-600",
        icon: "R",
      },
      assignee: "You",
      dueDate: "Jan 9 2024",
      time: null,
      status: "In Progress",
      progress: 50,
      hasMultipleAssignees: false,
      borderColor: "border-green-400",
    },
    {
      id: 7,
      name: "Banner Illustration",
      project: {
        name: "Hajime Illustration",
        color: "from-green-400 to-green-600",
        icon: "H",
      },
      assignee: "You",
      dueDate: "Jan 10 2024",
      time: null,
      status: "In Progress",
      progress: 35,
      hasMultipleAssignees: false,
      borderColor: "border-green-400",
    },
    {
      id: 8,
      name: "Resto Management Dash...",
      project: {
        name: "Resto Dashboard",
        color: "from-blue-400 to-blue-600",
        icon: "R",
      },
      assignee: "You",
      dueDate: "Jan 12 2024",
      time: null,
      status: "In Progress",
      progress: 50,
      hasMultipleAssignees: false,
      borderColor: "border-green-400",
    },
    {
      id: 9,
      name: "First Draft",
      project: {
        name: "Carl UI/UX",
        color: "from-orange-400 to-orange-600",
        icon: "C",
      },
      assignee: "You",
      dueDate: "Jan 12 2024",
      time: null,
      status: "To Do",
      progress: 5,
      hasMultipleAssignees: false,
      borderColor: "border-orange-400",
    },

    // Week 3 (Jan 14 - Jan 20)
    {
      id: 10,
      name: "Online Order Flow",
      project: {
        name: "Resto Dashboard",
        color: "from-pink-400 to-pink-600",
        icon: "R",
      },
      assignee: "You",
      dueDate: "Jan 15 2024",
      time: null,
      status: "In Progress",
      progress: 45,
      hasMultipleAssignees: false,
      borderColor: "border-green-400",
    },
    {
      id: 11,
      name: "Landing Page Options",
      project: {
        name: "Carl UI/UX",
        color: "from-orange-400 to-orange-600",
        icon: "C",
      },
      assignee: "You",
      dueDate: "Jan 15 2024",
      time: null,
      status: "In Progress",
      progress: 25,
      hasMultipleAssignees: false,
      borderColor: "border-green-400",
    },
    {
      id: 12,
      name: "Landing Page",
      project: {
        name: "Mogo Web Design",
        color: "from-blue-400 to-blue-600",
        icon: "M",
      },
      assignee: "You",
      dueDate: "Jan 17 2024",
      time: null,
      status: "In Progress",
      progress: 60,
      hasMultipleAssignees: false,
      borderColor: "border-green-400",
    },
    {
      id: 13,
      name: "Table Management Flow",
      project: {
        name: "Resto Dashboard",
        color: "from-pink-400 to-pink-600",
        icon: "R",
      },
      assignee: "You",
      dueDate: "Jan 18 2024",
      time: null,
      status: "In Progress",
      progress: 55,
      hasMultipleAssignees: false,
      borderColor: "border-green-400",
    },

    // Week 4 (Jan 21 - Jan 27)
    {
      id: 14,
      name: "Logo Options",
      project: {
        name: "The Run Branding & Graphic",
        color: "from-green-400 to-green-600",
        icon: "T",
      },
      assignee: "Multiple",
      dueDate: "Jan 22 2024",
      time: null,
      status: "In Progress",
      progress: 40,
      hasMultipleAssignees: true,
      borderColor: "border-green-400",
    },
    {
      id: 15,
      name: "Homepage",
      project: {
        name: "Mogo Web Design",
        color: "from-blue-400 to-blue-600",
        icon: "M",
      },
      assignee: "You",
      dueDate: "Jan 23 2024",
      time: null,
      status: "In Review",
      progress: 100,
      hasMultipleAssignees: false,
      borderColor: "border-green-400",
    },
    {
      id: 16,
      name: "Brand Guide Deck",
      project: {
        name: "Yellow Branding",
        color: "from-blue-400 to-blue-600",
        icon: "Y",
      },
      assignee: "Multiple",
      dueDate: "Jan 25 2024",
      time: null,
      status: "Done",
      progress: 100,
      hasMultipleAssignees: true,
      borderColor: "border-green-400",
    },
    {
      id: 17,
      name: "Web Mockup",
      project: {
        name: "Yellow Branding",
        color: "from-blue-400 to-blue-600",
        icon: "Y",
      },
      assignee: "You",
      dueDate: "Jan 25 2024",
      time: "19:00",
      status: "In Progress",
      progress: 60,
      hasMultipleAssignees: false,
      borderColor: "border-blue-400",
    },
    {
      id: 18,
      name: "Resto Dashboard",
      project: {
        name: "Resto Dashboard",
        color: "from-pink-400 to-pink-600",
        icon: "R",
      },
      assignee: "You",
      dueDate: "Jan 26 2024",
      time: null,
      status: "In Progress",
      progress: 50,
      hasMultipleAssignees: false,
      borderColor: "border-orange-400",
    },

    // Week 5 (Jan 28 - Feb 3)
    {
      id: 19,
      name: "Hero Illustration",
      project: {
        name: "Hajime Illustration",
        color: "from-green-400 to-green-600",
        icon: "H",
      },
      assignee: "You",
      dueDate: "Jan 29 2024",
      time: null,
      status: "In Progress",
      progress: 20,
      hasMultipleAssignees: false,
      borderColor: "border-green-400",
    },
    {
      id: 20,
      name: "Landing Page Options",
      project: {
        name: "Carl UI/UX",
        color: "from-orange-400 to-orange-600",
        icon: "C",
      },
      assignee: "You",
      dueDate: "Jan 30 2024",
      time: null,
      status: "To Do",
      progress: 5,
      hasMultipleAssignees: false,
      borderColor: "border-orange-400",
    },
    {
      id: 21,
      name: "Onboarding Flow",
      project: {
        name: "Futurework",
        color: "from-blue-400 to-blue-600",
        icon: "F",
      },
      assignee: "Multiple",
      dueDate: "Jan 21 2024",
      time: "9:00",
      status: "In Progress",
      progress: 15,
      hasMultipleAssignees: true,
      borderColor: "border-orange-400",
    },
    {
      id: 22,
      name: "Mid Month Review",
      project: {
        name: "Yellow Branding",
        color: "from-blue-400 to-blue-600",
        icon: "Y",
      },
      assignee: "You",
      dueDate: "Jan 22 2024",
      time: null,
      status: "In Review",
      progress: 100,
      hasMultipleAssignees: false,
      borderColor: "border-blue-400",
    },
    {
      id: 23,
      name: "Brand Guide Deck",
      project: {
        name: "Yellow Branding",
        color: "from-blue-400 to-blue-600",
        icon: "Y",
      },
      assignee: "Multiple",
      dueDate: "Jan 25 2024",
      time: null,
      status: "Done",
      progress: 100,
      hasMultipleAssignees: true,
      borderColor: "border-green-400",
    },
    {
      id: 24,
      name: "Web Mockup",
      project: {
        name: "Yellow Branding",
        color: "from-blue-400 to-blue-600",
        icon: "Y",
      },
      assignee: "You",
      dueDate: "Jan 25 2024",
      time: "19:00",
      status: "In Progress",
      progress: 60,
      hasMultipleAssignees: false,
      borderColor: "border-blue-400",
    },
    {
      id: 25,
      name: "Resto Dashboard",
      project: {
        name: "Resto Dashboard",
        color: "from-pink-400 to-pink-600",
        icon: "R",
      },
      assignee: "You",
      dueDate: "Jan 26 2024",
      time: null,
      status: "In Progress",
      progress: 50,
      hasMultipleAssignees: false,
      borderColor: "border-orange-400",
    },
    {
      id: 26,
      name: "Hero Illustration",
      project: {
        name: "Hajime Illustration",
        color: "from-green-400 to-green-600",
        icon: "H",
      },
      assignee: "You",
      dueDate: "Jan 29 2024",
      time: null,
      status: "In Progress",
      progress: 20,
      hasMultipleAssignees: false,
      borderColor: "border-green-400",
    },
    {
      id: 27,
      name: "Landing Page Options",
      project: {
        name: "Carl UI/UX",
        color: "from-orange-400 to-orange-600",
        icon: "C",
      },
      assignee: "You",
      dueDate: "Jan 30 2024",
      time: null,
      status: "To Do",
      progress: 5,
      hasMultipleAssignees: false,
      borderColor: "border-orange-400",
    },
    {
      id: 28,
      name: "Onboarding Flow",
      project: {
        name: "Futurework",
        color: "from-blue-400 to-blue-600",
        icon: "F",
      },
      assignee: "Multiple",
      dueDate: "Jan 31 2024",
      time: "9:00",
      status: "In Progress",
      progress: 15,
      hasMultipleAssignees: true,
      borderColor: "border-orange-400",
    },

    // February 2024 tasks (leap year - 29 days)
    {
      id: 29,
      name: "February Planning",
      project: {
        name: "Futurework",
        color: "from-blue-400 to-blue-600",
        icon: "F",
      },
      assignee: "You",
      dueDate: "Feb 1 2024",
      time: null,
      status: "To Do",
      progress: 0,
      hasMultipleAssignees: false,
      borderColor: "border-blue-400",
    },
    {
      id: 30,
      name: "Leap Year Project",
      project: {
        name: "The Run Branding & Graphic",
        color: "from-green-400 to-green-600",
        icon: "T",
      },
      assignee: "You",
      dueDate: "Feb 29 2024",
      time: null,
      status: "In Progress",
      progress: 25,
      hasMultipleAssignees: false,
      borderColor: "border-green-400",
    },

    // March 2024 tasks (31 days)
    {
      id: 31,
      name: "March Kickoff",
      project: {
        name: "Mogo Web Design",
        color: "from-blue-400 to-blue-600",
        icon: "M",
      },
      assignee: "You",
      dueDate: "Mar 1 2024",
      time: null,
      status: "To Do",
      progress: 0,
      hasMultipleAssignees: false,
      borderColor: "border-blue-400",
    },
    {
      id: 32,
      name: "End of March",
      project: {
        name: "Carl UI/UX",
        color: "from-orange-400 to-orange-600",
        icon: "C",
      },
      assignee: "You",
      dueDate: "Mar 31 2024",
      time: null,
      status: "In Progress",
      progress: 50,
      hasMultipleAssignees: false,
      borderColor: "border-orange-400",
    },

    // April 2024 tasks (30 days)
    {
      id: 33,
      name: "April Showers",
      project: {
        name: "Hajime Illustration",
        color: "from-green-400 to-green-600",
        icon: "H",
      },
      assignee: "You",
      dueDate: "Apr 1 2024",
      time: null,
      status: "To Do",
      progress: 0,
      hasMultipleAssignees: false,
      borderColor: "border-green-400",
    },
    {
      id: 34,
      name: "April End",
      project: {
        name: "Resto Dashboard",
        color: "from-pink-400 to-pink-600",
        icon: "R",
      },
      assignee: "You",
      dueDate: "Apr 30 2024",
      time: null,
      status: "In Progress",
      progress: 75,
      hasMultipleAssignees: false,
      borderColor: "border-pink-400",
    },

    // Add some Backlog tasks
    {
      id: 35,
      name: "Research Phase",
      project: {
        name: "Carl UI/UX",
        color: "from-orange-400 to-orange-600",
        icon: "C",
      },
      assignee: "You",
      dueDate: "Jan 15 2024",
      time: null,
      status: "Backlog",
      progress: 0,
      hasMultipleAssignees: false,
      borderColor: "border-purple-400",
    },
    {
      id: 36,
      name: "Initial Planning",
      project: {
        name: "Futurework",
        color: "from-blue-400 to-blue-600",
        icon: "F",
      },
      assignee: "Multiple",
      dueDate: "Jan 20 2024",
      time: null,
      status: "Backlog",
      progress: 5,
      hasMultipleAssignees: true,
      borderColor: "border-purple-400",
    },
  ];

  const [allTasks, setAllTasks] = useState(allTasksData);

  const getTasksForCurrentMonth = () => {
    const currentYear = currentMonth.getFullYear();
    const currentMonthNum = currentMonth.getMonth();

    return allTasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === currentYear &&
        taskDate.getMonth() === currentMonthNum
      );
    });
  };

  const tasks = getTasksForCurrentMonth();
  const draggableTasks = tasks;

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

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

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

  const handleNewTask = () => {
    // Navigate to new task creation or open modal
    console.log("Creating new task...");
    // You can implement task creation modal here
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
  const handleRowDropdownToggle = (taskId) => {
    setRowDropdown((prev) => ({
      isOpen: prev.taskId === taskId ? !prev.isOpen : true,
      taskId: taskId,
    }));
  };

  // Handle delete task
  const handleDeleteTask = (task) => {
    setDeleteModal({
      isOpen: true,
      task: task,
    });
    handleContextMenuClose();
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting task:", deleteModal.task?.name);
    // Add actual delete logic here
    setDeleteModal({ isOpen: false, task: null });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, task: null });
  };

  // Task action handlers
  const handleTaskDetail = (task) => {
    console.log("Opening task detail for:", task.name);
    // Navigate to task detail page or open modal
  };

  const handleEditTask = (task) => {
    console.log("Editing task:", task.name);
    // Open task edit modal
  };

  // Task detail handlers
  const handleTaskClick = (task) => {
    setTaskDetailModal({
      isOpen: true,
      task: task,
      isFullView: false,
    });
  };

  const handleTaskDetailClose = () => {
    setTaskDetailModal({
      isOpen: false,
      task: null,
      isFullView: false,
    });
  };

  const handleToggleView = () => {
    setTaskDetailModal((prev) => ({
      ...prev,
      isFullView: !prev.isFullView,
    }));
  };

  const handleOpenProject = (project) => {
    console.log("Opening project:", project.name);
    // Navigate to project page
    router.push(`/projects/${project.name.toLowerCase().replace(/\s+/g, "-")}`);
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
  const handleTaskUpdate = (updatedTask) => {
    console.log(
      "Updating task:",
      updatedTask.name,
      "to status:",
      updatedTask.status
    );

    // Update the task in the state
    setAllTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleTaskCreate = (columnId) => {
    const statusMap = {
      backlog: "Backlog",
      todo: "To Do",
      "in-progress": "In Progress",
      done: "Done",
    };

    setCreateModal({
      isOpen: true,
      defaultStatus: statusMap[columnId] || "Backlog",
    });
  };

  const handleTaskCreateConfirm = (taskData) => {
    console.log("Creating task:", taskData);

    // Create new task with unique ID
    const newTask = {
      id: Date.now(), // Simple ID generation
      name: taskData.name,
      project: taskData.project,
      assignee: "You",
      dueDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: null,
      status: taskData.status,
      progress: 0,
      hasMultipleAssignees: false,
      borderColor: "border-blue-400",
    };

    // Add the new task to state
    setAllTasks((prevTasks) => [...prevTasks, newTask]);
    setCreateModal({ isOpen: false, defaultStatus: null });
  };

  const handleTaskCreateCancel = () => {
    setCreateModal({ isOpen: false, defaultStatus: null });
  };

  // Handle task date modal
  const handleDateClick = (date) => {
    setTaskDateModal({
      isOpen: true,
      selectedDate: date,
    });
  };

  const handleDateModalClose = () => {
    setTaskDateModal({
      isOpen: false,
      selectedDate: null,
    });
  };

  const navigateMonth = (direction) => {
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

  const getTasksForDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth(); // 0-based
    const year = date.getFullYear();

    // Show tasks for the current month and year
    if (
      month !== currentMonth.getMonth() ||
      year !== currentMonth.getFullYear()
    )
      return [];

    return draggableTasks.filter((task) => {
      const taskDay = parseInt(task.dueDate.split(" ")[1]);
      return taskDay === day;
    });
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Calculate the start date for the calendar grid (first Sunday of the week containing the 1st)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    // Generate exactly 6 weeks (42 days) to ensure we cover all possible month layouts
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Helper function to check if a year is a leap year
    const isLeapYear = (year) => {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    };

    // Get the correct number of days in the month
    const getDaysInMonth = (year, month) => {
      const daysInMonthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (month === 1 && isLeapYear(year)) {
        // February in leap year
        return 29;
      }
      return daysInMonthArray[month];
    };

    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 w-full">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-brand-text-light" />
            </button>
            <h2 className="text-lg font-semibold text-brand-foreground">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-brand-text-light" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 w-full">
          {/* Day Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-brand-text-light"
            >
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === new Date().toDateString();
            const dayTasks = getTasksForDate(date);
            const dayNumber = date.getDate();

            return (
              <div
                key={index}
                className={`min-h-[140px] p-2 border border-white/10 rounded-lg ${
                  isCurrentMonth ? "bg-white/5" : "bg-white/2"
                } ${isToday ? "ring-2 ring-blue-500" : ""} hover:bg-white/10 transition-colors relative group`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isCurrentMonth
                      ? "text-brand-foreground"
                      : "text-brand-text-muted"
                  }`}
                >
                  {dayNumber}
                </div>

                {/* Tasks for this date */}
                <div className="space-y-2">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className={`p-2 rounded-lg border-l-3 ${task.borderColor} bg-white/15 backdrop-blur-sm shadow-sm cursor-pointer hover:bg-white/20 transition-colors`}
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="font-medium text-brand-foreground truncate text-xs mb-2">
                        {task.name}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* Profile Images - Larger */}
                          {task.hasMultipleAssignees ? (
                            <div className="flex -space-x-1">
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-white shadow-sm">
                                <User className="w-3 h-3" />
                              </div>
                              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-white shadow-sm">
                                <User className="w-3 h-3" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-white shadow-sm">
                              <User className="w-3 h-3" />
                            </div>
                          )}

                          {/* Project Indicator - Larger */}
                          <div
                            className={`w-5 h-5 bg-gradient-to-br ${task.project.color} rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                          >
                            {task.project.icon}
                          </div>
                        </div>

                        {/* Circular Progress - Larger */}
                        <div className="relative inline-flex items-center justify-center">
                          <svg
                            width={24}
                            height={24}
                            className="transform -rotate-90"
                          >
                            <circle
                              cx={12}
                              cy={12}
                              r={9}
                              stroke="#e5e7eb"
                              strokeWidth={2}
                              fill="transparent"
                            />
                            <circle
                              cx={12}
                              cy={12}
                              r={9}
                              stroke={
                                task.progress === 100 ? "#22c55e" : "#3b82f6"
                              }
                              strokeWidth={2}
                              fill="transparent"
                              strokeDasharray={56.55}
                              strokeDashoffset={
                                56.55 - (task.progress / 100) * 56.55
                              }
                              strokeLinecap="round"
                              className="transition-all duration-300"
                            />
                          </svg>
                          <span
                            className="absolute text-xs font-semibold text-gray-700"
                            style={{ fontSize: "8px" }}
                          >
                            {task.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Show More link for dates with more than 2 tasks */}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-blue-500 hover:text-blue-600 cursor-pointer">
                      +{dayTasks.length - 2}
                    </div>
                  )}

                  {/* Add task button for empty dates */}
                  {dayTasks.length === 0 && isCurrentMonth && (
                    <button className="opacity-0 group-hover:opacity-100 absolute top-1 right-1 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                      <Plus className="w-2.5 h-2.5 text-brand-text-light" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTableView = () => (
    <Card glass={true} className="overflow-hidden w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">
                Task Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">
                Project
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">
                Progress
              </th>
              <th className="px-4 py-3 text-left">
                {/* Empty header for actions */}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {draggableTasks.map((task) => (
              <React.Fragment key={task.id}>
                <tr
                  className="hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleTaskClick(task)}
                >
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-brand-foreground">
                      {task.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 bg-gradient-to-br ${task.project.color} rounded-lg flex items-center justify-center shadow-sm`}
                      >
                        <span className="text-white font-bold text-sm">
                          {task.project.icon}
                        </span>
                      </div>
                      <span className="text-sm text-brand-text-light">
                        {task.project.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {task.hasMultipleAssignees ? (
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white/20">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white/20">
                          <User className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-brand-foreground">
                        {task.assignee}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-text-light" />
                      <span className="text-sm text-brand-foreground whitespace-nowrap">
                        {task.dueDate}
                        {task.time ? ` ${task.time}` : ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        task.status
                      )} whitespace-nowrap`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-brand-foreground min-w-[2.5rem]">
                        {task.progress}%
                      </span>
                      <div className="w-24 bg-white/20 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300 shadow-sm"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        id={`row-trigger-${task.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowDropdownToggle(task.id);
                        }}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-brand-text-light transition-transform ${
                            rowDropdown.isOpen && rowDropdown.taskId === task.id
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContextMenuOpen(e, task);
                        }}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-brand-text-light" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Row Dropdown */}
                {rowDropdown.isOpen && rowDropdown.taskId === task.id && (
                  <tr>
                    <td colSpan="8" className="px-4 py-0">
                      <div id={`row-dropdown-${task.id}`}>
                        <TaskRowDropdown
                          isOpen={
                            rowDropdown.isOpen && rowDropdown.taskId === task.id
                          }
                          task={task}
                          onClose={() =>
                            setRowDropdown({ isOpen: false, taskId: null })
                          }
                          onTaskDetail={handleTaskDetail}
                          onOpenProject={handleOpenProject}
                          onEditTask={handleEditTask}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-white/20">
        <div className="text-sm text-brand-text-light">Page 1 of 10</div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50">
            <ChevronLeft className="w-4 h-4 text-brand-text-light" />
          </button>
          <button className="px-3 py-2 bg-white/20 text-brand-foreground rounded-lg text-sm font-medium">
            1
          </button>
          <button className="px-3 py-2 hover:bg-white/20 text-brand-text-light hover:text-brand-foreground rounded-lg text-sm font-medium">
            2
          </button>
          <button className="px-3 py-2 hover:bg-white/20 text-brand-text-light hover:text-brand-foreground rounded-lg text-sm font-medium">
            3
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-brand-text-light" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-brand-text-light">Show</span>
          <select className="px-2 py-1 bg-white/10 border border-white/20 rounded text-sm text-brand-foreground">
            <option>12</option>
            <option>24</option>
            <option>48</option>
          </select>
          <span className="text-sm text-brand-text-light">/page</span>
        </div>
      </div>
    </Card>
  );

  const renderKanbanView = () => {
    return (
      <KanbanBoard
        tasks={draggableTasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleDeleteTask}
        onTaskCreate={handleTaskCreate}
        onTaskClick={handleTaskClick}
      />
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <Header
        title="My Tasks"
        subtitle="Monitor all of your tasks here"
        onSearchClick={onSearchClick}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Header Controls Row */}
          <div className="flex items-center justify-between w-full">
            {/* Left Side - View Toggle Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-1 shadow-lg">
                <button
                  onClick={() => setActiveView("table")}
                  className={`px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 transform ${
                    activeView === "table"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                      : "text-brand-text-light hover:text-brand-foreground hover:bg-white/10 hover:shadow-md"
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setActiveView("kanban")}
                  className={`px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 transform ${
                    activeView === "kanban"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                      : "text-brand-text-light hover:text-brand-foreground hover:bg-white/10 hover:shadow-md"
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setActiveView("calendar")}
                  className={`px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 transform ${
                    activeView === "calendar"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                      : "text-brand-text-light hover:text-brand-foreground hover:bg-white/10 hover:shadow-md"
                  }`}
                >
                  Calendar
                </button>
              </div>
            </div>

            {/* Right Side - Controls */}
            <div className="flex items-center gap-3">
              {/* Date Display */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
                <Calendar className="w-4 h-4 text-brand-text-light" />
                <span className="text-sm font-medium text-brand-foreground">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <div className="flex flex-col">
                  <button
                    onClick={() => handleDateChange("prev")}
                    className="hover:bg-white/20 rounded p-0.5"
                  >
                    <ChevronUp className="w-3 h-3 text-brand-text-light" />
                  </button>
                  <button
                    onClick={() => handleDateChange("next")}
                    className="hover:bg-white/20 rounded p-0.5"
                  >
                    <ChevronDown className="w-3 h-3 text-brand-text-light" />
                  </button>
                </div>
              </div>

              {/* Columns Dropdown */}
              <div className="relative" ref={columnsMenuRef}>
                <button
                  ref={columnsButtonRef}
                  onClick={handleColumnsDropdownToggle}
                  className={`flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-colors ${
                    columnsDropdown ? "bg-white/20" : ""
                  }`}
                >
                  <Columns className="w-4 h-4 text-brand-text-light" />
                  <span className="text-sm font-medium text-brand-foreground">
                    Columns
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-text-light transition-transform ${columnsDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showColumnsMenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50">
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
                          className="flex items-center gap-2 p-2 hover:bg-white/20 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedColumns.includes(column)}
                            onChange={() => handleColumnToggle(column)}
                            className="w-4 h-4 text-brand-primary bg-white/10 border-white/20 rounded focus:ring-brand-primary"
                          />
                          <span className="text-sm text-brand-foreground">
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
                  className={`flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-colors ${
                    filterDropdown ? "bg-white/20" : ""
                  }`}
                >
                  <Filter className="w-4 h-4 text-brand-text-light" />
                  <span className="text-sm font-medium text-brand-foreground">
                    Filter
                  </span>
                  {getTotalFilterCount() > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                      {getTotalFilterCount()}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-brand-text-light transition-transform ${filterDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showFilterMenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50">
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium text-brand-foreground mb-2 block">
                          Status
                        </label>
                        <select
                          value={filters.status}
                          onChange={(e) =>
                            handleFilterChange("status", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-brand-foreground"
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
                        <label className="text-sm font-medium text-brand-foreground mb-2 block">
                          Project
                        </label>
                        <select
                          value={filters.project}
                          onChange={(e) =>
                            handleFilterChange("project", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-brand-foreground"
                        >
                          <option value="all">All Projects</option>
                          <option value="yellow-branding">
                            Yellow Branding
                          </option>
                          <option value="mogo-web">Mogo Web Design</option>
                          <option value="futurework">Futurework</option>
                          <option value="resto-dashboard">
                            Resto Dashboard
                          </option>
                          <option value="hajime-illustration">
                            Hajime Illustration
                          </option>
                          <option value="carl-ui-ux">Carl UI/UX</option>
                          <option value="the-run-branding">
                            The Run Branding
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-brand-foreground mb-2 block">
                          Assignee
                        </label>
                        <select
                          value={filters.assignee}
                          onChange={(e) =>
                            handleFilterChange("assignee", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-brand-foreground"
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
                onClick={toggleSortOrder}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
              >
                <span className="text-sm font-medium text-brand-foreground">
                  Nearest Due Date
                </span>
                {sortOrder === "asc" ? (
                  <ChevronUp className="w-4 h-4 text-brand-text-light" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-brand-text-light" />
                )}
              </button>

              {/* New Task Button */}
              <button
                onClick={handleNewTask}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
            </div>
          </div>

          {/* Applied Filters */}
          {getTotalFilterCount() > 0 && (
            <div className="flex items-center gap-3 flex-wrap mb-6">
              <span className="text-sm font-medium text-brand-text-light">
                Filter
              </span>

              {Object.entries(appliedFilters).map(([category, filters]) =>
                filters.map((filterId) => (
                  <div
                    key={`${category}-${filterId}`}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-brand-foreground"
                  >
                    <span className="text-sm font-medium capitalize">
                      {category}
                    </span>
                    <span className="text-sm">
                      {getFilterLabel(category, filterId)}
                    </span>
                    <button
                      onClick={() => removeFilter(category, filterId)}
                      className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}

              <button
                onClick={clearAllFilters}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Remove Filter
              </button>
            </div>
          )}

          {/* Content based on active view */}
          <div className="w-full">
            {activeView === "calendar"
              ? renderCalendar()
              : activeView === "kanban"
                ? renderKanbanView()
                : renderTableView()}
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

      {/* Task Creation Modal */}
      <TaskCreateModal
        isOpen={createModal.isOpen}
        onClose={handleTaskCreateCancel}
        onConfirm={handleTaskCreateConfirm}
        defaultStatus={createModal.defaultStatus}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={taskDetailModal.isOpen}
        onClose={handleTaskDetailClose}
        task={taskDetailModal.task}
        isFullView={taskDetailModal.isFullView}
        onToggleView={handleToggleView}
        onOpenProject={handleOpenProject}
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
