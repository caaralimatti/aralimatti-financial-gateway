
import { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import type { Tables } from '@/integrations/supabase/types';

interface ClientFormData {
  taxesApplicable: {
    gst: boolean;
    incomeTax: boolean;
    other: boolean;
  };
  basicDetails: {
    fileNo: string;
    clientType: string;
    name: string;
    tradeName: string;
    dateOfBirth: string;
    otherUsers: string;
    workingUser: string;
    tags: string;
    notes: string;
  };
  incomeTaxDetails: {
    returns: any[];
    pan: string;
    tan: string;
  };
  contactPersons: any[];
  clientGroups: any[];
  loginDetails: {
    itPan: string;
    itPassword: string;
    itTan: string;
    itDeductorPassword: string;
    tracesUsername: string;
    tracesDeductorPassword: string;
    tracesTaxpayerPassword: string;
    mcaV2Username: string;
    mcaV2Password: string;
    mcaV3Username: string;
    mcaV3Password: string;
    dgftUsername: string;
    dgftPassword: string;
    gstNumber: string;
    gstUsername: string;
    gstPassword: string;
    gstRegistrationType: string;
    gstReturnFrequency: string;
  };
  attachments: any[];
}

const getInitialFormData = (editingClient?: Tables<'clients'> | null): ClientFormData => ({
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
    gstNumber: editingClient?.gst_number || '',
    gstUsername: editingClient?.gst_username || '',
    gstPassword: editingClient?.gst_password || '',
    gstRegistrationType: editingClient?.gst_registration_type || 'Regular',
    gstReturnFrequency: editingClient?.gst_return_frequency || 'Monthly'
  },
  attachments: []
});

export const useClientForm = (editingClient?: Tables<'clients'> | null) => {
  const { createClient, updateClient, isCreating, isUpdating } = useClients();
  const [clientForm, setClientForm] = useState<ClientFormData>(getInitialFormData(editingClient));

  const resetForm = () => {
    setClientForm(getInitialFormData());
  };

  const saveClient = async (onSuccess: () => void) => {
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

      onSuccess();
      resetForm();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return {
    clientForm,
    setClientForm,
    saveClient,
    isLoading,
    resetForm
  };
};
