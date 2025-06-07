
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Loader2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import ClientFormTabs from './ClientFormTabs';
import type { Tables } from '@/integrations/supabase/types';

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingClient?: Tables<'clients'> | null;
}

const AddClientModal = ({ open, onOpenChange, editingClient }: AddClientModalProps) => {
  const { createClient, updateClient, isCreating, isUpdating } = useClients();
  
  const [clientForm, setClientForm] = useState({
    taxesApplicable: {
      gst: editingClient?.gst_applicable || false,
      incomeTax: editingClient?.income_tax_applicable !== false,
      other: editingClient?.other_tax_applicable || false
    },
    basicDetails: {
      fileNo: editingClient?.file_no || '',
      clientType: editingClient?.client_type || '',
      name: editingClient?.name || '',
      tradeName: editingClient?.trade_name || '',
      dateOfBirth: editingClient?.date_of_birth || '',
      otherUsers: editingClient?.other_users || '',
      workingUser: editingClient?.working_user_id || '',
      tags: editingClient?.tags?.join(', ') || '',
      notes: editingClient?.notes || ''
    },
    incomeTaxDetails: {
      returns: [],
      pan: editingClient?.pan || '',
      tan: editingClient?.tan || ''
    },
    contactPersons: [],
    clientGroups: [],
    loginDetails: {
      itPan: editingClient?.it_pan || '',
      itPassword: editingClient?.it_password || '',
      itTan: editingClient?.it_tan || '',
      itDeductorPassword: editingClient?.it_deductor_password || '',
      tracesUsername: editingClient?.traces_username || '',
      tracesDeductorPassword: editingClient?.traces_deductor_password || '',
      tracesTaxpayerPassword: editingClient?.traces_taxpayer_password || '',
      mcaV2Username: editingClient?.mca_v2_username || '',
      mcaV2Password: editingClient?.mca_v2_password || '',
      mcaV3Username: editingClient?.mca_v3_username || '',
      mcaV3Password: editingClient?.mca_v3_password || '',
      dgftUsername: editingClient?.dgft_username || '',
      dgftPassword: editingClient?.dgft_password || '',
      // GST specific fields
      gstNumber: editingClient?.gst_number || '',
      gstUsername: editingClient?.gst_username || '',
      gstPassword: editingClient?.gst_password || '',
      gstRegistrationType: editingClient?.gst_registration_type || 'Regular',
      gstReturnFrequency: editingClient?.gst_return_frequency || 'Monthly'
    },
    attachments: []
  });

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!clientForm.basicDetails.name || !clientForm.basicDetails.clientType || !clientForm.basicDetails.fileNo) {
        console.error('Missing required fields');
        return;
      }

      const clientData = {
        file_no: clientForm.basicDetails.fileNo,
        client_type: clientForm.basicDetails.clientType as any,
        name: clientForm.basicDetails.name,
        trade_name: clientForm.basicDetails.tradeName || null,
        date_of_birth: clientForm.basicDetails.dateOfBirth || null,
        other_users: clientForm.basicDetails.otherUsers || null,
        working_user_id: clientForm.basicDetails.workingUser || null,
        tags: clientForm.basicDetails.tags ? clientForm.basicDetails.tags.split(',').map(tag => tag.trim()).filter(Boolean) : null,
        notes: clientForm.basicDetails.notes || null,
        
        // Taxes applicable
        gst_applicable: clientForm.taxesApplicable.gst,
        income_tax_applicable: clientForm.taxesApplicable.incomeTax,
        other_tax_applicable: clientForm.taxesApplicable.other,
        
        // Income tax details
        pan: clientForm.incomeTaxDetails.pan || null,
        tan: clientForm.incomeTaxDetails.tan || null,
        
        // Login details
        it_pan: clientForm.loginDetails.itPan || null,
        it_password: clientForm.loginDetails.itPassword || null,
        it_tan: clientForm.loginDetails.itTan || null,
        it_deductor_password: clientForm.loginDetails.itDeductorPassword || null,
        traces_username: clientForm.loginDetails.tracesUsername || null,
        traces_deductor_password: clientForm.loginDetails.tracesDeductorPassword || null,
        traces_taxpayer_password: clientForm.loginDetails.tracesTaxpayerPassword || null,
        mca_v2_username: clientForm.loginDetails.mcaV2Username || null,
        mca_v2_password: clientForm.loginDetails.mcaV2Password || null,
        mca_v3_username: clientForm.loginDetails.mcaV3Username || null,
        mca_v3_password: clientForm.loginDetails.mcaV3Password || null,
        dgft_username: clientForm.loginDetails.dgftUsername || null,
        dgft_password: clientForm.loginDetails.dgftPassword || null,
        
        // GST details (only save if GST is applicable)
        gst_number: clientForm.taxesApplicable.gst ? clientForm.loginDetails.gstNumber || null : null,
        gst_username: clientForm.taxesApplicable.gst ? clientForm.loginDetails.gstUsername || null : null,
        gst_password: clientForm.taxesApplicable.gst ? clientForm.loginDetails.gstPassword || null : null,
        gst_registration_type: clientForm.taxesApplicable.gst ? clientForm.loginDetails.gstRegistrationType || null : null,
        gst_return_frequency: clientForm.taxesApplicable.gst ? clientForm.loginDetails.gstReturnFrequency || null : null,
      };

      if (editingClient) {
        await updateClient({ id: editingClient.id, ...clientData });
      } else {
        await createClient(clientData);
      }

      onOpenChange(false);
      
      // Reset form
      setClientForm({
        taxesApplicable: { gst: false, incomeTax: false, other: false },
        basicDetails: { fileNo: '', clientType: '', name: '', tradeName: '', dateOfBirth: '', otherUsers: '', workingUser: '', tags: '', notes: '' },
        incomeTaxDetails: { returns: [], pan: '', tan: '' },
        contactPersons: [],
        clientGroups: [],
        loginDetails: { 
          itPan: '', itPassword: '', itTan: '', itDeductorPassword: '', 
          tracesUsername: '', tracesDeductorPassword: '', tracesTaxpayerPassword: '', 
          mcaV2Username: '', mcaV2Password: '', mcaV3Username: '', mcaV3Password: '', 
          dgftUsername: '', dgftPassword: '',
          gstNumber: '', gstUsername: '', gstPassword: '', gstRegistrationType: 'Regular', gstReturnFrequency: 'Monthly'
        },
        attachments: []
      });
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold">
              {editingClient ? 'Edit Client' : 'Add Client'}
            </DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editingClient ? 'Update Client' : 'Save Client'}
              </Button>
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
