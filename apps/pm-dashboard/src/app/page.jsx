"use client";

import {
  Plus,
  FolderOpen,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  Eye,
  User,
  MoreHorizontal,
  Activity,
} from "lucide-react";
import { StatCard, Card, Badge } from "@xtrawrkx/ui";

export default function Home() {
  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Projects",
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
      change: "+3",
      changeType: "increase",
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
      changeType: "decrease",
      icon: AlertTriangle,
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

  const projects = [
    {
      id: 1,
      name: "Yellow Branding",
      tasksCount: "1 task due soon",
      color: "from-yellow-400 to-yellow-600",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    {
      id: 2,
      name: "Mogo Web Design",
      tasksCount: "no task",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
    {
      id: 3,
      name: "Futurework",
      tasksCount: "7 task due soon",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      id: 4,
      name: "Resto Dashboard",
      tasksCount: "4 task due soon",
      color: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-100",
      textColor: "text-pink-800",
    },
    {
      id: 5,
      name: "Hajime Illustration",
      tasksCount: "3 task due soon",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
    },
    {
      id: 6,
      name: "Carl UI/UX",
      tasksCount: "no task",
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
    },
    {
      id: 7,
      name: "The Run Branding",
      tasksCount: "no task",
      color: "from-teal-400 to-teal-600",
      bgColor: "bg-teal-100",
      textColor: "text-teal-800",
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Marc Atension",
      initials: "MA",
      email: "marchin@gmail.com",
    },
    {
      id: 2,
      name: "Susan Drake",
      initials: "SD",
      email: "contact@susandrak...",
    },
    {
      id: 3,
      name: "Ronald Richards",
      initials: "RR",
      email: "ronald.richard@gmail...",
    },
    {
      id: 4,
      name: "Jane Cooper",
      initials: "JC",
      email: "jane.cooper@example.com",
    },
    {
      id: 5,
      name: "Ian Warren",
      initials: "IW",
      email: "ian.warren@company.com",
    },
    {
      id: 6,
      name: "Darrell Steward",
      initials: "DS",
      email: "darrell@example.com",
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Tasks (Left Column) */}
        <div className="lg:col-span-1">
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
            <div className="space-y-4">
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

        {/* Projects Grid (Right 2 Columns) */}
        <div className="lg:col-span-2">
          <Card
            glass={true}
            title="Projects"
            actions={
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-brand-foreground rounded-xl hover:bg-white/30 hover:border-white/40 transition-all duration-300 shadow-lg">
                <Plus className="w-4 h-4" />
                New Project
              </button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 bg-white/15 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-card group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${project.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded-lg transition-all">
                      <MoreHorizontal className="w-4 h-4 text-brand-text-light" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-brand-foreground mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-brand-text-light">
                    {project.tasksCount}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* People Section */}
        <Card
          glass={true}
          title="People (17)"
          subtitle="Frequent Collaborators"
          actions={
            <button className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-brand-foreground rounded-lg hover:bg-white/30 hover:border-white/40 transition-all duration-300">
              <Plus className="w-4 h-4" />
            </button>
          }
        >
          <div className="grid grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center p-3 bg-white/15 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-card"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white font-bold text-sm mb-2">
                  {member.initials}
                </div>
                <p className="font-medium text-brand-foreground text-sm text-center">
                  {member.name}
                </p>
                <p className="text-xs text-brand-text-light text-center truncate w-full">
                  {member.email}
                </p>
              </div>
            ))}
          </div>
        </Card>

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
      </div>

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
              <p className="text-sm text-brand-text-light">0/6 Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-white/20 rounded-full h-2">
              <div className="w-0 bg-gradient-to-r from-brand-primary to-brand-secondary h-2 rounded-full"></div>
            </div>
            <span className="text-sm text-brand-text-light">0%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
