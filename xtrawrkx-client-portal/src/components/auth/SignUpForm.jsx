"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import AuthToggle from "./AuthToggle";

const COMMUNITIES = [
  {
    id: "xdd",
    name: "XtraDesignDevelopment",
    code: "XDD",
    description: "Design & Development Community",
    icon: "mdi:code-braces",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "xen",
    name: "XtraEntrepreneur",
    code: "XEN",
    description: "Entrepreneur Network",
    icon: "mdi:lightbulb-on",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "xevfin",
    name: "XtraEventFinance",
    code: "XEVFIN",
    description: "Events & Finance",
    icon: "mdi:chart-line",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "xevtg",
    name: "XtraEventTravel",
    code: "XEVTG",
    description: "Events & Travel",
    icon: "mdi:airplane",
    color: "from-orange-500 to-red-500",
  },
];

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Consulting",
  "Marketing",
  "Media & Entertainment",
  "Other",
];

const EMPLOYEE_RANGES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

export default function SignUpForm({ onSignIn, onSubmit, className = "" }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    name: "",
    email: "",
    phone: "",
    password: "",
    // Step 2: Company Info
    companyName: "",
    industry: "",
    companyType: "",
    subType: "",
    website: "",
    employees: "",
    founded: "",
    revenue: "",
    description: "",
    // Address Info
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    // Social Links
    linkedIn: "",
    twitter: "",
    // Step 3: Community Selection
    selectedCommunities: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const toggleCommunity = (communityId) => {
    setFormData((prev) => ({
      ...prev,
      selectedCommunities: prev.selectedCommunities.includes(communityId)
        ? prev.selectedCommunities.filter((id) => id !== communityId)
        : [...prev.selectedCommunities, communityId],
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.industry) {
      newErrors.industry = "Industry is required";
    }

    if (!formData.employees) {
      newErrors.employees = "Employee count is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (formData.selectedCommunities.length === 0) {
      newErrors.communities = "Please select at least one community";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setErrors({});

    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep < 3) {
      handleNext();
      return;
    }

    if (!validateStep3()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      setErrors({
        general: error.message || "Sign up failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              step === currentStep
                ? "bg-purple-600 text-white scale-110"
                : step < currentStep
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step < currentStep ? (
              <Icon icon="mdi:check" className="w-6 h-6" />
            ) : (
              step
            )}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 transition-all ${
                step < currentStep ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <AuthInput
        type="text"
        name="name"
        label="Full Name"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleInputChange}
        error={errors.name}
        required
      />

      <AuthInput
        type="email"
        name="email"
        label="Email Address"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        required
      />

      <AuthInput
        type="tel"
        name="phone"
        label="Phone Number"
        placeholder="+1 (555) 123-4567"
        value={formData.phone}
        onChange={handleInputChange}
        error={errors.phone}
        required
      />

      <div className="relative">
        <AuthInput
          type={showPassword ? "text" : "password"}
          name="password"
          label="Password"
          placeholder="At least 8 characters"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <Icon
            icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
            className="w-5 h-5"
          />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Basic Company Info */}
      <div className="space-y-6">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Basic Information
        </h4>

        <AuthInput
          type="text"
          name="companyName"
          label="Company Name"
          placeholder="Enter your company name"
          value={formData.companyName}
          onChange={handleInputChange}
          error={errors.companyName}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Industry <span className="text-red-500">*</span>
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl shadow-sm outline-none transition-all ${
                errors.industry
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              }`}
              required
            >
              <option value="">Select industry</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Type <span className="text-red-500">*</span>
            </label>
            <select
              name="companyType"
              value={formData.companyType}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl shadow-sm outline-none transition-all ${
                errors.companyType
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              }`}
              required
            >
              <option value="">Select type</option>
              {COMPANY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.companyType && (
              <p className="mt-1 text-sm text-red-600">{errors.companyType}</p>
            )}
          </div>
        </div>

        <AuthInput
          type="text"
          name="subType"
          label="Sub Type (Optional)"
          placeholder="e.g., SaaS, E-commerce, etc."
          value={formData.subType}
          onChange={handleInputChange}
          error={errors.subType}
        />

        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            type="url"
            name="website"
            label="Website (Optional)"
            placeholder="https://yourcompany.com"
            value={formData.website}
            onChange={handleInputChange}
            error={errors.website}
          />

          <AuthInput
            type="text"
            name="founded"
            label="Founded Year (Optional)"
            placeholder="2020"
            value={formData.founded}
            onChange={handleInputChange}
            error={errors.founded}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Employees <span className="text-red-500">*</span>
            </label>
            <select
              name="employees"
              value={formData.employees}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl shadow-sm outline-none transition-all ${
                errors.employees
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              }`}
              required
            >
              <option value="">Select range</option>
              {EMPLOYEE_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range} employees
                </option>
              ))}
            </select>
            {errors.employees && (
              <p className="mt-1 text-sm text-red-600">{errors.employees}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Annual Revenue (Optional)
            </label>
            <select
              name="revenue"
              value={formData.revenue}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            >
              <option value="">Select range</option>
              {REVENUE_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Company Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Tell us about your company..."
            rows="3"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-none"
          />
        </div>
      </div>

      {/* Address Info */}
      <div className="space-y-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Address Information
        </h4>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Street Address (Optional)
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Street address"
            rows="2"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            type="text"
            name="city"
            label="City (Optional)"
            placeholder="City"
            value={formData.city}
            onChange={handleInputChange}
          />

          <AuthInput
            type="text"
            name="state"
            label="State/Province (Optional)"
            placeholder="State"
            value={formData.state}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            type="text"
            name="country"
            label="Country (Optional)"
            placeholder="Country"
            value={formData.country}
            onChange={handleInputChange}
          />

          <AuthInput
            type="text"
            name="zipCode"
            label="Zip/Postal Code (Optional)"
            placeholder="Zip code"
            value={formData.zipCode}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Social Media
        </h4>

        <AuthInput
          type="url"
          name="linkedIn"
          label="LinkedIn Profile (Optional)"
          placeholder="https://linkedin.com/company/..."
          value={formData.linkedIn}
          onChange={handleInputChange}
        />

        <AuthInput
          type="url"
          name="twitter"
          label="Twitter Profile (Optional)"
          placeholder="https://twitter.com/..."
          value={formData.twitter}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Select Communities
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Choose the communities you&apos;d like to join. You can always change
          this later.
        </p>

        {errors.communities && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.communities}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {COMMUNITIES.map((community) => (
            <button
              key={community.id}
              type="button"
              onClick={() => toggleCommunity(community.id)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                formData.selectedCommunities.includes(community.id)
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${community.color} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon icon={community.icon} className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {community.name}
                    </h4>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {community.code}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {community.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.selectedCommunities.includes(community.id)
                        ? "border-purple-500 bg-purple-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.selectedCommunities.includes(community.id) && (
                      <Icon icon="mdi:check" className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Personal Information";
      case 2:
        return "Company Information";
      case 3:
        return "Community Selection";
      default:
        return "";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return "Let's start with your basic details";
      case 2:
        return "Tell us about your company";
      case 3:
        return "Join communities that match your interests";
      default:
        return "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <AuthCard title={getStepTitle()} subtitle={getStepSubtitle()}>
        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <div
            className={
              currentStep === 2 ? "max-h-[500px] overflow-y-auto pr-2" : ""
            }
          >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>

          <div className="flex gap-4 pt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Back
              </button>
            )}
            <AuthButton
              type="submit"
              loading={loading}
              disabled={loading}
              className="flex-1"
            >
              {loading
                ? "Processing..."
                : currentStep === 3
                ? "Complete Registration"
                : "Continue"}
            </AuthButton>
          </div>

          {currentStep === 1 && (
            <AuthToggle
              text="Already have an account?"
              linkText="Sign In"
              onClick={onSignIn}
              className="mt-6"
            />
          )}
        </form>
      </AuthCard>
    </div>
  );
}
