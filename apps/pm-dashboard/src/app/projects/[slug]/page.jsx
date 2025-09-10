"use client";

import {
  Plus,
  Calendar,
  Columns,
  Filter,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  CheckSquare,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
  UserPlus,
  Share,
  MessageSquare,
  Users,
  Table,
  LayoutGrid,
  Send,
  Paperclip,
  Smile,
  Attachment,
  Search,
} from "lucide-react";
import { Card } from "@xtrawrkx/ui";
import { useState, useEffect } from "react";
import { getProjectBySlug } from "../project-data";

import { 
  useProjectSpecificKanbanDragDrop, 
  getProjectSpecificDropZoneClass, 
  getProjectSpecificTaskCardClass,
  getTaskStatusColor,
  getPriorityColor 
} from "../project-specific-drag-drop";

export default function ProjectDetail({ params }) {
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("tasks");
  const [activeView, setActiveView] = useState("table");
  const [sortOrder, setSortOrder] = useState("asc");
  
  // Calendar state - Initialize safely for SSR
  const [month, setMonth] = useState(() => {
    if (typeof window !== 'undefined') {
      return new Date().getMonth();
    }
    return 0; // Default to January for SSR
  });
  const [year, setYear] = useState(() => {
    if (typeof window !== 'undefined') {
      return new Date().getFullYear();
    }
    return 2024; // Default year for SSR
  });

  // Initialize drag and drop functionality - ALWAYS call hooks
  const {
    tasks: draggableTasks,
    draggedTask,
    draggedOverColumn,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    getKanbanColumns
  } = useProjectSpecificKanbanDragDrop(params.slug, project?.tasks || []);

  // Load project data
  useEffect(() => {
    const projectData = getProjectBySlug(params.slug);
    setProject(projectData);
  }, [params.slug]);

  // Update to current date on client mount
  useEffect(() => {
    const now = new Date();
    setMonth(now.getMonth());
    setYear(now.getFullYear());
  }, []);



  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-brand-foreground mb-2">Project Not Found</h2>
          <p className="text-brand-text-light">The requested project could not be found.</p>
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
  ];

  const taskViews = [
    { id: "table", label: "Table", icon: Table },
    { id: "kanban", label: "Kanban", icon: LayoutGrid },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ];



  const renderTableView = () => (
    <Card glass={true} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-brand-primary bg-white/10 border-white/20 rounded focus:ring-brand-primary focus:ring-2"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-brand-text-light uppercase tracking-wider">
                Task Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-brand-text-light uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-brand-text-light uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-brand-text-light uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-brand-text-light uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-4 text-left">
                {/* Empty header for actions */}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {((draggableTasks && draggableTasks.length > 0) ? draggableTasks : (project?.tasks || [])).map((task) => (
              <tr
                key={task.id}
                className="hover:bg-white/5 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-brand-primary bg-white/10 border-white/20 rounded focus:ring-brand-primary focus:ring-2"
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-brand-foreground">
                    {task.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {task.assignee.charAt(0)}
                    </div>
                    <span className="text-sm text-brand-foreground">
                      {task.assignee}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-brand-foreground">
                    {task.dueDate}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded border ${getTaskStatusColor(task.status)}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/20 rounded-full h-2">
                      <div
                        className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-brand-foreground font-medium">
                      {task.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="p-1 hover:bg-white/10 rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-brand-text-light" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-white/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-brand-text-light">
            Showing 1 to {draggableTasks.length} of {draggableTasks.length} results
          </span>
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
    const kanbanColumns = getKanbanColumns();
    
    // Fallback: if kanban columns are empty, create them from project tasks
    const tasksToUse = (draggableTasks && draggableTasks.length > 0) ? draggableTasks : (project?.tasks || []);
    const fallbackColumns = {
      "Backlog": {
        tasks: tasksToUse.filter(task => task.status === "Backlog"),
        color: "bg-gray-400"
      },
      "To Do": {
        tasks: tasksToUse.filter(task => task.status === "To Do"),
        color: "bg-blue-400"
      },
      "In Progress": {
        tasks: tasksToUse.filter(task => task.status === "In Progress"),
        color: "bg-yellow-400"
      },
      "Completed": {
        tasks: tasksToUse.filter(task => task.status === "Completed" || task.status === "Done"),
        color: "bg-green-400"
      }
    };
    
    // Use kanban columns if they have data, otherwise use fallback
    const columnsToRender = Object.values(kanbanColumns).some(col => col.tasks.length > 0) ? kanbanColumns : fallbackColumns;

    return (
      <div className="grid grid-cols-4 gap-6">
        {Object.entries(columnsToRender).map(([columnTitle, column]) => (
          <div 
            key={columnTitle} 
            className={getProjectSpecificDropZoneClass(columnTitle, draggedOverColumn, draggedTask)}
            onDragOver={(e) => handleDragOver(e, columnTitle)}
            onDragEnter={(e) => handleDragEnter(e, columnTitle)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, columnTitle)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                <h3 className="font-medium text-brand-foreground">{columnTitle}</h3>
                <span className="text-sm text-brand-text-light">{column.tasks.length}</span>
              </div>
              <button className="p-1 hover:bg-gray-200 rounded">
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className={getProjectSpecificTaskCardClass(task, draggedTask)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-800 text-sm leading-tight">{task.name}</h4>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {task.assignee.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-600">{task.assignee}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{task.dueDate}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full bg-blue-500"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">Progress</span>
                      <span className="text-xs text-gray-700 font-medium">{task.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add task
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };



  // Navigate between months
  const navigateMonth = (direction) => {
    if (direction === 'next') {
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

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const tasksToUse = (draggableTasks && draggableTasks.length > 0) ? draggableTasks : (project?.tasks || []);
    return tasksToUse.filter(task => {
      if (!task.dueDate) return false;
      // Convert task due date to YYYY-MM-DD format
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };

  const renderCalendarView = () => {
    // Generate calendar days
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const startCalendar = new Date(startDate);
    startCalendar.setDate(startCalendar.getDate() - startDate.getDay());
    
    const days = [];
    const currentDate = new Date(startCalendar);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
      <Card glass={true}>
        <div className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-brand-text-light" />
              </button>
              <h2 className="text-lg font-semibold text-brand-foreground">
                {monthNames[month]} {year}
              </h2>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-brand-text-light" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-brand-text-light">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {days.map((date, index) => {
              const isCurrentMonth = date.getMonth() === month;
              const isToday = date.toDateString() === new Date().toDateString();
              const dayTasks = getTasksForDate(date);
              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border border-white/10 rounded-lg ${
                    isCurrentMonth ? 'bg-white/5' : 'bg-white/2'
                  } ${isToday ? 'ring-2 ring-brand-primary' : ''} hover:bg-white/10 transition-colors relative group`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isCurrentMonth ? 'text-brand-foreground' : 'text-brand-text-muted'
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  {/* Tasks for this date */}
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map(task => (
                      <div
                        key={task.id}
                        className={`p-2 rounded-lg border-l-4 ${getTaskStatusColor(task.status)} bg-white/10 backdrop-blur-sm text-xs`}
                      >
                        <div className="font-medium text-brand-foreground truncate">
                          {task.name}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-4 h-4 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white text-xs">
                            {task.assignee ? task.assignee.charAt(0) : 'U'}
                          </div>
                          <span className={`text-xs px-1 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Show More link for dates with more than 2 tasks */}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-brand-primary hover:text-brand-secondary cursor-pointer">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                    
                    {/* Add task button for empty dates */}
                    {dayTasks.length === 0 && isCurrentMonth && (
                      <button className="w-full p-1 border border-dashed border-white/20 rounded text-xs text-brand-text-light hover:border-brand-primary hover:text-brand-primary transition-colors opacity-0 group-hover:opacity-100">
                        + Add task
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 bg-gradient-to-br ${project.color} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {project.icon}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-brand-foreground">
              {project.name}
            </h1>
            <p className="text-sm text-brand-text-light">
              Manage project and tasks here
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 text-brand-text-light hover:text-brand-foreground transition-colors">
            <Star className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 text-brand-foreground">
            <UserPlus className="w-4 h-4" />
            Invite
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/80 transition-all duration-300">
            <Share className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} glass={true} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-light">{stat.title}</p>
                <p className="text-2xl font-bold text-brand-foreground">{stat.value}</p>
              </div>
              <div className={`text-sm ${stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card glass={true}>
        <div className="border-b border-white/20">
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
                        ? "border-brand-primary text-brand-primary"
                        : "border-transparent text-brand-text-light hover:text-brand-foreground"
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
                <div className="flex space-x-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
                  {taskViews.map((view) => {
                    const Icon = view.icon;
                    return (
                      <button
                        key={view.id}
                        onClick={() => setActiveView(view.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          activeView === view.id
                            ? "bg-white/25 text-brand-foreground shadow-lg"
                            : "text-brand-text-light hover:text-brand-foreground hover:bg-white/10"
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
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
                    <Calendar className="w-4 h-4 text-brand-text-light" />
                    <span className="text-sm text-brand-foreground">January 2024</span>
                  </div>

                  {/* Columns */}
                  <button className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-brand-foreground hover:bg-white/20 transition-colors">
                    <Columns className="w-4 h-4" />
                    <span className="text-sm">Columns</span>
                  </button>

                  {/* Filter */}
                  <button className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-brand-foreground hover:bg-white/20 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filter</span>
                  </button>

                  {/* Sort */}
                  <button 
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-brand-foreground hover:bg-white/20 transition-colors"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    <span className="text-sm">Nearest Due Date</span>
                    {sortOrder === "asc" ? (
                      <ChevronUp className="w-4 h-4 text-brand-text-light" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-brand-text-light" />
                    )}
                  </button>

                  {/* New Task Button */}
                  <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl font-medium transition-all duration-300 shadow-lg">
                    <Plus className="w-4 h-4" />
                    New
                  </button>
                </div>
              </div>

              {/* Content based on active view */}
              {activeView === "table" && renderTableView()}
              {activeView === "kanban" && renderKanbanView()}
              {activeView === "calendar" && renderCalendarView()}
            </div>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-brand-foreground">Team Members</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/80 transition-all duration-300">
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.team.map((member) => (
                  <Card key={member.id} glass={true} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${member.color} rounded-full flex items-center justify-center text-white font-bold`}>
                        {member.avatar}
                      </div>
                      <div>
                        <h4 className="font-medium text-brand-foreground">{member.name}</h4>
                        <p className="text-sm text-brand-text-light">{member.role}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Simple Chat Section - Placeholder */}
          {activeTab === "chat" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Channels List */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-brand-foreground">Channel</h3>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-light" />
                    <input
                      type="text"
                      placeholder="Search channel or message"
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-brand-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>

                  <div className="space-y-2">
                    {[].map((discussion) => (
                      <div
                        key={discussion.id}
                        className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-brand-foreground text-sm">{discussion.name}</h4>
                          <span className="text-xs text-brand-text-light">{discussion.lastActivity}</span>
                        </div>
                        <p className="text-xs text-brand-text-light truncate">{discussion.preview}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-2">
                <div className="flex flex-col h-96">
                  <div className="flex items-center justify-between p-4 border-b border-white/20">
                    <h3 className="text-lg font-medium text-brand-foreground">Design Discussion</h3>
                    <button className="flex items-center gap-2 px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/80 transition-colors">
                      <Attachment className="w-4 h-4" />
                      Attach Task
                    </button>
                  </div>

                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {[].map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                          {!message.isOwn && (
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                {message.avatar}
                              </div>
                              <span className="text-xs text-brand-text-light">{message.user}</span>
                              <span className="text-xs text-brand-text-light">{message.timestamp}</span>
                            </div>
                          )}
                          <div className={`rounded-lg p-3 ${
                            message.isOwn 
                              ? 'bg-brand-primary text-white' 
                              : 'bg-white/10 text-brand-foreground'
                          }`}>
                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                          </div>
                          {message.isOwn && (
                            <div className="text-right mt-1">
                              <span className="text-xs text-brand-text-light">{message.timestamp} Jonathan Bustos</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        JB
                      </div>
                      <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-lg p-2">
                        <input
                          type="text"
                          placeholder="Write a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1 bg-transparent outline-none text-brand-foreground placeholder-brand-text-light"
                        />
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Paperclip className="w-4 h-4 text-brand-text-light" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Smile className="w-4 h-4 text-brand-text-light" />
                        </button>
                      </div>
                      <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/80 transition-colors">
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}