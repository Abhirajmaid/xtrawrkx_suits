"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Shield,
  Lock,
  TrendingUp,
  AlertTriangle,
  Clock,
  Building,
  BarChart3,
  Target,
  DollarSign,
  FileText,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  Eye,
  UserPlus,
  Settings,
} from "lucide-react";
import { useUser } from "./components/UserContext";

export default function DashboardPage() {
  const { currentUser, hasPermission, getRoleDisplayName } = useUser();

  // Role-specific stats
  const getStatsForRole = () => {
    const roleDisplayName = getRoleDisplayName();

    // Admin stats
    if (hasPermission("users")) {
      return [
        {
          label: "Total Users",
          value: 47,
          change: "+12%",
          changeType: "positive",
          icon: Users,
          color: "text-primary-600",
          bg: "bg-primary-50",
        },
        {
          label: "Active Users",
          value: 42,
          change: "+8%",
          changeType: "positive",
          icon: UserCheck,
          color: "text-green-600",
          bg: "bg-green-100",
        },
        {
          label: "Admin Users",
          value: 3,
          change: "0%",
          changeType: "neutral",
          icon: Shield,
          color: "text-red-600",
          bg: "bg-red-100",
        },
        {
          label: "MFA Enabled",
          value: 38,
          change: "+15%",
          changeType: "positive",
          icon: Lock,
          color: "text-blue-600",
          bg: "bg-blue-100",
        },
      ];
    }

    // Sales-focused stats
    if (roleDisplayName.includes("Sales")) {
      return [
        {
          label: "Active Leads",
          value: 156,
          change: "+23%",
          changeType: "positive",
          icon: Target,
          color: "text-green-600",
          bg: "bg-green-100",
        },
        {
          label: "Closed Deals",
          value: 34,
          change: "+18%",
          changeType: "positive",
          icon: TrendingUp,
          color: "text-blue-600",
          bg: "bg-blue-100",
        },
        {
          label: "Revenue",
          value: "$125K",
          change: "+32%",
          changeType: "positive",
          icon: DollarSign,
          color: "text-primary-600",
          bg: "bg-primary-50",
        },
        {
          label: "Accounts",
          value: 89,
          change: "+7%",
          changeType: "positive",
          icon: Briefcase,
          color: "text-purple-600",
          bg: "bg-purple-100",
        },
      ];
    }

    // Project Manager stats
    if (roleDisplayName.includes("Project")) {
      return [
        {
          label: "Active Projects",
          value: 12,
          change: "+3",
          changeType: "positive",
          icon: Briefcase,
          color: "text-blue-600",
          bg: "bg-blue-100",
        },
        {
          label: "Completed Tasks",
          value: 234,
          change: "+45%",
          changeType: "positive",
          icon: UserCheck,
          color: "text-green-600",
          bg: "bg-green-100",
        },
        {
          label: "Team Members",
          value: 8,
          change: "+1",
          changeType: "positive",
          icon: Users,
          color: "text-purple-600",
          bg: "bg-purple-100",
        },
        {
          label: "On Schedule",
          value: "92%",
          change: "+5%",
          changeType: "positive",
          icon: Clock,
          color: "text-primary-600",
          bg: "bg-primary-50",
        },
      ];
    }

    // Support stats
    if (roleDisplayName.includes("Support")) {
      return [
        {
          label: "Open Tickets",
          value: 23,
          change: "-12%",
          changeType: "positive",
          icon: AlertTriangle,
          color: "text-orange-600",
          bg: "bg-orange-100",
        },
        {
          label: "Resolved Today",
          value: 18,
          change: "+25%",
          changeType: "positive",
          icon: UserCheck,
          color: "text-green-600",
          bg: "bg-green-100",
        },
        {
          label: "Avg Response",
          value: "2.3h",
          change: "-15%",
          changeType: "positive",
          icon: Clock,
          color: "text-blue-600",
          bg: "bg-blue-100",
        },
        {
          label: "Customer Satisfaction",
          value: "4.8/5",
          change: "+0.2",
          changeType: "positive",
          icon: TrendingUp,
          color: "text-primary-600",
          bg: "bg-primary-50",
        },
      ];
    }

    // Marketing stats
    if (roleDisplayName.includes("Marketing")) {
      return [
        {
          label: "Campaigns",
          value: 8,
          change: "+2",
          changeType: "positive",
          icon: Target,
          color: "text-pink-600",
          bg: "bg-pink-100",
        },
        {
          label: "Leads Generated",
          value: 456,
          change: "+34%",
          changeType: "positive",
          icon: TrendingUp,
          color: "text-green-600",
          bg: "bg-green-100",
        },
        {
          label: "Email Opens",
          value: "24.5%",
          change: "+3.2%",
          changeType: "positive",
          icon: Mail,
          color: "text-blue-600",
          bg: "bg-blue-100",
        },
        {
          label: "Conversion Rate",
          value: "3.8%",
          change: "+0.5%",
          changeType: "positive",
          icon: Target,
          color: "text-primary-600",
          bg: "bg-primary-50",
        },
      ];
    }

    // Finance stats
    if (roleDisplayName.includes("Finance")) {
      return [
        {
          label: "Monthly Revenue",
          value: "$245K",
          change: "+18%",
          changeType: "positive",
          icon: DollarSign,
          color: "text-green-600",
          bg: "bg-green-100",
        },
        {
          label: "Expenses",
          value: "$89K",
          change: "-5%",
          changeType: "positive",
          icon: TrendingUp,
          color: "text-blue-600",
          bg: "bg-blue-100",
        },
        {
          label: "Profit Margin",
          value: "63.7%",
          change: "+2.1%",
          changeType: "positive",
          icon: BarChart3,
          color: "text-primary-600",
          bg: "bg-primary-50",
        },
        {
          label: "Outstanding",
          value: "$12K",
          change: "-8%",
          changeType: "positive",
          icon: AlertTriangle,
          color: "text-orange-600",
          bg: "bg-orange-100",
        },
      ];
    }

    // Default stats for other roles
    return [
      {
        label: "My Tasks",
        value: 12,
        change: "+3",
        changeType: "positive",
        icon: FileText,
        color: "text-blue-600",
        bg: "bg-blue-100",
      },
      {
        label: "Completed",
        value: 45,
        change: "+12",
        changeType: "positive",
        icon: UserCheck,
        color: "text-green-600",
        bg: "bg-green-100",
      },
      {
        label: "In Progress",
        value: 8,
        change: "-2",
        changeType: "positive",
        icon: Clock,
        color: "text-orange-600",
        bg: "bg-orange-100",
      },
      {
        label: "This Week",
        value: 23,
        change: "+5",
        changeType: "positive",
        icon: Calendar,
        color: "text-primary-600",
        bg: "bg-primary-50",
      },
    ];
  };

  const stats = getStatsForRole();

  const recentActivity = [
    {
      id: 1,
      user: "John Smith",
      action: "Updated profile",
      time: "2 minutes ago",
      type: "profile",
    },
    {
      id: 2,
      user: "Emily Davis",
      action: "Changed password",
      time: "15 minutes ago",
      type: "security",
    },
    {
      id: 3,
      user: "Sarah Wilson",
      action: "Enabled MFA",
      time: "1 hour ago",
      type: "security",
    },
    {
      id: 4,
      user: "Mike Johnson",
      action: "Updated permissions",
      time: "2 hours ago",
      type: "permissions",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "profile":
        return Users;
      case "security":
        return Lock;
      case "permissions":
        return Shield;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "profile":
        return "text-blue-600 bg-blue-100";
      case "security":
        return "text-green-600 bg-green-100";
      case "permissions":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getHeaderIcon = () => {
    if (!currentUser) return BarChart3;

    if (hasPermission("users")) {
      return Shield; // Admin icon
    }

    const roleDisplayName = getRoleDisplayName();

    if (roleDisplayName.includes("Sales")) {
      return Target;
    }
    if (roleDisplayName.includes("Project")) {
      return Briefcase;
    }
    if (roleDisplayName.includes("Marketing")) {
      return TrendingUp;
    }
    if (roleDisplayName.includes("Finance")) {
      return DollarSign;
    }
    if (roleDisplayName.includes("Support")) {
      return Phone;
    }
    if (roleDisplayName.includes("Read-only")) {
      return Eye;
    }

    return BarChart3; // Default dashboard icon
  };

  const HeaderIcon = getHeaderIcon();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <HeaderIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {hasPermission("users")
                ? "Admin Dashboard"
                : `${getRoleDisplayName()} Dashboard`}
            </h1>
            <p className="text-gray-600">
              {hasPermission("users")
                ? "Overview of user management and system activity"
                : `Welcome back, ${currentUser?.name || "User"}. Here's your overview.`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p
                  className={`text-xs mt-1 ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "negative"
                        ? "text-red-600"
                        : "text-gray-500"
                  }`}
                >
                  {stat.change} from last month
                </p>
              </div>
              <div
                className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-500">
                Latest user actions and changes
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div
                    className={`w-8 h-8 ${getActivityColor(activity.type)} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user}
                    </p>
                    <p className="text-xs text-gray-500">{activity.action}</p>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
              <p className="text-sm text-gray-500">
                {hasPermission("users")
                  ? "Common administrative tasks"
                  : "Your available actions"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {hasPermission("users") && (
              <Link
                href="/users/new"
                className="w-full flex items-center gap-3 p-4 text-left glass-button rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Add New User</p>
                  <p className="text-sm text-gray-500">
                    Create a new team member account
                  </p>
                </div>
              </Link>
            )}

            {hasPermission("permissions") && (
              <Link
                href="/users/roles"
                className="w-full flex items-center gap-3 p-4 text-left glass-button rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Manage Roles</p>
                  <p className="text-sm text-gray-500">
                    Update user roles and permissions
                  </p>
                </div>
              </Link>
            )}

            {hasPermission("teams") && (
              <Link
                href="/organization/departments"
                className="w-full flex items-center gap-3 p-4 text-left glass-button rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Departments</p>
                  <p className="text-sm text-gray-500">
                    Manage organizational structure
                  </p>
                </div>
              </Link>
            )}

            {hasPermission("auditLogs") && (
              <Link
                href="/activity"
                className="w-full flex items-center gap-3 p-4 text-left glass-button rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Audit Logs</p>
                  <p className="text-sm text-gray-500">
                    Review system activity
                  </p>
                </div>
              </Link>
            )}

            {hasPermission("settings") && (
              <Link
                href="/settings"
                className="w-full flex items-center gap-3 p-4 text-left glass-button rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Settings</p>
                  <p className="text-sm text-gray-500">
                    Configure system settings
                  </p>
                </div>
              </Link>
            )}

            {/* Personal Actions for non-admin users */}
            {!hasPermission("users") && (
              <>
                <Link
                  href="/profile"
                  className="w-full flex items-center gap-3 p-4 text-left glass-button rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">My Profile</p>
                    <p className="text-sm text-gray-500">
                      View and edit your profile
                    </p>
                  </div>
                </Link>

                <Link
                  href="/activity"
                  className="w-full flex items-center gap-3 p-4 text-left glass-button rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">My Activity</p>
                    <p className="text-sm text-gray-500">
                      View your recent activity
                    </p>
                  </div>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
