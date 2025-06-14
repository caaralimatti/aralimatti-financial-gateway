
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useClientImport } from '@/hooks/useClientImport';

const ClientImport: React.FC = () => {
  const { importClients, isImporting } = useClientImport();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // System fields for mapping
  const systemFields = [
    { value: 'name', label: 'Client Name' },
    { value: 'email', label: 'Email Address' },
    { value: 'mobile', label: 'Mobile Number' },
    { value: 'client_type', label: 'Type of Client' },
    { value: 'file_no', label: 'File Number' },
    { value: 'status', label: 'Status' }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    console.log('File selected:', file.name, file.type, file.size);
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);
    
    // Parse CSV file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          alert('CSV file should have at least a header row and one data row');
          setIsUploading(false);
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        console.log('Headers found:', headers);
        
        // Parse all data rows (not just first 3)
        const allData = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          return obj;
        }).filter(row => Object.values(row).some(val => val));

        console.log('Parsed data:', allData);
        setPreviewData(allData);
        
        // Auto-suggest mappings
        const autoMappings: Record<string, string> = {};
        headers.forEach(header => {
          const lowerHeader = header.toLowerCase();
          if (lowerHeader.includes('name') && !lowerHeader.includes('file')) autoMappings[header] = 'name';
          if (lowerHeader.includes('email')) autoMappings[header] = 'email';
          if (lowerHeader.includes('phone') || lowerHeader.includes('mobile')) autoMappings[header] = 'mobile';
          if (lowerHeader.includes('type')) autoMappings[header] = 'client_type';
          if (lowerHeader.includes('file')) autoMappings[header] = 'file_no';
          if (lowerHeader.includes('status')) autoMappings[header] = 'status';
        });
        
        console.log('Auto mappings:', autoMappings);
        setFieldMappings(autoMappings);
        setIsUploading(false);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file. Please check the file format.');
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading file');
      setIsUploading(false);
    };
    
    reader.readAsText(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async () => {
    if (!previewData.length) {
      alert('No data to import');
      return;
    }

    // Validate that required fields are mapped
    const hasNameMapping = Object.values(fieldMappings).includes('name');
    const hasFileNoMapping = Object.values(fieldMappings).includes('file_no');
    
    if (!hasNameMapping || !hasFileNoMapping) {
      alert('Please map both Name and File Number fields before importing');
      return;
    }

    try {
      const importData = previewData.map(row => {
        const mapped: any = {};
        Object.entries(fieldMappings).forEach(([fileCol, systemField]) => {
          if (systemField && row[fileCol]) {
            mapped[systemField] = row[fileCol];
          }
        });
        
        // Ensure required fields
        if (!mapped.name || !mapped.file_no) return null;
        
        return {
          name: mapped.name,
          email: mapped.email || null,
          mobile: mapped.mobile || null,
          file_no: mapped.file_no,
          client_type: mapped.client_type || 'Individual',
          status: mapped.status || 'Active'
        };
      }).filter(Boolean);

      console.log('Importing data:', importData);
      await importClients(importData);
      setImportComplete(true);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please try again.');
    }
  };

  const downloadTemplate = () => {
    const csvContent = "Name,Email,Mobile,File Number,Client Type,Status\nJohn Doe,john@example.com,+91-9876543210,FILE001,Individual,Active\nABC Corporation,contact@abc.com,+91-9876543211,FILE002,Company,Active";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'client_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (importComplete) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Import Complete</h2>
          <p className="text-gray-600">Client data has been successfully imported</p>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Import Successful!</h3>
            <p className="text-gray-600 mb-6">
              Successfully imported {previewData.length} clients from {uploadedFile?.name}
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => window.location.reload()}>
                Import More Files
              </Button>
              <Button variant="outline" onClick={() => setImportComplete(false)}>
                Back to Import
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Import Clients</h2>
          <p className="text-gray-600">Upload and import client data from CSV files</p>
        </div>
        <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Template
        </Button>
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                <p className="text-lg font-medium">Processing file...</p>
                <p className="text-gray-600">Please wait while we analyze your data</p>
              </div>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center">
                <FileSpreadsheet className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg font-medium">{uploadedFile.name}</p>
                <p className="text-gray-600">File uploaded successfully</p>
                <p className="text-sm text-gray-500 mt-2">{previewData.length} records found</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drop your file here, or browse</p>
                <p className="text-gray-600 mb-4">Supports CSV files up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <Button variant="outline" onClick={handleBrowseClick}>
                  Browse Files
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Field Mapping Section */}
      {uploadedFile && !isUploading && previewData.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Map Fields</CardTitle>
              <p className="text-sm text-gray-600">
                Map the columns from your file to the corresponding system fields
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(previewData[0] || {}).map((column) => (
                  <div key={column} className="space-y-2">
                    <Label>File Column: {column}</Label>
                    <Select
                      value={fieldMappings[column] || ''}
                      onValueChange={(value) => 
                        setFieldMappings(prev => ({ ...prev, [column]: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select system field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Don't import</SelectItem>
                        {systemFields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Preview Import Data</CardTitle>
              <p className="text-sm text-gray-600">
                Review the first few rows to ensure the mapping is correct
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.entries(fieldMappings).map(([fileCol, systemField]) => 
                        systemField && (
                          <TableHead key={fileCol}>
                            {systemFields.find(f => f.value === systemField)?.label || systemField}
                          </TableHead>
                        )
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 3).map((row, index) => (
                      <TableRow key={index}>
                        {Object.entries(fieldMappings).map(([fileCol, systemField]) => 
                          systemField && (
                            <TableCell key={fileCol}>
                              {row[fileCol]}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This preview shows the first 3 rows. Your file contains {previewData.length} total records.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleImport} 
                  disabled={isImporting}
                  className="flex items-center gap-2"
                >
                  {isImporting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isImporting ? 'Importing...' : `Import ${previewData.length} Records`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ClientImport;
