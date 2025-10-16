"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Button,
  Input,
  Card,
  Badge,
  Select,
  Modal,
  Table,
} from "@/components/ui";
import {
  Loader2,
  Plus,
  Users,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  UserX,
  Search,
  Filter,
  Edit,
  Building,
  Phone,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import strapiClient from "@/lib/strapiClient";
import PermissionsService from "@/lib/permissionsService";
import RouteGuard from "@/components/RouteGuard";
import Link from "next/link";

function UserManagementPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    recent: 0,
  });

  useEffect(() => {
    checkUserPermissions();
    fetchUsers();
    fetchAvailableRoles();
    fetchDepartments();
  }, []);

  const checkUserPermissions = async () => {
    try {
      console.log("Checking user permissions...");
      const user = await getCurrentUser();
      console.log("Current user:", user);

      // For development, allow access if user exists (temporary fix)
      if (!user) {
        console.log("No user found, checking local storage...");

        // Check for currentUser in localStorage (your actual structure)
        const currentUserData = localStorage.getItem("currentUser");
        if (currentUserData) {
          const parsedUser = JSON.parse(currentUserData);
          console.log("Using cached user data from currentUser:", parsedUser);

          // Convert to the expected format
          const userObj = {
            id: 1, // Default ID
            email: parsedUser.email,
            firstName: parsedUser.name.split(" ")[0] || "Admin",
            lastName: parsedUser.name.split(" ")[1] || "User",
            role: parsedUser.role, // Keep the role as-is (already mapped correctly from login)
            department: "MANAGEMENT",
            isActive: true,
            emailVerified: true,
          };

          setCurrentUser(userObj);
          setLoading(false);
          return;
        }

        setError("Please login first");
        setLoading(false);
        return;
      }

      // Check if user has admin permissions using the new role system
      const hasAdminAccess =
        user.user.role === "Super Admin" ||
        user.user.role === "Admin" ||
        user.user.role === "ADMIN"; // Fallback for old system

      if (user.type !== "internal" || !hasAdminAccess) {
        console.log("Access denied - not admin. User role:", user.user.role);
        setError("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }
      console.log("Admin access granted");
      setCurrentUser(user.user);
    } catch (error) {
      console.error("Permission check error:", error);
      // For development, try to use cached data from currentUser
      const currentUserData = localStorage.getItem("currentUser");
      if (currentUserData) {
        console.log("Using cached user data from currentUser due to error");
        const parsedUser = JSON.parse(currentUserData);

        // Convert to the expected format
        const userObj = {
          id: 1, // Default ID
          email: parsedUser.email,
          firstName: parsedUser.name.split(" ")[0] || "Admin",
          lastName: parsedUser.name.split(" ")[1] || "User",
          role: parsedUser.role.toUpperCase(),
          department: "MANAGEMENT",
          isActive: true,
          emailVerified: true,
        };

        setCurrentUser(userObj);
      } else {
        setError("Failed to verify permissions: " + error.message);
      }
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log("Fetching users from Strapi...");
      setLoading(true);
      setError("");

      // Use AuthService to get authenticated token
      const AuthService = (await import("@/lib/authService")).default;
      const token = await AuthService.refreshTokenIfNeeded();

      if (!token) {
        throw new Error("Authentication required. Please login first.");
      }

      console.log("Auth token obtained successfully");

      // Fetch users using AuthService with populated roles
      // Use the editable users endpoint to get only users that current user can edit
      let data;
      try {
        // Try to use the hierarchical endpoint first
        data = await AuthService.apiRequest("/user-management/editable-users");

        // Transform the response from the hierarchical endpoint
        if (data.success && data.users) {
          const transformedUsers = data.users.map((user) => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            department: user.department,
            phone: user.phone,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            userRoles: [], // Will be populated separately if needed
            canEdit: user.canEdit || true, // All users from this endpoint are editable
          }));

          setUsers(transformedUsers);
          calculateStats(transformedUsers);
          return;
        }
      } catch (hierarchicalError) {
        console.log(
          "Hierarchical endpoint not available, falling back to regular endpoint:",
          hierarchicalError.message
        );
      }

      // Fallback to regular endpoint
      data = await AuthService.apiRequest(
        "/xtrawrkx-users?populate=primaryRole,userRoles,department"
      );
      console.log("API response data:", data);

      // Transform Strapi data to expected format
      const transformedUsers = (data.data || []).map((item) => ({
        id: item.id,
        email: item.attributes?.email || item.email,
        firstName: item.attributes?.firstName || item.firstName,
        lastName: item.attributes?.lastName || item.lastName,
        role: item.attributes?.primaryRole?.data?.attributes?.name || "No Role",
        primaryRole: item.attributes?.primaryRole?.data || null,
        department: item.attributes?.department?.data || item.department,
        phone: item.attributes?.phone || item.phone,
        isActive:
          item.attributes?.isActive !== undefined
            ? item.attributes.isActive
            : item.isActive !== undefined
            ? item.isActive
            : true,
        emailVerified:
          item.attributes?.emailVerified || item.emailVerified || false,
        lastLoginAt: item.attributes?.lastLoginAt || item.lastLoginAt,
        createdAt: item.attributes?.createdAt || item.createdAt,
        userRoles: item.attributes?.userRoles?.data || item.userRoles || [],
      }));

      console.log("Transformed users:", transformedUsers);
      setUsers(transformedUsers);

      // Calculate stats
      calculateStats(transformedUsers);
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Fetch users error:", error);
      setError(`Unable to load users: ${error.message}`);

      // Don't show demo data anymore - just show empty state
      setUsers([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRoles = async () => {
    try {
      const AuthService = (await import("@/lib/authService")).default;
      const token = await AuthService.refreshTokenIfNeeded();

      if (!token) {
        return;
      }

      const data = await AuthService.apiRequest("/user-roles");
      setAvailableRoles(data.data || []);
    } catch (error) {
      console.error("Fetch roles error:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const AuthService = (await import("@/lib/authService")).default;
      const departments = await AuthService.getDepartments();
      setDepartments(departments);
    } catch (error) {
      console.error("Fetch departments error:", error);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const calculateStats = (usersList) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newStats = {
      total: usersList.length,
      active: usersList.filter((u) => u.isActive).length,
      inactive: usersList.filter((u) => !u.isActive).length,
      recent: usersList.filter((u) => {
        const createdAt = u.createdAt ? new Date(u.createdAt) : null;
        return createdAt && createdAt >= sevenDaysAgo;
      }).length,
    };

    setStats(newStats);
  };

  /**
   * Check if current user can edit a specific user based on role hierarchy
   */
  const canEditUser = (targetUser) => {
    if (!currentUser) return false;

    const currentUserRole = currentUser.role;
    const targetUserRole = targetUser.role;

    return PermissionsService.canEditUser(currentUserRole, targetUserRole);
  };

  /**
   * Check if current user can manage roles for a specific user
   */
  const canManageUserRoles = (targetUser) => {
    if (!currentUser) return false;

    const currentUserRole = currentUser.role;
    const targetUserRole = targetUser.role;

    return PermissionsService.canManageUserRoles(
      currentUserRole,
      targetUserRole
    );
  };

  const handleEditUser = (user) => {
    // Check if current user can edit this user
    if (!canEditUser(user)) {
      setError("You don't have permission to edit this user");
      return;
    }

    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleManageRoles = (user) => {
    // Check if current user can manage roles for this user
    if (!canManageUserRoles(user)) {
      setError("You don't have permission to manage roles for this user");
      return;
    }

    setEditingUser(user);
    // Handle both data structures (attributes.id and direct id)
    const currentRoleIds =
      user.userRoles?.map((role) => role.attributes?.id || role.id) || [];
    setUserRoles(currentRoleIds);
    setShowRolesModal(true);
  };

  const handleRoleToggle = (roleId) => {
    setUserRoles((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((id) => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const handleUpdateUserRoles = async () => {
    if (!editingUser) return;

    setCreating(true);
    setError("");

    try {
      const AuthService = (await import("@/lib/authService")).default;

      // For each role, update the user assignments
      for (const role of availableRoles) {
        const shouldHaveRole = userRoles.includes(role.id);
        const currentlyHasRole = editingUser.userRoles?.some(
          (ur) => (ur.attributes?.id || ur.id) === role.id
        );

        if (shouldHaveRole !== currentlyHasRole) {
          try {
            // Get current users for this role
            const roleData = await AuthService.apiRequest(
              `/user-roles/${role.id}`
            );
            const currentUserIds = roleData.data?.users?.map((u) => u.id) || [];

            let updatedUserIds;
            if (shouldHaveRole) {
              // Add user to role
              updatedUserIds = [
                ...new Set([...currentUserIds, editingUser.id]),
              ];
            } else {
              // Remove user from role
              updatedUserIds = currentUserIds.filter(
                (id) => id !== editingUser.id
              );
            }

            // Update the role with new user assignments
            await AuthService.apiRequest(
              `/user-roles/${role.id}/assign-users`,
              {
                method: "POST",
                body: JSON.stringify({ userIds: updatedUserIds }),
              }
            );
          } catch (roleError) {
            console.warn(
              `Failed to update role ${role.name}:`,
              roleError.message
            );
            // Continue with other roles instead of failing completely
          }
        }
      }

      setSuccess("User roles updated successfully!");
      setShowRolesModal(false);
      setEditingUser(null);
      setUserRoles([]);
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error("Update user roles error:", error);
      setError("Failed to update user roles: " + error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      // Use AuthService for authenticated API request
      const AuthService = (await import("@/lib/authService")).default;

      const updateData = {
        data: {
          firstName: editingUser.firstName,
          lastName: editingUser.lastName,
          email: editingUser.email,
          primaryRole: editingUser.primaryRole?.id || null,
          department: editingUser.department,
          phone: editingUser.phone,
          isActive: editingUser.isActive,
        },
      };

      const response = await AuthService.apiRequest(
        `/xtrawrkx-users/${editingUser.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updateData),
        }
      );

      setSuccess("User updated successfully!");
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error("User update error:", error);
      setError("Failed to update user: " + error.message);
    } finally {
      setCreating(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      "Super Admin": "bg-red-100 text-red-800",
      Admin: "bg-red-100 text-red-800",
      Manager: "bg-purple-100 text-purple-800",
      "Project Manager": "bg-blue-100 text-blue-800",
      "Sales Representative": "bg-green-100 text-green-800",
      Developer: "bg-gray-100 text-gray-800",
      Designer: "bg-pink-100 text-pink-800",
      // Legacy enum support
      ADMIN: "bg-red-100 text-red-800",
      MANAGER: "bg-purple-100 text-purple-800",
      PROJECT_MANAGER: "bg-blue-100 text-blue-800",
      SALES_REP: "bg-green-100 text-green-800",
      DEVELOPER: "bg-gray-100 text-gray-800",
      DESIGNER: "bg-pink-100 text-pink-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getDepartmentInfo = (department) => {
    if (typeof department === "object" && department?.name) {
      // If department is an object with name property, return it
      return {
        name: department.name,
        color: department.color || "#6B7280",
      };
    }

    // Fallback for string department codes (legacy support)
    const departmentMap = {
      MANAGEMENT: { name: "Management", color: "#EF4444" },
      SALES: { name: "Sales", color: "#10B981" },
      DELIVERY: { name: "Delivery", color: "#3B82F6" },
      DEVELOPMENT: { name: "Development", color: "#8B5CF6" },
      DESIGN: { name: "Design", color: "#EC4899" },
    };
    return (
      departmentMap[department] || {
        name: department || "Unknown",
        color: "#6B7280",
      }
    );
  };

  const getDepartmentBadgeColor = (department) => {
    const deptInfo = getDepartmentInfo(department);
    return `bg-[${deptInfo.color}]/10 text-[${deptInfo.color}]`;
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesDepartment =
      filterDepartment === "all" ||
      (typeof user.department === "object"
        ? user.department?.id
        : user.department) === filterDepartment;

    return matchesSearch && matchesRole && matchesDepartment;
  });

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-8 text-center"
        >
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-500" />
          <p className="text-gray-600">Checking permissions...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-gray-600">
                Manage internal Xtrawrkx users and permissions
              </p>
            </div>
          </div>

          <Link href="/users/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300">
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total Users",
            value: stats.total,
            change: "+12%",
            icon: Users,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
          },
          {
            title: "Active Users",
            value: stats.active,
            change: "+8%",
            icon: UserCheck,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-100",
            textColor: "text-green-600",
          },
          {
            title: "Inactive Users",
            value: stats.inactive,
            change: "0%",
            icon: UserX,
            color: "from-red-500 to-red-600",
            bgColor: "bg-red-100",
            textColor: "text-red-600",
          },
          {
            title: "New This Week",
            value: stats.recent,
            change: "+15%",
            icon: TrendingUp,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-100",
            textColor: "text-purple-600",
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
                <p className="text-sm text-green-600 mt-1">
                  {stat.change} from last month
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 border border-gray-200"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 border border-gray-200"
            >
              <option value="all">All Roles</option>
              {availableRoles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
              <option value="No Role">No Role</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 border border-gray-200"
              disabled={loadingDepartments}
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 border-l-4 border-red-500 bg-red-50"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 border-l-4 border-green-500 bg-green-50"
        >
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        </motion.div>
      )}

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Internal Users ({filteredUsers.length})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterRole !== "all" || filterDepartment !== "all"
                ? "Try adjusting your filters"
                : "Get started by adding your first user"}
            </p>
            {users.length === 0 && (
              <Link href="/users/new">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add First User
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Department
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Custom Roles
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Last Login
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          <Shield className="w-3 h-3" />
                          {user.role}
                        </span>
                        {currentUser &&
                          PermissionsService.getRoleLevel(currentUser.role) <=
                            PermissionsService.getRoleLevel(user.role) && (
                            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full font-medium">
                              Same/Higher Level
                            </span>
                          )}
                      </div>
                      {user.primaryRole && (
                        <div className="text-xs text-gray-500 mt-1">
                          Primary Role
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getDepartmentBadgeColor(
                          user.department
                        )}`}
                      >
                        <Building className="w-3 h-3" />
                        {getDepartmentInfo(user.department).name}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.userRoles && user.userRoles.length > 0 ? (
                          user.userRoles.slice(0, 2).map((role) => (
                            <span
                              key={role.id}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              <Shield className="w-3 h-3" />
                              {role.attributes?.name || role.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">
                            No custom roles
                          </span>
                        )}
                        {user.userRoles && user.userRoles.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{user.userRoles.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm flex items-center gap-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : "Never"}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {canEditUser(user) && (
                          <button
                            onClick={() => handleEditUser(user)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </button>
                        )}
                        {canManageUserRoles(user) && (
                          <button
                            onClick={() => handleManageRoles(user)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Shield className="w-3 h-3" />
                            Roles
                          </button>
                        )}
                        {!canEditUser(user) && !canManageUserRoles(user) && (
                          <span className="text-xs text-gray-400 italic">
                            No permissions
                          </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        title="Edit User"
        size="md"
      >
        <p className="text-sm text-gray-600 mb-4">
          Update user information and permissions
        </p>

        {editingUser && (
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="editFirstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <Input
                  id="editFirstName"
                  value={editingUser.firstName}
                  onChange={(e) =>
                    setEditingUser((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="editLastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <Input
                  id="editLastName"
                  value={editingUser.lastName}
                  onChange={(e) =>
                    setEditingUser((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="editEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Input
                id="editEmail"
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="editPhone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone (Optional)
              </label>
              <Input
                id="editPhone"
                value={editingUser.phone || ""}
                onChange={(e) =>
                  setEditingUser((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="editPrimaryRole"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Primary Role
                </label>
                <Select
                  value={editingUser.primaryRole?.id || ""}
                  onChange={(value) => {
                    const selectedRole = availableRoles.find(
                      (role) => role.id === parseInt(value)
                    );
                    setEditingUser((prev) => ({
                      ...prev,
                      primaryRole: selectedRole || null,
                      role: selectedRole?.name || "No Role",
                    }));
                  }}
                  options={[
                    { value: "", label: "No Primary Role" },
                    ...availableRoles
                      .filter((role) => {
                        // Only show roles that current user can assign
                        const currentUserRole = currentUser?.role;
                        return PermissionsService.canAssignRole(
                          currentUserRole,
                          role.name
                        );
                      })
                      .map((role) => ({
                        value: role.id.toString(),
                        label: role.name,
                      })),
                  ]}
                  placeholder="Select primary role"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="editDepartment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Department
                </label>
                <Select
                  value={
                    typeof editingUser.department === "object"
                      ? editingUser.department?.id
                      : editingUser.department
                  }
                  onChange={(value) =>
                    setEditingUser((prev) => ({
                      ...prev,
                      department: value,
                    }))
                  }
                  options={departments.map((dept) => ({
                    value: dept.id,
                    label: dept.name,
                  }))}
                  placeholder="Select department"
                  required
                  disabled={loadingDepartments}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="editIsActive"
                checked={editingUser.isActive}
                onChange={(e) =>
                  setEditingUser((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="rounded"
              />
              <label
                htmlFor="editIsActive"
                className="text-sm font-medium text-gray-700"
              >
                Active User
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update User"
                )}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Manage User Roles Modal */}
      <Modal
        isOpen={showRolesModal}
        onClose={() => {
          setShowRolesModal(false);
          setEditingUser(null);
          setUserRoles([]);
        }}
        title={`Manage Roles - ${editingUser?.firstName} ${editingUser?.lastName}`}
        size="md"
      >
        <p className="text-sm text-gray-600 mb-4">
          Assign custom roles to enhance or override the user's default role
          permissions
        </p>

        {editingUser && (
          <div className="space-y-4">
            {/* Current Primary Role */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Primary Role</h4>
              {editingUser.primaryRole ? (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                    editingUser.primaryRole.name
                  )}`}
                >
                  <Shield className="w-3 h-3" />
                  {editingUser.primaryRole.name}
                </span>
              ) : (
                <span className="text-sm text-gray-500">
                  No primary role assigned
                </span>
              )}
              <p className="text-xs text-gray-600 mt-1">
                The primary role defines the user's main permissions. You can
                change this in the Edit User dialog.
              </p>
            </div>

            {/* Custom Roles */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Custom Roles</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableRoles
                  .filter((role) => {
                    // Filter roles based on what current user can assign
                    const currentUserRole = currentUser?.role;
                    return PermissionsService.canAssignRole(
                      currentUserRole,
                      role.name
                    );
                  })
                  .map((role) => (
                    <label
                      key={role.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={userRoles.includes(role.id)}
                        onChange={() => handleRoleToggle(role.id)}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {role.name}
                          </span>
                          {role.isSystemRole && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              System
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {role.description}
                        </p>
                      </div>
                    </label>
                  ))}
                {availableRoles.filter((role) => {
                  const currentUserRole = currentUser?.role;
                  return PermissionsService.canAssignRole(
                    currentUserRole,
                    role.name
                  );
                }).length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No roles available for assignment</p>
                    <p className="text-xs text-gray-400 mt-1">
                      You can only assign roles lower than your current level
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                onClick={() => {
                  setShowRolesModal(false);
                  setEditingUser(null);
                  setUserRoles([]);
                }}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateUserRoles} disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Roles"
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Export with route protection - requires Manager level access
export default function ProtectedUserManagementPage() {
  return (
    <RouteGuard requiredLevel="Manager">
      <UserManagementPage />
    </RouteGuard>
  );
}
