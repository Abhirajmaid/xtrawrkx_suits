"use client";

import { useState } from "react";
import { Button, Input, Select, Textarea, Card } from "@xtrawrkx/ui";
import {
  User,
  Building2,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  MapPin,
  Globe,
  Save,
  X
} from "lucide-react";

export default function LeadCaptureForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    
    // Company Information
    company: '',
    industry: '',
    companySize: '',
    website: '',
    address: '',
    
    // Lead Details
    source: '',
    segment: 'warm',
    value: 0,
    status: 'new',
    assignee: '',
    
    // Additional Information
    description: '',
    notes: '',
    tags: []
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSave(formData);
  };

  const industryOptions = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
    'Education', 'Real Estate', 'Consulting', 'Other'
  ];

  const companySizeOptions = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
  ];

  const sourceOptions = [
    'Website', 'Referral', 'Social Media', 'Email Campaign', 'Trade Show',
    'Cold Call', 'LinkedIn', 'Google Ads', 'Other'
  ];

  const segmentOptions = [
    { value: 'hot', label: 'Hot', color: 'text-red-500' },
    { value: 'warm', label: 'Warm', color: 'text-orange-500' },
    { value: 'cold', label: 'Cold', color: 'text-blue-500' }
  ];

  const statusOptions = [
    'New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'
  ];

  const assigneeOptions = [
    'Alex Johnson', 'Sarah Wilson', 'Mike Chen', 'Lisa Wong', 'Tom Wilson'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-brand-foreground">Add New Lead</h2>
        <p className="text-brand-text-light">Capture lead information and add to your pipeline</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-brand-primary" />
            <h3 className="text-lg font-semibold text-brand-foreground">Basic Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                First Name *
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Last Name *
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Job Title
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. CTO, Marketing Manager, CEO"
              />
            </div>
          </div>
        </Card>

        {/* Company Information */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-brand-primary" />
            <h3 className="text-lg font-semibold text-brand-foreground">Company Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Company Name *
              </label>
              <Input
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Enter company name"
                className={errors.company ? 'border-red-500' : ''}
              />
              {errors.company && (
                <p className="text-red-500 text-xs mt-1">{errors.company}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Industry
              </label>
              <Select
                value={formData.industry}
                onValueChange={(value) => handleInputChange('industry', value)}
                placeholder="Select industry"
              >
                {industryOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Company Size
              </label>
              <Select
                value={formData.companySize}
                onValueChange={(value) => handleInputChange('companySize', value)}
                placeholder="Select size"
              >
                {companySizeOptions.map((option) => (
                  <option key={option} value={option}>{option} employees</option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Website
              </label>
              <Input
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://company.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Address
              </label>
              <Input
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter company address"
              />
            </div>
          </div>
        </Card>

        {/* Lead Details */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-brand-primary" />
            <h3 className="text-lg font-semibold text-brand-foreground">Lead Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Lead Source
              </label>
              <Select
                value={formData.source}
                onValueChange={(value) => handleInputChange('source', value)}
                placeholder="Select source"
              >
                {sourceOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Lead Segment
              </label>
              <Select
                value={formData.segment}
                onValueChange={(value) => handleInputChange('segment', value)}
              >
                {segmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Estimated Value
              </label>
              <Input
                type="number"
                value={formData.value}
                onChange={(e) => handleInputChange('value', parseInt(e.target.value) || 0)}
                placeholder="Enter estimated value"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option.toLowerCase()}>{option}</option>
                ))}
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Assign To
              </label>
              <Select
                value={formData.assignee}
                onValueChange={(value) => handleInputChange('assignee', value)}
                placeholder="Select assignee"
              >
                {assigneeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        {/* Additional Information */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-brand-primary" />
            <h3 className="text-lg font-semibold text-brand-foreground">Additional Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the lead and their needs..."
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Notes
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any additional notes..."
                rows={2}
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-brand-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Save Lead
          </Button>
        </div>
      </form>
    </div>
  );
}
