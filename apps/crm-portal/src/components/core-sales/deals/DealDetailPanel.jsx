"use client";

import { useState } from "react";
import { Button, Badge, Card, Tabs, Avatar, Progress } from "@xtrawrkx/ui";
import {
  Edit,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  User,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  MessageSquare,
  FileText,
  Link,
  Activity,
  TrendingUp,
  Target
} from "lucide-react";

export default function DealDetailPanel({ deal, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  const dealData = deal || {
    id: 1,
    name: "Enterprise Software License",
    company: "Tech Corp",
    value: 85000,
    stage: "Proposal",
    probability: 75,
    closeDate: "2024-12-15",
    owner: "Alex Johnson",
    status: "active",
    priority: "high",
    daysToClose: 36,
    lastActivity: "2 days ago",
    description: "Multi-year enterprise license for our core platform with implementation services",
    source: "Website",
    type: "New Business",
    expectedCloseDate: "2024-12-15",
    actualCloseDate: null,
    nextStep: "Send final proposal",
    competitor: "Salesforce",
    reason: "Better pricing and features",
    notes: "Client is very interested and has budget approved. Decision expected by end of month.",
    tags: ["enterprise", "high-value", "hot"],
    contacts: [
      { id: 1, name: "John Davis", title: "CTO", email: "john@techcorp.com", phone: "+1 (555) 123-4567", role: "Decision Maker" },
      { id: 2, name: "Sarah Martinez", title: "VP Engineering", email: "sarah@techcorp.com", phone: "+1 (555) 234-5678", role: "Influencer" }
    ],
    activities: [
      { id: 1, type: "call", title: "Product demo call", date: "2 days ago", user: "Alex Johnson", notes: "Very interested in our analytics features" },
      { id: 2, type: "email", title: "Sent proposal document", date: "1 week ago", user: "Alex Johnson", notes: "Followed up on pricing questions" },
      { id: 3, type: "meeting", title: "Technical evaluation meeting", date: "2 weeks ago", user: "Sarah Wilson", notes: "Discussed integration requirements" }
    ],
    files: [
      { id: 1, name: "proposal_techcorp.pdf", size: "2.4 MB", date: "1 week ago", type: "proposal" },
      { id: 2, name: "demo_recording.mp4", size: "45.2 MB", date: "2 weeks ago", type: "demo" },
      { id: 3, name: "contract_draft.docx", size: "1.2 MB", date: "3 weeks ago", type: "contract" }
    ],
    products: [
      { id: 1, name: "Enterprise License", quantity: 1, price: 50000, discount: 0 },
      { id: 2, name: "Implementation Services", quantity: 1, price: 25000, discount: 10 },
      { id: 3, name: "Training Package", quantity: 1, price: 10000, discount: 0 }
    ]
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'won':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'lost':
        return <X className="w-4 h-4 text-red-500" />;
      case 'active':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { variant: "destructive", text: "High" },
      medium: { variant: "warning", text: "Medium" },
      low: { variant: "success", text: "Low" }
    };

    const config = priorityConfig[priority] || { variant: "secondary", text: priority };
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.text}
      </Badge>
    );
  };

  const getStageBadge = (stage) => {
    const stageConfig = {
      "Qualification": { variant: "secondary", text: "Qualification" },
      "Needs Analysis": { variant: "default", text: "Needs Analysis" },
      "Proposal": { variant: "warning", text: "Proposal" },
      "Negotiation": { variant: "default", text: "Negotiation" },
      "Closed Won": { variant: "success", text: "Closed Won" },
      "Closed Lost": { variant: "destructive", text: "Closed Lost" }
    };

    const config = stageConfig[stage] || { variant: "secondary", text: stage };
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
    { id: "overview", label: "Overview", icon: Target },
    { id: "contacts", label: "Contacts", icon: User },
    { id: "products", label: "Products", icon: Building2 },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "files", label: "Files", icon: FileText }
  ];

  const calculateTotalValue = () => {
    return dealData.products.reduce((sum, product) => {
      const discountedPrice = product.price * (1 - product.discount / 100);
      return sum + (discountedPrice * product.quantity);
    }, 0);
  };

  const calculateDiscount = () => {
    const originalTotal = dealData.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const discountedTotal = calculateTotalValue();
    return originalTotal - discountedTotal;
  };

  return (
    <div className="h-full bg-white border-l border-brand-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-brand-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {getStatusIcon(dealData.status)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-brand-foreground">{dealData.name}</h2>
              <p className="text-sm text-brand-text-light">{dealData.company}</p>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-4 h-4 text-brand-text-light" />
                <span className="text-sm text-brand-text-light">{dealData.company}</span>
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
          {getStageBadge(dealData.stage)}
          {getPriorityBadge(dealData.priority)}
          <div className="flex items-center gap-2 text-sm text-brand-text-light">
            <User className="w-4 h-4" />
            <span>Owner: {dealData.owner}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-brand-text-light">
            <DollarSign className="w-4 h-4" />
            <span>${(dealData.value / 1000).toFixed(0)}K</span>
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
              {/* Deal Information */}
              <Card className="p-4">
                <h3 className="font-semibold text-brand-foreground mb-4">Deal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-brand-text-light">Deal Value</p>
                    <p className="font-semibold text-brand-foreground flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ${(dealData.value / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-light">Probability</p>
                    <div className="flex items-center gap-2">
                      <Progress value={dealData.probability} className="flex-1" />
                      <span className="text-sm font-semibold">{dealData.probability}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-light">Expected Close Date</p>
                    <p className="font-semibold text-brand-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {dealData.expectedCloseDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-light">Days to Close</p>
                    <p className="font-semibold text-brand-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {dealData.daysToClose} days
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-light">Source</p>
                    <p className="font-semibold text-brand-foreground">{dealData.source}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-light">Type</p>
                    <p className="font-semibold text-brand-foreground">{dealData.type}</p>
                  </div>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-4">
                <h3 className="font-semibold text-brand-foreground mb-4">Description</h3>
                <p className="text-sm text-brand-text-light">{dealData.description}</p>
              </Card>

              {/* Next Step */}
              <Card className="p-4">
                <h3 className="font-semibold text-brand-foreground mb-4">Next Step</h3>
                <p className="text-sm text-brand-text-light">{dealData.nextStep}</p>
              </Card>

              {/* Competitor Information */}
              <Card className="p-4">
                <h3 className="font-semibold text-brand-foreground mb-4">Competitor Analysis</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-brand-text-light">Competitor</p>
                    <p className="font-semibold text-brand-foreground">{dealData.competitor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-light">Our Advantage</p>
                    <p className="font-semibold text-brand-foreground">{dealData.reason}</p>
                  </div>
                </div>
              </Card>

              {/* Tags */}
              <Card className="p-4">
                <h3 className="font-semibold text-brand-foreground mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {dealData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-brand-foreground">Deal Contacts</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
              <div className="space-y-3">
                {dealData.contacts.map((contact) => (
                  <Card key={contact.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={contact.name}
                        size="md"
                        className="bg-brand-primary/10 text-brand-primary"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-brand-foreground">{contact.name}</h4>
                        <p className="text-sm text-brand-text-light">{contact.title}</p>
                        <p className="text-xs text-brand-text-light">{contact.email}</p>
                      </div>
                      <Badge variant="outline">{contact.role}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-brand-foreground">Products & Services</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
              <div className="space-y-3">
                {dealData.products.map((product) => (
                  <Card key={product.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-brand-foreground">{product.name}</h4>
                        <p className="text-sm text-brand-text-light">
                          Quantity: {product.quantity} • 
                          Price: ${(product.price / 1000).toFixed(0)}K • 
                          Discount: {product.discount}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-brand-foreground">
                          ${((product.price * product.quantity * (1 - product.discount / 100)) / 1000).toFixed(0)}K
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <Card className="p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-foreground">Total Value</span>
                  <span className="text-lg font-bold text-brand-foreground">
                    ${(calculateTotalValue() / 1000).toFixed(0)}K
                  </span>
                </div>
                {calculateDiscount() > 0 && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-brand-text-light">Discount Applied</span>
                    <span className="text-sm text-green-600">
                      -${(calculateDiscount() / 1000).toFixed(0)}K
                    </span>
                  </div>
                )}
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
                {dealData.activities.map((activity) => (
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
                {dealData.files.map((file) => (
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
