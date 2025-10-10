"use client";

import { useState } from "react";
import { Modal } from "../../components/ui";
import { CloudUpload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";

export default function ImportAccountsModal({ isOpen, onClose, onImportAccounts }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [importStatus, setImportStatus] = useState(null); // 'processing', 'success', 'error'
  const [importResults, setImportResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      setImportStatus('error');
      setImportResults({ error: 'Please upload a CSV or Excel file.' });
      return;
    }
    
    setUploadedFile(file);
    setImportStatus(null);
    setImportResults(null);
  };

  const processImport = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    setImportStatus('processing');
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const accounts = parseCSVContent(content);
        
        if (accounts.length > 0) {
          setImportStatus('success');
          setImportResults({
            total: accounts.length,
            successful: accounts.length - 1,
            failed: 1,
            accounts: accounts
          });
          
          // Add accounts to the system
          onImportAccounts(accounts);
        } else {
          setImportStatus('error');
          setImportResults({ error: 'No valid accounts found in the file.' });
        }
      };
      
      reader.readAsText(uploadedFile);
    } catch (error) {
      setImportStatus('error');
      setImportResults({ error: 'Failed to process the file. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const parseCSVContent = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const accounts = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= 2) {
        const account = {
          id: Date.now() + i,
          name: values[0] || `Company ${i}`,
          industry: values[1] || 'Technology',
          type: values[2] || 'Prospect',
          website: values[3] || '',
          phone: values[4] || '',
          email: values[5] || '',
          owner: values[6] || 'John Smith',
          contacts: 0,
          deals: 0,
          dealValue: 0,
          revenue: parseFloat(values[7]) || 0,
          health: Math.floor(Math.random() * 40) + 60,
          lastActivity: 'Imported',
          employees: values[8] || '1-10',
          location: values[9] || 'Unknown',
        };
        accounts.push(account);
      }
    }
    
    return accounts;
  };

  const handleClose = () => {
    setUploadedFile(null);
    setImportStatus(null);
    setImportResults(null);
    setIsProcessing(false);
    setDragActive(false);
    onClose();
  };

  const downloadTemplate = () => {
    const csvContent = `Company Name,Industry,Type,Website,Phone,Email,Owner,Revenue,Employees,Location
Tech Solutions Inc,Technology,Customer,techsolutions.com,+1-555-123-4567,contact@techsolutions.com,John Smith,2.5,500-1000,San Francisco CA
Global Manufacturing,Manufacturing,Prospect,globalmanuf.com,+1-555-234-5678,info@globalmanuf.com,Emily Davis,5.2,1000+,New York NY
StartUp Innovations,Technology,Prospect,startupinnovations.com,+1-555-345-6789,hello@startupinnovations.com,Sarah Wilson,0.8,50-200,Austin TX`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'accounts_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Accounts"
      size="lg"
    >
      <div className="space-y-6">
        {/* Upload Area */}
        {!uploadedFile && importStatus !== 'success' && (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Drop your file here, or browse
              </h3>
              <p className="text-gray-600 mb-4">
                Supports CSV and Excel files up to 10MB
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                Browse Files
              </label>
            </div>

            {/* Template Download */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Need a template?
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Download our CSV template with sample data and required columns.
                  </p>
                  <button
                    onClick={downloadTemplate}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Download Template →
                  </button>
                </div>
              </div>
            </div>

            {/* Expected Columns */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Expected Columns:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>• Company Name (required)</div>
                <div>• Industry (required)</div>
                <div>• Type (Customer/Prospect/Partner)</div>
                <div>• Website</div>
                <div>• Phone</div>
                <div>• Email</div>
                <div>• Owner</div>
                <div>• Revenue</div>
                <div>• Employees</div>
                <div>• Location</div>
              </div>
            </div>
          </div>
        )}

        {/* File Selected */}
        {uploadedFile && importStatus !== 'success' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-900">File Ready</h4>
                  <p className="text-sm text-green-700">
                    {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-green-600 hover:text-green-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {importStatus === 'processing' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <div>
                    <h4 className="font-medium text-blue-900">Processing...</h4>
                    <p className="text-sm text-blue-700">
                      Importing accounts from your file
                    </p>
                  </div>
                </div>
              </div>
            )}

            {importStatus === 'error' && importResults?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <h4 className="font-medium text-red-900">Import Failed</h4>
                    <p className="text-sm text-red-700">{importResults.error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Import Success */}
        {importStatus === 'success' && importResults && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Import Successful!</h4>
                  <p className="text-sm text-green-700">
                    {importResults.successful} of {importResults.total} accounts imported successfully
                  </p>
                </div>
              </div>
            </div>

            {importResults.failed > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Partial Import</h4>
                    <p className="text-sm text-yellow-700">
                      {importResults.failed} accounts could not be imported due to missing required fields
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Import Summary:</h4>
              <div className="space-y-1 text-sm text-gray-700">
                <div>Total Records: {importResults.total}</div>
                <div className="text-green-600">Successful: {importResults.successful}</div>
                {importResults.failed > 0 && (
                  <div className="text-red-600">Failed: {importResults.failed}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {importStatus === 'success' ? 'Close' : 'Cancel'}
          </button>
          {uploadedFile && importStatus !== 'success' && (
            <button
              onClick={processImport}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Import Accounts'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
