
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import ClientFormTabs from './ClientFormTabs';

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddClientModal = ({ open, onOpenChange }: AddClientModalProps) => {
  const [clientForm, setClientForm] = useState({
    taxesApplicable: {
      gst: false,
      incomeTax: true,
      other: false
    },
    basicDetails: {
      fileNo: '',
      clientType: '',
      name: '',
      tradeName: '',
      dateOfBirth: '',
      otherUsers: '',
      workingUser: '',
      tags: '',
      notes: ''
    },
    incomeTaxDetails: {
      returns: [],
      pan: '',
      tan: ''
    },
    contactPersons: [],
    clientGroups: [],
    loginDetails: {
      itPan: '',
      itPassword: '',
      itTan: '',
      itDeductorPassword: '',
      tracesUsername: '',
      tracesDeductorPassword: '',
      tracesTaxpayerPassword: '',
      mcaV2Username: '',
      mcaV2Password: '',
      mcaV3Username: '',
      mcaV3Password: '',
      dgftUsername: '',
      dgftPassword: ''
    },
    attachments: []
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold">Add Client</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button>Save Client</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Taxes Applicable */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Taxes Applicable</h3>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="gst" 
                  checked={clientForm.taxesApplicable.gst}
                  onCheckedChange={(checked) => 
                    setClientForm(prev => ({
                      ...prev,
                      taxesApplicable: { ...prev.taxesApplicable, gst: !!checked }
                    }))
                  }
                />
                <Label htmlFor="gst">GST</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incomeTax" 
                  checked={clientForm.taxesApplicable.incomeTax}
                  onCheckedChange={(checked) => 
                    setClientForm(prev => ({
                      ...prev,
                      taxesApplicable: { ...prev.taxesApplicable, incomeTax: !!checked }
                    }))
                  }
                />
                <Label htmlFor="incomeTax">Income Tax</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="other" 
                  checked={clientForm.taxesApplicable.other}
                  onCheckedChange={(checked) => 
                    setClientForm(prev => ({
                      ...prev,
                      taxesApplicable: { ...prev.taxesApplicable, other: !!checked }
                    }))
                  }
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

          <ClientFormTabs clientForm={clientForm} setClientForm={setClientForm} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
