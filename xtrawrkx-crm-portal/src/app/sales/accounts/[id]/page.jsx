"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Card,
  Badge,
  Avatar,
  Button,
  Tabs,
  StatCard,
  Table,
} from "../../../../../../../../../../components/ui";
import {
  ArrowLeft,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Activity,
  Briefcase,
  Edit,
  MoreVertical,
  Plus,
  Search,
  Filter,
  Eye,
  MessageSquare,
  FileText,
  Settings,
  Share2,
  Download,
  Trash2,
} from "lucide-react";

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, fetch from API
  const mockAccount = {
    id: parseInt(params.id),
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
    description: "Leading technology solutions provider specializing in enterprise software and cloud infrastructure.",
    founded: "2015",
    headquarters: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    email: "contact@techsolutions.com",
    linkedIn: "techsolutions-inc",
    twitter: "@techsolutions",
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAccount(mockAccount);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  const contactColumns = [
    {
      key: "name",
      label: "Name",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={value} size="sm" />
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.title}</div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (value) => <Badge variant="info">{value}</Badge>,
    },
    {
      key: "lastContact",
      label: "Last Contact",
      render: (value) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Eye className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MessageSquare className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      ),
    },
  ];

  const dealColumns = [
    {
      key: "name",
      label: "Deal Name",
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.stage}</div>
        </div>
      ),
    },
    {
      key: "value",
      label: "Value",
      render: (value) => (
        <span className="font-semibold text-gray-900">${value}K</span>
      ),
    },
    {
      key: "stage",
      label: "Stage",
      render: (value) => {
        const variants = {
          "Prospecting": "default",
          "Qualification": "warning",
          "Proposal": "info",
          "Negotiation": "warning",
          "Closed Won": "success",
          "Closed Lost": "destructive",
        };
        return <Badge variant={variants[value] || "default"}>{value}</Badge>;
      },
    },
    {
      key: "probability",
      label: "Probability",
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-900">{value}%</span>
        </div>
      ),
    },
    {
      key: "closeDate",
      label: "Close Date",
      render: (value) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Edit className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      ),
    },
  ];

  const mockContacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "CEO",
      email: "sarah.j@techsolutions.com",
      phone: "+1 (555) 123-4567",
      role: "Decision Maker",
      lastContact: "2 days ago",
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "CTO",
      email: "mchen@techsolutions.com",
      phone: "+1 (555) 234-5678",
      role: "Technical Lead",
      lastContact: "1 week ago",
    },
    {
      id: 3,
      name: "Jennifer Williams",
      title: "VP Sales",
      email: "jwilliams@techsolutions.com",
      phone: "+1 (555) 345-6789",
      role: "Influencer",
      lastContact: "3 days ago",
    },
  ];

  const mockDeals = [
    {
      id: 1,
      name: "Enterprise Software License",
      stage: "Negotiation",
      value: 150,
      probability: 75,
      closeDate: "Dec 15, 2024",
    },
    {
      id: 2,
      name: "Cloud Infrastructure Setup",
      stage: "Proposal",
      value: 85,
      probability: 60,
      closeDate: "Jan 20, 2025",
    },
    {
      id: 3,
      name: "Support & Maintenance",
      stage: "Qualification",
      value: 45,
      probability: 40,
      closeDate: "Feb 10, 2025",
    },
  ];

  const activityItems = [
    {
      id: 1,
      type: "email",
      title: "Email sent to Sarah Johnson",
      description: "Follow-up on proposal discussion",
      timestamp: "2 hours ago",
      user: "John Smith",
    },
    {
      id: 2,
      type: "call",
      title: "Phone call with Michael Chen",
      description: "Technical requirements discussion",
      timestamp: "1 day ago",
      user: "John Smith",
    },
    {
      id: 3,
      type: "meeting",
      title: "Meeting scheduled",
      description: "Quarterly business review",
      timestamp: "3 days ago",
      user: "Emily Davis",
    },
    {
      id: 4,
      type: "deal",
      title: "Deal updated",
      description: "Enterprise Software License moved to Negotiation",
      timestamp: "1 week ago",
      user: "John Smith",
    },
  ];

  const tabItems = [
    { key: "overview", label: "Overview" },
    { key: "contacts", label: "Contacts" },
    { key: "deals", label: "Deals" },
    { key: "activity", label: "Activity" },
    { key: "documents", label: "Documents" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account details...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Account not found</h2>
          <p className="text-gray-600 mb-4">The account you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/sales/accounts')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Accounts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/sales/accounts')}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                    {account.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">{account.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="success">{account.type}</Badge>
                      <span className="text-sm text-gray-500">{account.industry}</span>
                    </div>
                  </div>
                </div>
                <nav className="flex items-center space-x-2 text-sm text-gray-500">
                  <a href="/" className="hover:text-gray-700">Dashboard</a>
                  <span>/</span>
                  <a href="/sales" className="hover:text-gray-700">Sales</a>
                  <span>/</span>
                  <a href="/sales/accounts" className="hover:text-gray-700">Accounts</a>
                  <span>/</span>
                  <span className="text-gray-900">{account.name}</span>
                </nav>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Contacts"
            value={account.contacts}
            change="+2"
            changeType="increase"
            icon={Users}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Active Deals"
            value={account.deals}
            change="+1"
            changeType="increase"
            icon={Briefcase}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="Deal Value"
            value={`$${account.dealValue}K`}
            change="+15%"
            changeType="increase"
            icon={DollarSign}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            title="Health Score"
            value={`${account.health}%`}
            change="+5%"
            changeType="increase"
            icon={TrendingUp}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs
            tabs={tabItems}
            defaultTab="overview"
            variant="line"
            onChange={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Information */}
            <div className="lg:col-span-2">
              <Card title="Company Information" className="mb-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Industry</label>
                      <p className="text-gray-900">{account.industry}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Founded</label>
                      <p className="text-gray-900">{account.founded}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Employees</label>
                      <p className="text-gray-900">{account.employees}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Headquarters</label>
                      <p className="text-gray-900">{account.headquarters}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900 mt-1">{account.description}</p>
                  </div>
                </div>
              </Card>

              {/* Contact Information */}
              <Card title="Contact Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a href={`https://${account.website}`} className="text-blue-600 hover:underline">
                        {account.website}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900">{account.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{account.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-gray-900">{account.location}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Account Owner & Health */}
            <div>
              <Card title="Account Owner" className="mb-6">
                <div className="flex items-center gap-3">
                  <Avatar name={account.owner} size="lg" />
                  <div>
                    <h3 className="font-medium text-gray-900">{account.owner}</h3>
                    <p className="text-sm text-gray-500">Account Manager</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.8 rating</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Account Health">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Health Score</span>
                      <span className="text-sm font-semibold text-gray-900">{account.health}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          account.health >= 80
                            ? "bg-green-500"
                            : account.health >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${account.health}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Activity</span>
                      <span className="text-gray-900">{account.lastActivity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="text-gray-900">${account.revenue}M</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Active Deals</span>
                      <span className="text-gray-900">{account.deals}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "contacts" && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
            <Table columns={contactColumns} data={mockContacts} />
          </Card>
        )}

        {activeTab === "deals" && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Deals</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Deal
              </Button>
            </div>
            <Table columns={dealColumns} data={mockDeals} />
          </Card>
        )}

        {activeTab === "activity" && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Log Activity
              </Button>
            </div>
            <div className="space-y-4">
              {activityItems.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'email' ? 'bg-blue-100' :
                    activity.type === 'call' ? 'bg-green-100' :
                    activity.type === 'meeting' ? 'bg-purple-100' :
                    'bg-yellow-100'
                  }`}>
                    {activity.type === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'call' && <Phone className="w-4 h-4 text-green-600" />}
                    {activity.type === 'meeting' && <Calendar className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'deal' && <Briefcase className="w-4 h-4 text-yellow-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <span className="text-sm text-gray-500">{activity.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar name={activity.user} size="xs" />
                      <span className="text-xs text-gray-500">{activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === "documents" && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No documents uploaded yet</p>
              <p className="text-sm">Upload contracts, proposals, and other important files</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
