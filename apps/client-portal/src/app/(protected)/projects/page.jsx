"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FolderOpen,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  MoreVertical,
  Grid3X3,
  Columns,
  BarChart3,
  Activity,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";

// Projects data
const projectsData = [
  {
    id: 1,
    name: "Event Organization Website",
    client: "EventPro Inc",
    status: "In Progress",
    progress: 75,
    priority: "High",
    health: "Good",
    budget: 15000,
    spent: 11250,
    endDate: "2024-03-15",
    team: [
      {
        name: "Gabrial Matula",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      },
      {
        name: "Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b47e?w=32&h=32&fit=crop&crop=face",
      },
    ],
    hourlyRate: 40,
    totalSpend: 3700,
    daysLeft: 15,
    documentsSubmitted: 2,
  },
  {
    id: 2,
    name: "Health Mobile App Design",
    client: "HealthTech Solutions",
    status: "Planning",
    progress: 25,
    priority: "Medium",
    health: "Excellent",
    budget: 25000,
    spent: 5000,
    endDate: "2024-04-20",
    team: [
      {
        name: "Layla Amora",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b47e?w=32&h=32&fit=crop&crop=face",
      },
    ],
    hourlyRate: 40,
    totalSpend: 2500,
    daysLeft: 45,
    documentsSubmitted: 3,
  },
  {
    id: 3,
    name: "Advance SEO Service",
    client: "Digital Marketing Co",
    status: "Completed",
    progress: 100,
    priority: "Low",
    health: "Good",
    budget: 8000,
    spent: 7500,
    endDate: "2024-02-10",
    team: [
      {
        name: "Ansel Finn",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      },
    ],
    hourlyRate: 20,
    totalSpend: 1500,
    daysLeft: 0,
    documentsSubmitted: 4,
  },
  {
    id: 4,
    name: "E-commerce Platform",
    client: "Retail Solutions",
    status: "In Progress",
    progress: 60,
    priority: "High",
    health: "At Risk",
    budget: 30000,
    spent: 18000,
    endDate: "2024-05-30",
    team: [
      {
        name: "Mike Chen",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      },
      {
        name: "Lisa Brown",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b47e?w=32&h=32&fit=crop&crop=face",
      },
    ],
    hourlyRate: 50,
    totalSpend: 8500,
    daysLeft: 90,
    documentsSubmitted: 5,
  },
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("grid");
  const [activeTab, setActiveTab] = useState("all");

  // Filter projects based on active tab
  const getFilteredProjects = () => {
    let filtered = projectsData;

    if (activeTab !== "all") {
      filtered = filtered.filter((project) => {
        switch (activeTab) {
          case "active":
            return (
              project.status === "In Progress" || project.status === "Planning"
            );
          case "completed":
            return project.status === "Completed";
          case "on-hold":
            return project.status === "On Hold";
          default:
            return true;
        }
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.client.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredProjects = getFilteredProjects();

  // Calculate stats
  const projectStats = {
    total: projectsData.length,
    active: projectsData.filter(
      (p) => p.status === "In Progress" || p.status === "Planning"
    ).length,
    completed: projectsData.filter((p) => p.status === "Completed").length,
    onHold: projectsData.filter((p) => p.status === "On Hold").length,
    totalBudget: projectsData.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projectsData.reduce((sum, p) => sum + p.spent, 0),
  };

  const getStatusColor = (status) => {
    const colors = {
      Planning: "bg-blue-100 text-blue-700 border-blue-200",
      "In Progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
      Completed: "bg-green-100 text-green-700 border-green-200",
      "On Hold": "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getHealthColor = (health) => {
    const colors = {
      Excellent: "bg-green-100 text-green-700",
      Good: "bg-blue-100 text-blue-700",
      "At Risk": "bg-yellow-100 text-yellow-700",
      Critical: "bg-red-100 text-red-700",
    };
    return colors[health] || "bg-gray-100 text-gray-700";
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
                Projects
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and track all your projects
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
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
                text="New Project"
                size="sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Projects
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {projectStats.total}
                </p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-blue-600" />
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
                <p className="text-sm text-gray-600 font-medium">
                  Active Projects
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {projectStats.active}
                </p>
                <p className="text-xs text-green-600 mt-1">+2 this month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-600" />
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
                <p className="text-sm text-gray-600 font-medium">
                  Total Budget
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(projectStats.totalBudget / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-gray-500 mt-1">Allocated</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
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
                <p className="text-sm text-gray-600 font-medium">
                  Budget Utilized
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    (projectStats.totalSpent / projectStats.totalBudget) * 100
                  )}
                  %
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ${(projectStats.totalSpent / 1000).toFixed(0)}K spent
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Status Filters & View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                {
                  key: "all",
                  label: "All Projects",
                  count: projectStats.total,
                },
                { key: "active", label: "Active", count: projectStats.active },
                {
                  key: "completed",
                  label: "Completed",
                  count: projectStats.completed,
                },
                {
                  key: "on-hold",
                  label: "On Hold",
                  count: projectStats.onHold,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                      : "bg-white/80 text-gray-700 hover:bg-white border border-gray-200/50 backdrop-blur-sm"
                  }`}
                >
                  {tab.label}
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-lg">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1">
              <button
                onClick={() => setActiveView("grid")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === "grid"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setActiveView("kanban")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === "kanban"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Columns className="w-4 h-4" />
                Kanban
              </button>
              <button
                onClick={() => setActiveView("gantt")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === "gantt"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Gantt
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content Views */}
        {activeView === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 p-6 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate text-lg">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {project.client}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{project.team.length} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        ${(project.spent / 1000).toFixed(0)}K / $
                        {(project.budget / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${getHealthColor(project.health)}`}
                    >
                      {project.health}
                    </div>
                    <button
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        {activeView === "kanban" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="text-center py-12">
              <Columns className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Kanban View
              </h3>
              <p className="text-gray-600">Kanban board view coming soon...</p>
            </div>
          </div>
        )}

        {activeView === "gantt" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gantt View
              </h3>
              <p className="text-gray-600">Gantt chart view coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
