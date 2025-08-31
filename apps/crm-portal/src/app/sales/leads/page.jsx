"use client";

import { useState } from "react";
import {
  Container,
  PageHeader,
  Card,
  Table,
  Badge,
  Avatar,
  Button,
  Input,
  Select,
  Modal,
  Tabs,
  EmptyState,
} from "@xtrawrkx/ui";
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  UserPlus,
  Star,
  Clock,
} from "lucide-react";

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState("list");

  const leadColumns = [
    {
      key: "name",
      label: "Lead Name",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.company}</div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Contact",
      render: (value, row) => (
        <div>
          <div className="flex items-center gap-1 text-sm">
            <Mail className="w-3 h-3 text-gray-400" />
            {value}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <Phone className="w-3 h-3 text-gray-400" />
            {row.phone}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => {
        const variants = {
          New: "info",
          Contacted: "warning",
          Qualified: "success",
          Lost: "danger",
          Unqualified: "default",
        };
        return <Badge variant={variants[value] || "default"}>{value}</Badge>;
      },
    },
    {
      key: "source",
      label: "Source",
      render: (value) => <span className="text-sm text-gray-600">{value}</span>,
    },
    {
      key: "value",
      label: "Deal Value",
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">
          ${value.toLocaleString()}
        </span>
      ),
    },
    {
      key: "assignee",
      label: "Assigned To",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Avatar name={value} size="xs" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: "created",
      label: "Created",
      sortable: true,
      render: (value) => (
        <div className="text-sm">
          <div className="text-gray-900">{value}</div>
          <div className="text-gray-500">3 days ago</div>
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

  const leadsData = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "Tech Solutions Inc",
      email: "sarah.j@techsolutions.com",
      phone: "+1 (555) 123-4567",
      status: "New",
      source: "Website",
      value: 45000,
      assignee: "John Smith",
      created: "28 Nov 2024",
      score: 85,
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "Global Enterprises",
      email: "mchen@global.com",
      phone: "+1 (555) 234-5678",
      status: "Contacted",
      source: "LinkedIn",
      value: 75000,
      assignee: "Emily Davis",
      created: "27 Nov 2024",
      score: 72,
    },
    {
      id: 3,
      name: "Jennifer Williams",
      company: "StartUp Hub",
      email: "jwilliams@startup.com",
      phone: "+1 (555) 345-6789",
      status: "Qualified",
      source: "Referral",
      value: 120000,
      assignee: "John Smith",
      created: "26 Nov 2024",
      score: 95,
    },
    {
      id: 4,
      name: "Robert Martinez",
      company: "Innovation Labs",
      email: "rmartinez@innovate.com",
      phone: "+1 (555) 456-7890",
      status: "New",
      source: "Email Campaign",
      value: 55000,
      assignee: "Sarah Wilson",
      created: "25 Nov 2024",
      score: 60,
    },
    {
      id: 5,
      name: "Lisa Anderson",
      company: "Digital Marketing Pro",
      email: "landerson@dmp.com",
      phone: "+1 (555) 567-8901",
      status: "Contacted",
      source: "Trade Show",
      value: 85000,
      assignee: "Emily Davis",
      created: "24 Nov 2024",
      score: 78,
    },
  ];

  const statusStats = [
    { label: "New", count: 23, color: "bg-blue-500" },
    { label: "Contacted", count: 45, color: "bg-yellow-500" },
    { label: "Qualified", count: 18, color: "bg-green-500" },
    { label: "Lost", count: 12, color: "bg-red-500" },
  ];

  const headerActions = (
    <div className="flex items-center gap-3">
      <Input
        icon={Search}
        placeholder="Search leads..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-64"
      />
      <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <Filter className="w-4 h-4" />
        Filter
      </button>
      <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <Upload className="w-4 h-4" />
        Import
      </button>
      <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <Download className="w-4 h-4" />
        Export
      </button>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Lead
      </button>
    </div>
  );

  const tabItems = [
    { key: "all", label: "All Leads", badge: "98" },
    { key: "new", label: "New", badge: "23" },
    { key: "contacted", label: "Contacted", badge: "45" },
    { key: "qualified", label: "Qualified", badge: "18" },
    { key: "lost", label: "Lost", badge: "12" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Leads Management"
        subtitle="Track and manage your sales leads"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Sales" },
          { label: "Leads" },
        ]}
        actions={headerActions}
      />

      <Container className="py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {statusStats.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label} Leads</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.count}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg opacity-20`}
                ></div>
              </div>
            </Card>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <Tabs tabs={tabItems} defaultTab="all" variant="pills" />
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView("list")}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                activeView === "list"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setActiveView("board")}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                activeView === "board"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Board View
            </button>
          </div>
        </div>

        {/* Leads Table/Board */}
        {activeView === "list" ? (
          <Card>
            <Table
              columns={leadColumns}
              data={leadsData}
              selectable
              selectedRows={selectedLeads}
              onSelectRow={(id, selected) => {
                if (selected) {
                  setSelectedLeads([...selectedLeads, id]);
                } else {
                  setSelectedLeads(selectedLeads.filter((item) => item !== id));
                }
              }}
              onSelectAll={(selected) => {
                if (selected) {
                  setSelectedLeads(leadsData.map((lead) => lead.id));
                } else {
                  setSelectedLeads([]);
                }
              }}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["New", "Contacted", "Qualified", "Lost"].map((status) => (
              <div key={status} className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{status}</h3>
                  <Badge variant="default">
                    {leadsData.filter((l) => l.status === status).length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {leadsData
                    .filter((lead) => lead.status === status)
                    .map((lead) => (
                      <Card
                        key={lead.id}
                        className="p-3 cursor-pointer hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Avatar name={lead.name} size="sm" />
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-3 h-3" />
                          </button>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          {lead.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2">
                          {lead.company}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            ${lead.value.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600">
                              {lead.score}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Lead Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Lead"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Enter first name"
                required
              />
              <Input label="Last Name" placeholder="Enter last name" required />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="Enter email address"
              required
            />
            <Input label="Phone" type="tel" placeholder="Enter phone number" />
            <Input label="Company" placeholder="Enter company name" />
            <Select
              label="Lead Source"
              options={[
                { value: "website", label: "Website" },
                { value: "linkedin", label: "LinkedIn" },
                { value: "referral", label: "Referral" },
                { value: "email", label: "Email Campaign" },
                { value: "tradeshow", label: "Trade Show" },
              ]}
            />
            <Select
              label="Assign To"
              options={[
                { value: "john", label: "John Smith" },
                { value: "emily", label: "Emily Davis" },
                { value: "sarah", label: "Sarah Wilson" },
              ]}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                Add Lead
              </button>
            </div>
          </div>
        </Modal>
      </Container>
    </div>
  );
}
