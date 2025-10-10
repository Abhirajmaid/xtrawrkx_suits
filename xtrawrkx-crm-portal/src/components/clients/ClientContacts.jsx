"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, Badge } from "@xtrawrkx/ui";
import {
  User,
  Mail,
  Phone,
  Building2,
  Star,
  StarOff,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  UserPlus,
  UserMinus,
  Link as LinkIcon,
  Unlink,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function ClientContacts({ clientId }) {
  const [selectedFilters, setSelectedFilters] = useState({
    status: "all",
    role: "all",
    owner: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);

  // Mock contacts data - replace with actual API calls
  const contacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      jobTitle: "Marketing Director",
      email: "sarah.johnson@techcorp.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      role: "primary",
      owner: "John Smith",
      tags: ["decision-maker", "marketing"],
      lastActivity: "2024-01-15",
      createdAt: "2024-01-10",
      avatar: null,
      isLinked: true,
      linkedAt: "2024-01-10",
    },
    {
      id: 2,
      name: "Michael Chen",
      jobTitle: "CTO",
      email: "michael.chen@techcorp.com",
      phone: "+1 (555) 987-6543",
      status: "active",
      role: "technical",
      owner: "Jane Doe",
      tags: ["decision-maker", "technical"],
      lastActivity: "2024-01-14",
      createdAt: "2024-01-08",
      avatar: null,
      isLinked: true,
      linkedAt: "2024-01-08",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      jobTitle: "VP of Sales",
      email: "emily.rodriguez@techcorp.com",
      phone: "+1 (555) 456-7890",
      status: "active",
      role: "influencer",
      owner: "John Smith",
      tags: ["influencer", "sales"],
      lastActivity: "2024-01-15",
      createdAt: "2024-01-05",
      avatar: null,
      isLinked: true,
      linkedAt: "2024-01-05",
    },
    {
      id: 4,
      name: "David Kim",
      jobTitle: "Product Manager",
      email: "david.kim@techcorp.com",
      phone: "+1 (555) 321-0987",
      status: "inactive",
      role: "other",
      owner: "Jane Doe",
      tags: ["product", "mid-level"],
      lastActivity: "2024-01-02",
      createdAt: "2023-12-28",
      avatar: null,
      isLinked: true,
      linkedAt: "2023-12-28",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      jobTitle: "CEO",
      email: "lisa.thompson@techcorp.com",
      phone: "+1 (555) 654-3210",
      status: "active",
      role: "decision-maker",
      owner: "John Smith",
      tags: ["ceo", "decision-maker", "executive"],
      lastActivity: "2024-01-15",
      createdAt: "2024-01-12",
      avatar: null,
      isLinked: true,
      linkedAt: "2024-01-12",
    },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "primary", label: "Primary" },
    { value: "decision-maker", label: "Decision Maker" },
    { value: "influencer", label: "Influencer" },
    { value: "technical", label: "Technical" },
    { value: "other", label: "Other" },
  ];

  const ownerOptions = [
    { value: "all", label: "All Owners" },
    { value: "John Smith", label: "John Smith" },
    { value: "Jane Doe", label: "Jane Doe" },
    { value: "Mike Johnson", label: "Mike Johnson" },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "badge-success", label: "Active" },
      inactive: { color: "badge-gray", label: "Inactive" },
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      primary: { color: "badge-primary", label: "Primary" },
      "decision-maker": { color: "badge-success", label: "Decision Maker" },
      influencer: { color: "badge-warning", label: "Influencer" },
      technical: { color: "badge-info", label: "Technical" },
      other: { color: "badge-gray", label: "Other" },
    };
    
    const config = roleConfig[role] || roleConfig.other;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(dateString);
  };

  const filteredContacts = contacts.filter((contact) => {
    // Status filter
    if (selectedFilters.status !== "all" && contact.status !== selectedFilters.status) {
      return false;
    }

    // Role filter
    if (selectedFilters.role !== "all" && contact.role !== selectedFilters.role) {
      return false;
    }

    // Owner filter
    if (selectedFilters.owner !== "all" && contact.owner !== selectedFilters.owner) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        contact.name,
        contact.jobTitle,
        contact.email,
        contact.phone,
        contact.owner,
        ...contact.tags,
      ].join(" ").toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const handleContactSelect = (contactId, isSelected) => {
    if (isSelected) {
      setSelectedContacts(prev => [...prev, contactId]);
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action}`, selectedContacts);
    // Implement bulk actions
  };

  const handleLinkContact = (contactId) => {
    console.log(`Link contact: ${contactId}`);
    // Implement link contact functionality
  };

  const handleUnlinkContact = (contactId) => {
    console.log(`Unlink contact: ${contactId}`);
    // Implement unlink contact functionality
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Linked Contacts</h3>
          <p className="text-sm text-gray-600">
            All contacts associated with this client
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="btn-primary">
            <span>Link Contact</span>
            <div className="btn-icon">
              <UserPlus className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedFilters.status}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                className="input py-2"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={selectedFilters.role}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, role: e.target.value }))}
                className="input py-2"
              >
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner
              </label>
              <select
                value={selectedFilters.owner}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, owner: e.target.value }))}
                className="input py-2"
              >
                {ownerOptions.map((owner) => (
                  <option key={owner.value} value={owner.value}>
                    {owner.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4 py-2 w-full max-w-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-700">
                {selectedContacts.length} contacts selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction("email")}
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </button>
              <button
                onClick={() => handleBulkAction("unlink")}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-700 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Unlink className="w-4 h-4" />
                Unlink
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow-card border border-brand-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-brand-border/50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
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
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={(e) => handleContactSelect(contact.id, e.target.checked)}
                      className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={contact.name}
                        size="md"
                        className="ring-2 ring-white shadow-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/contacts/${contact.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-brand-primary transition-colors"
                          >
                            {contact.name}
                          </Link>
                          {contact.role === "primary" && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {contact.jobTitle}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {contact.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} className="badge-gray text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {contact.tags.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{contact.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(contact.role)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600 truncate max-w-[200px]">
                          {contact.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {contact.phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(contact.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={contact.owner} size="sm" />
                      <span className="text-sm text-gray-900">{contact.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatRelativeTime(contact.lastActivity)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/contacts/${contact.id}`}
                        className="p-1 text-gray-400 hover:text-brand-primary transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-1 text-gray-400 hover:text-brand-primary transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {contact.isLinked ? (
                        <button
                          onClick={() => handleUnlinkContact(contact.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Unlink"
                        >
                          <Unlink className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleLinkContact(contact.id)}
                          className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                          title="Link"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>
                      )}
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
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedFilters.status !== "all" || selectedFilters.role !== "all" || selectedFilters.owner !== "all"
              ? "Try adjusting your filters or search terms"
              : "No contacts linked to this client yet"
            }
          </p>
          <button className="btn-primary">
            <span>Link First Contact</span>
            <div className="btn-icon">
              <UserPlus className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

