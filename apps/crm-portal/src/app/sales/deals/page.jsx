"use client";

import { useState } from "react";
import {
  Container,
  PageHeader,
  Card,
  Badge,
  Avatar,
  StatCard,
  AreaChart,
  EmptyState,
} from "@xtrawrkx/ui";
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Clock,
  Target,
  MoreVertical,
  Calendar,
  User,
  Building2,
  ChevronRight,
} from "lucide-react";

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const pipelineStages = [
    {
      id: "discovery",
      name: "Discovery",
      value: 450000,
      count: 12,
      color: "bg-blue-500",
      deals: [
        {
          id: 1,
          title: "Enterprise Software License",
          company: "Tech Corp",
          value: 125000,
          probability: 20,
          assignee: "John Smith",
          daysInStage: 3,
          nextAction: "Schedule demo",
          priority: "high",
        },
        {
          id: 2,
          title: "Cloud Migration Project",
          company: "Global Industries",
          value: 85000,
          probability: 30,
          assignee: "Emily Davis",
          daysInStage: 5,
          nextAction: "Send proposal",
          priority: "medium",
        },
        {
          id: 3,
          title: "Annual Maintenance Contract",
          company: "StartUp Hub",
          value: 45000,
          probability: 25,
          assignee: "Sarah Wilson",
          daysInStage: 2,
          nextAction: "Follow up call",
          priority: "low",
        },
      ],
    },
    {
      id: "proposal",
      name: "Proposal",
      value: 680000,
      count: 8,
      color: "bg-yellow-500",
      deals: [
        {
          id: 4,
          title: "Marketing Automation Platform",
          company: "Marketing Pro",
          value: 95000,
          probability: 50,
          assignee: "John Smith",
          daysInStage: 7,
          nextAction: "Review proposal",
          priority: "high",
        },
        {
          id: 5,
          title: "Data Analytics Solution",
          company: "Data Insights Inc",
          value: 150000,
          probability: 60,
          assignee: "Emily Davis",
          daysInStage: 4,
          nextAction: "Contract negotiation",
          priority: "high",
        },
      ],
    },
    {
      id: "negotiation",
      name: "Negotiation",
      value: 320000,
      count: 5,
      color: "bg-purple-500",
      deals: [
        {
          id: 6,
          title: "CRM Implementation",
          company: "Sales Force Plus",
          value: 200000,
          probability: 75,
          assignee: "John Smith",
          daysInStage: 10,
          nextAction: "Final pricing",
          priority: "high",
        },
        {
          id: 7,
          title: "Security Audit Services",
          company: "SecureNet",
          value: 120000,
          probability: 80,
          assignee: "Sarah Wilson",
          daysInStage: 3,
          nextAction: "Legal review",
          priority: "medium",
        },
      ],
    },
    {
      id: "closed-won",
      name: "Closed Won",
      value: 540000,
      count: 15,
      color: "bg-green-500",
      deals: [
        {
          id: 8,
          title: "ERP System Upgrade",
          company: "Manufacturing Co",
          value: 180000,
          probability: 100,
          assignee: "Emily Davis",
          daysInStage: 0,
          closedDate: "2024-11-28",
          priority: "completed",
        },
        {
          id: 9,
          title: "Consulting Services",
          company: "Business Solutions",
          value: 75000,
          probability: 100,
          assignee: "John Smith",
          daysInStage: 0,
          closedDate: "2024-11-27",
          priority: "completed",
        },
      ],
    },
    {
      id: "closed-lost",
      name: "Closed Lost",
      value: 120000,
      count: 4,
      color: "bg-red-500",
      deals: [
        {
          id: 10,
          title: "Website Redesign",
          company: "Digital Agency",
          value: 35000,
          probability: 0,
          assignee: "Sarah Wilson",
          daysInStage: 0,
          lostReason: "Budget constraints",
          priority: "lost",
        },
      ],
    },
  ];

  const chartData = [
    { name: "Jan", value: 320000 },
    { name: "Feb", value: 450000 },
    { name: "Mar", value: 380000 },
    { name: "Apr", value: 520000 },
    { name: "May", value: 680000 },
    { name: "Jun", value: 750000 },
    { name: "Jul", value: 620000 },
    { name: "Aug", value: 890000 },
    { name: "Sep", value: 920000 },
    { name: "Oct", value: 1100000 },
    { name: "Nov", value: 980000 },
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: "danger",
      medium: "warning",
      low: "info",
      completed: "success",
      lost: "default",
    };
    return colors[priority] || "default";
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search deals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <Filter className="w-4 h-4" />
        Filter
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
        <Plus className="w-4 h-4" />
        New Deal
      </button>
    </div>
  );

  const totalPipelineValue = pipelineStages.reduce(
    (sum, stage) => sum + stage.value,
    0
  );
  const openDealsCount = pipelineStages
    .slice(0, 3)
    .reduce((sum, stage) => sum + stage.count, 0);
  const avgDealSize = Math.round(totalPipelineValue / (openDealsCount || 1));

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Deals Pipeline"
        subtitle="Manage your sales opportunities"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Sales" },
          { label: "Deals" },
        ]}
        actions={headerActions}
      />

      <Container className="py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Pipeline Value"
            value={`$${(totalPipelineValue / 1000000).toFixed(2)}M`}
            change="+12%"
            changeType="increase"
            icon={DollarSign}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="Open Deals"
            value={openDealsCount}
            subtitle="opportunities"
            change="+5"
            changeType="increase"
            icon={Target}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Average Deal Size"
            value={`$${(avgDealSize / 1000).toFixed(0)}K`}
            change="+8%"
            changeType="increase"
            icon={TrendingUp}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            title="Win Rate"
            value="68%"
            subtitle="this month"
            change="+3%"
            changeType="increase"
            icon={Clock}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
          />
        </div>

        {/* Revenue Trend */}
        <Card title="Revenue Trend" className="mb-6">
          <AreaChart
            data={chartData}
            dataKey="value"
            height={200}
            color="#FDE047"
          />
        </Card>

        {/* Pipeline Board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {pipelineStages.map((stage) => (
              <div key={stage.id} className="w-80 flex-shrink-0">
                <div className="bg-white rounded-lg border border-gray-200">
                  {/* Stage Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {stage.name}
                      </h3>
                      <Badge variant="default">{stage.count}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${stage.color}`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        ${(stage.value / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>

                  {/* Deals */}
                  <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                    {stage.deals.length > 0 ? (
                      stage.deals.map((deal) => (
                        <Card
                          key={deal.id}
                          className="p-3 cursor-pointer"
                          hoverable
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge
                              variant={getPriorityColor(deal.priority)}
                              size="sm"
                            >
                              {deal.priority}
                            </Badge>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreVertical className="w-3 h-3" />
                            </button>
                          </div>

                          <h4 className="font-medium text-gray-900 text-sm mb-1">
                            {deal.title}
                          </h4>

                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <Building2 className="w-3 h-3" />
                            {deal.company}
                          </div>

                          <div className="text-lg font-semibold text-gray-900 mb-2">
                            ${(deal.value / 1000).toFixed(0)}K
                          </div>

                          {deal.probability !== undefined && (
                            <div className="mb-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-500">
                                  Probability
                                </span>
                                <span className="font-medium">
                                  {deal.probability}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-blue-600 h-1.5 rounded-full"
                                  style={{ width: `${deal.probability}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-gray-500">
                              <User className="w-3 h-3" />
                              {deal.assignee}
                            </div>
                            {deal.daysInStage > 0 && (
                              <div className="flex items-center gap-1 text-gray-500">
                                <Clock className="w-3 h-3" />
                                {deal.daysInStage}d
                              </div>
                            )}
                          </div>

                          {deal.nextAction && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="flex items-center gap-1 text-xs text-blue-600">
                                <ChevronRight className="w-3 h-3" />
                                {deal.nextAction}
                              </div>
                            </div>
                          )}

                          {deal.closedDate && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                Closed: {deal.closedDate}
                              </div>
                            </div>
                          )}

                          {deal.lostReason && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="text-xs text-red-600">
                                Reason: {deal.lostReason}
                              </div>
                            </div>
                          )}
                        </Card>
                      ))
                    ) : (
                      <EmptyState
                        title="No deals"
                        description="Drag deals here or create new ones"
                      />
                    )}
                  </div>

                  {/* Add Deal Button */}
                  <div className="p-4 border-t border-gray-200">
                    <button className="w-full py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Deal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
