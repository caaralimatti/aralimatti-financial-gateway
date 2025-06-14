
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Loader2 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ValidationResult } from '@/types/clientImport';

interface FileUploadZoneProps {
  uploadedFile: File | null;
  isUploading: boolean;
  previewDataLength: number;
  validationResult: ValidationResult | null;
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileUpload: (file: File) => void;
  onDownloadTemplate: () => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  uploadedFile,
  isUploading,
  previewDataLength,
  validationResult,
  dragActive,
  onDrag,
  onDrop,
  onFileUpload,
  onDownloadTemplate
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upload File</CardTitle>
        <Button variant="outline" onClick={onDownloadTemplate} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Template
        </Button>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
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
              <p className="text-sm text-gray-500 mt-2">{previewDataLength} records found</p>
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
  );
};

export default FileUploadZone;
