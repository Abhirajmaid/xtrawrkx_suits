"use client";

import { useState } from "react";
import { Avatar, Badge } from "@xtrawrkx/ui";
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
  Download,
  FilePdf,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Receipt,
  Tag,
  Pin,
  PinOff,
} from "lucide-react";

export default function ClientTimeline({ clientId }) {
  const [selectedFilters, setSelectedFilters] = useState({
    type: "all",
    source: "all",
    user: "all",
    dateRange: "30d",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedItems, setPinnedItems] = useState(new Set([1, 3])); // Mock pinned items

  // Mock timeline data - replace with actual API calls
  const timelineData = [
    {
      id: 1,
      type: "deal",
      title: "Deal Won: Enterprise CRM Implementation",
      description: "Successfully closed the $75,000 enterprise CRM implementation deal. Client signed the contract and project kickoff is scheduled for next week.",
      timestamp: "2024-01-15T10:30:00Z",
      user: "John Smith",
      userAvatar: null,
      metadata: {
        dealValue: 75000,
        dealStage: "closed-won",
        contractSigned: true,
        projectKickoff: "2024-01-22T09:00:00Z",
      },
      source: "crm",
      tags: ["deal", "closed-won", "enterprise"],
      isPinned: true,
    },
    {
      id: 2,
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
      isPinned: false,
    },
    {
      id: 3,
      type: "project_milestone",
      title: "Project Milestone: Phase 1 Complete",
      description: "Successfully completed Phase 1 of the CRM implementation. All core modules are now live and user training has been completed.",
      timestamp: "2024-01-14T14:15:00Z",
      user: "System",
      userAvatar: null,
      metadata: {
        projectId: "proj-001",
        milestone: "Phase 1 Complete",
        completionRate: 100,
        nextPhase: "Phase 2 - Advanced Features",
      },
      source: "portal",
      tags: ["milestone", "project", "completion"],
      isPinned: true,
    },
    {
      id: 4,
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
      isPinned: false,
    },
    {
      id: 5,
      type: "portal_activity",
      title: "Client uploaded project documents",
      description: "Sarah Johnson uploaded technical specifications and requirements document to the project portal.",
      timestamp: "2024-01-14T09:20:00Z",
      user: "System",
      userAvatar: null,
      metadata: {
        action: "document_upload",
        document: "Technical Specifications v2.1",
        fileSize: "2.3 MB",
        projectId: "proj-001",
      },
      source: "portal",
      tags: ["document", "upload"],
      isPinned: false,
    },
    {
      id: 6,
      type: "invoice",
      title: "Invoice #INV-2024-001 Paid",
      description: "Payment received for Invoice #INV-2024-001 in the amount of $15,000. Payment processed via bank transfer.",
      timestamp: "2024-01-13T16:45:00Z",
      user: "System",
      userAvatar: null,
      metadata: {
        invoiceNumber: "INV-2024-001",
        amount: 15000,
        paymentMethod: "Bank Transfer",
        paymentDate: "2024-01-13T16:45:00Z",
      },
      source: "crm",
      tags: ["invoice", "payment", "financial"],
      isPinned: false,
    },
    {
      id: 7,
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
      isPinned: false,
    },
    {
      id: 8,
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
      isPinned: false,
    },
    {
      id: 9,
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
      isPinned: false,
    },
    {
      id: 10,
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
      isPinned: false,
    },
  ];

  const activityTypes = [
    { value: "all", label: "All Activities", icon: Clock },
    { value: "email", label: "Emails", icon: Mail },
    { value: "call", label: "Calls", icon: Phone },
    { value: "meeting", label: "Meetings", icon: Calendar },
    { value: "note", label: "Notes", icon: MessageSquare },
    { value: "deal", label: "Deals", icon: Briefcase },
    { value: "invoice", label: "Invoices", icon: Receipt },
    { value: "project_milestone", label: "Project Milestones", icon: FolderOpen },
    { value: "portal_activity", label: "Portal Activity", icon: Building2 },
  ];

  const sources = [
    { value: "all", label: "All Sources" },
    { value: "crm", label: "CRM Only" },
    { value: "portal", label: "Portal Only" },
    { value: "financial", label: "Financial" },
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
      case "deal":
        return <Briefcase className="w-5 h-5 text-indigo-600" />;
      case "invoice":
        return <Receipt className="w-5 h-5 text-emerald-600" />;
      case "project_milestone":
        return <FolderOpen className="w-5 h-5 text-orange-600" />;
      case "portal_activity":
        return <Building2 className="w-5 h-5 text-cyan-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSourceBadge = (source) => {
    const sourceConfig = {
      crm: { color: "badge-primary", label: "CRM" },
      portal: { color: "badge-success", label: "Portal" },
      financial: { color: "badge-warning", label: "Financial" },
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

  const formatValue = (key, value) => {
    // Handle currency formatting for specific keys
    if (key === 'dealValue' || key === 'amount' || key === 'price' || key === 'cost') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    
    // Handle percentage formatting
    if (key === 'completionRate' || key === 'percentage') {
      return `${value}%`;
    }
    
    // Handle array values
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    
    // Return value as-is for other types
    return value;
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

  const togglePinned = (itemId) => {
    const newPinned = new Set(pinnedItems);
    if (newPinned.has(itemId)) {
      newPinned.delete(itemId);
    } else {
      newPinned.add(itemId);
    }
    setPinnedItems(newPinned);
  };

  const filteredTimeline = timelineData.filter((item) => {
    // Type filter
    if (selectedFilters.type !== "all" && item.type !== selectedFilters.type) {
      return false;
    }

    // Source filter
    if (selectedFilters.source !== "all") {
      if (selectedFilters.source === "financial" && !item.tags.includes("financial")) {
        return false;
      }
      if (selectedFilters.source !== "financial" && item.source !== selectedFilters.source) {
        return false;
      }
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

  // Sort by pinned items first, then by timestamp
  const sortedTimeline = filteredTimeline.sort((a, b) => {
    const aPinned = pinnedItems.has(a.id);
    const bPinned = pinnedItems.has(b.id);
    
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  const exportTimeline = (format) => {
    console.log(`Exporting timeline as ${format}`);
    // Implement export functionality
  };

  return (
    <div className="p-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
          <p className="text-sm text-gray-600">
            Unified timeline of CRM and Client Portal activities
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
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-3 h-3" />
            </button>
            {/* Export dropdown would go here */}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source
              </label>
              <select
                value={selectedFilters.source}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, source: e.target.value }))}
                className="input py-2"
              >
                {sources.map((source) => (
                  <option key={source.value} value={source.value}>
                    {source.label}
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
          {sortedTimeline.map((item, index) => (
            <div key={item.id} className="relative">
              {/* Timeline Dot */}
              <div className={`absolute left-6 w-3 h-3 bg-white border-2 rounded-full transform -translate-x-1/2 z-10 ${
                pinnedItems.has(item.id) 
                  ? "border-yellow-500 bg-yellow-100" 
                  : "border-brand-primary"
              }`}>
                {pinnedItems.has(item.id) && (
                  <Pin className="w-2 h-2 text-yellow-600 absolute top-0.5 left-0.5" />
                )}
              </div>

              {/* Timeline Content */}
              <div className="ml-12">
                <div className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow ${
                  pinnedItems.has(item.id) 
                    ? "border-yellow-200 bg-yellow-50/30" 
                    : "border-gray-200"
                }`}>
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
                          {pinnedItems.has(item.id) && (
                            <Badge className="badge-warning">
                              <Pin className="w-3 h-3 mr-1" />
                              Pinned
                            </Badge>
                          )}
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
                                    {formatValue(key, value)}
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
                          <div className="flex items-center gap-2">
                            <span>{formatRelativeTime(item.timestamp)}</span>
                            <button
                              onClick={() => togglePinned(item.id)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title={pinnedItems.has(item.id) ? "Unpin" : "Pin"}
                            >
                              {pinnedItems.has(item.id) ? (
                                <PinOff className="w-3 h-3 text-yellow-600" />
                              ) : (
                                <Pin className="w-3 h-3 text-gray-400" />
                              )}
                            </button>
                          </div>
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
            {searchQuery || selectedFilters.type !== "all" || selectedFilters.source !== "all" || selectedFilters.user !== "all"
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

