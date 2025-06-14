
import type { ParsedRow, ValidationResult } from '@/types/clientImport';
import { isValidEmail, isValidMobile } from './fileValidation';
import { getMappedRowData } from './dataMapping';

export { getMappedRowData } from './dataMapping';

export const validateData = (data: ParsedRow[], fieldMappings: Record<string, string>): ValidationResult => {
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
    const mappedData = getMappedRowData(row, fieldMappings);
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
