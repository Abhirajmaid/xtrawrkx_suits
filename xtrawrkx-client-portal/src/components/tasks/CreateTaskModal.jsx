"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Flag,
  Clock,
  FileText,
  Tag,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";

export default function CreateTaskModal({ isOpen, onClose, onTaskCreate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignee: "",
    dueDate: "",
    priority: "medium",
    status: "todo",
    estimatedHours: "",
    tags: "",
  });

  const [errors, setErrors] = useState({});

  // Mock data for dropdowns
  const projects = [
    "Event Organization Website",
    "Health Mobile App Design",
    "Advance SEO Service",
    "E-commerce Platform",
  ];

  const assignees = [
    "Gabrial Matula",
    "Layla Amora",
    "Ansel Finn",
    "Sarah Johnson",
  ];

  const priorities = [
    { value: "low", label: "Low", color: "text-green-600" },
    { value: "medium", label: "Medium", color: "text-blue-600" },
    { value: "high", label: "High", color: "text-orange-600" },
    { value: "urgent", label: "Urgent", color: "text-red-600" },
  ];

  const statuses = [
    { value: "todo", label: "To Do", color: "text-gray-600" },
    { value: "in-progress", label: "In Progress", color: "text-blue-600" },
    { value: "review", label: "Review", color: "text-yellow-600" },
    { value: "completed", label: "Completed", color: "text-green-600" },
  ];

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.project) {
      newErrors.project = "Please select a project";
    }

    if (!formData.assignee) {
      newErrors.assignee = "Please select an assignee";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (
      formData.estimatedHours &&
      (isNaN(formData.estimatedHours) || formData.estimatedHours <= 0)
    ) {
      newErrors.estimatedHours = "Please enter a valid number of hours";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create task object
    const newTask = {
      id: `t${Date.now()}`, // Generate unique ID
      title: formData.title.trim(),
      description: formData.description.trim(),
      project: formData.project,
      assignee: formData.assignee,
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: formData.status,
      estimatedHours: formData.estimatedHours
        ? parseInt(formData.estimatedHours)
        : null,
      tags: formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Call the callback function
    onTaskCreate(newTask);

    // Reset form
    setFormData({
      title: "",
      description: "",
      project: "",
      assignee: "",
      dueDate: "",
      priority: "medium",
      status: "todo",
      estimatedHours: "",
      tags: "",
    });

    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      project: "",
      assignee: "",
      dueDate: "",
      priority: "medium",
      status: "todo",
      estimatedHours: "",
      tags: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="bg-white border border-gray-200 shadow-2xl rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Create New Task
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Add a new task to your project
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-200px)]"
              >
                {/* Task Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={`w-full px-4 py-3 bg-white border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200 ${
                      errors.title ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter task title..."
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    className={`w-full px-4 py-3 bg-white border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200 resize-none ${
                      errors.description ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Describe the task in detail..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Project and Assignee Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project *
                    </label>
                    <select
                      value={formData.project}
                      onChange={(e) =>
                        handleInputChange("project", e.target.value)
                      }
                      className={`w-full px-4 py-3 bg-white border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200 ${
                        errors.project ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a project</option>
                      {projects.map((project) => (
                        <option key={project} value={project}>
                          {project}
                        </option>
                      ))}
                    </select>
                    {errors.project && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.project}
                      </p>
                    )}
                  </div>

                  {/* Assignee */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignee *
                    </label>
                    <select
                      value={formData.assignee}
                      onChange={(e) =>
                        handleInputChange("assignee", e.target.value)
                      }
                      className={`w-full px-4 py-3 bg-white border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200 ${
                        errors.assignee ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select an assignee</option>
                      {assignees.map((assignee) => (
                        <option key={assignee} value={assignee}>
                          {assignee}
                        </option>
                      ))}
                    </select>
                    {errors.assignee && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.assignee}
                      </p>
                    )}
                  </div>
                </div>

                {/* Due Date and Priority Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        handleInputChange("dueDate", e.target.value)
                      }
                      className={`w-full px-4 py-3 bg-white border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200 ${
                        errors.dueDate ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.dueDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.dueDate}
                      </p>
                    )}
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        handleInputChange("priority", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
                    >
                      {priorities.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status and Estimated Hours Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Estimated Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedHours}
                      onChange={(e) =>
                        handleInputChange("estimatedHours", e.target.value)
                      }
                      min="1"
                      className={`w-full px-4 py-3 bg-white border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200 ${
                        errors.estimatedHours
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., 8"
                    />
                    {errors.estimatedHours && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.estimatedHours}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
                    placeholder="Enter tags separated by commas (e.g., frontend, urgent, design)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Separate multiple tags with commas
                  </p>
                </div>
              </form>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <ModernButton
                  type="secondary"
                  text="Cancel"
                  onClick={handleClose}
                  size="sm"
                />
                <ModernButton
                  type="primary"
                  text="Create Task"
                  icon={CheckCircle2}
                  onClick={handleSubmit}
                  size="sm"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
