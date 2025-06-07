
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface IncomeTaxTabProps {
  clientForm: any;
  setClientForm: (form: any) => void;
}

const IncomeTaxTab = ({ clientForm, setClientForm }: IncomeTaxTabProps) => {
  const incomeTypes = [
    'ITR - Unaudited',
    'ITR - Stat Audit',
    'ITR - Income Tax Audit',
    'TDS Return - Salary',
    'TDS Return - Non Salary',
    'TDS Return - Non Resident',
    'TCS Return',
    'Advance Tax',
    'Advance Tax - One Instalment',
    'SFT'
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Returns You File in IT <span className="text-red-500">*</span>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Select the types of returns you file for income tax</p>
            </TooltipContent>
          </Tooltip>
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {incomeTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox id={type} />
              <Label htmlFor={type} className="text-sm">{type}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pan">PAN</Label>
          <Input
            id="pan"
            placeholder="PAN"
            value={clientForm.incomeTaxDetails.pan}
            onChange={(e) => setClientForm(prev => ({
              ...prev,
              incomeTaxDetails: { ...prev.incomeTaxDetails, pan: e.target.value }
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tan">TAN</Label>
          <Input
            id="tan"
            placeholder="TAN"
            value={clientForm.incomeTaxDetails.tan}
            onChange={(e) => setClientForm(prev => ({
              ...prev,
              incomeTaxDetails: { ...prev.incomeTaxDetails, tan: e.target.value }
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default IncomeTaxTab;
