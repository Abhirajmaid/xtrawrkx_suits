"use client";

import { useState } from "react";
import { Card, Button, Input, Select } from "../../components/ui";
import { X, Plus } from "lucide-react";

export default function AddAccountModal({ isOpen, onClose, onAddAccount }) {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    type: "Prospect",
    owner: "John Smith",
    email: "",
    phone: "",
    website: ""
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
    
    if (!formData.name.trim()) {
      errors.name = "Company name is required";
    }
    
    if (!formData.industry.trim()) {
      errors.industry = "Industry is required";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
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
      const newAccount = {
        id: Date.now(),
        name: formData.name,
        industry: formData.industry,
        type: formData.type,
        owner: formData.owner,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        contacts: 0,
        deals: 0,
        revenue: 0,
        health: 75,
        lastActivity: "Account created",
        createdAt: new Date().toISOString()
      };

      onAddAccount(newAccount);
      handleClose();
    } catch (error) {
      console.error('Error adding account:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      industry: "",
      type: "Prospect",
      owner: "John Smith",
      email: "",
      phone: "",
      website: ""
    });
    setFormErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card 
        glass={true}
        className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-xl flex items-center justify-center shadow-lg">
                <Plus className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Add New Account</h2>
                <p className="text-sm text-gray-600">Create a new company account</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter company name"
                  error={formErrors.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry *
                </label>
                <Select
                  value={formData.industry}
                  onChange={(value) => handleInputChange('industry', value)}
                  options={[
                    { value: "", label: "Select Industry" },
                    { value: "Technology", label: "Technology" },
                    { value: "Manufacturing", label: "Manufacturing" },
                    { value: "Healthcare", label: "Healthcare" },
                    { value: "Finance", label: "Finance" },
                    { value: "Retail", label: "Retail" },
                    { value: "Education", label: "Education" },
                    { value: "Energy", label: "Energy" },
                    { value: "Marketing", label: "Marketing" },
                    { value: "Consulting", label: "Consulting" },
                    { value: "Real Estate", label: "Real Estate" }
                  ]}
                  error={formErrors.industry}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <Select
                  value={formData.type}
                  onChange={(value) => handleInputChange('type', value)}
                  options={[
                    { value: "Prospect", label: "Prospect" },
                    { value: "Customer", label: "Customer" },
                    { value: "Partner", label: "Partner" },
                    { value: "Vendor", label: "Vendor" }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Owner
                </label>
                <Select
                  value={formData.owner}
                  onChange={(value) => handleInputChange('owner', value)}
                  options={[
                    { value: "John Smith", label: "John Smith" },
                    { value: "Emily Davis", label: "Emily Davis" },
                    { value: "Sarah Wilson", label: "Sarah Wilson" },
                    { value: "Mike Johnson", label: "Mike Johnson" },
                    { value: "Lisa Brown", label: "Lisa Brown" }
                  ]}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contact@company.com"
                  error={formErrors.email}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://company.com"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleClose}
                className="px-6 py-2.5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg"
              >
                {isSubmitting ? "Adding Account..." : "Add Account"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}