import { useState } from "react";
import { Input, Select, Button } from "../../../../../../../../components/ui";
import { X, Calendar, Clock, MapPin, Users, Video } from "lucide-react";
import { BaseModal } from "../ui";

export default function ScheduleMeetingModal({ isOpen, onClose, contact }) {
  const [formData, setFormData] = useState({
    title: "",
    attendees: [contact?.name || ""],
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAttendee = () => {
    setFormData(prev => ({
      ...prev,
      attendees: [...prev.attendees, ""]
    }));
  };

  const handleAttendeeChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.map((attendee, i) => i === index ? value : attendee)
    }));
  };

  const handleRemoveAttendee = (index) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const meetingData = {
        ...formData,
        contactId: contact?.id,
        contactName: contact?.name,
        createdAt: new Date().toISOString()
      };
      
      console.log('Scheduling meeting:', meetingData);
      // TODO: Implement actual meeting scheduling logic
      
      onClose();
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      attendees: [contact?.name || ""],
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      location: "",
      description: ""
    });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} size="big">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <Calendar className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Schedule Meeting</h2>
              <p className="text-xs text-gray-600">Schedule a meeting with {contact?.name}</p>
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
          {/* Meeting Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
            <Input
              placeholder="Enter meeting title..."
              value={formData.title}
              onChange={(value) => handleInputChange('title', value)}
              required
            />
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="w-4 h-4 inline mr-1" />
              Attendees
            </label>
            <div className="space-y-2">
              {formData.attendees.map((attendee, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Enter attendee name or email..."
                    value={attendee}
                    onChange={(value) => handleAttendeeChange(index, value)}
                    className="flex-1"
                  />
                  {formData.attendees.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAttendee(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddAttendee}
                className="flex items-center gap-2 px-3 py-2 text-sm text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
              >
                <Users className="w-4 h-4" />
                Add Attendee
              </button>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Start Date
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(value) => handleInputChange('startDate', value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Start Time
              </label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(value) => handleInputChange('startTime', value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                End Date
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(value) => handleInputChange('endDate', value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                End Time
              </label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(value) => handleInputChange('endTime', value)}
                required
              />
            </div>
          </div>

          {/* Location/Video Call Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location or Video Call Link
            </label>
            <Input
              placeholder="Enter physical address or video conference URL..."
              value={formData.location}
              onChange={(value) => handleInputChange('location', value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              <Video className="w-3 h-3 inline mr-1" />
              For video calls, paste the meeting link (Zoom, Teams, etc.)
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
              placeholder="Enter meeting agenda, notes, or description..."
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
            disabled={isSubmitting || !formData.title || !formData.startDate || !formData.startTime}
            className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
