"use client";

import { useState } from "react";
import { PageHeader } from "../../components/layout";
import ContactListToolbar from "../../components/contacts/ContactListToolbar";
import ContactTable from "../../components/contacts/ContactTable";
import ContactGrid from "../../components/contacts/ContactGrid";
import { NewContactModal, ContactFilterModal } from "../../components/contacts/modals";

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: "all",
    owner: "all",
    tags: [],
    leadSource: "all",
  });
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // table, grid, kanban
  
  // Modal states
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Modal handlers
  const handleNewContact = (newContact) => {
    console.log("Adding new contact:", newContact);
    setIsNewContactModalOpen(false);
  };

  const handleApplyFilters = (filters) => {
    setSelectedFilters(filters);
    setIsFilterModalOpen(false);
  };

  // Mock data - replace with actual API calls
  const contacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      jobTitle: "Marketing Director",
      company: "TechCorp Inc.",
      email: "sarah.johnson@techcorp.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      owner: "John Smith",
      tags: ["hot-lead", "enterprise"],
      leadSource: "website",
      engagementScore: 85,
      decisionRole: "decision-maker",
      lastActivity: "2024-01-15",
      createdAt: "2024-01-10",
      avatar: null,
    },
    {
      id: 2,
      name: "Michael Chen",
      jobTitle: "CTO",
      company: "StartupXYZ",
      email: "michael@startupxyz.com",
      phone: "+1 (555) 987-6543",
      status: "prospect",
      owner: "Jane Doe",
      tags: ["startup", "technical"],
      leadSource: "referral",
      engagementScore: 72,
      decisionRole: "decision-maker",
      lastActivity: "2024-01-14",
      createdAt: "2024-01-08",
      avatar: null,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      jobTitle: "VP of Sales",
      company: "Global Solutions",
      email: "emily.rodriguez@globalsolutions.com",
      phone: "+1 (555) 456-7890",
      status: "active",
      owner: "John Smith",
      tags: ["enterprise", "high-value"],
      leadSource: "linkedin",
      engagementScore: 94,
      decisionRole: "influencer",
      lastActivity: "2024-01-15",
      createdAt: "2024-01-05",
      avatar: null,
    },
    {
      id: 4,
      name: "David Kim",
      jobTitle: "Product Manager",
      company: "InnovateLab",
      email: "david.kim@innovatelab.com",
      phone: "+1 (555) 321-0987",
      status: "inactive",
      owner: "Jane Doe",
      tags: ["product", "mid-market"],
      leadSource: "email-campaign",
      engagementScore: 45,
      decisionRole: "other",
      lastActivity: "2024-01-02",
      createdAt: "2023-12-28",
      avatar: null,
    },
    {
      id: 5,
      name: "Lisa Thompson",
      jobTitle: "CEO",
      company: "GrowthCo",
      email: "lisa@growthco.com",
      phone: "+1 (555) 654-3210",
      status: "active",
      owner: "John Smith",
      tags: ["ceo", "enterprise", "priority"],
      leadSource: "conference",
      engagementScore: 98,
      decisionRole: "decision-maker",
      lastActivity: "2024-01-15",
      createdAt: "2024-01-12",
      avatar: null,
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

  const handleBulkAction = (action, contactIds) => {
    console.log(`Bulk action: ${action}`, contactIds);
    // Implement bulk actions
  };

  const handleContactSelect = (contactId, isSelected) => {
    if (isSelected) {
      setSelectedContacts(prev => [...prev, contactId]);
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedContacts(contacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Contacts"
        subtitle="Manage all your contact information in one place"
        breadcrumbs={['Dashboard', 'Contacts']}
        actions={['new']}
        searchPlaceholder="Search contacts..."
        onSearch={setSearchQuery}
        onNew={() => setIsNewContactModalOpen(true)}
      />

      {/* Toolbar */}
      <ContactListToolbar
        searchQuery={searchQuery}
        onSearch={handleSearch}
        filters={selectedFilters}
        onFilterChange={handleFilterChange}
        selectedCount={selectedContacts.length}
        totalCount={contacts.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onBulkAction={handleBulkAction}
        selectedContacts={selectedContacts}
      />

      {/* Contacts View */}
      {viewMode === "table" ? (
        <ContactTable
          contacts={contacts}
          selectedContacts={selectedContacts}
          onContactSelect={handleContactSelect}
          onSelectAll={handleSelectAll}
          searchQuery={searchQuery}
          filters={selectedFilters}
        />
      ) : (
        <ContactGrid
          contacts={contacts}
          selectedContacts={selectedContacts}
          onContactSelect={handleContactSelect}
          searchQuery={searchQuery}
          filters={selectedFilters}
        />
      )}

      {/* Modals */}
      <NewContactModal
        isOpen={isNewContactModalOpen}
        onClose={() => setIsNewContactModalOpen(false)}
        onAddContact={handleNewContact}
      />

      <ContactFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        filters={selectedFilters}
        setFilters={setSelectedFilters}
      />
    </div>
  );
}
