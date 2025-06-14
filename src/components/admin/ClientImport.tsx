
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
  Loader2,
  Filter,
  Merge,
  X,
  AlertTriangle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useClientImport } from '@/hooks/useClientImport';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface ParsedRow {
  [key: string]: string;
  _rowIndex: number;
  _isValid: boolean;
  _errors: string[];
  _isDuplicate?: boolean;
  _duplicateOf?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  duplicates: Array<{ row: number; field: string; value: string; existingRow: number }>;
}

const ClientImport: React.FC = () => {
  const { importClients, isImporting } = useClientImport();
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
  const [previewData, setPreviewData] = useState<ParsedRow[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [filterSettings, setFilterSettings] = useState({
    skipInvalidRows: true,
    skipDuplicates: false,
    mergeDuplicates: false,
    showWarningsOnly: false
  });
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // System fields for mapping
  const systemFields = [
    { value: 'name', label: 'Client Name', required: true },
    { value: 'email', label: 'Email Address', required: false },
    { value: 'mobile', label: 'Mobile Number', required: false },
    { value: 'client_type', label: 'Type of Client', required: false },
    { value: 'file_no', label: 'File Number', required: true },
    { value: 'status', label: 'Status', required: false }
  ];

  const validateData = (data: ParsedRow[]): ValidationResult => {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      duplicates: []
    };

    const seenValues: Record<string, number[]> = {};
    
    data.forEach((row, index) => {
      row._errors = [];
      row._isValid = true;
      row._rowIndex = index;

      // Check required fields
      const mappedData = getMappedRowData(row);
      if (!mappedData.name?.trim()) {
        row._errors.push('Name is required');
        row._isValid = false;
      }
      if (!mappedData.file_no?.trim()) {
        row._errors.push('File Number is required');
        row._isValid = false;
      }

      // Validate email format
      if (mappedData.email && !isValidEmail(mappedData.email)) {
        row._errors.push('Invalid email format');
        row._isValid = false;
      }

      // Validate mobile format
      if (mappedData.mobile && !isValidMobile(mappedData.mobile)) {
        row._errors.push('Invalid mobile number format');
        row._isValid = false;
      }

      // Check for duplicates within the file
      if (mappedData.file_no) {
        const key = `file_no_${mappedData.file_no.toLowerCase()}`;
        if (!seenValues[key]) seenValues[key] = [];
        seenValues[key].push(index);
        
        if (seenValues[key].length > 1) {
          row._isDuplicate = true;
          row._duplicateOf = mappedData.file_no;
          result.duplicates.push({
            row: index + 1,
            field: 'File Number',
            value: mappedData.file_no,
            existingRow: seenValues[key][0] + 1
          });
        }
      }

      if (mappedData.email) {
        const key = `email_${mappedData.email.toLowerCase()}`;
        if (!seenValues[key]) seenValues[key] = [];
        seenValues[key].push(index);
        
        if (seenValues[key].length > 1) {
          result.warnings.push(`Duplicate email "${mappedData.email}" found in rows ${seenValues[key].map(i => i + 1).join(', ')}`);
        }
      }

      if (!row._isValid) {
        result.isValid = false;
        result.errors.push(`Row ${index + 1}: ${row._errors.join(', ')}`);
      }
    });

    return result;
  };

  const getMappedRowData = (row: ParsedRow) => {
    const mapped: any = {};
    Object.entries(fieldMappings).forEach(([fileCol, systemField]) => {
      if (systemField && row[fileCol]) {
        mapped[systemField] = row[fileCol];
      }
    });
    return mapped;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidMobile = (mobile: string): boolean => {
    const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanMobile = mobile.replace(/[\s\-\(\)]/g, '');
    return mobileRegex.test(cleanMobile) && cleanMobile.length >= 10;
  };

  const showError = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  const showSuccess = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  const showWarning = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

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

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      showError('Invalid File Type', 'Please upload a CSV file only');
      return false;
    }

    // Check file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('File Too Large', 'File size should be less than 10MB');
      return false;
    }

    // Check if file is empty
    if (file.size === 0) {
      showError('Empty File', 'The uploaded file is empty');
      return false;
    }

    return true;
  };

  const parseCSV = (csvText: string): { headers: string[]; rows: string[][] } => {
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file should have at least a header row and one data row');
    }

    // Parse CSV with proper handling of quoted fields
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++; // Skip next quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      result.push(current.trim());
      return result;
    };

    const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim());
    const rows = lines.slice(1).map(line => parseCSVLine(line).map(v => v.replace(/"/g, '').trim()));

    return { headers, rows };
  };

  const handleFileUpload = (file: File) => {
    console.log('File selected:', file.name, file.type, file.size);
    
    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);
    setPreviewData([]);
    setValidationResult(null);
    setSelectedRows(new Set());
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        
        if (!csv || csv.trim().length === 0) {
          throw new Error('File appears to be empty or corrupted');
        }

        const { headers, rows } = parseCSV(csv);
        
        console.log('Headers found:', headers);
        
        // Convert to objects with validation info
        const parsedData: ParsedRow[] = rows.map((values, index) => {
          const obj: ParsedRow = {
            _rowIndex: index,
            _isValid: true,
            _errors: []
          };
          
          headers.forEach((header, headerIndex) => {
            obj[header] = values[headerIndex] || '';
          });
          
          return obj;
        }).filter(row => Object.values(row).some(val => val && typeof val === 'string' && val.trim()));

        if (parsedData.length === 0) {
          throw new Error('No valid data rows found in the CSV file');
        }

        console.log('Parsed data:', parsedData);
        setPreviewData(parsedData);
        
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
        
        // Initial validation
        const validation = validateData(parsedData);
        setValidationResult(validation);
        
        if (validation.errors.length > 0) {
          showWarning('Data Validation Issues', `Found ${validation.errors.length} errors. Please review the data before importing.`);
        } else {
          showSuccess('File Processed Successfully', `Found ${parsedData.length} valid records ready for import.`);
        }
        
        setIsUploading(false);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        showError('File Processing Error', `Error parsing CSV file: ${errorMessage}`);
        setIsUploading(false);
        setUploadedFile(null);
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      showError('File Read Error', 'Error reading the selected file. Please try again.');
      setIsUploading(false);
      setUploadedFile(null);
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

  const getFilteredData = (): ParsedRow[] => {
    let filtered = [...previewData];

    if (filterSettings.skipInvalidRows) {
      filtered = filtered.filter(row => row._isValid);
    }

    if (filterSettings.skipDuplicates) {
      filtered = filtered.filter(row => !row._isDuplicate);
    }

    if (filterSettings.showWarningsOnly) {
      filtered = filtered.filter(row => !row._isValid || row._isDuplicate);
    }

    return filtered;
  };

  const handleRowSelection = (rowIndex: number, selected: boolean) => {
    const newSelection = new Set(selectedRows);
    if (selected) {
      newSelection.add(rowIndex);
    } else {
      newSelection.delete(rowIndex);
    }
    setSelectedRows(newSelection);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const filteredData = getFilteredData();
      setSelectedRows(new Set(filteredData.map(row => row._rowIndex)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleImport = async () => {
    if (!previewData.length) {
      showError('No Data', 'No data available to import');
      return;
    }

    // Validate that required fields are mapped
    const hasNameMapping = Object.values(fieldMappings).includes('name');
    const hasFileNoMapping = Object.values(fieldMappings).includes('file_no');
    
    if (!hasNameMapping || !hasFileNoMapping) {
      showError('Missing Required Mappings', 'Please map both Name and File Number fields before importing');
      return;
    }

    try {
      const dataToImport = getFilteredData();
      const selectedData = selectedRows.size > 0 
        ? dataToImport.filter(row => selectedRows.has(row._rowIndex))
        : dataToImport;

      if (selectedData.length === 0) {
        showError('No Records Selected', 'Please select at least one record to import');
        return;
      }

      const importData = selectedData.map(row => {
        const mapped = getMappedRowData(row);
        
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
      showSuccess('Import Successful', `Successfully imported ${importData.length} clients`);
    } catch (error) {
      console.error('Import failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      showError('Import Failed', `Import failed: ${errorMessage}. Please try again.`);
    }
  };

  const downloadTemplate = () => {
    try {
      const csvContent = "Name,Email,Mobile,File Number,Client Type,Status\nJohn Doe,john@example.com,+91-9876543210,FILE001,Individual,Active\nABC Corporation,contact@abc.com,+91-9876543211,FILE002,Company,Active";
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'client_import_template.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      showSuccess('Template Downloaded', 'Template file has been downloaded successfully');
    } catch (error) {
      showError('Download Failed', 'Failed to download template. Please try again.');
    }
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
              Successfully imported {selectedRows.size || previewData.length} clients from {uploadedFile?.name}
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
          <p className="text-gray-600">Upload and import client data from CSV files with smart validation</p>
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
                {validationResult && (
                  <div className="mt-4 space-y-2">
                    {validationResult.errors.length > 0 && (
                      <Badge variant="destructive" className="mr-2">
                        {validationResult.errors.length} Errors
                      </Badge>
                    )}
                    {validationResult.warnings.length > 0 && (
                      <Badge variant="secondary" className="mr-2">
                        {validationResult.warnings.length} Warnings
                      </Badge>
                    )}
                    {validationResult.duplicates.length > 0 && (
                      <Badge variant="outline" className="mr-2">
                        {validationResult.duplicates.length} Duplicates
                      </Badge>
                    )}
                  </div>
                )}
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
                {Object.keys(previewData[0] || {}).filter(key => !key.startsWith('_')).map((column) => (
                  <div key={column} className="space-y-2">
                    <Label>
                      File Column: {column}
                      {systemFields.find(f => f.value === fieldMappings[column])?.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                    <Select
                      value={fieldMappings[column] || 'skip'}
                      onValueChange={(value) => 
                        setFieldMappings(prev => ({ 
                          ...prev, 
                          [column]: value === 'skip' ? '' : value 
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select system field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="skip">Don't import</SelectItem>
                        {systemFields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filter and Smart Options */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Smart Filtering & Processing Options
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilterOptions(!showFilterOptions)}
              >
                {showFilterOptions ? 'Hide Options' : 'Show Options'}
              </Button>
            </CardHeader>
            {showFilterOptions && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="skipInvalid"
                      checked={filterSettings.skipInvalidRows}
                      onCheckedChange={(checked) =>
                        setFilterSettings(prev => ({ ...prev, skipInvalidRows: checked as boolean }))
                      }
                    />
                    <Label htmlFor="skipInvalid">Skip invalid rows</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="skipDuplicates"
                      checked={filterSettings.skipDuplicates}
                      onCheckedChange={(checked) =>
                        setFilterSettings(prev => ({ ...prev, skipDuplicates: checked as boolean }))
                      }
                    />
                    <Label htmlFor="skipDuplicates">Skip duplicate records</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mergeDuplicates"
                      checked={filterSettings.mergeDuplicates}
                      onCheckedChange={(checked) =>
                        setFilterSettings(prev => ({ ...prev, mergeDuplicates: checked as boolean }))
                      }
                    />
                    <Label htmlFor="mergeDuplicates">Merge duplicate records</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showWarnings"
                      checked={filterSettings.showWarningsOnly}
                      onCheckedChange={(checked) =>
                        setFilterSettings(prev => ({ ...prev, showWarningsOnly: checked as boolean }))
                      }
                    />
                    <Label htmlFor="showWarnings">Show only problematic rows</Label>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Preview Import Data</CardTitle>
                  <p className="text-sm text-gray-600">
                    Review and select records to import
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="selectAll"
                    checked={selectedRows.size === getFilteredData().length && getFilteredData().length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="selectAll" className="text-sm">Select All</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead className="w-16">Row</TableHead>
                      <TableHead className="w-20">Status</TableHead>
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
                    {getFilteredData().slice(0, 10).map((row) => (
                      <TableRow key={row._rowIndex} className={!row._isValid ? 'bg-red-50' : row._isDuplicate ? 'bg-yellow-50' : ''}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.has(row._rowIndex)}
                            onCheckedChange={(checked) => handleRowSelection(row._rowIndex, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>{row._rowIndex + 1}</TableCell>
                        <TableCell>
                          {!row._isValid ? (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Error
                            </Badge>
                          ) : row._isDuplicate ? (
                            <Badge variant="secondary" className="text-xs">
                              <Merge className="h-3 w-3 mr-1" />
                              Duplicate
                            </Badge>
                          ) : (
                            <Badge variant="default" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Valid
                            </Badge>
                          )}
                        </TableCell>
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

              {validationResult && (validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      {getFilteredData().length < previewData.length && (
                        <p>Showing {getFilteredData().length} of {previewData.length} records after filtering.</p>
                      )}
                      {validationResult.errors.length > 0 && (
                        <p className="text-red-600">
                          Found {validationResult.errors.length} validation errors. 
                          {filterSettings.skipInvalidRows ? ' Invalid rows will be skipped.' : ' Please fix errors before importing.'}
                        </p>
                      )}
                      {validationResult.duplicates.length > 0 && (
                        <p className="text-yellow-600">
                          Found {validationResult.duplicates.length} duplicate records.
                          {filterSettings.skipDuplicates ? ' Duplicates will be skipped.' : 
                           filterSettings.mergeDuplicates ? ' Duplicates will be merged.' : 
                           ' Please review duplicates.'}
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                  {selectedRows.size > 0 ? (
                    `${selectedRows.size} rows selected for import`
                  ) : (
                    `${getFilteredData().length} rows ready for import`
                  )}
                </div>
                <Button 
                  onClick={handleImport} 
                  disabled={isImporting || getFilteredData().length === 0}
                  className="flex items-center gap-2"
                >
                  {isImporting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isImporting ? 'Importing...' : `Import ${selectedRows.size || getFilteredData().length} Records`}
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
