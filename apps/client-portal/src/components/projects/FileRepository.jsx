"use client";

import { useState } from "react";
import { 
  Upload, 
  Download, 
  Eye, 
  FileText, 
  Image, 
  File, 
  MoreVertical,
  Plus,
  Folder
} from "lucide-react";

export default function FileRepository({ 
  files = [],
  onUpload,
  onDownload,
  onView,
  className = "" 
}) {
  const [isUploading, setIsUploading] = useState(false);

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <Image className="w-5 h-5 text-green-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (onUpload) {
        onUpload(Array.from(files));
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileAction = (action, file) => {
    switch (action) {
      case 'download':
        if (onDownload) onDownload(file);
        break;
      case 'view':
        if (onView) onView(file);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-neutral-200 p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">File Repository</h3>
        
        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Upload Files"}
            <input
              type="file"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Files List */}
      {files.length === 0 ? (
        <div className="text-center py-8">
          <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No files uploaded yet</p>
          <p className="text-sm text-gray-400">Upload files to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border border-neutral-200 rounded-lg hover:bg-gray-50 transition-colors">
              {/* File Icon */}
              <div className="flex-shrink-0">
                {getFileIcon(file.name)}
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-medium text-neutral-900 truncate">{file.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>v{file.version}</span>
                      <span>•</span>
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>by {file.uploadedBy}</span>
                      <span>•</span>
                      <span>{formatDate(file.date)}</span>
                    </div>
                  </div>
                  
                  {/* File Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFileAction('view', file)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFileAction('download', file)}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
