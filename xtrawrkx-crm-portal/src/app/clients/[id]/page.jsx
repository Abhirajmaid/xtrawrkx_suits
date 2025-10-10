"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "../../../components/layout";
import ClientTabs from "../../../components/clients/ClientTabs";
import ClientOverview from "../../../components/clients/ClientOverview";
import ClientTimeline from "../../../components/clients/ClientTimeline";
import ClientContacts from "../../../components/clients/ClientContacts";
import ClientDeals from "../../../components/clients/ClientDeals";
import ClientProjects from "../../../components/clients/ClientProjects";
import ClientDocuments from "../../../components/clients/ClientDocuments";
import ClientInvoices from "../../../components/clients/ClientInvoices";
import QuickActionBar from "../../../components/clients/QuickActionBar";

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id;
  const [activeTab, setActiveTab] = useState("overview");

  // Mock client data - replace with actual API call
  const client = {
    id: clientId,
    name: "TechCorp Inc.",
    industry: "Technology",
    logo: null,
    website: "https://techcorp.com",
    email: "info@techcorp.com",
    phone: "+1 (555) 123-4567",
    linkedin: "https://linkedin.com/company/techcorp",
    twitter: "@techcorp",
    status: "active",
    owner: "John Smith",
    tags: ["enterprise", "vip", "technology"],
    lastActivity: "2024-01-15",
    createdAt: "2024-01-10",
    engagementScore: 85,
    address: {
      street: "123 Business Ave",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "USA"
    },
    socialProfiles: {
      linkedin: "https://linkedin.com/company/techcorp",
      twitter: "@techcorp",
      facebook: null,
      instagram: null
    },
    customFields: {
      companySize: "500-1000",
      annualRevenue: "$10M-$50M",
      foundedYear: "2015",
      preferredContactMethod: "Email"
    },
    // Additional client-specific data
    primaryContact: "Sarah Johnson",
    linkedProjectsCount: 2,
    linkedDealsCount: 3,
    linkedContactsCount: 5,
    totalDealValue: 125000,
    outstandingInvoices: 2,
    totalInvoiceValue: 45000,
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "timeline", label: "Timeline", icon: "⏰" },
    { id: "contacts", label: "Contacts", icon: "👥" },
    { id: "deals", label: "Deals", icon: "💼" },
    { id: "projects", label: "Projects", icon: "📁" },
    { id: "documents", label: "Documents", icon: "📄" },
    { id: "invoices", label: "Invoices", icon: "💰" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ClientOverview client={client} />;
      case "timeline":
        return <ClientTimeline clientId={clientId} />;
      case "contacts":
        return <ClientContacts clientId={clientId} />;
      case "deals":
        return <ClientDeals clientId={clientId} />;
      case "projects":
        return <ClientProjects clientId={clientId} />;
      case "documents":
        return <ClientDocuments clientId={clientId} />;
      case "invoices":
        return <ClientInvoices clientId={clientId} />;
      default:
        return <ClientOverview client={client} />;
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={client.name}
        subtitle="View and manage this client's details and history"
        breadcrumbs={['Dashboard', 'Clients', client.name]}
        actions={['filter', 'new']}
        searchPlaceholder="Search within client..."
        onSearch={(query) => console.log('Search within client:', query)}
        onFilter={() => console.log('Filter client data')}
        onNew={() => console.log('Add new item for client')}
      />

      {/* Quick Action Bar */}
      <QuickActionBar clientId={clientId} />

      {/* Client Tabs */}
      <div className="bg-white rounded-xl shadow-card border border-brand-border/50">
        <ClientTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Tab Content */}
        <div className="border-t border-brand-border/50">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

