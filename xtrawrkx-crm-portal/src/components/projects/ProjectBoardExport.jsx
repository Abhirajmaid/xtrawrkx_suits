"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, FileText, FileSpreadsheet, Download } from "lucide-react";

export default function ProjectBoardExport({ projects, onExport }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = (format) => {
    setShowDropdown(false);
    
    // Flatten projects from all columns
    const allProjects = projects.reduce((acc, column) => {
      const columnProjects = column.items.map(item => ({
        ...item,
        stage: column.title
      }));
      return [...acc, ...columnProjects];
    }, []);

    if (format === 'csv') {
      exportToCSV(allProjects);
    } else if (format === 'excel') {
      exportToExcel(allProjects);
    } else if (format === 'pdf') {
      exportToPDF(allProjects);
    }

    if (onExport) {
      onExport(format, allProjects);
    }
  };

  const exportToCSV = (data) => {
    const headers = [
      'Project Name', 'Client', 'Stage', 'Progress (%)', 'Health', 
      'Priority', 'Manager', 'Team Size', 'Due Date', 'Estimated Hours'
    ];
    
    const csvContent = [
      headers.join(','),
      ...data.map(project => [
        `"${project.name}"`,
        `"${project.client}"`,
        `"${project.stage}"`,
        project.progress,
        `"${project.health}"`,
        `"${project.priority}"`,
        `"${project.manager}"`,
        project.teamSize,
        `"${project.dueDate || ''}"`,
        project.estimatedHours || 0
      ].join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `projects-board-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToExcel = (data) => {
    // Simple Excel-compatible format (tab-separated)
    const headers = [
      'Project Name', 'Client', 'Stage', 'Progress (%)', 'Health', 
      'Priority', 'Manager', 'Team Size', 'Due Date', 'Estimated Hours'
    ];
    
    const excelContent = [
      headers.join('\\t'),
      ...data.map(project => [
        project.name,
        project.client,
        project.stage,
        project.progress,
        project.health,
        project.priority,
        project.manager,
        project.teamSize,
        project.dueDate || '',
        project.estimatedHours || 0
      ].join('\\t'))
    ].join('\\n');

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `projects-board-${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
  };

  const exportToPDF = (data) => {
    // Simple text-based PDF content
    const pdfContent = [
      'PROJECTS BOARD EXPORT',
      `Generated on: ${new Date().toLocaleDateString()}`,
      '',
      ...data.map(project => [
        `Project: ${project.name}`,
        `Client: ${project.client}`,
        `Stage: ${project.stage}`,
        `Progress: ${project.progress}%`,
        `Health: ${project.health}`,
        `Priority: ${project.priority}`,
        `Manager: ${project.manager}`,
        `Team Size: ${project.teamSize}`,
        `Due Date: ${project.dueDate || 'Not set'}`,
        `Estimated Hours: ${project.estimatedHours || 0}`,
        '---'
      ].join('\\n'))
    ].join('\\n');

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `projects-board-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <button
            onClick={() => handleExport('csv')}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4 text-green-600" />
            <div className="text-left">
              <div className="font-medium">Export as CSV</div>
              <div className="text-xs text-gray-500">Comma-separated values</div>
            </div>
          </button>
          
          <button
            onClick={() => handleExport('excel')}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <div className="text-left">
              <div className="font-medium">Export as Excel</div>
              <div className="text-xs text-gray-500">Microsoft Excel format</div>
            </div>
          </button>
          
          <button
            onClick={() => handleExport('pdf')}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4 text-red-600" />
            <div className="text-left">
              <div className="font-medium">Export as PDF</div>
              <div className="text-xs text-gray-500">Portable document format</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
