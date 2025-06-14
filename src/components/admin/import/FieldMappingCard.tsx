
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SystemField } from '@/types/clientImport';

interface FieldMappingCardProps {
  fileColumns: string[];
  fieldMappings: Record<string, string>;
  systemFields: SystemField[];
  onMappingChange: (column: string, value: string) => void;
}

const FieldMappingCard: React.FC<FieldMappingCardProps> = ({
  fileColumns,
  fieldMappings,
  systemFields,
  onMappingChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Map Fields</CardTitle>
        <p className="text-sm text-gray-600">
          Map the columns from your file to the corresponding system fields
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fileColumns.map((column) => (
            <div key={column} className="space-y-2">
              <Label>
                File Column: {column}
                {systemFields.find(f => f.value === fieldMappings[column])?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              <Select
                value={fieldMappings[column] || 'skip'}
                onValueChange={(value) => 
                  onMappingChange(column, value === 'skip' ? '' : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select system field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skip">Don't import</SelectItem>
                  {systemFields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldMappingCard;
