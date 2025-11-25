"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { CheckSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import {
  StatsCards,
  AssignedTasksTable,
  ProjectsTable,
  People,
  PrivateNotepad,
  RecentActivity,
} from "../components/dashboard";
import PageHeader from "../components/shared/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import projectService from "../lib/projectService";
import taskService from "../lib/taskService";
import { transformProject, transformTask } from "../lib/dataTransformers";

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
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [hasData] = useState(true); // Default to filled state to show the dashboard with data
  const [projects, setProjects] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user ID from auth context
        const currentUserId =
          user?.id || user?._id || user?.xtrawrkxUserId || 1;

        // Load projects and tasks in parallel
        const [projectsResponse, allTasksResponse] = await Promise.all([
          projectService.getAllProjects({ pageSize: 10 }),
          taskService.getAllTasks({
            pageSize: 100,
            populate: [
              "projects",
              "assignee",
              "createdBy",
              "subtasks",
              "collaborators",
            ],
          }),
        ]);

        // Transform data
        const transformedProjects =
          projectsResponse.data?.map(transformProject) || [];
        const allTransformedTasks =
          allTasksResponse.data?.map(transformTask) || [];

        // Filter out CRM tasks (PM tasks only)
        const allPMTasks = allTransformedTasks.filter((task) => {
          const hasCRMRelation = !!(
            task.leadCompany ||
            task.clientAccount ||
            task.contact ||
            task.deal
          );
          return !hasCRMRelation;
        });

        // Filter tasks where user is a collaborator
        const normalizedCurrentUserId =
          typeof currentUserId === "string"
            ? parseInt(currentUserId)
            : currentUserId;

        const collaboratorTasks = allPMTasks.filter((task) => {
          // Check if user is assignee
          const taskAssigneeId =
            task.assignee?.id || task.assignee?._id || task.assignee;
          const normalizedTaskAssigneeId =
            typeof taskAssigneeId === "string"
              ? parseInt(taskAssigneeId)
              : taskAssigneeId;
          const isAssignee =
            normalizedTaskAssigneeId === normalizedCurrentUserId;

          // Check if user is in collaborators
          const collaborators = task.collaborators || [];
          const isCollaborator = collaborators.some((collab) => {
            const collabId = collab?.id || collab?._id || collab;
            const normalizedCollabId =
              typeof collabId === "string" ? parseInt(collabId) : collabId;
            return normalizedCollabId === normalizedCurrentUserId;
          });

          return isAssignee || isCollaborator;
        });

        setProjects(transformedProjects);
        setAssignedTasks(collaboratorTasks);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

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

  // Calculate task statistics similar to my-task page
  const getTaskStats = () => {
    const stats = {
      "to-do": 0,
      "in-progress": 0,
      done: 0,
      overdue: 0,
    };

    const now = new Date();
    assignedTasks.forEach((task) => {
      const status = task.status?.toLowerCase().replace(/\s+/g, "-") || "";
      if (status === "to-do" || status === "todo") stats["to-do"]++;
      else if (status === "in-progress") stats["in-progress"]++;
      else if (status === "done" || status === "completed") stats.done++;

      // Check for overdue
      if (
        task.scheduledDate &&
        new Date(task.scheduledDate) < now &&
        status !== "done" &&
        status !== "completed"
      ) {
        stats.overdue++;
      }
    });

    return stats;
  };

  const taskStats = getTaskStats();

  // Status statistics for KPIs (similar to my-task page)
  const statusStats = [
    {
      label: "To Do",
      count: taskStats["to-do"],
      color: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      icon: CheckSquare,
    },
    {
      label: "In Progress",
      count: taskStats["in-progress"],
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
      icon: Clock,
    },
    {
      label: "Done",
      count: taskStats.done,
      color: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      icon: CheckCircle,
    },
    {
      label: "Overdue",
      count: taskStats.overdue,
      color: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      icon: AlertCircle,
    },
  ];

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
            : endDate
            ? endDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "No due date",
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
      <div className="bg-white w-full flex-1 min-h-full">
        <div className="p-4">
          <PageHeader
            title="Dashboard"
            subtitle={`${getGreeting()}, ${
              user?.firstName || user?.name?.split(" ")[0] || "User"
            } • ${getCurrentDate()}`}
            breadcrumb={[{ label: "Dashboard", href: "/" }]}
            showSearch={true}
            showActions={false}
          />
        </div>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white w-full flex-1 min-h-full">
        <div className="p-4">
          <PageHeader
            title="Dashboard"
            subtitle={`${getGreeting()}, ${
              user?.firstName || user?.name?.split(" ")[0] || "User"
            } • ${getCurrentDate()}`}
            breadcrumb={[{ label: "Dashboard", href: "/" }]}
            showSearch={true}
            showActions={false}
          />
        </div>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition-all duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full h-full min-h-full">
      <div className="p-4 space-y-4 pb-8">
        <PageHeader
          title="Dashboard"
          subtitle={`${getGreeting()}, ${
            user?.firstName || user?.name?.split(" ")[0] || "User"
          } • ${getCurrentDate()}`}
          breadcrumb={[{ label: "Dashboard", href: "/" }]}
          showSearch={true}
          showActions={false}
        />

        <div className="mb-6">
          <StatsCards statusStats={statusStats} />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <AssignedTasksTable
                data={assignedTasks}
                onTaskComplete={handleTaskComplete}
                projects={projects}
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
  );
}
