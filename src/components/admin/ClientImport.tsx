
import React from 'react';
import { validateData } from '@/utils/dataValidation';
import { useClientImportState } from '@/hooks/useClientImportState';
import { useFileUploadLogic } from '@/hooks/useFileUploadLogic';
import { useImportLogic } from '@/hooks/useImportLogic';
import { useDragAndDropHandlers } from '@/hooks/useDragAndDropHandlers';
import FileUploadZone from './import/FileUploadZone';
import FieldMappingCard from './import/FieldMappingCard';
import FilterOptionsCard from './import/FilterOptionsCard';
import PreviewDataTable from './import/PreviewDataTable';
import ImportCompleteCard from './import/ImportCompleteCard';
import type { FilterSettings, SystemField } from '@/types/clientImport';

const ClientImport: React.FC = () => {
  const {
    dragActive,
    setDragActive,
    uploadedFile,
    setUploadedFile,
    isUploading,
    setIsUploading,
    importComplete,
    setImportComplete,
    fieldMappings,
    setFieldMappings,
    previewData,
    setPreviewData,
    validationResult,
    setValidationResult,
    showFilterOptions,
    setShowFilterOptions,
    filterSettings,
    setFilterSettings,
    selectedRows,
    setSelectedRows
  } = useClientImportState();

  const { handleFileUpload, downloadTemplate } = useFileUploadLogic(
    setIsUploading,
    setUploadedFile,
    setPreviewData,
    setValidationResult,
    setSelectedRows,
    setFieldMappings
  );

  const { handleImport, isImporting } = useImportLogic(
    previewData,
    fieldMappings,
    selectedRows,
    setImportComplete
  );

  const { handleDrag, handleDrop } = useDragAndDropHandlers(
    setDragActive,
    handleFileUpload
  );

  // System fields for mapping
  const systemFields: SystemField[] = [
    { value: 'name', label: 'Client Name', required: true },
    { value: 'email', label: 'Email Address', required: false },
    { value: 'mobile', label: 'Mobile Number', required: false },
    { value: 'client_type', label: 'Type of Client', required: false },
    { value: 'file_no', label: 'File Number', required: true },
    { value: 'status', label: 'Status', required: false }
  ];

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
