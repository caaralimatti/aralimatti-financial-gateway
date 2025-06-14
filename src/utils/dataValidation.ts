
import type { ParsedRow, ValidationResult } from '@/types/clientImport';
import { validateSingleRow } from './validationRules';
import { detectDuplicates } from './duplicateDetection';

export { getMappedRowData } from './dataMapping';

export const validateData = (data: ParsedRow[], fieldMappings: Record<string, string>): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    duplicates: []
  };

  // Validate each row individually
  data.forEach((row, index) => {
    row._errors = [];
    row._isValid = true;
    row._rowIndex = index;

    // Validate the row using extracted validation rules
    const rowErrors = validateSingleRow(row, fieldMappings);
    row._errors = rowErrors;
    row._isValid = rowErrors.length === 0;

    if (!row._isValid) {
      result.isValid = false;
      result.errors.push(`Row ${index + 1}: ${rowErrors.join(', ')}`);
    }
  });

  // Detect duplicates using the dedicated utility
  const duplicateResults = detectDuplicates(data, fieldMappings);
  result.duplicates = duplicateResults.duplicates;
  result.warnings = duplicateResults.warnings;

  return result;
};
