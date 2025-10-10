"use client";

import { useState } from "react";
import {
  Container,
  Card,
  Badge,
  Avatar,
  StatCard,
  BarChart,
  EmptyState,
} from "../../../../../../../../../components/ui";
import {
  FolderOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  MoreVertical,
  Grid3X3,
  Columns,
  BarChart3,
  Target,
  Activity,
} from "lucide-react";
import { PageHeader } from "../../../components/layout";
import { format } from "date-fns";
import { 
  projectsData as initialProjectsData, 
  getProjectsByStatus, 
  getProjectStats, 
  searchProjects, 
  filterProjects 
} from "../../../lib/data/projectsData";
import { 
  ProjectKanbanView, 
  ProjectGanttView, 
  ProjectFilterModal, 
  NewProjectModal 
} from "../../../components/projects";

export default function ProjectsPage() {
  const [projectsData, setProjectsData] = useState(initialProjectsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    client: "",
    priority: "",
    health: "",
    minBudget: "",
    maxBudget: "",
  });

  // Get filtered projects
  const getFilteredProjects = () => {
    let filtered = getProjectsByStatus(activeTab);
    filtered = searchProjects(filtered, searchQuery);
    filtered = filterProjects(filtered, filters);
    return filtered;
  };

  const filteredProjects = getFilteredProjects();
  const projectStats = getProjectStats(projectsData);

  // Handler functions
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsFilterModalOpen(false);
  };

  const handleAddProject = (newProject) => {
    setProjectsData([...projectsData, newProject]);
    setIsNewProjectModalOpen(false);
  };

  const handleProjectMove = (project, newStage) => {
    setProjectsData(prev => 
      prev.map(p => p.id === project.id ? { ...p, stage: newStage } : p)
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      Planning: "info",
      "In Progress": "warning",
      Completed: "success",
      "On Hold": "danger",
      Cancelled: "default",
    };
    return colors[status] || "default";
  };

  const getHealthColor = (health) => {
    const colors = {
      Excellent: "success",
      Good: "info",
      "At Risk": "warning",
      Critical: "danger",
    };
    return colors[health] || "default";
  };

  const getPriorityIcon = (priority) => {
    const colors = {
      Critical: "text-red-500",
      High: "text-orange-500",
      Medium: "text-yellow-500",
      Low: "text-green-500",
    };
    return colors[priority] || "text-gray-500";
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <PageHeader
        title="Projects"
        subtitle="Manage and track all your projects"
        breadcrumbs={['Dashboard', 'Delivery', 'Projects']}
        actions={['filter', 'new']}
        searchPlaceholder="Search projects..."
        onSearch={setSearchQuery}
        onFilter={() => setIsFilterModalOpen(true)}
        onNew={() => setIsNewProjectModalOpen(true)}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Projects"
          value={projectStats.total}
          subtitle="All time"
          icon={FolderOpen}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Projects"
          value={projectStats.active}
          change="+2"
          changeType="increase"
          icon={Activity}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Total Budget"
          value={`$${(projectStats.totalBudget / 1000).toFixed(0)}K`}
          icon={DollarSign}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Budget Utilized"
          value={`${Math.round((projectStats.totalSpent / projectStats.totalBudget) * 100)}%`}
          subtitle={`$${(projectStats.totalSpent / 1000).toFixed(0)}K spent`}
          icon={TrendingUp}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      {/* Status Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2">
          {[
            { key: "all", label: "All Projects", count: projectStats.total },
            { key: "active", label: "Active", count: projectStats.active },
            { key: "completed", label: "Completed", count: projectStats.completed },
            { key: "on-hold", label: "On Hold", count: projectStats.onHold }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab.label}
              <Badge variant="secondary" className="text-xs">
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>

        {/* Professional View Toggle */}
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setActiveView("grid")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === "grid"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            Grid
          </button>
          <button
            onClick={() => setActiveView("kanban")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === "kanban"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Columns className="w-4 h-4" />
            Kanban
          </button>
          <button
            onClick={() => setActiveView("gantt")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === "gantt"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Gantt
          </button>
        </div>
      </div>

      {/* Content Views */}
      {activeView === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{project.client}</p>
                </div>
                <Badge className={getPriorityIcon(project.priority)}>
                  {project.priority}
                </Badge>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(project.endDate), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{project.team.length} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>${(project.spent / 1000).toFixed(0)}K / ${(project.budget / 1000).toFixed(0)}K</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <Badge variant={getHealthColor(project.health)}>
                    {project.health}
                  </Badge>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeView === "kanban" && (
        <div className="w-full">
        <ProjectKanbanView
          projects={filteredProjects}
          onProjectMove={handleProjectMove}
          onAddProject={() => setIsNewProjectModalOpen(true)}
        />
        </div>
      )}

      {activeView === "gantt" && (
        <ProjectGanttView projects={filteredProjects} />
      )}

      {/* Modals */}
      <ProjectFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        filters={filters}
        setFilters={setFilters}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onAddProject={handleAddProject}
      />
    </div>
  );
}