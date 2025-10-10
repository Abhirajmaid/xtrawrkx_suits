"use client";

import { useState } from "react";
import { Button, Card, Badge, Modal, Input, Textarea, Select } from "../../../components/ui";
import {
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  FileText,
  Plus,
  Filter,
  Search,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";

export default function ContactTimeline({ contactId, onClose }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newActivity, setNewActivity] = useState({
    type: "call",
    title: "",
    notes: "",
    scheduledDate: "",
    duration: 30
  });

  const activities = [
    {
      id: 1,
      type: "call",
      title: "Product demo call",
      notes: "Very interested in our analytics features. Asked about integration with their existing systems.",
      date: "2024-11-09T10:30:00Z",
      user: "Alex Johnson",
      duration: 45,
      status: "completed",
      outcome: "positive"
    },
    {
      id: 2,
      type: "email",
      title: "Sent proposal document",
      notes: "Followed up on pricing questions and sent detailed proposal with custom pricing.",
      date: "2024-11-08T14:20:00Z",
      user: "Alex Johnson",
      status: "completed",
      outcome: "neutral"
    },
    {
      id: 3,
      type: "meeting",
      title: "Technical evaluation meeting",
      notes: "Discussed integration requirements with their development team. They need API documentation.",
      date: "2024-11-06T09:00:00Z",
      user: "Sarah Wilson",
      duration: 60,
      status: "completed",
      outcome: "positive"
    },
    {
      id: 4,
      type: "note",
      title: "Added note about budget",
      notes: "Budget confirmed for Q4, decision expected by end of month. Key stakeholders identified.",
      date: "2024-11-05T16:45:00Z",
      user: "Alex Johnson",
      status: "completed",
      outcome: "positive"
    },
    {
      id: 5,
      type: "call",
      title: "Follow-up call scheduled",
      notes: "Scheduled for next week to discuss implementation timeline.",
      date: "2024-11-12T11:00:00Z",
      user: "Alex Johnson",
      duration: 30,
      status: "scheduled",
      outcome: "pending"
    },
    {
      id: 6,
      type: "email",
      title: "Initial contact email",
      notes: "Reached out after they filled out the contact form on our website.",
      date: "2024-11-01T08:15:00Z",
      user: "Alex Johnson",
      status: "completed",
      outcome: "positive"
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4 text-blue-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-green-500" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'note':
        return <MessageSquare className="w-4 h-4 text-orange-500" />;
      case 'file':
        return <FileText className="w-4 h-4 text-gray-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: "success", text: "Completed" },
      scheduled: { variant: "warning", text: "Scheduled" },
      cancelled: { variant: "destructive", text: "Cancelled" },
      in_progress: { variant: "default", text: "In Progress" }
    };

    const config = statusConfig[status] || { variant: "secondary", text: status };
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.text}
      </Badge>
    );
  };

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'positive':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'neutral':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredActivities = activities.filter(activity => {
    const matchesType = filterType === "all" || activity.type === filterType;
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.notes.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleAddActivity = () => {
    // Here you would typically save the activity to your backend
    console.log("Adding activity:", newActivity);
    setShowAddModal(false);
    setNewActivity({
      type: "call",
      title: "",
      notes: "",
      scheduledDate: "",
      duration: 30
    });
  };

  const activityTypes = [
    { value: "call", label: "Call", icon: Phone },
    { value: "email", label: "Email", icon: Mail },
    { value: "meeting", label: "Meeting", icon: Calendar },
    { value: "note", label: "Note", icon: MessageSquare },
    { value: "file", label: "File", icon: FileText }
  ];

  return (
    <div className="h-full bg-white border-l border-brand-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-brand-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-brand-foreground">Activity Timeline</h2>
            <p className="text-sm text-brand-text-light">All activities and interactions with this contact</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary text-sm w-full"
            />
          </div>
          <Select
            value={filterType}
            onValueChange={setFilterType}
            className="w-40"
          >
            <option value="all">All Types</option>
            {activityTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </Select>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {filteredActivities.map((activity, index) => (
            <div key={activity.id} className="relative">
              {/* Timeline line */}
              {index < filteredActivities.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
              )}
              
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Card className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-brand-foreground">{activity.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-brand-text-light">
                            {formatDate(activity.date)} at {formatTime(activity.date)}
                          </span>
                          {activity.duration && (
                            <span className="text-sm text-brand-text-light">
                              • {activity.duration} min
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getOutcomeIcon(activity.outcome)}
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                    
                    {activity.notes && (
                      <p className="text-sm text-brand-text-light mb-3">{activity.notes}</p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-brand-text-light">
                      <User className="w-3 h-3" />
                      <span>{activity.user}</span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ))}
          
          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No activities found</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm || filterType !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Start by adding your first activity"
                }
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} size="md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-brand-foreground">Add Activity</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Activity Type
              </label>
              <Select
                value={newActivity.type}
                onValueChange={(value) => setNewActivity(prev => ({ ...prev, type: value }))}
              >
                {activityTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  );
                })}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Title *
              </label>
              <Input
                value={newActivity.title}
                onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter activity title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Notes
              </label>
              <Textarea
                value={newActivity.notes}
                onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes about this activity"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Scheduled Date
                </label>
                <Input
                  type="datetime-local"
                  value={newActivity.scheduledDate}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={newActivity.duration}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                  placeholder="30"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-brand-border mt-6">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddActivity}>
              Add Activity
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
