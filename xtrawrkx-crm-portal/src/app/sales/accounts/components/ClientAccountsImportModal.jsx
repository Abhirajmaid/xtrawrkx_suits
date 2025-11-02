import { useState } from "react";
import { Modal, Button } from "../../../../components/ui";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";

export default function ClientAccountsImportModal({
  isOpen,
  onClose,
  onImportComplete,
}) {
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
        imported: 15,
        errors: 2,
        message: "Import completed successfully!",
      });
      
      // Call the completion callback
      onImportComplete();
    } catch (error) {
      setImportResult({
        success: false,
        message: "Import failed. Please check your file and try again.",
      });
    } finally {
      setImporting(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setImportResult(null);
    setDragActive(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={resetModal} title="Import Client Accounts">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Import Client Accounts
            </h3>
            <p className="text-sm text-gray-600">
              Upload a CSV or Excel file with client account data
            </p>
          </div>
        </div>

        {!importResult && (
          <>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {file ? file.name : "Drop your file here"}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse files
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Browse Files
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    File Requirements
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Supported formats: CSV, Excel (.xlsx, .xls)</li>
                    <li>• Required columns: Company Name, Industry, Status</li>
                    <li>• Optional columns: Revenue, Health Score, Account Manager</li>
                    <li>• Maximum file size: 10MB</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {importResult && (
          <div
            className={`rounded-lg p-6 ${
              importResult.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {importResult.success ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
              <h4
                className={`text-lg font-semibold ${
                  importResult.success ? "text-green-900" : "text-red-900"
                }`}
              >
                {importResult.success ? "Import Successful" : "Import Failed"}
              </h4>
            </div>
            <p
              className={`text-sm mb-4 ${
                importResult.success ? "text-green-700" : "text-red-700"
              }`}
            >
              {importResult.message}
            </p>
            {importResult.success && (
              <div className="text-sm text-green-700">
                <p>• {importResult.imported} accounts imported successfully</p>
                {importResult.errors > 0 && (
                  <p>• {importResult.errors} rows had errors and were skipped</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={resetModal}>
            {importResult ? "Close" : "Cancel"}
          </Button>
          {!importResult && (
            <Button
              onClick={handleImport}
              disabled={!file || importing}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Accounts
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
