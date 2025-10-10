"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import {
  StatsCards,
  AssignedTasksTable,
  ProjectsTable,
  People,
  PrivateNotepad,
  RecentActivity,
} from "../../components/dashboard";
import Header from "../../components/shared/Header";
import {
  projects,
  getTasksByAssigneeId,
  getProjectStats,
  teamMembers,
} from "../../data/centralData";

export default function DashboardPage() {
  const [hasData] = useState(true); // Default to filled state to show the dashboard with data

  // Get real assigned tasks data
  const getRealAssignedTasksData = () => {
    if (!hasData) return [];

    const currentUserId = 1; // Mark Atenson
    const userTasks = getTasksByAssigneeId(currentUserId);

    return userTasks.slice(0, 3).map((task) => {
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      const diffTime = dueDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let dueDateText;
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
        project: task.project.name,
        projectColor: getColorByProject(task.project.name),
        dueDate: dueDateText,
        priority: task.priority,
        progress: task.progress,
        assignee: task.assignee,
        status: task.status,
      };
    });
  };

  const [assignedTasks, setAssignedTasks] = useState(() =>
    getRealAssignedTasksData()
  );

  // Get real stats from centralized data
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

    const allProjects = Object.values(projects);
    const currentUserId = 1; // Mark Atenson
    const userTasks = getTasksByAssigneeId(currentUserId);

    let totalTasks = 0;
    let completedTasks = 0;
    let overdueTasks = 0;

    // Calculate stats across all projects
    allProjects.forEach((project) => {
      const projectStats = getProjectStats(project.id);
      totalTasks += projectStats.totalTasks;
      completedTasks += projectStats.completedTasks;
      overdueTasks += projectStats.overdueTasks;
    });

    return {
      totalProjects: allProjects.length,
      totalTasks,
      assignedTasks: userTasks.length,
      completedTasks,
      overdueTasks,
    };
  };

  const statsData = getRealStatsData();

  // Handle task completion
  const handleTaskComplete = (taskId, newStatus) => {
    setAssignedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Get real projects data
  const getRealProjectsData = () => {
    if (!hasData) return [];

    return Object.values(projects).map((project) => {
      const stats = getProjectStats(project.id);
      const endDate = new Date(project.endDate);
      const now = new Date();

      let status = project.status;
      if (stats.completedTasks === stats.totalTasks && stats.totalTasks > 0) {
        status = "Completed";
      } else if (endDate < now && status !== "Completed") {
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

      const team = project.teamMemberIds.map((memberId) => {
        const member = teamMembers[memberId];
        return {
          name: member.name,
          initials: member.avatar,
          color: member.color,
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
            : new Date(project.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
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

      <Header
        title="Dashboard"
        subtitle="Monitor all of your projects and tasks here"
        onSearchClick={() => console.log("Search clicked")}
      />

      <div className="flex-1 p-6 overflow-auto relative z-10">
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
