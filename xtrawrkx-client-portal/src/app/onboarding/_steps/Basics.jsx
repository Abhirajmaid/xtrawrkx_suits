"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { userBasicsSchema } from "@/lib/onboarding-schemas";
import { ROLE_OPTIONS, INTEREST_OPTIONS } from "@/lib/onboarding-config";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { getOnboardingAccount } from "@/lib/api";
import { useSession } from "@/lib/auth";
import { Input, Label, Select } from "@/components/ui";
import { BlueButton, PurpleButton, WhiteButton } from "@/components/ui";
import { X, Plus, User, MapPin, Heart } from "lucide-react";

export function BasicsStep({
  onNext,
  onBack,
  onSkip,
  onSave,
  isLoading,
  initialData,
}) {
  const { saveBasics, loadingStates } = useOnboardingState();
  const { data: session } = useSession();
  const isSaving = loadingStates.basics;
  const [selectedInterests, setSelectedInterests] = useState(
    initialData?.interests || []
  );
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [accountData, setAccountData] = useState(null);

  // Company types and sub-types (same as lead company form)
  const companyTypes = [
    { id: "startup-corporate", name: "Startup and Corporates" },
    { id: "investor", name: "Investors" },
    { id: "enablers-academia", name: "Enablers & Academia" },
  ];

  const subTypeOptions = {
    "startup-corporate": [
      "EV 2W",
      "EV 3W",
      "EV OEM",
      "EV 4W",
      "Motor OEM",
      "Motor Controller OEM",
      "Batteries",
      "Charging Infra",
      "Drones",
      "AGVs",
      "Consumer electronics",
      "Incubator / accelerator",
      "Power electronics",
      "Other OE",
      "Group",
      "EV Fleet",
      "E-commerce companies",
      "3rd party logistics",
      "Vehicle Smarts",
      "Swapping",
      "EV Leasing",
      "EV Rentals",
      "EV NBFC",
      "Power electronics+Vechicle smart",
      "Electronics Components",
      "1DL/MDL",
      "Franchisee",
      "Smart Battery",
      "Dealer",
      "Motor Parts",
      "Spare Part",
      "Traditional Auto",
      "Smart Electronic",
      "Mech Parts",
      "Energy Storing",
      "Automotive Parts_ EV manufacturers",
      "IOT",
      "Inverter",
      "Aggregator",
    ],
    investor: [
      "Future Founder",
      "Private Lender P2P",
      "Angel",
      "Angel Network",
      "Micro VC",
      "VC",
      "Family Office",
      "Private Equity PE",
      "Debt",
      "WC Working Capital",
      "NBFC",
      "Bill discounting",
      "Investment Bank",
      "Banks",
      "Asset Investor",
      "Asset Financier",
      "Asset Leasing",
      "Op Franchisee",
      "Franchise Network",
      "Incubation Center",
      "Accelerator",
      "Industry body",
      "Gov Body",
      "Gov Policy",
      "Alternative Investment Platform",
      "Strategic investor",
      "CVC",
      "HNI",
    ],
    "enablers-academia": [
      "Incubator",
      "Accelerator",
      "Venture Studio",
      "Academia",
      "Government Office",
      "Mentor",
      "Investment Banker",
    ],
  };

  // Get sub-type options based on selected company type
  const getSubTypeOptions = () => {
    const companyType = watch("companyType");
    if (!companyType) return [];
    return (
      subTypeOptions[companyType]?.map((subType) => ({
        value: subType,
        label: subType,
      })) || []
    );
  };

  const accountTypeOptions = [
    { value: "CUSTOMER", label: "Customer" },
    { value: "PARTNER", label: "Partner" },
    { value: "VENDOR", label: "Vendor" },
  ];

  const employeeSizeOptions = [
    { value: "SIZE_1_10", label: "1-10 employees" },
    { value: "SIZE_11_50", label: "11-50 employees" },
    { value: "SIZE_51_200", label: "51-200 employees" },
    { value: "SIZE_201_500", label: "201-500 employees" },
    { value: "SIZE_501_1000", label: "501-1000 employees" },
    { value: "SIZE_1000_PLUS", label: "1000+ employees" },
  ];

  const revenueOptions = [
    { value: "REVENUE_0_1L", label: "₹0 - ₹1 Lakh" },
    { value: "REVENUE_1L_10L", label: "₹1 Lakh - ₹10 Lakhs" },
    { value: "REVENUE_10L_50L", label: "₹10 Lakhs - ₹50 Lakhs" },
    { value: "REVENUE_50L_1C", label: "₹50 Lakhs - ₹1 Crore" },
    { value: "REVENUE_1C_10C", label: "₹1 Crore - ₹10 Crores" },
    { value: "REVENUE_10C_50C", label: "₹10 Crores - ₹50 Crores" },
    { value: "REVENUE_50C_100C", label: "₹50 Crores - ₹100 Crores" },
    { value: "REVENUE_100C_PLUS", label: "₹100+ Crores" },
  ];

  // Load account data on mount
  useEffect(() => {
    const loadAccountData = async () => {
      try {
        setIsLoadingAccount(true);
        const account = await getOnboardingAccount();
        if (account) {
          setAccountData(account);
        }
      } catch (error) {
        console.error("Failed to load account data:", error);
      } finally {
        setIsLoadingAccount(false);
      }
    };

    loadAccountData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitted, touchedFields },
    setValue,
    watch,
    trigger,
    clearErrors,
    reset,
  } = useForm({
    resolver: zodResolver(userBasicsSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      companyType: "",
      subType: "",
      type: "CUSTOMER",
      employees: "",
      revenue: "",
      founded: "",
      name: "",
      role: "",
      location: "",
      interests: [],
    },
    mode: "onTouched", // Only validate after field is touched
    reValidateMode: "onChange",
    criteriaMode: "firstError",
    shouldFocusError: false,
    shouldUnregister: false,
  });

  // Update form when account data or initialData loads
  useEffect(() => {
    if (!isLoadingAccount) {
      const companyName =
        initialData?.companyName || accountData?.companyName || "";
      const industry = initialData?.industry || accountData?.industry || "";
      const name = initialData?.name || accountData?.name || "";

      // Only reset if we have data to populate
      if (
        companyName ||
        industry ||
        name ||
        initialData?.role ||
        initialData?.location
      ) {
        reset(
          {
            companyName: companyName,
            industry: industry,
            companyType:
              initialData?.companyType || accountData?.companyType || "",
            subType: initialData?.subType || accountData?.subType || "",
            type: initialData?.type || accountData?.type || "CUSTOMER",
            employees:
              initialData?.employees ||
              accountData?.employees ||
              initialData?.companySize ||
              "",
            revenue: initialData?.revenue || accountData?.revenue || "",
            founded: initialData?.founded || accountData?.founded || "",
            name: name,
            role: initialData?.role || "",
            location: initialData?.location || "",
            interests: initialData?.interests || [],
          },
          { keepErrors: false, keepDefaultValues: false }
        );
      }
    }
  }, [accountData, initialData, reset, isLoadingAccount]);

  const selectedRole = watch("role");
  const selectedCompanyType = watch("companyType");
  const currentSubType = watch("subType");

  // Reset subType when companyType changes
  useEffect(() => {
    if (selectedCompanyType) {
      const availableSubTypes = subTypeOptions[selectedCompanyType] || [];
      // Clear subType if it's not valid for the new company type
      if (currentSubType && !availableSubTypes.includes(currentSubType)) {
        setValue("subType", "", { shouldValidate: false });
      }
    } else {
      // Clear subType if company type is cleared
      if (currentSubType) {
        setValue("subType", "", { shouldValidate: false });
      }
    }
  }, [selectedCompanyType, currentSubType, setValue]);

  const handleInterestToggle = (interest) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    if (updated.length <= 6) {
      setSelectedInterests(updated);
      setValue("interests", updated, { shouldValidate: true });
    }
  };

  const handleRoleSelect = (role) => {
    setValue("role", role, { shouldValidate: true });
    trigger("role");
    clearErrors("role");
  };

  const onSubmit = async (data) => {
    // Trim all string values before submission and include all fields
    const trimmedData = {
      ...data,
      companyName: data.companyName?.trim() || "",
      industry: data.industry?.trim() || "",
      companyType: data.companyType || "",
      subType: data.subType?.trim() || "",
      type: data.type || "CUSTOMER",
      employees: data.employees || "",
      revenue: data.revenue || "",
      founded: data.founded?.trim() || "",
      name: data.name?.trim() || "",
      role: data.role?.trim() || "",
      location: data.location?.trim() || "",
      interests: selectedInterests,
    };
    const success = await saveBasics(trimmedData, true); // immediate save
    if (success && onNext && typeof onNext === "function") {
      onNext(trimmedData);
    } else if (success) {
      // Fallback: if onNext is not provided, just proceed
      console.warn("onNext is not a function, proceeding without navigation");
    }
  };

  const handleSaveAndExit = async () => {
    const formData = {
      name: watch("name"),
      role: watch("role"),
      location: watch("location"),
      interests: selectedInterests,
    };
    await saveBasics(formData, true); // immediate save
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Tell us about yourself
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Help us personalize your experience and connect you with the right
            opportunities in our community.
          </p>
        </motion.div>
      </div>

      {/* Error summary - only show errors when form is submitted */}
      {isSubmitted &&
        Object.keys(errors).filter((key) => {
          return ["companyName", "industry", "name", "role"].includes(key);
        }).length > 0 && (
          <div
            className="bg-red-50 border border-red-200 rounded-lg p-4"
            role="alert"
          >
            <h3 className="text-sm font-medium text-red-800 mb-2">
              Please fix the following errors:
            </h3>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(errors)
                .filter(([field]) =>
                  [
                    "companyName",
                    "industry",
                    "name",
                    "role",
                    "companyType",
                    "subType",
                    "type",
                    "employees",
                    "revenue",
                    "founded",
                  ].includes(field)
                )
                .map(([field, error]) => (
                  <li key={field}>
                    • {error?.message || `${field} is required`}
                  </li>
                ))}
            </ul>
          </div>
        )}

      <div className="space-y-8">
        {/* Hidden role field for react-hook-form tracking */}
        <input type="hidden" {...register("role")} />

        {/* Company Name */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05, duration: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-5 h-5 text-indigo-600" />
            <Label
              htmlFor="companyName"
              className="text-lg font-medium text-gray-900"
            >
              Company Name *
            </Label>
          </div>
          <Input
            id="companyName"
            {...register("companyName", {
              onChange: (e) => {
                const value = e.target.value;
                setValue("companyName", value, { shouldValidate: false });
                if (errors.companyName && value.trim().length > 0) {
                  clearErrors("companyName");
                }
              },
              onBlur: () => {
                const value = watch("companyName");
                setValue("companyName", value.trim(), { shouldValidate: true });
                trigger("companyName");
              },
            })}
            placeholder="Enter your company name"
            aria-describedby={
              errors.companyName && (touchedFields.companyName || isSubmitted)
                ? "companyName-error"
                : undefined
            }
            className={`h-12 text-lg ${
              errors.companyName && (touchedFields.companyName || isSubmitted)
                ? "border-red-500"
                : "border-gray-300 focus:border-indigo-500"
            }`}
          />
          {errors.companyName && (touchedFields.companyName || isSubmitted) && (
            <p id="companyName-error" className="text-sm text-red-600">
              {errors.companyName.message}
            </p>
          )}
        </motion.div>

        {/* Industry */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08, duration: 0.6 }}
        >
          <Label
            htmlFor="industry"
            className="text-lg font-medium text-gray-900"
          >
            Industry *
          </Label>
          <select
            id="industry"
            {...register("industry", {
              onChange: () => {
                trigger("industry");
                if (errors.industry) clearErrors("industry");
              },
            })}
            className={`h-12 w-full px-4 border rounded-lg text-lg ${
              errors.industry
                ? "border-red-500"
                : "border-gray-300 focus:border-indigo-500"
            }`}
          >
            <option value="">Select industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Transportation">Transportation</option>
            <option value="Energy">Energy</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Fashion">Fashion</option>
            <option value="Sports">Sports</option>
            <option value="Travel">Travel</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Consulting">Consulting</option>
            <option value="Marketing">Marketing</option>
            <option value="Other">Other</option>
          </select>
          {errors.industry && (touchedFields.industry || isSubmitted) && (
            <p className="text-sm text-red-600">{errors.industry.message}</p>
          )}
        </motion.div>

        {/* Company Type */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.09, duration: 0.6 }}
        >
          <Select
            label="Company Type (Optional)"
            value={watch("companyType") || ""}
            onChange={(value) => {
              setValue("companyType", value, { shouldValidate: true });
              trigger("companyType");
              if (errors.companyType) clearErrors("companyType");
            }}
            options={companyTypes.map((type) => ({
              value: type.id,
              label: type.name,
            }))}
            placeholder="Select company type"
            error={
              errors.companyType && (touchedFields.companyType || isSubmitted)
                ? errors.companyType.message
                : undefined
            }
            className={`h-12 text-lg ${
              errors.companyType && (touchedFields.companyType || isSubmitted)
                ? "border-red-500"
                : ""
            }`}
          />
        </motion.div>

        {/* Sub Type */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.095, duration: 0.6 }}
        >
          <Select
            label="Sub-Type (Optional)"
            value={watch("subType") || ""}
            onChange={(value) => {
              setValue("subType", value, { shouldValidate: true });
              trigger("subType");
              if (errors.subType) clearErrors("subType");
            }}
            options={getSubTypeOptions()}
            placeholder={
              selectedCompanyType
                ? "Select sub-type"
                : "Select company type first"
            }
            disabled={!selectedCompanyType}
            error={
              errors.subType && (touchedFields.subType || isSubmitted)
                ? errors.subType.message
                : undefined
            }
            className={`h-12 text-lg ${
              errors.subType && (touchedFields.subType || isSubmitted)
                ? "border-red-500"
                : ""
            }`}
          />
        </motion.div>

        {/* Account Type */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <Select
            label="Account Type (Optional)"
            value={watch("type") || "CUSTOMER"}
            onChange={(value) => {
              setValue("type", value, { shouldValidate: true });
              trigger("type");
              if (errors.type) clearErrors("type");
            }}
            options={accountTypeOptions}
            placeholder="Select account type"
            error={
              errors.type && (touchedFields.type || isSubmitted)
                ? errors.type.message
                : undefined
            }
            className={`h-12 text-lg ${
              errors.type && (touchedFields.type || isSubmitted)
                ? "border-red-500"
                : ""
            }`}
          />
        </motion.div>

        {/* Company Size */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.105, duration: 0.6 }}
        >
          <Select
            label="Company Size (Optional)"
            value={watch("employees") || ""}
            onChange={(value) => {
              setValue("employees", value, { shouldValidate: true });
              trigger("employees");
              if (errors.employees) clearErrors("employees");
            }}
            options={employeeSizeOptions}
            placeholder="Select company size"
            error={
              errors.employees && (touchedFields.employees || isSubmitted)
                ? errors.employees.message
                : undefined
            }
            className={`h-12 text-lg ${
              errors.employees && (touchedFields.employees || isSubmitted)
                ? "border-red-500"
                : ""
            }`}
          />
        </motion.div>

        {/* Revenue */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.11, duration: 0.6 }}
        >
          <Select
            label="Annual Revenue (Optional)"
            value={watch("revenue") || ""}
            onChange={(value) => {
              setValue("revenue", value, { shouldValidate: true });
              trigger("revenue");
              if (errors.revenue) clearErrors("revenue");
            }}
            options={revenueOptions}
            placeholder="Select revenue range"
            error={
              errors.revenue && (touchedFields.revenue || isSubmitted)
                ? errors.revenue.message
                : undefined
            }
            className={`h-12 text-lg ${
              errors.revenue && (touchedFields.revenue || isSubmitted)
                ? "border-red-500"
                : ""
            }`}
          />
        </motion.div>

        {/* Founded */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.115, duration: 0.6 }}
        >
          <Label
            htmlFor="founded"
            className="text-lg font-medium text-gray-900"
          >
            Founded Year (Optional)
          </Label>
          <Input
            id="founded"
            {...register("founded")}
            placeholder="e.g. 2020"
            className={`h-12 text-lg ${
              errors.founded && (touchedFields.founded || isSubmitted)
                ? "border-red-500"
                : "border-gray-300 focus:border-indigo-500"
            }`}
          />
          {errors.founded && (touchedFields.founded || isSubmitted) && (
            <p className="text-sm text-red-600">{errors.founded.message}</p>
          )}
        </motion.div>

        {/* Name */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-5 h-5 text-indigo-600" />
            <Label htmlFor="name" className="text-lg font-medium text-gray-900">
              Your Full Name *
            </Label>
          </div>
          <Input
            id="name"
            {...register("name", {
              onChange: (e) => {
                const value = e.target.value;
                setValue("name", value, { shouldValidate: false });
                if (errors.name && value.trim().length > 0) {
                  clearErrors("name");
                }
              },
              onBlur: () => {
                const value = watch("name");
                setValue("name", value.trim(), { shouldValidate: true });
                trigger("name");
              },
            })}
            placeholder="Enter your full name"
            aria-describedby={
              errors.name && (touchedFields.name || isSubmitted)
                ? "name-error"
                : undefined
            }
            className={`h-12 text-lg ${
              errors.name && (touchedFields.name || isSubmitted)
                ? "border-red-500"
                : "border-gray-300 focus:border-indigo-500"
            }`}
          />
          {errors.name && (touchedFields.name || isSubmitted) && (
            <p id="name-error" className="text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </motion.div>

        {/* Role */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">?</span>
            </div>
            <Label className="text-lg font-medium text-gray-900">
              What best describes you?
            </Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLE_OPTIONS.map((role, index) => (
              <motion.button
                key={role.value}
                type="button"
                onClick={() => handleRoleSelect(role.value)}
                className={`
                  p-6 text-left border-2 rounded-2xl transition-all duration-300 relative overflow-hidden
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                  ${
                    selectedRole === role.value
                      ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-900 shadow-lg transform scale-105"
                      : "border-gray-200 bg-white hover:border-indigo-300 text-gray-700 hover:shadow-md"
                  }
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: selectedRole === role.value ? 1.05 : 1.02,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-semibold text-lg">{role.label}</span>
                {selectedRole === role.value && (
                  <motion.div
                    className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
          {errors.role && (touchedFields.role || isSubmitted) && (
            <p className="text-sm text-red-600">{errors.role.message}</p>
          )}
        </motion.div>

        {/* Location */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <Label
              htmlFor="location"
              className="text-lg font-medium text-gray-900"
            >
              Location (Optional)
            </Label>
          </div>
          <Input
            id="location"
            {...register("location")}
            placeholder="e.g. San Francisco, CA"
            aria-describedby={errors.location ? "location-error" : undefined}
            className={`h-12 text-lg ${
              errors.location
                ? "border-red-500"
                : "border-gray-300 focus:border-indigo-500"
            }`}
          />
          {errors.location && (
            <p id="location-error" className="text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </motion.div>

        {/* Interests */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Heart className="w-5 h-5 text-indigo-600" />
            <Label className="text-lg font-medium text-gray-900">
              Interests (Optional)
            </Label>
            <span className="ml-auto text-sm font-medium bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
              {selectedInterests.length}/6 selected
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            Select up to 6 areas that interest you. This helps us recommend
            relevant opportunities and connect you with like-minded people.
          </p>

          {/* Selected interests */}
          {selectedInterests.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {selectedInterests.map((interest, index) => (
                <motion.button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 font-medium hover:from-indigo-200 hover:to-purple-200 transition-all duration-200 border border-indigo-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {interest}
                  <X className="w-4 h-4 ml-2" />
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Available interests */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INTEREST_OPTIONS.filter(
                (interest) => !selectedInterests.includes(interest)
              ).map((interest, index) => (
                <motion.button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  disabled={selectedInterests.length >= 6}
                  className={`
                    flex items-center justify-center px-4 py-3 text-sm border-2 rounded-xl transition-all duration-200 relative
                    ${
                      selectedInterests.length >= 6
                        ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100"
                        : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:shadow-md"
                    }
                  `}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.02, duration: 0.3 }}
                  whileHover={
                    selectedInterests.length < 6 ? { scale: 1.02, y: -2 } : {}
                  }
                  whileTap={selectedInterests.length < 6 ? { scale: 0.98 } : {}}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {interest}
                </motion.button>
              ))}
            </div>
          </div>

          {errors.interests && (
            <p className="text-sm text-red-600">{errors.interests.message}</p>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div
        className="flex items-center justify-between pt-8 border-t border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <div className="flex space-x-4">
          <WhiteButton
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            Back
          </WhiteButton>
          <WhiteButton
            type="button"
            onClick={onSkip}
            className="px-6 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            Skip for now
          </WhiteButton>
        </div>

        <div className="flex space-x-4">
          <WhiteButton
            type="button"
            onClick={handleSaveAndExit}
            disabled={isSaving}
            className="px-6 py-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50"
          >
            {isSaving ? "Saving..." : "Save & Exit"}
          </WhiteButton>
          <PurpleButton
            type="submit"
            disabled={isSaving}
            className="px-8 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isSaving ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </span>
            ) : (
              "Continue"
            )}
          </PurpleButton>
        </div>
      </motion.div>
    </form>
  );
}
