"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Label } from "@/components/ui";
import {
  BlueButton,
  PurpleButton,
  WhiteButton,
  GreenButton,
} from "@/components/ui";
import { Icon } from "@iconify/react";
import {
  Building,
  MapPin,
  User,
  Phone,
  Briefcase,
  Globe,
  CheckCircle,
} from "lucide-react";

export function CommunitiesStep({ onNext, onBack }) {
  const [selectedCommunities, setSelectedCommunities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [formData, setFormData] = useState({
    designation: "",
    entity: "",
    officialEmail: "",
    waNumber: "",
    stage: "",
    introduction: "",
    lookingFor: [],
    userType: "",
    city: "",
    linkedinProfile: "",
  });

  const totalFormSteps = 5;

  const communities = [
    {
      id: "XEN",
      name: "XEN",
      description: "For early-stage entrepreneurs building the next big thing",
      icon: "material-symbols:rocket-launch",
      color: "bg-blue-500",
      iconColor: "text-white",
      freeTier: true,
      members: "2.5k+ members",
      category: "Entrepreneurship",
      features: ["Startup mentorship", "Pitch events", "Networking"],
    },
    {
      id: "XEVFIN",
      name: "XEV.FiN",
      description: "Connect with investors and raise capital for your startup",
      icon: "material-symbols:monetization-on",
      color: "bg-green-500",
      iconColor: "text-white",
      freeTier: false,
      members: "1.8k+ members",
      category: "Funding & Investment",
      features: ["Investor matching", "Due diligence", "Term sheets"],
    },
    {
      id: "XEVTG",
      name: "XEVTG",
      description: "Tech talent marketplace for professionals and companies",
      icon: "material-symbols:work",
      color: "bg-purple-500",
      iconColor: "text-white",
      freeTier: true,
      members: "4.2k+ members",
      category: "Tech Talent",
      features: ["Job matching", "Skill assessments", "Remote work"],
    },
    {
      id: "XDD",
      name: "xD&D",
      description: "Design & development community for creators",
      icon: "material-symbols:palette",
      color: "bg-pink-500",
      iconColor: "text-white",
      freeTier: true,
      members: "3.1k+ members",
      category: "Design & Development",
      features: ["Portfolio reviews", "Collaboration", "Workshops"],
    },
  ];

  const lookingForOptions = [
    "Network with emerging startups",
    "Equity Funding",
    "Debt & similar facilities",
    "Fundraising / Financial consultant",
    "Offer financial services & advice",
    "Learning & teaching",
    "Seeking Business",
    "Sourcing Parts",
    "Hiring Talent",
    "Finding Co-founders",
    "Seeking Jobs/Vacancies ( For TPOs )",
  ];

  const userTypeOptions = [
    "Angel Investor",
    "VC Fund",
    "Family Office",
    "Alternative investment platform",
    "Investment Banker",
    "EV Startup",
    "EV company /Automotive company ( non startup)",
    "Financial consultant / expert / mentor",
    "Academician / Scholar / Researcher",
    "Media",
    "Government representative / policy / think tank",
    "Venture Debt / Private Lender / Institutional Lender",
    "HR",
    "TPO",
    "Drone / Defense Startup",
    "Aerospace - corporate",
    "Others",
  ];

  const handleCommunityToggle = (communityId) => {
    setSelectedCommunities((prev) =>
      prev.includes(communityId)
        ? prev.filter((id) => id !== communityId)
        : [...prev, communityId]
    );
  };

  const handleContinueToForm = () => {
    if (selectedCommunities.length > 0) {
      setShowForm(true);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLookingForToggle = (option) => {
    setFormData((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(option)
        ? prev.lookingFor.filter((item) => item !== option)
        : [...prev.lookingFor, option],
    }));
  };

  const handleNextFormStep = () => {
    if (currentFormStep < totalFormSteps) {
      setCurrentFormStep((prev) => prev + 1);
    }
  };

  const handlePrevFormStep = () => {
    if (currentFormStep > 1) {
      setCurrentFormStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ communities: selectedCommunities, ...formData });
  };

  const isCurrentStepValid = () => {
    switch (currentFormStep) {
      case 1: // Personal & Professional
        return (
          formData.designation &&
          formData.entity &&
          formData.officialEmail &&
          formData.waNumber
        );
      case 2: // Location & Stage
        return formData.city && formData.linkedinProfile;
      case 3: // User Profile (You are)
        return formData.userType;
      case 4: // Interests & Goals (You are looking for)
        return formData.lookingFor.length > 0;
      case 5: // Review
        return true;
      default:
        return false;
    }
  };

  const isFormValid =
    formData.designation &&
    formData.entity &&
    formData.officialEmail &&
    formData.waNumber &&
    formData.userType &&
    formData.city &&
    formData.linkedinProfile;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!showForm ? (
          // Community Selection Phase
          <motion.div
            key="community-selection"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                Available Communities
              </h1>
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-base">
                  Choose the communities that align with your interests and
                  goals.
                </p>
                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  {selectedCommunities.length} selected
                </span>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> You can join multiple communities to
                  expand your network and opportunities. Each community offers
                  unique resources and connections.
                </p>
              </div>
            </motion.div>

            {/* Communities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {communities.map((community, index) => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                  onClick={() => handleCommunityToggle(community.id)}
                  className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedCommunities.includes(community.id)
                      ? "border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  {/* Selection indicator */}
                  {selectedCommunities.includes(community.id) && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}

                  {/* Community Icon */}
                  <div
                    className={`w-16 h-16 ${community.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon
                      icon={community.icon}
                      className={`text-3xl ${community.iconColor}`}
                    />
                  </div>

                  {/* Community Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {community.name}
                      </h3>
                      {community.freeTier && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          Free tier
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {community.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium">{community.members}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded-full">
                          {community.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {community.features.slice(0, 2).map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md"
                          >
                            {feature}
                          </span>
                        ))}
                        {community.features.length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{community.features.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex justify-between items-center pt-6 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <WhiteButton
                type="button"
                onClick={onBack}
                className="px-6 py-2 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Back
              </WhiteButton>

              <PurpleButton
                onClick={handleContinueToForm}
                disabled={selectedCommunities.length === 0}
                className={`px-8 py-3 font-medium rounded-lg transition-all duration-300 ${
                  selectedCommunities.length > 0
                    ? ""
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {selectedCommunities.length === 0
                  ? "Select at least one community"
                  : `Continue with ${selectedCommunities.length} communit${
                      selectedCommunities.length === 1 ? "y" : "ies"
                    }`}
              </PurpleButton>
            </motion.div>
          </motion.div>
        ) : (
          // Application Form Phase
          <motion.div
            key="application-form"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Form Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                Community Application
              </h1>
              <p className="text-gray-600 text-base mb-4">
                Complete your application to join the selected communities.
              </p>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-6">
                {Array.from({ length: totalFormSteps }, (_, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300 ${
                        index + 1 < currentFormStep
                          ? "bg-green-500 text-white"
                          : index + 1 === currentFormStep
                          ? "bg-purple-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {index + 1 < currentFormStep ? "✓" : index + 1}
                    </div>
                    {index < totalFormSteps - 1 && (
                      <div
                        className={`w-16 h-1 mx-2 transition-all duration-300 ${
                          index + 1 < currentFormStep
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Selected Communities:</strong>{" "}
                  {selectedCommunities.join(", ")}
                </p>
              </div>
            </div>

            {/* Multi-Step Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Personal & Professional Information */}
                {currentFormStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-blue-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Personal & Professional Information
                      </h2>
                      <p className="text-gray-600">
                        Tell us about yourself and your role in the organization
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="designation"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Designation *
                        </Label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="designation"
                            value={formData.designation}
                            onChange={(e) =>
                              handleFormChange("designation", e.target.value)
                            }
                            placeholder="CEO, Founder, Manager..."
                            className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="entity"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Which entity do you represent? *
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="entity"
                            value={formData.entity}
                            onChange={(e) =>
                              handleFormChange("entity", e.target.value)
                            }
                            placeholder="Company name or organization"
                            className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="officialEmail"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Official Email ID *
                        </Label>
                        <div className="relative">
                          <Icon
                            icon="material-symbols:mail"
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                          />
                          <Input
                            id="officialEmail"
                            type="email"
                            value={formData.officialEmail}
                            onChange={(e) =>
                              handleFormChange("officialEmail", e.target.value)
                            }
                            placeholder="official@company.com"
                            className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="waNumber"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          WhatsApp Contact Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="waNumber"
                            type="tel"
                            value={formData.waNumber}
                            onChange={(e) =>
                              handleFormChange("waNumber", e.target.value)
                            }
                            placeholder="WhatsApp number for group"
                            className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Location & Business Stage */}
                {currentFormStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-green-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Location & Business Details
                      </h2>
                      <p className="text-gray-600">
                        Where are you based and what stage is your business at?
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Which City do you operate from? *
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) =>
                              handleFormChange("city", e.target.value)
                            }
                            placeholder="City name"
                            className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="stage"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          What stage are you at?
                        </Label>
                        <div className="relative">
                          <Icon
                            icon="material-symbols:trending-up"
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                          />
                          <Input
                            id="stage"
                            value={formData.stage}
                            onChange={(e) =>
                              handleFormChange("stage", e.target.value)
                            }
                            placeholder="Seed, Series A, etc."
                            className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="linkedinProfile"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        LinkedIn Profile *
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="linkedinProfile"
                          value={formData.linkedinProfile}
                          onChange={(e) =>
                            handleFormChange("linkedinProfile", e.target.value)
                          }
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="introduction"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Short introduction to your entity
                      </Label>
                      <textarea
                        id="introduction"
                        value={formData.introduction}
                        onChange={(e) =>
                          handleFormChange("introduction", e.target.value)
                        }
                        placeholder="Brief description of your company/organization..."
                        rows={4}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: User Profile */}
                {currentFormStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-purple-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Your Profile
                      </h2>
                      <p className="text-gray-600">
                        Tell us about your professional background and role
                      </p>
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-4">
                        You are: *
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                        {userTypeOptions.map((type) => (
                          <motion.div
                            key={type}
                            className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                              formData.userType === type
                                ? "border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg"
                                : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                            }`}
                            onClick={() => handleFormChange("userType", type)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Selection indicator */}
                            {formData.userType === type && (
                              <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  ✓
                                </span>
                              </div>
                            )}

                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  formData.userType === type
                                    ? "bg-purple-500"
                                    : "bg-gray-100"
                                }`}
                              >
                                <span
                                  className={`text-sm font-bold ${
                                    formData.userType === type
                                      ? "text-white"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {type.charAt(0)}
                                </span>
                              </div>
                              <span
                                className={`text-sm font-medium ${
                                  formData.userType === type
                                    ? "text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {type}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {formData.userType && (
                      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-sm text-purple-800">
                          <strong>✓ Selected:</strong> {formData.userType}
                        </p>
                        <p className="text-xs text-purple-600 mt-1">
                          This helps us connect you with the right communities
                          and opportunities.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Interests & Goals */}
                {currentFormStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-green-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Interests & Goals
                      </h2>
                      <p className="text-gray-600">
                        What are you looking to achieve through these
                        communities?
                      </p>
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-4">
                        You are looking for: *
                      </Label>
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {lookingForOptions.map((option) => (
                          <motion.div
                            key={option}
                            className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                              formData.lookingFor.includes(option)
                                ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
                                : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
                            }`}
                            onClick={() => handleLookingForToggle(option)}
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Selection indicator */}
                            {formData.lookingFor.includes(option) && (
                              <div className="absolute top-3 right-3 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  ✓
                                </span>
                              </div>
                            )}

                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  formData.lookingFor.includes(option)
                                    ? "bg-green-500"
                                    : "bg-gray-100"
                                }`}
                              >
                                <span
                                  className={`text-lg ${
                                    formData.lookingFor.includes(option)
                                      ? "text-white"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {option.includes("Network")
                                    ? "🤝"
                                    : option.includes("Funding")
                                    ? "💰"
                                    : option.includes("Debt")
                                    ? "🏦"
                                    : option.includes("consultant")
                                    ? "💼"
                                    : option.includes("services")
                                    ? "🛠️"
                                    : option.includes("Learning")
                                    ? "📚"
                                    : option.includes("Business")
                                    ? "🏢"
                                    : option.includes("Parts")
                                    ? "⚙️"
                                    : option.includes("Talent")
                                    ? "👥"
                                    : option.includes("Co-founders")
                                    ? "🤝"
                                    : "💼"}
                                </span>
                              </div>
                              <div className="flex-1">
                                <span
                                  className={`text-sm font-medium ${
                                    formData.lookingFor.includes(option)
                                      ? "text-gray-900"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {option}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {formData.lookingFor.length > 0 && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>✓ Selected:</strong>{" "}
                            {formData.lookingFor.length} interest
                            {formData.lookingFor.length === 1 ? "" : "s"}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Select multiple options to maximize your networking
                            opportunities.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Review & Submit */}
                {currentFormStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-orange-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Review Your Application
                      </h2>
                      <p className="text-gray-600">
                        Please review your information before submitting to
                        communities
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Personal Information Card */}
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <User className="w-5 h-5 text-blue-600 mr-2" />
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              Designation:
                            </span>
                            <p className="text-gray-900 font-medium">
                              {formData.designation || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              Entity:
                            </span>
                            <p className="text-gray-900 font-medium">
                              {formData.entity || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              Email:
                            </span>
                            <p className="text-gray-900 font-medium">
                              {formData.officialEmail || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              WhatsApp:
                            </span>
                            <p className="text-gray-900 font-medium">
                              {formData.waNumber || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Business Information Card */}
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Building className="w-5 h-5 text-green-600 mr-2" />
                          Business Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              City:
                            </span>
                            <p className="text-gray-900 font-medium">
                              {formData.city || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              Stage:
                            </span>
                            <p className="text-gray-900 font-medium">
                              {formData.stage || "Not specified"}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-sm font-medium text-gray-500">
                              LinkedIn Profile:
                            </span>
                            <p className="text-gray-900 font-medium truncate">
                              {formData.linkedinProfile || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Profile & Interests Card */}
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Briefcase className="w-5 h-5 text-purple-600 mr-2" />
                          Profile & Interests
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              User Type:
                            </span>
                            <p className="text-gray-900 font-medium">
                              {formData.userType || "Not specified"}
                            </p>
                          </div>

                          {formData.lookingFor.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">
                                Looking For:
                              </span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {formData.lookingFor.map((item, index) => (
                                  <span
                                    key={index}
                                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {formData.introduction && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">
                                Introduction:
                              </span>
                              <p className="text-gray-900 mt-1 leading-relaxed">
                                {formData.introduction}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Navigation */}
              <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                <div className="flex space-x-3">
                  <WhiteButton
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Back to Communities
                  </WhiteButton>

                  {currentFormStep > 1 && (
                    <WhiteButton
                      type="button"
                      onClick={handlePrevFormStep}
                      className="px-6 py-2 border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Previous
                    </WhiteButton>
                  )}
                </div>

                <div className="flex space-x-3">
                  {currentFormStep < totalFormSteps ? (
                    <PurpleButton
                      type="button"
                      onClick={handleNextFormStep}
                      disabled={!isCurrentStepValid()}
                      className={`px-8 py-3 font-medium rounded-lg transition-all duration-300 ${
                        isCurrentStepValid()
                          ? ""
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Next Step
                    </PurpleButton>
                  ) : (
                    <GreenButton
                      type="submit"
                      disabled={!isFormValid}
                      className={`px-8 py-3 font-medium rounded-lg transition-all duration-300 ${
                        isFormValid
                          ? ""
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Submit Application
                    </GreenButton>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
