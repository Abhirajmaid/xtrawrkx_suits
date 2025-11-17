"use client";

import {
  Plus,
  Calendar,
  Columns,
  Filter,
  ChevronUp,
  ChevronDown,
  CheckSquare,
  User,
  Clock,
  Star,
  UserPlus,
  Share,
  MessageSquare,
  Users,
  Table,
  LayoutGrid,
  Paperclip,
  Smile,
  Search,
  MoreVertical,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  getProjectBySlug,
  getChannelsByProjectId,
  getMessagesByChannelId,
  teamMembers,
} from "../../../data/centralData";
import {
  TaskContextMenuProject,
  TaskKanban,
} from "../../../components/projects";
import { TaskDetailModal } from "../../../components/shared";
import { getEnrichedTask } from "../../../data/centralData";
import PageHeader from "../../../components/shared/PageHeader";
import { useRouter } from "next/navigation";

export default function ProjectDetail({ params }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("tasks");
  const [activeView, setActiveView] = useState("table");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // Row dropdown state
  const [rowDropdown, setRowDropdown] = useState({
    isOpen: false,
    taskId: null,
  });

  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    task: null,
  });

  // Task detail modal state
  const [taskDetailModal, setTaskDetailModal] = useState({
    isOpen: false,
    task: null,
  });

  // Drag over state for kanban (unused but kept for future functionality)
  // const [draggedOver, setDraggedOver] = useState(null);

  // Calendar state - Initialize safely for SSR
  const [month, setMonth] = useState(() => {
    if (typeof window !== "undefined") {
      return new Date().getMonth();
    }
    return 0; // Default to January for SSR
  });
  const [year, setYear] = useState(() => {
    if (typeof window !== "undefined") {
      return new Date().getFullYear();
    }
    return 2024; // Default year for SSR
  });

  // Note: Drag and drop functionality can be added in the future

  // Load project data
  useEffect(() => {
    const projectData = getProjectBySlug(params.slug);
    setProject(projectData);

    // Set first channel as selected when project loads
    if (projectData) {
      const channels = getChannelsByProjectId(projectData.id);
      if (channels.length > 0) {
        setSelectedChannel(channels[0]);
      }
    }
  }, [params.slug]);

  // Update to current date on client mount
  useEffect(() => {
    const now = new Date();
    setMonth(now.getMonth());
    setYear(now.getFullYear());
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
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

  // Handle row dropdown toggle (unused but kept for future functionality)
  // const handleRowDropdownToggle = (taskId) => {
  //   setRowDropdown((prev) => ({
  //     isOpen: prev.taskId === taskId ? !prev.isOpen : true,
  //     taskId: taskId,
  //   }));
  // };

  // Handle context menu
  const handleContextMenuOpen = (event, task) => {
    event.preventDefault();
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    setContextMenu({
      isOpen: true,
      position: {
        x: rect.right - 180,
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

  // Task detail handlers
  const handleTaskClick = (task) => {
    console.log("Original task in handleTaskClick:", task);
    console.log("Task ID:", task.id);

    // Get fully enriched task data including subtasks and comments
    const enrichedTaskData = getEnrichedTask(task.id);
    console.log("Enriched task data from getEnrichedTask:", enrichedTaskData);

    // Enrich task with project data for the modal
    const enrichedTask = {
      ...enrichedTaskData,
      id: task.id, // Ensure id is explicitly included
      project: {
        id: project.id,
        name: project.name,
        color: project.color,
        icon: project.icon,
        slug: project.slug,
      },
      hasMultipleAssignees: task.assigneeIds && task.assigneeIds.length > 1,
      time: task.dueTime || null,
    };

    console.log("Final enriched task:", enrichedTask);
    console.log("Enriched task subtasks:", enrichedTask.subtasks);
    console.log("Enriched task comments:", enrichedTask.comments);

    setTaskDetailModal({
      isOpen: true,
      task: enrichedTask,
    });
  };

  const handleTaskDetailClose = () => {
    setTaskDetailModal({
      isOpen: false,
      task: null,
    });
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

  const handleOpenProject = (project) => {
    console.log("Opening project:", project.name);
    // Navigate to project page if needed
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-brand-foreground mb-2">
            Project Not Found
          </h2>
          <p className="text-brand-text-light">
            The requested project could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Calculate project stats based on tasks
  const stats = [
    {
      title: "Total Tasks",
      value: project.stats.totalTasks.toString(),
      change: "+4",
      changeType: "increase",
      icon: CheckSquare,
    },
    {
      title: "Assigned Tasks",
      value: project.stats.assignedTasks.toString(),
      change: "+3",
      changeType: "increase",
      icon: User,
    },
    {
      title: "Incomplete Tasks",
      value: project.stats.incompleteTasks.toString(),
      change: "+2",
      changeType: "increase",
      icon: Clock,
    },
    {
      title: "Completed Tasks",
      value: project.stats.completedTasks.toString(),
      change: "+1",
      changeType: "increase",
      icon: CheckSquare,
    },
    {
      title: "Overdue Tasks",
      value: project.stats.overdueTasks.toString(),
      change: "0",
      changeType: "neutral",
      icon: Clock,
    },
  ];

  const tabs = [
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "members", label: "Members", icon: Users },
    { id: "discussion", label: "Discussion", icon: MessageSquare },
  ];

  const taskViews = [
    { id: "table", label: "Table", icon: Table },
    { id: "kanban", label: "Kanban", icon: LayoutGrid },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ];

  // Function to get status badge colors matching my-task page (unused but kept for future functionality)
  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "In Review":
  //       return "bg-green-100 text-green-700 border-green-200";
  //     case "In Progress":
  //       return "bg-blue-100 text-blue-700 border-blue-200";
  //     case "Done":
  //     case "Completed":
  //       return "bg-green-100 text-green-700 border-green-200";
  //     case "To Do":
  //       return "bg-orange-100 text-orange-700 border-orange-200";
  //     case "Backlog":
  //       return "bg-purple-100 text-purple-700 border-purple-200";
  //     case "Overdue":
  //       return "bg-red-100 text-red-700 border-red-200";
  //     default:
  //       return "bg-gray-100 text-gray-700 border-gray-200";
  //   }
  // };

  // Navigate between months
  const navigateMonth = (direction) => {
    if (direction === "next") {
      if (month === 11) {
        setMonth(0);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    } else {
      if (month === 0) {
        setMonth(11);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    }
  };

  // Note: navigateMonth is available for calendar navigation functionality
  console.log("Calendar navigation available:", {
    month,
    year,
    navigateMonth: !!navigateMonth,
  });

  if (!project) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="p-6">
          <PageHeader
            title="Project"
            subtitle="Loading project..."
            breadcrumb={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Projects", href: "/projects" },
            ]}
            showSearch={false}
            showActions={false}
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Project Header */}
      <div className="p-6">
        <PageHeader
          title={project.name}
          subtitle="Manage project and tasks here"
          breadcrumb={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Projects", href: "/projects" },
            { label: project.name, href: `/projects/${params.slug}` },
          ]}
          showSearch={true}
          showActions={true}
          onAddClick={() => router.push(`/tasks/add?projectId=${project.id}`)}
          actions={[
            {
              icon: Star,
              onClick: () => console.log("Star project"),
            },
            {
              icon: UserPlus,
              onClick: () => console.log("Invite team member"),
              className: "hidden lg:flex",
            },
            {
              icon: Share,
              onClick: () => console.log("Share project"),
              className: "hidden lg:flex",
            },
          ]}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 pb-6 overflow-auto bg-gray-50">
        {/* Project Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="space-y-3">
                {/* Header with title and trend */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 font-medium">
                    {stat.title}
                  </p>
                  <div
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      stat.changeType === "increase"
                        ? "bg-green-50 text-green-600"
                        : stat.changeType === "decrease"
                        ? "bg-red-50 text-red-600"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {stat.changeType === "increase" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : stat.changeType === "decrease" ? (
                      <ArrowDown className="h-3 w-3" />
                    ) : null}
                    <span>{stat.change}</span>
                  </div>
                </div>

                {/* Main value */}
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 pb-4 border-b-2 transition-all duration-300 ${
                        activeTab === tab.id
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Tasks Tab */}
            {activeTab === "tasks" && (
              <div className="space-y-6">
                {/* View Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1 bg-gray-100 border border-gray-200 rounded-lg p-1">
                    {taskViews.map((view) => {
                      const Icon = view.icon;
                      return (
                        <button
                          key={view.id}
                          onClick={() => setActiveView(view.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                            activeView === view.id
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {view.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Date Filter */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        January 2024
                      </span>
                    </div>

                    {/* Columns */}
                    <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">
                      <Columns className="w-4 h-4" />
                      <span className="text-sm">Columns</span>
                    </button>

                    {/* Filter */}
                    <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">
                      <Filter className="w-4 h-4" />
                      <span className="text-sm">Filter</span>
                    </button>

                    {/* Sort */}
                    <button
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                    >
                      <span className="text-sm">Nearest Due Date</span>
                      {sortOrder === "asc" ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>

                    {/* New Task Button */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-sm">
                      <Plus className="w-4 h-4" />
                      New
                    </button>
                  </div>
                </div>

                {/* Content based on active view */}
                {activeView === "table" && (
                  <div className="p-8 text-center text-gray-500">
                    <p>Table view is currently unavailable.</p>
                    <p className="text-sm mt-2">
                      Please use Kanban view instead.
                    </p>
                  </div>
                )}
                {activeView === "kanban" && (
                  <TaskKanban
                    tasks={project?.tasks || []}
                    project={project}
                    onTaskClick={handleTaskClick}
                    onContextMenuOpen={handleContextMenuOpen}
                    onTaskStatusChange={(task, newStatus) => {
                      console.log(`Moving task ${task.name} to ${newStatus}`);
                    }}
                  />
                )}
                {activeView === "calendar" && (
                  <div className="p-8 text-center text-gray-500">
                    <p>Calendar view is currently unavailable.</p>
                    <p className="text-sm mt-2">
                      Please use Kanban view instead.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Members Tab */}
            {activeTab === "members" && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-brand-foreground">
                    Member Assigned
                  </h3>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <ArrowUpDown className="w-4 h-4" />
                      <span className="text-sm font-medium">A-Z</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/80 transition-colors">
                      <UserPlus className="w-4 h-4" />
                      <span className="text-sm font-medium">Invite</span>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Members Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Invited
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              Task Assigned
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              Task Completed
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              Task Incompleted
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              Task Overdue
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {project.team.map((member) => {
                          // Mock task data for each member
                          const taskStats = {
                            assigned: Math.floor(Math.random() * 5) + 1,
                            completed: Math.floor(Math.random() * 3) + 1,
                            incompleted: Math.floor(Math.random() * 2),
                            overdue: Math.floor(Math.random() * 2),
                          };

                          const invitedDate = new Date();
                          invitedDate.setDate(
                            invitedDate.getDate() -
                              Math.floor(Math.random() * 10) +
                              1
                          );

                          return (
                            <tr
                              key={member.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-10 h-10 ${member.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                                  >
                                    {member.avatar}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {member.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {member.email ||
                                        `${member.name
                                          .toLowerCase()
                                          .replace(/\s+/g, "")}@example.com`}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {invitedDate.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                {taskStats.assigned}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                {taskStats.completed}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                {taskStats.incompleted}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                {taskStats.overdue}
                              </td>
                              <td className="px-6 py-4">
                                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{project.team.length} Members</span>
                </div>
              </div>
            )}

            {/* Discussion Tab */}
            {activeTab === "discussion" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Channels List */}
                <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-4">
                  <div className="space-y-4 h-full flex flex-col">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Channel
                      </h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search channel or message"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto">
                      {project &&
                        getChannelsByProjectId(project.id).map((channel) => (
                          <div
                            key={channel.id}
                            onClick={() => setSelectedChannel(channel)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedChannel?.id === channel.id
                                ? "bg-gray-100"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900 text-sm">
                                  {channel.name}
                                </h4>
                                {channel.unreadCount > 0 && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {channel.lastActivity}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 truncate">
                              {channel.lastMessage}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Discussion Area */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 flex flex-col">
                  {selectedChannel ? (
                    <>
                      {/* Header */}
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {selectedChannel.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            <Plus className="w-4 h-4" />
                            <span className="text-sm">Attach Task</span>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {getMessagesByChannelId(selectedChannel.id).map(
                          (message) => {
                            const sender = teamMembers[message.senderId];
                            const isCurrentUser = message.senderId === 1; // Assuming current user is ID 1
                            const messageDate = new Date(message.timestamp);

                            return (
                              <div
                                key={message.id}
                                className={`flex ${
                                  isCurrentUser
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`flex gap-3 max-w-[70%] ${
                                    isCurrentUser
                                      ? "flex-row-reverse"
                                      : "flex-row"
                                  }`}
                                >
                                  {!isCurrentUser && (
                                    <div
                                      className={`w-8 h-8 ${
                                        sender?.color || "bg-gray-500"
                                      } rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                                    >
                                      {sender?.avatar || "U"}
                                    </div>
                                  )}
                                  <div
                                    className={`flex flex-col ${
                                      isCurrentUser
                                        ? "items-end"
                                        : "items-start"
                                    }`}
                                  >
                                    <div
                                      className={`px-4 py-2 rounded-lg ${
                                        isCurrentUser
                                          ? "bg-blue-500 text-white"
                                          : "bg-gray-100 text-gray-900"
                                      }`}
                                    >
                                      <p className="text-sm">
                                        {message.content}
                                      </p>
                                    </div>
                                    <div
                                      className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
                                        isCurrentUser
                                          ? "flex-row-reverse"
                                          : "flex-row"
                                      }`}
                                    >
                                      <span>
                                        {messageDate.toLocaleDateString(
                                          "en-US",
                                          {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                          }
                                        )}
                                      </span>
                                      <span>
                                        {sender?.name || "Unknown User"}
                                      </span>
                                    </div>
                                  </div>
                                  {isCurrentUser && (
                                    <div
                                      className={`w-8 h-8 ${
                                        sender?.color || "bg-gray-500"
                                      } rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                                    >
                                      {sender?.avatar || "U"}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex items-end gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            JB
                          </div>
                          <div className="flex-1">
                            <textarea
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Write a message"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={3}
                            />
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-3">
                                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                  <Plus className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                  <Paperclip className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                  <Smile className="w-4 h-4" />
                                </button>
                              </div>
                              <button
                                onClick={() => {
                                  // Handle send message
                                  setNewMessage("");
                                }}
                                disabled={!newMessage.trim()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                              >
                                Send Message
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          Select a channel to start the discussion
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <TaskContextMenuProject
        isOpen={contextMenu.isOpen}
        onClose={handleContextMenuClose}
        position={contextMenu.position}
        task={contextMenu.task}
        onDelete={(task) => {
          console.log("Delete task:", task.name);
          handleContextMenuClose();
        }}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={taskDetailModal.isOpen}
        onClose={handleTaskDetailClose}
        task={taskDetailModal.task}
        onOpenFullPage={handleOpenFullPage}
        onOpenProject={handleOpenProject}
      />
    </div>
  );
}
