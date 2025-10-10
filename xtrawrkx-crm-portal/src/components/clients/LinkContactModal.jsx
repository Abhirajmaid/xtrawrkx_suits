import { useState } from "react";
import { Input, Select, Button } from "../../../../../../../../components/ui";
import { X, UserPlus, Search, User } from "lucide-react";
import { BaseModal } from "../ui";

export default function LinkContactModal({ isOpen, onClose, client }) {
  const [formData, setFormData] = useState({
    searchQuery: "",
    selectedContact: "",
    role: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'searchQuery') {
      // Simulate search results
      if (value.length > 2) {
        const mockResults = [
          { id: "1", name: "Sarah Johnson", email: "sarah.johnson@techcorp.com", company: "TechCorp Inc." },
          { id: "2", name: "Mike Chen", email: "mike.chen@techcorp.com", company: "TechCorp Inc." },
          { id: "3", name: "Lisa Wang", email: "lisa.wang@techcorp.com", company: "TechCorp Inc." },
          { id: "4", name: "David Kim", email: "david.kim@techcorp.com", company: "TechCorp Inc." }
        ].filter(contact => 
          contact.name.toLowerCase().includes(value.toLowerCase()) ||
          contact.email.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(mockResults);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }
  };

  const handleContactSelect = (contact) => {
    setFormData(prev => ({ 
      ...prev, 
      selectedContact: contact.id,
      searchQuery: `${contact.name} (${contact.email})`
    }));
    setShowSearchResults(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const linkData = {
        contactId: formData.selectedContact,
        clientId: client?.id,
        clientName: client?.name,
        role: formData.role,
        linkedAt: new Date().toISOString(),
        linkedBy: "Alex Johnson" // Current user
      };
      
      console.log('Linking contact:', linkData);
      // TODO: Implement actual contact linking logic
      
      onClose();
    } catch (error) {
      console.error('Error linking contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      searchQuery: "",
      selectedContact: "",
      role: ""
    });
    setSearchResults([]);
    setShowSearchResults(false);
    onClose();
  };

  const contactRoles = [
    { value: "decision-maker", label: "Decision Maker" },
    { value: "influencer", label: "Influencer" },
    { value: "user", label: "User" },
    { value: "technical-lead", label: "Technical Lead" },
    { value: "procurement", label: "Procurement" },
    { value: "other", label: "Other" }
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} size="small">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <UserPlus className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Link Contact</h2>
              <p className="text-xs text-gray-600">Link an existing contact to {client?.name}</p>
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
          {/* Search Contact */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search className="w-4 h-4 inline mr-1" />
              Search Contact
            </label>
            <div className="relative">
              <Input
                placeholder="Search by name or email..."
                value={formData.searchQuery}
                onChange={(value) => handleInputChange('searchQuery', value)}
                required
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  {searchResults.map((contact) => (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => handleContactSelect(contact)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
                    >
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Contact Role
            </label>
            <Select
              value={formData.role}
              onChange={(value) => handleInputChange('role', value)}
              options={[
                { value: "", label: "Select Role" },
                ...contactRoles
              ]}
              required
            />
          </div>

          {/* Selected Contact Info */}
          {formData.selectedContact && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Contact Selected</span>
              </div>
              <p className="text-sm text-green-700 mt-1">{formData.searchQuery}</p>
            </div>
          )}
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
            disabled={isSubmitting || !formData.selectedContact || !formData.role}
            className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {isSubmitting ? "Linking..." : "Link Contact"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
