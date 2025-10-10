"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "../../../../../../../../../components/ui";
import ContactTabs from "../../../components/contacts/ContactTabs";
import ContactOverview from "../../../components/contacts/ContactOverview";
import ContactTimeline from "../../../components/contacts/ContactTimeline";
import ContactDeals from "../../../components/contacts/ContactDeals";
import ContactProjects from "../../../components/contacts/ContactProjects";
import ContactDocuments from "../../../components/contacts/ContactDocuments";
import QuickActionBar from "../../../components/contacts/QuickActionBar";
import { 
  SendEmailModal, 
  LogCallModal, 
  ScheduleMeetingModal, 
  AddNoteModal,
  DuplicateContactModal,
  ShareContactModal
} from "../../../components/contacts/modals";
import { 
  UploadDocumentModal,
  CreateDealModal,
  CreateProjectModal
} from "../../../components/clients/modals";

export default function ContactDetailPage() {
  const params = useParams();
  const contactId = params.id;
  const [activeTab, setActiveTab] = useState("overview");
  
  // Modal states
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
  const [isLogCallModalOpen, setIsLogCallModalOpen] = useState(false);
  const [isScheduleMeetingModalOpen, setIsScheduleMeetingModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isUploadDocumentModalOpen, setIsUploadDocumentModalOpen] = useState(false);
  const [isCreateDealModalOpen, setIsCreateDealModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isDuplicateContactModalOpen, setIsDuplicateContactModalOpen] = useState(false);
  const [isShareContactModalOpen, setIsShareContactModalOpen] = useState(false);

  // Mock contact data - replace with actual API call
  const contact = {
    id: contactId,
    name: "Sarah Johnson",
    jobTitle: "Marketing Director",
    company: "TechCorp Inc.",
    email: "sarah.johnson@techcorp.com",
    phone: "+1 (555) 123-4567",
    website: "https://techcorp.com",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    twitter: "@sarahjohnson",
    status: "active",
    owner: "John Smith",
    tags: ["hot-lead", "enterprise"],
    leadSource: "website",
    engagementScore: 85,
    decisionRole: "decision-maker",
    lastActivity: "2024-01-15",
    createdAt: "2024-01-10",
    avatar: null,
    birthday: "1985-03-15",
    region: "North America",
    notes: "Highly interested in our enterprise solution. Prefers email communication.",
    // Additional fields
    address: {
      street: "123 Business Ave",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "USA"
    },
    socialProfiles: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "@sarahjohnson",
      facebook: null,
      instagram: null
    },
    customFields: {
      industry: "Technology",
      companySize: "500-1000",
      annualRevenue: "$10M-$50M",
      preferredContactMethod: "Email"
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "timeline", label: "Timeline", icon: "⏰" },
    { id: "deals", label: "Deals", icon: "💼" },
    { id: "projects", label: "Projects", icon: "📁" },
    { id: "documents", label: "Documents", icon: "📄" },
    { id: "emails", label: "Emails", icon: "📧" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ContactOverview contact={contact} />;
      case "timeline":
        return <ContactTimeline contactId={contactId} />;
      case "deals":
        return <ContactDeals contactId={contactId} />;
      case "projects":
        return <ContactProjects contactId={contactId} />;
      case "documents":
        return <ContactDocuments contactId={contactId} />;
      case "emails":
        return (
          <div className="p-6 text-center text-gray-500">
            Email integration coming soon...
          </div>
        );
      default:
        return <ContactOverview contact={contact} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={contact.name}
        subtitle="View and manage this contact's details and activity"
        breadcrumbs={['Dashboard', 'Contacts', contact.name]}
        actions={['filter', 'new']}
        searchPlaceholder="Search within contact..."
        onSearch={(query) => console.log('Search within contact:', query)}
        onFilter={() => console.log('Filter contact data')}
        onNew={() => console.log('Add new item for contact')}
      />

      {/* Quick Action Bar */}
      <QuickActionBar 
        contactId={contactId}
        onSendEmail={() => setIsSendEmailModalOpen(true)}
        onLogCall={() => setIsLogCallModalOpen(true)}
        onScheduleMeeting={() => setIsScheduleMeetingModalOpen(true)}
        onAddNote={() => setIsAddNoteModalOpen(true)}
        onUploadDocument={() => setIsUploadDocumentModalOpen(true)}
        onCreateDeal={() => setIsCreateDealModalOpen(true)}
        onCreateProject={() => setIsCreateProjectModalOpen(true)}
        onDuplicateContact={() => setIsDuplicateContactModalOpen(true)}
        onStarContact={() => {
          // Simple function to toggle star status
          console.log('Toggling star status for contact:', contactId);
          // TODO: Implement actual star toggle logic
        }}
        onShareContact={() => setIsShareContactModalOpen(true)}
      />

      {/* Contact Tabs */}
      <div className="bg-white rounded-xl shadow-card border border-brand-border/50">
        <ContactTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Tab Content */}
        <div className="border-t border-brand-border/50">
          {renderTabContent()}
        </div>
      </div>

      {/* Modals */}
      <SendEmailModal
        isOpen={isSendEmailModalOpen}
        onClose={() => setIsSendEmailModalOpen(false)}
        contact={contact}
      />

      <LogCallModal
        isOpen={isLogCallModalOpen}
        onClose={() => setIsLogCallModalOpen(false)}
        contact={contact}
      />

      <ScheduleMeetingModal
        isOpen={isScheduleMeetingModalOpen}
        onClose={() => setIsScheduleMeetingModalOpen(false)}
        contact={contact}
      />

      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        contact={contact}
      />

      <UploadDocumentModal
        isOpen={isUploadDocumentModalOpen}
        onClose={() => setIsUploadDocumentModalOpen(false)}
        client={contact}
      />

      <CreateDealModal
        isOpen={isCreateDealModalOpen}
        onClose={() => setIsCreateDealModalOpen(false)}
        client={contact}
      />

      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        client={contact}
      />

      <DuplicateContactModal
        isOpen={isDuplicateContactModalOpen}
        onClose={() => setIsDuplicateContactModalOpen(false)}
        contact={contact}
      />

      <ShareContactModal
        isOpen={isShareContactModalOpen}
        onClose={() => setIsShareContactModalOpen(false)}
        contact={contact}
      />
    </div>
  );
}
