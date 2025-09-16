"use client";

import React, { useState } from "react";
import {
  Header,
  StatsCards,
  AssignedTasks,
  Projects,
  People,
  PrivateNotepad,
} from "../../components/dashboard";
import {
  projects,
  getTasksByAssigneeId,
  getEnrichedTask,
  getProjectStats,
  teamMembers,
} from "../../data/centralData";

export default function DashboardPage() {
  const [hasData, setHasData] = useState(true); // Default to filled state to show the dashboard with data

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

  // Get real assigned tasks data
  const getRealAssignedTasksData = () => {
    if (!hasData) return [];

    const currentUserId = 1; // Mark Atenson
    const userTasks = getTasksByAssigneeId(currentUserId);

    return userTasks.slice(0, 3).map((task) => {
      const enrichedTask = getEnrichedTask(task.id);
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
          default:
            return "bg-gray-500";
        }
      };

      return {
        id: task.id,
        name: task.name,
        project: enrichedTask.project.name,
        dueDate: dueDateText,
        color: getColorByProject(enrichedTask.project.name),
        priority: task.priority,
        status: task.status.toLowerCase().replace(" ", "_"),
      };
    });
  };

  const assignedTasksData = getRealAssignedTasksData();

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
    <div className="flex flex-col h-full bg-gray-50">
      <Header onToggleData={() => setHasData(!hasData)} />

      <div className="flex-1 p-4 lg:p-6 overflow-auto bg-gray-50">
        <div className="max-w-full mx-auto px-2 lg:px-4">
          <div className="mb-6">
            <StatsCards data={statsData} />
          </div>

          <div className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <AssignedTasks data={assignedTasksData} />
              <Projects data={projectsData.slice(0, 4)} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <People data={peopleData} />
              <PrivateNotepad />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
