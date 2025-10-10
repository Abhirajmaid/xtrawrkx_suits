import { useState } from "react";
import { Input, Button } from "../../../../../../../../components/ui";
import { X, Upload, FileText, Cloud } from "lucide-react";
import { BaseModal } from "../ui";

export default function UploadDocumentModal({ isOpen, onClose, client }) {
  const [formData, setFormData] = useState({
    files: [],
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const uploadData = {
        files: formData.files,
        description: formData.description,
        clientId: client?.id,
        clientName: client?.name,
        uploadedAt: new Date().toISOString(),
        uploadedBy: "Alex Johnson" // Current user
      };
      
      console.log('Uploading documents:', uploadData);
      // TODO: Implement actual file upload logic
      
      onClose();
    } catch (error) {
      console.error('Error uploading documents:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      files: [],
      description: ""
    });
    setIsDragOver(false);
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} size="small">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <Upload className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Upload Document</h2>
              <p className="text-xs text-gray-600">Upload documents for {client?.name}</p>
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
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Documents</label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop files here, or click to select
              </p>
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Choose Files
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supports PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, and images
              </p>
            </div>
          </div>

          {/* Selected Files */}
          {formData.files.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selected Files</label>
              <div className="space-y-2">
                {formData.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
              placeholder="Add a description for these documents..."
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
            disabled={isSubmitting || formData.files.length === 0}
            className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isSubmitting ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
