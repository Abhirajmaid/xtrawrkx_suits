"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Search,
  CheckSquare,
  Calendar,
  Star,
  Folder,
  DollarSign,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  Clock,
  FileText,
  MapPin,
  Plus,
  CheckCircle,
  Circle,
  AlertTriangle,
  Eye,
  Edit,
  User,
  Users,
  Phone,
  Bell,
  ChevronRight,
} from "lucide-react";
// import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Dashboard Stats
const dashboardStats = [
  {
    title: "Active Projects",
    value: "12",
    change: "+15%",
    changeType: "increase",
    icon: Folder,
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100",
  },
  {
    title: "Total Earnings",
    value: "$45,850",
    change: "+8.2%",
    changeType: "increase",
    icon: DollarSign,
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-green-100",
  },
  {
    title: "Community Rank",
    value: "Elite",
    change: "+2 positions",
    changeType: "increase",
    icon: Award,
    color: "from-yellow-500 to-orange-500",
    bgColor: "from-yellow-50 to-orange-100",
  },
  {
    title: "Task Completion",
    value: "89%",
    change: "+12%",
    changeType: "increase",
    icon: Target,
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100",
  },
];

// Communities data - major section
const communitiesData = [
  {
    id: 1,
    name: "XEN",
    fullName: "XEN Entrepreneurs Network",
    category: "Business Division",
    description:
      "Early-stage startup community focused on innovation and growth",
    members: 1247,
    tier: "Premium",
    status: "Active",
    tags: ["Startup Support", "Networking"],
    logo: "/images/logos/xen-logo.png",
    color: "blue-500",
    isMember: true,
    userTier: "x3",
    userTierName: "Growth Member",
    canUpgrade: true,
    nextTier: "x4",
    nextTierName: "Scale Member",
  },
  {
    id: 2,
    name: "XEV.FiN",
    fullName: "XEV Financial Network",
    category: "Investment Division",
    description: "Investment & funding network for entrepreneurs and investors",
    members: 523,
    tier: "Elite",
    status: "Active",
    tags: ["Investment", "Funding"],
    logo: "/images/logos/xevfin-logo.png",
    color: "green-500",
    isMember: false,
    userTier: null,
    userTierName: null,
    canUpgrade: false,
    nextTier: null,
    nextTierName: null,
  },
  {
    id: 3,
    name: "XEVTG",
    fullName: "XEV Tech Talent Group",
    category: "Technology Division",
    description: "Technology professionals network for skill development",
    members: 2156,
    tier: "Standard",
    status: "Active",
    tags: ["Tech Skills", "Career Growth"],
    logo: "/images/logos/xevtg-logo.png",
    color: "purple-500",
    isMember: true,
    userTier: "x1",
    userTierName: "Starter Member",
    canUpgrade: false,
    nextTier: null,
    nextTierName: null,
  },
];

// Tasks data for dashboard
const dashboardTasksData = [
  {
    id: "t1",
    title: "Design new landing page",
    description:
      "Create wireframes and mockups for the new landing page design",
    status: "todo",
    priority: "high",
    project: "Event Organization Website",
    assignee: "Gabrial Matula",
    dueDate: "2024-02-15",
    estimatedHours: 8,
    tags: ["design", "frontend"],
    progress: 60,
    createdBy: "me",
  },
  {
    id: "t2",
    title: "Implement user authentication",
    description: "Set up OAuth2 and JWT token management",
    status: "in-progress",
    priority: "urgent",
    project: "Event Organization Website",
    assignee: "Gabrial Matula",
    dueDate: "2024-02-10",
    estimatedHours: 12,
    tags: ["backend", "security"],
    progress: 75,
    createdBy: "me",
  },
  {
    id: "t3",
    title: "Database optimization",
    description: "Optimize queries and add proper indexing",
    status: "in-progress",
    priority: "high",
    project: "Health Mobile App Design",
    assignee: "Layla Amora",
    dueDate: "2024-02-18",
    estimatedHours: 6,
    tags: ["database", "optimization"],
    progress: 40,
    createdBy: "shared",
  },
  {
    id: "t4",
    title: "Code review for payment module",
    description:
      "Review the implementation of the new payment processing module",
    status: "review",
    priority: "high",
    project: "Advance SEO Service",
    assignee: "Ansel Finn",
    dueDate: "2024-02-12",
    estimatedHours: 2,
    tags: ["code-review", "payments"],
    progress: 90,
    createdBy: "shared",
  },
];

