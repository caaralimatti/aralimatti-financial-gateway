
import type { ParsedRow, ValidationResult } from '@/types/clientImport';
import { getMappedRowData } from './dataMapping';

interface DuplicateTracker {
  seenValues: Record<string, number[]>;
  duplicates: Array<{ row: number; field: string; value: string; existingRow: number }>;
  warnings: string[];
}

export const detectDuplicates = (data: ParsedRow[], fieldMappings: Record<string, string>): Pick<ValidationResult, 'duplicates' | 'warnings'> => {
  const tracker: DuplicateTracker = {
    seenValues: {},
    duplicates: [],
    warnings: []
  };

  data.forEach((row, index) => {
    const mappedData = getMappedRowData(row, fieldMappings);
    
    // Check for file number duplicates
    checkFileNumberDuplicates(row, mappedData, index, tracker);
    
    // Check for email duplicates (warning only)
    checkEmailDuplicates(mappedData, index, tracker);
  });

  return {
    duplicates: tracker.duplicates,
    warnings: tracker.warnings
  };
};

const checkFileNumberDuplicates = (
  row: ParsedRow, 
  mappedData: any, 
  index: number, 
  tracker: DuplicateTracker
): void => {
  if (mappedData.file_no) {
    const key = `file_no_${mappedData.file_no.toLowerCase()}`;
    if (!tracker.seenValues[key]) tracker.seenValues[key] = [];
    tracker.seenValues[key].push(index);
    
    if (tracker.seenValues[key].length > 1) {
      row._isDuplicate = true;
      row._duplicateOf = mappedData.file_no;
      tracker.duplicates.push({
        row: index + 1,
        field: 'File Number',
        value: mappedData.file_no,
        existingRow: tracker.seenValues[key][0] + 1
      });
    }
  }
};

const checkEmailDuplicates = (
  mappedData: any, 
  index: number, 
  tracker: DuplicateTracker
): void => {
  if (mappedData.email) {
    const key = `email_${mappedData.email.toLowerCase()}`;
    if (!tracker.seenValues[key]) tracker.seenValues[key] = [];
    tracker.seenValues[key].push(index);
    
    if (tracker.seenValues[key].length > 1) {
      tracker.warnings.push(`Duplicate email "${mappedData.email}" found in rows ${tracker.seenValues[key].map(i => i + 1).join(', ')}`);
    }
  }
};
