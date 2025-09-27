"use client";

import { useState } from "react";
import { Button, Badge, Card, Tabs, Avatar } from "@xtrawrkx/ui";
import {
  Edit,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Globe,
  Building2,
  User,
  DollarSign,
  Star,
  MessageSquare,
  FileText,
  Link,
  Activity,
  Plus,
  ExternalLink,
  Copy
} from "lucide-react";

export default function ContactProfile({ contact, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  const contactData = contact || {
    id: 1,
    firstName: "John",
    lastName: "Davis",
    email: "john@techcorp.com",
    phone: "+1 (555) 123-4567",
    title: "CTO",
    company: "Tech Corp",
    industry: "Technology",
    location: "San Francisco, CA",
    website: "https://techcorp.com",
    status: "active",
    assignee: "Alex Johnson",
    lastActivity: "2 hours ago",
    tags: ["decision-maker", "enterprise", "hot"],
    createdAt: "2024-10-15",
    source: "Website",
    dealCount: 2,
    totalValue: 120000,
    description: "Chief Technology Officer at Tech Corp with 15+ years of experience in enterprise software solutions. Key decision maker for technology purchases.",
    socialProfiles: {
      linkedin: "https://linkedin.com/in/johndavis",
      twitter: "@johndavis_cto"
    },
    companyInfo: {
      name: "Tech Corp",
      industry: "Technology",
      size: "500-1000 employees",
      revenue: "$50M - $100M",
      founded: "2010",
      headquarters: "San Francisco, CA",
      website: "https://techcorp.com"
    },
    linkedDeals: [
      { id: 1, name: "Enterprise Software License", value: 85000, stage: "Proposal", probability: 75, closeDate: "2024-12-15" },
      { id: 2, name: "Implementation Services", value: 35000, stage: "Qualification", probability: 60, closeDate: "2024-12-30" }
    ],
    activities: [
      { id: 1, type: "call", title: "Product demo call", date: "2 hours ago", user: "Alex Johnson", notes: "Very interested in our analytics features" },
      { id: 2, type: "email", title: "Sent proposal document", date: "1 day ago", user: "Alex Johnson", notes: "Followed up on pricing questions" },
      { id: 3, type: "meeting", title: "Technical evaluation meeting", date: "3 days ago", user: "Sarah Wilson", notes: "Discussed integration requirements" },
      { id: 4, type: "note", title: "Added note about budget", date: "1 week ago", user: "Alex Johnson", notes: "Budget confirmed for Q4, decision expected by end of month" }
    ],
    notes: [
      { id: 1, content: "Very interested in our analytics features. Budget confirmed for Q4.", user: "Alex Johnson", date: "2 hours ago" },
      { id: 2, content: "Decision maker is John Davis, CTO. Technical evaluation in progress.", user: "Sarah Wilson", date: "1 day ago" },
      { id: 3, content: "Company is growing rapidly, looking for scalable solutions.", user: "Alex Johnson", date: "1 week ago" }
    ],
    files: [
      { id: 1, name: "proposal_techcorp.pdf", size: "2.4 MB", date: "1 day ago", type: "proposal" },
      { id: 2, name: "demo_recording.mp4", size: "45.2 MB", date: "3 days ago", type: "demo" },
      { id: 3, name: "contract_draft.docx", size: "1.2 MB", date: "1 week ago", type: "contract" }
    ]
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

  const getFileIcon = (type) => {
    switch (type) {
      case 'proposal':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'demo':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'contract':
        return <FileText className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "deals", label: "Deals", icon: DollarSign },
    { id: "notes", label: "Notes", icon: MessageSquare },
    { id: "files", label: "Files", icon: FileText }
  ];

  return (
    <div className="h-full bg-white border-l border-brand-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-brand-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar
              name={`${contactData.firstName} ${contactData.lastName}`}
              size="lg"
              className="bg-brand-primary/10 text-brand-primary"
            />
            <div>
              <h2 className="text-xl font-semibold text-brand-foreground">
                {contactData.firstName} {contactData.lastName}
              </h2>
              <p className="text-sm text-brand-text-light">{contactData.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-4 h-4 text-brand-text-light" />
                <span className="text-sm text-brand-text-light">{contactData.company}</span>
                {contactData.tags.includes('hot') && (
                  <Star className="w-4 h-4 text-yellow-500" />
                )}
              </div>
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
          <Badge variant="success">Active</Badge>
          <div className="flex items-center gap-2 text-sm text-brand-text-light">
            <User className="w-4 h-4" />
            <span>Assigned to {contactData.assignee}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-brand-text-light">
            <DollarSign className="w-4 h-4" />
            <span>${(contactData.totalValue / 1000).toFixed(0)}K in deals</span>
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
          <Button size="sm" variant="outline" className="flex-1">
            <MessageSquare className="w-4 h-4 mr-2" />
            Note
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
                    <span className="text-sm">{contactData.email}</span>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-brand-text-light" />
                    <span className="text-sm">{contactData.phone}</span>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-brand-text-light" />
                    <span className="text-sm">{contactData.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-brand-text-light" />
                    <a href={contactData.website} className="text-sm text-brand-primary hover:underline">
                      {contactData.website}
                    </a>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Company Information */}
              <Card className="p-4">
                <h3 className="font-semibold text-brand-foreground mb-4">Company Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-brand-text-light">Industry</p>
                    <p className="font-medium">{contactData.companyInfo.industry}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-light">Company Size</p>
                    <p className="font-medium">{contactData.companyInfo.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-light">Revenue</p>
                    <p className="font-medium">{contactData.companyInfo.revenue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-light">Founded</p>
                    <p className="font-medium">{contactData.companyInfo.founded}</p>
                  </div>
                </div>
              </Card>

              {/* Social Profiles */}
              <Card className="p-4">
                <h3 className="font-semibold text-brand-foreground mb-4">Social Profiles</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">LinkedIn:</span>
                    <a href={contactData.socialProfiles.linkedin} className="text-sm text-brand-primary hover:underline">
                      {contactData.socialProfiles.linkedin}
                    </a>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Twitter:</span>
                    <span className="text-sm text-brand-text-light">{contactData.socialProfiles.twitter}</span>
                  </div>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-4">
                <h3 className="font-semibold text-brand-foreground mb-4">Description</h3>
                <p className="text-sm text-brand-text-light">{contactData.description}</p>
              </Card>

              {/* Tags */}
              <Card className="p-4">
                <h3 className="font-semibold text-brand-foreground mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {contactData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
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
                {contactData.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-brand-text-light mb-1">
                        {activity.user} • {activity.date}
                      </p>
                      {activity.notes && (
                        <p className="text-xs text-brand-text-light">{activity.notes}</p>
                      )}
                    </div>
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
                {contactData.linkedDeals.map((deal) => (
                  <Card key={deal.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{deal.name}</p>
                        <p className="text-xs text-brand-text-light">
                          ${(deal.value / 1000).toFixed(0)}K • {deal.stage} • {deal.probability}% probability
                        </p>
                        <p className="text-xs text-brand-text-light">
                          Expected close: {deal.closeDate}
                        </p>
                      </div>
                      <Badge variant="outline">{deal.stage}</Badge>
                    </div>
                  </Card>
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
                {contactData.notes.map((note) => (
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
                {contactData.files.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {getFileIcon(file.type)}
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
        </div>
      </div>
    </div>
  );
}
