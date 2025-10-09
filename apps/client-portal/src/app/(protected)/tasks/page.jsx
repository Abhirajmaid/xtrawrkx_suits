"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Calendar,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Columns,
  Table,
  Grid3X3,
  FileText,
} from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import TaskDetailSidebar from "@/components/tasks/TaskDetailSidebar";

// Tasks data
const tasksData = {
  todo: [
    {
      id: "t1",
      title: "Design new landing page",
      description:
        "Create wireframes and mockups for the new landing page design",
      status: "todo",
      priority: "high",
      project: "Event Organization Website",
      assignee: "Gabrial Matula",
      dueDate: "2024-02-15",
      estimatedHours: 8,
      tags: ["design", "frontend"],
      subtasks: [
        {
          id: "st1_1",
          name: "Create wireframes for hero section",
          assignee: "Gabrial Matula",
          dueDate: "2024-02-12",
          status: "completed",
          priority: "high",
          completed: true,
          subtasks: [],
        },
        {
          id: "st1_2",
          name: "Design call-to-action buttons",
          assignee: "Gabrial Matula",
          dueDate: "2024-02-14",
          status: "in-progress",
          priority: "medium",
          completed: false,
          subtasks: [],
        },
        {
          id: "st1_3",
          name: "Create mobile responsive layouts",
          assignee: "Gabrial Matula",
          dueDate: "2024-02-16",
          status: "todo",
          priority: "medium",
          completed: false,
          subtasks: [],
        },
      ],
    },
    {
      id: "t2",
      title: "Update API documentation",
      description: "Document the new endpoints and update the API reference",
      status: "todo",
      priority: "medium",
      project: "Health Mobile App Design",
      assignee: "Layla Amora",
      dueDate: "2024-02-20",
      estimatedHours: 4,
      tags: ["documentation", "api"],
      subtasks: [
        {
          id: "st2_1",
          name: "Document authentication endpoints",
          assignee: "Layla Amora",
          dueDate: "2024-02-18",
          status: "todo",
          priority: "medium",
          completed: false,
          subtasks: [],
        },
        {
          id: "st2_2",
          name: "Create API examples",
          assignee: "Layla Amora",
          dueDate: "2024-02-19",
          status: "todo",
          priority: "low",
          completed: false,
          subtasks: [],
        },
      ],
    },
    {
      id: "t3",
      title: "Review client feedback",
      description:
        "Analyze and categorize feedback from the latest client survey",
      status: "todo",
      priority: "low",
      project: "Advance SEO Service",
      assignee: "Ansel Finn",
      dueDate: "2024-02-25",
      estimatedHours: 3,
      tags: ["feedback", "analysis"],
    },
  ],
  "in-progress": [
    {
      id: "t4",
      title: "Implement user authentication",
      description: "Set up OAuth2 and JWT token management",
      status: "in-progress",
      priority: "urgent",
      project: "Event Organization Website",
      assignee: "Gabrial Matula",
      dueDate: "2024-02-10",
      estimatedHours: 12,
      tags: ["backend", "security"],
    },
    {
      id: "t5",
      title: "Database optimization",
      description: "Optimize queries and add proper indexing",
      status: "in-progress",
      priority: "high",
      project: "Health Mobile App Design",
      assignee: "Layla Amora",
      dueDate: "2024-02-18",
      estimatedHours: 6,
      tags: ["database", "optimization"],
    },
  ],
  review: [
    {
      id: "t6",
      title: "Code review for payment module",
      description:
        "Review the implementation of the new payment processing module",
      status: "review",
      priority: "high",
      project: "Advance SEO Service",
      assignee: "Ansel Finn",
      dueDate: "2024-02-12",
      estimatedHours: 2,
      tags: ["code-review", "payments"],
    },
  ],
  completed: [
    {
      id: "t7",
      title: "Setup CI/CD pipeline",
      description: "Configure automated testing and deployment pipeline",
      status: "completed",
      priority: "medium",
      project: "Event Organization Website",
      assignee: "Gabrial Matula",
      dueDate: "2024-01-30",
      estimatedHours: 8,
      tags: ["devops", "automation"],
    },
    {
      id: "t8",
      title: "Update user interface",
      description: "Apply the new design system to all components",
      status: "completed",
      priority: "high",
      project: "Health Mobile App Design",
      assignee: "Layla Amora",
      dueDate: "2024-02-05",
      estimatedHours: 16,
      tags: ["ui", "design-system"],
    },
  ],
};

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("table");
  const [currentMonth, setCurrentMonth] = useState(new Date());
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
  const [dueDateSortOrder, setDueDateSortOrder] = useState("asc");
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isTaskDetailFullView, setIsTaskDetailFullView] = useState(false);
  const [expandedSubtasks, setExpandedSubtasks] = useState({});

  // Refs for dropdowns
  const columnsMenuRef = useRef(null);
  const filterMenuRef = useRef(null);

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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calculate stats
  const totalTasks = Object.values(tasksData).flat().length;
  const inProgressTasks = tasksData["in-progress"].length;
  const completedTasks = tasksData.completed.length;
  const overdueTasks = Object.values(tasksData)
    .flat()
    .filter(
      (task) =>
        new Date(task.dueDate) < new Date() && task.status !== "completed"
    ).length;

  // Handler functions
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

  // Task creation handler
  const handleTaskCreate = (newTask) => {
    console.log("Creating new task:", newTask);
    // Here you would typically add the task to your data source
    // For now, we'll just log it
    alert(`Task "${newTask.title}" created successfully!`);
  };

  // Task detail handlers
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const handleTaskDetailClose = () => {
    setIsTaskDetailOpen(false);
    setSelectedTask(null);
    setIsTaskDetailFullView(false);
  };

  const handleTaskDetailToggleView = () => {
    setIsTaskDetailFullView(!isTaskDetailFullView);
  };

  const handleSubtaskUpdate = (taskId, updatedSubtasks) => {
    console.log("Updating subtasks for task:", taskId, updatedSubtasks);
    // Here you would update the task in your data source
    // For now, we'll just log it
  };

  const toggleSubtaskExpansion = (taskId) => {
    setExpandedSubtasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "review":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const renderTaskCard = (task) => {
    return (
      <Link key={task.id} href={`/tasks/${task.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 p-4 cursor-pointer ${
            isOverdue(task.dueDate) && task.status !== "completed"
              ? "border-red-200 bg-red-50/50"
              : ""
          }`}
        >
          {/* Task Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              {getStatusIcon(task.status)}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate mb-1">
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(task.priority)}`}
              >
                {task.priority}
              </span>
            </div>
          </div>

          {/* Task Details */}
          <div className="space-y-2 mb-3">
            {task.project && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Project:</span>
                <span className="font-medium text-gray-900">
                  {task.project}
                </span>
              </div>
            )}

            {task.assignee && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Assignee:</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=20&h=20&fit=crop&crop=face`}
                    />
                    <AvatarFallback className="text-xs">
                      {task.assignee.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-900">
                    {task.assignee}
                  </span>
                </div>
              </div>
            )}

            {task.dueDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Due:</span>
                <span
                  className={`font-medium ${
                    isOverdue(task.dueDate) && task.status !== "completed"
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Task Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {task.tags &&
                task.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              {task.tags && task.tags.length > 2 && (
                <span className="text-xs text-gray-400">
                  +{task.tags.length - 2}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {task.estimatedHours && (
                <span className="text-xs text-gray-500">
                  {task.estimatedHours}h
                </span>
              )}
              {isOverdue(task.dueDate) && task.status !== "completed" && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    );
  };

  const renderColumnHeader = (columnId, cardsCount) => {
    const columnConfig = {
      todo: { title: "To Do", color: "border-gray-500", bg: "bg-gray-50" },
      "in-progress": {
        title: "In Progress",
        color: "border-blue-500",
        bg: "bg-blue-50",
      },
      review: {
        title: "Review",
        color: "border-yellow-500",
        bg: "bg-yellow-50",
      },
      completed: {
        title: "Completed",
        color: "border-green-500",
        bg: "bg-green-50",
      },
    };

    const config = columnConfig[columnId] || {
      title: columnId,
      color: "border-gray-500",
      bg: "bg-gray-50",
    };

    return (
      <div
        className={`${config.bg} rounded-xl p-4 mb-4 border-l-4 ${config.color}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm">
            {config.title}
          </h3>
          <span className="bg-white text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
            {cardsCount}
          </span>
        </div>
      </div>
    );
  };

  // Table view component
  const renderTableView = () => {
    const allTasks = Object.values(tasksData).flat();

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allTasks.map((task) => (
                <React.Fragment key={task.id}>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(task.status)}
                        <div className="ml-3 flex-1">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleTaskClick(task)}
                              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                            >
                              {task.title}
                            </button>
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {task.subtasks.length}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {task.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.project}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
                          />
                          <AvatarFallback className="text-xs">
                            {task.assignee.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {task.assignee}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      {isOverdue(task.dueDate) &&
                        task.status !== "completed" && (
                          <div className="text-xs text-red-600">Overdue</div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(task.priority)}`}
                      >
                        {task.status.charAt(0).toUpperCase() +
                          task.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTaskClick(task)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          View Details
                        </button>
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="relative">
                            <button
                              onClick={() => toggleSubtaskExpansion(task.id)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <ChevronDown
                                className={`w-4 h-4 text-gray-400 transition-transform ${expandedSubtasks[task.id] ? "rotate-180" : ""}`}
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {/* Subtask Dropdown */}
                  {task.subtasks &&
                    task.subtasks.length > 0 &&
                    expandedSubtasks[task.id] && (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 bg-gray-50/50">
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-semibold text-gray-900">
                                Subtasks ({task.subtasks.length})
                              </h4>
                              <span className="text-xs text-gray-500">
                                {
                                  task.subtasks.filter((sub) => sub.completed)
                                    .length
                                }{" "}
                                completed
                              </span>
                            </div>
                            <div className="space-y-3">
                              {task.subtasks.map((subtask) => (
                                <div
                                  key={subtask.id}
                                  className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-gray-200/50"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                        subtask.completed
                                          ? "bg-green-500"
                                          : "bg-gray-300"
                                      }`}
                                    >
                                      {subtask.completed ? (
                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                      ) : (
                                        <Circle className="w-3 h-3 text-white" />
                                      )}
                                    </div>
                                    <span
                                      className={`text-sm font-medium ${
                                        subtask.completed
                                          ? "text-gray-500 line-through"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {subtask.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                        subtask.status === "completed"
                                          ? "bg-green-100 text-green-800"
                                          : subtask.status === "in-progress"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {subtask.status === "completed"
                                        ? "Done"
                                        : subtask.status === "in-progress"
                                          ? "In Progress"
                                          : "To Do"}
                                    </span>
                                    <span
                                      className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(subtask.priority)}`}
                                    >
                                      {subtask.priority}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Calendar view component
  const renderCalendarView = () => {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Calendar View
          </h3>
          <p className="text-gray-600">Calendar view coming soon...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="w-full space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Tasks
              </h1>
              <p className="text-gray-600 mt-2">
                Organize and track your team&apos;s tasks
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/80 border border-gray-200/50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
                />
              </div>
              <ModernButton
                type="secondary"
                icon={Filter}
                text="Filter"
                size="sm"
              />
              <ModernButton
                type="primary"
                icon={Plus}
                text="New Task"
                size="sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inProgressTasks}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedTasks}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {overdueTasks}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* View Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Side - View Toggle Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1">
                <button
                  onClick={() => setActiveView("table")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === "table"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <Table className="w-4 h-4" />
                  Table
                </button>
                <button
                  onClick={() => setActiveView("kanban")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === "kanban"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Kanban
                </button>
                <button
                  onClick={() => setActiveView("calendar")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === "calendar"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Calendar
                </button>
              </div>
            </div>

            {/* Right Side - Controls */}
            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              {/* Month Navigation */}
              <button
                onClick={() => handleDateChange("prev")}
                className="flex items-center justify-center w-10 h-10 bg-white/80 border border-gray-200/50 rounded-xl hover:bg-white transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>

              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-xl shadow-sm h-10">
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
                className="flex items-center justify-center w-10 h-10 bg-white/80 border border-gray-200/50 rounded-xl hover:bg-white transition-colors shadow-sm"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {/* Columns Dropdown */}
              <div className="relative" ref={columnsMenuRef}>
                <button
                  onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-xl hover:bg-white transition-colors shadow-sm h-10"
                >
                  <Columns className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Columns
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showColumnsMenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
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
                          className="flex items-center gap-2 p-2 hover:bg-gray-50/50 rounded-lg cursor-pointer"
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
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-xl hover:bg-white transition-colors shadow-sm h-10"
                >
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Filter
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showFilterMenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
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
                          className="w-full px-3 py-2 bg-white/80 border border-gray-200/50 rounded-xl text-sm text-gray-900"
                        >
                          <option value="all">All Status</option>
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="completed">Completed</option>
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
                          className="w-full px-3 py-2 bg-white/80 border border-gray-200/50 rounded-xl text-sm text-gray-900"
                        >
                          <option value="all">All Projects</option>
                          <option value="event-org">
                            Event Organization Website
                          </option>
                          <option value="health-app">
                            Health Mobile App Design
                          </option>
                          <option value="seo-service">
                            Advance SEO Service
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
                          className="w-full px-3 py-2 bg-white/80 border border-gray-200/50 rounded-xl text-sm text-gray-900"
                        >
                          <option value="all">All Assignees</option>
                          <option value="gabrial">Gabrial Matula</option>
                          <option value="layla">Layla Amora</option>
                          <option value="ansel">Ansel Finn</option>
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
                className="flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-xl hover:bg-white transition-colors shadow-sm h-10"
              >
                {dueDateSortOrder === "asc" ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700">Sort</span>
              </button>

              {/* New Task Button */}
              <ModernButton
                type="primary"
                icon={Plus}
                text="New Task"
                size="sm"
                onClick={() => setIsCreateTaskModalOpen(true)}
              />
            </div>
          </div>
        </motion.div>

        {/* Content based on active view */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full"
        >
          {activeView === "table" && renderTableView()}
          {activeView === "kanban" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(tasksData).map(([columnId, tasks]) => (
                  <div key={columnId} className="space-y-4">
                    {renderColumnHeader(columnId, tasks.length)}
                    <div className="space-y-3">
                      {tasks.map((task) => renderTaskCard(task))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeView === "calendar" && renderCalendarView()}
        </motion.div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onTaskCreate={handleTaskCreate}
      />

      {/* Task Detail Sidebar */}
      <TaskDetailSidebar
        isOpen={isTaskDetailOpen}
        onClose={handleTaskDetailClose}
        task={selectedTask}
        isFullView={isTaskDetailFullView}
        onToggleView={handleTaskDetailToggleView}
        onSubtaskUpdate={handleSubtaskUpdate}
      />
    </div>
  );
}
