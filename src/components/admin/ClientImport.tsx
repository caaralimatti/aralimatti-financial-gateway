import React, { useState } from 'react';
import { useClientImport } from '@/hooks/useClientImport';
import { useToast } from '@/hooks/use-toast';
import { validateFile } from '@/utils/fileValidation';
import { parseCSV } from '@/utils/csvParser';
import { validateData, getMappedRowData } from '@/utils/dataValidation';
import FileUploadZone from './import/FileUploadZone';
import FieldMappingCard from './import/FieldMappingCard';
import FilterOptionsCard from './import/FilterOptionsCard';
import PreviewDataTable from './import/PreviewDataTable';
import ImportCompleteCard from './import/ImportCompleteCard';
import type { ParsedRow, ValidationResult, FilterSettings, SystemField } from '@/types/clientImport';

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
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    skipInvalidRows: true,
    skipDuplicates: false,
    mergeDuplicates: false,
    showWarningsOnly: false
  });
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // System fields for mapping
  const systemFields: SystemField[] = [
    { value: 'name', label: 'Client Name', required: true },
    { value: 'email', label: 'Email Address', required: false },
    { value: 'mobile', label: 'Mobile Number', required: false },
    { value: 'client_type', label: 'Type of Client', required: false },
    { value: 'file_no', label: 'File Number', required: true },
    { value: 'status', label: 'Status', required: false }
  ];

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

  const handleFileUpload = (file: File) => {
    console.log('File selected:', file.name, file.type, file.size);
    
    const validation = validateFile(file);
    if (!validation.isValid) {
      showError('Invalid File', validation.error!);
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
            _errors: [] // Initialize as empty array, not undefined array
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
        const validation = validateData(parsedData, autoMappings);
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

  const handleMappingChange = (column: string, value: string) => {
    const newMappings = { ...fieldMappings, [column]: value };
    setFieldMappings(newMappings);
    
    // Re-validate data when mappings change
    if (previewData.length > 0) {
      const validation = validateData(previewData, newMappings);
      setValidationResult(validation);
    }
  };

  const handleFilterSettingChange = (setting: keyof FilterSettings, value: boolean) => {
    setFilterSettings(prev => ({ ...prev, [setting]: value }));
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
      const validData = previewData.filter(row => row._isValid);
      setSelectedRows(new Set(validData.map(row => row._rowIndex)));
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
      const validData = previewData.filter(row => row._isValid);
      const selectedData = selectedRows.size > 0 
        ? validData.filter(row => selectedRows.has(row._rowIndex))
        : validData;

      if (selectedData.length === 0) {
        showError('No Records Selected', 'Please select at least one record to import');
        return;
      }

      const importData = selectedData.map(row => {
        const mapped = getMappedRowData(row, fieldMappings);
        
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

        <ImportCompleteCard
          importedCount={selectedRows.size || previewData.length}
          fileName={uploadedFile?.name || ''}
          onImportMore={() => window.location.reload()}
          onBackToImport={() => setImportComplete(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Import Clients</h2>
        <p className="text-gray-600">Upload and import client data from CSV files with smart validation</p>
      </div>

      <FileUploadZone
        uploadedFile={uploadedFile}
        isUploading={isUploading}
        previewDataLength={previewData.length}
        validationResult={validationResult}
        dragActive={dragActive}
        onDrag={handleDrag}
        onDrop={handleDrop}
        onFileUpload={handleFileUpload}
        onDownloadTemplate={downloadTemplate}
      />

      {uploadedFile && !isUploading && previewData.length > 0 && (
        <>
          <FieldMappingCard
            fileColumns={Object.keys(previewData[0] || {}).filter(key => !key.startsWith('_'))}
            fieldMappings={fieldMappings}
            systemFields={systemFields}
            onMappingChange={handleMappingChange}
          />

          <FilterOptionsCard
            filterSettings={filterSettings}
            showFilterOptions={showFilterOptions}
            onToggleOptions={() => setShowFilterOptions(!showFilterOptions)}
            onSettingChange={handleFilterSettingChange}
          />

          <PreviewDataTable
            previewData={previewData}
            fieldMappings={fieldMappings}
            systemFields={systemFields}
            validationResult={validationResult}
            selectedRows={selectedRows}
            isImporting={isImporting}
            onRowSelection={handleRowSelection}
            onSelectAll={handleSelectAll}
            onImport={handleImport}
          />
        </>
      )}
    </div>
  );
};

export default ClientImport;
