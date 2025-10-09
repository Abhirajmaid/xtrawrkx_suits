"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  User,
  Shield,
  Key,
  Mail,
  Phone,
  Building,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Filter,
  Download,
  Search,
  Calendar,
  Eye,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  Edit,
  Trash2,
} from "lucide-react";

export default function ActivityPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [searchQuery, setSearchQuery] = useState("");

  const activityTypes = [
    { id: "all", label: "All Activities", count: 156 },
    { id: "auth", label: "Authentication", count: 45 },
    { id: "profile", label: "Profile Changes", count: 23 },
    { id: "security", label: "Security", count: 18 },
    { id: "admin", label: "Admin Actions", count: 70 },
  ];

  const timeRanges = [
    { id: "1d", label: "Last 24 hours" },
    { id: "7d", label: "Last 7 days" },
    { id: "30d", label: "Last 30 days" },
    { id: "90d", label: "Last 90 days" },
  ];

  const activities = [
    {
      id: 1,
      type: "auth",
      action: "User login",
      description: "Successful login from Chrome on Windows",
      user: "John Doe",
      userEmail: "john.doe@xtrawrkx.com",
      timestamp: "2024-01-15T14:30:00Z",
      ip: "192.168.1.100",
      location: "New York, NY",
      device: "Desktop",
      icon: Shield,
      color: "text-green-600 bg-green-100",
      severity: "info",
    },
    {
      id: 2,
      type: "security",
      action: "Password changed",
      description: "User changed their password",
      user: "Jane Smith",
      userEmail: "jane.smith@xtrawrkx.com",
      timestamp: "2024-01-15T13:45:00Z",
      ip: "192.168.1.105",
      location: "Los Angeles, CA",
      device: "Mobile",
      icon: Key,
      color: "text-blue-600 bg-blue-100",
      severity: "medium",
    },
    {
      id: 3,
      type: "admin",
      action: "User created",
      description: "New user account created for Sales department",
      user: "Admin User",
      userEmail: "admin@xtrawrkx.com",
      timestamp: "2024-01-15T12:20:00Z",
      ip: "192.168.1.50",
      location: "New York, NY",
      device: "Desktop",
      icon: UserPlus,
      color: "text-purple-600 bg-purple-100",
      severity: "high",
    },
    {
      id: 4,
      type: "profile",
      action: "Profile updated",
      description: "User updated their contact information",
      user: "Mike Johnson",
      userEmail: "mike.johnson@xtrawrkx.com",
      timestamp: "2024-01-15T11:15:00Z",
      ip: "192.168.1.120",
      location: "Chicago, IL",
      device: "Desktop",
      icon: User,
      color: "text-indigo-600 bg-indigo-100",
      severity: "info",
    },
    {
      id: 5,
      type: "security",
      action: "Failed login attempt",
      description: "Multiple failed login attempts detected",
      user: "Unknown",
      userEmail: "unknown@example.com",
      timestamp: "2024-01-15T10:30:00Z",
      ip: "203.0.113.1",
      location: "Unknown",
      device: "Unknown",
      icon: AlertTriangle,
      color: "text-red-600 bg-red-100",
      severity: "critical",
    },
    {
      id: 6,
      type: "admin",
      action: "Role permissions updated",
      description: "Sales Manager role permissions modified",
      user: "Admin User",
      userEmail: "admin@xtrawrkx.com",
      timestamp: "2024-01-15T09:45:00Z",
      ip: "192.168.1.50",
      location: "New York, NY",
      device: "Desktop",
      icon: Shield,
      color: "text-orange-600 bg-orange-100",
      severity: "high",
    },
    {
      id: 7,
      type: "auth",
      action: "Two-factor authentication enabled",
      description: "User enabled 2FA for their account",
      user: "Sarah Wilson",
      userEmail: "sarah.wilson@xtrawrkx.com",
      timestamp: "2024-01-15T08:20:00Z",
      ip: "192.168.1.85",
      location: "Austin, TX",
      device: "Mobile",
      icon: Shield,
      color: "text-green-600 bg-green-100",
      severity: "medium",
    },
    {
      id: 8,
      type: "admin",
      action: "Department created",
      description: "New Marketing department created",
      user: "Admin User",
      userEmail: "admin@xtrawrkx.com",
      timestamp: "2024-01-14T16:30:00Z",
      ip: "192.168.1.50",
      location: "New York, NY",
      device: "Desktop",
      icon: Building,
      color: "text-cyan-600 bg-cyan-100",
      severity: "medium",
    },
  ];

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getDeviceIcon = (device) => {
    switch (device.toLowerCase()) {
      case "mobile":
        return Smartphone;
      case "tablet":
        return Tablet;
      case "desktop":
      default:
        return Monitor;
    }
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      info: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };
    return badges[severity] || badges.info;
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesFilter =
      selectedFilter === "all" || activity.type === selectedFilter;
    const matchesSearch =
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
              <p className="text-gray-600">
                Monitor system activities and user actions
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 glass-button rounded-lg font-medium text-gray-700 hover:text-gray-900 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total Activities",
            value: "1,234",
            change: "+12%",
            icon: Activity,
            color: "from-blue-500 to-blue-600",
          },
          {
            title: "Security Events",
            value: "89",
            change: "-5%",
            icon: Shield,
            color: "from-green-500 to-green-600",
          },
          {
            title: "Failed Logins",
            value: "23",
            change: "+8%",
            icon: AlertTriangle,
            color: "from-red-500 to-red-600",
          },
          {
            title: "Admin Actions",
            value: "156",
            change: "+15%",
            icon: Settings,
            color: "from-purple-500 to-purple-600",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    stat.change.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change} from last week
                </p>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Activity Type Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Type
            </label>
            <div className="flex flex-wrap gap-2">
              {activityTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedFilter(type.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === type.id
                      ? "bg-primary-500 text-white"
                      : "glass-button text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {type.label} ({type.count})
                </button>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className="lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Range
            </label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="w-full px-3 py-2 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {timeRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="lg:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities..."
                className="w-full pl-10 pr-4 py-2 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="glass-card rounded-2xl p-6">
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => {
            const DeviceIcon = getDeviceIcon(activity.device);

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 p-4 glass-card rounded-xl hover:shadow-lg transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.color}`}
                >
                  <activity.icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {activity.action}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadge(activity.severity)}`}
                      >
                        {activity.severity}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{activity.user}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>{activity.userEmail}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>{activity.ip}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{activity.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DeviceIcon className="w-3 h-3" />
                      <span>{activity.device}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-6 py-2 glass-button rounded-lg font-medium text-gray-700 hover:text-gray-900 transition-colors">
            Load More Activities
          </button>
        </div>
      </div>
    </div>
  );
}
