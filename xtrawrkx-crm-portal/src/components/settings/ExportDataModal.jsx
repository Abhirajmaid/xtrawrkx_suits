"use client";

import { useState } from "react";
import { Button, Checkbox } from "../../components/ui";
import { X, Download, FileText, FileSpreadsheet, File } from "lucide-react";
import { BaseModal } from "../ui";

export default function ExportDataModal({ isOpen, onClose, onExport }) {
  const [selectedModules, setSelectedModules] = useState({
    leads: true,
    contacts: true,
    deals: true,
    activities: false,
    files: false
  });

  const [exportFormat, setExportFormat] = useState("csv");
  const [dateRange, setDateRange] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const modules = [
    { key: "leads", label: "Leads", count: "1,234 records" },
    { key: "contacts", label: "Contacts", count: "2,456 records" },
    { key: "deals", label: "Deals", count: "567 records" },
    { key: "activities", label: "Activities", count: "8,901 records" },
    { key: "files", label: "Files", count: "345 files" }
  ];

  const formats = [
    { value: "csv", label: "CSV", icon: FileText, description: "Comma-separated values" },
    { value: "excel", label: "Excel", icon: FileSpreadsheet, description: "Microsoft Excel format" },
    { value: "json", label: "JSON", icon: File, description: "JavaScript Object Notation" }
  ];

  const dateRanges = [
    { value: "all", label: "All Time" },
    { value: "last30", label: "Last 30 Days" },
    { value: "last90", label: "Last 90 Days" },
    { value: "lastyear", label: "Last Year" },
    { value: "custom", label: "Custom Range" }
  ];

  const handleModuleToggle = (moduleKey) => {
    setSelectedModules(prev => ({
      ...prev,
      [moduleKey]: !prev[moduleKey]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedModules).every(Boolean);
    const newSelection = {};
    modules.forEach(module => {
      newSelection[module.key] = !allSelected;
    });
    setSelectedModules(newSelection);
  };

  const handleExport = async () => {
    const selectedModulesList = Object.keys(selectedModules).filter(key => selectedModules[key]);
    
    if (selectedModulesList.length === 0) {
      alert("Please select at least one module to export.");
      return;
    }

    setIsExporting(true);
    
    try {
      const exportData = {
        modules: selectedModulesList,
        format: exportFormat,
        dateRange: dateRange
      };

      onExport(exportData);
      onClose();
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    setSelectedModules({
      leads: true,
      contacts: true,
      deals: true,
      activities: false,
      files: false
    });
    setExportFormat("csv");
    setDateRange("all");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="big">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <Download className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Export Data</h2>
              <p className="text-xs text-gray-600">Download your CRM data</p>
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

        <div className="space-y-6">
          {/* Select Modules */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Select Data to Export</label>
              <button
                onClick={handleSelectAll}
                className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
              >
                Select All
              </button>
            </div>
            <div className="space-y-2">
              {modules.map(module => {
                const Icon = module.key === 'leads' ? FileText : 
                           module.key === 'contacts' ? FileText :
                           module.key === 'deals' ? FileText :
                           module.key === 'activities' ? FileText : FileText;
                
                return (
                  <div key={module.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedModules[module.key]}
                        onChange={() => handleModuleToggle(module.key)}
                      />
                      <Icon className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{module.label}</div>
                        <div className="text-sm text-gray-500">{module.count}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {formats.map(format => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.value}
                    onClick={() => setExportFormat(format.value)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      exportFormat === format.value
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900">{format.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{format.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              {dateRanges.map(range => (
                <button
                  key={range.value}
                  onClick={() => setDateRange(range.value)}
                  className={`p-2 text-sm border rounded-lg transition-colors ${
                    dateRange === range.value
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Export Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Format: {formats.find(f => f.value === exportFormat)?.label}</div>
              <div>Date Range: {dateRanges.find(r => r.value === dateRange)?.label}</div>
              <div>Modules: {Object.keys(selectedModules).filter(key => selectedModules[key]).length} selected</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={handleClose} className="px-4 py-2 text-sm">
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg"
            >
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
