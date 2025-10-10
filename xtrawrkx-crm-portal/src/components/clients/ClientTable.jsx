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
} from "lucide-react";

export default function ClientTable({
  clients,
  selectedClients,
  onClientSelect,
  onSelectAll,
  searchQuery,
  filters,
}) {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [hoveredRow, setHoveredRow] = useState(null);

  // Filter and sort clients
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
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle special sorting cases
      if (sortField === "engagementScore" || sortField === "totalDealValue") {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      } else if (sortField === "lastActivity" || sortField === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

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

  const formatPhone = (phone) => {
    return phone;
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-brand-border/50 overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="w-full min-w-[1400px]">
          <thead className="bg-gray-50 border-b border-brand-border/50">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                />
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Client
                  {sortField === "name" && (
                    <span className="text-brand-primary">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort("industry")}
              >
                <div className="flex items-center gap-2">
                  Industry
                  {sortField === "industry" && (
                    <span className="text-brand-primary">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Primary Contact
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort("owner")}
              >
                <div className="flex items-center gap-2">
                  Owner
                  {sortField === "owner" && (
                    <span className="text-brand-primary">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status
                  {sortField === "status" && (
                    <span className="text-brand-primary">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort("engagementScore")}
              >
                <div className="flex items-center gap-2">
                  Engagement
                  {sortField === "engagementScore" && (
                    <span className="text-brand-primary">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-brand-border/50">
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                className={`hover:bg-gray-50 transition-colors duration-200 ${
                  selectedClients.includes(client.id) ? "bg-blue-50" : ""
                }`}
                onMouseEnter={() => setHoveredRow(client.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={(e) => onClientSelect(client.id, e.target.checked)}
                    className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar
                        name={client.name}
                        size="md"
                        className="ring-2 ring-white shadow-sm"
                      />
                      {client.tags.includes("vip") && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Star className="w-2.5 h-2.5 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/clients/${client.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-brand-primary transition-colors"
                        >
                          {client.name}
                        </Link>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {client.address.city}, {client.address.state}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {client.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} className="badge-gray text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {client.tags.length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{client.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{client.industry}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={client.primaryContact} size="sm" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {client.primaryContact}
                      </div>
                      <div className="text-xs text-gray-500">
                        {client.linkedContactsCount} contacts
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={client.owner} size="sm" />
                    <span className="text-sm text-gray-900">{client.owner}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(client.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                    <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span>{formatDate(client.lastActivity)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{client.linkedDealsCount} deals</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FolderOpen className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{client.linkedProjectsCount} projects</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
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
                    <span className={`text-sm font-medium ${getEngagementScoreColor(client.engagementScore)}`}>
                      {client.engagementScore}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 min-w-[100px] justify-end">
                    <Link
                      href={`/clients/${client.id}`}
                      className={`p-1 text-gray-400 hover:text-brand-primary transition-all duration-200 ${
                        hoveredRow === client.id ? 'opacity-100' : 'opacity-0'
                      }`}
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      className={`p-1 text-gray-400 hover:text-brand-primary transition-all duration-200 ${
                        hoveredRow === client.id ? 'opacity-100' : 'opacity-0'
                      }`}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="More actions"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Building2 className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || Object.values(filters).some(f => f !== "all")
              ? "Try adjusting your search or filters"
              : "Get started by adding your first client"
            }
          </p>
          {!searchQuery && Object.values(filters).every(f => f === "all") && (
            <button className="btn-primary">
              <span>Add Client</span>
              <div className="btn-icon">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

