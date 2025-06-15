
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import type { ClientFormData } from '@/types/clientForm';

interface TaxDetailsTabProps {
  clientForm: ClientFormData;
  setClientForm: (form: ClientFormData) => void;
}

const incomeTypes = [
  'ITR - Unaudited',
  'ITR - Stat Audit',
  'ITR - Income Tax Audit',
  'Advance Tax',
  'Advance Tax - One Instalment',
  'SFT'
];

const tdsTcsTypes = [
  'TDS Return - Salary',
  'TDS Return - Non Salary',
  'TDS Return - Non Resident',
  'TCS Return'
];

const TaxDetailsTab = ({ clientForm, setClientForm }: TaxDetailsTabProps) => {
  const { taxesApplicable, incomeTaxDetails } = clientForm;

  // Handlers for checkboxes
  const handleITRTypeToggle = (type: string) => {
    setClientForm({
      ...clientForm,
      incomeTaxDetails: {
        ...clientForm.incomeTaxDetails,
        incomeTaxReturns: clientForm.incomeTaxDetails.incomeTaxReturns.includes(type)
          ? clientForm.incomeTaxDetails.incomeTaxReturns.filter((ret: string) => ret !== type)
          : [...clientForm.incomeTaxDetails.incomeTaxReturns, type]
      }
    });
  };

  const handleTdsTcsTypeToggle = (type: string) => {
    setClientForm({
      ...clientForm,
      incomeTaxDetails: {
        ...clientForm.incomeTaxDetails,
        tdsTcsReturns: clientForm.incomeTaxDetails.tdsTcsReturns.includes(type)
          ? clientForm.incomeTaxDetails.tdsTcsReturns.filter((ret: string) => ret !== type)
          : [...clientForm.incomeTaxDetails.tdsTcsReturns, type]
      }
    });
  };

  const handleGstReturnsToggle = (checked: boolean) => {
    setClientForm({
      ...clientForm,
      incomeTaxDetails: {
        ...clientForm.incomeTaxDetails,
        gstReturns: checked
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* INCOME TAX RETURNS */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Returns You File in IT <span className="text-red-500">*</span>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Select the types of returns you file for tax.</p>
            </TooltipContent>
          </Tooltip>
        </Label>
        {taxesApplicable.incomeTax && (
          <div className="grid grid-cols-2 gap-2">
            {incomeTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={incomeTaxDetails.incomeTaxReturns.includes(type)}
                  onCheckedChange={() => handleITRTypeToggle(type)}
                />
                <Label htmlFor={type} className="text-sm">{type}</Label>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* TDS/TCS RETURNS */}
      {taxesApplicable.tdsTcs && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            TDS/TCS Returns
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Select TDS/TCS returns you handle.</p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {tdsTcsTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={incomeTaxDetails.tdsTcsReturns.includes(type)}
                  onCheckedChange={() => handleTdsTcsTypeToggle(type)}
                />
                <Label htmlFor={type} className="text-sm">{type}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* GST Returns */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="gstReturns"
            checked={!!incomeTaxDetails.gstReturns}
            onCheckedChange={(checked) => handleGstReturnsToggle(!!checked)}
          />
          <Label htmlFor="gstReturns" className="text-sm">
            GST Returns
          </Label>
        </div>
      </div>

      {/* PAN and TAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pan">PAN</Label>
          <Input
            id="pan"
            placeholder="PAN"
            value={incomeTaxDetails.pan}
            onChange={(e) => setClientForm({
              ...clientForm,
              incomeTaxDetails: { ...clientForm.incomeTaxDetails, pan: e.target.value }
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tan">TAN</Label>
          <Input
            id="tan"
            placeholder="TAN"
            value={incomeTaxDetails.tan}
            onChange={(e) => setClientForm({
              ...clientForm,
              incomeTaxDetails: { ...clientForm.incomeTaxDetails, tan: e.target.value }
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default TaxDetailsTab;
