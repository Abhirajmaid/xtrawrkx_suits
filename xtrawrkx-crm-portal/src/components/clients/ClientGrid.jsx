"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, Badge } from "../../../../../../../../components/ui";
import {
  MoreHorizontal,
  Phone,
  Mail,
  Globe,
  Building2,
  Star,
  StarOff,
  Eye,
  Edit,
  Trash2,
  User,
  Calendar,
  Tag,
  Briefcase,
  FolderOpen,
  TrendingUp,
  MapPin,
} from "lucide-react";

export default function ClientGrid({
  clients,
  selectedClients,
  onClientSelect,
  searchQuery,
  filters,
}) {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Filter clients (same logic as table)
  const filteredClients = clients
    .filter((client) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableFields = [
          client.name,
          client.industry,
          client.primaryContact,
          client.owner,
          client.email,
          client.phone,
        ].join(" ").toLowerCase();
        
        if (!searchableFields.includes(query)) {
          return false;
        }
      }

      // Industry filter
      if (filters.industry !== "all" && client.industry !== filters.industry) {
        return false;
      }

      // Status filter
      if (filters.status !== "all" && client.status !== filters.status) {
        return false;
      }

      // Owner filter
      if (filters.owner !== "all" && client.owner !== filters.owner) {
        return false;
      }

      return true;
    });

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
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full">
      <div className="max-h-[800px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-4" style={{ minWidth: '1400px' }}>
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className={`bg-white rounded-lg shadow-sm border border-brand-border/50 p-4 hover:shadow-md transition-all duration-200 flex flex-col ${
                selectedClients.includes(client.id) ? "ring-2 ring-brand-primary/20 bg-blue-50/30" : ""
              }`}
              style={{ minHeight: '480px', minWidth: '260px', maxWidth: '300px' }}
              onMouseEnter={() => setHoveredCard(client.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedClients.includes(client.id)}
                onChange={(e) => onClientSelect(client.id, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              <div className="relative">
                <Avatar
                  name={client.name}
                  size="lg"
                  className="ring-2 ring-white shadow-sm"
                />
                {client.tags.includes("vip") && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-current" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 min-w-[100px] justify-end">
              <Link
                href={`/clients/${client.id}`}
                className={`p-2 text-gray-400 hover:text-brand-primary transition-colors rounded hover:bg-gray-100 ${
                  hoveredCard === client.id ? 'opacity-100' : 'opacity-0'
                }`}
                title="View"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button
                className={`p-2 text-gray-400 hover:text-brand-primary transition-colors rounded hover:bg-gray-100 ${
                  hoveredCard === client.id ? 'opacity-100' : 'opacity-0'
                }`}
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded hover:bg-gray-100"
                title="More actions"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Client Info */}
          <div className="mb-4 h-32">
            <Link
              href={`/clients/${client.id}`}
              className="text-lg font-bold text-gray-900 hover:text-brand-primary transition-colors block mb-1 line-clamp-1 h-6"
            >
              {client.name}
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1 h-5">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{client.industry}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 h-5">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{client.address.city}, {client.address.state}</span>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-2 h-6">
              {client.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} className="badge-gray text-sm px-2 py-1">
                  {tag}
                </Badge>
              ))}
              {client.tags.length > 2 && (
                <Badge className="badge-gray text-sm px-2 py-1">
                  +{client.tags.length - 2}
                </Badge>
              )}
            </div>

            {/* Status */}
            <div className="h-6 flex items-center">
              {getStatusBadge(client.status)}
            </div>
          </div>

          {/* Primary Contact */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg h-20">
            <div className="flex items-center gap-2 mb-2 h-6">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Primary Contact</span>
            </div>
            <div className="flex items-center gap-3 h-12">
              <Avatar name={client.primaryContact} size="md" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 truncate mb-1">
                  {client.primaryContact}
                </div>
                <div className="text-sm text-gray-500">
                  {client.linkedContactsCount} contacts
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4 h-20">
            <div className="text-center p-2 bg-blue-50 rounded-lg flex flex-col justify-center">
              <div className="flex items-center justify-center gap-1 mb-1 h-5">
                <Briefcase className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">Deals</span>
              </div>
              <div className="text-sm font-bold text-blue-900 h-5 flex items-center justify-center">{client.linkedDealsCount}</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg flex flex-col justify-center">
              <div className="flex items-center justify-center gap-1 mb-1 h-5">
                <FolderOpen className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-600">Projects</span>
              </div>
              <div className="text-sm font-bold text-green-900 h-5 flex items-center justify-center">{client.linkedProjectsCount}</div>
            </div>
          </div>

          {/* Engagement Score */}
          <div className="mb-4 h-16">
            <div className="flex items-center justify-between mb-1 h-5">
              <span className="text-xs font-medium text-gray-700">Engagement</span>
              <span className={`text-xs font-bold ${getEngagementScoreColor(client.engagementScore)}`}>
                {client.engagementScore}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 flex items-center">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
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

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 h-12 mt-auto">
            <div className="flex items-center justify-between text-xs text-gray-500 h-8">
              <div className="flex items-center gap-1 min-w-0 flex-1 h-full">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="truncate flex items-center h-full">{formatDate(client.lastActivity)}</span>
              </div>
              <div className="flex items-center gap-1 ml-2 h-full">
                <Avatar name={client.owner} size="xs" />
                <span className="truncate text-xs font-medium flex items-center">{client.owner.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

          {filteredClients.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <Building2 className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || filters.industry !== "all" || filters.status !== "all" || filters.owner !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first client"
                }
              </p>
              <button className="btn-primary">
                <span>Add Client</span>
                <div className="btn-icon">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