// Projects data
const projectsData = [
  {
    id: 1,
    title: "Event Organization Website",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    hourlyRate: "$40.00/hr",
    totalSpend: "$3700 Spend",
    daysLeft: "15 Days left",
    documentsSubmitted: "2 Docs submitted",
    assignedPerson: {
      name: "Gabrial Matula",
      role: "Web Developer",
      location: "Las Vegas, Nevada",
      time: "01:23 pm",
      rating: "4.7/5",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    milestones: [
      { name: "Project start", date: "27 Oct, 20", completed: true },
      { name: "Milestone 1", date: "15 Nov, 20", completed: true },
      { name: "Milestone 2", date: "30 Nov, 20", completed: true },
      { name: "Milestone 3", date: "15 Dec, 20", completed: false },
      { name: "Milestone 4", date: "30 Dec, 20", completed: false },
    ],
  },
  {
    id: 2,
    title: "Health Mobile App Design",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    hourlyRate: "$40.00/hr",
    totalSpend: "$2500 Spend",
    daysLeft: "12 Days left",
    documentsSubmitted: "3 Docs submitted",
    assignedPerson: {
      name: "Layla Amora",
      role: "UX UI Designer",
      location: "Las Vegas, Nevada",
      time: "02:45 pm",
      rating: "4.9/5",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47e?w=40&h=40&fit=crop&crop=face",
    },
    milestones: [
      { name: "Project start", date: "15 Nov, 20", completed: true },
      { name: "Milestone 1", date: "30 Nov, 20", completed: true },
      { name: "Milestone 2", date: "15 Dec, 20", completed: true },
      { name: "Milestone 3", date: "30 Dec, 20", completed: false },
      { name: "Milestone 4", date: "15 Jan, 21", completed: false },
    ],
  },
  {
    id: 3,
    title: "Advance SEO Service",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    hourlyRate: "$20.00/hr",
    totalSpend: "$1500 Spend",
    daysLeft: "2 Days left",
    documentsSubmitted: "4 Docs submitted",
    assignedPerson: {
      name: "Ansel Finn",
      role: "SEO Expert",
      location: "Las Vegas, Nevada",
      time: "03:12 pm",
      rating: "4.7/5",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
    milestones: [
      { name: "Project start", date: "01 Dec, 20", completed: true },
      { name: "Milestone 1", date: "10 Dec, 20", completed: true },
      { name: "Milestone 2", date: "20 Dec, 20", completed: true },
      { name: "Milestone 3", date: "30 Dec, 20", completed: true },
      { name: "Milestone 4", date: "05 Jan, 21", completed: false },
    ],
  },
];

// Recent activities
const recentActivities = [
  {
    id: 1,
    type: "project_update",
    title: "Project milestone completed",
    description: "Brand redesign Phase 1 completed successfully",
    time: "2 hours ago",
    icon: CheckSquare,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "earnings",
    title: "Payment received",
    description: "$2,500 payment from ABC Inc processed",
    time: "4 hours ago",
    icon: DollarSign,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "community",
    title: "Community rank updated",
    description: "Promoted to Elite tier in XEV.FiN community",
    time: "1 day ago",
    icon: Award,
    color: "text-yellow-600",
  },
];

// Quick actions for the dropdown
const quickActions = [
  {
    id: 1,
    title: "New Project",
    description: "Start a new project",
    icon: Folder,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    title: "New Task",
    description: "Create a new task",
    icon: CheckSquare,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    title: "New Event",
    description: "Schedule an event",
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 4,
    title: "New Message",
    description: "Send a message",
    icon: FileText,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [taskFilter, setTaskFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      console.log("Search for:", searchQuery);
    }
  };

  // Filter tasks based on selected filter
  const getFilteredTasks = () => {
    switch (taskFilter) {
      case "upcoming":
        return dashboardTasksData.filter((task) => task.status === "todo");
      case "ongoing":
        return dashboardTasksData.filter(
          (task) => task.status === "in-progress"
        );
      case "completed":
        return dashboardTasksData.filter(
          (task) => task.status === "completed" || task.status === "review"
        );
      default:
        return dashboardTasksData;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "review":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen p-4">
      <div className="w-full space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Centered Greeting */}
          <div className="text-center my-4 ">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Good Morning, Homies
            </h1>
            <p className="text-gray-600 mt-1 text-lg">
              It&apos;s{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Centered Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
              />
            </div>
          </div>

          {/* Centered Action Buttons */}
          <div className="flex items-center justify-center space-x-3">
            <ModernButton type="secondary" icon={Calendar} text="Calendar" />

            {/* Animated Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <ModernButton
                type="primary"
                text="New"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative"
              />

              {/* Dropdown Menu */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{
                  opacity: isDropdownOpen ? 1 : 0,
                  y: isDropdownOpen ? 0 : -10,
                  scale: isDropdownOpen ? 1 : 0.95,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 z-50 ${
                  isDropdownOpen ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2 mb-2">
                    Quick Actions
                  </div>
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={action.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: isDropdownOpen ? 1 : 0,
                          x: isDropdownOpen ? 0 : -20,
                        }}
                        transition={{
                          delay: isDropdownOpen ? index * 0.05 : 0,
                          duration: 0.2,
                        }}
                        className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group"
                        onClick={() => {
                          console.log(`Clicked ${action.title}`);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div
                          className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                        >
                          <Icon className={`h-5 w-5 ${action.color}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-900 text-sm">
                            {action.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {action.description}
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tasks & Projects */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tasks Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    My Tasks
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Track your current tasks and progress
                  </p>
                </div>
                <ModernButton type="secondary" icon={Plus} text="New Task" />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center space-x-2 mb-6">
                <button
                  onClick={() => setTaskFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    taskFilter === "all"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  All Tasks
                </button>
                <button
                  onClick={() => setTaskFilter("upcoming")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    taskFilter === "upcoming"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setTaskFilter("ongoing")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    taskFilter === "ongoing"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  Ongoing
                </button>
                <button
                  onClick={() => setTaskFilter("completed")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    taskFilter === "completed"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  Completed
                </button>
              </div>

              {/* Tasks Table */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/80 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Task
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assignee
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created By
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getFilteredTasks().map((task) => (
                        <motion.tr
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.1 + parseInt(task.id.slice(1)) * 0.05,
                          }}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(task.status)}
                              <div className="ml-3 flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  {task.title}
                                </div>
                                <div className="text-sm text-gray-500 line-clamp-1">
                                  {task.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {task.project}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
                                />
                                <AvatarFallback className="text-xs">
                                  {task.assignee.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {task.assignee}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                            {isOverdue(task.dueDate) &&
                              task.status !== "completed" && (
                                <div className="text-xs text-red-600">
                                  Overdue
                                </div>
                              )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                task.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : task.status === "in-progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : task.status === "review"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {task.status.charAt(0).toUpperCase() +
                                task.status.slice(1).replace("-", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(task.priority)}`}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    task.progress >= 80
                                      ? "bg-green-500"
                                      : task.progress >= 60
                                        ? "bg-blue-500"
                                        : task.progress >= 40
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                  }`}
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {task.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {task.createdBy === "me" ? (
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm text-gray-900">
                                    Me
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <Users className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-gray-900">
                                    Shared
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors duration-200"
                                title="View Task"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors duration-200"
                                title="Edit Task"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Projects Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Project Overview
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Track your ongoing projects
                  </p>
                </div>
                <ModernButton type="secondary" icon={Folder} text="View All" />
              </div>

              <div className="space-y-6">
                {projectsData.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + project.id * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 p-6"
                  >
                    <div className="flex items-start justify-between">
                      {/* Left Section - Project Details */}
                      <div className="flex-1 pr-6">
                        {/* Project Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {project.title}
                        </h3>

                        {/* Project Description */}
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Key Metrics Row */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <DollarSign className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Hourly Rate
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {project.hourlyRate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <DollarSign className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Total Spend
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {project.totalSpend}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Days Left
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {project.daysLeft}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Documents
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {project.documentsSubmitted}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Project Timeline */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between relative">
                            {project.milestones.map((milestone, index) => (
                              <div
                                key={index}
                                className="flex flex-col items-center relative"
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                    milestone.completed
                                      ? "bg-purple-600 text-white"
                                      : "bg-white border-2 border-purple-600 text-purple-600"
                                  }`}
                                >
                                  <div className="w-2 h-2 rounded-full bg-current"></div>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs font-medium text-gray-700">
                                    {milestone.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {milestone.date}
                                  </p>
                                </div>
                                {index < project.milestones.length - 1 && (
                                  <div
                                    className={`absolute top-4 left-1/2 w-full h-0.5 ${
                                      milestone.completed
                                        ? "bg-purple-600"
                                        : "bg-gray-300"
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
                      </div>

                      {/* Right Section - Assigned Person */}
                      <div className="w-64 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                        <div className="text-center">
                          {/* Profile Picture */}
                          <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-white shadow-md">
                            <AvatarImage src={project.assignedPerson.avatar} />
                            <AvatarFallback className="text-lg font-semibold">
                              {project.assignedPerson.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          {/* Name */}
                          <h4 className="font-bold text-gray-900 text-lg mb-1">
                            {project.assignedPerson.name}
                          </h4>

                          {/* Role */}
                          <p className="text-sm text-gray-600 mb-3">
                            {project.assignedPerson.role}
                          </p>

                          {/* Location */}
                          <div className="flex items-center justify-center space-x-1 mb-2">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              {project.assignedPerson.location}
                            </span>
                          </div>

                          {/* Time */}
                          <div className="flex items-center justify-center space-x-1 mb-2">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              {project.assignedPerson.time}
                            </span>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center justify-center space-x-1 mb-4">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-medium text-gray-700">
                              {project.assignedPerson.rating}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <ModernButton
                              type="primary"
                              text="Contact"
                              size="xs"
                              className="w-full"
                            />
                            <ModernButton
                              type="secondary"
                              text="View Details"
                              size="xs"
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats, Communities, Activities & Quick Access */}
          <div className="space-y-8">
            {/* Dashboard Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`bg-gradient-to-br ${stat.bgColor} rounded-xl p-4 shadow-lg border border-white/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-md`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div
                          className={`flex items-center space-x-1 text-xs font-medium ${
                            stat.changeType === "increase"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.changeType === "increase" ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          <span>{stat.change}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {stat.value}
                      </h3>
                      <p className="text-gray-600 text-xs font-medium">
                        {stat.title}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Communities Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    My Communities
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm">
                    Your active community memberships
                  </p>
                </div>
                <ModernButton type="primary" text="Join" size="sm" />
              </div>

              <div className="space-y-4">
                {communitiesData.map((community) => {
                  return (
                    <motion.div
                      key={community.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 0.5 + community.id * 0.1,
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      whileHover={{
                        y: -2,
                        scale: 1.01,
                        transition: { duration: 0.3, ease: "easeOut" },
                      }}
                      className={`group relative overflow-hidden rounded-xl border border-white/50 transition-all duration-300 ${
                        community.isMember
                          ? "shadow-md bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 backdrop-blur-sm"
                          : "shadow-md bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm"
                      }`}
                    >
                      {/* Content */}
                      <motion.div
                        className="relative z-10 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          delay: 0.6 + community.id * 0.1,
                          duration: 0.4,
                        }}
                      >
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="relative group/logo">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md relative overflow-hidden bg-white/80 backdrop-blur-sm border border-white/50">
                                <Image
                                  src={community.logo}
                                  alt={`${community.name} logo`}
                                  width={24}
                                  height={24}
                                  className="w-6 h-6 object-contain transition-transform duration-300 group-hover/logo:scale-110"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                                <div className="w-6 h-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg items-center justify-center hidden">
                                  <span className="text-xs font-bold text-gray-600">
                                    {community.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              {community.isMember && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                                  <Crown className="h-1.5 w-1.5 text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-sm mb-0.5">
                                {community.name}
                              </h3>
                              <p className="text-xs text-gray-500 font-medium">
                                {community.category}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <div
                              className={`text-xs px-2 py-1 rounded-lg font-semibold shadow-sm ${
                                community.isMember
                                  ? "bg-white/80 text-green-700 border border-green-200/50 backdrop-blur-sm"
                                  : "bg-white/80 text-gray-700 border border-gray-200/50 backdrop-blur-sm"
                              }`}
                            >
                              {community.isMember ? "Member" : community.status}
                            </div>
                            {community.isMember &&
                              community.name !== "XEVTG" && (
                                <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-lg font-bold shadow-md">
                                  {community.userTier?.toUpperCase()}
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-xs mb-3 leading-relaxed font-medium line-clamp-2">
                          {community.description}
                        </p>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          {community.isMember ? (
                            <>
                              <ModernButton
                                type="primary"
                                text="View Community"
                                size="xs"
                                className="w-full"
                              />
                              {community.canUpgrade && (
                                <ModernButton
                                  type="secondary"
                                  text={`Upgrade to ${community.nextTier}`}
                                  size="xs"
                                  icon={Star}
                                  className="w-full"
                                />
                              )}
                            </>
                          ) : (
                            <ModernButton
                              type="secondary"
                              text="Join Community"
                              size="xs"
                              className="w-full"
                            />
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Recent Activities
                  </h3>
                  <p className="text-gray-600 mt-1">Your latest updates</p>
                </div>
                <ModernButton type="secondary" size="sm" text="View All" />
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + activity.id * 0.1 }}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 p-4"
                    >
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 ${
                            activity.type === "project_update"
                              ? "bg-green-100"
                              : activity.type === "earnings"
                                ? "bg-blue-100"
                                : activity.type === "community"
                                  ? "bg-yellow-100"
                                  : "bg-gray-100"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              activity.type === "project_update"
                                ? "text-green-600"
                                : activity.type === "earnings"
                                  ? "text-blue-600"
                                  : activity.type === "community"
                                    ? "text-yellow-600"
                                    : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                            {activity.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 font-medium">
                              {activity.time}
                            </p>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                activity.type === "project_update"
                                  ? "bg-green-500"
                                  : activity.type === "earnings"
                                    ? "bg-blue-500"
                                    : activity.type === "community"
                                      ? "bg-yellow-500"
                                      : "bg-gray-500"
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Schedule/Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-100/30 to-blue-100/30 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Today&apos;s Schedule
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <ModernButton
                    type="secondary"
                    size="sm"
                    icon={Calendar}
                    text="View Calendar"
                    className="shadow-sm hover:shadow-md"
                  />
                </div>

                <div className="space-y-4">
                  {/* Team Meeting */}
                  <motion.div
                    className="group relative bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                        <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-30"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 text-base group-hover:text-blue-700 transition-colors">
                            Team Meeting
                          </h4>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            In Progress
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <p className="text-sm text-gray-600">
                            10:00 AM - 11:00 AM
                          </p>
                          <span className="text-xs text-gray-500">•</span>
                          <p className="text-xs text-gray-500">
                            45 min remaining
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Project Review */}
                  <motion.div
                    className="group relative bg-gradient-to-r from-amber-50 to-yellow-100/50 rounded-2xl border border-amber-200/50 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-4 h-4 bg-amber-500 rounded-full shadow-sm"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 text-base group-hover:text-amber-700 transition-colors">
                            Project Review
                          </h4>
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                            Upcoming
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <p className="text-sm text-gray-600">
                            2:00 PM - 3:30 PM
                          </p>
                          <span className="text-xs text-gray-500">•</span>
                          <p className="text-xs text-gray-500">
                            Starts in 2h 15m
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-sm">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Client Call */}
                  <motion.div
                    className="group relative bg-gradient-to-r from-green-50 to-emerald-100/50 rounded-2xl border border-green-200/50 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 text-base group-hover:text-green-700 transition-colors">
                            Client Call
                          </h4>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            Scheduled
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <p className="text-sm text-gray-600">
                            4:00 PM - 5:00 PM
                          </p>
                          <span className="text-xs text-gray-500">•</span>
                          <p className="text-xs text-gray-500">
                            Starts in 4h 15m
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                          <Phone className="w-4 h-4 text-white" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Footer with notification badge */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Bell className="w-4 h-4" />
                    <span>4 notifications pending</span>
                  </div>
                  <div className="relative">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
