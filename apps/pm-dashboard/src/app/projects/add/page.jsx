"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Calendar,
  Users,
  Target,
  Building2,
} from "lucide-react";
import { Card } from "../../../components/ui/Card.jsx";
import { Input } from "../../../components/ui/Input.jsx";
import { Select } from "../../../components/ui/Select.jsx";
import { teamMembers, clients } from "../../../data/centralData";

export default function AddProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning",
    startDate: "",
    endDate: "",
    clientId: "",
    teamMemberIds: [],
    icon: "",
    color: "from-blue-400 to-blue-600",
  });

  const [errors, setErrors] = useState({});

  // Early return if data is not available
  if (!clients || !teamMembers) {
    return (
      <div className="min-h-screen bg-white p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading project data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Color options for project
  const colorOptions = [
    { value: "from-blue-400 to-blue-600", label: "Blue", color: "bg-blue-500" },
    {
      value: "from-green-400 to-green-600",
      label: "Green",
      color: "bg-green-500",
    },
    {
      value: "from-purple-400 to-purple-600",
      label: "Purple",
      color: "bg-purple-500",
    },
    { value: "from-pink-400 to-pink-600", label: "Pink", color: "bg-pink-500" },
    {
      value: "from-orange-400 to-orange-600",
      label: "Orange",
      color: "bg-orange-500",
    },
    { value: "from-red-400 to-red-600", label: "Red", color: "bg-red-500" },
    { value: "from-teal-400 to-teal-600", label: "Teal", color: "bg-teal-500" },
    {
      value: "from-indigo-400 to-indigo-600",
      label: "Indigo",
      color: "bg-indigo-500",
    },
  ];

  // Status options
  const statusOptions = [
    { value: "Planning", label: "Planning" },
    { value: "Active", label: "Active" },
    { value: "In Progress", label: "In Progress" },
    { value: "On Hold", label: "On Hold" },
    { value: "Completed", label: "Completed" },
  ];

  // Client options
  const clientOptions = clients
    ? Object.values(clients).map((client) => ({
        value: client.id,
        label: client.name,
      }))
    : [];

  // Team member options
  const teamOptions = teamMembers
    ? Object.values(teamMembers).map((member) => ({
        value: member.id,
        label: member.name,
        role: member.role,
        avatar: member.avatar,
        color: member.color,
      }))
    : [];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleTeamMemberToggle = (memberId) => {
    setFormData((prev) => ({
      ...prev,
      teamMemberIds: prev.teamMemberIds.includes(memberId)
        ? prev.teamMemberIds.filter((id) => id !== memberId)
        : [...prev.teamMemberIds, memberId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Project description is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!formData.clientId) {
      newErrors.clientId = "Client is required";
    }

    if (formData.teamMemberIds.length === 0) {
      newErrors.teamMemberIds = "At least one team member is required";
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
      // Generate slug from name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Generate icon from first letter of name
      const icon = formData.name.charAt(0).toUpperCase();

      // Create new project data
      const newProject = {
        ...formData,
        slug,
        icon,
        teamMemberIds: formData.teamMemberIds,
        budget: 0,
        spent: 0,
        progress: 0,
        tasksCount: "no task",
        bgColor: formData.color.includes("blue")
          ? "bg-blue-100"
          : formData.color.includes("green")
            ? "bg-green-100"
            : formData.color.includes("purple")
              ? "bg-purple-100"
              : formData.color.includes("pink")
                ? "bg-pink-100"
                : formData.color.includes("orange")
                  ? "bg-orange-100"
                  : formData.color.includes("red")
                    ? "bg-red-100"
                    : formData.color.includes("teal")
                      ? "bg-teal-100"
                      : formData.color.includes("indigo")
                        ? "bg-indigo-100"
                        : "bg-blue-100",
        textColor: formData.color.includes("blue")
          ? "text-blue-800"
          : formData.color.includes("green")
            ? "text-green-800"
            : formData.color.includes("purple")
              ? "text-purple-800"
              : formData.color.includes("pink")
                ? "text-pink-800"
                : formData.color.includes("orange")
                  ? "text-orange-800"
                  : formData.color.includes("red")
                    ? "text-red-800"
                    : formData.color.includes("teal")
                      ? "text-teal-800"
                      : formData.color.includes("indigo")
                        ? "text-indigo-800"
                        : "text-blue-800",
      };

      // In a real app, you would save this to your backend
      console.log("New project data:", newProject);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to projects page
      router.push("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Project
            </h1>
            <p className="text-gray-600">
              Set up a new project and assign team members
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Basic Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Project Name"
                    placeholder="Enter project name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    error={errors.name}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Description
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      placeholder="Describe the project goals and requirements"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className={`block w-full rounded-lg border shadow-sm px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none ${
                        errors.description
                          ? "border-red-300 text-red-900"
                          : "border-gray-300"
                      }`}
                      rows={4}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Icon
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter project icon (e.g., Y, M, F)"
                        value={formData.icon}
                        onChange={(e) =>
                          handleInputChange(
                            "icon",
                            e.target.value.toUpperCase()
                          )
                        }
                        maxLength={1}
                        className="block w-full rounded-lg border shadow-sm px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-center text-xl font-bold"
                      />
                    </div>

                    <Select
                      label="Status"
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      options={statusOptions}
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Project Timeline */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Project Timeline
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    error={errors.startDate}
                    required
                  />

                  <Input
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    error={errors.endDate}
                    required
                  />
                </div>
              </Card>

              {/* Client Selection */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Client
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Select
                    label="Client"
                    value={formData.clientId}
                    onChange={(e) =>
                      handleInputChange("clientId", e.target.value)
                    }
                    options={clientOptions}
                    placeholder="Select a client"
                    error={errors.clientId}
                    required
                  />
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Color */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Project Color
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange("color", option.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.color === option.value
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-full h-8 rounded ${option.color} mb-2`}
                      ></div>
                      <span className="text-xs text-gray-600">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Team Members */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Team Members
                  </h3>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {teamOptions && teamOptions.length > 0 ? (
                    teamOptions.map((member) => (
                      <div
                        key={member.value}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.teamMemberIds.includes(member.value)
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                        onClick={() => handleTeamMemberToggle(member.value)}
                      >
                        <div
                          className={`w-8 h-8 ${member.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                        >
                          {member.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {member.label}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {member.role}
                          </p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            formData.teamMemberIds.includes(member.value)
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {formData.teamMemberIds.includes(member.value) && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">
                        No team members available
                      </p>
                    </div>
                  )}
                </div>
                {errors.teamMemberIds && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.teamMemberIds}
                  </p>
                )}
              </Card>

              {/* Project Preview */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Preview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${formData.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-white font-bold text-lg">
                        {formData.icon || formData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {formData.name || "Project Name"}
                      </h4>
                      <span className="text-xs font-medium px-2 py-1 rounded-full border bg-yellow-100 text-yellow-700 border-yellow-200">
                        {formData.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {formData.description ||
                      "Project description will appear here"}
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Project...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Project
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
