import { useState } from "react";
import { X, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Card, Button } from "../../../../components/ui";

export default function ContactsImportModal({ isOpen, onClose, onImport }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    try {
      // Simulate import process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setImportResult({
        success: true,
        imported: Math.floor(Math.random() * 100) + 50,
        errors: Math.floor(Math.random() * 5),
      });
      onImport(file);
    } catch (error) {
      setImportResult({
        success: false,
        error: "Failed to import contacts",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportResult(null);
    setImporting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card
        glass={true}
        className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Import Contacts
                </h2>
                <p className="text-sm text-gray-500">
                  Upload CSV or Excel file
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {!importResult ? (
            <>
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>

                  {file ? (
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="font-medium text-gray-900 mb-1">
                        Drop your file here, or browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports CSV, Excel files up to 10MB
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
                  >
                    Choose File
                  </label>
                </div>
              </div>

              {/* Format Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">
                  <strong>Required columns:</strong> First Name, Last Name,
                  Email
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Optional columns:</strong> Phone, Title, Company,
                  Status
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={importing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!file || importing}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {importing ? "Importing..." : "Import Contacts"}
                </Button>
              </div>
            </>
          ) : (
            /* Import Results */
            <div className="text-center py-4">
              {importResult.success ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Import Successful!
                    </h3>
                    <p className="text-gray-600">
                      {importResult.imported} contacts imported successfully
                      {importResult.errors > 0 && (
                        <span className="text-orange-600">
                          <br />({importResult.errors} errors skipped)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Import Failed
                    </h3>
                    <p className="text-gray-600">{importResult.error}</p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleClose}
                className="mt-6 bg-blue-500 hover:bg-blue-600 text-white"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
