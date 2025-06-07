
import React, { useState } from 'react';
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

const ClientImport: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});

  // Simulated file columns after upload
  const fileColumns = ['Name', 'Company_Email', 'Phone_Number', 'Business_Type', 'File_Number'];
  
  // System fields for mapping
  const systemFields = [
    { value: 'name', label: 'Client Name' },
    { value: 'email', label: 'Email Address' },
    { value: 'mobile', label: 'Mobile Number' },
    { value: 'type_of_client', label: 'Type of Client' },
    { value: 'file_no', label: 'File Number' },
    { value: 'trade_name', label: 'Trade Name' },
    { value: 'working_user', label: 'Working User' },
    { value: 'status', label: 'Status' }
  ];

  // Simulated preview data
  const previewData = [
    { Name: 'ABC Corporation', Company_Email: 'contact@abc.com', Phone_Number: '+91-9876543210', Business_Type: 'Company', File_Number: 'FILE001' },
    { Name: 'XYZ Limited', Company_Email: 'info@xyz.com', Phone_Number: '+91-9876543211', Business_Type: 'Company', File_Number: 'FILE002' },
    { Name: 'Global Enterprises', Company_Email: 'hello@global.com', Phone_Number: '+91-9876543212', Business_Type: 'LLP', File_Number: 'FILE003' }
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
    setIsUploading(true);
    setUploadedFile(file);
    
    // Simulate file processing
    setTimeout(() => {
      setIsUploading(false);
      // Auto-suggest mappings based on column names
      const autoMappings: Record<string, string> = {};
      fileColumns.forEach(col => {
        const lowerCol = col.toLowerCase();
        if (lowerCol.includes('name')) autoMappings[col] = 'name';
        if (lowerCol.includes('email')) autoMappings[col] = 'email';
        if (lowerCol.includes('phone') || lowerCol.includes('mobile')) autoMappings[col] = 'mobile';
        if (lowerCol.includes('type') || lowerCol.includes('business')) autoMappings[col] = 'type_of_client';
        if (lowerCol.includes('file')) autoMappings[col] = 'file_no';
      });
      setFieldMappings(autoMappings);
    }, 2000);
  };

  const handleImport = () => {
    setIsImporting(true);
    
    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
      setImportComplete(true);
    }, 3000);
  };

  const downloadTemplate = () => {
    // Simulate template download
    console.log('Downloading template...');
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
              <Button variant="outline">
                View Imported Clients
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
          <p className="text-gray-600">Upload and import client data from CSV or Excel files</p>
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
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drop your file here, or browse</p>
                <p className="text-gray-600 mb-4">Supports CSV, Excel (XLS, XLSX) files up to 10MB</p>
                <Input
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline">Browse Files</Button>
                </Label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Field Mapping Section */}
      {uploadedFile && !isUploading && (
        <Card>
          <CardHeader>
            <CardTitle>Map Fields</CardTitle>
            <p className="text-sm text-gray-600">
              Map the columns from your file to the corresponding system fields
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fileColumns.map((column) => (
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
      )}

      {/* Preview Section */}
      {uploadedFile && !isUploading && Object.keys(fieldMappings).length > 0 && (
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
                  {previewData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.entries(fieldMappings).map(([fileCol, systemField]) => 
                        systemField && (
                          <TableCell key={fileCol}>
                            {row[fileCol as keyof typeof row]}
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
                {isImporting ? 'Importing...' : 'Import Data'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientImport;
