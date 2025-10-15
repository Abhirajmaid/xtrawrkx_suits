"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AuthService from "../../lib/authService";
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
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    auth: 0,
    profile: 0,
    security: 0,
    admin: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch activities from the backend
  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedFilter !== "all") params.append("type", selectedFilter);
      if (selectedTimeRange) params.append("timeRange", selectedTimeRange);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      params.append("limit", "50");

      const response = await AuthService.apiRequest(
        `/auth/all-activities?${params.toString()}`
      );

      if (response.success) {
        const enrichedActivities = response.activities.map((activity) => ({
          ...activity,
          // Map backend activity types to frontend display
          icon: getActivityIcon(activity.type, activity.activityType),
          color: getActivityColor(activity.type, activity.status),
          severity: getActivitySeverity(activity.type, activity.status),
          user: activity.user?.name || `User ${activity.userId}`,
          userEmail: activity.user?.email || "unknown@example.com",
          device: getDeviceFromUserAgent(activity.userAgent),
          location: getLocationFromIP(activity.ipAddress),
        }));

        setActivities(enrichedActivities);
        setStats({
          total: response.stats?.total || 0,
          auth: response.stats?.auth || 0,
          profile: response.stats?.profile || 0,
          security: response.stats?.security || 0,
          admin: response.stats?.admin || 0,
        });
      } else {
        throw new Error(response.message || "Failed to fetch activities");
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to load activities. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to map backend data to frontend display
  const getActivityIcon = (type, activityType) => {
    const typeMap = {
      AUTH: Shield,
      PROFILE: User,
      SECURITY: Key,
      ADMIN: Settings,
    };
    return typeMap[type] || Activity;
  };

  const getActivityColor = (type, status) => {
    if (status === "FAILED") return "text-red-600 bg-red-100";

    const colorMap = {
      AUTH: "text-green-600 bg-green-100",
      PROFILE: "text-indigo-600 bg-indigo-100",
      SECURITY: "text-blue-600 bg-blue-100",
      ADMIN: "text-purple-600 bg-purple-100",
    };
    return colorMap[type] || "text-gray-600 bg-gray-100";
  };

  const getActivitySeverity = (type, status) => {
    if (status === "FAILED") return "critical";
    if (type === "ADMIN") return "high";
    if (type === "SECURITY") return "medium";
    return "info";
  };

  const getDeviceFromUserAgent = (userAgent) => {
    if (!userAgent) return "Unknown";
    if (userAgent.includes("Mobile")) return "Mobile";
    if (userAgent.includes("Tablet")) return "Tablet";
    return "Desktop";
  };

  const getLocationFromIP = (ipAddress) => {
    // In a real app, you'd use a geolocation service
    if (!ipAddress) return "Unknown";
    if (ipAddress.startsWith("192.168")) return "Local Network";
    return "External";
  };

  // Export activities to CSV
  const exportActivities = () => {
    try {
      const csvHeaders = [
        "Timestamp",
        "User",
        "Email",
        "Action",
        "Description",
        "Type",
        "Status",
        "IP Address",
        "Device",
        "Location",
      ];

      const csvData = activities.map((activity) => [
        new Date(activity.timestamp).toLocaleString(),
        activity.user,
        activity.userEmail,
        activity.action,
        activity.description,
        activity.type,
        activity.status || "COMPLETED",
        activity.ipAddress || "Unknown",
        activity.device,
        activity.location,
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvData.map((row) =>
          row
            .map((cell) =>
              typeof cell === "string" && cell.includes(",")
                ? `"${cell.replace(/"/g, '""')}"`
                : cell
            )
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `activity-log-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting activities:", error);
      alert("Failed to export activities. Please try again.");
    }
  };

  // Fetch activities on component mount and when filters change
  useEffect(() => {
    fetchActivities();
  }, [selectedFilter, selectedTimeRange]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchActivities();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const activityTypes = [
    { id: "all", label: "All Activities", count: stats.total },
    { id: "auth", label: "Authentication", count: stats.auth },
    { id: "profile", label: "Profile Changes", count: stats.profile },
    { id: "security", label: "Security", count: stats.security },
    { id: "admin", label: "Admin Actions", count: stats.admin },
  ];

  const timeRanges = [
    { id: "1d", label: "Last 24 hours" },
    { id: "7d", label: "Last 7 days" },
    { id: "30d", label: "Last 30 days" },
    { id: "90d", label: "Last 90 days" },
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

  // Activities are already filtered by the backend, but we can add client-side search if needed
  const filteredActivities = activities;

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
            <button
              onClick={exportActivities}
              className="flex items-center gap-2 px-4 py-2 glass-button rounded-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
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
            value: stats.total.toString(),
            change: "+12%",
            icon: Activity,
            color: "from-blue-500 to-blue-600",
          },
          {
            title: "Security Events",
            value: stats.security.toString(),
            change: "-5%",
            icon: Shield,
            color: "from-green-500 to-green-600",
          },
          {
            title: "Authentication",
            value: stats.auth.toString(),
            change: "+8%",
            icon: Key,
            color: "from-red-500 to-red-600",
          },
          {
            title: "Admin Actions",
            value: stats.admin.toString(),
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
        {error && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Activities
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchActivities}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {isLoading && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading Activities
            </h3>
            <p className="text-gray-600">
              Fetching the latest activity data...
            </p>
          </div>
        )}

        {!isLoading && !error && filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Activities Found
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedFilter === "all" && !searchQuery.trim()
                ? "No activities have been logged yet. Activities will appear here when users perform actions like logging in, updating profiles, or when admins manage users."
                : "No activities match your current filters. Try adjusting your search criteria or time range."}
            </p>
            {selectedFilter === "all" && !searchQuery.trim() && (
              <div className="text-sm text-gray-500">
                <p>Activities are automatically logged when:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Users log in or out</li>
                  <li>• Profile information is updated</li>
                  <li>• Passwords are changed</li>
                  <li>• New users are created</li>
                  <li>• User roles are modified</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {!isLoading && !error && filteredActivities.length > 0 && (
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
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadge(
                            activity.severity
                          )}`}
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
        )}

        {/* Load More */}
        {!isLoading && !error && filteredActivities.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={fetchActivities}
              className="px-6 py-2 glass-button rounded-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Refresh Activities
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
