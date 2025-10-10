"use client";

import { useState } from "react";
import { Card, Button, Input, Select } from "../../../../../../../../components/ui";
import { X, Plus } from "lucide-react";

export default function AddDealModal({ isOpen, onClose, onAddDeal }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    value: "",
    stage: "discovery",
    priority: "medium",
    assignee: "John Smith"
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = "Deal title is required";
    }
    
    if (!formData.company.trim()) {
      errors.company = "Company name is required";
    }
    
    if (!formData.value || parseFloat(formData.value) <= 0) {
      errors.value = "Deal value must be greater than 0";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newDeal = {
        id: Date.now(),
        title: formData.title,
        company: formData.company,
        value: parseFloat(formData.value),
        stage: formData.stage,
        priority: formData.priority,
        assignee: formData.assignee,
        probability: 20,
        daysInStage: 0,
        createdAt: new Date().toISOString()
      };
      
      onAddDeal(newDeal);
      handleClose();
    } catch (error) {
      console.error('Error adding deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      company: "",
      value: "",
      stage: "discovery",
      priority: "medium",
      assignee: "John Smith"
    });
    setFormErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card 
        glass={true}
        className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl"
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
                <Plus className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add New Deal</h2>
                <p className="text-xs text-gray-600">Create a new sales opportunity</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Essential Fields Only */}
            <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal Title *
              </label>
                <Input
                value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter deal title"
                  error={formErrors.title}
              />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
                <Input
                value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Enter company name"
                  error={formErrors.company}
              />
          </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deal Value *
              </label>
                <Input
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  placeholder="Enter deal value"
                  error={formErrors.value}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stage
              </label>
                  <Select
                value={formData.stage}
                    onChange={(value) => handleInputChange('stage', value)}
                    options={[
                      { value: "discovery", label: "Discovery" },
                      { value: "proposal", label: "Proposal" },
                      { value: "negotiation", label: "Negotiation" }
                    ]}
              />
            </div>
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
                  <Select
                value={formData.priority}
                    onChange={(value) => handleInputChange('priority', value)}
                    options={[
                      { value: "high", label: "High" },
                      { value: "medium", label: "Medium" },
                      { value: "low", label: "Low" }
                    ]}
              />
            </div>
          </div>
        </div>

            {/* Action Buttons - NO BORDER LINE */}
            <div className="flex items-center justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg"
              >
                {isSubmitting ? "Adding..." : "Add Deal"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
        </div>
  );
}