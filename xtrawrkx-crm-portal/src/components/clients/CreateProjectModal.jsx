import { useState } from "react";
import { Input, Select, Button } from "../../components/ui";
import { X, FolderOpen, User, DollarSign, Calendar, FileText } from "lucide-react";
import { BaseModal } from "../ui";

export default function CreateProjectModal({ isOpen, onClose, client }) {
  const [formData, setFormData] = useState({
    projectName: "",
    projectLead: "",
    budget: "",
    startDate: "",
    endDate: "",
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
      
      const projectData = {
        ...formData,
        clientId: client?.id,
        clientName: client?.name,
        createdAt: new Date().toISOString(),
        createdBy: "Alex Johnson" // Current user
      };
      
      console.log('Creating project:', projectData);
      // TODO: Implement actual project creation logic
      
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      projectName: "",
      projectLead: "",
      budget: "",
      startDate: "",
      endDate: "",
      description: ""
    });
    onClose();
  };

  const teamMembers = [
    { value: "alex-johnson", label: "Alex Johnson (Project Manager)" },
    { value: "jane-doe", label: "Jane Doe (Developer)" },
    { value: "mike-smith", label: "Mike Smith (Designer)" },
    { value: "sarah-wilson", label: "Sarah Wilson (QA Lead)" }
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} size="big">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <FolderOpen className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Create Project</h2>
              <p className="text-xs text-gray-600">Create a new project for {client?.name}</p>
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
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FolderOpen className="w-4 h-4 inline mr-1" />
              Project Name
            </label>
            <Input
              placeholder="e.g., 2026 Website Redesign"
              value={formData.projectName}
              onChange={(value) => handleInputChange('projectName', value)}
              required
            />
          </div>

          {/* Project Lead and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Project Lead
              </label>
              <Select
                value={formData.projectLead}
                onChange={(value) => handleInputChange('projectLead', value)}
                options={[
                  { value: "", label: "Select Project Lead" },
                  ...teamMembers
                ]}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Budget
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={formData.budget}
                onChange={(value) => handleInputChange('budget', value)}
              />
            </div>
          </div>

          {/* Start and End Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4 inline mr-1" />
              Description
            </label>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
              placeholder="Enter project scope, requirements, and details..."
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
            disabled={isSubmitting || !formData.projectName || !formData.projectLead || !formData.startDate || !formData.endDate}
            className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg flex items-center gap-2"
          >
            <FolderOpen className="w-4 h-4" />
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
