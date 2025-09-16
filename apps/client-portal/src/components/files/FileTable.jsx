"use client";

import { useState } from "react";

export default function FileTable({ files, onHistoryClick }) {
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleDownload = (file) => {
    console.log('Downloading:', file.name);
    // Placeholder for download functionality
  };

  const handleView = (file) => {
    console.log('Viewing:', file.name);
    // Placeholder for view functionality
  };

  const handleHistory = (file) => {
    setSelectedFile(file);
    onHistoryClick(file);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Files</h2>
        <p className="text-sm text-gray-500 mt-1">
          {files.length} file{files.length !== 1 ? 's' : ''} total
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Version
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => (
              <tr 
                key={file.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleView(file)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getFileIcon(file.name)}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{file.name}</div>
                      <div className="text-sm text-gray-500">
                        {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{file.project}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {file.uploadedBy.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-900">{file.uploadedBy}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {file.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    v{file.version}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(file);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      Download
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHistory(file);
                      }}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      History
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {files.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-500">Upload your first file to get started.</p>
        </div>
      )}
    </div>
  );
}
