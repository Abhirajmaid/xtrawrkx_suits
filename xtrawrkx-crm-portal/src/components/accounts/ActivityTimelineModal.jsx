"use client";

import { useState } from "react";
import { Modal, Avatar } from "../../../../../../../../components/ui";
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar, 
  Phone, 
  Mail, 
  FileText, 
  Users, 
  Briefcase, 
  MessageSquare,
  Clock,
  ChevronDown,
  ExternalLink
} from "lucide-react";

export default function ActivityTimelineModal({ isOpen, onClose, selectedAccounts = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30");

  // Mock activity data
  const activities = [
    {
      id: 1,
      type: "call",
      title: "Sales call completed",
      description: "Discussed Q4 requirements and pricing options",
      account: "Tech Solutions Inc",
      user: "John Smith",
      userInitials: "JS",
      timestamp: "2024-01-15T10:30:00Z",
      duration: "45 min",
      outcome: "Positive",
    },
    {
      id: 2,
      type: "email",
      title: "Proposal sent",
      description: "Sent detailed proposal for enterprise package",
      account: "Global Enterprises",
      user: "Emily Davis",
      userInitials: "ED",
      timestamp: "2024-01-15T09:15:00Z",
      attachments: 2,
    },
    {
      id: 3,
      type: "meeting",
      title: "Demo scheduled",
      description: "Product demonstration meeting set for next week",
      account: "StartUp Hub",
      user: "Sarah Wilson",
      userInitials: "SW",
      timestamp: "2024-01-14T16:45:00Z",
      location: "Virtual",
    },
    {
      id: 4,
      type: "deal",
      title: "Deal created",
      description: "New opportunity: Enterprise Software License",
      account: "Innovation Labs",
      user: "John Smith",
      userInitials: "JS",
      timestamp: "2024-01-14T14:20:00Z",
      value: "$50,000",
      stage: "Qualification",
    },
    {
      id: 5,
      type: "note",
      title: "Follow-up note",
      description: "Client expressed interest in additional modules. Need to prepare custom quote.",
      account: "Digital Marketing Pro",
      user: "Emily Davis",
      userInitials: "ED",
      timestamp: "2024-01-14T11:30:00Z",
    },
    {
      id: 6,
      type: "task",
      title: "Task completed",
      description: "Prepared contract documents for review",
      account: "Tech Solutions Inc",
      user: "Sarah Wilson",
      userInitials: "SW",
      timestamp: "2024-01-13T15:10:00Z",
      status: "Completed",
    },
    {
      id: 7,
      type: "email",
      title: "Follow-up email sent",
      description: "Checking in on decision timeline and next steps",
      account: "Global Enterprises",
      user: "John Smith",
      userInitials: "JS",
      timestamp: "2024-01-13T13:45:00Z",
    },
    {
      id: 8,
      type: "call",
      title: "Discovery call",
      description: "Initial needs assessment and qualification call",
      account: "StartUp Hub",
      user: "Emily Davis",
      userInitials: "ED",
      timestamp: "2024-01-12T10:00:00Z",
      duration: "30 min",
      outcome: "Qualified",
    },
  ];

  const activityTypes = [
    { value: "all", label: "All Activities", icon: Activity },
    { value: "call", label: "Calls", icon: Phone },
    { value: "email", label: "Emails", icon: Mail },
    { value: "meeting", label: "Meetings", icon: Calendar },
    { value: "deal", label: "Deals", icon: Briefcase },
    { value: "note", label: "Notes", icon: FileText },
    { value: "task", label: "Tasks", icon: Users },
  ];

  const getActivityIcon = (type) => {
    const iconMap = {
      call: Phone,
      email: Mail,
      meeting: Calendar,
      deal: Briefcase,
      note: FileText,
      task: Users,
    };
    return iconMap[type] || Activity;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      call: "text-green-600 bg-green-100",
      email: "text-blue-600 bg-blue-100",
      meeting: "text-purple-600 bg-purple-100",
      deal: "text-orange-600 bg-orange-100",
      note: "text-gray-600 bg-gray-100",
      task: "text-indigo-600 bg-indigo-100",
    };
    return colorMap[type] || "text-gray-600 bg-gray-100";
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredActivities = activities.filter(activity => {
    // Filter by type
    if (selectedFilter !== "all" && activity.type !== selectedFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        activity.title.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.account.toLowerCase().includes(query) ||
        activity.user.toLowerCase().includes(query)
      );
    }
    
    // Filter by date range
    const activityDate = new Date(activity.timestamp);
    const daysAgo = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    
    return activityDate >= cutoffDate;
  });

  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Activity Timeline"
      size="xl"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Calls</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {activities.filter(a => a.type === 'call').length}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Emails</span>
            </div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {activities.filter(a => a.type === 'email').length}
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Meetings</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 mt-1">
              {activities.filter(a => a.type === 'meeting').length}
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Deals</span>
            </div>
            <div className="text-2xl font-bold text-orange-600 mt-1">
              {activities.filter(a => a.type === 'deal').length}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="max-h-96 overflow-y-auto">
          {Object.keys(groupedActivities).length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedActivities).map(([date, dayActivities]) => (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  
                  <div className="space-y-3">
                    {dayActivities.map((activity) => {
                      const IconComponent = getActivityIcon(activity.type);
                      const colorClass = getActivityColor(activity.type);
                      
                      return (
                        <div key={activity.id} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                          <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {activity.title}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {activity.description}
                                </p>
                                
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="font-medium text-blue-600">
                                    {activity.account}
                                  </span>
                                  <span>•</span>
                                  <span>{formatTimestamp(activity.timestamp)}</span>
                                  
                                  {activity.duration && (
                                    <>
                                      <span>•</span>
                                      <span>{activity.duration}</span>
                                    </>
                                  )}
                                  
                                  {activity.value && (
                                    <>
                                      <span>•</span>
                                      <span className="font-medium text-green-600">{activity.value}</span>
                                    </>
                                  )}
                                  
                                  {activity.attachments && (
                                    <>
                                      <span>•</span>
                                      <span>{activity.attachments} attachments</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Avatar 
                                  name={activity.user} 
                                  size="xs"
                                />
                                <span className="text-xs text-gray-600">{activity.user}</span>
                              </div>
                            </div>
                            
                            {(activity.outcome || activity.status || activity.stage) && (
                              <div className="flex items-center gap-2 mt-2">
                                {activity.outcome && (
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    activity.outcome === 'Positive' 
                                      ? 'bg-green-100 text-green-700'
                                      : activity.outcome === 'Qualified'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {activity.outcome}
                                  </span>
                                )}
                                
                                {activity.status && (
                                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                    {activity.status}
                                  </span>
                                )}
                                
                                {activity.stage && (
                                  <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                                    {activity.stage}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {filteredActivities.length} of {activities.length} activities
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                // Export functionality
                console.log('Export activities');
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
