import { useState } from "react";
import { Input, Button } from "@xtrawrkx/ui";
import { X, Share, Users, MessageSquare } from "lucide-react";
import { BaseModal } from "../ui";

export default function ShareContactModal({ isOpen, onClose, contact }) {
  const [formData, setFormData] = useState({
    selectedMembers: [],
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMemberToggle = (memberId) => {
    setFormData(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.includes(memberId)
        ? prev.selectedMembers.filter(id => id !== memberId)
        : [...prev.selectedMembers, memberId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const shareData = {
        contactId: contact?.id,
        contactName: contact?.name,
        sharedWith: formData.selectedMembers,
        message: formData.message,
        sharedAt: new Date().toISOString(),
        sharedBy: "Alex Johnson" // Current user
      };
      
      console.log('Sharing contact:', shareData);
      // TODO: Implement actual contact sharing logic
      
      onClose();
    } catch (error) {
      console.error('Error sharing contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      selectedMembers: [],
      message: ""
    });
    setSearchQuery("");
    onClose();
  };

  // Mock team members data
  const teamMembers = [
    { id: "alex-johnson", name: "Alex Johnson", email: "alex.johnson@company.com", role: "Sales Manager" },
    { id: "jane-doe", name: "Jane Doe", email: "jane.doe@company.com", role: "Account Manager" },
    { id: "mike-smith", name: "Mike Smith", email: "mike.smith@company.com", role: "Developer" },
    { id: "sarah-wilson", name: "Sarah Wilson", email: "sarah.wilson@company.com", role: "QA Lead" },
    { id: "david-brown", name: "David Brown", email: "david.brown@company.com", role: "Designer" }
  ];

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} size="small">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <Share className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Share Contact</h2>
              <p className="text-xs text-gray-600">Share {contact?.name} with team members</p>
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
          {/* Team Members Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Select Team Members
            </label>
            
            {/* Search */}
            <div className="mb-3">
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
              />
            </div>

            {/* Members List */}
            <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className={`p-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                    formData.selectedMembers.includes(member.id) ? 'bg-yellow-50 border-yellow-200' : ''
                  }`}
                  onClick={() => handleMemberToggle(member.id)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.selectedMembers.includes(member.id)}
                      onChange={() => handleMemberToggle(member.id)}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                      <p className="text-xs text-gray-400">{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {formData.selectedMembers.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {formData.selectedMembers.length} member(s) selected
              </p>
            )}
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Message (Optional)
            </label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
              placeholder="Add a message about why you're sharing this contact..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
            />
          </div>

          {/* Contact Preview */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Contact to share:</p>
            <p className="text-sm font-medium text-gray-900">{contact?.name}</p>
            <p className="text-xs text-gray-600">{contact?.email}</p>
            <p className="text-xs text-gray-600">{contact?.company}</p>
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
            disabled={isSubmitting || formData.selectedMembers.length === 0}
            className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg flex items-center gap-2"
          >
            <Share className="w-4 h-4" />
            {isSubmitting ? "Sharing..." : "Share Contact"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
