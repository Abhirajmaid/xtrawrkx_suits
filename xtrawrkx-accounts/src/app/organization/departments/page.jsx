"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building,
  Plus,
  Edit,
  Trash2,
  Users,
  Mail,
  X,
  Save,
  Loader2,
  AlertTriangle,
  Check,
  Search,
  Filter,
  MoreVertical,
  Eye,
  EyeOff,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import AuthService from "@/lib/authService";
import RouteGuard from "@/components/RouteGuard";

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalUsers: 0,
  });

  const [newDepartment, setNewDepartment] = useState({
    name: "",
    code: "",
    description: "",
    color: "#3B82F6",
    sortOrder: 0,
    isActive: true,
  });

  const [editingForm, setEditingForm] = useState({
    name: "",
    code: "",
    description: "",
    color: "#3B82F6",
    sortOrder: 0,
    isActive: true,
  });

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await AuthService.getDepartments();
      setDepartments(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  // Calculate department statistics
  const calculateStats = (deptList) => {
    const newStats = {
      total: deptList.length,
      active: deptList.filter((dept) => dept.isActive).length,
      inactive: deptList.filter((dept) => !dept.isActive).length,
      totalUsers: deptList.reduce(
        (sum, dept) => sum + (dept.userCount || 0),
        0
      ),
    };
    setStats(newStats);
  };

  // Create new department
  const handleAddDepartment = async () => {
    try {
      setLoading(true);
      const response = await AuthService.apiRequest("/departments", {
        method: "POST",
        body: JSON.stringify({
          data: newDepartment,
        }),
      });

      if (response.data) {
        setSuccess("Department created successfully");
        await fetchDepartments();
        setNewDepartment({
          name: "",
          code: "",
          description: "",
          color: "#3B82F6",
          sortOrder: 0,
          isActive: true,
        });
        setShowAddModal(false);
      }
    } catch (error) {
      console.error("Error creating department:", error);
      setError("Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  // Edit department
  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setEditingForm({
      name: department.name,
      code: department.code,
      description: department.description || "",
      color: department.color || "#3B82F6",
      sortOrder: department.sortOrder || 0,
      isActive: department.isActive,
    });
  };

  // Update department
  const handleUpdateDepartment = async () => {
    try {
      setLoading(true);
      const response = await AuthService.apiRequest(
        `/departments/${editingDepartment.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            data: editingForm,
          }),
        }
      );

      if (response.data) {
        setSuccess("Department updated successfully");
        await fetchDepartments();
        setEditingDepartment(null);
      }
    } catch (error) {
      console.error("Error updating department:", error);
      setError("Failed to update department");
    } finally {
      setLoading(false);
    }
  };

  // Delete department
  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        setLoading(true);
        await AuthService.apiRequest(`/departments/${departmentId}`, {
          method: "DELETE",
        });
        setSuccess("Department deleted successfully");
        await fetchDepartments();
      } catch (error) {
        console.error("Error deleting department:", error);
        setError("Failed to delete department");
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter departments
  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      searchQuery === "" ||
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dept.description &&
        dept.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && dept.isActive) ||
      (filterActive === "inactive" && !dept.isActive);

    return matchesSearch && matchesFilter;
  });

  // Load departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
              <p className="text-gray-600">
                Manage organizational departments and teams
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 border-l-4 border-red-500 bg-red-50"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 font-medium">Error</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 border-l-4 border-green-500 bg-green-50"
        >
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-medium">Success</p>
          </div>
          <p className="text-green-600 text-sm mt-1">{success}</p>
        </motion.div>
      )}

      {/* Search and Filters */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 border border-gray-200"
              />
            </div>
          </div>
          <div className="lg:w-48">
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="w-full px-3 py-2 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 border border-gray-200"
            >
              <option value="all">All Departments</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            <span className="text-gray-600">Loading departments...</span>
          </div>
        </div>
      )}

      {/* Departments Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department, index) => (
            <motion.div
              key={department.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: department.color || "#3B82F6" }}
                  >
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {department.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {department.userCount || 0} members
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditDepartment(department)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {(department.userCount || 0) === 0 && (
                    <button
                      onClick={() => handleDeleteDepartment(department.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {department.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {department.description}
                </p>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Code:</span>
                  <span className="font-medium text-gray-900 font-mono">
                    {department.code}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      department.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {department.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Sort Order:</span>
                  <span className="font-medium text-gray-900">
                    {department.sortOrder || 0}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredDepartments.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No departments found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filterActive !== "all"
              ? "Try adjusting your filters"
              : "Get started by adding your first department"}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Add Department
          </button>
        </div>
      )}

      {/* Department Stats */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Department Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Departments</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {stats.active}
              </div>
              <div className="text-sm text-gray-600">Active Departments</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">
                {stats.inactive}
              </div>
              <div className="text-sm text-gray-600">Inactive Departments</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">
                {stats.totalUsers}
              </div>
              <div className="text-sm text-gray-600">Total Members</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Department
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={newDepartment.name}
                  onChange={(e) =>
                    setNewDepartment({ ...newDepartment, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter department name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Code *
                </label>
                <input
                  type="text"
                  value={newDepartment.code}
                  onChange={(e) =>
                    setNewDepartment({
                      ...newDepartment,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter department code (e.g., SALES)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newDepartment.description}
                  onChange={(e) =>
                    setNewDepartment({
                      ...newDepartment,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter department description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newDepartment.color}
                    onChange={(e) =>
                      setNewDepartment({
                        ...newDepartment,
                        color: e.target.value,
                      })
                    }
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newDepartment.color}
                    onChange={(e) =>
                      setNewDepartment({
                        ...newDepartment,
                        color: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={newDepartment.sortOrder}
                  onChange={(e) =>
                    setNewDepartment({
                      ...newDepartment,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newDepartment.isActive}
                  onChange={(e) =>
                    setNewDepartment({
                      ...newDepartment,
                      isActive: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Department is active
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDepartment}
                disabled={loading || !newDepartment.name || !newDepartment.code}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Add Department"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Department Modal */}
      {editingDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Department
              </h2>
              <button
                onClick={() => setEditingDepartment(null)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={editingForm.name}
                  onChange={(e) =>
                    setEditingForm({ ...editingForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Code *
                </label>
                <input
                  type="text"
                  value={editingForm.code}
                  onChange={(e) =>
                    setEditingForm({
                      ...editingForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingForm.description}
                  onChange={(e) =>
                    setEditingForm({
                      ...editingForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editingForm.color}
                    onChange={(e) =>
                      setEditingForm({
                        ...editingForm,
                        color: e.target.value,
                      })
                    }
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingForm.color}
                    onChange={(e) =>
                      setEditingForm({
                        ...editingForm,
                        color: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={editingForm.sortOrder}
                  onChange={(e) =>
                    setEditingForm({
                      ...editingForm,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingForm.isActive}
                  onChange={(e) =>
                    setEditingForm({
                      ...editingForm,
                      isActive: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label
                  htmlFor="editIsActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Department is active
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingDepartment(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDepartment}
                disabled={loading || !editingForm.name || !editingForm.code}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Export with route protection - requires Manager level access
export default function ProtectedDepartmentsPage() {
  return (
    <RouteGuard requiredLevel="Manager">
      <DepartmentsPage />
    </RouteGuard>
  );
}
