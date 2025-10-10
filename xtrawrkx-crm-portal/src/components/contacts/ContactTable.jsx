"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, Badge } from "../../../../../../../../components/ui";
import {
  MoreHorizontal,
  Phone,
  Mail,
  Building2,
  Star,
  StarOff,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Calendar,
  Tag,
} from "lucide-react";

export default function ContactTable({
  contacts,
  selectedContacts,
  onContactSelect,
  onSelectAll,
  searchQuery,
  filters,
}) {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [hoveredRow, setHoveredRow] = useState(null);

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter((contact) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableFields = [
          contact.name,
          contact.jobTitle,
          contact.company,
          contact.email,
          contact.phone,
        ].join(" ").toLowerCase();
        
        if (!searchableFields.includes(query)) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== "all" && contact.status !== filters.status) {
        return false;
      }

      // Owner filter
      if (filters.owner !== "all" && contact.owner !== filters.owner) {
        return false;
      }

      // Lead source filter
      if (filters.leadSource !== "all" && contact.leadSource !== filters.leadSource) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => contact.tags.includes(tag));
        if (!hasMatchingTag) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle special sorting cases
      if (sortField === "engagementScore") {
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
      inactive: { color: "badge-gray", label: "Inactive" },
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getEngagementScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getDecisionRoleIcon = (role) => {
    switch (role) {
      case "decision-maker":
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case "influencer":
        return <Star className="w-4 h-4 text-yellow-600" />;
      default:
        return <StarOff className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPhone = (phone) => {
    // Simple phone formatting - you can enhance this
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
                  checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                />
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Contact
                  {sortField === "name" && (
                    <span className="text-brand-primary">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort("company")}
              >
                <div className="flex items-center gap-2">
                  Company
                  {sortField === "company" && (
                    <span className="text-brand-primary">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
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
                Owner & Activity
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-brand-border/50">
            {filteredContacts.map((contact) => (
              <tr
                key={contact.id}
                className={`hover:bg-gray-50 transition-colors duration-200 ${
                  selectedContacts.includes(contact.id) ? "bg-blue-50" : ""
                }`}
                onMouseEnter={() => setHoveredRow(contact.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={(e) => onContactSelect(contact.id, e.target.checked)}
                    className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar
                        name={contact.name}
                        size="md"
                        className="ring-2 ring-white shadow-sm"
                      />
                      {contact.tags.includes("hot-lead") && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <Star className="w-2.5 h-2.5 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/contacts/${contact.id}`}
                          className="text-sm font-semibold text-gray-900 hover:text-brand-primary transition-colors"
                        >
                          {contact.name}
                        </Link>
                        {getDecisionRoleIcon(contact.decisionRole)}
                      </div>
                      <p className="text-sm text-gray-600 font-medium truncate mb-2">
                        {contact.jobTitle}
                      </p>
                      <div className="flex items-center gap-1 flex-wrap">
                        {contact.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} className="badge-gray text-xs px-2 py-0.5">
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags.length > 2 && (
                          <Badge className="badge-gray text-xs px-2 py-0.5">
                            +{contact.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{contact.company}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-900 truncate max-w-[180px] font-medium">
                        {contact.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        {formatPhone(contact.phone)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(contact.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
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
                    <span className={`text-sm font-medium ${getEngagementScoreColor(contact.engagementScore)}`}>
                      {contact.engagementScore}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar name={contact.owner} size="sm" />
                      <span className="text-sm text-gray-900 font-medium">{contact.owner}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(contact.lastActivity)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 min-w-[100px] justify-end">
                    <Link
                      href={`/contacts/${contact.id}`}
                      className={`p-1 text-gray-400 hover:text-brand-primary transition-all duration-200 ${
                        hoveredRow === contact.id ? 'opacity-100' : 'opacity-0'
                      }`}
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      className={`p-1 text-gray-400 hover:text-brand-primary transition-all duration-200 ${
                        hoveredRow === contact.id ? 'opacity-100' : 'opacity-0'
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

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <UserCheck className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || Object.values(filters).some(f => f !== "all" && f.length > 0)
              ? "Try adjusting your search or filters"
              : "Get started by adding your first contact"
            }
          </p>
          {!searchQuery && Object.values(filters).every(f => f === "all" || f.length === 0) && (
            <button className="btn-primary">
              <span>Add Contact</span>
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
