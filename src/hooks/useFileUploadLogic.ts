
import { useToast } from '@/hooks/use-toast';
import { validateFile } from '@/utils/fileValidation';
import { parseCSV } from '@/utils/csvParser';
import { validateData } from '@/utils/dataValidation';
import type { ParsedRow, ValidationResult } from '@/types/clientImport';

export const useFileUploadLogic = (
  setIsUploading: (loading: boolean) => void,
  setUploadedFile: (file: File) => void,
  setPreviewData: (data: ParsedRow[]) => void,
  setValidationResult: (result: ValidationResult) => void,
  setSelectedRows: (rows: Set<number>) => void,
  setFieldMappings: (mappings: Record<string, string>) => void
) => {
  const { toast } = useToast();

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

  return {
    handleFileUpload,
    downloadTemplate,
    showError,
    showSuccess,
    showWarning
  };
};
