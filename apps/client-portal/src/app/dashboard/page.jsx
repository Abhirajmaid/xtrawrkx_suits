"use client";

import { useRouter } from "next/navigation";
import {
  StatsCard,
  ProjectCard,
  MeetingCard,
  NotificationList,
} from "@/components/dashboard";
import {
  FolderOpen,
  CheckCircle,
  Calendar,
  AlertTriangle,
  MessageCircle,
  FileText,
  UserPlus,
  Bell,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  // Mock data
  const stats = [
    {
      title: "Active Projects",
      value: "12",
      icon: FolderOpen,
      color: "blue",
      change: "+2",
      changeType: "increase",
    },
    {
      title: "Completed",
      value: "34",
      icon: CheckCircle,
      color: "green",
      change: "+5",
      changeType: "increase",
    },
    {
      title: "Milestones",
      value: "6",
      icon: Calendar,
      color: "purple",
      change: "+1",
      changeType: "increase",
    },
    {
      title: "Overdue",
      value: "2",
      icon: AlertTriangle,
      color: "red",
      change: "-1",
      changeType: "decrease",
    },
  ];

  const projects = [
    {
      id: 1,
      projectName: "Website Redesign",
      status: "active",
      dueDate: "2024-02-15",
      progress: 75,
    },
    {
      id: 2,
      projectName: "Mobile App Development",
      status: "active",
      dueDate: "2024-03-01",
      progress: 45,
    },
    {
      id: 3,
      projectName: "Brand Identity",
      status: "completed",
      dueDate: "2024-01-20",
      progress: 100,
    },
    {
      id: 4,
      projectName: "Marketing Campaign",
      status: "pending",
      dueDate: "2024-02-28",
      progress: 20,
    },
  ];

  const meetings = [
    {
      meetingTitle: "Weekly Standup",
      time: "2024-01-15T10:00:00Z",
      link: "https://meet.google.com/abc-def-ghi",
      attendees: ["John", "Sarah", "Mike"],
    },
    {
      meetingTitle: "Project Review",
      time: "2024-01-16T14:00:00Z",
      link: "https://zoom.us/j/123456789",
      attendees: ["John", "Sarah", "Mike", "Lisa"],
    },
    {
      meetingTitle: "Client Presentation",
      time: "2024-01-17T09:30:00Z",
      link: "https://teams.microsoft.com/l/meetup-join/...",
      attendees: ["John", "Sarah"],
    },
  ];

  const notifications = [
    {
      type: "message",
      message: "Sarah sent you a message about the website redesign",
      time: "2024-01-15T08:30:00Z",
      unread: true,
    },
    {
      type: "milestone",
      message: "Project 'Mobile App' reached 50% completion",
      time: "2024-01-15T07:15:00Z",
      unread: true,
    },
    {
      type: "file",
      message: "New design files uploaded to Brand Identity project",
      time: "2024-01-14T16:45:00Z",
      unread: false,
    },
    {
      type: "meeting",
      message: "Weekly Standup meeting starting in 30 minutes",
      time: "2024-01-14T09:30:00Z",
      unread: false,
    },
    {
      type: "user",
      message: "Mike joined the Marketing Campaign project",
      time: "2024-01-14T14:20:00Z",
      unread: false,
    },
  ];

  const handleProjectClick = (project) => {
    console.log("Project clicked:", project);
    // Navigate to project page using Next.js router
    router.push(`/projects/${project.id || '1'}`);
  };

  const handleMeetingClick = (meeting) => {
    console.log("Meeting clicked:", meeting);
  };

  const handleJoinClick = (link) => {
    console.log("Joining meeting:", link);
  };

  const handleNotificationItemClick = (notification) => {
    console.log("Notification item clicked:", notification);
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            change={stat.change}
            changeType={stat.changeType}
          />
        ))}
      </div>

      {/* Row 2: Projects and Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Active Projects</h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  projectName={project.projectName}
                  status={project.status}
                  dueDate={project.dueDate}
                  progress={project.progress}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Upcoming Meetings</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {meetings.map((meeting, index) => (
                <MeetingCard
                  key={index}
                  meetingTitle={meeting.meetingTitle}
                  time={meeting.time}
                  link={meeting.link}
                  attendees={meeting.attendees}
                  onClick={() => handleMeetingClick(meeting)}
                  onJoinClick={handleJoinClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Notifications */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-neutral-900">Recent Activity</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
            View All
          </button>
        </div>
        <NotificationList
          notifications={notifications}
          onNotificationClick={handleNotificationItemClick}
        />
      </div>
    </div>
  );
}