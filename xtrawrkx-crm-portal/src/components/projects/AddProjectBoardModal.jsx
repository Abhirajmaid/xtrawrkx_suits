"use client";

import { useState } from "react";
import { Input, Select, Button } from "../../../../../../../../components/ui";
import { X, Plus, FolderPlus } from "lucide-react";
import { BaseModal } from "../ui";

export default function AddProjectBoardModal({ isOpen, onClose, onAddProject, targetStage = "planning" }) {
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    manager: "",
    teamSize: "",
    priority: "medium",
    estimatedHours: "",
    dueDate: "",
    stage: targetStage
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clients = [
    "TechCorp Inc", "StartupXYZ", "Global Solutions", "InnovateLab", 
    "DataCorp", "CreativeCo", "Future Systems", "Digital Dynamics"
  ];

  const managers = [
    "John Smith", "Emily Davis", "Michael Chen", "Sarah Wilson", 
    "Robert Martinez", "Lisa Anderson", "Alex Wilson", "Lisa Brown"
  ];

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Project name is required";
    if (!formData.client.trim()) errors.client = "Client is required";
    if (!formData.manager.trim()) errors.manager = "Manager is required";
    if (!formData.teamSize || formData.teamSize <= 0) errors.teamSize = "Valid team size is required";
    if (!formData.estimatedHours || formData.estimatedHours <= 0) errors.estimatedHours = "Valid estimated hours required";
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
      const newProject = {
        id: `p${Date.now()}`,
        name: formData.name,
        client: formData.client,
        progress: 0,
        health: "On Track",
        status: formData.stage,
        priority: formData.priority,
        manager: formData.manager,
        teamSize: parseInt(formData.teamSize),
        dueDate: formData.dueDate,
        estimatedHours: parseInt(formData.estimatedHours),
      };
      
      await onAddProject(newProject, formData.stage);
      
      // Reset form
      setFormData({
        name: "",
        client: "",
        manager: "",
        teamSize: "",
        priority: "medium",
        estimatedHours: "",
        dueDate: "",
        stage: targetStage
      });
      setFormErrors({});
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      client: "",
      manager: "",
      teamSize: "",
      priority: "medium",
      estimatedHours: "",
      dueDate: "",
      stage: targetStage
    });
    setFormErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} size="big">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <FolderPlus className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900">Add New Project</h2>
              <p className="text-sm text-gray-600">Create a new project for the board</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
              error={formErrors.name}
            />
            {formErrors.name && (
              <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Client and Manager */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client *
              </label>
              <Select
                value={formData.client}
                onChange={(value) => setFormData({ ...formData, client: value })}
                placeholder="Select client"
                options={clients.map(client => ({ value: client, label: client }))}
                error={formErrors.client}
              />
              {formErrors.client && (
                <p className="text-sm text-red-600 mt-1">{formErrors.client}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manager *
              </label>
              <Select
                value={formData.manager}
                onChange={(value) => setFormData({ ...formData, manager: value })}
                placeholder="Select manager"
                options={managers.map(manager => ({ value: manager, label: manager }))}
                error={formErrors.manager}
              />
              {formErrors.manager && (
                <p className="text-sm text-red-600 mt-1">{formErrors.manager}</p>
              )}
            </div>
          </div>

          {/* Team Size and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Size *
              </label>
              <Input
                type="number"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                placeholder="Number of team members"
                min="1"
                error={formErrors.teamSize}
              />
              {formErrors.teamSize && (
                <p className="text-sm text-red-600 mt-1">{formErrors.teamSize}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <Select
                value={formData.priority}
                onChange={(value) => setFormData({ ...formData, priority: value })}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "critical", label: "Critical" }
                ]}
              />
            </div>
          </div>

          {/* Estimated Hours and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Hours *
              </label>
              <Input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                placeholder="Total hours"
                min="1"
                error={formErrors.estimatedHours}
              />
              {formErrors.estimatedHours && (
                <p className="text-sm text-red-600 mt-1">{formErrors.estimatedHours}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                error={formErrors.dueDate}
              />
              {formErrors.dueDate && (
                <p className="text-sm text-red-600 mt-1">{formErrors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Stage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Stage
            </label>
            <Select
              value={formData.stage}
              onChange={(value) => setFormData({ ...formData, stage: value })}
              options={[
                { value: "planning", label: "Planning" },
                { value: "in-progress", label: "In Progress" },
                { value: "review", label: "Review" },
                { value: "completed", label: "Completed" }
              ]}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Project
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}
