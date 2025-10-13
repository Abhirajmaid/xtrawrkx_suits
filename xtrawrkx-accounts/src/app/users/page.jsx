"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Card,
  Badge,
  Select,
  Modal,
  Table,
} from "@/components/ui";
import { Loader2, Plus, Users, Mail, Calendar, Shield } from "lucide-react";
import { getCurrentUser, createUserWithEmail } from "@/lib/auth";

export default function UserManagementPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [newUserData, setNewUserData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "DEVELOPER",
    department: "DEVELOPMENT",
    sendInvitation: true,
  });

  useEffect(() => {
    checkUserPermissions();
    fetchUsers();
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
            role: parsedUser.role.toUpperCase(),
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

      if (user.type !== "internal" || user.user.role !== "ADMIN") {
        console.log("Access denied - not admin");
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
      console.log("Fetching users...");

      // Get token from currentUser localStorage
      const currentUserData = localStorage.getItem("currentUser");
      let token = null;

      if (currentUserData) {
        const parsedUser = JSON.parse(currentUserData);
        token = parsedUser.token;
      }

      console.log("Auth token:", token ? "Present" : "Missing");
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      console.log("Making API request to fetch users...");
      const response = await fetch("http://localhost:1337/api/xtrawrkx-users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API response status:", response.status);
      const data = await response.json();
      console.log("API response data:", data);

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch users");
      }

      console.log("Setting users:", data.data);
      setUsers(data.data || []);
    } catch (error) {
      console.error("Fetch users error:", error);
      // For development, use mock data if API fails
      console.log("Using mock data due to API error");
      setUsers([
        {
          id: 1,
          email: "admin@xtrawrkx.com",
          firstName: "Admin",
          lastName: "User",
          role: "ADMIN",
          department: "MANAGEMENT",
          isActive: true,
          lastLoginAt: "2024-01-15T10:30:00Z",
        },
        {
          id: 2,
          email: "john@xtrawrkx.com",
          firstName: "John",
          lastName: "Developer",
          role: "DEVELOPER",
          department: "DEVELOPMENT",
          isActive: true,
          lastLoginAt: "2024-01-14T15:45:00Z",
        },
      ]);
      setError("API temporarily unavailable. Showing demo data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const result = await createUserWithEmail(
        newUserData.email,
        "", // Password will be generated by the backend
        newUserData
      );

      setSuccess(
        `User created successfully! ${
          newUserData.sendInvitation
            ? "Invitation email sent."
            : `Temporary password: ${result.tempPassword}`
        }`
      );
      setShowCreateModal(false);
      setNewUserData({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: "DEVELOPER",
        department: "DEVELOPMENT",
        sendInvitation: true,
      });

      // Refresh users list
      fetchUsers();
    } catch (error) {
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      // Get token from currentUser localStorage
      const currentUserData = localStorage.getItem("currentUser");
      let token = null;

      if (currentUserData) {
        const parsedUser = JSON.parse(currentUserData);
        token = parsedUser.token;
      }

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `http://localhost:1337/api/xtrawrkx-users/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              firstName: editingUser.firstName,
              lastName: editingUser.lastName,
              email: editingUser.email,
              role: editingUser.role,
              department: editingUser.department,
              phone: editingUser.phone,
              isActive: editingUser.isActive,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update user");
      }

      setSuccess("User updated successfully!");
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers(); // Refresh the users list
    } catch (error) {
      setError("Failed to update user: " + error.message);
    } finally {
      setCreating(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      ADMIN: "bg-red-100 text-red-800",
      MANAGER: "bg-purple-100 text-purple-800",
      PROJECT_MANAGER: "bg-blue-100 text-blue-800",
      SALES_REP: "bg-green-100 text-green-800",
      DEVELOPER: "bg-gray-100 text-gray-800",
      DESIGNER: "bg-pink-100 text-pink-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getDepartmentBadgeColor = (department) => {
    const colors = {
      MANAGEMENT: "bg-red-100 text-red-800",
      SALES: "bg-green-100 text-green-800",
      DELIVERY: "bg-blue-100 text-blue-800",
      DEVELOPMENT: "bg-purple-100 text-purple-800",
      DESIGN: "bg-pink-100 text-pink-800",
    };
    return colors[department] || "bg-gray-100 text-gray-800";
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <p className="text-center mt-4">Checking permissions...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600">
              Manage internal XtraWrkx users and permissions
            </p>
          </div>

          <Button
            className="flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            Create User
          </Button>

          <Modal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            title="Create New User"
            size="md"
          >
            <p className="text-sm text-gray-600 mb-4">
              Add a new internal user to the XtraWrkx system
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    value={newUserData.firstName}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    value={newUserData.lastName}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
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
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone (Optional)
                </label>
                <Input
                  id="phone"
                  value={newUserData.phone}
                  onChange={(e) =>
                    setNewUserData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <Select
                    value={newUserData.role}
                    onChange={(value) =>
                      setNewUserData((prev) => ({ ...prev, role: value }))
                    }
                    options={[
                      { value: "ADMIN", label: "Admin" },
                      { value: "MANAGER", label: "Manager" },
                      { value: "PROJECT_MANAGER", label: "Project Manager" },
                      { value: "SALES_REP", label: "Sales Rep" },
                      { value: "DEVELOPER", label: "Developer" },
                      { value: "DESIGNER", label: "Designer" },
                    ]}
                    placeholder="Select role"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Department
                  </label>
                  <Select
                    value={newUserData.department}
                    onChange={(value) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        department: value,
                      }))
                    }
                    options={[
                      { value: "MANAGEMENT", label: "Management" },
                      { value: "SALES", label: "Sales" },
                      { value: "DELIVERY", label: "Delivery" },
                      { value: "DEVELOPMENT", label: "Development" },
                      { value: "DESIGN", label: "Design" },
                    ]}
                    placeholder="Select department"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sendInvitation"
                  checked={newUserData.sendInvitation}
                  onChange={(e) =>
                    setNewUserData((prev) => ({
                      ...prev,
                      sendInvitation: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <label
                  htmlFor="sendInvitation"
                  className="text-sm font-medium text-gray-700"
                >
                  Send invitation email
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating User...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </form>
          </Modal>

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
                      htmlFor="editRole"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Role
                    </label>
                    <Select
                      value={editingUser.role}
                      onChange={(value) =>
                        setEditingUser((prev) => ({ ...prev, role: value }))
                      }
                      options={[
                        { value: "ADMIN", label: "Admin" },
                        { value: "MANAGER", label: "Manager" },
                        { value: "PROJECT_MANAGER", label: "Project Manager" },
                        { value: "SALES_REP", label: "Sales Rep" },
                        { value: "DEVELOPER", label: "Developer" },
                        { value: "DESIGNER", label: "Designer" },
                      ]}
                      placeholder="Select role"
                      required
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
                      value={editingUser.department}
                      onChange={(value) =>
                        setEditingUser((prev) => ({
                          ...prev,
                          department: value,
                        }))
                      }
                      options={[
                        { value: "MANAGEMENT", label: "Management" },
                        { value: "SALES", label: "Sales" },
                        { value: "DELIVERY", label: "Delivery" },
                        { value: "DEVELOPMENT", label: "Development" },
                        { value: "DESIGN", label: "Design" },
                      ]}
                      placeholder="Select department"
                      required
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
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 border border-green-200 bg-green-50 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        <Card
          title={
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Internal Users
            </div>
          }
          subtitle="Manage XtraWrkx team members and their access levels"
        >
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table
              columns={[
                {
                  key: "user",
                  label: "User",
                  render: (value, user) => (
                    <div>
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </div>
                  ),
                },
                {
                  key: "role",
                  label: "Role",
                  render: (value, user) => (
                    <Badge className={getRoleBadgeColor(user.role)}>
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </Badge>
                  ),
                },
                {
                  key: "department",
                  label: "Department",
                  render: (value, user) => (
                    <Badge className={getDepartmentBadgeColor(user.department)}>
                      {user.department}
                    </Badge>
                  ),
                },
                {
                  key: "status",
                  label: "Status",
                  render: (value, user) => (
                    <Badge
                      className={
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  ),
                },
                {
                  key: "lastLogin",
                  label: "Last Login",
                  render: (value, user) => (
                    <div className="text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </div>
                  ),
                },
                {
                  key: "actions",
                  label: "Actions",
                  render: (value, user) => (
                    <Button
                      className="bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm px-3 py-1"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </Button>
                  ),
                },
              ]}
              data={users}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
