"use client";

import { useState } from "react";
import { DataGrid, Button, Badge } from "../../../../../../../../../components/ui";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Mail,
  Phone,
  Star,
  Flame,
  Thermometer,
  Snowflake,
  Calendar,
  DollarSign,
  Building2,
  User,
  CheckSquare
} from "lucide-react";

export default function LeadListTable() {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [filters, setFilters] = useState({
    status: "all",
    source: "all",
    segment: "all",
    assignee: "all"
  });

  const leads = [
    {
      id: 1,
      name: "Tech Corp",
      contact: "John Davis",
      email: "john@techcorp.com",
      phone: "+1 (555) 123-4567",
      source: "Website",
      segment: "hot",
      value: 85000,
      status: "qualified",
      assignee: "Alex Johnson",
      company: "Tech Corp",
      lastActivity: "2 hours ago",
      score: 95,
      createdAt: "2024-11-09",
      nextFollowUp: "2024-11-11"
    },
    {
      id: 2,
      name: "Design Studio Pro",
      contact: "Sarah Martinez",
      email: "sarah@designstudio.com",
      phone: "+1 (555) 234-5678",
      source: "Referral",
      segment: "warm",
      value: 45000,
      status: "contacted",
      assignee: "Sarah Wilson",
      company: "Design Studio",
      lastActivity: "4 hours ago",
      score: 78,
      createdAt: "2024-11-08",
      nextFollowUp: "2024-11-12"
    },
    {
      id: 3,
      name: "Marketing Solutions",
      contact: "Mike Rodriguez",
      email: "mike@marketingsol.com",
      phone: "+1 (555) 345-6789",
      source: "Social Media",
      segment: "cold",
      value: 32000,
      status: "new",
      assignee: "Mike Chen",
      company: "Marketing Solutions",
      lastActivity: "1 day ago",
      score: 45,
      createdAt: "2024-11-07",
      nextFollowUp: "2024-11-13"
    },
    {
      id: 4,
      name: "Enterprise Systems",
      contact: "Lisa Wong",
      email: "lisa@enterprisesys.com",
      phone: "+1 (555) 456-7890",
      source: "Email Campaign",
      segment: "hot",
      value: 120000,
      status: "proposal",
      assignee: "Alex Johnson",
      company: "Enterprise Systems",
      lastActivity: "6 hours ago",
      score: 88,
      createdAt: "2024-11-06",
      nextFollowUp: "2024-11-10"
    },
    {
      id: 5,
      name: "Global Systems Inc",
      contact: "Tom Wilson",
      email: "tom@globalsys.com",
      phone: "+1 (555) 567-8901",
      source: "Trade Show",
      segment: "warm",
      value: 67000,
      status: "negotiation",
      assignee: "Sarah Wilson",
      company: "Global Systems",
      lastActivity: "8 hours ago",
      score: 72,
      createdAt: "2024-11-05",
      nextFollowUp: "2024-11-11"
    }
  ];

  const getSegmentIcon = (segment) => {
    switch (segment) {
      case 'hot':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'warm':
        return <Thermometer className="w-4 h-4 text-orange-500" />;
      case 'cold':
        return <Snowflake className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { variant: "secondary", text: "New" },
      contacted: { variant: "default", text: "Contacted" },
      qualified: { variant: "success", text: "Qualified" },
      proposal: { variant: "warning", text: "Proposal" },
      negotiation: { variant: "default", text: "Negotiation" },
      won: { variant: "success", text: "Won" },
      lost: { variant: "destructive", text: "Lost" }
    };

    const config = statusConfig[status] || { variant: "secondary", text: status };
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.text}
      </Badge>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const columns = [
    {
      id: "select",
      header: "",
      width: "50px",
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedLeads.includes(row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedLeads([...selectedLeads, row.id]);
            } else {
              setSelectedLeads(selectedLeads.filter(id => id !== row.id));
            }
          }}
          className="rounded border-brand-border"
        />
      )
    },
    {
      id: "lead",
      header: "Lead",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {getSegmentIcon(row.segment)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-brand-foreground">{row.name}</p>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(row.score)}`}>
                {row.score}
              </div>
            </div>
            <p className="text-sm text-brand-text-light">{row.contact}</p>
          </div>
        </div>
      )
    },
    {
      id: "contact",
      header: "Contact",
      cell: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-3 h-3 text-brand-text-light" />
            <span className="text-brand-text-light">{row.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-3 h-3 text-brand-text-light" />
            <span className="text-brand-text-light">{row.phone}</span>
          </div>
        </div>
      )
    },
    {
      id: "value",
      header: "Est. Value",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-brand-text-light" />
          <span className="font-semibold text-brand-foreground">
            ${(row.value / 1000).toFixed(0)}K
          </span>
        </div>
      )
    },
    {
      id: "source",
      header: "Source",
      cell: (row) => (
        <Badge variant="outline" className="text-xs">
          {row.source}
        </Badge>
      )
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => getStatusBadge(row.status)
    },
    {
      id: "assignee",
      header: "Assigned To",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-primary/10 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-brand-primary" />
          </div>
          <span className="text-sm text-brand-foreground">{row.assignee}</span>
        </div>
      )
    },
    {
      id: "lastActivity",
      header: "Last Activity",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-brand-text-light" />
          <span className="text-sm text-brand-text-light">{row.lastActivity}</span>
        </div>
      )
    },
    {
      id: "actions",
      header: "",
      width: "120px",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Eye className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
      )
    }
  ];

  const bulkActions = [
    { label: "Assign to User", icon: User },
    { label: "Change Status", icon: CheckSquare },
    { label: "Send Email", icon: Mail },
    { label: "Export Selected", icon: Download },
    { label: "Delete", icon: MoreHorizontal, variant: "destructive" }
  ];

  const savedViews = [
    { name: "All Leads", count: 156, active: true },
    { name: "Hot Prospects", count: 23, active: false },
    { name: "This Week", count: 45, active: false },
    { name: "Unassigned", count: 12, active: false },
    { name: "Follow-up Due", count: 8, active: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand-foreground">Leads</h2>
          <p className="text-brand-text-light">Manage and track your sales leads</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Saved Views */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {savedViews.map((view, index) => (
          <button
            key={index}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              view.active
                ? 'bg-brand-primary text-white'
                : 'bg-white hover:bg-gray-50 text-brand-foreground border border-brand-border'
            }`}
          >
            {view.name}
            <Badge variant={view.active ? "secondary" : "outline"} className="text-xs">
              {view.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
            <input
              type="text"
              placeholder="Search leads..."
              className="pl-10 pr-4 py-2 bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary text-sm"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {selectedLeads.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-brand-text-light">
              {selectedLeads.length} selected
            </span>
            {bulkActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant === "destructive" ? "destructive" : "outline"}
                  size="sm"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        <DataGrid
          data={leads}
          columns={columns}
          showPagination={true}
          pageSize={10}
          className="min-h-[500px]"
        />
      </div>
    </div>
  );
}