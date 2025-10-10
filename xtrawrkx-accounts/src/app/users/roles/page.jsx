"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Users,
  Crown,
  UserCog,
  Briefcase,
  DollarSign,
  TrendingUp,
  Wrench,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function UserRolesPage() {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Super Admin",
      description: "Full system access and control",
      icon: Crown,
      color: "from-red-500 to-red-600",
      rank: 1,
      userCount: 2,
      isSystem: true,
      permissions: {
        leads: {
          create: true,
          read: true,
          update: true,
          delete: true,
          convert: true,
        },
        accounts: { create: true, read: true, update: true, delete: true },
        contacts: { create: true, read: true, update: true, delete: true },
        deals: { create: true, read: true, update: true, delete: true },
        projects: { create: true, read: true, update: true, delete: true },
        tasks: { create: true, read: true, update: true, delete: true },
        imports: {
          create: true,
          read: true,
          update: true,
          delete: true,
          import: true,
        },
        exports: {
          create: true,
          read: true,
          update: true,
          delete: true,
          export: true,
        },
        reports: { create: true, read: true, update: true, delete: true },
      },
      visibility: "org",
    },
    {
      id: 2,
      name: "Admin",
      description: "Administrative access with limitations",
      icon: Shield,
      color: "from-blue-500 to-blue-600",
      rank: 2,
      userCount: 3,
      isSystem: true,
      permissions: {
        leads: {
          create: true,
          read: true,
          update: true,
          delete: true,
          convert: true,
        },
        accounts: { create: true, read: true, update: true, delete: true },
        contacts: { create: true, read: true, update: true, delete: true },
        deals: { create: true, read: true, update: true, delete: true },
        projects: { create: true, read: true, update: true, delete: true },
        tasks: { create: true, read: true, update: true, delete: true },
        imports: {
          create: true,
          read: true,
          update: false,
          delete: false,
          import: true,
        },
        exports: {
          create: true,
          read: true,
          update: false,
          delete: false,
          export: true,
        },
        reports: { create: true, read: true, update: true, delete: true },
      },
      visibility: "org",
    },
    {
      id: 3,
      name: "Sales Manager",
      description: "Manage sales team and deals",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      rank: 3,
      userCount: 5,
      isSystem: false,
      permissions: {
        leads: {
          create: true,
          read: true,
          update: true,
          delete: true,
          convert: true,
        },
        accounts: { create: true, read: true, update: true, delete: false },
        contacts: { create: true, read: true, update: true, delete: false },
        deals: { create: true, read: true, update: true, delete: true },
        projects: { create: false, read: true, update: false, delete: false },
        tasks: { create: true, read: true, update: true, delete: true },
        imports: {
          create: false,
          read: true,
          update: false,
          delete: false,
          import: false,
        },
        exports: {
          create: true,
          read: true,
          update: false,
          delete: false,
          export: true,
        },
        reports: { create: true, read: true, update: true, delete: false },
      },
      visibility: "team",
    },
    {
      id: 4,
      name: "Sales Rep",
      description: "Sales representative access",
      icon: Briefcase,
      color: "from-purple-500 to-purple-600",
      rank: 4,
      userCount: 12,
      isSystem: false,
      permissions: {
        leads: {
          create: true,
          read: true,
          update: true,
          delete: false,
          convert: true,
        },
        accounts: { create: true, read: true, update: true, delete: false },
        contacts: { create: true, read: true, update: true, delete: false },
        deals: { create: true, read: true, update: true, delete: false },
        projects: { create: false, read: true, update: false, delete: false },
        tasks: { create: true, read: true, update: true, delete: false },
        imports: {
          create: false,
          read: false,
          update: false,
          delete: false,
          import: false,
        },
        exports: {
          create: false,
          read: true,
          update: false,
          delete: false,
          export: false,
        },
        reports: { create: false, read: true, update: false, delete: false },
      },
      visibility: "private",
    },
    {
      id: 5,
      name: "Account Manager",
      description: "Manage customer accounts",
      icon: UserCog,
      color: "from-indigo-500 to-indigo-600",
      rank: 4,
      userCount: 8,
      isSystem: false,
      permissions: {
        leads: {
          create: false,
          read: true,
          update: false,
          delete: false,
          convert: false,
        },
        accounts: { create: true, read: true, update: true, delete: false },
        contacts: { create: true, read: true, update: true, delete: false },
        deals: { create: true, read: true, update: true, delete: false },
        projects: { create: true, read: true, update: true, delete: false },
        tasks: { create: true, read: true, update: true, delete: false },
        imports: {
          create: false,
          read: false,
          update: false,
          delete: false,
          import: false,
        },
        exports: {
          create: false,
          read: true,
          update: false,
          delete: false,
          export: false,
        },
        reports: { create: false, read: true, update: false, delete: false },
      },
      visibility: "private",
    },
    {
      id: 6,
      name: "Marketing",
      description: "Marketing and campaign management",
      icon: TrendingUp,
      color: "from-pink-500 to-pink-600",
      rank: 5,
      userCount: 6,
      isSystem: false,
      permissions: {
        leads: {
          create: true,
          read: true,
          update: true,
          delete: false,
          convert: false,
        },
        accounts: { create: false, read: true, update: false, delete: false },
        contacts: { create: true, read: true, update: true, delete: false },
        deals: { create: false, read: true, update: false, delete: false },
        projects: { create: false, read: true, update: false, delete: false },
        tasks: { create: true, read: true, update: true, delete: false },
        imports: {
          create: true,
          read: true,
          update: false,
          delete: false,
          import: true,
        },
        exports: {
          create: true,
          read: true,
          update: false,
          delete: false,
          export: true,
        },
        reports: { create: true, read: true, update: true, delete: false },
      },
      visibility: "team",
    },
    {
      id: 7,
      name: "Project Manager",
      description: "Project and task management",
      icon: Briefcase,
      color: "from-orange-500 to-orange-600",
      rank: 4,
      userCount: 4,
      isSystem: false,
      permissions: {
        leads: {
          create: false,
          read: false,
          update: false,
          delete: false,
          convert: false,
        },
        accounts: { create: false, read: true, update: false, delete: false },
        contacts: { create: false, read: true, update: false, delete: false },
        deals: { create: false, read: true, update: false, delete: false },
        projects: { create: true, read: true, update: true, delete: true },
        tasks: { create: true, read: true, update: true, delete: true },
        imports: {
          create: false,
          read: false,
          update: false,
          delete: false,
          import: false,
        },
        exports: {
          create: false,
          read: true,
          update: false,
          delete: false,
          export: false,
        },
        reports: { create: true, read: true, update: true, delete: false },
      },
      visibility: "team",
    },
    {
      id: 8,
      name: "Support",
      description: "Customer support access",
      icon: Wrench,
      color: "from-cyan-500 to-cyan-600",
      rank: 5,
      userCount: 10,
      isSystem: false,
      permissions: {
        leads: {
          create: false,
          read: true,
          update: false,
          delete: false,
          convert: false,
        },
        accounts: { create: false, read: true, update: true, delete: false },
        contacts: { create: false, read: true, update: true, delete: false },
        deals: { create: false, read: true, update: false, delete: false },
        projects: { create: false, read: true, update: false, delete: false },
        tasks: { create: true, read: true, update: true, delete: false },
        imports: {
          create: false,
          read: false,
          update: false,
          delete: false,
          import: false,
        },
        exports: {
          create: false,
          read: false,
          update: false,
          delete: false,
          export: false,
        },
        reports: { create: false, read: true, update: false, delete: false },
      },
      visibility: "private",
    },
    {
      id: 9,
      name: "Finance",
      description: "Financial data access",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      rank: 4,
      userCount: 3,
      isSystem: false,
      permissions: {
        leads: {
          create: false,
          read: true,
          update: false,
          delete: false,
          convert: false,
        },
        accounts: { create: false, read: true, update: true, delete: false },
        contacts: { create: false, read: true, update: false, delete: false },
        deals: { create: false, read: true, update: true, delete: false },
        projects: { create: false, read: true, update: false, delete: false },
        tasks: { create: false, read: true, update: false, delete: false },
        imports: {
          create: false,
          read: true,
          update: false,
          delete: false,
          import: false,
        },
        exports: {
          create: true,
          read: true,
          update: false,
          delete: false,
          export: true,
        },
        reports: { create: true, read: true, update: true, delete: false },
      },
      visibility: "team",
    },
    {
      id: 10,
      name: "Read-only",
      description: "View-only access to data",
      icon: Eye,
      color: "from-gray-500 to-gray-600",
      rank: 10,
      userCount: 5,
      isSystem: false,
      permissions: {
        leads: {
          create: false,
          read: true,
          update: false,
          delete: false,
          convert: false,
        },
        accounts: { create: false, read: true, update: false, delete: false },
        contacts: { create: false, read: true, update: false, delete: false },
        deals: { create: false, read: true, update: false, delete: false },
        projects: { create: false, read: true, update: false, delete: false },
        tasks: { create: false, read: true, update: false, delete: false },
        imports: {
          create: false,
          read: false,
          update: false,
          delete: false,
          import: false,
        },
        exports: {
          create: false,
          read: false,
          update: false,
          delete: false,
          export: false,
        },
        reports: { create: false, read: true, update: false, delete: false },
      },
      visibility: "private",
    },
  ]);

  const [selectedRole, setSelectedRole] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const modules = [
    {
      id: "leads",
      name: "Leads",
      actions: ["create", "read", "update", "delete", "convert"],
    },
    {
      id: "accounts",
      name: "Accounts",
      actions: ["create", "read", "update", "delete"],
    },
    {
      id: "contacts",
      name: "Contacts",
      actions: ["create", "read", "update", "delete"],
    },
    {
      id: "deals",
      name: "Deals",
      actions: ["create", "read", "update", "delete"],
    },
    {
      id: "projects",
      name: "Projects",
      actions: ["create", "read", "update", "delete"],
    },
    {
      id: "tasks",
      name: "Tasks",
      actions: ["create", "read", "update", "delete"],
    },
    {
      id: "imports",
      name: "Imports",
      actions: ["create", "read", "update", "delete", "import"],
    },
    {
      id: "exports",
      name: "Exports",
      actions: ["create", "read", "update", "delete", "export"],
    },
    {
      id: "reports",
      name: "Reports",
      actions: ["create", "read", "update", "delete"],
    },
  ];

  const visibilityOptions = [
    {
      value: "private",
      label: "Private",
      description: "User's own records only",
    },
    { value: "team", label: "Team", description: "Team and subordinates" },
    { value: "org", label: "Organization", description: "All records" },
  ];

  const getRankBadge = (rank) => {
    if (rank === 1) return { text: "Rank 1", color: "bg-red-100 text-red-700" };
    if (rank === 2)
      return { text: "Rank 2", color: "bg-blue-100 text-blue-700" };
    if (rank === 3)
      return { text: "Rank 3", color: "bg-green-100 text-green-700" };
    if (rank <= 5)
      return { text: `Rank ${rank}`, color: "bg-purple-100 text-purple-700" };
    return { text: `Rank ${rank}`, color: "bg-gray-100 text-gray-700" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                User Roles & Permissions
              </h1>
              <p className="text-gray-600">
                Manage role-based access control and hierarchies
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            <Plus className="w-4 h-4" />
            Add Role
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {roles.length}
              </div>
              <div className="text-sm text-gray-600">Total Roles</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {modules.length}
              </div>
              <div className="text-sm text-gray-600">Modules</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {roles.filter((r) => r.isSystem).length}
              </div>
              <div className="text-sm text-gray-600">System Roles</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const rankBadge = getRankBadge(role.rank);
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {role.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${rankBadge.color}`}
                      >
                        {rankBadge.text}
                      </span>
                      {role.isSystem && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          System
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedRole(role);
                      setShowPermissionsModal(true);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {!role.isSystem && (
                    <>
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{role.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Users:</span>
                  <span className="font-medium text-gray-900">
                    {role.userCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Default Visibility:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {role.visibility}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Hierarchy Rank:</span>
                  <span className="font-medium text-gray-900">
                    Level {role.rank}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Permissions Modal */}
      {showPermissionsModal && selectedRole && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${selectedRole.color} rounded-lg flex items-center justify-center`}
                >
                  {<selectedRole.icon className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedRole.name} Permissions
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedRole.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPermissionsModal(false);
                  setSelectedRole(null);
                }}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Permissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Module
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-gray-900">
                      Create
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-gray-900">
                      Read
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-gray-900">
                      Update
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-gray-900">
                      Delete
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-gray-900">
                      Extra
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((module) => {
                    const perms = selectedRole.permissions[module.id];
                    const extraAction = module.actions.find(
                      (a) => !["create", "read", "update", "delete"].includes(a)
                    );
                    return (
                      <tr
                        key={module.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {module.name}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {perms.create ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {perms.read ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {perms.update ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {perms.delete ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {extraAction && perms[extraAction] ? (
                            <div className="flex items-center justify-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-xs text-gray-600 capitalize">
                                {extraAction}
                              </span>
                            </div>
                          ) : (
                            <X className="w-4 h-4 text-gray-300 mx-auto" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
