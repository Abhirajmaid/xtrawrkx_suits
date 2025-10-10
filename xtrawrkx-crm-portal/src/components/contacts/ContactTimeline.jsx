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
  Star,
  Clock,
  Filter,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ContactTimeline({ contactId }) {
  const [selectedFilters, setSelectedFilters] = useState({
    type: "all",
    user: "all",
    dateRange: "30d",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Mock timeline data - replace with actual API calls
  const timelineData = [
    {
      id: 1,
      type: "email",
      title: "Sent proposal for Q1 project",
      description: "Followed up on the enterprise solution proposal with detailed pricing and timeline.",
      timestamp: "2024-01-15T10:30:00Z",
      user: "John Smith",
      userAvatar: null,
      metadata: {
        subject: "Q1 Project Proposal - TechCorp Inc.",
        recipients: ["sarah.johnson@techcorp.com"],
        attachments: 2,
      },
      source: "crm",
      tags: ["proposal", "follow-up"],
    },
    {
      id: 2,
      type: "call",
      title: "Discovery call completed",
      description: "Discussed requirements, timeline, and budget. Client is very interested in our premium package.",
      timestamp: "2024-01-14T14:15:00Z",
      user: "Jane Doe",
      userAvatar: null,
      metadata: {
        duration: "45 minutes",
        outcome: "positive",
        nextSteps: "Send detailed proposal",
      },
      source: "crm",
      tags: ["discovery", "requirements"],
    },
    {
      id: 3,
      type: "portal_activity",
      title: "Client viewed project documents",
      description: "Sarah Johnson accessed the project repository and downloaded the technical specifications.",
      timestamp: "2024-01-14T09:20:00Z",
      user: "System",
      userAvatar: null,
      metadata: {
        action: "document_view",
        document: "Technical Specifications v2.1",
        duration: "12 minutes",
      },
      source: "portal",
      tags: ["document", "engagement"],
    },
    {
      id: 4,
      type: "meeting",
      title: "Product demo scheduled",
      description: "Scheduled for next Tuesday at 2 PM. Will demo the enterprise features and integration capabilities.",
      timestamp: "2024-01-13T16:45:00Z",
      user: "Mike Johnson",
      userAvatar: null,
      metadata: {
        scheduledDate: "2024-01-16T14:00:00Z",
        duration: "60 minutes",
        attendees: ["Sarah Johnson", "Mike Johnson", "John Smith"],
        meetingType: "demo",
      },
      source: "crm",
      tags: ["demo", "scheduled"],
    },
    {
      id: 5,
      type: "note",
      title: "Added internal note",
      description: "Client is very interested in our premium package. They mentioned budget approval process takes 2-3 weeks.",
      timestamp: "2024-01-12T09:20:00Z",
      user: "John Smith",
      userAvatar: null,
      metadata: {
        visibility: "internal",
        category: "sales",
      },
      source: "crm",
      tags: ["note", "budget"],
    },
    {
      id: 6,
      type: "portal_activity",
      title: "Client submitted support ticket",
      description: "Submitted ticket #1234 regarding integration questions. Priority: Medium.",
      timestamp: "2024-01-11T15:30:00Z",
      user: "System",
      userAvatar: null,
      metadata: {
        ticketId: "1234",
        priority: "medium",
        category: "integration",
        status: "open",
      },
      source: "portal",
      tags: ["support", "integration"],
    },
    {
      id: 7,
      type: "email",
      title: "Initial contact email sent",
      description: "Reached out after they filled out the contact form on our website.",
      timestamp: "2024-01-10T11:00:00Z",
      user: "John Smith",
      userAvatar: null,
      metadata: {
        subject: "Welcome to Xtrawrkx CRM - Let's discuss your needs",
        recipients: ["sarah.johnson@techcorp.com"],
        template: "welcome_enterprise",
      },
      source: "crm",
      tags: ["welcome", "initial-contact"],
    },
  ];

  const activityTypes = [
    { value: "all", label: "All Activities", icon: Clock },
    { value: "email", label: "Emails", icon: Mail },
    { value: "call", label: "Calls", icon: Phone },
    { value: "meeting", label: "Meetings", icon: Calendar },
    { value: "note", label: "Notes", icon: MessageSquare },
    { value: "portal_activity", label: "Portal Activity", icon: Building2 },
  ];

  const users = [
    { value: "all", label: "All Users" },
    { value: "John Smith", label: "John Smith" },
    { value: "Jane Doe", label: "Jane Doe" },
    { value: "Mike Johnson", label: "Mike Johnson" },
    { value: "System", label: "System" },
  ];

  const dateRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "all", label: "All time" },
  ];

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
      case "portal_activity":
        return <Building2 className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSourceBadge = (source) => {
    const sourceConfig = {
      crm: { color: "badge-primary", label: "CRM" },
      portal: { color: "badge-success", label: "Portal" },
    };
    
    const config = sourceConfig[source] || sourceConfig.crm;
    return <Badge className={config.color}>{config.label}</Badge>;
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

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const filteredTimeline = timelineData.filter((item) => {
    // Type filter
    if (selectedFilters.type !== "all" && item.type !== selectedFilters.type) {
      return false;
    }

    // User filter
    if (selectedFilters.user !== "all" && item.user !== selectedFilters.user) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        item.title,
        item.description,
        item.user,
        ...item.tags,
      ].join(" ").toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="p-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
          <p className="text-sm text-gray-600">
            Complete history of interactions and activities
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
            <span>Add Activity</span>
            <div className="btn-icon">
              <Plus className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Activity Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Type
              </label>
              <select
                value={selectedFilters.type}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))}
                className="input py-2"
              >
                {activityTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* User Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User
              </label>
              <select
                value={selectedFilters.user}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, user: e.target.value }))}
                className="input py-2"
              >
                {users.map((user) => (
                  <option key={user.value} value={user.value}>
                    {user.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={selectedFilters.dateRange}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="input py-2"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search timeline..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4 py-2 w-full max-w-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {filteredTimeline.map((item, index) => (
            <div key={item.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute left-6 w-3 h-3 bg-white border-2 border-brand-primary rounded-full transform -translate-x-1/2 z-10"></div>

              {/* Timeline Content */}
              <div className="ml-12">
                <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.title}
                          </h4>
                          {getSourceBadge(item.source)}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          {item.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.map((tag) => (
                            <Badge key={tag} className="badge-gray text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Metadata */}
                        {item.metadata && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                              {Object.entries(item.metadata).map(([key, value]) => (
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

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Avatar name={item.user} size="xs" />
                              <span>{item.user}</span>
                            </div>
                            <span>{formatDate(item.timestamp)} at {formatTime(item.timestamp)}</span>
                          </div>
                          <span>{formatRelativeTime(item.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredTimeline.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedFilters.type !== "all" || selectedFilters.user !== "all"
              ? "Try adjusting your filters or search terms"
              : "No activities recorded yet"
            }
          </p>
          <button className="btn-primary">
            <span>Add First Activity</span>
            <div className="btn-icon">
              <Plus className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
