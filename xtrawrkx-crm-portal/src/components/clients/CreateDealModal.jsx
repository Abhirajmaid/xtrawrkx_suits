import { useState } from "react";
import { Input, Select, Button } from "../../components/ui";
import { X, Briefcase, DollarSign, Calendar, User } from "lucide-react";
import { BaseModal } from "../ui";

export default function CreateDealModal({ isOpen, onClose, client }) {
  const [formData, setFormData] = useState({
    dealName: "",
    pipelineStage: "qualification",
    dealValue: "",
    expectedCloseDate: "",
    primaryContact: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dealData = {
        ...formData,
        clientId: client?.id,
        clientName: client?.name,
        createdAt: new Date().toISOString(),
        createdBy: "Alex Johnson" // Current user
      };
      
      console.log('Creating deal:', dealData);
      // TODO: Implement actual deal creation logic
      
      onClose();
    } catch (error) {
      console.error('Error creating deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      dealName: "",
      pipelineStage: "qualification",
      dealValue: "",
      expectedCloseDate: "",
      primaryContact: "",
      description: ""
    });
    onClose();
  };

  const pipelineStages = [
    { value: "qualification", label: "Qualification" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed-won", label: "Closed Won" },
    { value: "closed-lost", label: "Closed Lost" }
  ];

  const clientContacts = [
    { value: "sarah-johnson", label: "Sarah Johnson (sarah.johnson@techcorp.com)" },
    { value: "mike-chen", label: "Mike Chen (mike.chen@techcorp.com)" },
    { value: "lisa-wang", label: "Lisa Wang (lisa.wang@techcorp.com)" }
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} size="big">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <Briefcase className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Create Deal</h2>
              <p className="text-xs text-gray-600">Create a new deal for {client?.name}</p>
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
          {/* Deal Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Briefcase className="w-4 h-4 inline mr-1" />
              Deal Name
            </label>
            <Input
              placeholder="e.g., Q4 Enterprise Software License"
              value={formData.dealName}
              onChange={(value) => handleInputChange('dealName', value)}
              required
            />
          </div>

          {/* Pipeline Stage and Deal Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pipeline Stage</label>
              <Select
                value={formData.pipelineStage}
                onChange={(value) => handleInputChange('pipelineStage', value)}
                options={pipelineStages}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Deal Value
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={formData.dealValue}
                onChange={(value) => handleInputChange('dealValue', value)}
                required
              />
            </div>
          </div>

          {/* Expected Close Date and Primary Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Expected Close Date
              </label>
              <Input
                type="date"
                value={formData.expectedCloseDate}
                onChange={(value) => handleInputChange('expectedCloseDate', value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Primary Contact
              </label>
              <Select
                value={formData.primaryContact}
                onChange={(value) => handleInputChange('primaryContact', value)}
                options={[
                  { value: "", label: "Select Primary Contact" },
                  ...clientContacts
                ]}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
              placeholder="Enter deal description or notes..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
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
            disabled={isSubmitting || !formData.dealName || !formData.dealValue || !formData.expectedCloseDate}
            className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            {isSubmitting ? "Creating..." : "Create Deal"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
