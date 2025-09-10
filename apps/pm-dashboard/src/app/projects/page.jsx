"use client";

import {
  Plus,
  Calendar,
  Filter,
  ChevronDown,
  MoreHorizontal,
  CheckSquare,
  Star,
  Share,
  Search,
  Grid3X3,
  List,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";
import { Card } from "@xtrawrkx/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAllProjects } from "./project-data";

export default function ProjectsPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState("grid");
  
  const projects = getAllProjects();

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Planning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "On Hold":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleProjectClick = (projectSlug) => {
    router.push(`/projects/${projectSlug}`);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card 
          key={project.id} 
          glass={true} 
          className="cursor-pointer hover:scale-105 transition-all duration-300"
          onClick={() => handleProjectClick(project.slug)}
        >
          <div className="p-6">
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${project.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white font-bold text-lg">
                    {project.icon}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-foreground text-lg">
                    {project.name}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                  <Star className="w-4 h-4 text-brand-text-light" />
                </button>
                <button className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-brand-text-light" />
                </button>
              </div>
            </div>

            {/* Project Description */}
            <p className="text-sm text-brand-text-light mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Project Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-brand-foreground">
                  {project.stats.totalTasks}
                </div>
                <div className="text-xs text-brand-text-light">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {project.stats.completedTasks}
                </div>
                <div className="text-xs text-brand-text-light">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {project.stats.overdueTasks}
                </div>
                <div className="text-xs text-brand-text-light">Overdue</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-brand-text-light">Progress</span>
                <span className="font-medium text-brand-foreground">{project.progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Team Members */}
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.team.slice(0, 3).map((member) => (
                  <div
                    key={member.id}
                    className={`w-8 h-8 ${member.color} rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white/50`}
                  >
                    {member.avatar}
                  </div>
                ))}
                {project.team.length > 3 && (
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white/50">
                    +{project.team.length - 3}
                  </div>
                )}
              </div>
              <div className="text-xs text-brand-text-light">
                {project.startDate} - {project.endDate}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-foreground">Projects</h1>
          <p className="text-sm text-brand-text-light">
            Manage and track all your projects
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 text-brand-foreground">
            <Share className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/80 transition-all duration-300">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card glass={true} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-text-light">Total Projects</p>
              <p className="text-2xl font-bold text-brand-foreground">{projects.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
        
        <Card glass={true} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-text-light">Active Projects</p>
              <p className="text-2xl font-bold text-brand-foreground">
                {projects.filter(p => p.status === "In Progress" || p.status === "Active").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
        
        <Card glass={true} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-text-light">Team Members</p>
              <p className="text-2xl font-bold text-brand-foreground">
                {[...new Set(projects.flatMap(p => p.team.map(t => t.id)))].length}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
        
        <Card glass={true} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-text-light">Overdue Tasks</p>
              <p className="text-2xl font-bold text-brand-foreground">
                {projects.reduce((sum, p) => sum + p.stats.overdueTasks, 0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-light" />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-brand-foreground placeholder:text-brand-text-light focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
            <Filter className="w-4 h-4 text-brand-text-light" />
            <span className="text-sm text-brand-foreground">All Status</span>
            <ChevronDown className="w-4 h-4 text-brand-text-light" />
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
            <Calendar className="w-4 h-4 text-brand-text-light" />
            <span className="text-sm text-brand-foreground">This Month</span>
            <ChevronDown className="w-4 h-4 text-brand-text-light" />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
          <button
            onClick={() => setActiveView("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeView === "grid"
                ? "bg-white/25 text-brand-foreground shadow-lg"
                : "text-brand-text-light hover:text-brand-foreground hover:bg-white/10"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            Grid
          </button>
          <button
            onClick={() => setActiveView("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeView === "list"
                ? "bg-white/25 text-brand-foreground shadow-lg"
                : "text-brand-text-light hover:text-brand-foreground hover:bg-white/10"
            }`}
          >
            <List className="w-4 h-4" />
            List
          </button>
        </div>
      </div>

      {/* Projects Content */}
      {renderGridView()}
    </div>
  );
}