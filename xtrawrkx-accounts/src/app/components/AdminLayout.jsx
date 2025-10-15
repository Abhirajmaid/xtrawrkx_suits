"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Shield,
  Settings,
  Key,
  UserCheck,
  Building,
  Lock,
  Eye,
  UserPlus,
  BarChart3,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Home,
  Mail,
  Phone,
  Calendar,
  Globe,
  MapPin,
  Clock,
  Activity,
  User,
  LogOut,
  Target,
  Briefcase,
  DollarSign,
  Wrench,
  TrendingUp,
} from "lucide-react";
import AppDrawer from "./AppDrawer";
import { useUser } from "./UserContext";
import { useRouter } from "next/navigation";

const AdminLayout = ({ children }) => {
  const { currentUser, logout, getRoleDisplayName, hasPermission, isLoading } =
    useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState({
    users: true,
    security: false,
    organization: false,
    account: false,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/auth/login");
    }
  }, [currentUser, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-main items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!currentUser) {
    return null;
  }

  const pathname = usePathname();

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      href: "/",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      href: "/users",
      subItems: [
        { id: "all-users", label: "All Users", href: "/users" },
        { id: "add-user", label: "Add User", href: "/users/new" },
        { id: "user-roles", label: "User Roles", href: "/users/roles" },
        { id: "audit-logs", label: "Audit Logs", href: "/activity" },
      ],
    },
    {
      id: "authentication",
      label: "Authentication",
      icon: Key,
      href: "/auth",
      subItems: [
        { id: "mfa", label: "Multi-Factor Auth", href: "/coming-soon" },
      ],
    },
    {
      id: "organization",
      label: "Organization",
      icon: Building,
      href: "/organization",
      subItems: [
        {
          id: "departments",
          label: "Departments",
          href: "/organization/departments",
        },
        { id: "teams", label: "Teams", href: "/coming-soon" },
        {
          id: "locations",
          label: "Locations",
          href: "/coming-soon",
        },
      ],
    },
    {
      id: "account",
      label: "Account",
      icon: User,
      href: "/profile",
      subItems: [
        { id: "profile", label: "Profile", href: "/profile" },
        { id: "activity", label: "Activity Log", href: "/activity" },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/settings",
      subItems: [
        { id: "general", label: "General", href: "/settings/general" },
        {
          id: "notifications",
          label: "Notifications",
          href: "/settings/notifications",
        },
        {
          id: "integrations",
          label: "Integrations",
          href: "/coming-soon",
        },
      ],
    },
  ];

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Filter navigation items based on user permissions
  const getFilteredNavigationItems = () => {
    if (!currentUser) return [];

    return navigationItems
      .filter((item) => {
        // Map navigation item IDs to permission checks
        const permissionMap = {
          dashboard: "dashboard",
          users: "users",
          authentication: "settings", // Auth settings require settings permission
          organization: "teams", // Organization management requires teams permission
          account: "dashboard", // Account is available to all dashboard users
          settings: "settings",
        };

        const requiredPermission = permissionMap[item.id];
        if (!requiredPermission) return true; // Show items without specific permission requirements

        return hasPermission(requiredPermission);
      })
      .map((item) => {
        // Filter sub-items based on permissions
        if (item.subItems) {
          const filteredSubItems = item.subItems.filter((subItem) => {
            // Map sub-item IDs to permission checks
            const subPermissionMap = {
              "all-users": "users",
              "add-user": "users",
              "user-roles": "permissions",
              "audit-logs": "auditLogs",
              mfa: "settings",
              departments: "teams",
              teams: "teams",
              locations: "settings",
              general: "settings",
              notifications: "settings",
              integrations: "settings",
              profile: "dashboard",
              activity: "auditLogs",
            };

            const requiredSubPermission = subPermissionMap[subItem.id];
            if (!requiredSubPermission) return true;

            return hasPermission(requiredSubPermission);
          });

          return {
            ...item,
            subItems: filteredSubItems,
          };
        }

        return item;
      });
  };

  // Get role-specific sidebar icon
  const getSidebarIcon = () => {
    if (!currentUser) return <Users className="w-6 h-6 text-white" />;

    const roleDisplayName = getRoleDisplayName();

    if (hasPermission("users")) {
      return <Shield className="w-6 h-6 text-white" />;
    }

    if (roleDisplayName.includes("Sales")) {
      return <Target className="w-6 h-6 text-white" />;
    }

    if (roleDisplayName.includes("Project")) {
      return <Briefcase className="w-6 h-6 text-white" />;
    }

    if (roleDisplayName.includes("Marketing")) {
      return <TrendingUp className="w-6 h-6 text-white" />;
    }

    if (roleDisplayName.includes("Finance")) {
      return <DollarSign className="w-6 h-6 text-white" />;
    }

    if (roleDisplayName.includes("Support")) {
      return <Wrench className="w-6 h-6 text-white" />;
    }

    return <User className="w-6 h-6 text-white" />;
  };

  // Get role-specific sidebar title
  const getSidebarTitle = () => {
    if (!currentUser) return "Dashboard";

    const roleDisplayName = getRoleDisplayName();

    if (hasPermission("users")) {
      return "Admin Panel";
    }

    if (roleDisplayName.includes("Sales")) {
      return "Sales Hub";
    }

    if (roleDisplayName.includes("Project")) {
      return "Project Center";
    }

    if (roleDisplayName.includes("Marketing")) {
      return "Marketing Hub";
    }

    if (roleDisplayName.includes("Finance")) {
      return "Finance Center";
    }

    if (roleDisplayName.includes("Support")) {
      return "Support Center";
    }

    if (roleDisplayName.includes("Account")) {
      return "Account Hub";
    }

    return "Dashboard";
  };

  // Get role-specific sidebar subtitle
  const getSidebarSubtitle = () => {
    if (!currentUser) return "Welcome";

    const roleDisplayName = getRoleDisplayName();

    if (hasPermission("users")) {
      return "User Management";
    }

    if (roleDisplayName.includes("Sales Manager")) {
      return "Team & Pipeline Management";
    }

    if (roleDisplayName.includes("Sales Rep")) {
      return "Leads & Opportunities";
    }

    if (roleDisplayName.includes("Project")) {
      return "Projects & Tasks";
    }

    if (roleDisplayName.includes("Marketing")) {
      return "Campaigns & Analytics";
    }

    if (roleDisplayName.includes("Finance")) {
      return "Financial Management";
    }

    if (roleDisplayName.includes("Support")) {
      return "Customer Support";
    }

    if (roleDisplayName.includes("Account")) {
      return "Account Management";
    }

    if (roleDisplayName.includes("Read-only")) {
      return "View Access";
    }

    return "Personal Workspace";
  };

  return (
    <div className="flex h-screen bg-gradient-main relative">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="floating-sidebar overflow-hidden flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  {getSidebarIcon()}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {getSidebarTitle()}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {getSidebarSubtitle()}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto pb-4">
              {getFilteredNavigationItems().map((item) => (
                <div key={item.id}>
                  {item.subItems ? (
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                        pathname.startsWith(item.href)
                          ? "glass-button text-primary-600 shadow-lg"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/40 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedItems[item.id] ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                        pathname === item.href
                          ? "glass-button text-primary-600 shadow-lg"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/40 hover:shadow-md"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  )}

                  {/* Sub Items */}
                  {item.subItems && expandedItems[item.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-6 mt-3 space-y-2"
                    >
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.id}
                          href={subItem.href}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                            pathname === subItem.href
                              ? "text-primary-600 bg-white/40 shadow-sm"
                              : "text-gray-500 hover:text-gray-900 hover:bg-white/30 hover:shadow-sm"
                          }`}
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full" />
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </nav>

            {/* Sidebar Footer - User Card */}
            <div className="p-4 border-t border-white/20">
              <div className="gradient-border">
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {currentUser?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {currentUser?.email || "user@xtrawrkx.com"}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">
                          {getRoleDisplayName()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Link
                        href="/profile"
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/30 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Settings className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          router.push("/auth/login");
                        }}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Logout"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          sidebarOpen ? "ml-80" : "ml-4"
        } transition-all duration-300`}
      >
        {/* Header */}
        <header className="glass-card border-b border-white/20 px-6 py-4 mx-4 mt-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="glass-button p-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentUser?.role === "super_admin" ||
                  currentUser?.role === "admin"
                    ? "Admin Dashboard"
                    : "Dashboard"}
                </h2>
                <p className="text-sm text-gray-500">
                  {currentUser?.role === "super_admin" ||
                  currentUser?.role === "admin"
                    ? "Manage users and access controls"
                    : `Welcome, ${getRoleDisplayName()}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="glass-input pl-10 pr-4 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 w-64"
                />
              </div>

              {/* App Drawer */}
              <AppDrawer />

              {/* Notifications */}
              <button className="glass-button p-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full shadow-lg"></span>
              </button>

              {/* User Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 mx-4 mb-4">
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
