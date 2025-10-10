"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "../../components/ui";
import {
  Briefcase,
  DollarSign,
  Calendar,
  User,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
} from "lucide-react";

export default function ContactDeals({ contactId }) {
  const [selectedFilters, setSelectedFilters] = useState({
    stage: "all",
    status: "all",
    owner: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock deals data - replace with actual API calls
  const deals = [
    {
      id: 1,
      name: "Enterprise CRM Implementation",
      stage: "proposal",
      status: "active",
      value: 75000,
      probability: 75,
      expectedCloseDate: "2024-02-15",
      owner: "John Smith",
      createdAt: "2024-01-10",
      lastActivity: "2024-01-15",
      description: "Full CRM implementation for TechCorp including custom integrations and training.",
      tags: ["enterprise", "crm", "implementation"],
      products: ["CRM Pro", "Custom Integration", "Training Package"],
      competitors: ["Salesforce", "HubSpot"],
      nextSteps: "Send detailed proposal and schedule demo",
    },
    {
      id: 2,
      name: "Marketing Automation Setup",
      stage: "negotiation",
      status: "active",
      value: 25000,
      probability: 60,
      expectedCloseDate: "2024-01-30",
      owner: "Jane Doe",
      createdAt: "2024-01-08",
      lastActivity: "2024-01-14",
      description: "Marketing automation platform setup with email campaigns and lead scoring.",
      tags: ["marketing", "automation", "email"],
      products: ["Marketing Pro", "Email Campaigns", "Lead Scoring"],
      competitors: ["Mailchimp", "Pardot"],
      nextSteps: "Address pricing concerns and provide ROI analysis",
    },
    {
      id: 3,
      name: "Q1 Support Package",
      stage: "closed-won",
      status: "won",
      value: 15000,
      probability: 100,
      expectedCloseDate: "2024-01-12",
      owner: "John Smith",
      createdAt: "2024-01-05",
      lastActivity: "2024-01-12",
      description: "Quarterly support package with priority support and regular check-ins.",
      tags: ["support", "quarterly", "priority"],
      products: ["Support Package", "Priority Support"],
      competitors: [],
      nextSteps: "Onboard client and schedule kickoff meeting",
    },
  ];

  const stages = [
    { value: "all", label: "All Stages" },
    { value: "lead", label: "Lead" },
    { value: "qualification", label: "Qualification" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed-won", label: "Closed Won" },
    { value: "closed-lost", label: "Closed Lost" },
  ];

  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "won", label: "Won" },
    { value: "lost", label: "Lost" },
    { value: "on-hold", label: "On Hold" },
  ];

  const owners = [
    { value: "all", label: "All Owners" },
    { value: "John Smith", label: "John Smith" },
    { value: "Jane Doe", label: "Jane Doe" },
    { value: "Mike Johnson", label: "Mike Johnson" },
  ];

  const getStageBadge = (stage) => {
    const stageConfig = {
      lead: { color: "badge-gray", label: "Lead" },
      qualification: { color: "badge-warning", label: "Qualification" },
      proposal: { color: "badge-primary", label: "Proposal" },
      negotiation: { color: "badge-warning", label: "Negotiation" },
      "closed-won": { color: "badge-success", label: "Closed Won" },
      "closed-lost": { color: "badge-error", label: "Closed Lost" },
    };
    
    const config = stageConfig[stage] || stageConfig.lead;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "won":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "lost":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "on-hold":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return "text-green-600";
    if (probability >= 60) return "text-yellow-600";
    if (probability >= 40) return "text-orange-600";
    return "text-red-600";
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
      year: "numeric",
    });
  };

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(dateString);
  };

  const filteredDeals = deals.filter((deal) => {
    // Stage filter
    if (selectedFilters.stage !== "all" && deal.stage !== selectedFilters.stage) {
      return false;
    }

    // Status filter
    if (selectedFilters.status !== "all" && deal.status !== selectedFilters.status) {
      return false;
    }

    // Owner filter
    if (selectedFilters.owner !== "all" && deal.owner !== selectedFilters.owner) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        deal.name,
        deal.description,
        deal.owner,
        ...deal.tags,
        ...deal.products,
      ].join(" ").toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const activeDeals = filteredDeals.filter(deal => deal.status === "active").length;
  const wonDeals = filteredDeals.filter(deal => deal.status === "won").length;
  const winRate = filteredDeals.length > 0 ? (wonDeals / filteredDeals.length) * 100 : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Linked Deals</h3>
          <p className="text-sm text-gray-600">
            All deals associated with this contact
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="btn-primary">
            <span>Add Deal</span>
            <div className="btn-icon">
              <Plus className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Value</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalValue)}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Active Deals</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{activeDeals}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Won Deals</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{wonDeals}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {winRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stage
              </label>
              <select
                value={selectedFilters.stage}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, stage: e.target.value }))}
                className="input py-2"
              >
                {stages.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedFilters.status}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                className="input py-2"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner
              </label>
              <select
                value={selectedFilters.owner}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, owner: e.target.value }))}
                className="input py-2"
              >
                {owners.map((owner) => (
                  <option key={owner.value} value={owner.value}>
                    {owner.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4 py-2 w-full max-w-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Deals List */}
      <div className="space-y-4">
        {filteredDeals.map((deal) => (
          <div key={deal.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <Link
                    href={`/deals/${deal.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-brand-primary transition-colors"
                  >
                    {deal.name}
                  </Link>
                  {getStageBadge(deal.stage)}
                  {getStatusIcon(deal.status)}
                </div>

                <p className="text-gray-600 mb-4">{deal.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Deal Value</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(deal.value)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Probability</div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            deal.probability >= 80
                              ? "bg-green-500"
                              : deal.probability >= 60
                              ? "bg-yellow-500"
                              : deal.probability >= 40
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${getProbabilityColor(deal.probability)}`}>
                        {deal.probability}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Expected Close</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(deal.expectedCloseDate)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {deal.tags.map((tag) => (
                    <Badge key={tag} className="badge-gray text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{deal.owner}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Created {formatRelativeTime(deal.createdAt)}</span>
                    </div>
                  </div>
                  <span>Last activity: {formatRelativeTime(deal.lastActivity)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/deals/${deal.id}`}
                  className="p-2 text-gray-400 hover:text-brand-primary transition-colors"
                  title="View Deal"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  className="p-2 text-gray-400 hover:text-brand-primary transition-colors"
                  title="Edit Deal"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="More actions"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDeals.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedFilters.stage !== "all" || selectedFilters.status !== "all" || selectedFilters.owner !== "all"
              ? "Try adjusting your filters or search terms"
              : "No deals associated with this contact yet"
            }
          </p>
          <button className="btn-primary">
            <span>Create First Deal</span>
            <div className="btn-icon">
              <Plus className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
