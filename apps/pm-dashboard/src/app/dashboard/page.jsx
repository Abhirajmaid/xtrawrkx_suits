"use client";

import {
  FolderOpen,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  Eye,
  User,
  Activity,
  MoreHorizontal,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Card } from "@xtrawrkx/ui";

export default function Home() {
  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Project",
      value: "7",
      change: "+2",
      changeType: "increase",
      icon: FolderOpen,
    },
    {
      title: "Total Tasks",
      value: "49",
      change: "+4",
      changeType: "increase",
      icon: ClipboardList,
    },
    {
      title: "Assigned Tasks",
      value: "12",
      change: "-3",
      changeType: "decrease",
      icon: User,
    },
    {
      title: "Completed Tasks",
      value: "6",
      change: "+1",
      changeType: "increase",
      icon: CheckCircle,
    },
    {
      title: "Overdue Tasks",
      value: "3",
      change: "+2",
      changeType: "increase",
      icon: AlertTriangle,
    },
  ];

  // Today Tasks data matching the uploaded image design
  const todayTasks = [
    {
      id: 1,
      title: "Delivery App Kit",
      description: "We got a project to make a delivery ui kit called Foodnow...",
      progress: 65,
      teamMembers: [
        { id: 1, avatar: "MA", color: "bg-orange-500" },
        { id: 2, avatar: "SD", color: "bg-blue-500" },
        { id: 3, avatar: "RR", color: "bg-green-500" },
        { id: 4, avatar: "JC", color: "bg-purple-500" },
      ],
      extraMembers: 2,
    },
    {
      id: 2,
      title: "Dribbble Shot",
      description: "Make a dribbble shot with a project management theme...",
      progress: 80,
      teamMembers: [
        { id: 1, avatar: "IW", color: "bg-red-500" },
        { id: 2, avatar: "DS", color: "bg-blue-600" },
        { id: 3, avatar: "AB", color: "bg-green-600" },
      ],
      extraMembers: 1,
    },
  ];

  const assignedTasks = [
    {
      id: 1,
      title: "Web Mockup",
      project: "Yellow Branding",
      dueDate: "Due in 20 hours",
      priority: "high",
      status: "in_progress",
    },
    {
      id: 2,
      title: "Carl Landing Page",
      project: "Carl UI/UX",
      dueDate: "Due in 3 days",
      priority: "medium",
      status: "pending",
    },
    {
      id: 3,
      title: "POS UI/UX",
      project: "Resto Dashboard",
      dueDate: "Due in 1 week",
      priority: "low",
      status: "review",
    },
  ];



  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "review":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Combined Top Section - KPIs and Today Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - KPIs and Today Tasks */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-3 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${stat.changeType === 'increase' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-brand-foreground">{stat.value}</h3>
                <p className="text-xs text-brand-text-light">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Today Tasks Section */}
          <Card glass={true}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-brand-foreground">Today Tasks</h2>
              </div>
              <button className="flex items-center gap-1 text-sm text-brand-text-light hover:text-brand-primary transition-colors">
                See All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/20 transition-all duration-300 shadow-card"
                >
                  {/* Task Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-brand-foreground text-base">
                      {task.title}
                    </h3>
                    <button className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-brand-text-light" />
                    </button>
                  </div>
                  
                  {/* Task Description */}
                  <p className="text-sm text-brand-text-light mb-4 line-clamp-2">
                    {task.description}
                  </p>
                  
                  {/* Team Members */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center -space-x-2">
                      {task.teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className={`w-8 h-8 ${member.color} rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white/50`}
                        >
                          {member.avatar}
                        </div>
                      ))}
                      {task.extraMembers > 0 && (
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white/50">
                          {task.extraMembers}+
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-brand-foreground">
                      {task.progress}%
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Task Progress */}
        <div className="lg:col-span-1">
          <Card glass={true} title="Task Progress" className="h-full">
            <div className="space-y-4">
              {/* Progress Ring */}
              <div className="flex items-center justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(6/49) * 251.2} 251.2`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-brand-foreground">12%</span>
                  </div>
                </div>
              </div>
              
              {/* Progress Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-brand-text-light">Completed</span>
                  <span className="text-sm font-semibold text-green-600">6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-brand-text-light">In Progress</span>
                  <span className="text-sm font-semibold text-blue-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-brand-text-light">Pending</span>
                  <span className="text-sm font-semibold text-gray-600">31</span>
                </div>
                <div className="w-full h-px bg-white/20 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-brand-foreground">Total Tasks</span>
                  <span className="text-sm font-bold text-brand-foreground">49</span>
                </div>
              </div>
              
              {/* Keep it up message */}
              <div className="text-center pt-2">
                <p className="text-xs text-brand-text-light italic">Keep it up! 💪</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content - Assigned Tasks */}
      <div className="grid grid-cols-1 gap-6">
        <Card
          glass={true}
          title="Assigned Tasks"
          subtitle="Newest Due Date"
          actions={
            <button className="text-brand-text-light hover:text-brand-primary transition-colors">
              Show All
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-white/15 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-brand-primary rounded-full"></div>
                  <div>
                    <p className="font-semibold text-brand-foreground">
                      {task.title}
                    </p>
                    <p className="text-sm text-brand-text-light">
                      {task.project}
                    </p>
                    <p className="text-xs text-brand-text-muted">
                      {task.dueDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-brand-text-light" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Private Notepad */}
      <Card
        glass={true}
        title="Private Notepad"
        actions={
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <MoreHorizontal className="w-4 h-4 text-brand-text-light" />
          </button>
        }
      >
        <div className="bg-white/15 rounded-xl border border-white/20 backdrop-blur-sm p-4 min-h-[200px]">
          <textarea
            placeholder="Write down anything here..."
            className="w-full h-full bg-transparent border-none outline-none resize-none text-brand-foreground placeholder:text-brand-text-light"
            rows={8}
          />
        </div>
        {/* Text formatting toolbar */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <span className="font-bold text-brand-text-light">B</span>
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <span className="italic text-brand-text-light">I</span>
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <span className="underline text-brand-text-light">U</span>
          </button>
          <div className="w-px h-4 bg-white/20 mx-1"></div>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <span className="text-brand-text-light">•</span>
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <span className="text-brand-text-light">1.</span>
          </button>
        </div>
      </Card>

      {/* Get Started Progress Section */}
      <Card glass={true}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-foreground">
                Get Started
              </h3>
              <p className="text-sm text-brand-text-light">5/6 Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-white/20 rounded-full h-2">
              <div className="w-5/6 bg-gradient-to-r from-brand-primary to-brand-secondary h-2 rounded-full"></div>
            </div>
            <span className="text-sm text-brand-text-light">83%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
