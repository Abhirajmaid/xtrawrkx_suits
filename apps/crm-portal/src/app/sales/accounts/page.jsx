"use client";

import { useState } from "react";
import {
  Container,
  PageHeader,
  Card,
  Table,
  Badge,
  Avatar,
  StatCard,
  Tabs,
  DataGrid,
} from "@xtrawrkx/ui";
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
} from "lucide-react";

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const accountColumns = [
    {
      key: "name",
      label: "Company Name",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
            {value.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.industry}</div>
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
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{value} contacts</span>
        </div>
      ),
    },
    {
      key: "deals",
      label: "Open Deals",
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value} deals</div>
          <div className="text-sm text-gray-500">${row.dealValue}K value</div>
        </div>
      ),
    },
    {
      key: "revenue",
      label: "Annual Revenue",
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">${value}M</span>
      ),
    },
    {
      key: "owner",
      label: "Account Owner",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Avatar name={value} size="xs" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: "health",
      label: "Health Score",
      sortable: true,
      render: (value) => {
        const getColor = (score) => {
          if (score >= 80) return "text-green-600 bg-green-50";
          if (score >= 60) return "text-yellow-600 bg-yellow-50";
          return "text-red-600 bg-red-50";
        };
        return (
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${getColor(value)}`}
          >
            <Activity className="w-3 h-3" />
            {value}%
          </div>
        );
      },
    },
    {
      key: "lastActivity",
      label: "Last Activity",
      render: (value) => (
        <div className="text-sm">
          <div className="text-gray-900">{value}</div>
          <div className="text-gray-500">2 days ago</div>
        </div>
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

  const accountsData = [
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
  ];

  const topAccounts = accountsData
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

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

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search accounts..."
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
        Add Account
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Accounts"
        subtitle="Manage your company accounts and relationships"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Sales" },
          { label: "Accounts" },
        ]}
        actions={headerActions}
      />

      <Container className="py-6">
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
          <Table
            columns={accountColumns}
            data={accountsData.filter((account) => {
              if (activeTab === "all") return true;
              if (activeTab === "customers") return account.type === "Customer";
              if (activeTab === "prospects") return account.type === "Prospect";
              if (activeTab === "partners") return account.type === "Partner";
              return true;
            })}
            onRowClick={(row) => console.log("Account clicked:", row)}
          />
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
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
          <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
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
          <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
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
          <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
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
      </Container>
    </div>
  );
}
