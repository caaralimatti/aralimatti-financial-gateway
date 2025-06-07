
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface TaxesApplicableSectionProps {
  taxesApplicable: {
    gst: boolean;
    incomeTax: boolean;
    other: boolean;
  };
  onTaxesChange: (taxes: { gst: boolean; incomeTax: boolean; other: boolean }) => void;
}

const TaxesApplicableSection = ({ taxesApplicable, onTaxesChange }: TaxesApplicableSectionProps) => {
  const handleTaxChange = (taxType: 'gst' | 'incomeTax' | 'other', checked: boolean) => {
    onTaxesChange({
      ...taxesApplicable,
      [taxType]: checked
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Taxes Applicable</h3>
      <div className="flex gap-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="gst" 
            checked={taxesApplicable.gst}
            onCheckedChange={(checked) => handleTaxChange('gst', !!checked)}
          />
          <Label htmlFor="gst">GST</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="incomeTax" 
            checked={taxesApplicable.incomeTax}
            onCheckedChange={(checked) => handleTaxChange('incomeTax', !!checked)}
          />
          <Label htmlFor="incomeTax">Income Tax</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="other" 
            checked={taxesApplicable.other}
            onCheckedChange={(checked) => handleTaxChange('other', !!checked)}
          />
          <Label htmlFor="other">Other</Label>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Other taxes like Professional Tax, Property Tax, etc.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default TaxesApplicableSection;
