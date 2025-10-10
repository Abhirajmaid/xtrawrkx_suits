"use client";

import { useState } from "react";
import { Avatar, Badge } from "../../components/ui";
import {
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  FileText,
  User,
  Building2,
  Briefcase,
  FolderOpen,
  Receipt,
  Star,
  Pin,
  PinOff,
  MoreHorizontal,
  Edit,
  Trash2,
  Share,
  Link,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

export default function ActivityCard({
  activity,
  isPinned = false,
  onPin,
  onUnpin,
  onEdit,
  onDelete,
  onShare,
  showActions = true,
  compact = false,
}) {
  const [showMoreActions, setShowMoreActions] = useState(false);

  const getActivityIcon = (type) => {
    switch (type) {
      case "email":
        return <Mail className="w-5 h-5 text-blue-600" />;
      case "call":
        return <Phone className="w-5 h-5 text-green-600" />;
      case "meeting":
        return <Calendar className="w-5 h-5 text-purple-600" />;
      case "note":
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
      case "deal":
        return <Briefcase className="w-5 h-5 text-indigo-600" />;
      case "invoice":
        return <Receipt className="w-5 h-5 text-emerald-600" />;
      case "project_milestone":
        return <FolderOpen className="w-5 h-5 text-orange-600" />;
      case "portal_activity":
        return <Building2 className="w-5 h-5 text-cyan-600" />;
      case "document":
        return <FileText className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSourceBadge = (source) => {
    const sourceConfig = {
      crm: { color: "badge-primary", label: "CRM" },
      portal: { color: "badge-success", label: "Portal" },
      financial: { color: "badge-warning", label: "Financial" },
      system: { color: "badge-gray", label: "System" },
    };
    
    const config = sourceConfig[source] || sourceConfig.crm;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <Info className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  const handlePinToggle = () => {
    if (isPinned) {
      onUnpin?.(activity.id);
    } else {
      onPin?.(activity.id);
    }
  };

  return (
    <div className={`bg-white rounded-lg border transition-all duration-200 hover:shadow-md ${
      isPinned 
        ? "border-yellow-200 bg-yellow-50/30" 
        : "border-gray-200"
    } ${compact ? "p-3" : "p-4"}`}>
      <div className="flex items-start gap-3">
        {/* Activity Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isPinned 
            ? "bg-yellow-100 border-2 border-yellow-300" 
            : "bg-gray-100"
        }`}>
          {getActivityIcon(activity.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-medium text-gray-900 ${compact ? "text-sm" : "text-base"}`}>
                  {activity.title}
                </h4>
                {getSourceBadge(activity.source)}
                {activity.priority && getPriorityIcon(activity.priority)}
                {isPinned && (
                  <Badge className="badge-warning">
                    <Pin className="w-3 h-3 mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>
              
              {!compact && activity.description && (
                <p className="text-sm text-gray-600 mb-2">
                  {activity.description}
                </p>
              )}
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={handlePinToggle}
                  className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                  title={isPinned ? "Unpin" : "Pin"}
                >
                  {isPinned ? (
                    <PinOff className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <Pin className="w-4 h-4" />
                  )}
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="More actions"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {showMoreActions && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={() => {
                          onEdit?.(activity.id);
                          setShowMoreActions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onShare?.(activity.id);
                          setShowMoreActions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Share className="w-4 h-4" />
                        Share
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          onDelete?.(activity.id);
                          setShowMoreActions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          {activity.metadata && !compact && (
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {Object.entries(activity.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-gray-900 font-medium">
                      {Array.isArray(value) ? value.join(", ") : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {activity.tags && activity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {activity.tags.map((tag) => (
                <Badge key={tag} className="badge-gray text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Avatar name={activity.user} size="xs" />
                <span>{activity.user}</span>
              </div>
              <span>{formatDate(activity.timestamp)} at {formatTime(activity.timestamp)}</span>
            </div>
            <span>{formatRelativeTime(activity.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

