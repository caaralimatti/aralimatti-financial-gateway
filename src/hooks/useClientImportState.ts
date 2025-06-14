
import { useState } from 'react';
import type { ParsedRow, ValidationResult, FilterSettings } from '@/types/clientImport';

export const useClientImportState = () => {
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

  return {
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
  };
};
