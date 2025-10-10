"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "../../../../../../../../components/ui";
import {
  FolderOpen,
  Calendar,
  User,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Users,
  Target,
  BarChart3,
  ExternalLink,
} from "lucide-react";

export default function ClientProjects({ clientId }) {
  const [selectedFilters, setSelectedFilters] = useState({
    status: "all",
    priority: "all",
    manager: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock projects data - replace with actual API calls
  const projects = [
    {
      id: 1,
      name: "CRM Implementation & Training",
      status: "in-progress",
      priority: "high",
      progress: 65,
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      manager: "John Smith",
      team: ["Jane Doe", "Mike Johnson", "Sarah Wilson"],
      budget: 50000,
      spent: 32500,
      description: "Complete CRM implementation with custom integrations and comprehensive training program.",
      tags: ["crm", "implementation", "training"],
      milestones: [
        { name: "System Setup", completed: true, dueDate: "2024-01-15" },
        { name: "Data Migration", completed: true, dueDate: "2024-01-30" },
        { name: "Custom Integrations", completed: false, dueDate: "2024-02-15" },
        { name: "User Training", completed: false, dueDate: "2024-02-28" },
        { name: "Go Live", completed: false, dueDate: "2024-03-15" },
      ],
      lastActivity: "2024-01-15",
      clientPortal: {
        enabled: true,
        lastAccess: "2024-01-14",
        documentsShared: 12,
        ticketsSubmitted: 3,
        url: "https://portal.xtrawrkx.com/projects/1",
      },
      riskLevel: "low",
      healthScore: 85,
    },
    {
      id: 2,
      name: "Marketing Automation Setup",
      status: "planning",
      priority: "medium",
      progress: 25,
      startDate: "2024-02-01",
      endDate: "2024-04-30",
      manager: "Jane Doe",
      team: ["Mike Johnson", "Alex Brown"],
      budget: 25000,
      spent: 0,
      description: "Set up marketing automation platform with email campaigns, lead scoring, and analytics.",
      tags: ["marketing", "automation", "email"],
      milestones: [
        { name: "Requirements Gathering", completed: true, dueDate: "2024-01-31" },
        { name: "Platform Setup", completed: false, dueDate: "2024-02-15" },
        { name: "Campaign Creation", completed: false, dueDate: "2024-03-01" },
        { name: "Testing & Optimization", completed: false, dueDate: "2024-03-31" },
        { name: "Launch", completed: false, dueDate: "2024-04-15" },
      ],
      lastActivity: "2024-01-12",
      clientPortal: {
        enabled: true,
        lastAccess: "2024-01-10",
        documentsShared: 5,
        ticketsSubmitted: 1,
        url: "https://portal.xtrawrkx.com/projects/2",
      },
      riskLevel: "medium",
      healthScore: 72,
    },
    {
      id: 3,
      name: "Q1 Support & Maintenance",
      status: "completed",
      priority: "low",
      progress: 100,
      startDate: "2023-10-01",
      endDate: "2023-12-31",
      manager: "Mike Johnson",
      team: ["Sarah Wilson", "Tom Davis"],
      budget: 15000,
      spent: 14200,
      description: "Quarterly support and maintenance package with regular check-ins and system updates.",
      tags: ["support", "maintenance", "quarterly"],
      milestones: [
        { name: "Initial Setup", completed: true, dueDate: "2023-10-15" },
        { name: "Monthly Check-ins", completed: true, dueDate: "2023-11-15" },
        { name: "System Updates", completed: true, dueDate: "2023-12-15" },
        { name: "Final Report", completed: true, dueDate: "2023-12-31" },
      ],
      lastActivity: "2023-12-31",
      clientPortal: {
        enabled: true,
        lastAccess: "2023-12-28",
        documentsShared: 8,
        ticketsSubmitted: 12,
        url: "https://portal.xtrawrkx.com/projects/3",
      },
      riskLevel: "low",
      healthScore: 95,
    },
  ];

  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "planning", label: "Planning" },
    { value: "in-progress", label: "In Progress" },
    { value: "on-hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const priorities = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const managers = [
    { value: "all", label: "All Managers" },
    { value: "John Smith", label: "John Smith" },
    { value: "Jane Doe", label: "Jane Doe" },
    { value: "Mike Johnson", label: "Mike Johnson" },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      planning: { color: "badge-warning", label: "Planning", icon: Target },
      "in-progress": { color: "badge-primary", label: "In Progress", icon: Play },
      "on-hold": { color: "badge-gray", label: "On Hold", icon: Pause },
      completed: { color: "badge-success", label: "Completed", icon: CheckCircle },
      cancelled: { color: "badge-error", label: "Cancelled", icon: AlertCircle },
    };
    
    const config = statusConfig[status] || statusConfig.planning;
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: "badge-error", label: "High" },
      medium: { color: "badge-warning", label: "Medium" },
      low: { color: "badge-success", label: "Low" },
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskLevelBadge = (risk) => {
    const riskConfig = {
      low: { color: "badge-success", label: "Low Risk" },
      medium: { color: "badge-warning", label: "Medium Risk" },
      high: { color: "badge-error", label: "High Risk" },
    };
    
    const config = riskConfig[risk] || riskConfig.low;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(dateString);
  };

  const filteredProjects = projects.filter((project) => {
    // Status filter
    if (selectedFilters.status !== "all" && project.status !== selectedFilters.status) {
      return false;
    }

    // Priority filter
    if (selectedFilters.priority !== "all" && project.priority !== selectedFilters.priority) {
      return false;
    }

    // Manager filter
    if (selectedFilters.manager !== "all" && project.manager !== selectedFilters.manager) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        project.name,
        project.description,
        project.manager,
        ...project.tags,
        ...project.team,
      ].join(" ").toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const totalBudget = filteredProjects.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = filteredProjects.reduce((sum, project) => sum + project.spent, 0);
  const activeProjects = filteredProjects.filter(project => project.status === "in-progress").length;
  const completedProjects = filteredProjects.filter(project => project.status === "completed").length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Client Projects</h3>
          <p className="text-sm text-gray-600">
            Projects synced from Client Portal (Module 3)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="btn-primary">
            <span>Create Project</span>
            <div className="btn-icon">
              <Plus className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Budget</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalBudget)}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Spent</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalSpent)}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Active</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{activeProjects}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Completed</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{completedProjects}</div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedFilters.status}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                className="input py-2"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={selectedFilters.priority}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="input py-2"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manager
              </label>
              <select
                value={selectedFilters.manager}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, manager: e.target.value }))}
                className="input py-2"
              >
                {managers.map((manager) => (
                  <option key={manager.value} value={manager.value}>
                    {manager.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4 py-2 w-full max-w-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-brand-primary transition-colors"
                  >
                    {project.name}
                  </Link>
                  {getStatusBadge(project.status)}
                  {getPriorityBadge(project.priority)}
                  {getRiskLevelBadge(project.riskLevel)}
                </div>

                <p className="text-gray-600 mb-4">{project.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Budget</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(project.budget)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Spent: {formatCurrency(project.spent)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Timeline</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Team</div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900">
                        {project.team.length} members
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Health Score</div>
                    <div className={`text-sm font-semibold ${getHealthScoreColor(project.healthScore)}`}>
                      {project.healthScore}/100
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Milestones</div>
                  <div className="flex flex-wrap gap-2">
                    {project.milestones.slice(0, 3).map((milestone, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          milestone.completed
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {milestone.completed ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {milestone.name}
                      </div>
                    ))}
                    {project.milestones.length > 3 && (
                      <div className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{project.milestones.length - 3} more
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} className="badge-gray text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Client Portal Info */}
                {project.clientPortal.enabled && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Client Portal</span>
                      </div>
                      <a
                        href={project.clientPortal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span>View Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-blue-800">
                      <div>Documents: {project.clientPortal.documentsShared}</div>
                      <div>Tickets: {project.clientPortal.ticketsSubmitted}</div>
                      <div>Last Access: {formatRelativeTime(project.clientPortal.lastAccess)}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{project.manager}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Started {formatRelativeTime(project.startDate)}</span>
                    </div>
                  </div>
                  <span>Last activity: {formatRelativeTime(project.lastActivity)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/projects/${project.id}`}
                  className="p-2 text-gray-400 hover:text-brand-primary transition-colors"
                  title="View Project"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  className="p-2 text-gray-400 hover:text-brand-primary transition-colors"
                  title="Edit Project"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="More actions"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedFilters.status !== "all" || selectedFilters.priority !== "all" || selectedFilters.manager !== "all"
              ? "Try adjusting your filters or search terms"
              : "No projects associated with this client yet"
            }
          </p>
          <button className="btn-primary">
            <span>Create First Project</span>
            <div className="btn-icon">
              <Plus className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

