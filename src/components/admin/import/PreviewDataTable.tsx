
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Merge,
  AlertTriangle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { ParsedRow, ValidationResult, SystemField } from '@/types/clientImport';

interface PreviewDataTableProps {
  previewData: ParsedRow[];
  fieldMappings: Record<string, string>;
  systemFields: SystemField[];
  validationResult: ValidationResult | null;
  selectedRows: Set<number>;
  isImporting: boolean;
  onRowSelection: (rowIndex: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onImport: () => void;
}

const PreviewDataTable: React.FC<PreviewDataTableProps> = ({
  previewData,
  fieldMappings,
  systemFields,
  validationResult,
  selectedRows,
  isImporting,
  onRowSelection,
  onSelectAll,
  onImport
}) => {
  const getFilteredData = (): ParsedRow[] => {
    return previewData.filter(row => row._isValid);
  };

  const filteredData = getFilteredData();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Preview Import Data</CardTitle>
            <p className="text-sm text-gray-600">
              Review and select records to import
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="selectAll"
              checked={selectedRows.size === filteredData.length && filteredData.length > 0}
              onCheckedChange={onSelectAll}
            />
            <Label htmlFor="selectAll" className="text-sm">Select All</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border max-h-96 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead className="w-16">Row</TableHead>
                <TableHead className="w-20">Status</TableHead>
                {Object.entries(fieldMappings).map(([fileCol, systemField]) => 
                  systemField && (
                    <TableHead key={fileCol}>
                      {systemFields.find(f => f.value === systemField)?.label || systemField}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.slice(0, 10).map((row) => (
                <TableRow key={row._rowIndex} className={!row._isValid ? 'bg-red-50' : row._isDuplicate ? 'bg-yellow-50' : ''}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(row._rowIndex)}
                      onCheckedChange={(checked) => onRowSelection(row._rowIndex, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>{row._rowIndex + 1}</TableCell>
                  <TableCell>
                    {!row._isValid ? (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Error
                      </Badge>
                    ) : row._isDuplicate ? (
                      <Badge variant="secondary" className="text-xs">
                        <Merge className="h-3 w-3 mr-1" />
                        Duplicate
                      </Badge>
                    ) : (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Valid
                      </Badge>
                    )}
                  </TableCell>
                  {Object.entries(fieldMappings).map(([fileCol, systemField]) => 
                    systemField && (
                      <TableCell key={fileCol}>
                        {row[fileCol]}
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {validationResult && (validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                {filteredData.length < previewData.length && (
                  <p>Showing {filteredData.length} of {previewData.length} records after filtering.</p>
                )}
                {validationResult.errors.length > 0 && (
                  <p className="text-red-600">
                    Found {validationResult.errors.length} validation errors. Invalid rows will be skipped.
                  </p>
                )}
                {validationResult.duplicates.length > 0 && (
                  <p className="text-yellow-600">
                    Found {validationResult.duplicates.length} duplicate records. Please review duplicates.
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            {selectedRows.size > 0 ? (
              `${selectedRows.size} rows selected for import`
            ) : (
              `${filteredData.length} rows ready for import`
            )}
          </div>
          <Button 
            onClick={onImport} 
            disabled={isImporting || filteredData.length === 0}
            className="flex items-center gap-2"
          >
            {isImporting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isImporting ? 'Importing...' : `Import ${selectedRows.size || filteredData.length} Records`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewDataTable;
