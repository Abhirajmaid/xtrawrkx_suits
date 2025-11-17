"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import {
  StatsCards,
  AssignedTasksTable,
  ProjectsTable,
  People,
  PrivateNotepad,
  RecentActivity,
} from "../../components/dashboard";
import PageHeader from "../../components/shared/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import projectService from "../../lib/projectService";
import taskService from "../../lib/taskService";
import { transformProject, transformTask } from "../../lib/dataTransformers";

// Helper function to get greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

// Helper function to get current date
const getCurrentDate = () => {
  const date = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [hasData] = useState(true); // Default to filled state to show the dashboard with data
  const [projects, setProjects] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [taskStats, setTaskStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentUserId = 1; // TODO: Get from auth context

        // Load projects, tasks, and stats in parallel
        const [projectsResponse, tasksResponse, statsResponse] = await Promise.all([
          projectService.getAllProjects({ pageSize: 10 }),
          taskService.getTasksByAssignee(currentUserId, { pageSize: 10 }),
          taskService.getTaskStats(currentUserId)
        ]);

        // Transform data
        const transformedProjects = projectsResponse.data?.map(transformProject) || [];
        const transformedTasks = tasksResponse.data?.map(transformTask) || [];

        setProjects(transformedProjects);
        setAssignedTasks(transformedTasks);
        setTaskStats(statsResponse);

      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Get real assigned tasks data
  const getRealAssignedTasksData = () => {
    if (!hasData || !assignedTasks.length) return [];

    return assignedTasks.slice(0, 3).map((task) => {
      let dueDateText = "No due date";
      
      if (task.dueDate) {
        const dueDate = new Date(task.scheduledDate);
        const now = new Date();
        const diffTime = dueDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          dueDateText = `Overdue by ${Math.abs(diffDays)} days`;
        } else if (diffDays === 0) {
          dueDateText = "Due today";
        } else if (diffDays === 1) {
          dueDateText = "Due tomorrow";
        } else if (diffDays < 7) {
          dueDateText = `Due in ${diffDays} days`;
        } else {
          dueDateText = `Due in ${Math.ceil(diffDays / 7)} weeks`;
        }
      }

      const getColorByProject = (projectName) => {
        switch (projectName) {
          case "Yellow Branding":
            return "bg-blue-500";
          case "Mogo Web Design":
            return "bg-green-500";
          case "Futurework":
            return "bg-purple-500";
          case "Resto Dashboard":
            return "bg-pink-500";
          case "Hajime Illustration":
            return "bg-yellow-500";
          case "Carl UI/UX":
            return "bg-orange-500";
          case "Fitness App Design":
            return "bg-purple-500";
          default:
            return "bg-gray-500";
        }
      };

      return {
        id: task.id,
        name: task.name,
        project: task.project?.name || "Unknown Project",
        projectColor: getColorByProject(task.project?.name),
        dueDate: dueDateText,
        priority: task.priority,
        progress: task.progress,
        assignee: task.assignee,
        status: task.status,
      };
    });
  };

  // Get real stats from API data
  const getRealStatsData = () => {
    if (!hasData) {
      return {
        totalProjects: 1,
        totalTasks: 3,
        assignedTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
      };
    }

    return {
      totalProjects: projects.length,
      totalTasks: taskStats.totalTasks || 0,
      assignedTasks: assignedTasks.length,
      completedTasks: taskStats.completedTasks || 0,
      overdueTasks: taskStats.overdueTasks || 0,
    };
  };

  const statsData = getRealStatsData();

  // Handle task completion
  const handleTaskComplete = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      
      setAssignedTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Get real projects data
  const getRealProjectsData = () => {
    if (!hasData || !projects.length) return [];

    return projects.map((project) => {
      const endDate = project.endDate ? new Date(project.endDate) : null;
      const now = new Date();

      let status = project.status;
      if (project.progress === 100) {
        status = "Completed";
      } else if (endDate && endDate < now && status !== "Completed") {
        status = "Overdue";
      } else if (status === "In Progress") {
        status = "Active";
      }

      const getProjectColor = (projectName) => {
        switch (projectName) {
          case "Yellow Branding":
            return "bg-blue-500";
          case "Mogo Web Design":
            return "bg-green-500";
          case "Futurework":
            return "bg-purple-500";
          default:
            return "bg-gray-500";
        }
      };

      const team = (project.teamMembers || []).map((member) => {
        return {
          name: member.name || "Unknown",
          initials: member.initials || "?",
          color: member.color || "bg-gray-500",
        };
      });

      return {
        id: project.id,
        name: project.name,
        status,
        initials: project.icon,
        color: getProjectColor(project.name),
        progress: project.progress,
        dueDate:
          status === "Completed"
            ? "Completed"
            : endDate ? endDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }) : "No due date",
        team,
      };
    });
  };

  const projectsData = getRealProjectsData();

  const peopleData = hasData
    ? [
        {
          id: 1,
          name: "Marc Atenson",
          email: "marcnine@gmail.com",
          avatar: "MA",
        },
        {
          id: 2,
          name: "Susan Drake",
          email: "contact@susandrak..",
          avatar: "SD",
        },
        {
          id: 3,
          name: "Ronald Richards",
          email: "ronaldrichard@gmai..",
          avatar: "RR",
        },
        {
          id: 4,
          name: "Jane Cooper",
          email: "janecooper@proton..",
          avatar: "JC",
        },
        {
          id: 5,
          name: "Ian Warren",
          email: "wadewarren@mail.co",
          avatar: "IW",
        },
        {
          id: 6,
          name: "Darrell Steward",
          email: "darrelsteward@gma..",
          avatar: "DS",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex flex-col h-full relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 -z-10"></div>
        <div className="p-6">
          <PageHeader
            title="Dashboard"
            subtitle={`${getGreeting()}, ${user?.firstName || user?.name?.split(" ")[0] || "User"} • ${getCurrentDate()}`}
            breadcrumb={[{ label: "Dashboard", href: "/dashboard" }]}
            showSearch={true}
            showActions={false}
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 -z-10"></div>
        <div className="p-6">
          <PageHeader
            title="Dashboard"
            subtitle={`${getGreeting()}, ${user?.firstName || user?.name?.split(" ")[0] || "User"} • ${getCurrentDate()}`}
            breadcrumb={[{ label: "Dashboard", href: "/dashboard" }]}
            showSearch={true}
            showActions={false}
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 -z-10"></div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-blue-500/8 to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-bl from-green-400/8 to-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="p-6">
        <PageHeader
          title="Dashboard"
          subtitle={`${getGreeting()}, ${user?.firstName || user?.name?.split(" ")[0] || "User"} • ${getCurrentDate()}`}
          breadcrumb={[{ label: "Dashboard", href: "/dashboard" }]}
          showSearch={true}
          showActions={false}
        />
      </div>

      <div className="flex-1 px-6 pb-6 overflow-auto relative z-10">
        <div className="max-w-full mx-auto">
          <div className="mb-6">
            <StatsCards data={statsData} />
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <AssignedTasksTable
                  data={assignedTasks}
                  onTaskComplete={handleTaskComplete}
                />
              </div>
              <div className="space-y-6">
                <ProjectsTable data={projectsData.slice(0, 4)} />
                <RecentActivity />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div>
                <People data={peopleData} />
              </div>
              <div className="xl:col-span-2">
                <PrivateNotepad />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
