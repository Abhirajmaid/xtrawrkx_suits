"use client";

import { useState } from "react";
import { Card, Button, Badge, Input } from "../../../../../../../../components/ui";
import {
  Search,
  Filter,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import IntegrationItemCard from "./IntegrationItemCard";

export default function IntegrationsHub({ integrations = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "productivity", label: "Productivity" },
    { value: "communication", label: "Communication" },
    { value: "marketing", label: "Marketing" },
    { value: "analytics", label: "Analytics" },
    { value: "storage", label: "Storage" },
  ];

  const statusFilters = [
    { value: "all", label: "All Status" },
    { value: "connected", label: "Connected" },
    { value: "disconnected", label: "Disconnected" },
    { value: "pending", label: "Pending" },
  ];

  const allIntegrations = [
    {
      id: "gdrive",
      name: "Google Drive",
      description: "Sync files and documents with Google Drive",
      category: "storage",
      status: "connected",
      icon: "📁",
      color: "bg-blue-500",
      lastSync: "2025-01-20 10:30",
      features: ["File Sync", "Document Sharing", "Version Control"],
      setupRequired: false,
    },
    {
      id: "gcal",
      name: "Google Calendar",
      description: "Schedule meetings and sync calendar events",
      category: "productivity",
      status: "connected",
      icon: "📅",
      color: "bg-green-500",
      lastSync: "2025-01-20 09:15",
      features: ["Event Sync", "Meeting Scheduling", "Availability"],
      setupRequired: false,
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Email marketing campaigns and automation",
      category: "marketing",
      status: "disconnected",
      icon: "📧",
      color: "bg-orange-500",
      lastSync: null,
      features: ["Email Campaigns", "Automation", "Analytics"],
      setupRequired: true,
    },
    {
      id: "slack",
      name: "Slack",
      description: "Team communication and notifications",
      category: "communication",
      status: "connected",
      icon: "💬",
      color: "bg-purple-500",
      lastSync: "2025-01-20 11:00",
      features: ["Notifications", "Team Chat", "File Sharing"],
      setupRequired: false,
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Automate workflows between apps",
      category: "productivity",
      status: "pending",
      icon: "⚡",
      color: "bg-yellow-500",
      lastSync: null,
      features: ["Workflow Automation", "Triggers", "Actions"],
      setupRequired: true,
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Marketing automation and lead management",
      category: "marketing",
      status: "disconnected",
      icon: "🎯",
      color: "bg-indigo-500",
      lastSync: null,
      features: ["Lead Management", "Email Marketing", "Analytics"],
      setupRequired: true,
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "CRM integration and data sync",
      category: "productivity",
      status: "disconnected",
      icon: "☁️",
      color: "bg-blue-600",
      lastSync: null,
      features: ["Data Sync", "Lead Import", "Contact Management"],
      setupRequired: true,
    },
    {
      id: "analytics",
      name: "Google Analytics",
      description: "Website and campaign analytics",
      category: "analytics",
      status: "disconnected",
      icon: "📊",
      color: "bg-green-600",
      lastSync: null,
      features: ["Website Analytics", "Campaign Tracking", "Reports"],
      setupRequired: true,
    },
  ];

  const filteredIntegrations = allIntegrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || integration.status === filterStatus;
    const matchesCategory = filterCategory === "all" || integration.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "disconnected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "disconnected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const connectedCount = allIntegrations.filter(i => i.status === "connected").length;
  const totalCount = allIntegrations.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Integrations Hub</h3>
          <p className="text-gray-600 mt-1">
            Connect your favorite tools to streamline your workflow
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Connected</p>
              <p className="text-2xl font-bold text-gray-900">{connectedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Disconnected</p>
              <p className="text-2xl font-bold text-gray-900">
                {allIntegrations.filter(i => i.status === "disconnected").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {allIntegrations.filter(i => i.status === "pending").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${integration.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {integration.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                  <Badge
                    variant="default"
                    size="sm"
                    className={getStatusColor(integration.status)}
                  >
                    {integration.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon(integration.status)}
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {integration.description}
            </p>

            <div className="space-y-2 mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Features
              </p>
              <div className="flex flex-wrap gap-1">
                {integration.features.map((feature) => (
                  <Badge key={feature} variant="outline" size="sm">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {integration.lastSync && (
              <div className="text-xs text-gray-500 mb-4">
                Last sync: {integration.lastSync}
              </div>
            )}

            <div className="flex items-center gap-2">
              {integration.status === "connected" ? (
                <>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button size="sm" className="flex-1">
                  {integration.setupRequired ? "Setup Required" : "Connect"}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <Card className="p-8 text-center">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Integrations Found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Browse All Integrations
          </Button>
        </Card>
      )}

      {/* Integration Item Card Component */}
      <IntegrationItemCard />
    </div>
  );
}

