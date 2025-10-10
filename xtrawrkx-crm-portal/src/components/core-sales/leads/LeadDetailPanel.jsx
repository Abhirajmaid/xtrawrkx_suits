"use client";

import { useState } from "react";
import { Button, Badge, Card, Tabs } from "../../../../../../../../../components/ui";
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  FileText,
  Link,
  Star,
  Flame,
  Thermometer,
  Snowflake,
  Building2,
  User,
  DollarSign,
  Clock,
  MessageSquare,
  Paperclip,
  Activity,
  Plus
} from "lucide-react";

export default function LeadDetailPanel({ lead, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  const leadData = lead || {
    id: 1,
    name: "Tech Corp",
    contact: "John Davis",
    email: "john@techcorp.com",
    phone: "+1 (555) 123-4567",
    source: "Website",
    segment: "hot",
    value: 85000,
    status: "qualified",
    assignee: "Alex Johnson",
    company: "Tech Corp",
    lastActivity: "2 hours ago",
    score: 95,
    createdAt: "2024-11-09",
    nextFollowUp: "2024-11-11",
    description: "Enterprise software solution for data management and analytics. High priority lead with strong budget approval.",
    industry: "Technology",
    employees: "500-1000",
    location: "San Francisco, CA",
    website: "https://techcorp.com",
    linkedDeals: [
      { id: 1, name: "Enterprise Software License", value: 85000, stage: "Proposal", probability: 75 },
      { id: 2, name: "Implementation Services", value: 25000, stage: "Qualification", probability: 60 }
    ],
    activities: [
      { id: 1, type: "call", title: "Initial discovery call", date: "2 hours ago", user: "Alex Johnson" },
      { id: 2, type: "email", title: "Sent proposal document", date: "1 day ago", user: "Alex Johnson" },
      { id: 3, type: "meeting", title: "Product demo scheduled", date: "2 days ago", user: "Sarah Wilson" }
    ],
    notes: [
      { id: 1, content: "Very interested in our analytics features. Budget confirmed for Q4.", user: "Alex Johnson", date: "2 hours ago" },
      { id: 2, content: "Decision maker is John Davis, CTO. Technical evaluation in progress.", user: "Sarah Wilson", date: "1 day ago" }
    ],
    files: [
      { id: 1, name: "proposal_techcorp.pdf", size: "2.4 MB", date: "1 day ago" },
      { id: 2, name: "demo_recording.mp4", size: "45.2 MB", date: "2 days ago" }
    ]
  };

  const getSegmentIcon = (segment) => {
    switch (segment) {
      case 'hot':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'warm':
        return <Thermometer className="w-4 h-4 text-orange-500" />;
      case 'cold':
        return <Snowflake className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { variant: "secondary", text: "New" },
      contacted: { variant: "default", text: "Contacted" },
      qualified: { variant: "success", text: "Qualified" },
      proposal: { variant: "warning", text: "Proposal" },
      negotiation: { variant: "default", text: "Negotiation" },
      won: { variant: "success", text: "Won" },
      lost: { variant: "destructive", text: "Lost" }
    };

    const config = statusConfig[status] || { variant: "secondary", text: status };
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.text}
      </Badge>
    );
  };

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
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "notes", label: "Notes", icon: MessageSquare },
    { id: "files", label: "Files", icon: Paperclip },
    { id: "deals", label: "Linked Deals", icon: Link }
  ];

  return (
    <div className="h-full bg-white border-l border-brand-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-brand-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold text-brand-foreground">{leadData.name}</h2>
              <p className="text-sm text-brand-text-light">{leadData.contact}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {getSegmentIcon(leadData.segment)}
            <span className="text-sm font-medium capitalize">{leadData.segment}</span>
          </div>
          {getStatusBadge(leadData.status)}
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{leadData.score}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <Button size="sm" className="flex-1">
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Calendar className="w-4 h-4 mr-2" />
            Meeting
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <div className="px-6 pt-4">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="border-b border-brand-border"
          />
        </div>

        <div className="p-6 overflow-y-auto h-full">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="p-4">
                <h3 className="font-semibold text-brand-foreground mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-brand-text-light" />
                    <span className="text-sm">{leadData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-brand-text-light" />
                    <span className="text-sm">{leadData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-brand-text-light" />
                    <span className="text-sm">{leadData.company}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-brand-text-light" />
                    <span className="text-sm">Assigned to {leadData.assignee}</span>
                  </div>
                </div>
              </Card>

              {/* Lead Details */}
              <Card className="p-4">
                <h3 className="font-semibold text-brand-foreground mb-4">Lead Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-brand-text-light">Source</p>
                    <p className="font-medium">{leadData.source}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-light">Industry</p>
                    <p className="font-medium">{leadData.industry}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-light">Company Size</p>
                    <p className="font-medium">{leadData.employees}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-light">Location</p>
                    <p className="font-medium">{leadData.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-light">Est. Value</p>
                    <p className="font-medium flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ${(leadData.value / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-light">Next Follow-up</p>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {leadData.nextFollowUp}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-4">
                <h3 className="font-semibold text-brand-foreground mb-4">Description</h3>
                <p className="text-sm text-brand-text-light">{leadData.description}</p>
              </Card>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-brand-foreground">Activity Timeline</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Activity
                </Button>
              </div>
              <div className="space-y-3">
                {leadData.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-brand-text-light">
                        {activity.user} • {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-brand-foreground">Notes</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>
              <div className="space-y-3">
                {leadData.notes.map((note) => (
                  <Card key={note.id} className="p-4">
                    <p className="text-sm mb-2">{note.content}</p>
                    <p className="text-xs text-brand-text-light">
                      {note.user} • {note.date}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "files" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-brand-foreground">Files</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </div>
              <div className="space-y-2">
                {leadData.files.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-brand-text-light" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-brand-text-light">{file.size} • {file.date}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "deals" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-brand-foreground">Linked Deals</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Link Deal
                </Button>
              </div>
              <div className="space-y-3">
                {leadData.linkedDeals.map((deal) => (
                  <Card key={deal.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{deal.name}</p>
                        <p className="text-xs text-brand-text-light">
                          ${(deal.value / 1000).toFixed(0)}K • {deal.stage} • {deal.probability}% probability
                        </p>
                      </div>
                      <Badge variant="outline">{deal.stage}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
