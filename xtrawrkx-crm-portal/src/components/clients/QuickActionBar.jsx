"use client";

import { useState } from "react";
import { Card } from "../../../../../../../../components/ui";
import {
  MessageSquare,
  Phone,
  Calendar,
  UploadCloud,
  Plus,
  Mail,
  FileText,
  Briefcase,
  FolderOpen,
  Receipt,
  UserPlus,
  Link,
  Star,
  Share,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

export default function QuickActionBar({ clientId }) {
  const [showMoreActions, setShowMoreActions] = useState(false);

  const primaryActions = [
    {
      id: "note",
      label: "Add Note",
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      action: () => console.log("Add Note for client", clientId),
    },
    {
      id: "call",
      label: "Log Call",
      icon: Phone,
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      action: () => console.log("Log Call for client", clientId),
    },
    {
      id: "meeting",
      label: "Schedule Meeting",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      action: () => console.log("Schedule Meeting for client", clientId),
    },
    {
      id: "email",
      label: "Send Email",
      icon: Mail,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 hover:bg-indigo-100",
      action: () => console.log("Send Email to client", clientId),
    },
  ];

  const secondaryActions = [
    {
      id: "deal",
      label: "Create Deal",
      icon: Briefcase,
      color: "text-orange-600",
      bgColor: "bg-orange-50 hover:bg-orange-100",
      action: () => console.log("Create Deal for client", clientId),
    },
    {
      id: "project",
      label: "Create Project",
      icon: FolderOpen,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 hover:bg-cyan-100",
      action: () => console.log("Create Project for client", clientId),
    },
    {
      id: "document",
      label: "Upload Document",
      icon: UploadCloud,
      color: "text-gray-600",
      bgColor: "bg-gray-50 hover:bg-gray-100",
      action: () => console.log("Upload Document for client", clientId),
    },
    {
      id: "invoice",
      label: "Create Invoice",
      icon: Receipt,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 hover:bg-emerald-100",
      action: () => console.log("Create Invoice for client", clientId),
    },
  ];

  const utilityActions = [
    {
      id: "contact",
      label: "Link Contact",
      icon: UserPlus,
      color: "text-pink-600",
      bgColor: "bg-pink-50 hover:bg-pink-100",
      action: () => console.log("Link Contact to client", clientId),
    },
    {
      id: "share",
      label: "Share Client",
      icon: Share,
      color: "text-teal-600",
      bgColor: "bg-teal-50 hover:bg-teal-100",
      action: () => console.log("Share client", clientId),
    },
    {
      id: "edit",
      label: "Edit Client",
      icon: Edit,
      color: "text-amber-600",
      bgColor: "bg-amber-50 hover:bg-amber-100",
      action: () => console.log("Edit client", clientId),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          {primaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${action.bgColor}`}
              >
                <Icon className={`w-4 h-4 ${action.color}`} />
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Secondary Actions */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Create New</h3>
        <div className="space-y-2">
          {secondaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${action.bgColor}`}
              >
                <Icon className={`w-4 h-4 ${action.color}`} />
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Utility Actions */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Utilities</h3>
        <div className="space-y-2">
          {utilityActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${action.bgColor}`}
              >
                <Icon className={`w-4 h-4 ${action.color}`} />
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Custom Action */}
      <Card className="p-4">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 hover:bg-brand-primary/5 rounded-lg transition-colors border border-dashed border-brand-primary/30">
          <Plus className="w-4 h-4" />
          <span>Custom Action</span>
        </button>
      </Card>
    </div>
  );
}

