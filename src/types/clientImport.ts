
export interface ParsedRow {
  // CSV column data - dynamic properties from the CSV file
  [key: string]: string | number | boolean | string[] | undefined;
  
  // Metadata properties for row processing
  _rowIndex: number;
  _isValid: boolean;
  _errors: string[];
  _isDuplicate?: boolean;
  _duplicateOf?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  duplicates: Array<{ row: number; field: string; value: string; existingRow: number }>;
}

export interface FilterSettings {
  skipInvalidRows: boolean;
  skipDuplicates: boolean;
  mergeDuplicates: boolean;
  showWarningsOnly: boolean;
}

export interface SystemField {
  value: string;
  label: string;
  required: boolean;
}

export interface ImportData {
  name: string;
  email?: string;
  mobile?: string;
  file_no: string;
  client_type: string;
  status?: string;
}
