"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  Input,
  Select,
  Textarea,
  Badge,
} from "../../../../components/ui";
import PageHeader from "../../../../components/PageHeader";
import leadCompanyService from "../../../../lib/api/leadCompanyService";
import contactService from "../../../../lib/api/contactService";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function AddLeadCompanyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Company data
  const [companyData, setCompanyData] = useState({
    companyName: "",
    industry: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    employees: "",
    founded: "",
    description: "",
    linkedIn: "",
    twitter: "",
    leadSource: "WEBSITE",
    status: "NEW",
    dealValue: "",
    notes: "",
  });

  // Contacts data - array of contacts
  const [contacts, setContacts] = useState([
    {
      id: 1,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      department: "",
      role: "PRIMARY_CONTACT",
      isPrimary: true,
    },
  ]);

  const industryOptions = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail" },
    { value: "education", label: "Education" },
    { value: "real-estate", label: "Real Estate" },
    { value: "consulting", label: "Consulting" },
    { value: "other", label: "Other" },
  ];

  const leadSourceOptions = [
    { value: "WEBSITE", label: "Website" },
    { value: "REFERRAL", label: "Referral" },
    { value: "SOCIAL_MEDIA", label: "Social Media" },
    { value: "EMAIL_CAMPAIGN", label: "Email Campaign" },
    { value: "COLD_CALL", label: "Cold Call" },
    { value: "TRADE_SHOW", label: "Trade Show" },
    { value: "PARTNER", label: "Partner" },
    { value: "OTHER", label: "Other" },
  ];

  const statusOptions = [
    { value: "NEW", label: "New" },
    { value: "CONTACTED", label: "Contacted" },
    { value: "QUALIFIED", label: "Qualified" },
    { value: "PROPOSAL_SENT", label: "Proposal Sent" },
  ];

  const contactRoleOptions = [
    { value: "DECISION_MAKER", label: "Decision Maker" },
    { value: "INFLUENCER", label: "Influencer" },
    { value: "CONTACT", label: "Contact" },
    { value: "GATEKEEPER", label: "Gatekeeper" },
  ];

  const employeeSizeOptions = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "501-1000", label: "501-1000 employees" },
    { value: "1000+", label: "1000+ employees" },
  ];

  const handleCompanyChange = (field, value) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleContactChange = (contactId, field, value) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId ? { ...contact, [field]: value } : contact
      )
    );
    // Clear error when user starts typing
    const errorKey = `contact_${contactId}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: null }));
    }
  };

  const addContact = () => {
    const newId = Math.max(...contacts.map((c) => c.id)) + 1;
    setContacts((prev) => [
      ...prev,
      {
        id: newId,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        title: "",
        department: "",
        role: "CONTACT",
        isPrimary: false,
      },
    ]);
  };

  const removeContact = (contactId) => {
    if (contacts.length > 1) {
      setContacts((prev) => prev.filter((contact) => contact.id !== contactId));
    }
  };

  const setPrimaryContact = (contactId) => {
    setContacts((prev) =>
      prev.map((contact) => ({
        ...contact,
        isPrimary: contact.id === contactId,
      }))
    );
  };

  const validateForm = () => {
    const newErrors = {};

    // Company validation
    if (!companyData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!companyData.industry) {
      newErrors.industry = "Industry is required";
    }
    if (!companyData.email.trim()) {
      newErrors.email = "Company email is required";
    } else if (!/\S+@\S+\.\S+/.test(companyData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Contact validation
    contacts.forEach((contact) => {
      if (!contact.firstName.trim()) {
        newErrors[`contact_${contact.id}_firstName`] = "First name is required";
      }
      if (!contact.lastName.trim()) {
        newErrors[`contact_${contact.id}_lastName`] = "Last name is required";
      }
      if (!contact.email.trim()) {
        newErrors[`contact_${contact.id}_email`] = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(contact.email)) {
        newErrors[`contact_${contact.id}_email`] = "Please enter a valid email";
      }
    });

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
      // Prepare lead company data
      const leadCompanyPayload = {
        companyName: companyData.companyName,
        industry: companyData.industry,
        website: companyData.website,
        phone: companyData.phone,
        email: companyData.email,
        address: companyData.address,
        city: companyData.city,
        state: companyData.state,
        country: companyData.country,
        zipCode: companyData.zipCode,
        employees: companyData.employees,
        founded: companyData.founded,
        description: companyData.description,
        linkedIn: companyData.linkedIn,
        twitter: companyData.twitter,
        leadSource: companyData.leadSource,
        status: companyData.status,
        dealValue: companyData.dealValue
          ? parseFloat(companyData.dealValue)
          : 0,
        notes: companyData.notes,
        leadScore: Math.floor(Math.random() * 100) + 1, // Random for now
        healthScore: Math.floor(Math.random() * 100) + 1, // Random for now
        segment: "WARM", // Default segment
        // Auto-assign to creator
        assignedTo: user?.id || user?.documentId || null,
      };

      console.log("Creating lead company with data:", leadCompanyPayload);

      // Create the lead company
      const createdCompany = await leadCompanyService.create(
        leadCompanyPayload
      );

      console.log("Created lead company:", createdCompany);

      // Create contacts associated with the lead company
      if (contacts.length > 0) {
        console.log("Creating contacts for lead company:", contacts);
        console.log("Created company ID:", createdCompany.id);

        // Filter out empty contacts (contacts with no first name or last name)
        const validContacts = contacts.filter(
          (contact) =>
            contact.firstName &&
            contact.firstName.trim() &&
            contact.lastName &&
            contact.lastName.trim()
        );

        console.log("Valid contacts to create:", validContacts);

        if (validContacts.length === 0) {
          console.log("No valid contacts to create");
          return; // Exit early if no valid contacts
        }

        // Verify contactService is available
        if (!contactService || typeof contactService.create !== "function") {
          console.error(
            "❌ contactService is not available or create method is missing"
          );
          return;
        }

        console.log(
          "✅ contactService is available, proceeding with contact creation"
        );

        const contactPromises = validContacts.map(async (contact) => {
          const contactData = {
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            title: contact.jobTitle,
            department: contact.department,
            role: contact.role,
            status: "ACTIVE",
            source: "LEAD_CONVERSION",
            leadCompany: createdCompany.id, // Associate with the created lead company
          };

          console.log("Creating contact:", contactData);

          try {
            const createdContact = await contactService.create(contactData);
            console.log("✅ Successfully created contact:", createdContact);
            return createdContact;
          } catch (error) {
            console.error("❌ Error creating contact:", error);
            console.error("Contact data that failed:", contactData);
            // Don't throw here, just log the error and continue
            return null;
          }
        });

        try {
          const createdContacts = await Promise.all(contactPromises);
          const successfulContacts = createdContacts.filter(
            (contact) => contact !== null
          );
          console.log(
            `Successfully created ${successfulContacts.length} out of ${validContacts.length} contacts`
          );

          if (successfulContacts.length > 0) {
            console.log("Created contacts:", successfulContacts);
          }

          if (successfulContacts.length < validContacts.length) {
            console.warn(
              `Only ${successfulContacts.length} out of ${validContacts.length} contacts were created successfully`
            );
          }
        } catch (error) {
          console.error("Error creating some contacts:", error);
          // Don't fail the entire process if contacts fail
        }
      }

      // Show success message
      setShowSuccess(true);

      // Redirect to the new lead company detail page after a short delay
      setTimeout(() => {
        router.push(`/sales/lead-companies/${createdCompany.id}`);
      }, 2000);
    } catch (error) {
      console.error("Error creating lead company:", error);
      setErrors({ submit: "Failed to create lead company. Please try again." });
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
          <p className="text-gray-600 mb-4">
            Lead company created successfully
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">
            Redirecting to company details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 space-y-6">
        <PageHeader
          title="Add New Lead Company"
          subtitle="Create a new lead company with contact information"
          breadcrumb={[
            { label: "Dashboard", href: "/" },
            { label: "Sales", href: "/sales" },
            { label: "Lead Companies", href: "/sales/lead-companies" },
            { label: "Add New", href: "/sales/lead-companies/new" },
          ]}
          showProfile={true}
          showSearch={false}
          showActions={false}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <Card className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Company Information
                </h3>
                <p className="text-sm text-gray-600">
                  Basic information about the lead company
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Input
                  label="Company Name *"
                  value={companyData.companyName}
                  onChange={(e) =>
                    handleCompanyChange("companyName", e.target.value)
                  }
                  error={errors.companyName}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Select
                  label="Industry *"
                  value={companyData.industry}
                  onChange={(value) => handleCompanyChange("industry", value)}
                  options={industryOptions}
                  error={errors.industry}
                  placeholder="Select industry"
                />
              </div>

              <div>
                <Input
                  label="Website"
                  type="url"
                  value={companyData.website}
                  onChange={(e) =>
                    handleCompanyChange("website", e.target.value)
                  }
                  placeholder="https://company.com"
                  icon={Globe}
                />
              </div>
              <div>
                <Input
                  label="Phone"
                  type="tel"
                  value={companyData.phone}
                  onChange={(e) => handleCompanyChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  icon={Phone}
                />
              </div>
              <div>
                <Input
                  label="Company Email *"
                  type="email"
                  value={companyData.email}
                  onChange={(e) => handleCompanyChange("email", e.target.value)}
                  error={errors.email}
                  placeholder="contact@company.com"
                  icon={Mail}
                />
              </div>

              <div className="lg:col-span-2">
                <Input
                  label="Address"
                  value={companyData.address}
                  onChange={(e) =>
                    handleCompanyChange("address", e.target.value)
                  }
                  placeholder="Street address"
                  icon={MapPin}
                />
              </div>
              <div>
                <Input
                  label="City"
                  value={companyData.city}
                  onChange={(e) => handleCompanyChange("city", e.target.value)}
                  placeholder="City"
                />
              </div>

              <div>
                <Input
                  label="State/Province"
                  value={companyData.state}
                  onChange={(e) => handleCompanyChange("state", e.target.value)}
                  placeholder="State or Province"
                />
              </div>
              <div>
                <Input
                  label="Country"
                  value={companyData.country}
                  onChange={(e) =>
                    handleCompanyChange("country", e.target.value)
                  }
                  placeholder="Country"
                />
              </div>
              <div>
                <Input
                  label="ZIP/Postal Code"
                  value={companyData.zipCode}
                  onChange={(e) =>
                    handleCompanyChange("zipCode", e.target.value)
                  }
                  placeholder="ZIP or Postal Code"
                />
              </div>

              <div>
                <Select
                  label="Company Size"
                  value={companyData.employees}
                  onChange={(value) => handleCompanyChange("employees", value)}
                  options={employeeSizeOptions}
                  placeholder="Select company size"
                />
              </div>
              <div>
                <Input
                  label="Founded Year"
                  type="number"
                  value={companyData.founded}
                  onChange={(e) =>
                    handleCompanyChange("founded", e.target.value)
                  }
                  placeholder="2020"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <Input
                  label="Deal Value"
                  type="number"
                  value={companyData.dealValue}
                  onChange={(e) =>
                    handleCompanyChange("dealValue", e.target.value)
                  }
                  placeholder="25000"
                  min="0"
                  step="0.01"
                  icon={DollarSign}
                />
              </div>

              <div>
                <Input
                  label="LinkedIn"
                  value={companyData.linkedIn}
                  onChange={(e) =>
                    handleCompanyChange("linkedIn", e.target.value)
                  }
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
              <div>
                <Input
                  label="Twitter"
                  value={companyData.twitter}
                  onChange={(e) =>
                    handleCompanyChange("twitter", e.target.value)
                  }
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <Select
                  label="Lead Source"
                  value={companyData.leadSource}
                  onChange={(value) => handleCompanyChange("leadSource", value)}
                  options={leadSourceOptions}
                />
              </div>

              <div className="lg:col-span-3">
                <Textarea
                  label="Company Description"
                  value={companyData.description}
                  onChange={(e) =>
                    handleCompanyChange("description", e.target.value)
                  }
                  placeholder="Brief description of the company and their business..."
                  rows={3}
                />
              </div>

              <div className="lg:col-span-3">
                <Textarea
                  label="Notes"
                  value={companyData.notes}
                  onChange={(e) => handleCompanyChange("notes", e.target.value)}
                  placeholder="Additional notes about this lead..."
                  rows={2}
                />
              </div>
            </div>
          </Card>

          {/* Contacts Information */}
          <Card className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contact Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    Add contacts for this lead company
                  </p>
                </div>
              </div>
              <Button
                type="button"
                onClick={addContact}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>

            <div className="space-y-6">
              {contacts.map((contact, index) => (
                <div
                  key={contact.id}
                  className="relative p-4 rounded-xl bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm border border-white/30"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">
                        Contact {index + 1}
                      </span>
                      {contact.isPrimary && (
                        <Badge variant="success" size="sm">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!contact.isPrimary && (
                        <Button
                          type="button"
                          onClick={() => setPrimaryContact(contact.id)}
                          size="sm"
                          variant="outline"
                        >
                          Set as Primary
                        </Button>
                      )}
                      {contacts.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeContact(contact.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Input
                        label="First Name *"
                        value={contact.firstName}
                        onChange={(e) =>
                          handleContactChange(
                            contact.id,
                            "firstName",
                            e.target.value
                          )
                        }
                        error={errors[`contact_${contact.id}_firstName`]}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Input
                        label="Last Name *"
                        value={contact.lastName}
                        onChange={(e) =>
                          handleContactChange(
                            contact.id,
                            "lastName",
                            e.target.value
                          )
                        }
                        error={errors[`contact_${contact.id}_lastName`]}
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <Input
                        label="Email *"
                        type="email"
                        value={contact.email}
                        onChange={(e) =>
                          handleContactChange(
                            contact.id,
                            "email",
                            e.target.value
                          )
                        }
                        error={errors[`contact_${contact.id}_email`]}
                        placeholder="john.doe@company.com"
                        icon={Mail}
                      />
                    </div>
                    <div>
                      <Input
                        label="Phone"
                        type="tel"
                        value={contact.phone}
                        onChange={(e) =>
                          handleContactChange(
                            contact.id,
                            "phone",
                            e.target.value
                          )
                        }
                        placeholder="+1 (555) 123-4567"
                        icon={Phone}
                      />
                    </div>
                    <div>
                      <Input
                        label="Job Title"
                        value={contact.title}
                        onChange={(e) =>
                          handleContactChange(
                            contact.id,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="CEO, Manager, etc."
                      />
                    </div>
                    <div>
                      <Input
                        label="Department"
                        value={contact.department}
                        onChange={(e) =>
                          handleContactChange(
                            contact.id,
                            "department",
                            e.target.value
                          )
                        }
                        placeholder="Sales, Marketing, IT, etc."
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                      <Select
                        label="Contact Role"
                        value={contact.role}
                        onChange={(value) =>
                          handleContactChange(contact.id, "role", value)
                        }
                        options={contactRoleOptions}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Lead Status */}
          <Card className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Lead Status
                </h3>
                <p className="text-sm text-gray-600">
                  Set the initial status for this lead
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Initial Status"
                  value={companyData.status}
                  onChange={(value) => handleCompanyChange("status", value)}
                  options={statusOptions}
                />
              </div>
              <div>
                <Select
                  label="Lead Source"
                  value={companyData.leadSource}
                  onChange={(value) => handleCompanyChange("leadSource", value)}
                  options={leadSourceOptions}
                />
              </div>
            </div>
          </Card>

          {/* Error Message */}
          {errors.submit && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white flex items-center gap-2 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Lead Company
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
