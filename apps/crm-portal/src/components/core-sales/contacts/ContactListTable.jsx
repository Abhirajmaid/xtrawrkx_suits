"use client";

import { useState } from "react";
import { DataGrid, Button, Badge, Card } from "@xtrawrkx/ui";
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
  Building2,
  User,
  Calendar,
  MapPin,
  Star,
  MessageSquare,
  FileText
} from "lucide-react";

export default function ContactListTable() {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [filters, setFilters] = useState({
    status: "all",
    company: "all",
    assignee: "all",
    tags: "all"
  });

  const contacts = [
    {
      id: 1,
      firstName: "John",
      lastName: "Davis",
      email: "john@techcorp.com",
      phone: "+1 (555) 123-4567",
      title: "CTO",
      company: "Tech Corp",
      industry: "Technology",
      location: "San Francisco, CA",
      status: "active",
      assignee: "Alex Johnson",
      lastActivity: "2 hours ago",
      tags: ["decision-maker", "enterprise"],
      createdAt: "2024-10-15",
      source: "Website",
      dealCount: 2,
      totalValue: 120000
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Martinez",
      email: "sarah@designstudio.com",
      phone: "+1 (555) 234-5678",
      title: "Marketing Director",
      company: "Design Studio",
      industry: "Creative",
      location: "New York, NY",
      status: "active",
      assignee: "Sarah Wilson",
      lastActivity: "4 hours ago",
      tags: ["influencer", "warm"],
      createdAt: "2024-10-20",
      source: "Referral",
      dealCount: 1,
      totalValue: 45000
    },
    {
      id: 3,
      firstName: "Mike",
      lastName: "Rodriguez",
      email: "mike@marketingsol.com",
      phone: "+1 (555) 345-6789",
      title: "CEO",
      company: "Marketing Solutions",
      industry: "Marketing",
      location: "Austin, TX",
      status: "inactive",
      assignee: "Mike Chen",
      lastActivity: "1 day ago",
      tags: ["cold", "small-business"],
      createdAt: "2024-10-25",
      source: "Social Media",
      dealCount: 0,
      totalValue: 0
    },
    {
      id: 4,
      firstName: "Lisa",
      lastName: "Wong",
      email: "lisa@enterprisesys.com",
      phone: "+1 (555) 456-7890",
      title: "VP of Sales",
      company: "Enterprise Systems",
      industry: "Technology",
      location: "Seattle, WA",
      status: "active",
      assignee: "Alex Johnson",
      lastActivity: "6 hours ago",
      tags: ["decision-maker", "enterprise", "hot"],
      createdAt: "2024-10-30",
      source: "Email Campaign",
      dealCount: 3,
      totalValue: 180000
    },
    {
      id: 5,
      firstName: "Tom",
      lastName: "Wilson",
      email: "tom@globalsys.com",
      phone: "+1 (555) 567-8901",
      title: "Operations Manager",
      company: "Global Systems",
      industry: "Manufacturing",
      location: "Chicago, IL",
      status: "active",
      assignee: "Sarah Wilson",
      lastActivity: "8 hours ago",
      tags: ["warm", "mid-market"],
      createdAt: "2024-11-01",
      source: "Trade Show",
      dealCount: 1,
      totalValue: 67000
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { variant: "success", text: "Active" },
      inactive: { variant: "secondary", text: "Inactive" },
      unqualified: { variant: "destructive", text: "Unqualified" }
    };

    const config = statusConfig[status] || { variant: "secondary", text: status };
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.text}
      </Badge>
    );
  };

  const columns = [
    {
      id: "select",
      header: "",
      width: "50px",
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedContacts.includes(row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedContacts([...selectedContacts, row.id]);
            } else {
              setSelectedContacts(selectedContacts.filter(id => id !== row.id));
            }
          }}
          className="rounded border-brand-border"
        />
      )
    },
    {
      id: "contact",
      header: "Contact",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-brand-foreground">
                {row.firstName} {row.lastName}
              </p>
              {row.tags.includes('hot') && (
                <Star className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <p className="text-sm text-brand-text-light">{row.title}</p>
          </div>
        </div>
      )
    },
    {
      id: "contactInfo",
      header: "Contact Info",
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
      id: "company",
      header: "Company",
      cell: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-text-light" />
            <span className="font-medium text-brand-foreground">{row.company}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-3 h-3 text-brand-text-light" />
            <span className="text-brand-text-light">{row.location}</span>
          </div>
        </div>
      )
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => getStatusBadge(row.status)
    },
    {
      id: "deals",
      header: "Deals",
      cell: (row) => (
        <div className="text-center">
          <p className="font-semibold text-brand-foreground">{row.dealCount}</p>
          <p className="text-xs text-brand-text-light">
            ${(row.totalValue / 1000).toFixed(0)}K
          </p>
        </div>
      )
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
    { label: "Change Status", icon: Star },
    { label: "Send Email", icon: Mail },
    { label: "Export Selected", icon: Download },
    { label: "Delete", icon: MoreHorizontal, variant: "destructive" }
  ];

  const savedViews = [
    { name: "All Contacts", count: 156, active: true },
    { name: "Active", count: 142, active: false },
    { name: "Decision Makers", count: 23, active: false },
    { name: "This Week", count: 45, active: false },
    { name: "Unassigned", count: 12, active: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand-foreground">Contacts</h2>
          <p className="text-brand-text-light">Manage your contact database</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
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
              placeholder="Search contacts..."
              className="pl-10 pr-4 py-2 bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary text-sm"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {selectedContacts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-brand-text-light">
              {selectedContacts.length} selected
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
          data={contacts}
          columns={columns}
          showPagination={true}
          pageSize={10}
          className="min-h-[500px]"
        />
      </div>
    </div>
  );
}
