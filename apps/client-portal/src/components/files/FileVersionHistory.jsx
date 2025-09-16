"use client";

import { Button } from "@/components/ui";

export default function FileVersionHistory({ file, onClose }) {
  if (!file) return null;

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📋';
      case 'fig':
        return '🎨';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'zip':
      case 'rar':
        return '📦';
      default:
        return '📄';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-0 right-0 h-full w-96 bg-white shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Version History</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* File Info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">{getFileIcon(file.name)}</span>
            <div>
              <h3 className="text-sm font-medium text-gray-900">{file.name}</h3>
              <p className="text-sm text-gray-500">{file.project}</p>
            </div>
          </div>
        </div>

        {/* Version List */}
        <div className="px-6 py-4">
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            {file.versions?.length || 0} Version{file.versions?.length !== 1 ? 's' : ''}
          </h4>
          
          <div className="space-y-3">
            {file.versions?.map((version, index) => (
              <div 
                key={version.version}
                className={`p-4 rounded-lg border ${
                  index === 0 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    Version {version.version}
                  </span>
                  {index === 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Latest
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>{version.date}</span>
                  <span>by {version.uploadedBy}</span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                  >
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs px-3 py-1"
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
