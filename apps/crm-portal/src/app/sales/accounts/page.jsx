"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Card,
  Table,
  Badge,
  Avatar,
  StatCard,
  Tabs,
} from "@xtrawrkx/ui";
import { 
  AccountFilterModal, 
  AddAccountModal, 
  ImportAccountsModal, 
  AccountScoringModal, 
  ActivityTimelineModal, 
  EmailCampaignsModal 
} from "../../../components/accounts";
import {
  Plus,
  Search,
  Filter,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MoreVertical,
  Star,
  Activity,
  Briefcase,
  ChevronRight,
  ChevronDown,
  Bell,
  Settings,
  User,
} from "lucide-react";

export default function AccountsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isScoringModalOpen, setIsScoringModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    industry: "",
    owner: "",
    minRevenue: "",
    maxRevenue: "",
    healthScore: "",
  });
  const accountColumns = [
    {
      key: "name",
      label: "Company",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {value.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate">{value}</div>
            <div className="text-xs text-gray-500 truncate">{row.industry}</div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (value) => {
        const variants = {
          Customer: "success",
          Prospect: "warning",
          Partner: "info",
          Vendor: "purple",
        };
        return <Badge variant={variants[value] || "default"}>{value}</Badge>;
      },
    },
    {
      key: "contacts",
      label: "Contacts",
      render: (value) => (
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 text-gray-400" />
          <span className="text-sm font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "deals",
      label: "Deals",
      render: (value) => (
        <div className="flex items-center gap-1">
          <Briefcase className="w-3 h-3 text-gray-400" />
          <span className="text-sm font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "revenue",
      label: "Revenue",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900 text-sm">${value}M</span>
      ),
    },
    {
      key: "owner",
      label: "Owner",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Avatar name={value} size="xs" />
          <span className="text-sm text-gray-900 truncate">{value}</span>
        </div>
      ),
    },
    {
      key: "health",
      label: "Health",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5 min-w-0">
            <div
              className={`h-1.5 rounded-full ${
                value >= 80
                  ? "bg-green-500"
                  : value >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-900">{value}%</span>
        </div>
      ),
    },
    {
      key: "lastActivity",
      label: "Last Activity",
      render: (value) => (
        <div className="text-xs text-gray-600 truncate">{value}</div>
      ),
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const [accountsData, setAccountsData] = useState([
    {
      id: 1,
      name: "Tech Solutions Inc",
      industry: "Technology",
      type: "Customer",
      contacts: 12,
      deals: 3,
      dealValue: 450,
      revenue: 2.5,
      owner: "John Smith",
      health: 85,
      lastActivity: "Email sent",
      website: "techsolutions.com",
      employees: "500-1000",
      location: "San Francisco, CA",
    },
    {
      id: 2,
      name: "Global Enterprises",
      industry: "Manufacturing",
      type: "Customer",
      contacts: 8,
      deals: 2,
      dealValue: 280,
      revenue: 5.2,
      owner: "Emily Davis",
      health: 92,
      lastActivity: "Meeting scheduled",
      website: "globalenterprises.com",
      employees: "1000+",
      location: "New York, NY",
    },
    {
      id: 3,
      name: "StartUp Hub",
      industry: "Software",
      type: "Prospect",
      contacts: 5,
      deals: 1,
      dealValue: 120,
      revenue: 0.8,
      owner: "Sarah Wilson",
      health: 65,
      lastActivity: "Proposal sent",
      website: "startuphub.io",
      employees: "50-100",
      location: "Austin, TX",
    },
    {
      id: 4,
      name: "Innovation Labs",
      industry: "Research",
      type: "Partner",
      contacts: 15,
      deals: 4,
      dealValue: 680,
      revenue: 3.2,
      owner: "John Smith",
      health: 78,
      lastActivity: "Contract signed",
      website: "innovationlabs.com",
      employees: "100-500",
      location: "Boston, MA",
    },
    {
      id: 5,
      name: "Digital Marketing Pro",
      industry: "Marketing",
      type: "Customer",
      contacts: 6,
      deals: 2,
      dealValue: 150,
      revenue: 1.5,
      owner: "Emily Davis",
      health: 88,
      lastActivity: "Call completed",
      website: "digitalmarketingpro.com",
      employees: "100-500",
      location: "Los Angeles, CA",
    },
  ]);

  const topAccounts = accountsData
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  // Filter and search logic
  const getFilteredAccounts = () => {
    let filtered = accountsData;

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(account =>
        account.name.toLowerCase().includes(query) ||
        account.industry.toLowerCase().includes(query) ||
        account.owner.toLowerCase().includes(query) ||
        account.type.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.type) {
      filtered = filtered.filter(account => account.type === filters.type);
    }
    if (filters.industry) {
      filtered = filtered.filter(account => account.industry === filters.industry);
    }
    if (filters.owner) {
      filtered = filtered.filter(account => account.owner === filters.owner);
    }
    if (filters.minRevenue) {
      filtered = filtered.filter(account => account.revenue >= parseFloat(filters.minRevenue));
    }
    if (filters.maxRevenue) {
      filtered = filtered.filter(account => account.revenue <= parseFloat(filters.maxRevenue));
    }
    if (filters.healthScore) {
      const [min, max] = filters.healthScore.split('-').map(Number);
      filtered = filtered.filter(account => account.health >= min && account.health <= max);
    }

    // Apply tab filter
    if (activeTab !== "all") {
      if (activeTab === "customers") filtered = filtered.filter(a => a.type === "Customer");
      if (activeTab === "prospects") filtered = filtered.filter(a => a.type === "Prospect");
      if (activeTab === "partners") filtered = filtered.filter(a => a.type === "Partner");
    }

    return filtered;
  };

  const filteredAccounts = getFilteredAccounts();

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleAddAccount = (newAccount) => {
    setAccountsData(prev => [newAccount, ...prev]);
  };

  const handleImportAccounts = (importedAccounts) => {
    setAccountsData(prev => [...importedAccounts, ...prev]);
  };

  const handleSaveScoringRules = (rules) => {
    console.log('Saving scoring rules:', rules);
    // Here you would typically save to backend
  };

  const tabItems = [
    { key: "all", label: "All Accounts", badge: accountsData.length },
    {
      key: "customers",
      label: "Customers",
      badge: accountsData.filter((a) => a.type === "Customer").length,
    },
    {
      key: "prospects",
      label: "Prospects",
      badge: accountsData.filter((a) => a.type === "Prospect").length,
    },
    {
      key: "partners",
      label: "Partners",
      badge: accountsData.filter((a) => a.type === "Partner").length,
    },
  ];

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
                Accounts
              </span>
            </div>

            {/* Title and Subtitle */}
            <h1 className="text-5xl font-light text-brand-foreground mb-1 tracking-tight">
              Accounts
            </h1>
            <p className="text-brand-text-light">
              Manage your company accounts and relationships
            </p>
          </div>

          {/* Right side enhanced UI */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-light" />
              <input
                type="text"
                placeholder="Search accounts..."
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
            title="Total Accounts"
            value={accountsData.length}
            change="+12"
            changeType="increase"
            icon={Building2}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Active Customers"
            value={accountsData.filter((a) => a.type === "Customer").length}
            change="+5"
            changeType="increase"
            icon={Users}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="Total Revenue"
            value={`$${accountsData.reduce((sum, a) => sum + a.revenue, 0).toFixed(1)}M`}
            change="+18%"
            changeType="increase"
            icon={DollarSign}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            title="Avg Health Score"
            value={`${Math.round(accountsData.reduce((sum, a) => sum + a.health, 0) / accountsData.length)}%`}
            change="+3%"
            changeType="increase"
            icon={TrendingUp}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
          />
        </div>

        {/* Top Accounts */}
        <Card title="Top Accounts by Revenue" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topAccounts.map((account, index) => (
              <div
                key={account.id}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{account.name}</h4>
                  <p className="text-sm text-gray-500">{account.industry}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-semibold text-gray-900">
                      ${account.revenue}M
                    </span>
                    <Badge variant="success" size="sm">
                      {account.health}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tabs and Table */}
        <div className="mb-4">
          <Tabs
            tabs={tabItems}
            defaultTab="all"
            variant="line"
            onChange={setActiveTab}
          />
        </div>

        <Card>
          <div className="overflow-x-auto">
            <Table
              columns={accountColumns}
              data={filteredAccounts}
              onRowClick={(row) => router.push(`/sales/accounts/${row.id}`)}
              className="min-w-full"
            />
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setIsImportModalOpen(true)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Import Accounts
                </p>
                <p className="text-xs text-gray-500">Bulk import from CSV</p>
              </div>
            </div>
          </Card>
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setIsScoringModalOpen(true)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Account Scoring
                </p>
                <p className="text-xs text-gray-500">Set scoring rules</p>
              </div>
            </div>
          </Card>
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setIsTimelineModalOpen(true)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Activity Timeline
                </p>
                <p className="text-xs text-gray-500">View all activities</p>
              </div>
            </div>
          </Card>
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setIsEmailModalOpen(true)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Mail className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Email Campaigns
                </p>
                <p className="text-xs text-gray-500">Send to accounts</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AccountFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        filters={filters}
        setFilters={setFilters}
      />

      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAccount={handleAddAccount}
      />

      <ImportAccountsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportAccounts={handleImportAccounts}
      />

      <AccountScoringModal
        isOpen={isScoringModalOpen}
        onClose={() => setIsScoringModalOpen(false)}
        onSaveRules={handleSaveScoringRules}
      />

      <ActivityTimelineModal
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
        selectedAccounts={filteredAccounts}
      />

      <EmailCampaignsModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        selectedAccounts={filteredAccounts}
      />
    </div>
  );
}
