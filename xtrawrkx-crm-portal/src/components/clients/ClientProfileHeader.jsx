"use client";

import { useState } from "react";
import { Avatar, Badge } from "../../../../../../../../components/ui";
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
  User,
  Building2,
  Tag,
  TrendingUp,
  Clock,
  ExternalLink,
  Briefcase,
  FolderOpen,
  DollarSign,
} from "lucide-react";

export default function ClientProfileHeader({ client }) {
  const [isStarred, setIsStarred] = useState(client.tags.includes("vip"));
  const [showMoreActions, setShowMoreActions] = useState(false);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "badge-success", label: "Active" },
      prospect: { color: "badge-warning", label: "Prospect" },
      "on-hold": { color: "badge-gray", label: "On Hold" },
      inactive: { color: "badge-error", label: "Inactive" },
    };
    
    const config = statusConfig[status] || statusConfig.prospect;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getEngagementScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
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
            {/* Logo/Avatar */}
            <div className="relative">
              <Avatar
                name={client.name}
                size="xl"
                className="ring-4 ring-white shadow-lg"
              />
              {client.tags.includes("vip") && (
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-md">
                  <Star className="w-4 h-4 text-white fill-current" />
                </div>
              )}
            </div>

            {/* Client Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {client.name}
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
                {getStatusBadge(client.status)}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-lg text-gray-700">{client.industry}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">
                  {client.address.city}, {client.address.state}
                </span>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {client.tags.map((tag) => (
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
                      href={`mailto:${client.email}`}
                      className="text-sm text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      {client.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a
                      href={`tel:${client.phone}`}
                      className="text-sm text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      {formatPhone(client.phone)}
                    </a>
                  </div>
                  {client.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-brand-primary transition-colors flex items-center gap-1"
                      >
                        {client.website}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {client.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        {formatAddress(client.address)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Primary Contact: {client.primaryContact}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Last activity: {formatDate(client.lastActivity)}
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
                    Share Client
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Engagement Score */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Engagement</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              <span className={getEngagementScoreColor(client.engagementScore)}>
                {client.engagementScore}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  client.engagementScore >= 80
                    ? "bg-green-500"
                    : client.engagementScore >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${client.engagementScore}%` }}
              />
            </div>
          </div>

          {/* Owner */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Owner</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Avatar name={client.owner} size="sm" />
              <span className="text-sm font-medium text-gray-900">
                {client.owner}
              </span>
            </div>
          </div>

          {/* Deals */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Deals</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {client.linkedDealsCount}
            </div>
            <div className="text-xs text-gray-500">
              {formatCurrency(client.totalDealValue)}
            </div>
          </div>

          {/* Projects */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FolderOpen className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Projects</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {client.linkedProjectsCount}
            </div>
            <div className="text-xs text-gray-500">
              {client.linkedContactsCount} contacts
            </div>
          </div>

          {/* Created Date */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Created</span>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatDate(client.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

