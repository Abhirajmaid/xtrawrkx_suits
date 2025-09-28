import { Modal, Button, Input, Select } from '@xtrawrkx/ui';
import { X } from 'lucide-react';

export default function LeadsModal({ 
  isModalOpen, 
  handleModalClose, 
  formData, 
  handleInputChange, 
  handleSubmit, 
  formErrors, 
  isSubmitting 
}) {
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleModalClose}
      title="Add New Lead"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              label="First Name"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
              error={formErrors.firstName}
            />
            {formErrors.firstName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
            )}
          </div>
          <div>
            <Input 
              label="Last Name" 
              placeholder="Enter last name" 
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
            />
            {formErrors.lastName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
            )}
          </div>
        </div>
        
        <div>
          <Input
            label="Email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
          )}
        </div>
        
        <div>
          <Input 
            label="Phone" 
            type="tel" 
            placeholder="Enter phone number" 
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
          />
          {formErrors.phone && (
            <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
          )}
        </div>
        
        <div>
          <Input 
            label="Company" 
            placeholder="Enter company name" 
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            required
          />
          {formErrors.company && (
            <p className="text-red-500 text-xs mt-1">{formErrors.company}</p>
          )}
        </div>
        
        <div>
          <Input 
            label="Job Title" 
            placeholder="Enter job title" 
            value={formData.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
          />
        </div>
        
        <div>
          <Select
            label="Lead Source"
            value={formData.source}
            onChange={(value) => handleInputChange('source', value)}
            options={[
              { value: 'website', label: 'Website' },
              { value: 'referral', label: 'Referral' },
              { value: 'social', label: 'Social Media' },
              { value: 'email', label: 'Email Campaign' },
              { value: 'cold_call', label: 'Cold Call' },
              { value: 'other', label: 'Other' }
            ]}
            required
          />
          {formErrors.source && (
            <p className="text-red-500 text-xs mt-1">{formErrors.source}</p>
          )}
        </div>
        
        <div>
          <Input 
            label="Deal Value" 
            type="number" 
            placeholder="Enter deal value" 
            value={formData.value}
            onChange={(e) => handleInputChange('value', e.target.value)}
            required
          />
          {formErrors.value && (
            <p className="text-red-500 text-xs mt-1">{formErrors.value}</p>
          )}
        </div>
        
        <div>
          <Select
            label="Status"
            value={formData.status}
            onChange={(value) => handleInputChange('status', value)}
            options={[
              { value: 'new', label: 'New' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'qualified', label: 'Qualified' },
              { value: 'lost', label: 'Lost' }
            ]}
            required
          />
          {formErrors.status && (
            <p className="text-red-500 text-xs mt-1">{formErrors.status}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Enter any additional notes..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleModalClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
