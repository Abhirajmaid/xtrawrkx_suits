"use client";

import React from "react";
import {
  Search,
  Filter,
  Settings,
  HelpCircle,
  MoreVertical,
} from "lucide-react";
import { BarChart, AreaChart } from "@xtrawrkx/ui";
import { projects, tasks, teamMembers } from "../../data/centralData";

// Error boundary component for charts
class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Chart Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-80 flex items-center justify-center bg-red-50 rounded-lg">
          <div className="text-center">
            <p className="text-red-600 font-semibold">Chart Error</p>
            <p className="text-red-500 text-sm">{this.state.error?.message}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Analytics Header Component
const AnalyticsHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Analyze and manage your projects and tasks
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search anything"
            className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
            ⌘F
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>

        {/* User Avatar */}
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          JB
        </div>
      </div>
    </div>
  );
};

// Key Metrics Cards Component
const KeyMetricsCards = () => {
  // Calculate actual data from central data
  const totalProjects = Object.keys(projects).length;
  const totalTasks = Object.keys(tasks).length;
  const completedTasks = Object.values(tasks).filter(
    (task) => task.status === "Done"
  ).length;
  const assignedTasks = Object.values(tasks).filter(
    (task) => task.assigneeId || task.assigneeIds
  ).length;

  // Calculate overdue tasks
  const today = new Date();
  const overdueTasks = Object.values(tasks).filter((task) => {
    const dueDate = new Date(task.dueDate);
    return (
      dueDate < today && task.status !== "Done" && task.status !== "Completed"
    );
  }).length;

  const stats = [
    {
      title: "Total Project",
      value: totalProjects.toString(),
      change: "+2",
      changeType: "increase",
      color: "text-blue-600",
    },
    {
      title: "Total Tasks",
      value: totalTasks.toString(),
      change: "+4",
      changeType: "increase",
      color: "text-green-600",
    },
    {
      title: "Assigned Tasks",
      value: assignedTasks.toString(),
      change: "-3",
      changeType: "decrease",
      color: "text-orange-600",
    },
    {
      title: "Completed Tasks",
      value: completedTasks.toString(),
      change: "+1",
      changeType: "increase",
      color: "text-green-600",
    },
    {
      title: "Overdue Tasks",
      value: overdueTasks.toString(),
      change: "+2",
      changeType: "increase",
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  stat.changeType === "increase"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <span className="text-xs">
                  {stat.changeType === "increase" ? "↗" : "↘"}
                </span>
                <span>{stat.change}</span>
              </div>
            </div>
            <div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Upcoming Tasks by Status Chart
const UpcomingTasksByStatus = () => {
  // Calculate actual task counts by status
  const taskCounts = Object.values(tasks).reduce((acc, task) => {
    const status = task.status;
    if (!acc[status]) {
      acc[status] = 0;
    }
    acc[status]++;
    return acc;
  }, {});

  // Create data array with all statuses that have tasks
  const data = Object.entries(taskCounts)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: status,
      value: count,
    }));

  // Use real data with fallback
  const safeData = data.length > 0 ? data : [{ name: "No Data", value: 0 }];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Upcoming Tasks by Status
        </h3>
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Filter className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-80">
        {/* Beautiful Chart Alternative */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg h-full">
          <h4 className="text-lg font-semibold text-gray-800 mb-6">
            Task Status Distribution
          </h4>
          <div className="space-y-4">
            {safeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.name === "In Progress"
                        ? "bg-yellow-500"
                        : item.name === "Done"
                          ? "bg-green-500"
                          : item.name === "To Do"
                            ? "bg-blue-500"
                            : item.name === "In Review"
                              ? "bg-purple-500"
                              : "bg-gray-500"
                    }`}
                  ></div>
                  <span className="font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.name === "In Progress"
                          ? "bg-yellow-500"
                          : item.name === "Done"
                            ? "bg-green-500"
                            : item.name === "To Do"
                              ? "bg-blue-500"
                              : item.name === "In Review"
                                ? "bg-purple-500"
                                : "bg-gray-500"
                      }`}
                      style={{
                        width: `${Math.min((item.value / Math.max(...safeData.map((d) => d.value))) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xl font-bold text-gray-900 w-8 text-right">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tasks by Project Chart
const TasksByProject = () => {
  // Calculate actual task counts by project
  const projectTaskCounts = Object.values(tasks).reduce((acc, task) => {
    const projectId = task.projectId;
    if (!acc[projectId]) {
      acc[projectId] = { completed: 0, incomplete: 0 };
    }

    if (task.status === "Done" || task.status === "Completed") {
      acc[projectId].completed++;
    } else {
      acc[projectId].incomplete++;
    }

    return acc;
  }, {});

  const data = Object.values(projects)
    .map((project) => ({
      name: project.icon,
      completed: projectTaskCounts[project.id]?.completed || 0,
      incomplete: projectTaskCounts[project.id]?.incomplete || 0,
      projectName: project.name,
      color: project.color.includes("blue")
        ? "#3B82F6"
        : project.color.includes("yellow")
          ? "#F59E0B"
          : project.color.includes("purple")
            ? "#8B5CF6"
            : project.color.includes("pink")
              ? "#EC4899"
              : project.color.includes("green")
                ? "#10B981"
                : project.color.includes("orange")
                  ? "#F97316"
                  : "#6B7280",
    }))
    .filter((project) => project.completed + project.incomplete > 0); // Only show projects with tasks

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Tasks by Project
        </h3>
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Filter className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-80">
        {data.length > 0 ? (
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-lg h-full">
            <h4 className="text-lg font-semibold text-gray-800 mb-6">
              Project Progress
            </h4>
            <div className="space-y-4">
              {data.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        {project.name}
                      </div>
                      <span className="font-medium text-gray-700">
                        {project.projectName}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {project.completed + project.incomplete} tasks
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="flex h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500"
                        style={{
                          width: `${(project.completed / (project.completed + project.incomplete)) * 100}%`,
                        }}
                      ></div>
                      <div
                        className="bg-gray-400"
                        style={{
                          width: `${(project.incomplete / (project.completed + project.incomplete)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{project.completed} completed</span>
                    <span>{project.incomplete} remaining</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No project data available
          </div>
        )}
      </div>
    </div>
  );
};

// Task by Assignee Chart
const TaskByAssignee = () => {
  // Calculate actual task counts by assignee
  const assigneeTaskCounts = Object.values(tasks).reduce((acc, task) => {
    if (task.assigneeId) {
      if (!acc[task.assigneeId]) {
        acc[task.assigneeId] = 0;
      }
      acc[task.assigneeId]++;
    } else if (task.assigneeIds) {
      task.assigneeIds.forEach((assigneeId) => {
        if (!acc[assigneeId]) {
          acc[assigneeId] = 0;
        }
        acc[assigneeId]++;
      });
    }
    return acc;
  }, {});

  const data = Object.values(teamMembers)
    .filter((member) => assigneeTaskCounts[member.id])
    .map((member) => ({
      name: member.avatar,
      value: assigneeTaskCounts[member.id] || 0,
      avatar: member.avatar,
      hasProfilePic:
        member.name === "Jane Cooper" ||
        member.name === "Sarah Wilson" ||
        member.name === "Darrell Steward",
    }));

  // If no data, show empty state
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded">
              Yellow Branding
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Task by Assignee
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Filter className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center text-gray-500">
          No assigned tasks found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded">
            Yellow Branding
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Task by Assignee
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Filter className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-80">
        <BarChart
          data={data}
          bars={[{ dataKey: "value", color: "#3B82F6", name: "Tasks" }]}
          height={300}
          showLegend={false}
        />
      </div>
    </div>
  );
};

