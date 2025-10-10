import { useState } from 'react';
import { Upload, FileSpreadsheet, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Card, Button } from "../../../../../../../../../../components/ui";

export default function LeadsImportModal({ 
  isOpen, 
  onClose, 
  onImport 
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importStep, setImportStep] = useState('upload'); // 'upload', 'mapping', 'preview', 'complete'
  const [importResults, setImportResults] = useState(null);

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    setSelectedFile(file);
    setImportStep('mapping');
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    setImportStep('preview');
    // Simulate import process
    setTimeout(() => {
      setImportResults({
        total: 150,
        imported: 145,
        errors: 5,
        errorsList: [
          'Row 3: Invalid email format',
          'Row 7: Missing required field',
          'Row 12: Duplicate email',
          'Row 18: Invalid phone number',
          'Row 23: Missing company name'
        ]
      });
      setImportStep('complete');
    }, 2000);
  };

  const handleClose = () => {
    setImportStep('upload');
    setSelectedFile(null);
    setImportResults(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card 
        glass={true}
        className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-xl flex items-center justify-center shadow-lg">
                <Upload className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Import Leads</h2>
                <p className="text-sm text-gray-600">Upload your leads data from CSV or Excel files</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Import Steps */}
          {importStep === 'upload' && (
            <div className="space-y-6">
              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-yellow-400 bg-yellow-50/50' 
                    : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50/30'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Upload className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Drop your file here</h3>
                    <p className="text-gray-600">or click to browse files</p>
                  </div>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button
                    variant="outline"
                    className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                  >
                    Choose File
                  </Button>
                </div>
              </div>

              {/* Supported Formats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Supported Formats</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    <span>CSV (.csv)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Excel (.xlsx, .xls)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {importStep === 'mapping' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">File Ready for Import</h3>
                <p className="text-gray-600 mb-4">{selectedFile?.name}</p>
                <p className="text-sm text-gray-500">We'll automatically map your columns to our lead fields.</p>
              </div>
            </div>
          )}

          {importStep === 'preview' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-yellow-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Importing Leads...</h3>
                <p className="text-gray-600">Please wait while we process your file.</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          )}

          {importStep === 'complete' && importResults && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400/20 to-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Complete!</h3>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{importResults.imported}</div>
                    <div className="text-sm text-gray-600">Imported</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{importResults.errors}</div>
                    <div className="text-sm text-gray-600">Errors</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{importResults.total}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
                
                {importResults.errors > 0 && (
                  <div className="mt-6 p-4 bg-red-50 rounded-lg text-left">
                    <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Import Errors
                    </h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {importResults.errorsList.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            {importStep === 'upload' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="px-6 py-2.5"
                >
                  Cancel
                </Button>
              </>
            )}
            
            {importStep === 'mapping' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setImportStep('upload')}
                  className="px-6 py-2.5"
                >
                  Back
                </Button>
                <Button
                  onClick={handleImport}
                  className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg"
                >
                  Start Import
                </Button>
              </>
            )}
            
            {importStep === 'complete' && (
              <Button
                onClick={handleClose}
                className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg"
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
