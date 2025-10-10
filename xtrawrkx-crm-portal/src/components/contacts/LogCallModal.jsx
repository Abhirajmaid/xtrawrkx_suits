import { useState } from "react";
import { Input, Select, Button } from "../../components/ui";
import { X, Phone, Calendar, Clock } from "lucide-react";
import { BaseModal } from "../ui";

export default function LogCallModal({ isOpen, onClose, contact }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date
    time: new Date().toTimeString().slice(0, 5), // Current time
    outcome: "connected",
    notes: ""
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
      
      const callData = {
        ...formData,
        contactId: contact?.id,
        contactName: contact?.name,
        timestamp: new Date().toISOString()
      };
      
      console.log('Logging call:', callData);
      // TODO: Implement actual call logging logic
      
      onClose();
    } catch (error) {
      console.error('Error logging call:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      outcome: "connected",
      notes: ""
    });
    onClose();
  };

  const callOutcomes = [
    { value: "connected", label: "Connected" },
    { value: "left-voicemail", label: "Left Voicemail" },
    { value: "no-answer", label: "No Answer" },
    { value: "busy", label: "Busy" },
    { value: "wrong-number", label: "Wrong Number" },
    { value: "callback-requested", label: "Callback Requested" }
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} size="small">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <Phone className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Log Call</h2>
              <p className="text-xs text-gray-600">Record call details with {contact?.name}</p>
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
          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(value) => handleInputChange('date', value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Time
              </label>
              <Input
                type="time"
                value={formData.time}
                onChange={(value) => handleInputChange('time', value)}
                required
              />
            </div>
          </div>

          {/* Call Outcome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Call Outcome</label>
            <Select
              value={formData.outcome}
              onChange={(value) => handleInputChange('outcome', value)}
              options={callOutcomes}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
              placeholder="Record the details of your conversation..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
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
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            {isSubmitting ? "Logging..." : "Log Call"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
