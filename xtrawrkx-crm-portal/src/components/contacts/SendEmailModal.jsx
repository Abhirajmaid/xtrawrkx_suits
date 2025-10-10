import { useState } from "react";
import { Input, Select, Button } from "../../../../../../../../components/ui";
import { X, Paperclip, Send, Mail } from "lucide-react";
import { BaseModal } from "../ui";

export default function SendEmailModal({ isOpen, onClose, contact }) {
  const [formData, setFormData] = useState({
    to: contact?.email || "",
    from: "alex.johnson@company.com", // Current user's email
    subject: "",
    body: "",
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Sending email:', formData);
      // TODO: Implement actual email sending logic
      
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      to: contact?.email || "",
      from: "alex.johnson@company.com",
      subject: "",
      body: "",
      attachments: []
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
              <Mail className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Send Email</h2>
              <p className="text-xs text-gray-600">Compose and send an email to {contact?.name}</p>
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
          {/* To Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <Input
              value={`${contact?.name} ${contact?.email}`}
              disabled
              className="bg-gray-50 text-gray-600"
            />
          </div>

          {/* From Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <Select
              value={formData.from}
              onChange={(value) => handleInputChange('from', value)}
              options={[
                { value: "alex.johnson@company.com", label: "Alex Johnson (alex.johnson@company.com)" },
                { value: "john.smith@company.com", label: "John Smith (john.smith@company.com)" },
                { value: "jane.doe@company.com", label: "Jane Doe (jane.doe@company.com)" }
              ]}
            />
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <Input
              placeholder="Enter email subject..."
              value={formData.subject}
              onChange={(value) => handleInputChange('subject', value)}
              required
            />
          </div>

          {/* Email Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
              placeholder="Type your message here..."
              value={formData.body}
              onChange={(e) => handleInputChange('body', e.target.value)}
              required
            />
          </div>

          {/* Attachments */}
          {formData.attachments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
              <div className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="file-attach"
              multiple
              onChange={handleFileAttach}
              className="hidden"
            />
            <label
              htmlFor="file-attach"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
              Attach File
            </label>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleClose} className="px-4 py-2 text-sm">
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.subject || !formData.body}
              className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
