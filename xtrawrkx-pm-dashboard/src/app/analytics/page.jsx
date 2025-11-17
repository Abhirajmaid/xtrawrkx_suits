"use client";

import React from "react";
import { Filter, MoreVertical, ArrowUp, ArrowDown } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";

// Error boundary component for charts
// class ChartErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Chart Error:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="h-80 flex items-center justify-center bg-red-50 rounded-lg">
//           <div className="text-center">
//             <p className="text-red-600 font-semibold">Chart Error</p>
//             <p className="text-red-500 text-sm">{this.state.error?.message}</p>
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// Key Metrics Cards Component
const KeyMetricsCards = () => {
  const stats = [
    {
      title: "Total Project",
      value: "7",
      trend: "+2",
      isPositive: true,
      color: "text-blue-600",
    },
    {
      title: "Total Tasks",
      value: "49",
      trend: "+4",
      isPositive: true,
      color: "text-green-600",
    },
    {
      title: "Assigned Tasks",
      value: "12",
      trend: "-3",
      isPositive: false,
      color: "text-orange-600",
    },
    {
      title: "Completed Tasks",
      value: "6",
      trend: "+1",
      isPositive: true,
      color: "text-green-600",
    },
    {
      title: "Overdue Tasks",
      value: "3",
      trend: "+2",
      isPositive: true,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="space-y-3">
            {/* Header with title and trend */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  stat.isPositive
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {stat.isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                <span>{stat.trend}</span>
              </div>
            </div>

            {/* Main value */}
            <div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Upcoming Tasks by Status Chart
const UpcomingTasksByStatus = () => {
  const statusData = [
    { name: "Backlog", value: 25, color: "#FF69B4" },
    { name: "To Do", value: 15, color: "#FF8C00" },
    { name: "In Progress", value: 20, color: "#FFD700" },
    { name: "Done", value: 8, color: "#32CD32" },
    { name: "In Review", value: 12, color: "#90EE90" },
  ];

  const maxValue = Math.max(...statusData.map((d) => d.value));

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
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

      <div className="h-80 flex items-end justify-between space-x-4 pb-4">
        {statusData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-2 flex-1"
          >
            <div
              className="w-full rounded-t-md"
              style={{
                height: `${(item.value / maxValue) * 200}px`,
                backgroundColor: item.color,
                minHeight: "20px",
              }}
            />
            <span className="text-xs text-gray-600 text-center">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tasks by Project Chart
const TasksByProject = () => {
  const projectData = [
    { icon: "⚪", completed: 10, incomplete: 5, maxHeight: 15 },
    { icon: "🟡", completed: 12, incomplete: 8, maxHeight: 20 },
    { icon: "🔵", completed: 18, incomplete: 7, maxHeight: 25 },
    { icon: "🟣", completed: 8, incomplete: 12, maxHeight: 20 },
    { icon: "🟢", completed: 14, incomplete: 6, maxHeight: 20 },
    { icon: "🟠", completed: 16, incomplete: 4, maxHeight: 20 },
    { icon: "⚫", completed: 12, incomplete: 8, maxHeight: 20 },
  ];

  const maxTotal = Math.max(
    ...projectData.map((p) => p.completed + p.incomplete)
  );

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Tasks by Project
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-600">Completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-200 rounded"></div>
              <span className="text-gray-600">Incomplete</span>
            </div>
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
      </div>

      <div className="h-80 flex items-end justify-between space-x-2 pb-4">
        {projectData.map((project, index) => {
          const completedHeight = (project.completed / maxTotal) * 200;
          const incompleteHeight = (project.incomplete / maxTotal) * 200;

          return (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 flex-1"
            >
              <div className="flex flex-col items-center w-full">
                <div
                  className="w-full bg-blue-200 rounded-t-md"
                  style={{
                    height: `${incompleteHeight}px`,
                    minHeight: project.incomplete > 0 ? "10px" : "0px",
                  }}
                />
                <div
                  className="w-full bg-blue-500"
                  style={{
                    height: `${completedHeight}px`,
                    minHeight: project.completed > 0 ? "10px" : "0px",
                  }}
                />
              </div>
              <div className="text-lg">{project.icon}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Task by Assignee Chart
const TaskByAssignee = () => {
  const assigneeData = [
    { avatar: "👩‍💼", name: "JA", value: 12, color: "#3B82F6" },
    { avatar: "🧑‍💼", name: "JC", value: 18, color: "#3B82F6" },
    { avatar: "👨‍💼", name: "TC", value: 8, color: "#3B82F6" },
    { avatar: "👩‍💼", name: "SD", value: 15, color: "#3B82F6" },
    { avatar: "🧑‍💼", name: "MR", value: 6, color: "#3B82F6" },
    { avatar: "👨‍💼", name: "DS", value: 12, color: "#3B82F6" },
    { avatar: "👩‍💼", name: "JW", value: 10, color: "#3B82F6" },
  ];

  const maxValue = Math.max(...assigneeData.map((d) => d.value));

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
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

      <div className="h-80 flex items-end justify-between space-x-2 pb-8">
        {assigneeData.map((assignee, index) => {
          const barHeight = (assignee.value / maxValue) * 180;

          return (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 flex-1"
            >
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mb-1" />
                <div
                  className="w-1 bg-blue-500"
                  style={{
                    height: `${barHeight}px`,
                    minHeight: "20px",
                  }}
                />
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                {assignee.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Task Completion Over Time Chart
const TaskCompletionOverTime = () => {
  const timeData = [
    { name: "Backlog", completed: 10, incomplete: 30 },
    { name: "To Do", completed: 15, incomplete: 25 },
    { name: "In Progress", completed: 25, incomplete: 15 },
    { name: "Done", completed: 35, incomplete: 5 },
    { name: "In Review", completed: 20, incomplete: 20 },
  ];

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Task Completion Over Time
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-600">Completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-200 rounded"></div>
              <span className="text-gray-600">Incomplete</span>
            </div>
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
      </div>

      <div className="h-80 relative">
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400 pr-2">
          <span>40</span>
          <span>30</span>
          <span>20</span>
          <span>10</span>
          <span>0</span>
        </div>

        <div className="ml-8 h-full relative">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            {/* Grid lines */}
            <defs>
              <pattern
                id="grid"
                width="80"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 80 0 L 0 0 0 60"
                  fill="none"
                  stroke="#f0f0f0"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Area chart for incomplete (lighter blue) */}
            <path
              d="M 0,240 L 80,225 L 160,285 L 240,270 L 320,180 L 400,180 L 400,300 L 0,300 Z"
              fill="#BFDBFE"
              opacity="0.6"
            />

            {/* Area chart for completed (darker blue) */}
            <path
              d="M 0,270 L 80,255 L 160,180 L 240,120 L 320,240 L 400,180 L 400,300 L 0,300 Z"
              fill="#3B82F6"
              opacity="0.8"
            />
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            {timeData.map((item, index) => (
              <span key={index} className="text-center">
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Analytics Page Component
export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-6">
        <PageHeader
          title="Analytics"
          subtitle="Analyze and manage your projects and tasks"
          breadcrumb={[{ label: "Dashboard", href: "/dashboard" }, { label: "Analytics", href: "/analytics" }]}
          showSearch={true}
          showActions={true}
          onExportClick={() => console.log("Export analytics")}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 pb-6 overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 lg:px-4">
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
    </div>
  );
}
