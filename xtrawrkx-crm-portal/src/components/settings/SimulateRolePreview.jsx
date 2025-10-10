"use client";

import { useState } from "react";
import { Card, Button, Select, Badge, Avatar } from "../../../../../../../../components/ui";
import {
  Eye,
  EyeOff,
  User,
  Shield,
  Settings,
  Users,
  DollarSign,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function SimulateRolePreview() {
  const [selectedRole, setSelectedRole] = useState("sales_rep");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const roles = [
    {
      id: "admin",
      name: "Administrator",
      description: "Full access to all features and settings",
      icon: Shield,
      color: "bg-red-500",
      permissions: {
        leads: { create: true, read: true, update: true, delete: true, share: true, export: true },
        contacts: { create: true, read: true, update: true, delete: true, share: true, export: true },
        deals: { create: true, read: true, update: true, delete: true, share: true, export: true },
        activities: { create: true, read: true, update: true, delete: true, share: true, export: true },
        files: { create: true, read: true, update: true, delete: true, share: true, export: true },
        settings: { create: true, read: true, update: true, delete: true, share: true, export: true },
      },
    },
    {
      id: "sales_manager",
      name: "Sales Manager",
      description: "Manage team, view reports, and oversee sales activities",
      icon: Users,
      color: "bg-blue-500",
      permissions: {
        leads: { create: true, read: true, update: true, delete: false, share: true, export: true },
        contacts: { create: true, read: true, update: true, delete: false, share: true, export: true },
        deals: { create: true, read: true, update: true, delete: false, share: true, export: true },
        activities: { create: true, read: true, update: true, delete: false, share: true, export: true },
        files: { create: true, read: true, update: true, delete: false, share: true, export: true },
        settings: { create: false, read: true, update: false, delete: false, share: false, export: false },
      },
    },
    {
      id: "sales_rep",
      name: "Sales Rep",
      description: "Create and manage leads, contacts, and deals",
      icon: User,
      color: "bg-green-500",
      permissions: {
        leads: { create: true, read: true, update: true, delete: false, share: false, export: false },
        contacts: { create: true, read: true, update: true, delete: false, share: false, export: false },
        deals: { create: true, read: true, update: true, delete: false, share: false, export: false },
        activities: { create: true, read: true, update: true, delete: false, share: false, export: false },
        files: { create: true, read: true, update: true, delete: false, share: false, export: false },
        settings: { create: false, read: false, update: false, delete: false, share: false, export: false },
      },
    },
    {
      id: "viewer",
      name: "Viewer",
      description: "Read-only access to assigned records",
      icon: Eye,
      color: "bg-gray-500",
      permissions: {
        leads: { create: false, read: true, update: false, delete: false, share: false, export: false },
        contacts: { create: false, read: true, update: false, delete: false, share: false, export: false },
        deals: { create: false, read: true, update: false, delete: false, share: false, export: false },
        activities: { create: false, read: true, update: false, delete: false, share: false, export: false },
        files: { create: false, read: true, update: false, delete: false, share: false, export: false },
        settings: { create: false, read: false, update: false, delete: false, share: false, export: false },
      },
    },
  ];

  const modules = [
    { key: "leads", label: "Leads", icon: Users, color: "text-blue-600" },
    { key: "contacts", label: "Contacts", icon: User, color: "text-purple-600" },
    { key: "deals", label: "Deals", icon: DollarSign, color: "text-green-600" },
    { key: "activities", label: "Activities", icon: Calendar, color: "text-orange-600" },
    { key: "files", label: "Files", icon: FileText, color: "text-gray-600" },
    { key: "settings", label: "Settings", icon: Settings, color: "text-red-600" },
  ];

  const actions = [
    { key: "create", label: "Create", icon: "➕" },
    { key: "read", label: "Read", icon: "👁️" },
    { key: "update", label: "Update", icon: "✏️" },
    { key: "delete", label: "Delete", icon: "🗑️" },
    { key: "share", label: "Share", icon: "🔗" },
    { key: "export", label: "Export", icon: "📤" },
  ];

  const handleStartPreview = () => {
    const role = roles.find(r => r.id === selectedRole);
    setPreviewData(role);
    setIsPreviewing(true);
  };

  const handleStopPreview = () => {
    setIsPreviewing(false);
    setPreviewData(null);
  };

  const getPermissionIcon = (hasPermission) => {
    return hasPermission ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getPermissionColor = (hasPermission) => {
    return hasPermission ? "text-green-600" : "text-red-600";
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "create":
        return "➕";
      case "read":
        return "👁️";
      case "update":
        return "✏️";
      case "delete":
        return "🗑️";
      case "share":
        return "🔗";
      case "export":
        return "📤";
      default:
        return "❓";
    }
  };

  if (!isPreviewing) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Role Preview</h4>
            <p className="text-sm text-gray-600">
              Preview what a user with a specific role will see
            </p>
          </div>
          <Button onClick={handleStartPreview}>
            <Eye className="w-4 h-4 mr-2" />
            Start Preview
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role to Preview
            </label>
            <Select
              value={selectedRole}
              onChange={setSelectedRole}
              options={roles.map(role => ({
                value: role.id,
                label: role.name
              }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedRole === role.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 ${role.color} rounded-lg flex items-center justify-center text-white`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{role.name}</h5>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900">Role Preview Mode</h4>
              <p className="text-sm text-blue-700">
                Viewing as: <strong>{previewData?.name}</strong>
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleStopPreview}>
            <EyeOff className="w-4 h-4 mr-2" />
            Exit Preview
          </Button>
        </div>
      </Card>

      {/* Simulated Navigation */}
      <Card className="p-6">
        <h5 className="font-semibold text-gray-900 mb-4">Simulated Navigation</h5>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            const permissions = previewData?.permissions[module.key];
            const hasAnyPermission = permissions && Object.values(permissions).some(Boolean);
            
            return (
              <div
                key={module.key}
                className={`p-4 border rounded-lg ${
                  hasAnyPermission
                    ? "border-gray-200 bg-white"
                    : "border-gray-200 bg-gray-50 opacity-50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-5 h-5 ${module.color}`} />
                  <span className="font-medium text-gray-900">{module.label}</span>
                  {hasAnyPermission ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {hasAnyPermission ? "Accessible" : "No access"}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Permission Matrix */}
      <Card className="p-6">
        <h5 className="font-semibold text-gray-900 mb-4">Permission Details</h5>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Module</th>
                {actions.map((action) => (
                  <th key={action.key} className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                    <div className="flex items-center justify-center gap-1">
                      <span>{action.icon}</span>
                      <span>{action.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {modules.map((module) => {
                const permissions = previewData?.permissions[module.key];
                return (
                  <tr key={module.key} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <module.icon className={`w-4 h-4 ${module.color}`} />
                        <span className="font-medium text-gray-900">{module.label}</span>
                      </div>
                    </td>
                    {actions.map((action) => {
                      const hasPermission = permissions?.[action.key] || false;
                      return (
                        <td key={action.key} className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center">
                            {getPermissionIcon(hasPermission)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Simulated UI Elements */}
      <Card className="p-6">
        <h5 className="font-semibold text-gray-900 mb-4">Simulated UI Elements</h5>
        <div className="space-y-4">
          {/* Simulated Dashboard */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h6 className="font-medium text-gray-900 mb-3">Dashboard View</h6>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {modules.map((module) => {
                const permissions = previewData?.permissions[module.key];
                const hasReadPermission = permissions?.read || false;
                
                return (
                  <div
                    key={module.key}
                    className={`p-3 border rounded-lg ${
                      hasReadPermission
                        ? "border-gray-200 bg-white"
                        : "border-gray-200 bg-gray-100 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <module.icon className={`w-4 h-4 ${module.color}`} />
                      <span className="text-sm font-medium">{module.label}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {hasReadPermission ? "Visible" : "Hidden"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulated Action Buttons */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h6 className="font-medium text-gray-900 mb-3">Available Actions</h6>
            <div className="flex flex-wrap gap-2">
              {actions.map((action) => {
                const hasAnyPermission = modules.some(module => 
                  previewData?.permissions[module.key]?.[action.key]
                );
                
                return (
                  <button
                    key={action.key}
                    disabled={!hasAnyPermission}
                    className={`px-3 py-1 rounded text-sm ${
                      hasAnyPermission
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {action.icon} {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6">
        <h5 className="font-semibold text-gray-900 mb-4">Role Summary</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {modules.filter(module => 
                previewData?.permissions[module.key] && 
                Object.values(previewData.permissions[module.key]).some(Boolean)
              ).length}
            </div>
            <div className="text-sm text-green-700">Accessible Modules</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(previewData?.permissions || {}).reduce((acc, module) => 
                acc + Object.values(module).filter(Boolean).length, 0
              )}
            </div>
            <div className="text-sm text-blue-700">Total Permissions</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {previewData?.name === "Administrator" ? "Full" : 
               previewData?.name === "Sales Manager" ? "High" :
               previewData?.name === "Sales Rep" ? "Medium" : "Limited"}
            </div>
            <div className="text-sm text-purple-700">Access Level</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

