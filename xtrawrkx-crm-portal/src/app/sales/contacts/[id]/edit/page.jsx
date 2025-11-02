"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  Button,
  Input,
  Select,
  Textarea,
  Badge,
} from "../../../../../components/ui";
import PageHeader from "../../../../../components/PageHeader";
import contactService from "../../../../../lib/api/contactService";
import leadCompanyService from "../../../../../lib/api/leadCompanyService";
import clientAccountService from "../../../../../lib/api/clientAccountService";
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Globe,
  Users,
} from "lucide-react";

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Contact data
  const [contactData, setContactData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    title: "",
    department: "",
    role: "TECHNICAL_CONTACT",
    status: "ACTIVE",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    birthday: "",
    linkedIn: "",
    twitter: "",
    notes: "",
    leadCompany: "",
    clientAccount: "",
  });

  // Dropdown options
  const [leadCompanies, setLeadCompanies] = useState([]);
  const [clientAccounts, setClientAccounts] = useState([]);

  const roleOptions = [
    { value: "PRIMARY_CONTACT", label: "Primary Contact" },
    { value: "DECISION_MAKER", label: "Decision Maker" },
    { value: "INFLUENCER", label: "Influencer" },
    { value: "TECHNICAL_CONTACT", label: "Technical Contact" },
    { value: "GATEKEEPER", label: "Gatekeeper" },
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "NEW", label: "New" },
    { value: "QUALIFIED", label: "Qualified" },
    { value: "INACTIVE", label: "Inactive" },
  ];

  // Fetch contact data and dropdown options on component mount
  useEffect(() => {
    fetchContactData();
    fetchDropdownOptions();
  }, [contactId]);

  const fetchContactData = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching contact data for ID:", contactId);
      const response = await contactService.getById(contactId, {
        populate: ["leadCompany", "clientAccount"],
      });

      console.log("Contact response:", response);

      // Handle the service response structure
      const contact = response?.data || response;
      console.log("Contact data:", contact);

      if (contact && contact.id) {
        // Handle both direct contact data and nested attributes
        const contactData = contact.attributes || contact;

        setContactData({
          firstName: contactData.firstName || "",
          lastName: contactData.lastName || "",
          email: contactData.email || "",
          phone: contactData.phone || "",
          title: contactData.title || "",
          department: contactData.department || "",
          role: contactData.role || "TECHNICAL_CONTACT",
          status: contactData.status || "ACTIVE",
          address: contactData.address || "",
          city: contactData.city || "",
          state: contactData.state || "",
          country: contactData.country || "",
          zipCode: contactData.zipCode || "",
          birthday: contactData.birthday
            ? new Date(contactData.birthday).toISOString().split("T")[0]
            : "",
          linkedIn: contactData.linkedIn || "",
          twitter: contactData.twitter || "",
          notes: contactData.notes || "",
          leadCompany:
            contactData.leadCompany?.id || contact.leadCompany?.id || "",
          clientAccount:
            contactData.clientAccount?.id || contact.clientAccount?.id || "",
        });
      } else {
        console.error("No contact data found");
        setErrors({ general: "Contact not found" });
      }
    } catch (error) {
      console.error("Error fetching contact:", error);
      setErrors({ general: "Failed to load contact data" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      // Fetch lead companies
      const leadCompaniesResponse = await leadCompanyService.getAll({
        pagination: { pageSize: 1000 },
        sort: ["companyName:asc"],
      });
      setLeadCompanies(leadCompaniesResponse.data || []);

      // Fetch client accounts
      const clientAccountsResponse = await clientAccountService.getAll({
        pagination: { pageSize: 1000 },
        sort: ["companyName:asc"],
      });
      setClientAccounts(clientAccountsResponse.data || []);
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setContactData((prev) => ({
      ...prev,
      [field]: value,
    }));

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
    if (!contactData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!contactData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!contactData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(contactData.email)) {
      newErrors.email = "Invalid email format";
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
      // Helper function to format date for Strapi
      const formatDateForStrapi = (dateValue) => {
        if (!dateValue) return null;
        try {
          const date = new Date(dateValue);
          if (isNaN(date.getTime())) return null;
          return date.toISOString().split("T")[0]; // yyyy-MM-dd format
        } catch (error) {
          console.warn("Invalid date format:", dateValue);
          return null;
        }
      };

      // Prepare update data with proper formatting
      const updateData = {
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone,
        title: contactData.title,
        department: contactData.department,
        role: contactData.role,
        status: contactData.status,
        address: contactData.address,
        city: contactData.city,
        state: contactData.state,
        country: contactData.country,
        zipCode: contactData.zipCode,
        linkedIn: contactData.linkedIn,
        twitter: contactData.twitter,
        notes: contactData.notes,
        birthday: formatDateForStrapi(contactData.birthday),
        leadCompany: contactData.leadCompany || null,
        clientAccount: contactData.clientAccount || null,
      };

      // Remove empty string values and replace with null
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === "") {
          updateData[key] = null;
        }
      });

      console.log("Updating contact with data:", updateData);
      await contactService.update(contactId, updateData);

      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/sales/contacts/${contactId}`);
      }, 2000);
    } catch (error) {
      console.error("Error updating contact:", error);

      // Extract specific error message from Strapi response
      let errorMessage = "Failed to update contact. Please try again.";
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4 bg-white min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <span className="text-gray-600">Loading contact...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Contact updated successfully!
        </div>
      )}

      <div className="p-4 space-y-4 bg-white min-h-screen">
        {/* Page Header */}
        <PageHeader
          title="Edit Contact"
          subtitle="Update contact information and details"
          breadcrumb={[
            { label: "Dashboard", href: "/" },
            { label: "Sales", href: "/sales" },
            { label: "Contacts", href: "/sales/contacts" },
            {
              label:
                `${contactData.firstName} ${contactData.lastName}` || "Edit",
              href: `/sales/contacts/${contactId}/edit`,
            },
          ]}
          showActions={false}
        />

        {/* Custom Actions */}
        <div className="flex items-center justify-end gap-3 mb-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/sales/contacts/${contactId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? "Updating..." : "Update Contact"}
          </Button>
        </div>

        {/* Error Message */}
        {errors.general && (
          <Card className="border-red-200 bg-red-50">
            <div className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{errors.general}</span>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Basic Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    Personal details and contact information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <Input
                    value={contactData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Enter first name"
                    error={errors.firstName}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <Input
                    value={contactData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Enter last name"
                    error={errors.lastName}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john@example.com"
                    icon={Mail}
                    error={errors.email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <Input
                    value={contactData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    icon={Phone}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birthday
                  </label>
                  <Input
                    type="date"
                    value={contactData.birthday}
                    onChange={(e) =>
                      handleInputChange("birthday", e.target.value)
                    }
                    icon={Calendar}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <Select
                    value={contactData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Professional Information */}
          <Card className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Professional Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    Job title, department, and role details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <Input
                    value={contactData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="CEO, Manager, Developer..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <Input
                    value={contactData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    placeholder="Sales, Marketing, IT..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <Select
                    value={contactData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Role Badge
                  </label>
                  <div className="pt-2">
                    <Badge
                      variant={
                        contactData.role === "PRIMARY_CONTACT"
                          ? "success"
                          : contactData.role === "DECISION_MAKER"
                          ? "warning"
                          : contactData.role === "INFLUENCER"
                          ? "info"
                          : "secondary"
                      }
                    >
                      {contactData.role?.replace("_", " ") ||
                        "TECHNICAL CONTACT"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Company Association */}
          <Card className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Company Association
                  </h2>
                  <p className="text-sm text-gray-500">
                    Associate contact with a lead company or client account
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Company
                  </label>
                  <Select
                    value={contactData.leadCompany}
                    onChange={(e) => {
                      handleInputChange("leadCompany", e.target.value);
                      if (e.target.value) {
                        handleInputChange("clientAccount", ""); // Clear client account if lead company is selected
                      }
                    }}
                  >
                    <option value="">Select lead company</option>
                    {leadCompanies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.companyName}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Account
                  </label>
                  <Select
                    value={contactData.clientAccount}
                    onChange={(e) => {
                      handleInputChange("clientAccount", e.target.value);
                      if (e.target.value) {
                        handleInputChange("leadCompany", ""); // Clear lead company if client account is selected
                      }
                    }}
                  >
                    <option value="">Select client account</option>
                    {clientAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.companyName}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> A contact can be associated with either
                  a lead company or a client account, but not both.
                </p>
              </div>
            </div>
          </Card>

          {/* Address Information */}
          <Card className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Address Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    Contact location and address details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <Input
                    value={contactData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Input
                    value={contactData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <Input
                    value={contactData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <Input
                    value={contactData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    placeholder="United States"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP/Postal Code
                  </label>
                  <Input
                    value={contactData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Social & Additional Information */}
          <Card className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Social & Additional Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    Social media links and additional notes
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    <Input
                      value={contactData.linkedIn}
                      onChange={(e) =>
                        handleInputChange("linkedIn", e.target.value)
                      }
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter URL
                    </label>
                    <Input
                      value={contactData.twitter}
                      onChange={(e) =>
                        handleInputChange("twitter", e.target.value)
                      }
                      placeholder="https://twitter.com/johndoe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <Textarea
                    value={contactData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Additional notes about this contact..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/sales/contacts/${contactId}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSubmitting ? "Updating..." : "Update Contact"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
