
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ComplianceTypeFilterProps {
  complianceTypes: string[];
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const ComplianceTypeFilter: React.FC<ComplianceTypeFilterProps> = ({
  complianceTypes,
  selectedType,
  onTypeChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="compliance-filter" className="text-sm font-medium">
        Filter by Type:
      </Label>
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select compliance type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {complianceTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ComplianceTypeFilter;
