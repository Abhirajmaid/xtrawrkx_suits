"use client";

import { useState } from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle,
  FileText,
  ChevronRight,
  Share,
  Download,
  Bell,
  Settings,
  User,
  Search,
  Plus,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { StatCard, Card, Badge, LineChart, AreaChart } from "@xtrawrkx/ui";
import Button from "../components/Button";

export default function Home() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const stats = [
    {
      title: "Total Leads",
      value: "73",
      change: "+12%",
      changeType: "increase",
      icon: Users,
    },
    {
      title: "Pipeline Value",
      value: "$485K",
      change: "+18%",
      changeType: "increase",
      icon: DollarSign,
    },
    {
      title: "Conversion Rate",
      value: "42%",
      change: "+5%",
      changeType: "increase",
      icon: TrendingUp,
    },
    {
      title: "Active Deals",
      value: "16",
      change: "-2",
      changeType: "decrease",
      icon: Target,
    },
  ];

  const recentLeads = [
    {
      id: 1,
      name: "John Smith",
      company: "Tech Corp",
      status: "New",
      value: "$25K",
      assignedTo: "Sarah Johnson",
    },
    {
      id: 2,
      name: "Emily Davis",
      company: "Design Studio",
      status: "Qualified",
      value: "$45K",
      assignedTo: "Mike Wilson",
    },
    {
      id: 3,
      name: "Robert Brown",
      company: "Marketing Inc",
      status: "Proposal",
      value: "$75K",
      assignedTo: "Lisa Chen",
    },
    {
      id: 4,
      name: "Jennifer Lee",
      company: "Startup XYZ",
      status: "Negotiation",
      value: "$120K",
      assignedTo: "David Kim",
    },
  ];

  // Weekly leads data for line chart
  const weeklyLeadsData = [
    { name: "Week 1", leads: 8, qualified: 3 },
    { name: "Week 2", leads: 12, qualified: 5 },
    { name: "Week 3", leads: 6, qualified: 2 },
    { name: "Week 4", leads: 15, qualified: 7 },
    { name: "Week 5", leads: 10, qualified: 4 },
    { name: "Week 6", leads: 18, qualified: 8 },
    { name: "This Week", leads: 4, qualified: 2 },
  ];

  // Background chart data for KPI cards
  const totalLeadsChartData = [
    { name: "Jul", value: 8 },
    { name: "Aug", value: 12 },
    { name: "Sep", value: 6 },
    { name: "Oct", value: 15 },
    { name: "Nov", value: 18 },
    { name: "Dec", value: 4 },
  ];

  const qualifiedChartData = [
    { name: "Jul", value: 3 },
    { name: "Aug", value: 5 },
    { name: "Sep", value: 2 },
    { name: "Oct", value: 7 },
    { name: "Nov", value: 8 },
    { name: "Dec", value: 2 },
  ];

  const conversionChartData = [
    { name: "Jul", value: 37 },
    { name: "Aug", value: 42 },
    { name: "Sep", value: 33 },
    { name: "Oct", value: 47 },
    { name: "Nov", value: 44 },
    { name: "Dec", value: 50 },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Follow up with Tech Corp lead",
      dueDate: "Today",
      priority: "High",
      status: "Pending",
    },
    {
      id: 2,
      title: "Prepare proposal for Design Studio",
      dueDate: "Tomorrow",
      priority: "Medium",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Review contract with Marketing Inc",
      dueDate: "Dec 15",
      priority: "High",
      status: "Pending",
    },
    {
      id: 4,
      title: "Schedule demo for Startup XYZ",
      dueDate: "Dec 16",
      priority: "Low",
      status: "Pending",
    },
  ];

  // Pipeline clients data
  const pipelineClients = {
    leads: [
      {
        id: 1,
        name: "John Smith",
        company: "Tech Corp",
        initials: "JS",
        status: "Initial contact made",
        value: "$25K",
        lastActivity: "2 days ago",
      },
      {
        id: 2,
        name: "Maria Kim",
        company: "StartupXYZ",
        initials: "MK",
        status: "Lead qualification pending",
        value: "$15K",
        lastActivity: "1 week ago",
      },
      {
        id: 3,
        name: "Robert Lee",
        company: "Global Systems",
        initials: "RL",
        status: "Cold outreach response",
        value: "$35K",
        lastActivity: "3 days ago",
      },
    ],
    qualified: [
      {
        id: 4,
        name: "Emily Davis",
        company: "Design Studio",
        initials: "ED",
        status: "Needs assessment completed",
        value: "$45K",
        lastActivity: "5 days ago",
      },
      {
        id: 5,
        name: "Alex Brown",
        company: "Marketing Inc",
        initials: "AB",
        status: "Budget confirmed",
        value: "$60K",
        lastActivity: "1 week ago",
      },
    ],
    proposal: [
      {
        id: 6,
        name: "Jennifer Lee",
        company: "Startup XYZ",
        initials: "JL",
        status: "Proposal under review",
        value: "$120K",
        lastActivity: "3 days ago",
      },
      {
        id: 7,
        name: "Mike Wilson",
        company: "Enterprise Corp",
        initials: "MW",
        status: "Custom solution proposed",
        value: "$85K",
        lastActivity: "1 week ago",
      },
      {
        id: 8,
        name: "Sarah Johnson",
        company: "Tech Solutions",
        initials: "SJ",
        status: "Awaiting stakeholder approval",
        value: "$95K",
        lastActivity: "4 days ago",
      },
    ],
    negotiation: [
      {
        id: 9,
        name: "David Kim",
        company: "Global Tech",
        initials: "DK",
        status: "Contract terms discussion",
        value: "$150K",
        lastActivity: "2 days ago",
      },
      {
        id: 10,
        name: "Lisa Chen",
        company: "Innovation Labs",
        initials: "LC",
        status: "Final pricing review",
        value: "$200K",
        lastActivity: "1 day ago",
      },
    ],
  };

  // Pipeline stage configuration
  const pipelineStages = [
    {
      id: "leads",
      title: "Leads",
      icon: Users,
      colorClass: "orange",
      clients: pipelineClients.leads,
    },
    {
      id: "qualified",
      title: "Qualified",
      icon: Target,
      colorClass: "amber",
      clients: pipelineClients.qualified,
    },
    {
      id: "proposal",
      title: "Proposal",
      icon: FileText,
      colorClass: "purple",
      clients: pipelineClients.proposal,
    },
    {
      id: "negotiation",
      title: "Negotiation",
      icon: CheckCircle,
      colorClass: "green",
      clients: pipelineClients.negotiation,
    },
  ];

  // Get color classes for each stage
  const getStageColors = (colorClass) => {
    const colors = {
      orange: {
        bg: "from-orange-50/80 to-orange-100/60",
        border: "border-orange-200/50",
        headerBorder: "border-orange-200/50",
        iconBg: "bg-orange-400/20",
        iconBorder: "border-orange-300/40",
        iconColor: "text-orange-600",
        titleColor: "text-orange-800",
        countColor: "text-orange-600",
        cardBorder: "border-orange-200/30",
        avatarBg: "from-orange-400 to-orange-600",
        valueColor: "text-orange-700",
      },
      amber: {
        bg: "from-amber-50/80 to-amber-100/60",
        border: "border-amber-200/50",
        headerBorder: "border-amber-200/50",
        iconBg: "bg-amber-400/20",
        iconBorder: "border-amber-300/40",
        iconColor: "text-amber-600",
        titleColor: "text-amber-800",
        countColor: "text-amber-600",
        cardBorder: "border-amber-200/30",
        avatarBg: "from-amber-400 to-amber-600",
        valueColor: "text-amber-700",
      },
      purple: {
        bg: "from-purple-50/80 to-purple-100/60",
        border: "border-purple-200/50",
        headerBorder: "border-purple-200/50",
        iconBg: "bg-purple-400/20",
        iconBorder: "border-purple-300/40",
        iconColor: "text-purple-600",
        titleColor: "text-purple-800",
        countColor: "text-purple-600",
        cardBorder: "border-purple-200/30",
        avatarBg: "from-purple-400 to-purple-600",
        valueColor: "text-purple-700",
      },
      green: {
        bg: "from-green-50/80 to-green-100/60",
        border: "border-green-200/50",
        headerBorder: "border-green-200/50",
        iconBg: "bg-green-400/20",
        iconBorder: "border-green-300/40",
        iconColor: "text-green-600",
        titleColor: "text-green-800",
        countColor: "text-green-600",
        cardBorder: "border-green-200/30",
        avatarBg: "from-green-400 to-green-600",
        valueColor: "text-green-700",
      },
    };
    return colors[colorClass];
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <Card glass={true} className="relative z-50">
        <div className="flex items-center justify-between">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-brand-text-light mb-2">
              <span>Home</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-brand-foreground font-medium">
                Dashboard
              </span>
            </div>

            {/* Title and Date */}
            <h1 className="text-5xl font-light text-brand-foreground mb-1 tracking-tight">
              Good Morning, Homies
            </h1>
            <p className="text-brand-text-light">
              It's Wednesday, 11 November 2024
            </p>
          </div>

          {/* Right side enhanced UI */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-light" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-64 pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary focus:bg-white/15 transition-all duration-300 placeholder:text-brand-text-light shadow-lg"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Add New */}
              <button className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-brand-primary rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 group shadow-lg">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>

              {/* Calendar */}
              <button className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg">
                <Calendar className="w-5 h-5 text-brand-text-light" />
              </button>

              {/* Notifications */}
              <button className="relative p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg">
                <Bell className="w-5 h-5 text-brand-text-light" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </button>

              {/* Settings */}
              <button className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg">
                <Settings className="w-5 h-5 text-brand-text-light" />
              </button>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-brand-border"></div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 hover:backdrop-blur-md transition-all duration-300"
                  onMouseEnter={() => setShowProfileDropdown(true)}
                  onMouseLeave={() => setShowProfileDropdown(false)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-semibold text-brand-foreground">
                        Alex Johnson
                      </p>
                      <p className="text-xs text-brand-text-light">
                        Sales Manager
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-text-light transition-transform ${showProfileDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <>
                    {/* Backdrop to close dropdown when clicking outside */}
                    <div
                      className="fixed inset-0 z-[99998]"
                      onClick={() => setShowProfileDropdown(false)}
                    />
                    <div
                      className="fixed right-6 top-20 w-72 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 z-[99999]"
                      onMouseEnter={() => setShowProfileDropdown(true)}
                      onMouseLeave={() => setShowProfileDropdown(false)}
                      style={{ zIndex: 99999 }}
                    >
                      <div className="p-4 border-b border-white/20">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center shadow-lg">
                            <User className="w-6 h-6 text-brand-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-brand-foreground">
                              Alex Johnson
                            </p>
                            <p className="text-sm text-brand-text-light">
                              alex.johnson@company.com
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-brand-hover rounded-lg transition-colors">
                          <User className="w-4 h-4 text-brand-text-light" />
                          <span className="text-sm text-brand-foreground">
                            View Profile
                          </span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-brand-hover rounded-lg transition-colors">
                          <Settings className="w-4 h-4 text-brand-text-light" />
                          <span className="text-sm text-brand-foreground">
                            Settings
                          </span>
                        </button>
                        <div className="h-px bg-brand-border my-2 mx-3"></div>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600">
                          <Share className="w-4 h-4" />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Leads Generation Trends */}
        <Card
          glass={true}
          title="Weekly Leads Generation"
          actions={
            <Button
              text="View All"
              type="ghost"
              size="sm"
              className="bg-white/20 backdrop-blur-md border border-white/30 text-brand-foreground rounded-xl hover:bg-white/30 hover:border-white/40 shadow-lg"
              hideArrow={true}
            />
          }
        >
          <div className="space-y-6">
            {/* Chart Section */}
            <div className="h-72 bg-white/15 rounded-xl p-4 backdrop-blur-sm">
              <LineChart
                data={weeklyLeadsData}
                height={280}
                lines={[
                  {
                    dataKey: "leads",
                    color: "#FDE047",
                    name: "Total Leads",
                  },
                  {
                    dataKey: "qualified",
                    color: "#10B981",
                    name: "Qualified Leads",
                  },
                ]}
                showGrid={true}
                showLegend={true}
                className="text-brand-foreground"
              />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-primary/50">
              {/* Total Leads KPI */}
              <div className="relative bg-white/95 rounded-xl p-6 border border-brand-primary/20 backdrop-blur-sm shadow-lg overflow-hidden">
                <div className="relative z-10">
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {weeklyLeadsData.reduce((sum, week) => sum + week.leads, 0)}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Leads Generated
                  </p>
                </div>
              </div>

              {/* Qualified Leads KPI */}
              <div className="relative bg-white/95 rounded-xl p-6 border border-brand-primary/20 backdrop-blur-sm shadow-lg overflow-hidden">
                <div className="relative z-10">
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {weeklyLeadsData.reduce(
                      (sum, week) => sum + week.qualified,
                      0
                    )}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    Qualified Leads
                  </p>
                </div>
              </div>

              {/* Conversion Rate KPI */}
              <div className="relative bg-white/95 rounded-xl p-6 border border-brand-primary/20 backdrop-blur-sm shadow-lg overflow-hidden">
                <div className="relative z-10">
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {Math.round(
                      (weeklyLeadsData.reduce(
                        (sum, week) => sum + week.qualified,
                        0
                      ) /
                        weeklyLeadsData.reduce(
                          (sum, week) => sum + week.leads,
                          0
                        )) *
                        100
                    )}
                    %
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    Average Conversion Rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Upcoming Tasks */}
        <Card
          glass={true}
          title="Upcoming Tasks"
          actions={
            <Button
              text="View All"
              type="ghost"
              size="sm"
              className="bg-white/20 backdrop-blur-md border border-white/30 text-brand-foreground rounded-xl hover:bg-white/30 hover:border-white/40 shadow-lg"
              hideArrow={true}
            />
          }
        >
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-white/15 rounded-xl border border-brand-primary/15 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                      task.priority === "High"
                        ? "bg-red-100 border-red-300 text-red-800"
                        : task.priority === "Medium"
                          ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                          : "bg-green-100 border-green-300 text-green-800"
                    }`}
                  >
                    {task.priority}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Client Pipeline Overview */}
      <Card
        glass={true}
        title="Client Pipeline Stages"
        actions={
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-brand-text-light rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-sm">
              Filter
            </button>
            <button className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-brand-foreground rounded-xl hover:bg-white/30 hover:border-white/40 transition-all duration-300 font-medium shadow-lg">
              View All
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
          {pipelineStages.map((stage) => {
            const colors = getStageColors(stage.colorClass);
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className={`bg-gradient-to-br ${colors.bg} backdrop-blur-md border ${colors.border} rounded-xl p-4`}
              >
                <div
                  className={`flex items-center gap-3 mb-4 pb-3 border-b ${colors.headerBorder}`}
                >
                  <div
                    className={`w-10 h-10 ${colors.iconBg} backdrop-blur-sm border ${colors.iconBorder} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${colors.iconColor}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${colors.titleColor}`}>
                      {stage.title}
                    </h3>
                    <p className={`text-xs ${colors.countColor}`}>
                      {stage.clients.length} clients
                    </p>
                  </div>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[500px]">
                  {stage.clients.map((client) => (
                    <div
                      key={client.id}
                      className={`bg-white/80 backdrop-blur-sm border ${colors.cardBorder} rounded-lg p-3 hover:shadow-md transition-all duration-300 group cursor-pointer`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-8 h-8 bg-gradient-to-br ${colors.avatarBg} rounded-lg flex items-center justify-center text-white font-bold text-xs`}
                        >
                          {client.initials}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">
                            {client.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {client.company}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {client.status}
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${colors.valueColor}`}
                        >
                          {client.value}
                        </span>
                        <span className="text-xs text-gray-500">
                          {client.lastActivity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
