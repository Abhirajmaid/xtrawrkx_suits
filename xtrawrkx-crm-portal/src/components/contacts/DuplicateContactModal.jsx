import { useState } from "react";
import { Button } from "../../components/ui";
import { X, Copy, AlertTriangle } from "lucide-react";
import { BaseModal } from "../ui";

export default function DuplicateContactModal({ isOpen, onClose, contact }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const duplicateData = {
        originalContactId: contact?.id,
        originalContactName: contact?.name,
        duplicatedAt: new Date().toISOString(),
        duplicatedBy: "Alex Johnson" // Current user
      };
      
      console.log('Duplicating contact:', duplicateData);
      // TODO: Implement actual contact duplication logic
      
      onClose();
    } catch (error) {
      console.error('Error duplicating contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="small">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <Copy className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Duplicate Contact</h2>
              <p className="text-xs text-gray-600">Create a copy of this contact</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Are you sure you want to duplicate this contact?
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            This will create a new contact record with the same details as <strong>{contact?.name}</strong>.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-3 text-left">
            <p className="text-xs text-gray-500 mb-1">Contact to duplicate:</p>
            <p className="text-sm font-medium text-gray-900">{contact?.name}</p>
            <p className="text-xs text-gray-600">{contact?.email}</p>
            <p className="text-xs text-gray-600">{contact?.company}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="px-4 py-2 text-sm">
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {isSubmitting ? "Duplicating..." : "Confirm Duplicate"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
