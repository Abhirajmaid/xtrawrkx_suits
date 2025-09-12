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
import Header from "../dashboard/components/Header";

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
  const [draggedOver, setDraggedOver] = useState(null);
  const [selectedDateForNewTask, setSelectedDateForNewTask] = useState(null);
  const [dueDateSortOrder, setDueDateSortOrder] = useState("asc"); // "asc" or "desc"

  const getTasksForCurrentMonth = () => {
    const currentYear = currentMonth.getFullYear();
    const currentMonthNum = currentMonth.getMonth();

    const filteredTasks = allTasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === currentYear &&
        taskDate.getMonth() === currentMonthNum
      );
    });

    // Sort by due date based on dueDateSortOrder
    return filteredTasks.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      
      if (dueDateSortOrder === "asc") {
        return dateA - dateB; // Nearest first
      } else {
        return dateB - dateA; // Furthest first
      }
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
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Get tasks for a specific date
    const getTasksForCalendarDate = (date) => {
      return tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === date.toDateString();
      });
    };

    // Get project icon component
    const getProjectIcon = (project) => {
    return (
        <div className={`w-4 h-4 rounded bg-gradient-to-r ${project.color} flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}>
          {project.icon}
          </div>
      );
    };

    return (
      <div className="bg-white w-full">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border border-gray-300">
          {/* Day Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="border-r border-gray-300 last:border-r-0 px-4 py-3 text-center text-sm font-medium text-gray-600 bg-gray-100"
            >
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month;
            const dayTasks = getTasksForCalendarDate(date);
            const dayNumber = date.getDate();

            return (
              <div
                key={index}
                className={`border-r border-b border-gray-300 last:border-r-0 h-40 p-1.5 ${
                  isCurrentMonth ? "bg-white" : "bg-gray-50"
                } relative group cursor-pointer`}
                onClick={() => isCurrentMonth && setSelectedDateForNewTask(date)}
              >
                {/* Day Number */}
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? "text-gray-700" : "text-gray-400"
                }`}>
                  {dayNumber}
                </div>

                {/* Plus button for adding new task */}
                {isCurrentMonth && (
                  <button 
                    className="absolute top-1 right-1 w-5 h-5 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDateForNewTask(date);
                      setCreateModal({ isOpen: true, defaultStatus: null });
                    }}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}

                {/* Tasks for this date */}
                <div className="space-y-1 overflow-hidden">
                  {dayTasks.slice(0, 3).map((task, taskIndex) => (
                    <div
                      key={task.id}
                      className="bg-white border-l-4 border-l-green-400 border border-gray-200 rounded-md p-1.5 shadow-sm cursor-pointer hover:shadow-md transition-shadow text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskClick(task);
                      }}
                    >
                      {/* Task Title */}
                      <div className="font-medium text-gray-800 mb-1 leading-tight truncate">
                        {task.name}
                      </div>

                      {/* Task Footer - Profile, Project, Progress */}
                      <div className="flex items-center gap-1">
                        {/* User Profile Picture */}
                          {task.hasMultipleAssignees ? (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border border-white flex items-center justify-center">
                            <User className="w-2.5 h-2.5 text-white" />
                            </div>
                          ) : (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-green-500 border border-white flex items-center justify-center">
                            <User className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}

                        {/* Dot Separator */}
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        
                        {/* Project Logo */}
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${task.project.color} border border-white flex items-center justify-center text-white text-xs font-bold`}>
                            {task.project.icon}
                        </div>

                        {/* Dot Separator */}
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        
                        {/* Progress Circle */}
                        <div className="w-5 h-5 rounded-full border border-white bg-white flex items-center justify-center relative">
                          <svg width="20" height="20" className="transform -rotate-90">
                            <circle
                              cx="10"
                              cy="10"
                              r="7"
                              stroke="#e5e7eb"
                              strokeWidth="1.5"
                              fill="transparent"
                            />
                            <circle
                              cx="10"
                              cy="10"
                              r="7"
                              stroke={task.progress === 100 ? "#22c55e" : "#3b82f6"}
                              strokeWidth="1.5"
                              fill="transparent"
                              strokeDasharray={44}
                              strokeDashoffset={44 - (task.progress / 100) * 44}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Show more indicator if there are more tasks */}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{dayTasks.length - 3} more
                    </div>
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
     <div className="bg-white rounded-lg overflow-hidden w-full">
       <div className="w-full">
         <table className="w-full table-fixed">
          <thead>
             <tr className="border-b border-gray-200 bg-gray-50">
               <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                   className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                />
              </th>
               <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task Name
              </th>
               <th className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
               <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
               <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
               <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
               <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
               <th className="w-12 px-4 py-3 text-left">
                {/* Empty header for actions */}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {draggableTasks.map((task) => (
              <React.Fragment key={task.id}>
                <tr
                   className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleTaskClick(task)}
                >
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                       className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                    />
                  </td>
                  <td className="px-4 py-3">
                     <span className="text-sm font-medium text-gray-900 truncate block">
                      {task.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                     <div className="flex items-center gap-2">
                      <div
                         className={`w-6 h-6 bg-gradient-to-br ${task.project.color} rounded-md flex items-center justify-center flex-shrink-0`}
                      >
                         <span className="text-white font-bold text-xs">
                          {task.project.icon}
                        </span>
                      </div>
                       <span className="text-sm text-gray-700 truncate">
                        {task.project.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {task.hasMultipleAssignees ? (
                       <div className="flex -space-x-1">
                         <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold border border-white">
                           <User className="w-3 h-3" />
                        </div>
                         <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold border border-white">
                           <User className="w-3 h-3" />
                        </div>
                      </div>
                    ) : (
                       <div className="flex items-center gap-1">
                         <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                           <User className="w-3 h-3" />
                         </div>
                         <span className="text-sm text-gray-700">You</span>
                       </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                     <span className="text-sm text-gray-700">
                        {task.dueDate}
                       {task.time ? (
                         <span className="text-orange-500 font-medium">, {task.time}</span>
                       ) : null}
                      </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                       className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        task.status
                       )}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                     <div className="flex items-center gap-2">
                       <span className="text-sm font-medium text-gray-900 min-w-[2rem]">
                        {task.progress}%
                      </span>
                       <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                           className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td
                     className="px-4 py-3 text-right relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                     <div className="flex items-center justify-end gap-1">
                      <button
                        id={`row-trigger-${task.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowDropdownToggle(task.id);
                        }}
                         className="p-1 hover:bg-gray-100 rounded transition-colors"
                         title="Expand row details"
                      >
                        <ChevronDown
                           className={`w-4 h-4 text-gray-500 transition-transform ${
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
                         className="p-1 hover:bg-gray-100 rounded transition-colors"
                         title="More actions"
                      >
                         <MoreHorizontal className="w-4 h-4 text-gray-500" />
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
       <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
         <div className="text-sm text-gray-600">Page 1 of 10</div>

         <div className="flex items-center gap-1">
           <button className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50">
             <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
           <button className="px-2 py-1 bg-blue-600 text-white rounded text-sm font-medium min-w-[24px]">
            1
          </button>
           <button className="px-2 py-1 hover:bg-gray-100 text-gray-700 rounded text-sm font-medium min-w-[24px]">
            2
          </button>
           <button className="px-2 py-1 hover:bg-gray-100 text-gray-700 rounded text-sm font-medium min-w-[24px]">
            3
          </button>
           <button className="p-1 hover:bg-gray-100 rounded transition-colors">
             <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-2">
           <span className="text-sm text-gray-600">Show</span>
           <select className="px-2 py-1 bg-white border border-gray-300 rounded text-sm text-gray-700 min-w-[60px]">
            <option>12</option>
            <option>24</option>
            <option>48</option>
          </select>
           <span className="text-sm text-gray-600">/page</span>
        </div>
      </div>
    </div>
  );

  const renderKanbanView = () => {
    // Group tasks by status
    const groupedTasks = {
      'Backlog': tasks.filter(task => task.status === 'Backlog'),
      'To Do': tasks.filter(task => task.status === 'To Do'),
      'In Progress': tasks.filter(task => task.status === 'In Progress'),
      'Done': tasks.filter(task => task.status === 'Done')
    };

    // Drag and drop handlers
    const handleDragStart = (e, task) => {
      e.dataTransfer.setData('text/plain', JSON.stringify(task));
      e.dataTransfer.effectAllowed = 'move';
      // Add some visual feedback
      e.target.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
      e.target.style.opacity = '1';
      setDraggedOver(null);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (e, status) => {
      e.preventDefault();
      setDraggedOver(status);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      // Only clear if we're leaving the column entirely
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setDraggedOver(null);
      }
    };

    const handleDrop = (e, newStatus) => {
      e.preventDefault();
      setDraggedOver(null);
      
      const taskData = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      if (taskData.status !== newStatus) {
        // Update the task status in the allTasks state
        setAllTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskData.id 
              ? { ...task, status: newStatus }
              : task
          )
        );
      }
    };

    const getColumnColor = (status) => {
      switch (status) {
        case 'Backlog':
          return 'text-gray-700';
        case 'To Do':
          return 'text-gray-700';
        case 'In Progress':
          return 'text-gray-700';
        case 'Done':
          return 'text-gray-700';
        default:
          return 'text-gray-700';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'Backlog':
          return <div className="w-2 h-2 rounded-full bg-gray-400"></div>;
        case 'To Do':
          return <div className="w-2 h-2 rounded-full bg-orange-400"></div>;
        case 'In Progress':
          return <div className="w-2 h-2 rounded-full bg-blue-400"></div>;
        case 'Done':
          return <div className="w-2 h-2 rounded-full bg-green-400"></div>;
        default:
          return <div className="w-2 h-2 rounded-full bg-gray-400"></div>;
      }
    };

    const getStatusProgressCircle = (status) => {
      switch (status) {
        case 'Backlog':
          return (
            <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
            </div>
          );
        case 'To Do':
          return (
            <svg className="w-4 h-4 transform -rotate-90" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#fb923c" strokeWidth="2" fill="none" opacity="0.3"/>
              <circle cx="12" cy="12" r="10" stroke="#fb923c" strokeWidth="2" fill="none"
                strokeDasharray="20 60" strokeLinecap="round"/>
            </svg>
          );
        case 'In Progress':
          return (
            <svg className="w-4 h-4 transform -rotate-90" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#60a5fa" strokeWidth="2" fill="none" opacity="0.3"/>
              <circle cx="12" cy="12" r="10" stroke="#60a5fa" strokeWidth="2" fill="none"
                strokeDasharray="40 40" strokeLinecap="round"/>
            </svg>
          );
        case 'Done':
          return (
            <div className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          );
        default:
          return (
            <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
            </div>
          );
      }
    };

    const getProjectIcon = (project) => {
    return (
        <div className={`w-5 h-5 rounded bg-gradient-to-r ${project.color} flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}>
          {project.icon}
        </div>
      );
    };

    const getAssigneeAvatars = (task) => {
      if (task.hasMultipleAssignees) {
        return (
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
              <User className="w-2.5 h-2.5" />
            </div>
            <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs">
              <User className="w-2.5 h-2.5" />
            </div>
            <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs">
              +
            </div>
          </div>
        );
      } else {
        return (
          <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
            <User className="w-2.5 h-2.5" />
          </div>
        );
      }
    };

    return (
      <div className="w-full">
        <div className="flex gap-3 overflow-x-auto pb-6">
          {Object.entries(groupedTasks).map(([status, statusTasks]) => (
            <div 
              key={status} 
              className={`flex-shrink-0 w-64 transition-colors ${
                draggedOver === status ? 'bg-blue-50 rounded-lg' : ''
              }`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  {getStatusProgressCircle(status)}
                  <h3 className="font-bold text-sm text-gray-800">{status}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
                    {statusTasks.length}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Plus className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Task Cards */}
              <div className="space-y-2">
                {statusTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className="bg-white rounded-lg border border-gray-200 p-2.5 hover:shadow-md transition-all cursor-move group"
                    onClick={() => handleTaskClick(task)}
                  >
                    {/* Task Header with Three Dots */}
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-sm text-gray-900 leading-tight flex-1">
                        {task.name}
                      </h4>
                      <button
                        onClick={(e) => handleContextMenuOpen(e, task)}
                        className="p-0.5 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      >
                        <MoreHorizontal className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>

                    {/* Dotted Separator Line */}
                    <div className="border-b border-dashed border-gray-300 mb-3"></div>

                    {/* Middle Row: Profile • Date • Progress */}
                    <div className="flex items-center mb-3">
                      {/* Profile Circle */}
                      {task.hasMultipleAssignees ? (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border border-white flex items-center justify-center flex-shrink-0">
                          <User className="w-2.5 h-2.5 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-green-500 border border-white flex items-center justify-center flex-shrink-0">
                          <User className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      
                      {/* Dot Separator */}
                      <div className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mx-1"></div>
                      
                      {/* Date and Progress Circle - RIGHT NEXT TO EACH OTHER */}
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-700 font-medium">
                          {task.dueDate}
                          {task.time && (
                            <span className="text-orange-500 font-semibold">, {task.time}</span>
                          )}
                        </span>
                        
                        {/* Simple Dot Separator */}
                        <span className="text-gray-400 text-xs">•</span>
                        
                        {/* Progress Circle - THICKER stroke, RIGHT next to date */}
                        <div className="w-5 h-5 rounded-full border border-white bg-white flex items-center justify-center relative flex-shrink-0">
                          <svg width="20" height="20" className="transform -rotate-90">
                            <circle
                              cx="10"
                              cy="10"
                              r="6"
                              stroke="#e5e7eb"
                              strokeWidth="3"
                              fill="transparent"
                            />
                            <circle
                              cx="10"
                              cy="10"
                              r="6"
                              stroke="#3b82f6"
                              strokeWidth="3"
                              fill="transparent"
                              strokeDasharray={37.7}
                              strokeDashoffset={37.7 - (task.progress / 100) * 37.7}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Project Name at Bottom */}
                    <div className="flex items-center gap-2">
                      {getProjectIcon(task.project)}
                      <span className="text-xs text-gray-800 font-semibold truncate">
                        {task.project.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Add Status Column */}
          <div className="flex-shrink-0 w-64">
            <button className="w-full h-10 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-sm">
              <Plus className="w-4 h-4" />
              Add Status
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <Header
        title="My Tasks"
        subtitle="Monitor all of your tasks here"
      />

      {/* Main Content Area */}
      <div className="flex-1 p-4 lg:p-6 overflow-auto bg-gray-50">
        <div className="max-w-full mx-auto px-2 lg:px-4">
          <div className="space-y-4 lg:space-y-6">
          {/* Header Controls Row */}
          <div className="flex items-center justify-between w-full">
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
            <div className="flex items-center gap-3">
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
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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
                onClick={() => setDueDateSortOrder(dueDateSortOrder === "asc" ? "desc" : "asc")}
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
                onClick={() => setCreateModal({ isOpen: true, defaultStatus: null })}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm h-10"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>
          </div>

          {/* Applied Filters */}
          {getTotalFilterCount() > 0 && (
            <div className="flex items-center gap-3 flex-wrap mb-6">
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
          <div className="w-full">
            {activeView === "calendar"
              ? renderCalendar()
              : activeView === "kanban"
                ? renderKanbanView()
                : renderTableView()}
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
