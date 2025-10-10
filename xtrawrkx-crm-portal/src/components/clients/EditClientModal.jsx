import { useState } from "react";
import { Input, Select, Button } from "../../components/ui";
import { X, Building2, User, Mail, Phone, Globe, MapPin, Tag } from "lucide-react";
import { BaseModal } from "../ui";

export default function EditClientModal({ isOpen, onClose, client }) {
  const [formData, setFormData] = useState({
    name: client?.name || "",
    industry: client?.industry || "",
    primaryContact: client?.primaryContact || "",
    owner: client?.owner || "",
    email: client?.email || "",
    phone: client?.phone || "",
    website: client?.website || "",
    address: {
      street: client?.address?.street || "",
      city: client?.address?.city || "",
      state: client?.address?.state || "",
      zip: client?.address?.zip || "",
      country: client?.address?.country || "USA"
    },
    tags: client?.tags || [],
    status: client?.status || "active"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updateData = {
        ...formData,
        clientId: client?.id,
        updatedAt: new Date().toISOString(),
        updatedBy: "Alex Johnson" // Current user
      };
      
      console.log('Updating client:', updateData);
      // TODO: Implement actual client update logic
      
      onClose();
    } catch (error) {
      console.error('Error updating client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form data to original client data
    setFormData({
      name: client?.name || "",
      industry: client?.industry || "",
      primaryContact: client?.primaryContact || "",
      owner: client?.owner || "",
      email: client?.email || "",
      phone: client?.phone || "",
      website: client?.website || "",
      address: {
        street: client?.address?.street || "",
        city: client?.address?.city || "",
        state: client?.address?.state || "",
        zip: client?.address?.zip || "",
        country: client?.address?.country || "USA"
      },
      tags: client?.tags || [],
      status: client?.status || "active"
    });
    onClose();
  };

  const industries = [
    "Technology", "Healthcare", "Finance", "Manufacturing", "SaaS", 
    "Consulting", "Marketing", "Education", "Retail", "Real Estate"
  ];

  const owners = [
    "Alex Johnson", "Jane Doe", "Mike Smith", "Sarah Wilson"
  ];

  const commonTags = [
    'enterprise', 'vip', 'technology', 'startup', 'saas', 'growth', 
    'consulting', 'high-value', 'research', 'innovation', 'mid-market', 
    'marketing', 'priority'
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} size="big">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <Building2 className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Edit Client</h2>
              <p className="text-xs text-gray-600">Update client information for {client?.name}</p>
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
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Building2 className="w-4 h-4 inline mr-1" />
                Company Name
              </label>
              <Input
                placeholder="e.g., TechCorp Inc."
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <Select
                value={formData.industry}
                onChange={(value) => handleInputChange('industry', value)}
                options={[
                  { value: "", label: "Select Industry" },
                  ...industries.map(i => ({ value: i, label: i }))
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Primary Contact
              </label>
              <Input
                placeholder="e.g., Sarah Johnson"
                value={formData.primaryContact}
                onChange={(value) => handleInputChange('primaryContact', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Owner</label>
              <Select
                value={formData.owner}
                onChange={(value) => handleInputChange('owner', value)}
                options={[
                  { value: "", label: "Select Owner" },
                  ...owners.map(o => ({ value: o, label: o }))
                ]}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <Input
                type="email"
                placeholder="e.g., info@techcorp.com"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="e.g., +1 (555) 123-4567"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Globe className="w-4 h-4 inline mr-1" />
                Website
              </label>
              <Input
                type="url"
                placeholder="e.g., https://techcorp.com"
                value={formData.website}
                onChange={(value) => handleInputChange('website', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                value={formData.status}
                onChange={(value) => handleInputChange('status', value)}
                options={[
                  { value: "active", label: "Active" },
                  { value: "prospect", label: "Prospect" },
                  { value: "on-hold", label: "On Hold" },
                  { value: "inactive", label: "Inactive" }
                ]}
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              <MapPin className="w-5 h-5 inline mr-1" />
              Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <Input
                  placeholder="e.g., 123 Business Ave"
                  value={formData.address.street}
                  onChange={(value) => handleInputChange('address.street', value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <Input
                  placeholder="e.g., San Francisco"
                  value={formData.address.city}
                  onChange={(value) => handleInputChange('address.city', value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                <Input
                  placeholder="e.g., CA"
                  value={formData.address.state}
                  onChange={(value) => handleInputChange('address.state', value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip/Postal Code</label>
                <Input
                  placeholder="e.g., 94105"
                  value={formData.address.zip}
                  onChange={(value) => handleInputChange('address.zip', value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <Select
                  value={formData.address.country}
                  onChange={(value) => handleInputChange('address.country', value)}
                  options={[
                    { value: "USA", label: "USA" },
                    { value: "Canada", label: "Canada" },
                    { value: "UK", label: "UK" },
                    { value: "Australia", label: "Australia" }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {commonTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-yellow-400 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={handleClose} className="px-4 py-2 text-sm">
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name}
            className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
