"use client";

import { useState } from "react";
import {
  Card,
  Badge,
  Avatar,
  StatCard,
  AreaChart,
  EmptyState,
} from "../../../../../../../../../components/ui";
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
  ChevronDown,
  Bell,
  Settings,
} from "lucide-react";
// import { useDragDropBoard } from "../../../lib/dragdrop/useDragDropBoard"; // Removed - using react-beautiful-dnd now
import { DealFilterModal, AddDealModal } from "../../../components/deals";

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [filters, setFilters] = useState({
    stage: "",
    priority: "",
    assignee: "",
    company: "",
    minValue: "",
    maxValue: "",
    probability: "",
    daysInStage: "",
  });

  // Initial pipeline stages data
  const initialPipelineStages = [
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

  // Drag-drop functionality
  const handleDealDrop = (deal, sourceColumnId, targetColumnId, targetIndex) => {
    console.log('Deal moved:', deal.title, 'from', sourceColumnId, 'to', targetColumnId);
    // Here you would typically make an API call to update the deal status
    // For now, we'll just log it
  };

  // Use the initial pipeline stages directly since we're now using react-beautiful-dnd
  const [pipelineStages, setPipelineStages] = useState(initialPipelineStages);

  // Filter and search logic
  const getFilteredDeals = () => {
    let allDeals = [];
    
    // Collect all deals from all stages
    pipelineStages.forEach(stage => {
      stage.deals.forEach(deal => {
        allDeals.push({ ...deal, stage: stage.id });
      });
    });

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      allDeals = allDeals.filter(deal =>
        deal.title.toLowerCase().includes(query) ||
        deal.company.toLowerCase().includes(query) ||
        deal.assignee.toLowerCase().includes(query) ||
        deal.nextAction.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.stage) {
      allDeals = allDeals.filter(deal => deal.stage === filters.stage);
    }
    if (filters.priority) {
      allDeals = allDeals.filter(deal => deal.priority === filters.priority);
    }
    if (filters.assignee) {
      allDeals = allDeals.filter(deal => deal.assignee === filters.assignee);
    }
    if (filters.company) {
      allDeals = allDeals.filter(deal => 
        deal.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }
    if (filters.minValue) {
      allDeals = allDeals.filter(deal => deal.value >= parseFloat(filters.minValue));
    }
    if (filters.maxValue) {
      allDeals = allDeals.filter(deal => deal.value <= parseFloat(filters.maxValue));
    }
    if (filters.probability) {
      const [min, max] = filters.probability.split('-').map(Number);
      allDeals = allDeals.filter(deal => deal.probability >= min && deal.probability <= max);
    }
    if (filters.daysInStage) {
      if (filters.daysInStage === "91+") {
        allDeals = allDeals.filter(deal => deal.daysInStage >= 91);
      } else {
        const [min, max] = filters.daysInStage.split('-').map(Number);
        allDeals = allDeals.filter(deal => deal.daysInStage >= min && deal.daysInStage <= max);
      }
    }

    return allDeals;
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleAddDeal = (newDeal) => {
    // Add the new deal to the appropriate stage
    setPipelineStages(prev => {
      const updated = [...prev];
      const targetStage = updated.find(stage => stage.id === newDeal.stage);
      if (targetStage) {
        const deals = targetStage.deals || targetStage.items || [];
        const itemsKey = targetStage.deals ? 'deals' : 'items';
        targetStage[itemsKey] = [newDeal, ...deals];
      }
      return updated;
    });
  };

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

  const totalPipelineValue = pipelineStages.reduce(
    (sum, stage) => sum + stage.value,
    0
  );
  const openDealsCount = pipelineStages
    .slice(0, 3)
    .reduce((sum, stage) => sum + stage.count, 0);
  const avgDealSize = Math.round(totalPipelineValue / (openDealsCount || 1));

  return (
    <div className="space-y-4">
      {/* Page Header - Dashboard Style */}
      <Card glass={true}>
        <div className="flex items-center justify-between">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-brand-text-light mb-2">
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4" />
              <span>Sales</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-brand-foreground font-medium">
                Deals
              </span>
            </div>

            {/* Title and Subtitle */}
            <h1 className="text-5xl font-light text-brand-foreground mb-1 tracking-tight">
              Deals Pipeline
            </h1>
            <p className="text-brand-text-light">
              Manage your sales opportunities
            </p>
          </div>

          {/* Right side enhanced UI */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-light" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary focus:bg-white/15 transition-all duration-300 placeholder:text-brand-text-light shadow-lg"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Add New */}
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-brand-primary rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 group shadow-lg"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>

              {/* Filter */}
              <button 
                onClick={() => setIsFilterModalOpen(true)}
                className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg"
              >
                <Filter className="w-5 h-5 text-brand-text-light" />
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
                  <ChevronDown className={`w-4 h-4 text-brand-text-light transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
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
                      className="fixed right-6 top-20 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 z-[99999]"
                      onMouseEnter={() => setShowProfileDropdown(true)}
                      onMouseLeave={() => setShowProfileDropdown(false)}
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
                          <Bell className="w-4 h-4" />
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

      <div className="px-3">
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
        <div className="w-full">
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
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
                  <div
                    className="p-4 space-y-3 max-h-[600px] overflow-y-auto transition-all duration-200"
                  >
                    {stage.deals.length > 0 ? (
                      stage.deals.map((deal, dealIndex) => (
                        <Card
                          key={deal.id}
                          className="p-3 cursor-move transition-all duration-200 hover:shadow-md"
                          hoverable
                          // Drag functionality temporarily disabled - will use PipelineBoard component with react-beautiful-dnd
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
                    <button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="w-full py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Deal
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DealFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        filters={filters}
        setFilters={setFilters}
      />

      <AddDealModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDeal={handleAddDeal}
      />
    </div>
  );
}
