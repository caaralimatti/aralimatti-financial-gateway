
import { useClientImport } from '@/hooks/useClientImport';
import { useToast } from '@/hooks/use-toast';
import { getMappedRowData } from '@/utils/dataValidation';
import type { ParsedRow } from '@/types/clientImport';

export const useImportLogic = (
  previewData: ParsedRow[],
  fieldMappings: Record<string, string>,
  selectedRows: Set<number>,
  setImportComplete: (complete: boolean) => void
) => {
  const { importClients, isImporting } = useClientImport();
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

  return {
    handleImport,
    isImporting
  };
};
