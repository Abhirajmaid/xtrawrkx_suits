"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  Clock,
  Calendar,
  CheckSquare,
  AlertCircle,
  Eye,
  FolderOpen,
  TrendingUp,
  Users,
  User,
  X,
  Search,
  UserPlus,
  UserMinus,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ProjectsKPIs,
  ProjectsTabs,
  ProjectsListView,
} from "../../components/projects";
import PageHeader from "../../components/shared/PageHeader";
import { Card } from "../../components/ui";
import projectService from "../../lib/projectService";
import { transformProject, transformStatusToStrapi } from "../../lib/dataTransformers";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../lib/apiClient";
import confetti from "canvas-confetti";

// Local utility function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ProjectsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // State management
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [activeView, setActiveView] = useState("list");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamModal, setTeamModal] = useState({ isOpen: false, project: null });
  const [allUsers, setAllUsers] = useState([]);

  const exportDropdownRef = useRef(null);

  // Load users for team management
  const loadUsers = async () => {
    try {
      const usersResponse = await apiClient.get("/api/xtrawrkx-users", {
        "pagination[pageSize]": 100,
        populate: "primaryRole,userRoles,department",
        "filters[isActive][$eq]": "true",
      });

      let usersData = [];
      if (usersResponse?.data && Array.isArray(usersResponse.data)) {
        usersData = usersResponse.data;
      } else if (Array.isArray(usersResponse)) {
        usersData = usersResponse;
      }

      const transformedUsers = usersData
        .filter((user) => user && user.id)
        .map((user) => {
          const userData = user.attributes || user;
          const firstName = userData.firstName || "";
          const lastName = userData.lastName || "";
          const email = userData.email || "";
          const name = `${firstName} ${lastName}`.trim() || email || "Unknown User";

          return {
            id: user.id,
            firstName,
            lastName,
            email,
            name,
          };
        });

      console.log("Loaded users for team management:", transformedUsers.length);
      setAllUsers(transformedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      setAllUsers([]);
    }
  };

  // Load projects from API
  useEffect(() => {
    // Don't load if auth is still loading
    if (authLoading) {
      return;
    }

    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load projects
        const projectsResponse = await projectService
          .getAllProjects({
            pageSize: 100,
            populate: ["projectManager", "teamMembers", "tasks"],
          })
          .catch((err) => {
            console.error("Error fetching projects:", err);
            return { data: [] };
          });

        // Transform projects
        const transformedProjects =
          projectsResponse.data?.map(transformProject) || [];

        setProjects(transformedProjects);
      } catch (error) {
        console.error("Error loading projects:", error);
        const errorMessage =
          error?.response?.data?.error?.message ||
          error?.message ||
          "Failed to load projects. Please try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
    loadUsers();
  }, [authLoading]);

  // Calculate project statistics
  const getProjectStats = () => {
    const stats = {
      all: projects.length,
      planning: 0,
      active: 0,
      "in-progress": 0,
      completed: 0,
      "on-hold": 0,
      overdue: 0,
    };

    const now = new Date();
    projects.forEach((project) => {
      const status = project.status?.toLowerCase().replace(/\s+/g, "-") || "";
      if (status === "planning") stats.planning++;
      else if (status === "active") stats.active++;
      else if (status === "in-progress") stats["in-progress"]++;
      else if (status === "completed") stats.completed++;
      else if (status === "on-hold") stats["on-hold"]++;

      // Check for overdue
      if (
        project.endDate &&
        new Date(project.endDate) < now &&
        status !== "completed"
      ) {
        stats.overdue++;
      }
    });

    return stats;
  };

  const projectStats = getProjectStats();

  // Status statistics for KPIs
  const statusStats = [
    {
      label: "Active",
      count: projectStats.active + projectStats["in-progress"],
      color: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      icon: TrendingUp,
    },
    {
      label: "Planning",
      count: projectStats.planning,
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
      icon: Clock,
    },
    {
      label: "Completed",
      count: projectStats.completed,
      color: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      icon: CheckCircle,
    },
    {
      label: "Overdue",
      count: projectStats.overdue,
      color: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      icon: AlertCircle,
    },
  ];

  // Tab items for navigation
  const tabItems = [
    { key: "all", label: "All Projects", badge: projectStats.all.toString() },
    {
      key: "active",
      label: "Active",
      badge: (projectStats.active + projectStats["in-progress"]).toString(),
    },
    {
      key: "planning",
      label: "Planning",
      badge: projectStats.planning.toString(),
    },
    {
      key: "completed",
      label: "Completed",
      badge: projectStats.completed.toString(),
    },
    { key: "on-hold", label: "On Hold", badge: projectStats["on-hold"].toString() },
    { key: "overdue", label: "Overdue", badge: projectStats.overdue.toString() },
  ];

  // Filter projects based on search and active tab
  const filteredProjects = projects.filter((project) => {
    if (!project) return false;

    const matchesSearch =
      searchQuery === "" ||
      (project.name &&
        project.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.description &&
        project.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // Handle tab filtering
    const projectStatus = project.status?.toLowerCase().replace(/\s+/g, "-") || "";
    const matchesTab =
      activeTab === "all" ||
      projectStatus === activeTab ||
      (activeTab === "active" &&
        (projectStatus === "active" || projectStatus === "in-progress")) ||
      (activeTab === "overdue" &&
        project.endDate &&
        new Date(project.endDate) < new Date() &&
        projectStatus !== "completed");

    return matchesSearch && matchesTab;
  });

  // Table columns configuration
  const projectColumnsTable = [
    {
      key: "name",
      label: "PROJECT NAME",
      render: (_, project) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${project.color || "from-blue-400 to-blue-600"} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
          >
            <span className="text-white font-bold text-sm">
              {project.icon || project.name?.charAt(0)?.toUpperCase() || "P"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate">
              {project.name}
            </div>
            {project.description && (
              <div className="text-xs text-gray-500 truncate">
                {project.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (_, project) => {
        const statusOptions = [
          { value: "Planning", label: "Planning" },
          { value: "Active", label: "Active" },
          { value: "In Progress", label: "In Progress" },
          { value: "Completed", label: "Completed" },
          { value: "On Hold", label: "On Hold" },
          { value: "Cancelled", label: "Cancelled" },
        ];

        const currentStatus = project.status || "Planning";
        const status = currentStatus?.toLowerCase().replace(/\s+/g, "-") || "";

        const statusColors = {
          planning: {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            border: "border-yellow-400",
          },
          active: {
            bg: "bg-blue-100",
            text: "text-blue-800",
            border: "border-blue-400",
          },
          "in-progress": {
            bg: "bg-blue-100",
            text: "text-blue-800",
            border: "border-blue-400",
          },
          completed: {
            bg: "bg-green-100",
            text: "text-green-800",
            border: "border-green-400",
          },
          "on-hold": {
            bg: "bg-red-100",
            text: "text-red-800",
            border: "border-red-400",
          },
          cancelled: {
            bg: "bg-gray-100",
            text: "text-gray-800",
            border: "border-gray-400",
          },
        };

        const colors = statusColors[status] || {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-400",
        };

        return (
          <div className="min-w-[140px]" onClick={(e) => e.stopPropagation()}>
            <select
              value={currentStatus}
              onChange={(e) => {
                e.stopPropagation();
                handleStatusUpdate(project.id, e.target.value);
              }}
              className={`w-full ${colors.bg} ${colors.text} ${colors.border} border-2 rounded-lg px-3 py-2 font-bold text-xs text-center shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "0.75rem 0.75rem",
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      },
    },
    {
      key: "projectLead",
      label: "PROJECT LEAD",
      render: (_, project) => {
        const projectManager = project.projectManager;
        const currentUserId = projectManager?.id?.toString() || "";
        const name =
          projectManager?.name ||
          (projectManager?.firstName && projectManager?.lastName
            ? `${projectManager.firstName} ${projectManager.lastName}`
            : projectManager?.firstName ||
              projectManager?.lastName ||
              "Unassigned");
        const initial = name?.charAt(0)?.toUpperCase() || "U";

        return (
          <div className="min-w-[180px]" onClick={(e) => e.stopPropagation()}>
            <select
              value={currentUserId}
              onChange={(e) => {
                e.stopPropagation();
                handleProjectLeadUpdate(project.id, e.target.value);
              }}
              className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer appearance-none transition-all duration-200"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "0.75rem 0.75rem",
                paddingRight: "2.5rem",
              }}
            >
              <option value="">Unassigned</option>
              {allUsers.map((user) => (
                <option key={user.id} value={user.id.toString()}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        );
      },
    },
    {
      key: "progress",
      label: "PROGRESS",
      render: (_, project) => (
        <div className="min-w-[150px]">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900">
              {project.progress || 0}%
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "team",
      label: "TEAM",
      render: (_, project) => {
        const teamMembers = project.teamMembers || [];
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTeamModal({ isOpen: true, project });
            }}
            className="flex items-center gap-2 min-w-[140px] hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors text-left"
          >
            {teamMembers.length > 0 ? (
              <div className="flex items-center gap-1">
                {teamMembers.slice(0, 3).map((member, index) => {
                  const name =
                    member?.name ||
                    (member?.firstName && member?.lastName
                      ? `${member.firstName} ${member.lastName}`
                      : member?.firstName || member?.lastName || "Unknown");
                  const initial = name?.charAt(0)?.toUpperCase() || "U";
                  return (
                    <div
                      key={member?.id || index}
                      className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0 border border-white"
                      title={name}
                      style={{
                        marginLeft: index > 0 ? "-4px" : "0",
                        zIndex: 10 - index,
                      }}
                    >
                      {initial}
                    </div>
                  );
                })}
                {teamMembers.length > 3 && (
                  <div
                    className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 flex-shrink-0 border border-white"
                    title={`${teamMembers.length - 3} more`}
                    style={{ marginLeft: "-4px", zIndex: 7 }}
                  >
                    +{teamMembers.length - 3}
                  </div>
                )}
                <span className="text-sm text-gray-600 truncate ml-1">
                  {teamMembers.length === 1
                    ? teamMembers[0]?.name ||
                      (teamMembers[0]?.firstName && teamMembers[0]?.lastName
                        ? `${teamMembers[0].firstName} ${teamMembers[0].lastName}`
                        : teamMembers[0]?.firstName ||
                          teamMembers[0]?.lastName ||
                          "Unassigned")
                    : `${teamMembers.length} members`}
                </span>
              </div>
            ) : (
              <>
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                  <Users className="w-3 h-3" />
                </div>
                <span className="text-sm text-gray-600 truncate">
                  Click to add team
                </span>
              </>
            )}
          </button>
        );
      },
    },
    {
      key: "dates",
      label: "DATES",
      render: (_, project) => {
        // Convert dates to date format (YYYY-MM-DD)
        const getDateValue = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const startDateValue = getDateValue(project.startDate);
        const endDateValue = getDateValue(project.endDate);

        return (
          <div
            className="flex items-center gap-2 min-w-[200px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar className="w-4 h-4 flex-shrink-0 text-gray-500" />
            <div className="flex items-center gap-1 flex-1">
              <input
                type="date"
                value={startDateValue}
                onChange={(e) => {
                  handleDateUpdate(project.id, "startDate", e.target.value);
                }}
                className="flex-1 text-xs text-gray-700 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Start date"
                title="Start date"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={endDateValue}
                onChange={(e) => {
                  handleDateUpdate(project.id, "endDate", e.target.value);
                }}
                className="flex-1 text-xs text-gray-700 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="End date"
                title="End date"
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "tasks",
      label: "TASKS",
      render: (_, project) => (
        <div className="min-w-[100px]">
          <span className="text-sm text-gray-600">
            {project.tasksCount || project.tasks?.length || 0}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (_, project) => (
        <div className="flex items-center gap-1 min-w-[120px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleProjectClick(project);
            }}
            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
            title="View Project"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleProjectClick = (project) => {
    if (project?.slug) {
      router.push(`/projects/${project.slug}`);
    } else if (project?.id) {
      router.push(`/projects/${project.id}`);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (projectId, newStatus) => {
    try {
      // Check if project is being marked as completed
      const isCompleting = newStatus === "Completed";
      
      // Get current project to check previous status
      const currentProject = projects.find((p) => p.id === projectId);
      const wasAlreadyCompleted = currentProject?.status === "Completed";
      
      // Transform frontend status to Strapi enum format
      const strapiStatus = transformStatusToStrapi(newStatus);
      
      console.log("Updating project status:", {
        projectId,
        frontendStatus: newStatus,
        strapiStatus
      });
      
      await projectService.updateProject(projectId, { status: strapiStatus });
      
      // Trigger confetti animation only when completing a project (not when uncompleting)
      if (isCompleting && !wasAlreadyCompleted) {
        triggerProjectCompletionAnimation();
      }
      
      // Reload projects to get updated data from server
      const projectsResponse = await projectService.getAllProjects({
        pageSize: 100,
        populate: ["projectManager", "teamMembers", "tasks"],
      });
      
      const transformedProjects =
        projectsResponse.data?.map(transformProject) || [];
      
      setProjects(transformedProjects);
    } catch (error) {
      console.error("Error updating project status:", error);
      alert("Failed to update project status. Please try again.");
    }
  };

  // Fancy confetti animation for project completion
  const triggerProjectCompletionAnimation = () => {
    const duration = 4000; // 4 seconds of celebration
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 40,
      spread: 360,
      ticks: 100,
      zIndex: 99999,
      colors: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"],
    };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    // Initial burst from center
    confetti({
      ...defaults,
      particleCount: 100,
      origin: { x: 0.5, y: 0.5 },
      angle: randomInRange(55, 125),
    });

    // Burst from left
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 80,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        angle: randomInRange(45, 75),
      });
    }, 200);

    // Burst from right
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 80,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        angle: randomInRange(105, 135),
      });
    }, 400);

    // Continuous confetti shower
    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });

      // Confetti from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });

      // Confetti from top center
      confetti({
        ...defaults,
        particleCount: particleCount * 0.5,
        origin: { x: 0.5, y: 0 },
        angle: randomInRange(80, 100),
      });
    }, 250);

    // Update canvas z-index to ensure it's on top
    const updateCanvasZIndex = () => {
      const canvases = document.querySelectorAll("canvas");
      canvases.forEach((canvas) => {
        if (canvas.width > 0 && canvas.height > 0) {
          canvas.style.zIndex = "99999";
          canvas.style.position = "fixed";
          canvas.style.top = "0";
          canvas.style.left = "0";
          canvas.style.pointerEvents = "none";
        }
      });
    };

    // Continuously update z-index
    const zIndexInterval = setInterval(() => {
      updateCanvasZIndex();
    }, 50);

    // Clear z-index update interval when confetti ends
    setTimeout(() => {
      clearInterval(zIndexInterval);
    }, duration + 100);
  };

  // Handle project lead update
  const handleProjectLeadUpdate = async (projectId, userId) => {
    try {
      const updateData = userId 
        ? { projectManager: parseInt(userId, 10) }
        : { projectManager: null };
      
      await projectService.updateProject(projectId, updateData);
      
      // Reload projects to get updated projectManager with full data
      const projectsResponse = await projectService.getAllProjects({
        pageSize: 100,
        populate: ["projectManager", "teamMembers", "tasks"],
      });
      
      const transformedProjects =
        projectsResponse.data?.map(transformProject) || [];
      
      setProjects(transformedProjects);
    } catch (error) {
      console.error("Error updating project lead:", error);
      alert("Failed to update project lead. Please try again.");
    }
  };

  // Handle date update
  const handleDateUpdate = async (projectId, field, dateValue) => {
    try {
      const updateData = {};
      if (field === "startDate") {
        updateData.startDate = dateValue
          ? new Date(dateValue + "T00:00:00").toISOString()
          : null;
      } else if (field === "endDate") {
        updateData.endDate = dateValue
          ? new Date(dateValue + "T00:00:00").toISOString()
          : null;
      }

      await projectService.updateProject(projectId, updateData);
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === projectId ? { ...p, ...updateData } : p
        )
      );
    } catch (error) {
      console.error("Error updating project date:", error);
    }
  };

  // Handle team update
  const handleTeamUpdate = async (projectId, teamMemberIds) => {
    try {
      // Ensure all IDs are integers
      const parsedIds = teamMemberIds.map((id) => 
        typeof id === 'string' ? parseInt(id, 10) : id
      ).filter((id) => !isNaN(id));

      console.log("Updating project team:", { projectId, teamMemberIds, parsedIds });

      const updatedProject = await projectService.updateProject(projectId, {
        teamMembers: parsedIds,
      });

      console.log("Project updated successfully:", updatedProject);

      // Reload all projects to get updated team members with full populate
      const projectsResponse = await projectService.getAllProjects({
        pageSize: 100,
        populate: ["projectManager", "teamMembers", "tasks"],
      });
      const transformedProjects =
        projectsResponse.data?.map(transformProject) || [];
      setProjects(transformedProjects);
      
      console.log("Projects reloaded, team members should be updated");
    } catch (error) {
      console.error("Error updating project team:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(`Failed to update team: ${error.message || "Unknown error"}`);
      throw error; // Re-throw so the modal can handle it
    }
  };

  const handleExport = (format) => {
    console.log(`Exporting projects as ${format}`);
    setShowExportDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        exportDropdownRef.current &&
        !exportDropdownRef.current.contains(event.target)
      ) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Loading state (including auth loading)
  if (loading || authLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="p-4 space-y-4">
          <PageHeader
            title="Projects"
            subtitle="Manage and track all of your projects here"
            breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Projects", href: "/projects" }]}
            showSearch={true}
            showActions={true}
            showProfile={true}
            searchPlaceholder="Search projects..."
            onSearchChange={setSearchQuery}
            onAddClick={() => router.push("/projects/add")}
            onFilterClick={() => setIsFilterModalOpen(true)}
            onImportClick={() => setIsImportModalOpen(true)}
            onExportClick={() => setShowExportDropdown(!showExportDropdown)}
          />
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {authLoading
                  ? "Loading user information..."
                  : "Loading projects..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - but still show the page structure
  if (error && projects.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="p-4 space-y-4">
          <PageHeader
            title="Projects"
            subtitle="Manage and track all of your projects here"
            breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Projects", href: "/projects" }]}
            showSearch={true}
            showActions={true}
            showProfile={true}
            searchPlaceholder="Search projects..."
            onSearchChange={setSearchQuery}
            onAddClick={() => router.push("/projects/add")}
            onFilterClick={() => setIsFilterModalOpen(true)}
            onImportClick={() => setIsImportModalOpen(true)}
            onExportClick={() => setShowExportDropdown(!showExportDropdown)}
          />
          <div className="space-y-4">
            {/* Stats Overview - show empty stats */}
            <ProjectsKPIs statusStats={statusStats} />

            {/* Error message */}
            <Card glass={true} className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Error Loading Projects
                </h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                      window.location.reload();
                    }}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => router.push("/projects/add")}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Create Your First Project
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Grid view render function
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project) => (
        <div
          key={project.id}
          className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl cursor-pointer hover:scale-105 transition-all duration-300"
          onClick={() => handleProjectClick(project)}
        >
          <div className="p-6">
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${project.color || "from-blue-400 to-blue-600"} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white font-bold text-lg">
                    {project.icon || project.name?.charAt(0)?.toUpperCase() || "P"}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-foreground text-lg">
                    {project.name}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full border ${
                      project.status === "Active" || project.status === "In Progress"
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : project.status === "Planning"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : project.status === "Completed"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : project.status === "On Hold"
                        ? "bg-red-100 text-red-700 border-red-200"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Project Description */}
            {project.description && (
              <p className="text-sm text-brand-text-light mb-4 line-clamp-2">
                {project.description}
              </p>
            )}

            {/* Project Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-brand-foreground">
                  {project.tasksCount || project.tasks?.length || 0}
                </div>
                <div className="text-xs text-brand-text-light">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {project.tasks?.filter(
                    (t) =>
                      t.status?.toLowerCase() === "done" ||
                      t.status?.toLowerCase() === "completed"
                  ).length || 0}
                </div>
                <div className="text-xs text-brand-text-light">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {project.tasks?.filter((t) => {
                    if (!t.scheduledDate) return false;
                    const dueDate = new Date(t.scheduledDate);
                    const now = new Date();
                    return (
                      dueDate < now &&
                      t.status?.toLowerCase() !== "done" &&
                      t.status?.toLowerCase() !== "completed"
                    );
                  }).length || 0}
                </div>
                <div className="text-xs text-brand-text-light">Overdue</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-brand-text-light">Progress</span>
                <span className="font-medium text-brand-foreground">
                  {project.progress || 0}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Team Members */}
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {(project.teamMembers || []).slice(0, 3).map((member, index) => {
                  const name =
                    member?.name ||
                    (member?.firstName && member?.lastName
                      ? `${member.firstName} ${member.lastName}`
                      : member?.firstName || member?.lastName || "Unknown");
                  const initial = name?.charAt(0)?.toUpperCase() || "U";
                  return (
                    <div
                      key={member?.id || index}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white"
                      title={name}
                    >
                      {initial}
                    </div>
                  );
                })}
                {(project.teamMembers || []).length > 3 && (
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white/50">
                    +{(project.teamMembers || []).length - 3}
                  </div>
                )}
              </div>
              <div className="text-xs text-brand-text-light">
                {project.startDate ? formatDate(project.startDate) : "N/A"} -{" "}
                {project.endDate ? formatDate(project.endDate) : "N/A"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="min-h-screen bg-white">
        <div className="p-4 space-y-4">
          {/* Page Header */}
          <div className="relative">
            <PageHeader
              title="Projects"
              subtitle="Manage and track all of your projects here"
              breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Projects", href: "/projects" }]}
              showSearch={true}
              showActions={true}
              showProfile={true}
              searchPlaceholder="Search projects..."
              onSearchChange={setSearchQuery}
              onAddClick={() => router.push("/projects/add")}
              onFilterClick={() => setIsFilterModalOpen(true)}
              onImportClick={() => setIsImportModalOpen(true)}
              onExportClick={() => setShowExportDropdown(!showExportDropdown)}
            />
            
            {/* Export Dropdown */}
            {showExportDropdown && (
              <div className="absolute right-4 top-20 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 z-50" ref={exportDropdownRef}>
                <div className="py-1">
                  <button
                    onClick={() => handleExport("pdf")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-3 text-red-500" />
                    PDF
                  </button>
                  <button
                    onClick={() => handleExport("excel")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-3 text-green-500" />
                    Excel
                  </button>
                  <button
                    onClick={() => handleExport("csv")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-3 text-blue-500" />
                    CSV
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Stats Overview */}
            <ProjectsKPIs statusStats={statusStats} />

            {/* View Toggle */}
            <ProjectsTabs
              tabItems={tabItems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeView={activeView}
              setActiveView={setActiveView}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddClick={() => router.push("/projects/add")}
              onExportClick={handleExport}
            />

            {/* Single Horizontal Scroll Container */}
            <div className="-mx-4 px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Projects Table/Grid */}
              {activeView === "list" && (
                <ProjectsListView
                  filteredProjects={filteredProjects}
                  projectColumnsTable={projectColumnsTable}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  setIsModalOpen={() => router.push("/projects/add")}
                  onRowClick={handleProjectClick}
                />
              )}
              {activeView === "grid" && (
                <div className="rounded-3xl overflow-hidden">
                  {renderGridView()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Team Management Modal */}
      {teamModal.isOpen && (
        <TeamManagementModal
          isOpen={teamModal.isOpen}
          onClose={() => setTeamModal({ isOpen: false, project: null })}
          project={teamModal.project}
          onUpdate={(updatedProject) => {
            // Update projects list
            setProjects((prevProjects) =>
              prevProjects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
            );
            // Update the project in the modal state so UI reflects changes
            setTeamModal((prev) => ({
              ...prev,
              project: updatedProject,
            }));
          }}
        />
      )}
    </div>
  );
}

// Team Management Modal Component
function TeamManagementModal({ isOpen, onClose, project, onUpdate }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentProject, setCurrentProject] = useState(project);

  // Update local project state when prop changes
  useEffect(() => {
    if (project) {
      setCurrentProject(project);
    }
  }, [project]);

  // Get current team members from local state
  const currentTeamMembers = currentProject?.teamMembers || [];

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      // Reset to current project when modal opens
      if (project) {
        setCurrentProject(project);
      }
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersResponse = await apiClient.get("/api/xtrawrkx-users", {
        "pagination[pageSize]": 100,
        populate: "primaryRole,userRoles,department",
        "filters[isActive][$eq]": "true",
      });

      let usersData = [];
      if (usersResponse?.data && Array.isArray(usersResponse.data)) {
        usersData = usersResponse.data;
      } else if (Array.isArray(usersResponse)) {
        usersData = usersResponse;
      }

      const transformedUsers = usersData
        .filter((user) => user && user.id)
        .map((user) => {
          const userData = user.attributes || user;
          const firstName = userData.firstName || "";
          const lastName = userData.lastName || "";
          const email = userData.email || "";
          const name = `${firstName} ${lastName}`.trim() || email || "Unknown User";

          return {
            id: user.id,
            firstName,
            lastName,
            email,
            name,
          };
        });

      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower)
    );
  });

  const isTeamMember = (userId) => {
    return currentTeamMembers.some((member) => {
      const memberId = typeof member === 'object' ? member.id : member;
      return memberId === userId;
    });
  };

  const handleToggleTeamMember = async (user) => {
    if (!currentProject) return;

    setSaving(true);
    try {
      const isCurrentlyMember = isTeamMember(user.id);
      let updatedTeamMembers;

      if (isCurrentlyMember) {
        // Remove team member
        updatedTeamMembers = currentTeamMembers.filter(
          (member) => {
            const memberId = typeof member === 'object' ? member.id : member;
            return memberId !== user.id;
          }
        );
      } else {
        // Add team member
        updatedTeamMembers = [...currentTeamMembers, user];
      }

      // Get team member IDs
      const teamMemberIds = updatedTeamMembers.map((m) => {
        return typeof m === 'object' ? (m.id || m) : m;
      }).filter(id => id != null);

      console.log("Updating team members:", { projectId: currentProject.id, teamMemberIds, isCurrentlyMember });

      // Update project with new team members
      await projectService.updateProject(currentProject.id, {
        teamMembers: teamMemberIds,
      });

      // Reload project to get updated team members
      const updatedProject = await projectService.getProjectById(currentProject.id, [
        "projectManager",
        "teamMembers",
        "tasks",
      ]);

      const transformedProject = transformProject(updatedProject);

      console.log("Updated project:", transformedProject);
      console.log("Updated team members:", transformedProject.teamMembers);

      // Update local project state immediately for UI update
      setCurrentProject(transformedProject);

      // Update parent state
      if (onUpdate) {
        onUpdate(transformedProject);
      }

      // Don't close the modal - allow multiple toggles
    } catch (error) {
      console.error("Error updating team members:", error);
      alert(`Failed to update team: ${error.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !currentProject) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[90] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Manage Team
            </h2>
            <p className="text-sm text-gray-500 mt-1">{currentProject.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const isMember = isTeamMember(user.id);
                const initial = user.name?.charAt(0)?.toUpperCase() || "U";

                return (
                  <button
                    key={user.id}
                    onClick={() => handleToggleTeamMember(user)}
                    disabled={saving}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isMember
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50 border border-transparent"
                    } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                        isMember
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {initial}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    {isMember ? (
                      <UserMinus className="w-5 h-5 text-blue-600" />
                    ) : (
                      <UserPlus className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
