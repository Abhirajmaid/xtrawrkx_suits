"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  Clock,
  FileText,
  MoreVertical,
  Edit,
  Share,
  Download,
  CheckCircle2,
  Circle,
  AlertCircle,
  TrendingUp,
  Target,
  Activity,
} from "lucide-react";
import Link from "next/link";
import ModernButton from "@/components/ui/ModernButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

// Mock project data
const projectData = {
  id: 1,
  name: "Event Organization Website",
  client: "EventPro Inc",
  description:
    "A comprehensive event management platform that allows users to create, manage, and promote events. The platform includes features for ticket sales, attendee management, payment processing, and event analytics.",
  status: "In Progress",
  progress: 75,
  priority: "High",
  health: "Good",
  budget: 15000,
  spent: 11250,
  hourlyRate: 40,
  startDate: "2024-01-15",
  endDate: "2024-03-15",
  daysLeft: 15,
  documentsSubmitted: 2,
  team: [
    {
      name: "Gabrial Matula",
      role: "Web Developer",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      email: "gabrial@company.com",
    },
    {
      name: "Sarah Johnson",
      role: "UI/UX Designer",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47e?w=40&h=40&fit=crop&crop=face",
      email: "sarah@company.com",
    },
  ],
  milestones: [
    { name: "Project start", date: "27 Oct, 20", completed: true },
    { name: "Milestone 1", date: "15 Nov, 20", completed: true },
    { name: "Milestone 2", date: "30 Nov, 20", completed: true },
    { name: "Milestone 3", date: "15 Dec, 20", completed: false },
    { name: "Milestone 4", date: "30 Dec, 20", completed: false },
  ],
  recentActivities: [
    {
      id: 1,
      type: "milestone",
      title: "Milestone 2 completed",
      description: "User authentication module completed successfully",
      time: "2 hours ago",
      user: "Gabrial Matula",
    },
    {
      id: 2,
      type: "comment",
      title: "New comment added",
      description: "Client provided feedback on the dashboard design",
      time: "4 hours ago",
      user: "Sarah Johnson",
    },
    {
      id: 3,
      type: "file",
      title: "Document uploaded",
      description: "Updated project requirements document",
      time: "1 day ago",
      user: "Gabrial Matula",
    },
  ],
};

export default function ProjectDetailsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status) => {
    const colors = {
      Planning: "bg-blue-100 text-blue-700 border-blue-200",
      "In Progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
      Completed: "bg-green-100 text-green-700 border-green-200",
      "On Hold": "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getHealthColor = (health) => {
    const colors = {
      Excellent: "bg-green-100 text-green-700",
      Good: "bg-blue-100 text-blue-700",
      "At Risk": "bg-yellow-100 text-yellow-700",
      Critical: "bg-red-100 text-red-700",
    };
    return colors[health] || "bg-gray-100 text-gray-700";
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "milestone":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "comment":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "file":
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="w-full space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link href="/projects">
              <ModernButton
                type="secondary"
                icon={ArrowLeft}
                text="Back to Projects"
                size="sm"
              />
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                    {projectData.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {projectData.client}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {projectData.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1 rounded-xl text-sm font-medium border ${getStatusColor(projectData.status)}`}
                  >
                    {projectData.status}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-xl text-sm font-medium ${getHealthColor(projectData.health)}`}
                  >
                    {projectData.health}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">
                    Project Progress
                  </span>
                  <span className="font-bold text-gray-900">
                    {projectData.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${projectData.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Hourly Rate</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    ${projectData.hourlyRate}/hr
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Total Spend</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    ${projectData.spent.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-gray-600">Days Left</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {projectData.daysLeft}
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Documents</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {projectData.documentsSubmitted}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ModernButton
                type="secondary"
                icon={Edit}
                text="Edit Project"
                size="sm"
              />
              <ModernButton
                type="secondary"
                icon={Share}
                text="Share"
                size="sm"
              />
              <ModernButton
                type="primary"
                icon={Download}
                text="Export"
                size="sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            {[
              { key: "overview", label: "Overview" },
              { key: "timeline", label: "Timeline" },
              { key: "team", label: "Team" },
              { key: "activities", label: "Activities" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Details */}
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Project Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Start Date</span>
                      <span className="font-medium">
                        {new Date(projectData.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">End Date</span>
                      <span className="font-medium">
                        {new Date(projectData.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Budget</span>
                      <span className="font-medium">
                        ${projectData.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Priority</span>
                      <span className="font-medium">
                        {projectData.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Budget Breakdown */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Budget Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Budget</span>
                      <span className="font-medium">
                        ${projectData.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Amount Spent</span>
                      <span className="font-medium">
                        ${projectData.spent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Remaining</span>
                      <span className="font-medium">
                        $
                        {(
                          projectData.budget - projectData.spent
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(projectData.spent / projectData.budget) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Team Members
                </h3>
                <div className="space-y-4">
                  {projectData.team.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white/50 rounded-xl"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {member.name}
                        </h4>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Project Timeline
              </h3>
              <div className="flex items-center justify-between">
                {projectData.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center relative"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                        milestone.completed
                          ? "bg-green-600 text-white"
                          : "bg-white border-2 border-gray-300 text-gray-600"
                      }`}
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        {milestone.name}
                      </p>
                      <p className="text-xs text-gray-500">{milestone.date}</p>
                    </div>
                    {index < projectData.milestones.length - 1 && (
                      <div
                        className={`absolute top-4 left-1/2 w-full h-0.5 ${
                          milestone.completed ? "bg-green-600" : "bg-gray-300"
                        }`}
                        style={{
                          transform: "translateX(50%)",
                          width: "calc(100% - 2rem)",
                        }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="space-y-6">
              {projectData.team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-lg">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 mb-1">
                        {member.name}
                      </h4>
                      <p className="text-gray-600 mb-2">{member.role}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ModernButton type="secondary" text="Contact" size="sm" />
                      <ModernButton
                        type="primary"
                        text="View Profile"
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "activities" && (
            <div className="space-y-4">
              {projectData.recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">{activity.user}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
