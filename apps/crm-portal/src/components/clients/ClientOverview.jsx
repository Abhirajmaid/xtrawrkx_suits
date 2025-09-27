"use client";

import { useState } from "react";
import { Card, StatCard, Badge } from "@xtrawrkx/ui";
import {
  DollarSign,
  Briefcase,
  FolderOpen,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  User,
  Building2,
  Mail,
  Phone,
  MessageSquare,
  Star,
  Target,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Receipt,
} from "lucide-react";

export default function ClientOverview({ client }) {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock data - replace with actual API calls
  const overviewData = {
    deals: {
      total: 3,
      active: 2,
      won: 1,
      lost: 0,
      totalValue: client.totalDealValue,
      avgDealSize: 41667,
      winRate: 33.3,
    },
    projects: {
      total: client.linkedProjectsCount,
      active: 1,
      completed: 1,
      totalHours: 240,
      totalCost: 18000,
    },
    documents: {
      total: 8,
      recent: 3,
      shared: 5,
      lastUpload: "2024-01-12",
    },
    invoices: {
      total: 5,
      paid: 3,
      pending: 2,
      overdue: 0,
      totalValue: 45000,
      outstanding: 15000,
    },
    activities: {
      total: 24,
      emails: 12,
      calls: 6,
      meetings: 4,
      notes: 2,
      lastActivity: client.lastActivity,
    },
    engagement: {
      score: client.engagementScore,
      trend: "up",
      change: 12,
      lastInteraction: client.lastActivity,
    },
  };

  const recentActivities = [
    {
      id: 1,
      type: "email",
      title: "Sent proposal for Q1 project",
      description: "Followed up on the enterprise solution proposal",
      timestamp: "2024-01-15T10:30:00Z",
      user: "John Smith",
    },
    {
      id: 2,
      type: "call",
      title: "Discovery call completed",
      description: "Discussed requirements and timeline",
      timestamp: "2024-01-14T14:15:00Z",
      user: "Jane Doe",
    },
    {
      id: 3,
      type: "meeting",
      title: "Product demo scheduled",
      description: "Scheduled for next Tuesday at 2 PM",
      timestamp: "2024-01-13T16:45:00Z",
      user: "Mike Johnson",
    },
    {
      id: 4,
      type: "note",
      title: "Added internal note",
      description: "Client is very interested in our premium package",
      timestamp: "2024-01-12T09:20:00Z",
      user: "John Smith",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4 text-blue-600" />;
      case "call":
        return <Phone className="w-4 h-4 text-green-600" />;
      case "meeting":
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case "note":
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
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

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Deals"
          value={overviewData.deals.active}
          subtitle={`${overviewData.deals.total} total`}
          icon={Briefcase}
          trend={overviewData.deals.winRate > 0 ? "up" : "down"}
          trendValue={`${overviewData.deals.winRate}% win rate`}
          className="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        <StatCard
          title="Deal Value"
          value={formatCurrency(overviewData.deals.totalValue)}
          subtitle={`${formatCurrency(overviewData.deals.avgDealSize)} avg`}
          icon={DollarSign}
          trend="up"
          trendValue="+15% this month"
          className="bg-gradient-to-br from-green-50 to-green-100"
        />
        <StatCard
          title="Active Projects"
          value={overviewData.projects.active}
          subtitle={`${overviewData.projects.total} total`}
          icon={FolderOpen}
          trend="up"
          trendValue={`${overviewData.projects.totalHours}h logged`}
          className="bg-gradient-to-br from-purple-50 to-purple-100"
        />
        <StatCard
          title="Outstanding Invoices"
          value={overviewData.invoices.pending}
          subtitle={formatCurrency(overviewData.invoices.outstanding)}
          icon={Receipt}
          trend="down"
          trendValue="2 pending"
          className="bg-gradient-to-br from-orange-50 to-orange-100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activities
                </h3>
                <button className="text-sm text-brand-primary hover:text-brand-primary/80 transition-colors">
                  View all
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </h4>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {activity.user}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Stats & Actions */}
        <div className="space-y-6">
          {/* Engagement Score */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Engagement Score
                </h3>
                <div className="flex items-center gap-1">
                  {overviewData.engagement.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    overviewData.engagement.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {overviewData.engagement.trend === "up" ? "+" : ""}{overviewData.engagement.change}
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {overviewData.engagement.score}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full ${
                      overviewData.engagement.score >= 80
                        ? "bg-green-500"
                        : overviewData.engagement.score >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${overviewData.engagement.score}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Last interaction: {formatRelativeTime(overviewData.engagement.lastInteraction)}
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Send Email</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Log Call</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Schedule Meeting</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Add Note</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">Upload Document</span>
                </button>
              </div>
            </div>
          </Card>

          {/* Client Insights */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Client Insights
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="text-sm font-medium text-gray-900">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Response Time</span>
                  <span className="text-sm font-medium text-gray-900">2.3 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Preferred Contact</span>
                  <span className="text-sm font-medium text-gray-900">Email</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time Zone</span>
                  <span className="text-sm font-medium text-gray-900">PST</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Company Size</span>
                  <span className="text-sm font-medium text-gray-900">500-1000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Annual Revenue</span>
                  <span className="text-sm font-medium text-gray-900">$10M-$50M</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

