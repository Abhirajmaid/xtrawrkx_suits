"use client";

import { useState } from "react";
import FileFilter from "@/components/files/FileFilter";
import FileUploadButton from "@/components/files/FileUploadButton";
import FileTable from "@/components/files/FileTable";
import FileVersionHistory from "@/components/files/FileVersionHistory";

export default function FilesPage() {
  const [filters, setFilters] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // Dummy files data
  const files = [
    {
      id: 1,
      name: "wireframes-v1.pdf",
      project: "Project Apollo",
      uploadedBy: "Jane Doe",
      date: "2025-09-01",
      version: "1.0",
      versions: [
        { version: "1.0", date: "2025-09-01", uploadedBy: "Jane Doe" },
      ],
    },
    {
      id: 2,
      name: "ui-design-v2.fig",
      project: "Project Orion",
      uploadedBy: "John Smith",
      date: "2025-09-10",
      version: "2.0",
      versions: [
        { version: "1.0", date: "2025-09-05", uploadedBy: "John Smith" },
        { version: "2.0", date: "2025-09-10", uploadedBy: "John Smith" },
      ],
    },
    {
      id: 3,
      name: "frontend-specs.docx",
      project: "Project Apollo",
      uploadedBy: "Mark Lee",
      date: "2025-09-12",
      version: "1.2",
      versions: [
        { version: "1.0", date: "2025-09-08", uploadedBy: "Mark Lee" },
        { version: "1.2", date: "2025-09-12", uploadedBy: "Mark Lee" },
      ],
    },
    {
      id: 4,
      name: "brand-guidelines.pdf",
      project: "Project Zeus",
      uploadedBy: "Sarah Johnson",
      date: "2025-09-15",
      version: "3.1",
      versions: [
        { version: "1.0", date: "2025-09-01", uploadedBy: "Sarah Johnson" },
        { version: "2.0", date: "2025-09-08", uploadedBy: "Sarah Johnson" },
        { version: "3.1", date: "2025-09-15", uploadedBy: "Sarah Johnson" },
      ],
    },
    {
      id: 5,
      name: "user-research.xlsx",
      project: "Project Orion",
      uploadedBy: "Jane Doe",
      date: "2025-09-18",
      version: "1.0",
      versions: [
        { version: "1.0", date: "2025-09-18", uploadedBy: "Jane Doe" },
      ],
    },
  ];

  // Filter files based on selected filters
  const filteredFiles = files.filter(file => {
    if (filters.project && file.project !== filters.project) return false;
    if (filters.uploader && file.uploadedBy !== filters.uploader) return false;
    if (filters.fileType) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== filters.fileType) return false;
    }
    if (filters.search && !file.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleHistoryClick = (file) => {
    setSelectedFile(file);
    setShowVersionHistory(true);
  };

  const handleCloseVersionHistory = () => {
    setShowVersionHistory(false);
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Files</h1>
          <p className="text-gray-600">
            Manage and organize all your project files in one place
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters and Upload Button */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <FileFilter onFilterChange={handleFilterChange} />
          </div>
          <div className="ml-6">
            <FileUploadButton />
          </div>
        </div>

        {/* File Table */}
        <FileTable 
          files={filteredFiles} 
          onHistoryClick={handleHistoryClick}
        />
      </div>

      {/* Version History Modal */}
      {showVersionHistory && (
        <FileVersionHistory
          file={selectedFile}
          onClose={handleCloseVersionHistory}
        />
      )}
    </div>
  );
}
