"use client";

import { useState } from "react";
import { Button, Modal, Input, Select, Checkbox } from "../../../../../../../../../components/ui";
import {
  X,
  User,
  Building2,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function LeadConversionModal({ isOpen, onClose, lead, onConvert }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Contact fields
    firstName: lead?.contact?.split(' ')[0] || '',
    lastName: lead?.contact?.split(' ').slice(1).join(' ') || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    title: '',
    department: '',
    
    // Company fields
    companyName: lead?.company || '',
    industry: '',
    companySize: '',
    website: '',
    address: '',
    
    // Deal fields
    createDeal: true,
    dealName: '',
    dealValue: lead?.value || 0,
    dealStage: 'Qualification',
    expectedCloseDate: '',
    probability: 25,
    
    // Additional fields
    notes: '',
    tags: []
  });

  const [fieldMapping, setFieldMapping] = useState({
    firstName: 'contact',
    lastName: 'contact',
    email: 'email',
    phone: 'phone',
    companyName: 'company',
    dealValue: 'value'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConvert = () => {
    const convertedData = {
      contact: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        title: formData.title,
        department: formData.department,
        company: formData.companyName,
        industry: formData.industry,
        companySize: formData.companySize,
        website: formData.website,
        address: formData.address
      },
      deal: formData.createDeal ? {
        name: formData.dealName,
        value: formData.dealValue,
        stage: formData.dealStage,
        expectedCloseDate: formData.expectedCloseDate,
        probability: formData.probability
      } : null,
      notes: formData.notes,
      tags: formData.tags
    };

    onConvert(convertedData);
    onClose();
  };

  const industryOptions = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
    'Education', 'Real Estate', 'Consulting', 'Other'
  ];

  const companySizeOptions = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
  ];

  const dealStageOptions = [
    'Qualification', 'Needs Analysis', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-brand-foreground">Convert Lead</h2>
            <p className="text-sm text-brand-text-light">
              Convert "{lead?.name}" to Contact{formData.createDeal ? ' and Deal' : ''}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              step >= 1 ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <User className="w-4 h-4" />
              Contact
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              step >= 2 ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <Building2 className="w-4 h-4" />
              Company
            </div>
            {formData.createDeal && (
              <>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  step >= 3 ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <DollarSign className="w-4 h-4" />
                  Deal
                </div>
              </>
            )}
          </div>
        </div>

        {/* Step 1: Contact Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  First Name *
                </label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Last Name *
                </label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Job Title
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. CTO, Marketing Manager"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Department
                </label>
                <Input
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="e.g. Engineering, Sales"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Company Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Company Name *
              </label>
              <Input
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  placeholder="Enter address"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="createDeal"
                checked={formData.createDeal}
                onCheckedChange={(checked) => handleInputChange('createDeal', checked)}
              />
              <label htmlFor="createDeal" className="text-sm text-brand-foreground">
                Create a deal for this contact
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Deal Information */}
        {step === 3 && formData.createDeal && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Deal Name *
              </label>
              <Input
                value={formData.dealName}
                onChange={(e) => handleInputChange('dealName', e.target.value)}
                placeholder="Enter deal name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Deal Value
                </label>
                <Input
                  type="number"
                  value={formData.dealValue}
                  onChange={(e) => handleInputChange('dealValue', parseInt(e.target.value) || 0)}
                  placeholder="Enter deal value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Stage
                </label>
                <Select
                  value={formData.dealStage}
                  onValueChange={(value) => handleInputChange('dealStage', value)}
                >
                  {dealStageOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Expected Close Date
                </label>
                <Input
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => handleInputChange('expectedCloseDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Probability (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => handleInputChange('probability', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any additional notes..."
                className="w-full p-3 border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-none"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-brand-border">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {step < (formData.createDeal ? 3 : 2) ? (
              <Button onClick={() => setStep(step + 1)}>
                Next
              </Button>
            ) : (
              <Button onClick={handleConvert}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Convert Lead
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
