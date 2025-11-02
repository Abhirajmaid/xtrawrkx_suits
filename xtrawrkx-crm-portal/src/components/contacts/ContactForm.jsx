"use client";

import { useState, useEffect } from "react";
import {
  X,
  Save,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";
import contactService from "../../lib/api/contactService";
import leadCompanyService from "../../lib/api/leadCompanyService";
import clientAccountService from "../../lib/api/clientAccountService";

const ContactForm = ({ contact = null, onSave, onCancel, isModal = false }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    title: "",
    department: "",
    role: "TECHNICAL_CONTACT",
    status: "ACTIVE",
    address: "",
    birthday: "",
    leadCompany: "",
    clientAccount: "",
    linkedIn: "",
    twitter: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [leadCompanies, setLeadCompanies] = useState([]);
  const [clientAccounts, setClientAccounts] = useState([]);

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        title: contact.title || "",
        department: contact.department || "",
        role: contact.role || "TECHNICAL_CONTACT",
        status: contact.status || "ACTIVE",
        address: contact.address || "",
        birthday: contact.birthday || "",
        leadCompany: contact.leadCompany?.id || "",
        clientAccount: contact.clientAccount?.id || "",
        linkedIn: contact.linkedIn || "",
        twitter: contact.twitter || "",
        notes: contact.notes || "",
      });
    }

    // Fetch lead companies and client accounts for dropdowns
    fetchCompanies();
  }, [contact]);

  const fetchCompanies = async () => {
    try {
      const [leadResponse, clientResponse] = await Promise.all([
        leadCompanyService.getAll({ pagination: { pageSize: 100 } }),
        clientAccountService.getAll({ pagination: { pageSize: 100 } }),
      ]);

      setLeadCompanies(leadResponse.data || []);
      setClientAccounts(clientResponse.data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.leadCompany && formData.clientAccount) {
      newErrors.company =
        "Contact cannot be associated with both lead company and client account";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        leadCompany: formData.leadCompany || null,
        clientAccount: formData.clientAccount || null,
      };

      let result;
      if (contact) {
        result = await contactService.update(contact.id, submitData);
      } else {
        result = await contactService.create(submitData);
      }

      onSave(result);
    } catch (error) {
      console.error("Error saving contact:", error);
      setErrors({ submit: "Failed to save contact. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "DECISION_MAKER", label: "Decision Maker" },
    { value: "INFLUENCER", label: "Influencer" },
    { value: "TECHNICAL_CONTACT", label: "Technical Contact" },
    { value: "GATEKEEPER", label: "Gatekeeper" },
    { value: "PRIMARY_CONTACT", label: "Primary Contact" },
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ];

  const formClasses = isModal
    ? "bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
    : "bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl";

  return (
    <div className={formClasses}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <User className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {contact ? "Edit Contact" : "Add New Contact"}
              </h2>
              <p className="text-gray-600">
                {contact
                  ? "Update contact information"
                  : "Create a new contact in your CRM"}
              </p>
            </div>
          </div>
          {isModal && (
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {errors.company && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.company}</p>
            </div>
          )}

          {/* Personal Information */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm ${
                    errors.firstName ? "border-red-300" : "border-white/40"
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm ${
                    errors.lastName ? "border-red-300" : "border-white/40"
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm ${
                      errors.email ? "border-red-300" : "border-white/40"
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-white/40 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthday
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-white/40 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/40 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-12 pr-4 py-3 border border-white/40 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="Enter full address"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-600" />
              Professional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/40 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="Enter job title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/40 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="Enter department"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/40 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Company Association */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-600" />
              Company Association
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Company
                </label>
                <select
                  name="leadCompany"
                  value={formData.leadCompany}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/40 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  disabled={!!formData.clientAccount}
                >
                  <option value="">Select Lead Company</option>
                  {leadCompanies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Account
                </label>
                <select
                  name="clientAccount"
                  value={formData.clientAccount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/40 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  disabled={!!formData.leadCompany}
                >
                  <option value="">Select Client Account</option>
                  {clientAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.companyName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Note: A contact can only be associated with either a Lead Company
              OR a Client Account, not both.
            </p>
          </div>

          {/* Social & Notes */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/40 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter Profile
                </label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/40 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-white/40 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                placeholder="Add any additional notes about this contact..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-white/30">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading
                ? "Saving..."
                : contact
                ? "Update Contact"
                : "Create Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