// Task Completion Over Time Chart
const TaskCompletionOverTime = () => {
  // Calculate completion data by status
  const statusData = Object.values(tasks).reduce((acc, task) => {
    const status = task.status;
    if (!acc[status]) {
      acc[status] = { completed: 0, incomplete: 0 };
    }

    if (task.status === "Done" || task.status === "Completed") {
      acc[status].completed++;
    } else {
      acc[status].incomplete++;
    }

    return acc;
  }, {});

  const data = [
    {
      name: "Backlog",
      completed: statusData["Backlog"]?.completed || 0,
      incomplete: statusData["Backlog"]?.incomplete || 0,
    },
    {
      name: "To Do",
      completed: statusData["To Do"]?.completed || 0,
      incomplete: statusData["To Do"]?.incomplete || 0,
    },
    {
      name: "In Progress",
      completed: statusData["In Progress"]?.completed || 0,
      incomplete: statusData["In Progress"]?.incomplete || 0,
    },
    {
      name: "Done",
      completed: statusData["Done"]?.completed || 0,
      incomplete: statusData["Done"]?.incomplete || 0,
    },
    {
      name: "In Review",
      completed: statusData["In Review"]?.completed || 0,
      incomplete: statusData["In Review"]?.incomplete || 0,
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Task Completion Over Time
        </h3>
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Filter className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-80">
        {data.length > 0 ? (
          <AreaChart
            data={data}
            dataKey="completed"
            color="#3B82F6"
            height={300}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No completion data available
          </div>
        )}
      </div>
    </div>
  );
};

// Main Analytics Page Component
export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnalyticsHeader />

        {/* Key Metrics Cards */}
        <KeyMetricsCards />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Row */}
          <UpcomingTasksByStatus />
          <TasksByProject />

          {/* Bottom Row */}
          <TaskByAssignee />
          <TaskCompletionOverTime />
        </div>
      </div>
    </div>
  );
}
