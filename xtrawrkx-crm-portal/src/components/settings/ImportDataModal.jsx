"use client";

import { useState } from "react";
import { Button, Select } from "../../components/ui";
import { X, Upload, FileText, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { BaseModal } from "../ui";

export default function ImportDataModal({ isOpen, onClose, onImport }) {
  const [importType, setImportType] = useState("contacts");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResults, setImportResults] = useState(null);

  const importTypes = [
    { value: "contacts", label: "Contacts", description: "Import contact information" },
    { value: "leads", label: "Leads", description: "Import lead data" },
    { value: "deals", label: "Deals", description: "Import deal information" },
    { value: "activities", label: "Activities", description: "Import activity logs" }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportResults(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert("Please select a file to import.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // Simulate import processing
      setTimeout(() => {
        const mockResults = {
          total: 150,
          successful: 145,
          failed: 5,
          errors: [
            "Row 12: Invalid email format",
            "Row 23: Missing required field",
            "Row 45: Duplicate contact",
            "Row 67: Invalid phone number",
            "Row 89: Missing company name"
          ]
        };
        setImportResults(mockResults);
        setIsUploading(false);
      }, 2000);

    } catch (error) {
      console.error('Error importing data:', error);
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportResults(null);
    setUploadProgress(0);
    setIsUploading(false);
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
              <Upload className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Import Data</h2>
              <p className="text-xs text-gray-600">Upload and import your data</p>
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
          {/* Import Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Import Type</label>
            <div className="grid grid-cols-2 gap-3">
              {importTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setImportType(type.value)}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    importType === type.value
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{type.label}</div>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select File</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="file-upload"
                className={`cursor-pointer ${isUploading ? 'cursor-not-allowed' : ''}`}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600">
                  {file ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">Click to upload</span>
                      <p className="text-xs text-gray-500 mt-1">CSV, Excel files supported</p>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Uploading and processing...</span>
                <span className="text-gray-900 font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Import Results */}
          {importResults && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-gray-900">Import Complete</h4>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{importResults.total}</div>
                  <div className="text-sm text-gray-600">Total Records</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{importResults.successful}</div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{importResults.failed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>
              
              {importResults.errors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Errors Found</span>
                  </div>
                  <div className="text-xs text-red-700 space-y-1">
                    {importResults.errors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={handleClose} className="px-4 py-2 text-sm">
              {importResults ? "Close" : "Cancel"}
            </Button>
            {!importResults && (
              <Button
                onClick={handleImport}
                disabled={!file || isUploading}
                className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg"
              >
                {isUploading ? "Importing..." : "Import Data"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
