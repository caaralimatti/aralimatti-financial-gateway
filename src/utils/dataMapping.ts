
import type { ParsedRow } from '@/types/clientImport';

export const getMappedRowData = (row: ParsedRow, fieldMappings: Record<string, string>) => {
  const mapped: any = {};
  Object.entries(fieldMappings).forEach(([fileCol, systemField]) => {
    if (systemField && row[fileCol]) {
      mapped[systemField] = row[fileCol];
    }
  });
  return mapped;
};
