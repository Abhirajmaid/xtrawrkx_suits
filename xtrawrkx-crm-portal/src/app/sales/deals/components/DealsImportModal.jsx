"use client";

import { useState } from "react";
import { Modal, Button } from "../../../../components/ui";
import {
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function DealsImportModal({ isOpen, onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      await onImport(file);
      setUploadStatus("success");
      setTimeout(() => {
        onClose();
        setFile(null);
        setUploadStatus(null);
      }, 2000);
    } catch (error) {
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setUploadStatus(null);
    onClose();
  };

  const downloadTemplate = () => {
    // Create a sample CSV template
    const csvContent = `Deal Name,Company,Value,Stage,Priority,Probability,Close Date,Owner,Description
Sample Deal 1,Acme Corp,50000,qualified,high,75,2024-12-31,John Doe,Sample deal description
Sample Deal 2,Tech Solutions,25000,proposal,medium,50,2024-11-30,Jane Smith,Another sample deal`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deals_import_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Deals" size="md">
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                Import Instructions
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Upload a CSV file with deal information</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Supported formats: .csv, .xlsx</li>
                <li>• Download the template below for the correct format</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download Template */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Template
          </Button>
        </div>

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Choose a file to upload
            </p>
            <p className="text-sm text-gray-500">
              CSV or Excel files up to 10MB
            </p>
          </label>
        </div>

        {/* Selected File */}
        {file && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Status */}
        {uploadStatus === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-700 font-medium">
                Deals imported successfully!
              </p>
            </div>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 font-medium">
                Failed to import deals. Please check your file format.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || isUploading}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import Deals
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
