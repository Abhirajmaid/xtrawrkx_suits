"use client";

import { useState } from "react";
import { PageHeader } from "../../components/layout";
import ClientListToolbar from "../../components/clients/ClientListToolbar";
import ClientTable from "../../components/clients/ClientTable";
import ClientGrid from "../../components/clients/ClientGrid";
import { NewClientModal, ClientFilterModal } from "../../components/clients/modals";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    industry: "all",
    status: "all",
    owner: "all",
  });
  const [selectedClients, setSelectedClients] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // table, grid, kanban
  
  // Modal states
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Modal handlers
  const handleNewClient = (newClient) => {
    console.log("Adding new client:", newClient);
    setIsNewClientModalOpen(false);
  };

  const handleApplyFilters = (filters) => {
    setSelectedFilters(filters);
    setIsFilterModalOpen(false);
  };

  // Mock data - replace with actual API calls
  const clients = [
    {
      id: 1,
      name: "TechCorp Inc.",
      industry: "Technology",
      logo: null,
      primaryContact: "Sarah Johnson",
      owner: "John Smith",
      status: "active",
      website: "https://techcorp.com",
      email: "info@techcorp.com",
      phone: "+1 (555) 123-4567",
      address: {
        city: "San Francisco",
        state: "CA",
        country: "USA"
      },
      tags: ["enterprise", "vip", "technology"],
      lastActivity: "2024-01-15",
      createdAt: "2024-01-10",
      linkedProjectsCount: 2,
      linkedDealsCount: 3,
      linkedContactsCount: 5,
      totalDealValue: 125000,
      engagementScore: 85,
    },
    {
      id: 2,
      name: "StartupXYZ",
      industry: "SaaS",
      logo: null,
      primaryContact: "Michael Chen",
      owner: "Jane Doe",
      status: "prospect",
      website: "https://startupxyz.com",
      email: "hello@startupxyz.com",
      phone: "+1 (555) 987-6543",
      address: {
        city: "Austin",
        state: "TX",
        country: "USA"
      },
      tags: ["startup", "saas", "growth"],
      lastActivity: "2024-01-14",
      createdAt: "2024-01-08",
      linkedProjectsCount: 1,
      linkedDealsCount: 2,
      linkedContactsCount: 3,
      totalDealValue: 50000,
      engagementScore: 72,
    },
    {
      id: 3,
      name: "Global Solutions",
      industry: "Consulting",
      logo: null,
      primaryContact: "Emily Rodriguez",
      owner: "John Smith",
      status: "active",
      website: "https://globalsolutions.com",
      email: "contact@globalsolutions.com",
      phone: "+1 (555) 456-7890",
      address: {
        city: "New York",
        state: "NY",
        country: "USA"
      },
      tags: ["enterprise", "consulting", "high-value"],
      lastActivity: "2024-01-15",
      createdAt: "2024-01-05",
      linkedProjectsCount: 3,
      linkedDealsCount: 4,
      linkedContactsCount: 8,
      totalDealValue: 200000,
      engagementScore: 94,
    },
    {
      id: 4,
      name: "InnovateLab",
      industry: "Research & Development",
      logo: null,
      primaryContact: "David Kim",
      owner: "Jane Doe",
      status: "on-hold",
      website: "https://innovatelab.com",
      email: "info@innovatelab.com",
      phone: "+1 (555) 321-0987",
      address: {
        city: "Seattle",
        state: "WA",
        country: "USA"
      },
      tags: ["research", "innovation", "mid-market"],
      lastActivity: "2024-01-02",
      createdAt: "2023-12-28",
      linkedProjectsCount: 1,
      linkedDealsCount: 1,
      linkedContactsCount: 2,
      totalDealValue: 25000,
      engagementScore: 45,
    },
    {
      id: 5,
      name: "GrowthCo",
      industry: "Marketing",
      logo: null,
      primaryContact: "Lisa Thompson",
      owner: "John Smith",
      status: "active",
      website: "https://growthco.com",
      email: "hello@growthco.com",
      phone: "+1 (555) 654-3210",
      address: {
        city: "Los Angeles",
        state: "CA",
        country: "USA"
      },
      tags: ["marketing", "enterprise", "priority"],
      lastActivity: "2024-01-15",
      createdAt: "2024-01-12",
      linkedProjectsCount: 2,
      linkedDealsCount: 2,
      linkedContactsCount: 4,
      totalDealValue: 75000,
      engagementScore: 98,
    },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleBulkAction = (action, clientIds) => {
    console.log(`Bulk action: ${action}`, clientIds);
    // Implement bulk actions
  };

  const handleClientSelect = (clientId, isSelected) => {
    if (isSelected) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedClients(clients.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Clients"
        subtitle="Manage all your client accounts and relationships"
        breadcrumbs={['Dashboard', 'Clients']}
        actions={['filter', 'new']}
        searchPlaceholder="Search clients..."
        onSearch={setSearchQuery}
        onFilter={() => setIsFilterModalOpen(true)}
        onNew={() => setIsNewClientModalOpen(true)}
      />

      {/* Toolbar */}
      <ClientListToolbar
        searchQuery={searchQuery}
        onSearch={handleSearch}
        filters={selectedFilters}
        onFilterChange={handleFilterChange}
        selectedCount={selectedClients.length}
        totalCount={clients.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onBulkAction={handleBulkAction}
        selectedClients={selectedClients}
      />

      {/* Clients View */}
      {viewMode === "table" ? (
        <ClientTable
          clients={clients}
          selectedClients={selectedClients}
          onClientSelect={handleClientSelect}
          onSelectAll={handleSelectAll}
          searchQuery={searchQuery}
          filters={selectedFilters}
        />
      ) : (
        <ClientGrid
          clients={clients}
          selectedClients={selectedClients}
          onClientSelect={handleClientSelect}
          searchQuery={searchQuery}
          filters={selectedFilters}
        />
      )}

      {/* Modals */}
      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onAddClient={handleNewClient}
      />

      <ClientFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        filters={selectedFilters}
        setFilters={setSelectedFilters}
      />
    </div>
  );
}

