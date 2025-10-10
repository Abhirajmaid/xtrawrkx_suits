"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  Shield,
  Building,
  UserCheck,
  UserX,
  Settings,
  Lock,
  Globe,
  MapPin,
  Clock,
  ChevronDown,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";
import {
  userAPI,
  getRoleBadgeColor,
  getRoleLabel,
  getDepartmentLabel,
  ROLES,
  DEPARTMENTS,
} from "../../lib/api";

export default function UsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: searchTerm,
        role: selectedRole,
        department: selectedDepartment,
        page: pagination.page,
        limit: pagination.limit,
      };

      const response = await userAPI.getUsers(params);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, selectedRole, selectedDepartment, pagination.page]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination((prev) => ({ ...prev, page: 1 }));
      } else {
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const roles = [{ value: "all", label: "All Roles" }, ...ROLES];

  const departments = [
    { value: "all", label: "All Departments" },
    ...DEPARTMENTS,
  ];

  const getDepartmentIcon = (department) => {
    const icons = {
      MANAGEMENT: Shield,
      SALES: Building,
      DELIVERY: Users,
      DEVELOPMENT: Users,
      DESIGN: Users,
    };
    return icons[department] || Users;
  };

  // Server-side filtering is handled in the API call

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const stats = [
    {
      label: "Total Users",
      value: pagination.total,
      icon: Users,
      color: "text-brand-primary",
      bg: "bg-brand-primary/10",
    },
    {
      label: "Active Users",
      value: users.filter((u) => u.isActive).length,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Admin Users",
      value: users.filter((u) => u.role === "ADMIN").length,
      icon: Shield,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      label: "This Page",
      value: users.length,
      icon: Lock,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
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
                <p className="text-sm font-medium text-brand-text-muted">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-brand-foreground">
                  {stat.value}
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

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-foreground">
            User Management
          </h1>
          <p className="text-brand-text-muted">
            Manage team members and their access permissions
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-text-light bg-white border border-brand-border rounded-xl hover:bg-brand-hover transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-text-light bg-white border border-brand-border rounded-xl hover:bg-brand-hover transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={() => router.push("/users/new")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-brand-border/50 shadow-card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-brand-hover border border-brand-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2.5 text-sm bg-white border border-brand-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2.5 text-sm bg-white border border-brand-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-brand-text-light bg-white border border-brand-border/50 rounded-xl hover:bg-brand-hover transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-brand-border/50 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brand-hover border-b border-brand-border/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                  Role & Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                  Security
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/50">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-48"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 bg-gray-200 rounded w-8"></div>
                    </td>
                  </tr>
                ))
              ) : error ? (
                // Error state
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-red-600">
                      <p className="text-lg font-medium">Error loading users</p>
                      <p className="text-sm text-gray-500 mt-1">{error}</p>
                      <button
                        onClick={fetchUsers}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm mt-1">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-brand-hover/50 transition-colors cursor-pointer"
                    onClick={() => handleUserSelect(user)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-brand-foreground">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-brand-text-muted">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${getRoleBadgeColor(user.role)}`}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-brand-text-muted">
                          <Building className="w-3 h-3" />
                          <span className="capitalize">{user.department}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${
                          user.isActive
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-brand-text-muted">
                        <Clock className="w-3 h-3" />
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {user.mfaEnabled ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            <Lock className="w-3 h-3 mr-1" />
                            MFA
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <UserX className="w-3 h-3 mr-1" />
                            No MFA
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-brand-text-muted hover:text-brand-primary hover:bg-brand-hover rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-brand-text-muted hover:text-brand-primary hover:bg-brand-hover rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-brand-text-muted hover:text-brand-primary hover:bg-brand-hover rounded-lg transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-brand-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showUserDetails && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowUserDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-brand-border/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-brand-foreground">
                    User Details
                  </h3>
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="p-1 text-brand-text-muted hover:text-brand-foreground hover:bg-brand-hover rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Profile Section */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {selectedUser.firstName[0]}
                      {selectedUser.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-brand-foreground">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h4>
                    <p className="text-brand-text-muted">
                      {selectedUser.email}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${getRoleBadgeColor(selectedUser.role)}`}
                      >
                        {getRoleLabel(selectedUser.role)}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${
                          selectedUser.isActive
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {selectedUser.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-brand-text-muted">
                        Phone
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-brand-text-muted" />
                        <span className="text-brand-foreground">
                          {selectedUser.phone}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-brand-text-muted">
                        Location
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-brand-text-muted" />
                        <span className="text-brand-foreground">
                          {selectedUser.location}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-brand-text-muted">
                        Timezone
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Globe className="w-4 h-4 text-brand-text-muted" />
                        <span className="text-brand-foreground">
                          {selectedUser.timezone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-brand-text-muted">
                        Hired Date
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-brand-text-muted" />
                        <span className="text-brand-foreground">
                          {new Date(
                            selectedUser.hiredDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-brand-text-muted">
                        Last Login
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-brand-text-muted" />
                        <span className="text-brand-foreground">
                          {selectedUser.lastLogin
                            ? new Date(
                                selectedUser.lastLogin
                              ).toLocaleDateString()
                            : "Never"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-brand-text-muted">
                        Multi-Factor Auth
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Lock
                          className={`w-4 h-4 ${selectedUser.mfaEnabled ? "text-green-600" : "text-red-600"}`}
                        />
                        <span
                          className={`text-sm ${selectedUser.mfaEnabled ? "text-green-600" : "text-red-600"}`}
                        >
                          {selectedUser.mfaEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="text-sm font-medium text-brand-text-muted">
                    Permissions
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUser.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-brand-border/50 flex gap-3 justify-end">
                <button className="px-4 py-2 text-sm font-medium text-brand-text-light bg-white border border-brand-border/50 rounded-xl hover:bg-brand-hover transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-xl hover:shadow-lg transition-all">
                  Edit User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
