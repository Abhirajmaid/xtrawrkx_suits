"use client";

import React, { useState } from "react";
import {
  Header,
  StatsCards,
  AssignedTasks,
  Projects,
  People,
  PrivateNotepad,
} from "./components";

export default function DashboardPage() {
  const [hasData, setHasData] = useState(true); // Default to filled state to show the dashboard with data

  // Mock data state
  const statsData = {
    totalProjects: hasData ? 7 : 1,
    totalTasks: hasData ? 49 : 3,
    assignedTasks: hasData ? 12 : 0,
    completedTasks: hasData ? 6 : 0,
    overdueTasks: hasData ? 3 : 0,
  };

  const assignedTasksData = hasData
    ? [
        {
          id: 1,
          name: "Web Mockup",
          project: "Yellow Branding",
          dueDate: "Due in 20 hours",
          color: "bg-yellow-500",
          priority: "high",
          status: "in_progress",
        },
        {
          id: 2,
          name: "Carl Landing Page",
          project: "Carl UI/UX",
          dueDate: "Due in 3 days",
          color: "bg-orange-500",
          priority: "medium",
          status: "pending",
        },
        {
          id: 3,
          name: "POS UI/UX",
          project: "Resto Dashboard",
          dueDate: "Due in 1 week",
          color: "bg-pink-500",
          priority: "low",
          status: "pending",
        },
      ]
    : [];

  const projectsData = hasData
    ? [
        {
          id: 1,
          name: "Yellow Branding",
          status: "Active",
          initials: "YB",
          color: "bg-blue-500",
          progress: 75,
          dueDate: "Dec 15",
          team: [
            { name: "John Doe", initials: "JD", color: "bg-blue-500" },
            { name: "Jane Smith", initials: "JS", color: "bg-green-500" },
            { name: "Mike Wilson", initials: "MW", color: "bg-purple-500" },
          ],
        },
        {
          id: 2,
          name: "Mogo Web Design",
          status: "Completed",
          initials: "MW",
          color: "bg-green-500",
          progress: 100,
          dueDate: "Completed",
          team: [
            { name: "Sarah Connor", initials: "SC", color: "bg-red-500" },
            { name: "Tom Hardy", initials: "TH", color: "bg-yellow-500" },
          ],
        },
        {
          id: 3,
          name: "Futurework",
          status: "Active",
          initials: "FW",
          color: "bg-purple-500",
          progress: 45,
          dueDate: "Jan 20",
          team: [
            { name: "Alex Chen", initials: "AC", color: "bg-teal-500" },
            { name: "Lisa Park", initials: "LP", color: "bg-orange-500" },
            { name: "David Kim", initials: "DK", color: "bg-indigo-500" },
            { name: "Emma Watson", initials: "EW", color: "bg-pink-500" },
          ],
        },
        {
          id: 4,
          name: "Resto Dashboard",
          status: "Active",
          initials: "RD",
          color: "bg-pink-500",
          progress: 60,
          dueDate: "Jan 15",
          team: [
            { name: "Mark Ruffalo", initials: "MR", color: "bg-green-700" },
            { name: "Jeremy Renner", initials: "JR", color: "bg-purple-600" },
          ],
        },
        {
          id: 5,
          name: "Hajime Illustration",
          status: "On Hold",
          initials: "HI",
          color: "bg-green-500",
          progress: 30,
          dueDate: "Feb 05",
          team: [{ name: "Chris Evans", initials: "CE", color: "bg-blue-600" }],
        },
        {
          id: 6,
          name: "Carl UI/UX",
          status: "Overdue",
          initials: "CU",
          color: "bg-orange-500",
          progress: 25,
          dueDate: "Dec 10",
          team: [
            { name: "Anthony Mackie", initials: "AM", color: "bg-gray-600" },
            { name: "Sebastian Stan", initials: "SS", color: "bg-blue-700" },
          ],
        },
        {
          id: 7,
          name: "The Run Branding...",
          status: "Active",
          initials: "TR",
          color: "bg-teal-500",
          progress: 90,
          dueDate: "Dec 28",
          team: [
            { name: "Robert Downey", initials: "RD", color: "bg-red-600" },
          ],
        },
      ]
    : [];

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
