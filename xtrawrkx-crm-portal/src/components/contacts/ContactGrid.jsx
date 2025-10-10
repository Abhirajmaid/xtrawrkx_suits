"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, Badge } from "../../components/ui";
import {
  MoreHorizontal,
  Phone,
  Mail,
  Building2,
  Star,
  Eye,
  Edit,
  User,
  Calendar,
  Tag,
  MapPin,
  Briefcase,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export default function ContactGrid({
  contacts,
  selectedContacts,
  onContactSelect,
  searchQuery,
  filters,
}) {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Filter contacts (same logic as table)
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
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => contact.tags.includes(tag));
        if (!hasMatchingTag) {
          return false;
        }
      }

      return true;
    });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "badge-success", label: "Active" },
      prospect: { color: "badge-warning", label: "Prospect" },
      inactive: { color: "badge-error", label: "Inactive" },
    };
    
    const config = statusConfig[status] || statusConfig.prospect;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getDecisionRoleBadge = (role) => {
    const roleConfig = {
      "decision-maker": { color: "badge-primary", label: "Decision Maker" },
      "influencer": { color: "badge-secondary", label: "Influencer" },
      "other": { color: "badge-gray", label: "Other" },
    };
    
    const config = roleConfig[role] || roleConfig.other;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getEngagementScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getLeadSourceIcon = (source) => {
    switch (source) {
      case "website":
        return <Building2 className="w-3 h-3" />;
      case "linkedin":
        return <User className="w-3 h-3" />;
      case "referral":
        return <UserCheck className="w-3 h-3" />;
      case "conference":
        return <Calendar className="w-3 h-3" />;
      case "email-campaign":
        return <Mail className="w-3 h-3" />;
      default:
        return <Tag className="w-3 h-3" />;
    }
  };

  return (
    <div className="w-full">
      <div className="max-h-[800px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-4" style={{ minWidth: '1400px' }}>
      {filteredContacts.map((contact) => (
        <div
          key={contact.id}
          className={`bg-white rounded-lg shadow-sm border border-brand-border/50 p-4 hover:shadow-md transition-all duration-200 flex flex-col ${
            selectedContacts.includes(contact.id) ? "ring-2 ring-brand-primary/20 bg-blue-50/30" : ""
          }`}
          style={{ minHeight: '480px', minWidth: '260px', maxWidth: '300px' }}
          onMouseEnter={() => setHoveredCard(contact.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedContacts.includes(contact.id)}
                onChange={(e) => onContactSelect(contact.id, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              <div className="relative">
                <Avatar
                  name={contact.name}
                  size="lg"
                  className="ring-2 ring-white shadow-sm"
                />
                {contact.tags.includes("hot-lead") && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-current" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 min-w-[100px] justify-end">
              <Link
                href={`/contacts/${contact.id}`}
                className={`p-2 text-gray-400 hover:text-brand-primary transition-colors rounded hover:bg-gray-100 ${
                  hoveredCard === contact.id ? 'opacity-100' : 'opacity-0'
                }`}
                title="View"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button
                className={`p-2 text-gray-400 hover:text-brand-primary transition-colors rounded hover:bg-gray-100 ${
                  hoveredCard === contact.id ? 'opacity-100' : 'opacity-0'
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

          {/* Contact Info */}
          <div className="mb-4 h-32">
            <Link
              href={`/contacts/${contact.id}`}
              className="text-lg font-bold text-gray-900 hover:text-brand-primary transition-colors block mb-1 line-clamp-1 h-6"
            >
              {contact.name}
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1 h-5">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{contact.jobTitle}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 h-5">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{contact.company}</span>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-2 h-6">
              {contact.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} className="badge-gray text-sm px-2 py-1">
                  {tag}
                </Badge>
              ))}
              {contact.tags.length > 2 && (
                <Badge className="badge-gray text-sm px-2 py-1">
                  +{contact.tags.length - 2}
                </Badge>
              )}
            </div>

            {/* Status & Decision Role */}
            <div className="flex flex-wrap gap-1 mb-2 h-6">
              {getStatusBadge(contact.status)}
              {getDecisionRoleBadge(contact.decisionRole)}
            </div>
          </div>

          {/* Contact Details */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg h-20">
            <div className="flex items-center gap-2 mb-2 h-6">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Contact Details</span>
            </div>
            <div className="space-y-1 h-12">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate text-gray-600">{contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate text-gray-600">{contact.phone}</span>
              </div>
            </div>
          </div>

          {/* Lead Source */}
          <div className="mb-4 h-12">
            <div className="flex items-center gap-2 text-sm text-gray-600 h-5">
              {getLeadSourceIcon(contact.leadSource)}
              <span className="capitalize">{contact.leadSource.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Engagement Score */}
          <div className="mb-4 h-16">
            <div className="flex items-center justify-between mb-1 h-5">
              <span className="text-xs font-medium text-gray-700">Engagement</span>
              <span className={`text-xs font-bold ${getEngagementScoreColor(contact.engagementScore)}`}>
                {contact.engagementScore}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 flex items-center">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
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

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 h-12 mt-auto">
            <div className="flex items-center justify-between text-xs text-gray-500 h-8">
              <div className="flex items-center gap-1 min-w-0 flex-1 h-full">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="truncate flex items-center h-full">{formatDate(contact.lastActivity)}</span>
              </div>
              <div className="flex items-center gap-1 ml-2 h-full">
                <Avatar name={contact.owner} size="xs" />
                <span className="truncate text-xs font-medium flex items-center">{contact.owner.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

          {filteredContacts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <User className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || filters.status !== "all" || filters.owner !== "all" || filters.leadSource !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first contact"
                }
              </p>
              <button className="btn-primary">
                <span>Add Contact</span>
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
