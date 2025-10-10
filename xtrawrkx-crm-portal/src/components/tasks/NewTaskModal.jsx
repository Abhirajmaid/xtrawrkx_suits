"use client";

import { useState, useEffect } from "react";
import { Input, Select, Button } from "../ui";
import { X, Plus } from "lucide-react";
import { BaseModal } from "../ui";

export default function NewTaskModal({
  isOpen,
  onClose,
  onAddTask,
  targetStage = "todo",
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
    project: "",
    dueDate: "",
    estimatedHours: "",
    status: targetStage,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update status when targetStage changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, status: targetStage }));
  }, [targetStage]);

  const assignees = [
    "Sarah Johnson",
    "Mike Chen",
    "Jane Doe",
    "John Smith",
    "Alex Wilson",
    "Lisa Brown",
    "Tom Davis",
    "Emily Davis",
  ];

  const projects = [
    "Website Redesign",
    "API Development",
    "Client Portal",
    "CRM System",
    "Performance",
    "Payment System",
    "DevOps",
    "UI/UX",
  ];

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) errors.title = "Task title is required";
    if (!formData.assignee.trim()) errors.assignee = "Assignee is required";
    if (!formData.project.trim()) errors.project = "Project is required";
    if (!formData.dueDate) errors.dueDate = "Due date is required";

    if (formData.dueDate && new Date(formData.dueDate) <= new Date()) {
      errors.dueDate = "Due date must be in the future";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const newTask = {
        id: `t${Date.now()}`,
        title: formData.title,
        description: formData.description,
        status: "todo",
        priority: formData.priority,
        project: formData.project,
        assignee: formData.assignee,
        dueDate: formData.dueDate,
        estimatedHours: formData.estimatedHours
          ? parseInt(formData.estimatedHours)
          : null,
        tags: [],
      };

      onAddTask(newTask);
      handleClose();
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
      project: "",
      dueDate: "",
      estimatedHours: "",
      status: targetStage,
    });
    setFormErrors({});
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="big">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <Plus className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900"
              >
                Add New Task
              </h2>
              <p className="text-xs text-gray-600">Create a new task</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter task title"
              error={formErrors.title}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter task description"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee *
              </label>
              <Select
                value={formData.assignee}
                onChange={(value) => handleInputChange("assignee", value)}
                options={[
                  { value: "", label: "Select assignee" },
                  ...assignees.map((assignee) => ({
                    value: assignee,
                    label: assignee,
                  })),
                ]}
                error={formErrors.assignee}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <Select
                value={formData.priority}
                onChange={(value) => handleInputChange("priority", value)}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "urgent", label: "Urgent" },
                ]}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project *
            </label>
            <Select
              value={formData.project}
              onChange={(value) => handleInputChange("project", value)}
              options={[
                { value: "", label: "Select project" },
                ...projects.map((project) => ({
                  value: project,
                  label: project,
                })),
              ]}
              error={formErrors.project}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={formData.status}
              onChange={(value) => handleInputChange("status", value)}
              options={[
                { value: "todo", label: "To Do" },
                { value: "in-progress", label: "In Progress" },
                { value: "review", label: "Review" },
                { value: "completed", label: "Completed" },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                error={formErrors.dueDate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Hours
              </label>
              <Input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) =>
                  handleInputChange("estimatedHours", e.target.value)
                }
                placeholder="Hours"
                min="1"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="px-4 py-2 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg"
            >
              {isSubmitting ? "Adding..." : "Add Task"}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}
