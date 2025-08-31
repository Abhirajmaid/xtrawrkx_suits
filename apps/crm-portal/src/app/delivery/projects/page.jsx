"use client";

import { useState } from "react";
import {
  Container,
  PageHeader,
  Card,
  Badge,
  Avatar,
  StatCard,
  BarChart,
  Tabs,
  EmptyState,
} from "@xtrawrkx/ui";
import {
  Plus,
  Search,
  Filter,
  FolderOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  MoreVertical,
  GitBranch,
  Layers,
  Target,
  Activity,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("grid");

  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      client: "Tech Solutions Inc",
      status: "In Progress",
      priority: "High",
      progress: 65,
      budget: 85000,
      spent: 55250,
      startDate: "2024-10-01",
      endDate: "2024-12-31",
      team: ["John Smith", "Emily Davis", "Michael Chen"],
      tasks: { total: 48, completed: 31 },
      milestones: { total: 4, completed: 2 },
      health: "Good",
      description: "Complete redesign of corporate website with new branding",
    },
    {
      id: 2,
      name: "Mobile App Development",
      client: "StartUp Hub",
      status: "In Progress",
      priority: "Critical",
      progress: 45,
      budget: 120000,
      spent: 54000,
      startDate: "2024-09-15",
      endDate: "2025-01-15",
      team: ["Sarah Wilson", "Robert Martinez", "Lisa Anderson"],
      tasks: { total: 82, completed: 37 },
      milestones: { total: 6, completed: 2 },
      health: "At Risk",
      description:
        "Native iOS and Android app development for e-commerce platform",
    },
    {
      id: 3,
      name: "Cloud Migration",
      client: "Global Enterprises",
      status: "Planning",
      priority: "Medium",
      progress: 15,
      budget: 200000,
      spent: 30000,
      startDate: "2024-12-01",
      endDate: "2025-03-31",
      team: ["John Smith", "Emily Davis"],
      tasks: { total: 64, completed: 10 },
      milestones: { total: 5, completed: 0 },
      health: "Good",
      description: "Migrate on-premise infrastructure to AWS cloud",
    },
    {
      id: 4,
      name: "CRM Implementation",
      client: "Innovation Labs",
      status: "Completed",
      priority: "High",
      progress: 100,
      budget: 65000,
      spent: 62000,
      startDate: "2024-08-01",
      endDate: "2024-11-15",
      team: ["Emily Davis", "Michael Chen"],
      tasks: { total: 36, completed: 36 },
      milestones: { total: 3, completed: 3 },
      health: "Excellent",
      description: "Implementation of custom CRM solution",
    },
    {
      id: 5,
      name: "Data Analytics Platform",
      client: "Digital Marketing Pro",
      status: "In Progress",
      priority: "High",
      progress: 80,
      budget: 95000,
      spent: 76000,
      startDate: "2024-09-01",
      endDate: "2024-12-15",
      team: ["Robert Martinez", "Sarah Wilson"],
      tasks: { total: 52, completed: 42 },
      milestones: { total: 4, completed: 3 },
      health: "Good",
      description: "Build real-time analytics dashboard for marketing data",
    },
    {
      id: 6,
      name: "Security Audit",
      client: "Tech Solutions Inc",
      status: "On Hold",
      priority: "Low",
      progress: 30,
      budget: 25000,
      spent: 7500,
      startDate: "2024-11-01",
      endDate: "2024-12-31",
      team: ["Lisa Anderson"],
      tasks: { total: 20, completed: 6 },
      milestones: { total: 2, completed: 0 },
      health: "At Risk",
      description: "Comprehensive security audit and penetration testing",
    },
  ];

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

  const chartData = [
    {
      name: "Planning",
      value: projects.filter((p) => p.status === "Planning").length,
    },
    {
      name: "In Progress",
      value: projects.filter((p) => p.status === "In Progress").length,
    },
    {
      name: "Completed",
      value: projects.filter((p) => p.status === "Completed").length,
    },
    {
      name: "On Hold",
      value: projects.filter((p) => p.status === "On Hold").length,
    },
  ];

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const activeProjects = projects.filter(
    (p) => p.status === "In Progress"
  ).length;

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <Filter className="w-4 h-4" />
        Filter
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
        <Plus className="w-4 h-4" />
        New Project
      </button>
    </div>
  );

  const tabItems = [
    { key: "all", label: "All Projects", badge: projects.length },
    { key: "active", label: "Active", badge: activeProjects },
    {
      key: "completed",
      label: "Completed",
      badge: projects.filter((p) => p.status === "Completed").length,
    },
    {
      key: "on-hold",
      label: "On Hold",
      badge: projects.filter((p) => p.status === "On Hold").length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Projects"
        subtitle="Manage and track all your projects"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Delivery" },
          { label: "Projects" },
        ]}
        actions={headerActions}
      />

      <Container className="py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Projects"
            value={projects.length}
            subtitle="All time"
            icon={FolderOpen}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Active Projects"
            value={activeProjects}
            change="+2"
            changeType="increase"
            icon={Activity}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="Total Budget"
            value={`$${(totalBudget / 1000).toFixed(0)}K`}
            icon={DollarSign}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            title="Budget Utilized"
            value={`${Math.round((totalSpent / totalBudget) * 100)}%`}
            subtitle={`$${(totalSpent / 1000).toFixed(0)}K spent`}
            icon={TrendingUp}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
          />
        </div>

        {/* Project Status Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card title="Project Status Distribution" className="lg:col-span-2">
            <BarChart
              data={chartData}
              bars={[{ dataKey: "value", color: "#3B82F6" }]}
              height={250}
              showLegend={false}
            />
          </Card>

          {/* Recent Milestones */}
          <Card title="Recent Milestones">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Phase 1 Complete
                  </p>
                  <p className="text-xs text-gray-500">CRM Implementation</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Design Review
                  </p>
                  <p className="text-xs text-gray-500">
                    Website Redesign - Due in 3 days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Deployment Delayed
                  </p>
                  <p className="text-xs text-gray-500">
                    Mobile App - 5 days overdue
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* View Toggle and Tabs */}
        <div className="flex items-center justify-between mb-4">
          <Tabs tabs={tabItems} defaultTab="all" variant="line" />
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView("grid")}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                activeView === "grid"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setActiveView("kanban")}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                activeView === "kanban"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Kanban View
            </button>
            <button
              onClick={() => setActiveView("gantt")}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                activeView === "gantt"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Gantt View
            </button>
          </div>
        </div>

        {/* Projects Grid/Kanban */}
        {activeView === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="cursor-pointer" hoverable>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(project.status)} size="sm">
                      {project.status}
                    </Badge>
                    <Badge variant={getHealthColor(project.health)} size="sm">
                      {project.health}
                    </Badge>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{project.client}</p>
                <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tasks & Milestones */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                      <CheckCircle className="w-3 h-3" />
                      Tasks
                    </div>
                    <div className="text-sm font-semibold">
                      {project.tasks.completed}/{project.tasks.total}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                      <Target className="w-3 h-3" />
                      Milestones
                    </div>
                    <div className="text-sm font-semibold">
                      {project.milestones.completed}/{project.milestones.total}
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="text-sm font-semibold">
                      ${(project.budget / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Spent</p>
                    <p className="text-sm font-semibold">
                      ${(project.spent / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>

                {/* Team */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, idx) => (
                      <Avatar key={idx} name={member} size="xs" />
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(project.endDate), "MMM dd")}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : activeView === "kanban" ? (
          <div className="text-center py-12">
            <EmptyState
              icon={Layers}
              title="Kanban View"
              description="Kanban board view is coming soon"
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <EmptyState
              icon={GitBranch}
              title="Gantt View"
              description="Gantt chart view is coming soon"
            />
          </div>
        )}
      </Container>
    </div>
  );
}
