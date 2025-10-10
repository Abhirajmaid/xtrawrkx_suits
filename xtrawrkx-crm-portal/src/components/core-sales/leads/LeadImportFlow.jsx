"use client";

import { useState, useRef } from "react";
import { Button, Card, Table, Badge, Modal } from "../../../components/ui";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  Eye,
  ArrowRight,
  FileSpreadsheet
} from "lucide-react";

export default function LeadImportFlow({ isOpen, onClose, onImport }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [fieldMapping, setFieldMapping] = useState({});
  const [importedData, setImportedData] = useState([]);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const sampleFields = [
    'firstName', 'lastName', 'email', 'phone', 'company', 'title',
    'industry', 'website', 'source', 'value', 'notes'
  ];

  const csvHeaders = [
    'First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Title',
    'Industry', 'Website', 'Source', 'Value', 'Notes'
  ];

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setFile(uploadedFile);
      parseCSV(uploadedFile);
    }
  };

  const parseCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      }).filter(row => Object.values(row).some(value => value.trim() !== ''));
      
      setCsvData(data);
      setStep(2);
    };
    reader.readAsText(file);
  };

  const handleFieldMapping = (csvField, systemField) => {
    setFieldMapping(prev => ({
      ...prev,
      [csvField]: systemField
    }));
  };

  const validateData = () => {
    const newErrors = [];
    const processedData = [];

    csvData.forEach((row, index) => {
      const processedRow = { ...row };
      const rowErrors = [];

      // Check required fields
      if (!row[fieldMapping.firstName] && !row[fieldMapping.lastName]) {
        rowErrors.push('Name is required');
      }
      if (!row[fieldMapping.email]) {
        rowErrors.push('Email is required');
      }
      if (!row[fieldMapping.company]) {
        rowErrors.push('Company is required');
      }

      // Validate email format
      if (row[fieldMapping.email] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row[fieldMapping.email])) {
        rowErrors.push('Invalid email format');
      }

      // Validate value is number
      if (row[fieldMapping.value] && isNaN(parseInt(row[fieldMapping.value]))) {
        rowErrors.push('Value must be a number');
      }

      if (rowErrors.length > 0) {
        newErrors.push({
          row: index + 1,
          errors: rowErrors
        });
      }

      // Map fields to system format
      processedRow.firstName = row[fieldMapping.firstName] || '';
      processedRow.lastName = row[fieldMapping.lastName] || '';
      processedRow.email = row[fieldMapping.email] || '';
      processedRow.phone = row[fieldMapping.phone] || '';
      processedRow.company = row[fieldMapping.company] || '';
      processedRow.title = row[fieldMapping.title] || '';
      processedRow.industry = row[fieldMapping.industry] || '';
      processedRow.website = row[fieldMapping.website] || '';
      processedRow.source = row[fieldMapping.source] || 'Import';
      processedRow.value = parseInt(row[fieldMapping.value]) || 0;
      processedRow.notes = row[fieldMapping.notes] || '';
      processedRow.status = 'new';
      processedRow.segment = 'warm';

      processedData.push(processedRow);
    });

    setErrors(newErrors);
    setImportedData(processedData);
    setStep(3);
  };

  const handleImport = () => {
    const validData = importedData.filter((_, index) => 
      !errors.some(error => error.row === index + 1)
    );
    onImport(validData);
    onClose();
  };

  const downloadTemplate = () => {
    const csvContent = csvHeaders.join(',') + '\n' +
      'John,Doe,john@example.com,+1-555-0123,Example Corp,CTO,Technology,https://example.com,Website,50000,Interested in our solution';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-brand-foreground">Import Leads</h2>
            <p className="text-sm text-brand-text-light">
              Upload a CSV file to import multiple leads at once
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              step >= 1 ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <Upload className="w-4 h-4" />
              Upload
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              step >= 2 ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <FileText className="w-4 h-4" />
              Map Fields
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              step >= 3 ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <CheckCircle className="w-4 h-4" />
              Review
            </div>
          </div>
        </div>

        {/* Step 1: File Upload */}
        {step === 1 && (
          <div className="space-y-6">
            <Card className="p-8 text-center border-2 border-dashed border-brand-border hover:border-brand-primary transition-colors">
              <FileSpreadsheet className="w-12 h-12 text-brand-text-light mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-brand-foreground mb-2">
                Upload CSV File
              </h3>
              <p className="text-brand-text-light mb-4">
                Choose a CSV file with your lead data or drag and drop it here
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </Card>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
              <div className="text-sm text-brand-text-light">
                Need help? <a href="#" className="text-brand-primary hover:underline">View format guide</a>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Field Mapping */}
        {step === 2 && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-brand-foreground mb-4">
                Map CSV Fields to System Fields
              </h3>
              <div className="space-y-4">
                {csvHeaders.map((header, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-1/3">
                      <label className="text-sm font-medium text-brand-foreground">
                        {header}
                      </label>
                    </div>
                    <div className="w-1/3">
                      <select
                        value={fieldMapping[header] || ''}
                        onChange={(e) => handleFieldMapping(header, e.target.value)}
                        className="w-full p-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                      >
                        <option value="">Select field...</option>
                        {sampleFields.map((field) => (
                          <option key={field} value={field}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-1/3">
                      <span className="text-sm text-brand-text-light">
                        {csvData[0]?.[header] ? `"${csvData[0][header]}"` : 'No data'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={validateData}>
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review and Import */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-brand-foreground">
                Review Import Data
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="success">
                  {importedData.length - errors.length} Valid
                </Badge>
                {errors.length > 0 && (
                  <Badge variant="destructive">
                    {errors.length} Errors
                  </Badge>
                )}
              </div>
            </div>

            {errors.length > 0 && (
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <h4 className="font-medium text-red-800">Data Validation Errors</h4>
                </div>
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-700">
                      Row {error.row}: {error.errors.join(', ')}
                    </p>
                  ))}
                </div>
              </Card>
            )}

            <div className="max-h-96 overflow-y-auto">
              <Table
                data={importedData.slice(0, 10)}
                columns={[
                  {
                    id: 'name',
                    header: 'Name',
                    cell: (row) => `${row.firstName} ${row.lastName}`.trim()
                  },
                  {
                    id: 'email',
                    header: 'Email',
                    cell: (row) => row.email
                  },
                  {
                    id: 'company',
                    header: 'Company',
                    cell: (row) => row.company
                  },
                  {
                    id: 'value',
                    header: 'Value',
                    cell: (row) => `$${(row.value / 1000).toFixed(0)}K`
                  },
                  {
                    id: 'status',
                    header: 'Status',
                    cell: (row, index) => {
                      const hasError = errors.some(error => error.row === index + 1);
                      return hasError ? (
                        <Badge variant="destructive">Error</Badge>
                      ) : (
                        <Badge variant="success">Valid</Badge>
                      );
                    }
                  }
                ]}
              />
            </div>

            {importedData.length > 10 && (
              <p className="text-sm text-brand-text-light text-center">
                Showing first 10 rows of {importedData.length} total rows
              </p>
            )}

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button 
                onClick={handleImport}
                disabled={errors.length === importedData.length}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Import {importedData.length - errors.length} Leads
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
