"use client";

import { useState } from "react";
import {
  Plus,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  FileText,
  UserPlus,
  Briefcase,
  FolderOpen,
  Star,
  Share,
  Edit,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";

export default function QuickActionBar({ 
  contactId, 
  onSendEmail, 
  onLogCall, 
  onScheduleMeeting, 
  onAddNote,
  onUploadDocument,
  onCreateDeal,
  onCreateProject,
  onDuplicateContact,
  onStarContact,
  onShareContact
}) {
  const [showMoreActions, setShowMoreActions] = useState(false);

  const primaryActions = [
    {
      id: "email",
      label: "Send Email",
      icon: Mail,
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Send an email to this contact",
    },
    {
      id: "call",
      label: "Log Call",
      icon: Phone,
      color: "bg-green-500 hover:bg-green-600",
      description: "Log a phone call with this contact",
    },
    {
      id: "meeting",
      label: "Schedule Meeting",
      icon: Calendar,
      color: "bg-purple-500 hover:bg-purple-600",
      description: "Schedule a meeting with this contact",
    },
    {
      id: "note",
      label: "Add Note",
      icon: MessageSquare,
      color: "bg-gray-500 hover:bg-gray-600",
      description: "Add an internal note about this contact",
    },
  ];

  const secondaryActions = [
    {
      id: "document",
      label: "Upload Document",
      icon: FileText,
      color: "bg-orange-500 hover:bg-orange-600",
      description: "Upload a document for this contact",
    },
    {
      id: "deal",
      label: "Create Deal",
      icon: Briefcase,
      color: "bg-indigo-500 hover:bg-indigo-600",
      description: "Create a new deal for this contact",
    },
    {
      id: "project",
      label: "Create Project",
      icon: FolderOpen,
      color: "bg-teal-500 hover:bg-teal-600",
      description: "Create a new project for this contact",
    },
    {
      id: "duplicate",
      label: "Duplicate Contact",
      icon: UserPlus,
      color: "bg-pink-500 hover:bg-pink-600",
      description: "Create a duplicate of this contact",
    },
    {
      id: "star",
      label: "Star Contact",
      icon: Star,
      color: "bg-yellow-500 hover:bg-yellow-600",
      description: "Mark this contact as starred",
    },
    {
      id: "share",
      label: "Share Contact",
      icon: Share,
      color: "bg-cyan-500 hover:bg-cyan-600",
      description: "Share this contact with team members",
    },
  ];

  const handleAction = (actionId) => {
    console.log(`Action: ${actionId} for contact: ${contactId}`);
    
    // Handle different actions
    switch (actionId) {
      case "email":
        if (onSendEmail) onSendEmail();
        break;
      case "call":
        if (onLogCall) onLogCall();
        break;
      case "meeting":
        if (onScheduleMeeting) onScheduleMeeting();
        break;
      case "note":
        if (onAddNote) onAddNote();
        break;
      case "document":
        if (onUploadDocument) onUploadDocument();
        break;
      case "deal":
        if (onCreateDeal) onCreateDeal();
        break;
      case "project":
        if (onCreateProject) onCreateProject();
        break;
      case "duplicate":
        if (onDuplicateContact) onDuplicateContact();
        break;
      case "star":
        if (onStarContact) onStarContact();
        break;
      case "share":
        if (onShareContact) onShareContact();
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-brand-border/50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
          <p className="text-xs text-gray-500">Common actions for this contact</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Primary Actions */}
          <div className="flex items-center gap-2">
            {primaryActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-white rounded-lg transition-all duration-200 hover:shadow-md ${action.color}`}
                  title={action.description}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">More</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showMoreActions ? 'rotate-180' : ''}`} />
            </button>

            {showMoreActions && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-3 py-2 border-b border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900">More Actions</h4>
                </div>
                <div className="py-1">
                  {secondaryActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => {
                          handleAction(action.id);
                          setShowMoreActions(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{action.label}</div>
                          <div className="text-xs text-gray-500">{action.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="mt-4 sm:hidden">
        <div className="grid grid-cols-2 gap-2">
          {primaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                className={`flex items-center gap-2 px-3 py-2 text-white rounded-lg transition-all duration-200 ${action.color}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
