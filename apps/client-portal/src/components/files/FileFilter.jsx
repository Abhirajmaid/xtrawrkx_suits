"use client";

import { useState } from "react";

export default function FileFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    project: "",
    fileType: "",
    uploader: "",
    search: ""
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Bar */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Files
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by file name..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Project Filter */}
        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
            Project
          </label>
          <select
            id="project"
            value={filters.project}
            onChange={(e) => handleFilterChange('project', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Projects</option>
            <option value="Project Apollo">Project Apollo</option>
            <option value="Project Orion">Project Orion</option>
            <option value="Project Zeus">Project Zeus</option>
          </select>
        </div>

        {/* File Type Filter */}
        <div>
          <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-2">
            File Type
          </label>
          <select
            id="fileType"
            value={filters.fileType}
            onChange={(e) => handleFilterChange('fileType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="pdf">PDF</option>
            <option value="fig">Figma</option>
            <option value="docx">Word</option>
            <option value="xlsx">Excel</option>
            <option value="png">Image</option>
          </select>
        </div>
      </div>

      {/* Uploader Filter */}
      <div className="mt-4">
        <label htmlFor="uploader" className="block text-sm font-medium text-gray-700 mb-2">
          Uploaded By
        </label>
        <select
          id="uploader"
          value={filters.uploader}
          onChange={(e) => handleFilterChange('uploader', e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Users</option>
          <option value="Jane Doe">Jane Doe</option>
          <option value="John Smith">John Smith</option>
          <option value="Mark Lee">Mark Lee</option>
          <option value="Sarah Johnson">Sarah Johnson</option>
        </select>
      </div>
    </div>
  );
}
