"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  Button,
  Input,
  Select,
  Textarea,
  Badge,
} from "../../../../components/ui";
import PageHeader from "../../../../components/PageHeader";
import dealService from "../../../../lib/api/dealService";
import leadCompanyService from "../../../../lib/api/leadCompanyService";
import clientAccountService from "../../../../lib/api/clientAccountService";
import contactService from "../../../../lib/api/contactService";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  Target,
  Building2,
  User,
  IndianRupee,
  Calendar,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  FileText,
} from "lucide-react";

export default function NewDealPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Deal data
  const [dealData, setDealData] = useState({
    name: "",
    description: "",
    value: "",
    stage: "DISCOVERY",
    priority: "MEDIUM",
    probability: "25",
    closeDate: "",
    leadCompany: "",
    clientAccount: "",
    contact: "",
    notes: "",
  });

  // Dropdown options
  const [leadCompanies, setLeadCompanies] = useState([]);
  const [clientAccounts, setClientAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const stageOptions = [
    { value: "DISCOVERY", label: "Discovery" },
    { value: "PROPOSAL", label: "Proposal" },
    { value: "NEGOTIATION", label: "Negotiation" },
    { value: "CLOSED_WON", label: "Won" },
    { value: "CLOSED_LOST", label: "Lost" },
  ];

  const priorityOptions = [
    { value: "HIGH", label: "High" },
    { value: "MEDIUM", label: "Medium" },
    { value: "LOW", label: "Low" },
  ];

  // Fetch dropdown options on component mount and handle pre-selected lead company or client account
  useEffect(() => {
    fetchDropdownOptions();

    // Check if lead company is pre-selected from URL
    const preSelectedLeadCompany = searchParams.get("leadCompany");
    if (preSelectedLeadCompany) {
      setDealData((prev) => ({
        ...prev,
        leadCompany: preSelectedLeadCompany,
      }));
      // Fetch contacts for the pre-selected lead company
      fetchContactsByLeadCompany(preSelectedLeadCompany);
    }

    // Check if client account is pre-selected from URL
    const preSelectedClientAccount = searchParams.get("clientAccount");
    if (preSelectedClientAccount) {
      setDealData((prev) => ({
        ...prev,
        clientAccount: preSelectedClientAccount,
      }));
      // Fetch contacts for the pre-selected client account
      fetchContactsByClientAccount(preSelectedClientAccount);
    }
  }, [searchParams]);

  // Fetch contacts when lead company or client account changes
  useEffect(() => {
    if (dealData.leadCompany) {
      fetchContactsByLeadCompany(dealData.leadCompany);
      // Clear selected contact when lead company changes
      setDealData((prev) => ({
        ...prev,
        contact: "",
      }));
    } else if (dealData.clientAccount) {
      fetchContactsByClientAccount(dealData.clientAccount);
      // Clear selected contact when client account changes
      setDealData((prev) => ({
        ...prev,
        contact: "",
      }));
    } else {
      // If no company is selected, clear contacts
      setContacts([]);
      setFilteredContacts([]);
    }
  }, [dealData.leadCompany, dealData.clientAccount]);

  const fetchContactsByClientAccount = async (clientAccountId) => {
    try {
      setLoadingContacts(true);
      console.log("Fetching contacts for client account:", clientAccountId);

      const contactsResponse = await contactService.getByClientAccount(
        clientAccountId,
        {
          sort: ["firstName:asc"],
        }
      );
      console.log("Contacts response for client account:", contactsResponse);

      const contactsData = contactsResponse?.data || [];
      setFilteredContacts(contactsData);
      setContacts(contactsData);
    } catch (error) {
      console.error("Error fetching contacts for client account:", error);
      setContacts([]);
      setFilteredContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      console.log("Fetching dropdown options...");

      // Fetch lead companies
      const leadCompaniesResponse = await leadCompanyService.getAll({
        pagination: { pageSize: 1000 },
        sort: ["companyName:asc"],
      });
      console.log("Lead companies response:", leadCompaniesResponse);

      const leadCompaniesData = leadCompaniesResponse?.data || [];
      setLeadCompanies(leadCompaniesData);
      console.log("Set lead companies:", leadCompaniesData);

      // Fetch client accounts
      const clientAccountsResponse = await clientAccountService.getAll({
        pagination: { pageSize: 1000 },
        sort: ["companyName:asc"],
      });
      console.log("Client accounts response:", clientAccountsResponse);

      const clientAccountsData = clientAccountsResponse?.data || [];
      setClientAccounts(clientAccountsData);
      console.log("Set client accounts:", clientAccountsData);
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
      setErrors({
        general: "Failed to load dropdown options. Please refresh the page.",
      });
    }
  };

  const fetchContactsByLeadCompany = async (leadCompanyId) => {
    try {
      console.log("Fetching contacts for lead company:", leadCompanyId);

      const contactsResponse = await contactService.getByLeadCompany(
        leadCompanyId,
        {
          sort: ["firstName:asc"],
        }
      );
      console.log("Contacts response for lead company:", contactsResponse);

      const contactsData = contactsResponse?.data || [];
      setContacts(contactsData);
      console.log("Set contacts for lead company:", contactsData);
    } catch (error) {
      console.error("Error fetching contacts for lead company:", error);
      setContacts([]);
    }
  };

  const handleInputChange = (field, value) => {
    setDealData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Clear the other company field when one is selected
      if (field === "leadCompany" && value) {
        updated.clientAccount = "";
      } else if (field === "clientAccount" && value) {
        updated.leadCompany = "";
      }

      // Clear contact when company changes
      if (field === "leadCompany" || field === "clientAccount") {
        updated.contact = "";
      }

      return updated;
    });

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!dealData.name.trim()) {
      newErrors.name = "Deal name is required";
    }
    if (
      !dealData.value ||
      isNaN(dealData.value) ||
      parseFloat(dealData.value) <= 0
    ) {
      newErrors.value = "Valid deal value is required";
    }
    if (!dealData.closeDate) {
      newErrors.closeDate = "Expected close date is required";
    }
    if (!dealData.leadCompany) {
      newErrors.leadCompany = "Lead company is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare deal data
      const dealPayload = {
        name: dealData.name,
        description: dealData.description,
        value: parseFloat(dealData.value),
        stage: dealData.stage,
        priority: dealData.priority,
        probability: parseInt(dealData.probability),
        closeDate: dealData.closeDate,
        notes: dealData.notes,
        // Convert string IDs to numbers for relations
        leadCompany: dealData.leadCompany
          ? parseInt(dealData.leadCompany)
          : null,
        clientAccount: dealData.clientAccount
          ? parseInt(dealData.clientAccount)
          : null,
        contact: dealData.contact ? parseInt(dealData.contact) : null,
        // Auto-assign to current user
        assignedTo: user?.id || user?.documentId || null,
      };

      console.log("Creating deal with data:", dealPayload);

      // Create the deal using the dealService
      const response = await dealService.create(dealPayload);
      console.log("Deal created successfully:", response);

      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/sales/deals/${response.id}`);
      }, 2000);
    } catch (error) {
      console.error("Error creating deal:", error);
      setErrors({ submit: "Failed to create deal. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600 mb-4">Deal created successfully</p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">
            Redirecting to deal details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 space-y-6">
        <PageHeader
          title="Add New Deal"
          subtitle="Create a new deal and add it to your sales pipeline"
          breadcrumb={[
            { label: "Dashboard", href: "/" },
            { label: "Sales", href: "/sales" },
            { label: "Deals", href: "/sales/deals" },
            { label: "Add New", href: "/sales/deals/new" },
          ]}
          showProfile={true}
          showSearch={false}
          showActions={false}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Deal Information
                </h3>
                <p className="text-sm text-gray-600">
                  Basic details about the deal opportunity
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Input
                  label="Deal Name *"
                  value={dealData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={errors.name}
                  placeholder="Enter deal name"
                />
              </div>
              <div>
                <Select
                  label="Stage"
                  value={dealData.stage}
                  onChange={(value) => handleInputChange("stage", value)}
                  options={stageOptions}
                  placeholder="Select stage"
                />
              </div>

              <div>
                <Input
                  label="Deal Value *"
                  type="number"
                  value={dealData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  error={errors.value}
                  placeholder="0"
                  icon={IndianRupee}
                />
              </div>
              <div>
                <Input
                  label="Expected Close Date *"
                  type="date"
                  value={dealData.closeDate}
                  onChange={(e) =>
                    handleInputChange("closeDate", e.target.value)
                  }
                  error={errors.closeDate}
                  icon={Calendar}
                />
              </div>
              <div>
                <Select
                  label="Priority"
                  value={dealData.priority}
                  onChange={(value) => handleInputChange("priority", value)}
                  options={priorityOptions}
                  placeholder="Select priority"
                />
              </div>

              <div className="lg:col-span-3">
                <Textarea
                  label="Description"
                  value={dealData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the deal opportunity..."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Sales Information */}
          <Card className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Sales Information
                </h3>
                <p className="text-sm text-gray-600">
                  Sales metrics and probability details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Probability (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={dealData.probability}
                  onChange={(e) =>
                    handleInputChange("probability", e.target.value)
                  }
                  placeholder="25"
                />
              </div>
            </div>
          </Card>

          {/* Company & Contact Information */}
          <Card className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Company & Contact
                </h3>
                <p className="text-sm text-gray-600">
                  Associate deal with a company and contact
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Lead Company"
                  disabled={!!dealData.clientAccount}
                  value={dealData.leadCompany}
                  onChange={(value) => handleInputChange("leadCompany", value)}
                  error={errors.leadCompany}
                  options={leadCompanies.map((company) => ({
                    value: company.id || company.documentId,
                    label:
                      company.companyName ||
                      company.attributes?.companyName ||
                      "Unknown Company",
                  }))}
                  placeholder="Select lead company"
                />
              </div>
              <div>
                <Select
                  label="Client Account"
                  disabled={!!dealData.leadCompany}
                  value={dealData.clientAccount}
                  onChange={(value) =>
                    handleInputChange("clientAccount", value)
                  }
                  error={errors.clientAccount}
                  options={clientAccounts.map((account) => {
                    const accountData = account.attributes || account;
                    return {
                      value: account.id || account.documentId || accountData.id,
                      label:
                        accountData.companyName ||
                        account.companyName ||
                        "Unknown Account",
                    };
                  })}
                  placeholder="Select client account"
                />
                {dealData.leadCompany && (
                  <p className="text-xs text-gray-500 mt-1">
                    Clear Lead Company to select Client Account
                  </p>
                )}
              </div>
            </div>

            {(dealData.leadCompany || dealData.clientAccount) && (
              <div className="mt-6">
                <Select
                  label="Primary Contact"
                  value={dealData.contact}
                  onChange={(value) => handleInputChange("contact", value)}
                  options={contacts.map((contact) => {
                    const contactData = contact.attributes || contact;
                    return {
                      value: contact.id || contact.documentId || contactData.id,
                      label:
                        `${contactData.firstName || contact.firstName || ""} ${
                          contactData.lastName || contact.lastName || ""
                        }`.trim() || "Unknown Contact",
                    };
                  })}
                  placeholder={
                    loadingContacts
                      ? "Loading contacts..."
                      : contacts.length === 0
                      ? "No contacts found for this company"
                      : "Select contact"
                  }
                  disabled={
                    (!dealData.leadCompany && !dealData.clientAccount) ||
                    loadingContacts
                  }
                />
              </div>
            )}
          </Card>

          {/* Additional Information */}
          <Card className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Additional Information
                </h3>
                <p className="text-sm text-gray-600">
                  Notes and additional details about the deal
                </p>
              </div>
            </div>

            <div>
              <Textarea
                label="Notes"
                value={dealData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Add any additional notes about this deal..."
                rows={4}
              />
            </div>
          </Card>

          {/* Error Display */}
          {errors.submit && (
            <Card className="rounded-2xl bg-red-50 border border-red-200 p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{errors.submit}</p>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </Button>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                * Required fields
              </Badge>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white flex items-center gap-2 min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Deal
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
