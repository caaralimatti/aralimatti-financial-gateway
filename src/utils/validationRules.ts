
import type { ParsedRow } from '@/types/clientImport';
import { isValidEmail, isValidMobile } from './fileValidation';
import { getMappedRowData } from './dataMapping';

export const validateRequiredFields = (row: ParsedRow, fieldMappings: Record<string, string>): string[] => {
  const errors: string[] = [];
  const mappedData = getMappedRowData(row, fieldMappings);
  
  if (!mappedData.name?.trim()) {
    errors.push('Name is required');
  }
  if (!mappedData.file_no?.trim()) {
    errors.push('File Number is required');
  }
  
  return errors;
};

export const validateEmailField = (row: ParsedRow, fieldMappings: Record<string, string>): string[] => {
  const errors: string[] = [];
  const mappedData = getMappedRowData(row, fieldMappings);
  
  if (mappedData.email && !isValidEmail(mappedData.email)) {
    errors.push('Invalid email format');
  }
  
  return errors;
};

export const validateMobileField = (row: ParsedRow, fieldMappings: Record<string, string>): string[] => {
  const errors: string[] = [];
  const mappedData = getMappedRowData(row, fieldMappings);
  
  if (mappedData.mobile && !isValidMobile(mappedData.mobile)) {
    errors.push('Invalid mobile number format');
  }
  
  return errors;
};

export const validateSingleRow = (row: ParsedRow, fieldMappings: Record<string, string>): string[] => {
  const errors: string[] = [];
  
  errors.push(...validateRequiredFields(row, fieldMappings));
  errors.push(...validateEmailField(row, fieldMappings));
  errors.push(...validateMobileField(row, fieldMappings));
  
  return errors;
};
