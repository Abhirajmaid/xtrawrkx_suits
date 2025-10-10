"use client";

import { useState } from "react";
import { Input, Select, Button } from "../../../../../../../../components/ui";
import { X, Plus } from "lucide-react";
import { BaseModal } from "../ui";
import { clients, teamMembers } from "../../lib/data/projectsData";

export default function NewProjectModal({ isOpen, onClose, onAddProject }) {
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    description: "",
    priority: "Medium",
    budget: "",
    startDate: "",
    endDate: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Project name is required";
    if (!formData.client.trim()) errors.client = "Client is required";
    if (!formData.budget || formData.budget <= 0) errors.budget = "Valid budget is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.endDate) errors.endDate = "End date is required";
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = "End date must be after start date";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const newProject = {
        id: Date.now(),
        name: formData.name,
        client: formData.client,
        description: formData.description,
        priority: formData.priority,
        budget: parseFloat(formData.budget),
        startDate: formData.startDate,
        endDate: formData.endDate,
        stage: "planning",
        progress: 0,
        health: "Good",
        teamMembers: [],
        createdAt: new Date().toISOString()
      };

      onAddProject(newProject);
      handleClose();
    } catch (error) {
      console.error('Error adding project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      client: "",
      description: "",
      priority: "Medium",
      budget: "",
      startDate: "",
      endDate: ""
    });
    setFormErrors({});
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
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
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Add New Project</h2>
              <p className="text-xs text-gray-600">Create a new project</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter project name"
              error={formErrors.name}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
            <Select
              value={formData.client}
              onChange={(value) => handleInputChange('client', value)}
              options={[
                { value: "", label: "Select client" },
                ...clients.map(client => ({ value: client, label: client }))
              ]}
              error={formErrors.client}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter project description"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <Select
                value={formData.priority}
                onChange={(value) => handleInputChange('priority', value)}
                options={[
                  { value: "High", label: "High" },
                  { value: "Medium", label: "Medium" },
                  { value: "Low", label: "Low" }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget *</label>
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="Enter budget"
                error={formErrors.budget}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                error={formErrors.startDate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                error={formErrors.endDate}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <Button variant="outline" onClick={handleClose} className="px-4 py-2 text-sm">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg"
            >
              {isSubmitting ? "Adding..." : "Add Project"}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}