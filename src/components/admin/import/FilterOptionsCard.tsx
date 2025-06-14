
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter } from 'lucide-react';
import type { FilterSettings } from '@/types/clientImport';

interface FilterOptionsCardProps {
  filterSettings: FilterSettings;
  showFilterOptions: boolean;
  onToggleOptions: () => void;
  onSettingChange: (setting: keyof FilterSettings, value: boolean) => void;
}

const FilterOptionsCard: React.FC<FilterOptionsCardProps> = ({
  filterSettings,
  showFilterOptions,
  onToggleOptions,
  onSettingChange
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Smart Filtering & Processing Options
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onToggleOptions}>
          {showFilterOptions ? 'Hide Options' : 'Show Options'}
        </Button>
      </CardHeader>
      {showFilterOptions && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="skipInvalid"
                checked={filterSettings.skipInvalidRows}
                onCheckedChange={(checked) =>
                  onSettingChange('skipInvalidRows', checked as boolean)
                }
              />
              <Label htmlFor="skipInvalid">Skip invalid rows</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="skipDuplicates"
                checked={filterSettings.skipDuplicates}
                onCheckedChange={(checked) =>
                  onSettingChange('skipDuplicates', checked as boolean)
                }
              />
              <Label htmlFor="skipDuplicates">Skip duplicate records</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mergeDuplicates"
                checked={filterSettings.mergeDuplicates}
                onCheckedChange={(checked) =>
                  onSettingChange('mergeDuplicates', checked as boolean)
                }
              />
              <Label htmlFor="mergeDuplicates">Merge duplicate records</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showWarnings"
                checked={filterSettings.showWarningsOnly}
                onCheckedChange={(checked) =>
                  onSettingChange('showWarningsOnly', checked as boolean)
                }
              />
              <Label htmlFor="showWarnings">Show only problematic rows</Label>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default FilterOptionsCard;
