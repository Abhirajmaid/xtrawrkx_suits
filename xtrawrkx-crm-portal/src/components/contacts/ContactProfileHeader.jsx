"use client";

import { useState } from "react";
import { Avatar, Badge } from "@xtrawrkx/ui";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Star,
  StarOff,
  MoreHorizontal,
  Edit,
  Share,
  Archive,
  Trash2,
  UserCheck,
  Building2,
  Tag,
  TrendingUp,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function ContactProfileHeader({ contact }) {
  const [isStarred, setIsStarred] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "badge-success", label: "Active" },
      prospect: { color: "badge-warning", label: "Prospect" },
      inactive: { color: "badge-gray", label: "Inactive" },
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getDecisionRoleIcon = (role) => {
    switch (role) {
      case "decision-maker":
        return <UserCheck className="w-5 h-5 text-green-600" />;
      case "influencer":
        return <Star className="w-5 h-5 text-yellow-600" />;
      default:
        return <StarOff className="w-5 h-5 text-gray-400" />;
    }
  };

  const getEngagementScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPhone = (phone) => {
    return phone;
  };

  const formatAddress = (address) => {
    if (!address) return null;
    const parts = [address.street, address.city, address.state, address.zip].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-brand-border/50 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                name={contact.name}
                size="xl"
                className="ring-4 ring-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                {getDecisionRoleIcon(contact.decisionRole)}
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {contact.name}
                </h1>
                <button
                  onClick={() => setIsStarred(!isStarred)}
                  className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  {isStarred ? (
                    <Star className="w-5 h-5 fill-current text-yellow-500" />
                  ) : (
                    <StarOff className="w-5 h-5" />
                  )}
                </button>
                {getStatusBadge(contact.status)}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-lg text-gray-700">{contact.jobTitle}</span>
                <span className="text-gray-400">at</span>
                <span className="text-lg font-medium text-gray-900">
                  {contact.company}
                </span>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map((tag) => (
                    <Badge key={tag} className="badge-gray text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-sm text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      {formatPhone(contact.phone)}
                    </a>
                  </div>
                  {contact.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <a
                        href={contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-brand-primary transition-colors flex items-center gap-1"
                      >
                        {contact.website}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {contact.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        {formatAddress(contact.address)}
                      </span>
                    </div>
                  )}
                  {contact.birthday && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Birthday: {formatDate(contact.birthday)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Last activity: {formatDate(contact.lastActivity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="btn-secondary">
              <span>Edit</span>
              <div className="btn-icon">
                <Edit className="w-4 h-4" />
              </div>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowMoreActions(!showMoreActions)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {showMoreActions && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Share className="w-4 h-4" />
                    Share Contact
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                  <hr className="my-1" />
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Engagement Score */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Engagement</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              <span className={getEngagementScoreColor(contact.engagementScore)}>
                {contact.engagementScore}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  contact.engagementScore >= 80
                    ? "bg-green-500"
                    : contact.engagementScore >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${contact.engagementScore}%` }}
              />
            </div>
          </div>

          {/* Owner */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Owner</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Avatar name={contact.owner} size="sm" />
              <span className="text-sm font-medium text-gray-900">
                {contact.owner}
              </span>
            </div>
          </div>

          {/* Lead Source */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Source</span>
            </div>
            <div className="text-sm font-medium text-gray-900 capitalize">
              {contact.leadSource.replace("-", " ")}
            </div>
          </div>

          {/* Created Date */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Created</span>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatDate(contact.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
